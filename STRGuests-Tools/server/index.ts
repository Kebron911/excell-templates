/**
 * strguests.tools — Express API server.
 *
 * Phase 1: skeleton with /api/health only. Phase 3 wires the AI generators
 * (/api/generate-listing, /api/generate-review, /api/generate-message),
 * /api/rate-limit-status, /api/verify-email, and /api/pin-host.
 *
 * Deployed to Hostinger Apps on :3001. A reverse proxy fronts both the
 * static dist (Astro) and this API under one origin.
 */

import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json({ limit: '256kb' }));

// Health check — used by post-deploy smoke + uptime probes.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'strguests-api', ts: new Date().toISOString() });
});

// Catch-all 404 for /api/* so unknown endpoints don't fall through to a
// generic Express 404 page.
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
