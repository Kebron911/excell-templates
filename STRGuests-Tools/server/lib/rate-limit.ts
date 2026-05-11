/**
 * Rate-limit middleware (sliding window via UPSERT).
 *
 * Two tiers per the spec:
 *   - Unverified visitor: 5 generations / hour / IP   (bucket='hour', identifier=ip_hash)
 *   - Verified visitor:   50 generations / day / email (bucket='day',  identifier=email)
 *
 * Storage: one row per (ip_hash | email, tool_slug, bucket, window_start) in `rate_limits`. The
 * window_start aligns to the floor of the current hour/day (UTC), so two requests in the same
 * window hit the same row via `INSERT ... ON DUPLICATE KEY UPDATE count = count + 1`.
 *
 * Why floor-aligned windows (not "sliding from first hit"):
 *   - Atomic — a single UPSERT replaces a SELECT+INSERT race.
 *   - Predictable reset times — users see "resets at the top of the hour" not "in 47 min."
 *   - Cheap — table size stays bounded (max ~24 rows/day per tool per identifier).
 *
 * Why HMAC-style ip_hash (not raw IP):
 *   - Privacy. The hash is non-reversible without the salt; raw IPs never enter the DB.
 *   - Matches the schema column `ip_hash CHAR(64)` — sha256(ip + IP_HASH_SALT).
 */

import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import { query, queryOne } from './db';
import { readVerifiedEmail } from './verified-cookie';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
export const ANON_LIMIT_PER_HOUR = 5;
export const VERIFIED_LIMIT_PER_DAY = 50;

function getSalt(): string {
  return process.env.IP_HASH_SALT ?? 'strguests-dev-salt';
}

export function ipHash(ip: string): string {
  return createHash('sha256').update(`${getSalt()}:${ip}`).digest('hex');
}

/** UTC-floor of the current time to the bucket boundary (hour or day). */
export function bucketWindowStart(bucket: 'hour' | 'day', now: Date = new Date()): Date {
  const d = new Date(now.getTime());
  d.setUTCMilliseconds(0);
  d.setUTCSeconds(0);
  d.setUTCMinutes(0);
  if (bucket === 'day') d.setUTCHours(0);
  return d;
}

function nextWindowStart(bucket: 'hour' | 'day', windowStart: Date): Date {
  return new Date(windowStart.getTime() + (bucket === 'hour' ? HOUR_MS : DAY_MS));
}

export type RateScope = 'ip' | 'email';
export interface RateState {
  scope: RateScope;
  bucket: 'hour' | 'day';
  toolSlug: string;
  identifier: string; // ip_hash for 'ip' scope, lowercased email for 'email' scope
  email?: string;
  limit: number;
  count: number; // after-increment count (so remaining = limit - count)
  remaining: number;
  resetAt: Date;
  allowed: boolean;
}

interface ResolvedScope {
  scope: RateScope;
  bucket: 'hour' | 'day';
  identifier: string;
  email?: string;
  limit: number;
}

function resolveScope(req: Request): ResolvedScope {
  const verifiedEmail = readVerifiedEmail(req);
  if (verifiedEmail) {
    return {
      scope: 'email',
      bucket: 'day',
      identifier: verifiedEmail,
      email: verifiedEmail,
      limit: VERIFIED_LIMIT_PER_DAY,
    };
  }
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
    || req.ip
    || req.socket?.remoteAddress
    || 'unknown';
  return {
    scope: 'ip',
    bucket: 'hour',
    identifier: ipHash(ip),
    limit: ANON_LIMIT_PER_HOUR,
  };
}

/**
 * Atomically increments the counter for (scope, tool, window) and returns post-increment state.
 *
 * Uses INSERT ... ON DUPLICATE KEY UPDATE so concurrent requests cannot double-spend the
 * window. The unique key `uniq_ip_tool_bucket (ip_hash, tool_slug, bucket, window_start)`
 * collapses race winners; verified-tier rows use the same unique key with the email column
 * stored alongside for ad-hoc queries.
 */
export async function consume(req: Request, toolSlug: string): Promise<RateState> {
  const sc = resolveScope(req);
  const windowStart = bucketWindowStart(sc.bucket);
  const resetAt = nextWindowStart(sc.bucket, windowStart);

  // Unique key is (ip_hash, tool_slug, bucket, window_start). For verified visitors we still
  // populate ip_hash with the email-derived hash so the index does its job; raw email lives
  // in the email column for ad-hoc admin queries.
  const indexKey = sc.scope === 'ip' ? sc.identifier : createHash('sha256').update(`email:${sc.email}`).digest('hex');

  await query(
    `INSERT INTO rate_limits (ip_hash, email, tool_slug, bucket, count, window_start)
     VALUES (?, ?, ?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE count = count + 1, updated_at = CURRENT_TIMESTAMP`,
    [indexKey, sc.email ?? null, toolSlug, sc.bucket, windowStart],
  );

  const row = await queryOne<{ count: number }>(
    `SELECT count FROM rate_limits
     WHERE ip_hash = ? AND tool_slug = ? AND bucket = ? AND window_start = ?
     LIMIT 1`,
    [indexKey, toolSlug, sc.bucket, windowStart],
  );
  const count = row?.count ?? 1;

  return {
    scope: sc.scope,
    bucket: sc.bucket,
    toolSlug,
    identifier: sc.identifier,
    email: sc.email,
    limit: sc.limit,
    count,
    remaining: Math.max(0, sc.limit - count),
    resetAt,
    allowed: count <= sc.limit,
  };
}

/**
 * Express middleware. Consumes one quota unit, stores RateState on res.locals, and 429s if exhausted.
 *
 * Note: this is consume-first (not check-then-consume). A 429 happens AFTER the counter went over,
 * which means the visitor "spent" their last allowance on the request that failed. That's the
 * standard sliding-window behavior; the resetAt header tells them when it refills.
 */
export function rateLimitMiddleware(toolSlug: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let state: RateState;
    try {
      state = await consume(req, toolSlug);
    } catch (err) {
      // DB outage shouldn't take down the API. Log and fail-open at the conservative anon limit.
      // eslint-disable-next-line no-console
      console.error('[rate-limit] consume failed:', err);
      res.locals.rateState = {
        scope: 'ip', bucket: 'hour', toolSlug, identifier: 'db-error',
        limit: ANON_LIMIT_PER_HOUR, count: 1,
        remaining: ANON_LIMIT_PER_HOUR - 1, resetAt: new Date(Date.now() + HOUR_MS),
        allowed: true,
      };
      next();
      return;
    }
    res.locals.rateState = state;
    if (!state.allowed) {
      res.status(429).json({
        error: 'rate_limited',
        scope: state.scope,
        remaining: state.remaining,
        resetAt: state.resetAt,
        upgradeHint: state.scope === 'ip'
          ? 'Verify your email for 50 generations/day instead of 5/hour.'
          : null,
      });
      return;
    }
    next();
  };
}

export const __test = {
  ANON_LIMIT_PER_HOUR,
  VERIFIED_LIMIT_PER_DAY,
  HOUR_MS,
  DAY_MS,
};
