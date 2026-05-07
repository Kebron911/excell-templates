/**
 * GET /api/rate-limit-status?tool=<slug>
 *
 * Read-only state probe used by AiRateLimitNotice. Does NOT consume budget.
 */

import { Router, type Request, type Response } from 'express';
import { readState } from '../middleware/rate-limit.js';

const ALLOWED = new Set(['listing-description', 'review-response', 'guest-messages']);

export function makeRateLimitStatusRouter(): Router {
  const r = Router();

  r.get('/api/rate-limit-status', async (req: Request, res: Response) => {
    const tool = String(req.query.tool ?? '');
    if (!ALLOWED.has(tool)) {
      return res.status(400).json({ error: 'invalid_tool' });
    }
    try {
      const state = await readState(req, tool);
      res.json({
        tier: state.tier,
        limit: state.limit,
        remaining: state.remaining,
        resetAt: state.resetAt.toISOString(),
      });
    } catch (err) {
      console.error('[rate-limit-status] error:', err);
      res.status(503).json({ error: 'unavailable' });
    }
  });

  return r;
}
