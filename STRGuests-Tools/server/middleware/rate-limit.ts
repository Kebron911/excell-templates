/**
 * Sliding-window rate-limit middleware backed by the rate_limits table.
 *
 * Tier resolution:
 *   - signed sg_verified cookie present  → tier='verified', 50/day
 *   - else                                → tier='unverified', 5/hour
 *
 * Counter uses a fixed-bucket window keyed on (ip_hash, tool_slug, bucket,
 * window_start). On every consume we INSERT ... ON DUPLICATE KEY UPDATE so
 * the count + window are atomic in a single SQL statement.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { extractIp, hashIp } from '../lib/ip-hash.js';
import { readVerifiedEmail } from '../lib/verified-cookie.js';
import { query, queryOne } from '../lib/db.js';

export type Tier = 'unverified' | 'verified';
export type Bucket = 'hour' | 'day';

export interface RateState {
  tier: Tier;
  bucket: Bucket;
  limit: number;
  remaining: number;
  resetAt: Date;
  windowStart: Date;
  ipHash: string;
  email: string | null;
}

const LIMITS: Record<Tier, { bucket: Bucket; limit: number }> = {
  unverified: { bucket: 'hour', limit: 5 },
  verified: { bucket: 'day', limit: 50 },
};

declare module 'express-serve-static-core' {
  interface Request {
    rateLimit?: RateState;
  }
}

export function bucketWindow(now: Date, bucket: Bucket): { start: Date; end: Date } {
  const d = new Date(now);
  if (bucket === 'hour') {
    d.setUTCMinutes(0, 0, 0);
    return { start: d, end: new Date(d.getTime() + 60 * 60 * 1000) };
  }
  d.setUTCHours(0, 0, 0, 0);
  return { start: d, end: new Date(d.getTime() + 24 * 60 * 60 * 1000) };
}

export async function readState(req: Request, toolSlug: string): Promise<RateState> {
  const email = readVerifiedEmail(req.headers.cookie);
  const tier: Tier = email ? 'verified' : 'unverified';
  const { bucket, limit } = LIMITS[tier];
  const ipHash = hashIp(extractIp(req as any));
  const { start, end } = bucketWindow(new Date(), bucket);

  const row = await queryOne<{ count: number }>(
    'SELECT count FROM rate_limits WHERE ip_hash = ? AND tool_slug = ? AND bucket = ? AND window_start = ? LIMIT 1',
    [ipHash, toolSlug, bucket, start],
  );
  const count = row?.count ?? 0;
  const remaining = Math.max(0, limit - count);

  return { tier, bucket, limit, remaining, resetAt: end, windowStart: start, ipHash, email };
}

/**
 * Atomic consume — increments the counter, returns the post-increment state.
 * Returns `blocked: true` without persisting when the pre-increment count
 * already meets the limit.
 */
export async function consume(state: RateState, toolSlug: string): Promise<{ blocked: boolean; remaining: number }> {
  if (state.remaining <= 0) {
    return { blocked: true, remaining: 0 };
  }
  await query(
    'INSERT INTO rate_limits (ip_hash, email, tool_slug, bucket, window_start, count) VALUES (?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1, updated_at = CURRENT_TIMESTAMP',
    [state.ipHash, state.email, toolSlug, state.bucket, state.windowStart],
  );
  return { blocked: false, remaining: state.remaining - 1 };
}

export function rateLimit(toolSlug: string): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = await readState(req, toolSlug);
      if (state.remaining <= 0) {
        return res
          .status(429)
          .json({ error: 'rate_limited', tier: state.tier, limit: state.limit, resetAt: state.resetAt.toISOString() });
      }
      const result = await consume(state, toolSlug);
      if (result.blocked) {
        return res
          .status(429)
          .json({ error: 'rate_limited', tier: state.tier, limit: state.limit, resetAt: state.resetAt.toISOString() });
      }
      req.rateLimit = { ...state, remaining: result.remaining };
      next();
    } catch (err) {
      console.error('[rate-limit] error:', err);
      // Fail open in development; fail closed in production.
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({ error: 'rate_limit_unavailable' });
      }
      next();
    }
  };
}
