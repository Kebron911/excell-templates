/**
 * Stable, salt-mixed sha256 of a client IP. Never store raw IPs in
 * rate_limits / generation_logs — store the hash. The salt rotates rarely
 * enough that hashed-IP joins still work over a single rolling window.
 */

import { createHash } from 'node:crypto';

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? '';
  return createHash('sha256').update(ip + salt).digest('hex');
}

/**
 * Best-effort IP extraction. Hostinger's reverse proxy sets x-forwarded-for;
 * fall back to req.ip / connection address. Picks the FIRST entry of the
 * forwarded chain (closest hop = original client).
 */
export function extractIp(req: { ip?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0]!.trim();
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return xff[0]!.split(',')[0]!.trim();
  }
  return req.ip ?? req.socket?.remoteAddress ?? '0.0.0.0';
}
