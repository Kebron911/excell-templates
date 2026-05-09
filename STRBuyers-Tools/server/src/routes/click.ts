/**
 * POST /api/click — affiliate-click logger.
 *
 * Accepts two payload shapes for forward + back compatibility:
 *
 * Canonical (Phase 4 spec):
 *   { vendorId, toolId, utm?: { source, medium, campaign }, referrer? }
 *
 * Legacy (AffiliateBlock.astro client script, Phase 1):
 *   { vendor, tool, category?, utm_source?, utm_medium?, utm_content?, ts? }
 *
 * Both normalize to a single click_logs row. IP is sha256-hashed with a
 * salt (env IP_HASH_SALT, or a per-process random fallback) — raw IPs
 * never hit the database.
 *
 * The endpoint NEVER fails the request on DB error — affiliate UX matters
 * more than telemetry, so DB problems are logged and swallowed.
 */

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { query } from '../db.js';

const router = Router();

const PayloadSchema = z
  .object({
    // Canonical
    vendorId: z.string().min(1).max(64).optional(),
    toolId: z.string().min(1).max(64).optional(),
    utm: z
      .object({
        source: z.string().max(128).optional(),
        medium: z.string().max(128).optional(),
        campaign: z.string().max(128).optional(),
      })
      .optional(),
    referrer: z.string().max(512).optional(),

    // Legacy AffiliateBlock shape
    vendor: z.string().min(1).max(64).optional(),
    tool: z.string().min(1).max(64).optional(),
    category: z.string().max(64).optional(),
    utm_source: z.string().max(128).optional(),
    utm_medium: z.string().max(128).optional(),
    utm_content: z.string().max(128).optional(),
    ts: z.number().optional(),
  })
  .strict();

// Per-process fallback salt — rotates on restart. Click logs are not used
// for any identity-binding decision, so a rotating salt is acceptable.
const FALLBACK_SALT = crypto.randomBytes(16).toString('hex');

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? FALLBACK_SALT;
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

function clientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0]!.trim();
  }
  return req.socket.remoteAddress ?? '0.0.0.0';
}

router.post('/', async (req: Request, res: Response) => {
  const parsed = PayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload', issues: parsed.error.issues });
  }

  const body = parsed.data;
  const vendor = body.vendorId ?? body.vendor;
  const tool = body.toolId ?? body.tool;

  if (!vendor || !tool) {
    return res.status(400).json({ error: 'missing_vendor_or_tool' });
  }

  const utmSource = body.utm?.source ?? body.utm_source ?? null;
  const utmMedium = body.utm?.medium ?? body.utm_medium ?? null;
  const utmCampaign = body.utm?.campaign ?? body.utm_content ?? null;
  const referrer = body.referrer ?? (req.headers.referer ? String(req.headers.referer) : null);
  const userAgent = req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 512) : null;
  const ipHash = hashIp(clientIp(req));

  try {
    await query(
      `INSERT INTO click_logs
        (vendor_id, tool_id, utm_source, utm_medium, utm_campaign, referrer, user_agent, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [vendor, tool, utmSource, utmMedium, utmCampaign, referrer, userAgent, ipHash],
    );
  } catch (err) {
    console.error('[click] db insert failed:', (err as Error).message);
  }

  return res.status(204).end();
});

export default router;
