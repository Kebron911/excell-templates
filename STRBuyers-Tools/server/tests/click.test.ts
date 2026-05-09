import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock @/db. The mock factory must be self-contained (no closure access)
// because vi.mock is hoisted to the top of the file. The recording array
// is exposed as a named export and re-imported below.
vi.mock('@/db', () => {
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  let nextErr: Error | null = null;
  return {
    query: vi.fn(async (sql: string, params: unknown[]) => {
      calls.push({ sql, params });
      if (nextErr) {
        const e = nextErr;
        nextErr = null;
        throw e;
      }
      return [];
    }),
    getPool: vi.fn(),
    closePool: vi.fn(async () => {}),
    __calls: calls,
    __setNextError: (e: Error) => {
      nextErr = e;
    },
  };
});

import { createApp } from '@/index';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbMock = (await import('@/db')) as any;

const app = createApp();

describe('POST /api/click', () => {
  beforeEach(() => {
    dbMock.__calls.length = 0;
  });

  it('accepts a valid canonical payload and returns 204', async () => {
    const res = await request(app)
      .post('/api/click')
      .send({
        vendorId: 'visio',
        toolId: 'dscr-calculator',
        utm: { source: 'strbuyers-tools', medium: 'affiliate', campaign: 'dscr' },
        referrer: 'https://strbuyers.tools/dscr-loan-calculator',
      });

    expect(res.status).toBe(204);
    expect(dbMock.__calls.length).toBe(1);
    const call = dbMock.__calls[0];
    expect(call.sql).toMatch(/INSERT INTO click_logs/i);
    expect(call.params[0]).toBe('visio');
    expect(call.params[1]).toBe('dscr-calculator');
    expect(call.params[2]).toBe('strbuyers-tools');
    expect(call.params[3]).toBe('affiliate');
    expect(call.params[4]).toBe('dscr');
    // ip_hash is sha256 hex (64 chars)
    expect(call.params[7]).toMatch(/^[a-f0-9]{64}$/);
  });

  it('accepts the legacy AffiliateBlock payload {vendor, tool, utm_*}', async () => {
    const res = await request(app)
      .post('/api/click')
      .send({
        vendor: 'kiavi',
        tool: 'down-payment-calculator',
        category: 'lender',
        utm_source: 'strbuyers-tools',
        utm_medium: 'affiliate',
        utm_content: 'down-payment-calculator',
        ts: 1714000000000,
      });

    expect(res.status).toBe(204);
    expect(dbMock.__calls.length).toBe(1);
    const call = dbMock.__calls[0];
    expect(call.params[0]).toBe('kiavi');
    expect(call.params[1]).toBe('down-payment-calculator');
    expect(call.params[2]).toBe('strbuyers-tools');
    expect(call.params[3]).toBe('affiliate');
  });

  it('rejects missing vendor + tool with 400', async () => {
    const res = await request(app).post('/api/click').send({ utm: { source: 'foo' } });
    expect(res.status).toBe(400);
    expect(dbMock.__calls.length).toBe(0);
  });

  it('rejects oversize string fields with 400', async () => {
    const res = await request(app)
      .post('/api/click')
      .send({ vendorId: 'a'.repeat(200), toolId: 'dscr-calculator' });
    expect(res.status).toBe(400);
    expect(dbMock.__calls.length).toBe(0);
  });

  it('rejects unknown extra fields with 400 (zod strict mode)', async () => {
    const res = await request(app)
      .post('/api/click')
      .send({ vendorId: 'visio', toolId: 'dscr-calculator', evilField: 'x' });
    expect(res.status).toBe(400);
    expect(dbMock.__calls.length).toBe(0);
  });

  it('returns 204 even when DB insert throws — clicks must not block UX', async () => {
    dbMock.__setNextError(new Error('connection refused'));
    const res = await request(app)
      .post('/api/click')
      .send({ vendorId: 'visio', toolId: 'dscr-calculator' });
    expect(res.status).toBe(204);
  });
});

describe('GET /api/health', () => {
  it('returns ok without touching the DB', async () => {
    dbMock.__calls.length = 0;
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(dbMock.__calls.length).toBe(0);
  });
});
