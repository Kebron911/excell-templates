/**
 * strguests.tools — Express API server.
 *
 * Phase 1: skeleton with /api/health only.
 * Phase 3: wires up the AI generators behind rate-limit middleware + the read-only
 *   /api/rate-limit-status that the AiRateLimitNotice front-end polls + the
 *   email-verification flow that upgrades visitors to the 50/day tier.
 *
 * Deployed to Hostinger Apps on :3001. A reverse proxy fronts both the static dist
 * (Astro) and this API under one origin.
 */

import express from 'express';
import type { Request, Response } from 'express';
import { verifyEmailStart, verifyEmailConfirm } from './routes/verify-email';
import { rateLimitStatus } from './routes/rate-limit-status';
import { generateListingMiddleware, generateListingHandler } from './routes/generate-listing';
import { generateReviewMiddleware, generateReviewHandler } from './routes/generate-review';
import { generateMessageMiddleware, generateMessageHandler } from './routes/generate-message';

const app = express();

app.use(express.json({ limit: '256kb' }));

// Health check — used by post-deploy smoke + uptime probes.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'strguests-api', ts: new Date().toISOString() });
});

// Email verification — POST starts the flow (sends nonce link), GET confirms.
app.post('/api/verify-email/start', verifyEmailStart);
app.get('/api/verify-email/confirm', verifyEmailConfirm);

// Read-only rate-limit status (no consume). AiRateLimitNotice polls this on page load.
app.get('/api/rate-limit-status', rateLimitStatus);

// AI generators — each rate-limited under its own tool_slug counter.
app.post('/api/generate-listing', generateListingMiddleware, generateListingHandler);
app.post('/api/generate-review', generateReviewMiddleware, generateReviewHandler);
app.post('/api/generate-message', generateMessageMiddleware, generateMessageHandler);

// Catch-all 404 for /api/* so unknown endpoints don't fall through to a generic
// Express 404 page.
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found' });
});

const port = Number(process.env.PORT ?? 3001);

// Don't listen when imported by tests — only when run directly.
const isMain = import.meta.url === `file://${process.argv[1]}`
  || (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')));

if (isMain) {
  app.listen(port, () => {
    console.log(`[strguests-api] listening on :${port}`);
  });
}

export { app };
