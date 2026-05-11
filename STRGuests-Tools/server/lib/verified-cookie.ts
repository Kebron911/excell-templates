/**
 * Signed verified-email cookie.
 *
 * After a user confirms their email, we set `sg-verified-email=<email>.<sig>` where
 * `sig = HMAC-SHA256(email, EMAIL_VERIFY_SECRET)`. The rate-limit middleware reads
 * this cookie to upgrade the visitor to the verified tier (50/day instead of 5/hour).
 *
 * Why this shape:
 *   - Stateless — no DB hit on every generator request.
 *   - Signed — visitor can't forge another email; the secret never leaves the server.
 *   - Same secret as email-verify.ts — single rotation point.
 */

import { createHmac } from 'node:crypto';
import type { Request } from 'express';

export const COOKIE_NAME = 'sg-verified-email';
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sign(email: string): string {
  const secret = process.env.EMAIL_VERIFY_SECRET;
  if (!secret) throw new Error('EMAIL_VERIFY_SECRET not set');
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex');
}

export function buildCookieValue(email: string): string {
  return `${email.toLowerCase()}.${sign(email)}`;
}

/**
 * Express Set-Cookie header builder. We bypass any cookie-parser dep — just emit the header directly.
 */
export function buildSetCookieHeader(email: string, opts: { secure?: boolean } = {}): string {
  const value = buildCookieValue(email);
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.floor(COOKIE_MAX_AGE_MS / 1000)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (opts.secure) parts.push('Secure');
  return parts.join('; ');
}

/**
 * Reads the verified-email cookie from a request and returns the email if the signature is valid.
 * Returns null on missing / malformed / forged cookies.
 */
export function readVerifiedEmail(req: Request): string | null {
  const header = req.headers?.cookie;
  if (!header) return null;
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(header);
  if (!m) return null;
  const raw = decodeURIComponent(m[1]);
  const dot = raw.lastIndexOf('.');
  if (dot < 0) return null;
  const email = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  try {
    const expected = sign(email);
    if (expected.length !== sig.length) return null;
    // Constant-time compare via a manual loop — avoids Buffer.from variance on bad input.
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0 ? email : null;
  } catch {
    return null;
  }
}
