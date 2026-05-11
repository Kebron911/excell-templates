import { describe, it, expect, vi, beforeEach } from 'vitest';

interface QueryCall {
  sql: string;
  params: any[];
}

// Counter state — the mock DB keeps an in-memory map of (ip_hash, tool_slug, bucket, window_start) → count.
const state: {
  calls: QueryCall[];
  counters: Map<string, number>;
} = {
  calls: [],
  counters: new Map(),
};

function counterKey(params: any[]): string {
  // params for INSERT: [indexKey, email|null, toolSlug, bucket, windowStartDate]
  // params for SELECT: [indexKey, toolSlug, bucket, windowStartDate]
  if (params.length >= 5) {
    const [k, _email, tool, bucket, win] = params;
    return `${k}|${tool}|${bucket}|${new Date(win).toISOString()}`;
  }
  const [k, tool, bucket, win] = params;
  return `${k}|${tool}|${bucket}|${new Date(win).toISOString()}`;
}

vi.mock('mysql2/promise', () => {
  const exec = async (sql: string, params: any[] = []) => {
    state.calls.push({ sql, params });
    if (/INSERT INTO rate_limits/i.test(sql)) {
      const k = counterKey(params);
      state.counters.set(k, (state.counters.get(k) ?? 0) + 1);
      return [{ affectedRows: 1 }, []];
    }
    if (/^SELECT count FROM rate_limits/i.test(sql)) {
      const k = counterKey(params);
      const count = state.counters.get(k) ?? 0;
      return [[{ count }], []];
    }
    return [[], []];
  };
  const pool = { execute: exec, end: async () => {} };
  return {
    default: { createPool: () => pool },
    createPool: () => pool,
  };
});

beforeEach(async () => {
  state.calls = [];
  state.counters = new Map();
  process.env.IP_HASH_SALT = 'test-salt-123';
  process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef';
  vi.resetModules();
  const db = await import('../../server/lib/db');
  await db.closePool();
});

function makeReq(opts: { ip?: string; cookie?: string } = {}): any {
  return {
    headers: {
      'x-forwarded-for': opts.ip,
      cookie: opts.cookie,
    },
    socket: { remoteAddress: opts.ip ?? '127.0.0.1' },
    ip: opts.ip ?? '127.0.0.1',
  };
}

describe('rate-limit', () => {
  it('ipHash is deterministic + salt-sensitive (no raw IPs in DB)', async () => {
    const { ipHash } = await import('../../server/lib/rate-limit');
    const h1 = ipHash('1.2.3.4');
    const h2 = ipHash('1.2.3.4');
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
    expect(h1.includes('1.2.3.4')).toBe(false);

    process.env.IP_HASH_SALT = 'a-different-salt';
    vi.resetModules();
    const mod = await import('../../server/lib/rate-limit');
    expect(mod.ipHash('1.2.3.4')).not.toBe(h1);
  });

  it('anon IP hits 5/hour cap on the 6th request', async () => {
    const { consume } = await import('../../server/lib/rate-limit');
    const req = makeReq({ ip: '9.9.9.9' });
    for (let i = 1; i <= 5; i++) {
      const s = await consume(req, 'listing');
      expect(s.allowed).toBe(true);
      expect(s.scope).toBe('ip');
      expect(s.bucket).toBe('hour');
      expect(s.remaining).toBe(5 - i);
    }
    const sixth = await consume(req, 'listing');
    expect(sixth.allowed).toBe(false);
    expect(sixth.remaining).toBe(0);
    expect(sixth.count).toBe(6);
  });

  it('verified email hits 50/day cap on the 51st request', async () => {
    process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef';
    vi.resetModules();
    const { buildCookieValue, COOKIE_NAME } = await import('../../server/lib/verified-cookie');
    const cookie = `${COOKIE_NAME}=${encodeURIComponent(buildCookieValue('verified@example.com'))}`;
    const { consume } = await import('../../server/lib/rate-limit');
    const req = makeReq({ ip: '9.9.9.9', cookie });
    for (let i = 1; i <= 50; i++) {
      const s = await consume(req, 'listing');
      expect(s.allowed).toBe(true);
      expect(s.scope).toBe('email');
      expect(s.bucket).toBe('day');
      expect(s.remaining).toBe(50 - i);
    }
    const overflow = await consume(req, 'listing');
    expect(overflow.allowed).toBe(false);
    expect(overflow.scope).toBe('email');
  });

  it('separate tools have independent counters', async () => {
    const { consume } = await import('../../server/lib/rate-limit');
    const req = makeReq({ ip: '8.8.8.8' });
    for (let i = 0; i < 5; i++) await consume(req, 'listing');
    // 'review' tool counter is fresh — first call allowed.
    const first = await consume(req, 'review');
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(4);
  });

  it('separate IPs have independent counters', async () => {
    const { consume } = await import('../../server/lib/rate-limit');
    for (let i = 0; i < 5; i++) await consume(makeReq({ ip: '1.1.1.1' }), 'listing');
    const otherIp = await consume(makeReq({ ip: '2.2.2.2' }), 'listing');
    expect(otherIp.allowed).toBe(true);
    expect(otherIp.remaining).toBe(4);
  });

  it('middleware 429s when exhausted with upgradeHint for anon scope', async () => {
    const { rateLimitMiddleware, consume } = await import('../../server/lib/rate-limit');
    const req = makeReq({ ip: '7.7.7.7' });
    for (let i = 0; i < 5; i++) await consume(req, 'listing');

    const res: any = {
      locals: {},
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();
    await rateLimitMiddleware('listing')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('rate_limited');
    expect(body.scope).toBe('ip');
    expect(body.upgradeHint).toMatch(/Verify your email/);
    expect(next).not.toHaveBeenCalled();
  });

  it('middleware calls next() and stamps res.locals.rateState when allowed', async () => {
    const { rateLimitMiddleware } = await import('../../server/lib/rate-limit');
    const req = makeReq({ ip: '6.6.6.6' });
    const res: any = { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    const next = vi.fn();
    await rateLimitMiddleware('listing')(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.locals.rateState.allowed).toBe(true);
    expect(res.locals.rateState.remaining).toBe(4);
  });

  it('bucketWindowStart floors to top-of-hour (UTC) for hour, midnight for day', async () => {
    const { bucketWindowStart } = await import('../../server/lib/rate-limit');
    const t = new Date('2026-05-11T14:37:21.500Z');
    expect(bucketWindowStart('hour', t).toISOString()).toBe('2026-05-11T14:00:00.000Z');
    expect(bucketWindowStart('day', t).toISOString()).toBe('2026-05-11T00:00:00.000Z');
  });
});
