/**
 * Email verification — HMAC-token flow.
 *
 * Flow:
 *   1. Visitor POSTs email to /api/verify-email/start
 *   2. We generate a 32-byte nonce, compute token_hash = HMAC-SHA256(email||nonce, EMAIL_VERIFY_SECRET),
 *      INSERT a row into email_verifications, then deliver a link containing { email, nonce } to the user.
 *   3. User clicks link → GET /api/verify-email/confirm — we recompute HMAC, lookup row by (email, nonce),
 *      confirm not-expired + not-already-verified, then set verified_at = NOW() and issue a signed cookie.
 *
 * Why this shape:
 *   - The nonce is the only secret the user holds; token_hash never leaves the DB.
 *   - HMAC comparison is constant-time (timingSafeEqual) so a stolen nonce can't be brute-forced.
 *   - The signed cookie (verifiedCookie.ts) is the runtime auth that rate-limit middleware checks.
 *
 * Limits:
 *   - 24h token TTL.
 *   - One row per (email, nonce). Re-requesting verification mints a new nonce — old rows expire naturally.
 */

import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { query, queryOne } from './db';

const TOKEN_TTL_HOURS = 24;
const NONCE_BYTES = 16; // 32 hex chars

function getSecret(): string {
  const s = process.env.EMAIL_VERIFY_SECRET;
  if (!s || s.length < 32) {
    throw new Error('EMAIL_VERIFY_SECRET must be set (32+ chars)');
  }
  return s;
}

export function isValidEmail(email: string): boolean {
  // Liberal: anything with one @ and a dot in the domain. Detailed validation lives at the form layer.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

export function hmacToken(email: string, nonce: string): string {
  return createHmac('sha256', getSecret()).update(`${email.toLowerCase()}|${nonce}`).digest('hex');
}

export interface MintResult {
  nonce: string;
  expiresAt: Date;
}

/**
 * Records a verification attempt and returns the nonce the caller must email to the user.
 */
export async function startVerification(email: string): Promise<MintResult> {
  if (!isValidEmail(email)) throw new Error('invalid_email');
  const nonce = randomBytes(NONCE_BYTES).toString('hex');
  const tokenHash = hmacToken(email, nonce);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);
  await query(
    'INSERT INTO email_verifications (email, token_hash, nonce, expires_at) VALUES (?, ?, ?, ?)',
    [email.toLowerCase(), tokenHash, nonce, expiresAt],
  );
  return { nonce, expiresAt };
}

export type ConfirmStatus = 'ok' | 'expired' | 'already_verified' | 'invalid' | 'unknown';

/**
 * Confirms a verification token. Returns 'ok' iff a matching, unexpired, not-already-verified row exists.
 */
export async function confirmVerification(email: string, nonce: string): Promise<ConfirmStatus> {
  if (!isValidEmail(email)) return 'invalid';
  if (!/^[a-f0-9]{32}$/.test(nonce)) return 'invalid';
  const expected = hmacToken(email, nonce);
  const row = await queryOne<{
    id: number;
    token_hash: string;
    verified_at: Date | null;
    expires_at: Date;
  }>(
    'SELECT id, token_hash, verified_at, expires_at FROM email_verifications WHERE email = ? AND nonce = ? LIMIT 1',
    [email.toLowerCase(), nonce],
  );
  if (!row) return 'unknown';

  // Constant-time HMAC compare — defends against a stolen-nonce timing oracle.
  const a = Buffer.from(row.token_hash, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 'invalid';

  if (row.verified_at) return 'already_verified';
  if (new Date(row.expires_at).getTime() < Date.now()) return 'expired';

  await query('UPDATE email_verifications SET verified_at = NOW() WHERE id = ?', [row.id]);
  return 'ok';
}

export const __test = {
  TOKEN_TTL_HOURS,
  hmacToken,
};
