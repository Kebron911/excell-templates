import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const queryMock = vi.fn();
const queryOneMock = vi.fn();

vi.mock('../../../server/lib/db', () => ({
  query: (...args: unknown[]) => queryMock(...args),
  queryOne: (...args: unknown[]) => queryOneMock(...args),
}));

import { bucketWindow, readState, consume, rateLimit } from '../../../server/middleware/rate-limit';
import { buildCookie } from '../../../server/lib/verified-cookie';

const SECRET = 'a-test-secret-with-enough-bytes';
const SALT = 'salty-salt';

function makeReq(opts: { cookieHeader?: string; xff?: string } = {}) {
  return {
    headers: {
      cookie: opts.cookieHeader,
      'x-forwarded-for': opts.xff ?? '203.0.113.7',
    },
    socket: {},
  } as any;
}

describe('bucketWindow', () => {
  it('hour bucket starts on the top of the hour UTC', () => {
    const { start, end } = bucketWindow(new Date('2026-05-07T13:42:11.000Z'), 'hour');
    expect(start.toISOString()).toBe('2026-05-07T13:00:00.000Z');
    expect(end.toISOString()).toBe('2026-05-07T14:00:00.000Z');
  });

  it('day bucket starts at UTC midnight', () => {
    const { start, end } = bucketWindow(new Date('2026-05-07T13:42:11.000Z'), 'day');
    expect(start.toISOString()).toBe('2026-05-07T00:00:00.000Z');
    expect(end.toISOString()).toBe('2026-05-08T00:00:00.000Z');
  });
});

describe('rate-limit middleware', () => {
  beforeEach(() => {
    queryMock.mockReset();
    queryOneMock.mockReset();
    process.env.IP_HASH_SALT = SALT;
    process.env.EMAIL_VERIFY_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.IP_HASH_SALT;
    delete process.env.EMAIL_VERIFY_SECRET;
    delete process.env.NODE_ENV;
  });

  it('reads unverified tier when no cookie present', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 2 });
    const state = await readState(makeReq(), 'listing-description');
    expect(state.tier).toBe('unverified');
    expect(state.bucket).toBe('hour');
    expect(state.limit).toBe(5);
    expect(state.remaining).toBe(3);
    expect(state.email).toBeNull();
  });

  it('reads verified tier when signed cookie is present', async () => {
    const cookie = buildCookie('host@example.com').split(';')[0]!;
    queryOneMock.mockResolvedValueOnce({ count: 7 });
    const state = await readState(makeReq({ cookieHeader: cookie }), 'listing-description');
    expect(state.tier).toBe('verified');
    expect(state.bucket).toBe('day');
    expect(state.limit).toBe(50);
    expect(state.remaining).toBe(43);
    expect(state.email).toBe('host@example.com');
  });

  it('consume increments via UPSERT', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 1 });
    queryMock.mockResolvedValueOnce([]);
    const state = await readState(makeReq(), 'listing-description');
    const result = await consume(state, 'listing-description');
    expect(result.blocked).toBe(false);
    expect(result.remaining).toBe(3);
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock.mock.calls[0][0]).toMatch(/INSERT INTO rate_limits/);
    expect(queryMock.mock.calls[0][0]).toMatch(/ON DUPLICATE KEY UPDATE/);
  });

  it('consume blocks at the limit without persisting', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 5 });
    const state = await readState(makeReq(), 'listing-description');
    const result = await consume(state, 'listing-description');
    expect(result.blocked).toBe(true);
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('rateLimit() returns 429 when over the limit', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 5 });
    const handler = rateLimit('listing-description');
    const req = makeReq();
    const res: any = {
      statusCode: 200,
      headers: {},
      status(code: number) { this.statusCode = code; return this; },
      json(body: any) { this.body = body; return this; },
    };
    const next = vi.fn();
    await handler(req, res, next);
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('rate_limited');
    expect(next).not.toHaveBeenCalled();
  });

  it('rateLimit() attaches state and calls next when under the limit', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValueOnce([]);
    const handler = rateLimit('listing-description');
    const req = makeReq();
    const res: any = {
      status(code: number) { this.statusCode = code; return this; },
      json(body: any) { this.body = body; return this; },
    };
    const next = vi.fn();
    await handler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.rateLimit.remaining).toBe(4);
    expect(req.rateLimit.tier).toBe('unverified');
  });

  it('fails open in development when DB is unavailable', async () => {
    process.env.NODE_ENV = 'development';
    queryOneMock.mockRejectedValueOnce(new Error('db down'));
    const handler = rateLimit('listing-description');
    const req = makeReq();
    const res: any = {
      status(code: number) { this.statusCode = code; return this; },
      json(body: any) { this.body = body; return this; },
    };
    const next = vi.fn();
    await handler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('fails closed in production when DB is unavailable', async () => {
    process.env.NODE_ENV = 'production';
    queryOneMock.mockRejectedValueOnce(new Error('db down'));
    const handler = rateLimit('listing-description');
    const req = makeReq();
    const res: any = {
      status(code: number) { this.statusCode = code; return this; },
      json(body: any) { this.body = body; return this; },
    };
    const next = vi.fn();
    await handler(req, res, next);
    expect(res.statusCode).toBe(503);
    expect(next).not.toHaveBeenCalled();
  });
});
