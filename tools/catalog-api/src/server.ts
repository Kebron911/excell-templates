import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import type { Catalog } from '@str/catalog';
import type { ApiEnv } from './env.js';
import { registerAuth } from './auth.js';
import { registerCatalogRoutes, registerHealth } from './routes.js';

export interface BuildServerInput {
  env: ApiEnv;
  catalog: Catalog;
}

export async function buildServer(input: BuildServerInput): Promise<FastifyInstance> {
  const { env, catalog } = input;

  const app = Fastify({ logger: true, trustProxy: false });

  if (env.corsOrigins.length > 0) {
    await app.register(cors, {
      origin: env.corsOrigins,
      methods: ['GET', 'OPTIONS'],
      allowedHeaders: ['X-API-Key', 'Content-Type'],
    });
  }

  const skipPaths: string[] = ['/healthz'];
  if (env.publicMin) skipPaths.push('/v1/catalog/min');

  registerAuth(app, { apiKey: env.apiKey, skipPaths });
  registerHealth(app);
  registerCatalogRoutes(app, { catalog });

  return app;
}
