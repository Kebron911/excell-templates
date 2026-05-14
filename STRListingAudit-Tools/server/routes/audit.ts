/**
 * Phase 4 audit endpoints.
 *
 *   POST /api/audit          → submit URL, returns { id } (pipeline runs in background)
 *   GET  /api/audit/:id      → returns full audit result JSON (when ready)
 *   GET  /api/audit/:id/status → polling endpoint, returns { status, overallScore? }
 *   GET  /api/rate-limit-status → peek at current rate window
 */

import { z } from 'zod';
import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { rateLimitMiddleware, peek, TOOL_SLUG } from '../lib/rate-limit';
import { createAuditRun, getAuditRun } from '../lib/audit-runs';
import { runAuditPipeline } from '../lib/audit-pipeline';
import { detectPlatform } from '../lib/scrape/jsonld';

const SubmitSchema = z.object({
  url: z
    .string()
    .min(8)
    .max(2048)
    .refine((u) => {
      try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'must be a valid http(s) URL'),
});

export const auditSubmitMiddleware = rateLimitMiddleware(TOOL_SLUG);

export async function auditSubmitHandler(req: Request, res: Response): Promise<void> {
  const parsed = SubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_url', detail: parsed.error.flatten() });
    return;
  }
  const url = parsed.data.url.trim();
  const platform = detectPlatform(url);
  if (platform === 'unknown') {
    res.status(400).json({
      error: 'unsupported_platform',
      detail: 'Listing URL must be an Airbnb or Vrbo property page.',
    });
    return;
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';
  const ipHash = createHash('sha256')
    .update(`${process.env.IP_HASH_SALT ?? 'listingaudit-dev-salt'}:${ip}`)
    .digest('hex');

  let id: string;
  try {
    id = await createAuditRun({ url, platform, ipHash });
  } catch (err) {
    console.error('[audit] createAuditRun failed:', err);
    res.status(503).json({ error: 'db_unavailable' });
    return;
  }

  // Kick off the pipeline in the background — do NOT await.
  // Errors are persisted to audit_runs.status='failed' by the pipeline itself.
  void runAuditPipeline(id, url);

  res.status(202).json({ id, status: 'running' });
}

export async function auditStatusHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id ?? '';
  const row = await getAuditRun(id);
  if (!row) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  if (row.status === 'failed') {
    res.json({ status: 'failed', errorCode: row.error_code, errorMessage: row.error_message });
    return;
  }
  if (row.status === 'running') {
    res.json({ status: 'running' });
    return;
  }
  res.json({
    status: 'ready',
    overallScore: row.fixes_json?.overallScore,
    shareImagePath: row.share_image_path,
  });
}

export async function auditGetHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id ?? '';
  const row = await getAuditRun(id);
  if (!row) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  if (row.status !== 'ready') {
    res.status(409).json({ error: 'not_ready', status: row.status });
    return;
  }
  res.json({
    id: row.id,
    url: row.url,
    platform: row.platform,
    listingId: row.listing_id,
    status: row.status,
    snapshot: {
      title: row.snapshot_json?.title,
      location: row.snapshot_json?.location,
      ratingAverage: row.snapshot_json?.ratingAverage,
      reviewCount: row.snapshot_json?.reviewCount,
      photoCount: row.snapshot_json?.photos?.length ?? 0,
    },
    scores: row.scores_json,
    summary: row.fixes_json?.summary,
    overallScore: row.fixes_json?.overallScore,
    topFixes: row.fixes_json?.topFixes,
    shareImagePath: row.share_image_path,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  });
}

export async function rateLimitStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const state = await peek(req);
    res.json({
      scope: state.scope,
      limit: state.limit,
      remaining: state.remaining,
      count: state.count,
      resetAt: state.resetAt,
    });
  } catch (err) {
    res.status(503).json({ error: 'rate_limit_status_unavailable' });
  }
}
