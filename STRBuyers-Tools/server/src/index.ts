/**
 * strbuyers.tools — Express API server.
 *
 * Phase 4 surface: /api/health (liveness, no DB), /api/click (click-log insert).
 * Future phases add ESP webhook proxy, lead capture, etc.
 *
 * Deployed to Hostinger Apps on :3001. A reverse proxy fronts both the
 * static dist (Astro) and this API under one origin.
 */

import express from 'express';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import clickRouter from './routes/click.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'https://strbuyers.tools',
      methods: ['GET', 'POST'],
    }),
  );
  app.use(express.json({ limit: '64kb' }));

  // Liveness — does NOT touch DB. Used by uptime probes + post-deploy smoke.
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'strbuyers-api', ts: new Date().toISOString() });
  });

  app.use('/api/click', clickRouter);

  // Catch-all 404 for /api/* so unknown endpoints return JSON, not HTML.
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'not_found' });
  });

  return app;
}

const port = Number(process.env.PORT ?? 3001);

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')));

if (isMain) {
  const app = createApp();
  app.listen(port, () => {
    console.log(`[strbuyers-api] listening on :${port}`);
  });
}
