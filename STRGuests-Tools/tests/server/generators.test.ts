import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Integration tests for /api/generate-listing, /api/generate-review, /api/generate-message.
 *
 * Mocks:
 *   - openai SDK (no live API calls)
 *   - mysql2 (rate_limits counter + generation_logs records)
 *
 * Direct handler calls instead of supertest — the handlers are pure (req, res) functions
 * so we synthesize minimal req/res objects with the fields they read.
 */

const dbState: { counters: Map<string, number>; logs: any[][] } = {
  counters: new Map(),
  logs: [],
};

vi.mock('openai', () => {
  let responseQueue: Array<() => Promise<any>> = [];
  let callCount = 0;
  class OpenAI {
    chat: { completions: { create: (...args: any[]) => Promise<any> } };
    constructor() {
      this.chat = {
        completions: {
          create: vi.fn(async () => {
            callCount++;
            const next = responseQueue.shift() ?? (async () => ({
              choices: [{ message: { content: 'STUB OUTPUT' } }],
              usage: { prompt_tokens: 11, completion_tokens: 7 },
              model: 'gpt-4o-mini-2024-07-18',
            }));
            return next();
          }),
        },
      };
    }
  }
  (OpenAI as any).__queue = (fn: () => Promise<any>) => responseQueue.push(fn);
  (OpenAI as any).__calls = () => callCount;
  (OpenAI as any).__reset = () => { responseQueue = []; callCount = 0; };
  return { default: OpenAI };
});

function counterKey(params: any[]): string {
  const [k, _e, tool, bucket, win] = params;
  return `${k}|${tool}|${bucket}|${new Date(win).toISOString()}`;
}

vi.mock('mysql2/promise', () => {
  const exec = async (sql: string, params: any[] = []) => {
    if (/INSERT INTO rate_limits/i.test(sql)) {
      const k = counterKey(params);
      dbState.counters.set(k, (dbState.counters.get(k) ?? 0) + 1);
      return [{ affectedRows: 1 }, []];
    }
    if (/^SELECT count FROM rate_limits/i.test(sql)) {
      const k = [params[0], params[1], params[2], new Date(params[3]).toISOString()].join('|');
      return [[{ count: dbState.counters.get(k) ?? 0 }], []];
    }
    if (/INSERT INTO generation_logs/i.test(sql)) {
      dbState.logs.push(params);
      return [{ affectedRows: 1 }, []];
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
  dbState.counters = new Map();
  dbState.logs = [];
  process.env.OPENAI_API_KEY = 'test-key';
  process.env.IP_HASH_SALT = 'salty';
  process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef';
  vi.resetModules();
  const db = await import('../../server/lib/db');
  await db.closePool();
  const oc = await import('../../server/lib/openai-client');
  oc.resetOpenAiClient();
  const mod: any = (await import('openai')).default;
  if (mod.__reset) mod.__reset();
});

function makeReq(body: any, opts: { ip?: string } = {}): any {
  return {
    body,
    headers: { 'x-forwarded-for': opts.ip ?? '5.5.5.5' },
    ip: opts.ip ?? '5.5.5.5',
    socket: { remoteAddress: opts.ip ?? '5.5.5.5' },
  };
}
function makeRes(): any {
  const calls: { status: number; body: any } = { status: 200, body: null };
  const res: any = {
    locals: {},
    status: (n: number) => { calls.status = n; return res; },
    json: (b: any) => { calls.body = b; return res; },
    setHeader: vi.fn(),
    redirect: vi.fn(),
    _calls: calls,
  };
  return res;
}

async function runRoute(middleware: any, handler: any, req: any, res: any): Promise<void> {
  // Run middleware. If it calls next(), the handler runs to completion. If it short-circuits
  // (e.g. 429 from rate-limit), we still resolve once the middleware promise settles.
  await new Promise<void>((resolve) => {
    let nextCalled = false;
    const next = async () => {
      nextCalled = true;
      try { await handler(req, res); } finally { resolve(); }
    };
    Promise.resolve(middleware(req, res, next)).then(() => {
      if (!nextCalled) resolve();
    });
  });
}

describe('POST /api/generate-listing', () => {
  it('200s with valid input + logs to generation_logs', async () => {
    const { generateListingMiddleware, generateListingHandler } = await import('../../server/routes/generate-listing');
    const req = makeReq({
      propertyType: '2BR cabin',
      location: 'Asheville, NC',
      amenities: ['hot tub', 'fire pit'],
      vibe: 'hospitable',
    });
    const res = makeRes();
    await runRoute(generateListingMiddleware, generateListingHandler, req, res);
    expect(res._calls.status).toBe(200);
    expect(res._calls.body.result).toBe('STUB OUTPUT');
    expect(res._calls.body.remaining).toBe(4); // 5/hr cap minus 1 spent
    expect(dbState.logs).toHaveLength(1);
    expect(dbState.logs[0][2]).toBe('listing-description'); // tool_slug
    expect(dbState.logs[0][3]).toBe('gpt-4o-mini-2024-07-18'); // model
    expect(dbState.logs[0][8]).toBe('ok'); // status
  });

  it('400s on invalid vibe', async () => {
    const { generateListingMiddleware, generateListingHandler } = await import('../../server/routes/generate-listing');
    const req = makeReq({
      propertyType: '2BR cabin',
      location: 'Asheville, NC',
      amenities: [],
      vibe: 'bombastic', // not in enum
    });
    const res = makeRes();
    await runRoute(generateListingMiddleware, generateListingHandler, req, res);
    expect(res._calls.status).toBe(400);
    expect(res._calls.body.error).toBe('invalid_input');
  });

  it('429s on 6th anon request from the same IP', async () => {
    const { generateListingMiddleware, generateListingHandler } = await import('../../server/routes/generate-listing');
    const body = { propertyType: 'studio', location: 'Boise', amenities: [], vibe: 'professional' };
    for (let i = 0; i < 5; i++) {
      await runRoute(generateListingMiddleware, generateListingHandler, makeReq(body, { ip: '8.8.8.8' }), makeRes());
    }
    const final = makeRes();
    await runRoute(generateListingMiddleware, generateListingHandler, makeReq(body, { ip: '8.8.8.8' }), final);
    expect(final._calls.status).toBe(429);
    expect(final._calls.body.error).toBe('rate_limited');
    expect(final._calls.body.upgradeHint).toMatch(/Verify your email/);
  });

  it('502s on upstream error + logs status=openai_error', async () => {
    const oc: any = (await import('openai')).default;
    oc.__queue(async () => {
      const err: any = new Error('boom');
      err.status = 500;
      throw err;
    });
    oc.__queue(async () => { const e: any = new Error('boom'); e.status = 500; throw e; });
    oc.__queue(async () => { const e: any = new Error('boom'); e.status = 500; throw e; });
    const { generateListingMiddleware, generateListingHandler } = await import('../../server/routes/generate-listing');
    const req = makeReq({ propertyType: 's', location: 'L', amenities: [], vibe: 'casual' as any });
    const res = makeRes();
    await runRoute(generateListingMiddleware, generateListingHandler, req, res);
    // 'casual' isn't a valid vibe, so validation catches it first. Re-test with valid vibe:
    const req2 = makeReq({ propertyType: 's', location: 'L', amenities: [], vibe: 'professional' });
    const res2 = makeRes();
    await runRoute(generateListingMiddleware, generateListingHandler, req2, res2);
    expect(res2._calls.status).toBe(502);
    expect(res2._calls.body.error).toBe('upstream_error');
    const errorLog = dbState.logs.find((l) => l[8] === 'openai_error');
    expect(errorLog).toBeDefined();
  });
});

describe('POST /api/generate-review', () => {
  it('rejects unknown starVariant', async () => {
    const { generateReviewMiddleware, generateReviewHandler } = await import('../../server/routes/generate-review');
    const req = makeReq({ starVariant: '6_star', reviewText: 'great place' });
    const res = makeRes();
    await runRoute(generateReviewMiddleware, generateReviewHandler, req, res);
    expect(res._calls.status).toBe(400);
  });

  it('accepts 5_star variant + records under "review-response" tool_slug', async () => {
    const { generateReviewMiddleware, generateReviewHandler } = await import('../../server/routes/generate-review');
    const req = makeReq({ starVariant: '5_star', reviewText: 'Loved the hot tub at sunset' });
    const res = makeRes();
    await runRoute(generateReviewMiddleware, generateReviewHandler, req, res);
    expect(res._calls.status).toBe(200);
    expect(dbState.logs[0][2]).toBe('review-response');
  });
});

describe('POST /api/generate-message', () => {
  it('rejects unknown stage', async () => {
    const { generateMessageMiddleware, generateMessageHandler } = await import('../../server/routes/generate-message');
    const req = makeReq({ stage: 'sometime', tone: 'warm' });
    const res = makeRes();
    await runRoute(generateMessageMiddleware, generateMessageHandler, req, res);
    expect(res._calls.status).toBe(400);
  });

  it('accepts a valid pre_arrival + warm + records "guest-messages" tool_slug', async () => {
    const { generateMessageMiddleware, generateMessageHandler } = await import('../../server/routes/generate-message');
    const req = makeReq({ stage: 'pre_arrival', tone: 'warm', context: 'Mountain cabin with hot tub' });
    const res = makeRes();
    await runRoute(generateMessageMiddleware, generateMessageHandler, req, res);
    expect(res._calls.status).toBe(200);
    expect(dbState.logs[0][2]).toBe('guest-messages');
  });
});

describe('GET /api/rate-limit-status', () => {
  it('returns unverified tier + 5 remaining on a fresh visitor', async () => {
    const { rateLimitStatus } = await import('../../server/routes/rate-limit-status');
    const req = { query: { tool: 'listing-description' }, headers: { 'x-forwarded-for': '4.4.4.4' }, ip: '4.4.4.4', socket: {} };
    const res = makeRes();
    await rateLimitStatus(req as any, res);
    expect(res._calls.body.tier).toBe('unverified');
    expect(res._calls.body.remaining).toBe(5);
    expect(res._calls.body.limit).toBe(5);
  });

  it('400s on unknown tool slug', async () => {
    const { rateLimitStatus } = await import('../../server/routes/rate-limit-status');
    const req = { query: { tool: 'not-a-tool' }, headers: {}, ip: '4.4.4.4', socket: {} };
    const res = makeRes();
    await rateLimitStatus(req as any, res);
    expect(res._calls.status).toBe(400);
  });
});
