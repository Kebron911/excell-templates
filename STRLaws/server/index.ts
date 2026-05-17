import express, { type Express, type Request, type Response } from 'express';
import { createAlertsRouter, type AlertsRouterDeps } from './routes/alerts';

const PORT = Number(process.env.PORT ?? 3001);

export interface AppDeps {
  alerts?: AlertsRouterDeps;
}

export function createApp(deps: AppDeps = {}): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'strlaws-api',
      timestamp: new Date().toISOString(),
    });
  });

  if (deps.alerts) {
    app.use('/api/alerts', createAlertsRouter(deps.alerts));
  }

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;
if (isMain) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`STRLaws API listening on http://localhost:${PORT}`);
  });
}
