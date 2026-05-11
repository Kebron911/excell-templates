import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submit } from '../src/submit.js';
import type { Pool } from '../src/db.js';

// Default mock: successful insert returning insertId 42
function makeMockPool(insertId = 42): Pool {
  return {
    execute: vi.fn().mockResolvedValue([{ insertId }, []]),
  } as unknown as Pool;
}

describe('submit — input validation', () => {
  let pool: Pool;

  beforeEach(() => {
    pool = makeMockPool();
  });

  it('accepts valid input and returns ok:true with id', async () => {
    const r = await submit({ siteId: 'guests', listSegment: 'main', email: 'a@b.co' }, pool);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.id).toBe(42);
  });

  it('rejects bad siteId', async () => {
    const r = await submit(
      { siteId: 'foo' as any, listSegment: 'main', email: 'a@b.co' },
      pool,
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/invalid_enum_value|Invalid enum/i);
  });

  it('rejects malformed email', async () => {
    const r = await submit(
      { siteId: 'guests', listSegment: 'main', email: 'not-an-email' },
      pool,
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/email/i);
  });

  it('rejects empty listSegment', async () => {
    const r = await submit({ siteId: 'guests', listSegment: '', email: 'a@b.co' }, pool);
    expect(r.ok).toBe(false);
  });

  it('rejects oversized email (> 254 chars)', async () => {
    const long = 'a'.repeat(246) + '@b.co'; // 252 chars — still valid length-wise; make it 255
    const r = await submit(
      { siteId: 'guests', listSegment: 'main', email: 'a'.repeat(250) + '@b.co' },
      pool,
    );
    expect(r.ok).toBe(false);
  });

  it('rejects oversized listSegment (> 64 chars)', async () => {
    const r = await submit(
      { siteId: 'guests', listSegment: 'x'.repeat(65), email: 'a@b.co' },
      pool,
    );
    expect(r.ok).toBe(false);
  });

  it('accepts all valid siteId values', async () => {
    const sites = ['guests', 'buyers', 'host', 'ops'] as const;
    for (const siteId of sites) {
      pool = makeMockPool();
      const r = await submit({ siteId, listSegment: 'main', email: 'a@b.co' }, pool);
      expect(r.ok, `siteId=${siteId} should be ok`).toBe(true);
    }
  });

  it('accepts optional source field', async () => {
    const r = await submit(
      { siteId: 'buyers', listSegment: 'waitlist', email: 'x@y.com', source: 'landing-page' },
      pool,
    );
    expect(r.ok).toBe(true);
  });

  it('rejects oversized source (> 128 chars)', async () => {
    const r = await submit(
      {
        siteId: 'guests',
        listSegment: 'main',
        email: 'a@b.co',
        source: 's'.repeat(129),
      },
      pool,
    );
    expect(r.ok).toBe(false);
  });

  it('does not call pool.execute when validation fails', async () => {
    const mockPool = makeMockPool();
    await submit({ siteId: 'bad' as any, listSegment: 'main', email: 'a@b.co' }, mockPool);
    expect((mockPool.execute as ReturnType<typeof vi.fn>).mock.calls.length).toBe(0);
  });

  it('returns ok:false when pool.execute rejects', async () => {
    const failPool = {
      execute: vi.fn().mockRejectedValue(new Error('connection refused')),
    } as unknown as Pool;
    const r = await submit({ siteId: 'guests', listSegment: 'main', email: 'a@b.co' }, failPool);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('connection refused');
  });
});
