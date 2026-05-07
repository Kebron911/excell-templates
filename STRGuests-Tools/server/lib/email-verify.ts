/**
 * Email verification flow.
 *
 * issueToken(email) → opaque base64url(emailLen.email.nonce.hmac), stored as
 * { email, token_hash = sha256(token), nonce, expires_at } in email_verifications.
 * verifyToken(token) → { ok, email } via constant-time compare against the row.
 *
 * No real SMTP send in Phase 3 — the route logs `[email-verify] would send to
 * <masked>` so the flow is exercisable end-to-end without a provider account.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getSecret(): string {
  const s = process.env.EMAIL_VERIFY_SECRET;
  if (!s || s.length < 16) {
    throw new Error('EMAIL_VERIFY_SECRET must be set (≥16 chars).');
  }
  return s;
}

function hmac(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Buffer {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
}

export interface IssuedToken {
  token: string;
  tokenHash: string;
  nonce: string;
  expiresAt: Date;
  email: string;
}

export function issueToken(emailRaw: string): IssuedToken {
  const email = emailRaw.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new Error('invalid_email');
  }
  const nonce = randomBytes(16).toString('hex');
  const sig = hmac(`${email}.${nonce}`);
  const token = b64url(Buffer.from(`${email}|${nonce}|${sig}`, 'utf-8'));
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  return { token, tokenHash, nonce, expiresAt, email };
}

export function verifyToken(token: string): { ok: boolean; email?: string } {
  try {
    const decoded = fromB64url(token).toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 3) return { ok: false };
    const [email, nonce, sig] = parts as [string, string, string];
    const expected = hmac(`${email}.${nonce}`);
    if (sig.length !== expected.length) return { ok: false };
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return { ok: false };
    if (!timingSafeEqual(a, b)) return { ok: false };
    return { ok: true, email };
  } catch {
    return { ok: false };
  }
}

export function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 1) return '***';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.length <= 2 ? local[0]! + '*' : local[0]! + '***' + local[local.length - 1];
  return `${visible}@${domain}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s.trim().toLowerCase());
}
