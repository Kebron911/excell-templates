import express, { type Express, type Request, type Response } from 'express';

const PORT = Number(process.env.PORT ?? 3001);

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'strlaws-api',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;
if (isMain) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`STRLaws API listening on http://localhost:${PORT}`);
  });
}
