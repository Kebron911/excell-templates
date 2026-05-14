/**
 * Admin-gated debug endpoint for the scrape layer.
 *
 * POST /api/scrape
 *   headers: x-admin-token: <ADMIN_TOKEN env value>
 *   body:    { url: string }
 *   returns: { snapshot, costUsd }
 *
 * Useful for verifying that a new actor or anti-bot bypass still works
 * without spinning up an audit. Not exposed to the public funnel.
 */

import type { Request, Response } from 'express';
import { fetchListingSnapshot } from '../lib/scrape/index';

export async function scrapeHandler(req: Request, res: Response): Promise<void> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({ error: 'admin_token_unconfigured' });
    return;
  }
  if (req.header('x-admin-token') !== expected) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  if (!url || !/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: 'invalid_url' });
    return;
  }

  try {
    const apifyToken = process.env.APIFY_TOKEN;
    const apifyActor = process.env.APIFY_AIRBNB_ACTOR ?? 'tri_angle/airbnb-scraper';
    const result = await fetchListingSnapshot(url, {
      apify: apifyToken ? { token: apifyToken, actor: apifyActor } : undefined,
    });
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'scrape_failed';
    res.status(502).json({ error: message });
  }
}
