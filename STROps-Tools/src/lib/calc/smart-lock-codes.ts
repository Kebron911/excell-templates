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

function hmacSha256Sync(secret: string, message: string): Uint8Array {
  // Sync version for tests via Node crypto.
  if (typeof process !== 'undefined' && process.versions?.node) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createHmac } = require('node:crypto') as typeof import('node:crypto');
    return new Uint8Array(createHmac('sha256', secret).update(message).digest());
  }
  throw new Error('hmacSha256Sync only available in Node; use codeForAsync in browser');
}

export function codeFor(opts: CodeInput): string {
  const digits = Math.max(4, Math.min(8, opts.digits | 0));
  const bytes = hmacSha256Sync(opts.secret, opts.bookingId);
  // Convert first 8 bytes to a non-negative bigint
  let n = 0n;
  for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(bytes[i]);
  n = n & ((1n << 63n) - 1n); // mask sign bit
  const mod = 10n ** BigInt(digits);
  const code = (n % mod).toString().padStart(digits, '0');
  return code;
}

export function batchCodes(input: BatchInput) {
  return input.bookings.map(bookingId => ({
    bookingId,
    code: codeFor({ bookingId, secret: input.secret, digits: input.digits }),
  }));
}

// Browser-safe async variant — used by the React island.
export async function codeForAsync(opts: CodeInput): Promise<string> {
  const digits = Math.max(4, Math.min(8, opts.digits | 0));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(opts.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, enc.encode(opts.bookingId)),
  );
  let n = 0n;
  for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(sig[i]);
  n = n & ((1n << 63n) - 1n);
  const mod = 10n ** BigInt(digits);
  return (n % mod).toString().padStart(digits, '0');
}
