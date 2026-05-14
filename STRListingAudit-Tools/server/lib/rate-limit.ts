/**
 * Rate-limit middleware. Forked from STRGuests-Tools/server/lib/rate-limit.ts.
 *
 * listingaudit.tools limits per locked decision row 9:
 *   - Unverified visitor: 3 audits / hour / IP   (bucket='hour')
 *   - Verified visitor:   20 audits / day / email (bucket='day')
 *
 * Sliding-window UPSERT against `rate_limits` table, tool_slug='audit-listing'.
 */

import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import { query, queryOne } from './db';
import { readVerifiedEmail } from './verified-cookie';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
export const ANON_LIMIT_PER_HOUR = 3;
export const VERIFIED_LIMIT_PER_DAY = 20;
export const TOOL_SLUG = 'audit-listing';

function getSalt(): string {
  return process.env.IP_HASH_SALT ?? 'listingaudit-dev-salt';
}

export function ipHash(ip: string): string {
  return createHash('sha256').update(`${getSalt()}:${ip}`).digest('hex');
}

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
  identifier: string;
  email?: string;
  limit: number;
  count: number;
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

export async function consume(req: Request, toolSlug = TOOL_SLUG): Promise<RateState> {
  const sc = resolveScope(req);
  const windowStart = bucketWindowStart(sc.bucket);
  const resetAt = nextWindowStart(sc.bucket, windowStart);
  const indexKey =
    sc.scope === 'ip'
      ? sc.identifier
      : createHash('sha256').update(`email:${sc.email}`).digest('hex');

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

export function rateLimitMiddleware(toolSlug = TOOL_SLUG) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let state: RateState;
    try {
      state = await consume(req, toolSlug);
    } catch (err) {
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
        upgradeHint:
          state.scope === 'ip'
            ? 'Verify your email for 20 audits/day instead of 3/hour.'
            : null,
      });
      return;
    }
    next();
  };
}

export async function peek(req: Request, toolSlug = TOOL_SLUG): Promise<RateState> {
  const sc = resolveScope(req);
  const windowStart = bucketWindowStart(sc.bucket);
  const resetAt = nextWindowStart(sc.bucket, windowStart);
  const indexKey =
    sc.scope === 'ip'
      ? sc.identifier
      : createHash('sha256').update(`email:${sc.email}`).digest('hex');

  const row = await queryOne<{ count: number }>(
    `SELECT count FROM rate_limits
     WHERE ip_hash = ? AND tool_slug = ? AND bucket = ? AND window_start = ?
     LIMIT 1`,
    [indexKey, toolSlug, sc.bucket, windowStart],
  );
  const count = row?.count ?? 0;
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
    allowed: count < sc.limit,
  };
}
