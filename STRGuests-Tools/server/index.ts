/**
 * strguests.tools — Express server.
 *
 * Serves the Astro static build (dist/) plus the /api/* surface from a
 * single Node process on Hostinger Apps. Phase 3 wires the AI generators
 * (/api/generate-listing, /api/generate-review, /api/generate-message),
 * /api/rate-limit-status, /api/verify-email, and /api/pin-host.
 */

import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json({ limit: '256kb' }));

// Health check — used by post-deploy smoke + uptime probes.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'strguests-api', ts: new Date().toISOString() });
});

// Catch-all 404 for /api/* so unknown endpoints don't fall through to the
// static handler and end up returning index.html with a 200.
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found' });
});

// Static site (Astro build output). STATIC_DIR overrides for tests / custom
// deploys; defaults to <cwd>/dist which matches `astro build`.
const staticDir = process.env.STATIC_DIR ?? path.resolve(process.cwd(), 'dist');

if (existsSync(staticDir)) {
  app.use(express.static(staticDir, { extensions: ['html'] }));

  const notFoundPage = path.join(staticDir, '404.html');
  app.use((_req: Request, res: Response) => {
    if (existsSync(notFoundPage)) {
      res.status(404).sendFile(notFoundPage);
    } else {
      res.status(404).type('text').send('Not found');
    }
  });
} else {
  console.warn(`[strguests-api] static dir missing: ${staticDir} (run \`npm run build\` first)`);
}

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
