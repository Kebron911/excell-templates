/**
 * listingaudit.tools — Express API server.
 *
 * Phase 1: skeleton with /api/health only.
 * Phase 2: adds POST /api/scrape (admin-gated debug route).
 * Phase 3: adds the audit pipeline orchestrator (private).
 * Phase 4: adds POST /api/audit, GET /api/audit/:id, GET /api/audit/:id/status,
 *          GET /audit/:id/pdf (email-gated).
 *
 * Deployed to Hostinger Apps on :3002 (strguests holds :3001). A reverse proxy
 * fronts both the static dist (Astro) and this API under one origin.
 */

import express from 'express';
import type { Request, Response } from 'express';
import { scrapeHandler } from './routes/scrape';
import {
  auditSubmitMiddleware,
  auditSubmitHandler,
  auditStatusHandler,
  auditGetHandler,
  rateLimitStatusHandler,
} from './routes/audit';

const app = express();

app.use(express.json({ limit: '256kb' }));

// Health check — used by post-deploy smoke + uptime probes.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'listingaudit-api',
    ts: new Date().toISOString(),
  });
});

// Phase 2: admin-gated scrape debug endpoint.
app.post('/api/scrape', scrapeHandler);

// Phase 4: audit funnel.
app.post('/api/audit', auditSubmitMiddleware, auditSubmitHandler);
app.get('/api/audit/:id', auditGetHandler);
app.get('/api/audit/:id/status', auditStatusHandler);
app.get('/api/rate-limit-status', rateLimitStatusHandler);

// Catch-all 404 for /api/* so unknown endpoints don't fall through to a generic
// Express 404 page. Routes added in later phases register before this.
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found' });
});

const port = Number(process.env.PORT ?? 3002);

// Don't listen when imported by tests — only when run directly.
const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] &&
    import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')));

if (isMain) {
  app.listen(port, () => {
    console.log(`[listingaudit-api] listening on :${port}`);
  });
}

export { app };
