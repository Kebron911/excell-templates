/**
 * Signed verified-email cookie. Set by /api/verify-email/confirm; read by
 * the rate-limit middleware to bump the visitor into the `verified` tier.
 *
 * Format: `${email}.${hmac(email)}` — minimal, signed, NOT encrypted (the
 * email is intentionally readable; this isn't a secret, it's a claim).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';

export const COOKIE_NAME = 'sg_verified';
const COOKIE_TTL_S = 30 * 24 * 60 * 60; // 30 days

function secret(): string {
  return process.env.EMAIL_VERIFY_SECRET ?? '';
}

function sign(email: string): string {
  return createHmac('sha256', secret()).update(email).digest('hex');
}

export function buildCookie(email: string): string {
  const value = `${email}.${sign(email)}`;
  return serializeCookie(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_TTL_S,
  });
}

export function clearCookie(): string {
  return serializeCookie(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function readVerifiedEmail(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const jar = parseCookie(cookieHeader);
  const raw = jar[COOKIE_NAME];
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot < 1) return null;
  const email = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(email);
  if (sig.length !== expected.length) return null;
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  return email;
}
