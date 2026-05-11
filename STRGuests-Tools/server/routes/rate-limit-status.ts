/**
 * GET /api/rate-limit-status?tool=<slug>
 *
 * Read-only view of the visitor's current rate-limit state. Frontend AiRateLimitNotice
 * polls this on page load to render "N of M generations remaining". Does NOT consume.
 *
 * Returns the same shape AiRateLimitNotice expects:
 *   { tier: 'unverified' | 'verified', remaining, limit, resetAt }
 */

import type { Request, Response } from 'express';
import { peek, ANON_LIMIT_PER_HOUR, VERIFIED_LIMIT_PER_DAY } from '../lib/rate-limit';

const KNOWN_TOOLS = new Set(['listing-description', 'review-response', 'guest-messages']);

export async function rateLimitStatus(req: Request, res: Response): Promise<void> {
  const tool = typeof req.query?.tool === 'string' ? req.query.tool : '';
  if (!tool || !KNOWN_TOOLS.has(tool)) {
    res.status(400).json({ error: 'invalid_tool' });
    return;
  }
  try {
    const state = await peek(req, tool);
    res.json({
      tier: state.scope === 'email' ? 'verified' : 'unverified',
      remaining: state.remaining,
      limit: state.limit,
      resetAt: state.resetAt.toISOString(),
    });
  } catch (err) {
    // Fail-open at the conservative anon tier rather than blocking the UI.
    res.json({
      tier: 'unverified',
      remaining: ANON_LIMIT_PER_HOUR,
      limit: ANON_LIMIT_PER_HOUR,
      resetAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
  }
}

export const __test = { KNOWN_TOOLS, ANON_LIMIT_PER_HOUR, VERIFIED_LIMIT_PER_DAY };
