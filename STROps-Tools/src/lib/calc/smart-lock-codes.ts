/**
 * Smart-lock code generator — deterministic.
 *
 * `(bookingId, secret, digits)` → fixed N-digit numeric code via HMAC-SHA-256
 * mod 10^digits. Same input always produces the same code; different inputs
 * (booking or secret) produce different codes.
 *
 * Two paths:
 *   - `codeFor()` (Node, sync) — uses `node:crypto`. Used by Vitest tests
 *     and by any future server-side workflow.
 *   - `codeForAsync()` (browser) — uses `crypto.subtle`. Used by the React
 *     island (browsers don't expose sync HMAC).
 *
 * Digit length is clamped to 4..8.
 */

export interface CodeInput {
  bookingId: string;
  secret: string;
  digits: number;
}

export interface BatchInput {
  bookings: string[];
  secret: string;
  digits: number;
}

function clampDigits(n: number): number {
  const clamped = Math.max(4, Math.min(8, Math.trunc(n)));
  return clamped;
}

function bytesToCode(bytes: Uint8Array, digits: number): string {
  let n = 0n;
  for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(bytes[i]);
  n = n & ((1n << 63n) - 1n);
  const mod = 10n ** BigInt(digits);
  return (n % mod).toString().padStart(digits, '0');
}

export function codeFor(opts: CodeInput): string {
  const digits = clampDigits(opts.digits);
  if (typeof process !== 'undefined' && process.versions?.node) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createHmac } = require('node:crypto') as typeof import('node:crypto');
    const bytes = new Uint8Array(createHmac('sha256', opts.secret).update(opts.bookingId).digest());
    return bytesToCode(bytes, digits);
  }
  throw new Error('codeFor requires Node crypto; use codeForAsync in the browser');
}

export function batchCodes(input: BatchInput): { bookingId: string; code: string }[] {
  return input.bookings.map(bookingId => ({
    bookingId,
    code: codeFor({ bookingId, secret: input.secret, digits: input.digits }),
  }));
}

export async function codeForAsync(opts: CodeInput): Promise<string> {
  const digits = clampDigits(opts.digits);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(opts.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(opts.bookingId)));
  return bytesToCode(sig, digits);
}
