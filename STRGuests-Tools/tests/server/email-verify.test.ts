import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Email verification flow tests.
 *
 * We mock mysql2/promise so no real DB is hit — the mock records every query
 * and the test can inspect SQL + params, or pre-seed return rows for SELECTs.
 */

interface QueryCall {
  sql: string;
  params: any[];
}
const state: { calls: QueryCall[]; selectRows: any[][]; updates: number } = {
  calls: [],
  selectRows: [],
  updates: 0,
};

vi.mock('mysql2/promise', () => {
  const exec = async (sql: string, params: any[] = []) => {
    state.calls.push({ sql, params });
    if (/^SELECT/i.test(sql)) {
      const rows = state.selectRows.shift() ?? [];
      return [rows, []];
    }
    if (/^UPDATE/i.test(sql)) state.updates++;
    return [{ affectedRows: 1, insertId: state.calls.length }, []];
  };
  const pool = { execute: exec, end: async () => {} };
  return {
    default: { createPool: () => pool },
    createPool: () => pool,
  };
});

beforeEach(async () => {
  state.calls = [];
  state.selectRows = [];
  state.updates = 0;
  process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef'; // 32 chars
  vi.resetModules();
  const db = await import('../../server/lib/db');
  await db.closePool();
});

describe('email-verify', () => {
  it('isValidEmail accepts / rejects sane cases', async () => {
    const { isValidEmail } = await import('../../server/lib/email-verify');
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('host+filter@example.com')).toBe(true);
    expect(isValidEmail('no-at')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('startVerification inserts a row + returns nonce + expiresAt 24h ahead', async () => {
    const { startVerification } = await import('../../server/lib/email-verify');
    const before = Date.now();
    const { nonce, expiresAt } = await startVerification('Host@Example.com');
    expect(nonce).toMatch(/^[a-f0-9]{32}$/);
    expect(expiresAt.getTime()).toBeGreaterThan(before + 23 * 60 * 60 * 1000);

    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call.sql).toMatch(/INSERT INTO email_verifications/);
    expect(call.params[0]).toBe('host@example.com'); // normalized to lowercase
    expect(call.params[2]).toBe(nonce);
  });

  it('confirmVerification returns "ok" on a fresh matching row + UPDATEs verified_at', async () => {
    const { startVerification, confirmVerification, __test } = await import('../../server/lib/email-verify');
    const { nonce } = await startVerification('alice@example.com');
    state.selectRows.push([
      {
        id: 1,
        token_hash: __test.hmacToken('alice@example.com', nonce),
        verified_at: null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ]);
    const status = await confirmVerification('alice@example.com', nonce);
    expect(status).toBe('ok');
    expect(state.updates).toBe(1);
  });

  it('confirmVerification returns "expired" for a past expires_at', async () => {
    const { startVerification, confirmVerification, __test } = await import('../../server/lib/email-verify');
    const { nonce } = await startVerification('expired@example.com');
    state.selectRows.push([
      {
        id: 2,
        token_hash: __test.hmacToken('expired@example.com', nonce),
        verified_at: null,
        expires_at: new Date(Date.now() - 1000),
      },
    ]);
    const status = await confirmVerification('expired@example.com', nonce);
    expect(status).toBe('expired');
    expect(state.updates).toBe(0);
  });

  it('confirmVerification returns "already_verified" on replay', async () => {
    const { startVerification, confirmVerification, __test } = await import('../../server/lib/email-verify');
    const { nonce } = await startVerification('replay@example.com');
    state.selectRows.push([
      {
        id: 3,
        token_hash: __test.hmacToken('replay@example.com', nonce),
        verified_at: new Date(),
        expires_at: new Date(Date.now() + 60_000),
      },
    ]);
    const status = await confirmVerification('replay@example.com', nonce);
    expect(status).toBe('already_verified');
    expect(state.updates).toBe(0);
  });

  it('confirmVerification returns "invalid" on tampered nonce', async () => {
    const { startVerification, confirmVerification, __test } = await import('../../server/lib/email-verify');
    const { nonce } = await startVerification('tamper@example.com');
    // Row exists but token_hash was computed for a DIFFERENT email — HMAC must reject.
    state.selectRows.push([
      {
        id: 4,
        token_hash: __test.hmacToken('attacker@example.com', nonce),
        verified_at: null,
        expires_at: new Date(Date.now() + 60_000),
      },
    ]);
    const status = await confirmVerification('tamper@example.com', nonce);
    expect(status).toBe('invalid');
    expect(state.updates).toBe(0);
  });

  it('confirmVerification returns "unknown" when no row matches', async () => {
    const { confirmVerification } = await import('../../server/lib/email-verify');
    state.selectRows.push([]);
    const status = await confirmVerification('nobody@example.com', '0'.repeat(32));
    expect(status).toBe('unknown');
  });

  it('refuses to mint a token when EMAIL_VERIFY_SECRET is missing', async () => {
    delete process.env.EMAIL_VERIFY_SECRET;
    vi.resetModules();
    const { startVerification } = await import('../../server/lib/email-verify');
    await expect(startVerification('a@b.co')).rejects.toThrow(/EMAIL_VERIFY_SECRET/);
  });
});

describe('verified-cookie', () => {
  it('round-trips through buildCookieValue + readVerifiedEmail', async () => {
    process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef';
    vi.resetModules();
    const { buildCookieValue, COOKIE_NAME, readVerifiedEmail } = await import('../../server/lib/verified-cookie');
    const cookieValue = buildCookieValue('roundtrip@example.com');
    const fakeReq: any = { headers: { cookie: `other=1; ${COOKIE_NAME}=${encodeURIComponent(cookieValue)}` } };
    expect(readVerifiedEmail(fakeReq)).toBe('roundtrip@example.com');
  });

  it('rejects a cookie with a forged signature', async () => {
    process.env.EMAIL_VERIFY_SECRET = '0123456789abcdef0123456789abcdef';
    vi.resetModules();
    const { COOKIE_NAME, readVerifiedEmail } = await import('../../server/lib/verified-cookie');
    const forged = `attacker@example.com.${'0'.repeat(64)}`;
    const fakeReq: any = { headers: { cookie: `${COOKIE_NAME}=${encodeURIComponent(forged)}` } };
    expect(readVerifiedEmail(fakeReq)).toBe(null);
  });
});
