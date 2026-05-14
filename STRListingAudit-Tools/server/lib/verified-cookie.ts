/**
 * Signed verified-email cookie. Forked from STRGuests-Tools/server/lib/verified-cookie.ts.
 * Only difference: cookie name is `la-verified-email` (la = listingaudit).
 *
 * After a user confirms their email, we set
 *   `la-verified-email=<email>.<sig>`
 * where `sig = HMAC-SHA256(email, EMAIL_VERIFY_SECRET)`.
 */

import { createHmac } from 'node:crypto';
import type { Request } from 'express';

export const COOKIE_NAME = 'la-verified-email';
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function sign(email: string): string {
  const secret = process.env.EMAIL_VERIFY_SECRET;
  if (!secret) throw new Error('EMAIL_VERIFY_SECRET not set');
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex');
}

export function buildCookieValue(email: string): string {
  return `${email.toLowerCase()}.${sign(email)}`;
}

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
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0 ? email : null;
  } catch {
    return null;
  }
}
