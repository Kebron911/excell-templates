import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import type { ApiEnv } from "./env.js";
import { registerRateLimit } from "./rate-limit.js";
import { registerAuth } from "./auth.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerPinsRoutes } from "./routes/pins.js";
import { registerJobsRoutes } from "./routes/jobs.js";
import { registerBulkRoutes } from "./routes/pins-bulk.js";
import { registerCsvRoute } from "./routes/pins-csv.js";
import { registerSheetRoute } from "./routes/pins-sheet.js";
import { registerCatalogRoutes } from "./routes/catalog.js";

export interface BuildServerInput {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export async function buildServer(input: BuildServerInput): Promise<FastifyInstance> {
  const { env } = input;

  const app = Fastify({
    logger: true,
    bodyLimit: env.bodyLimitJson,
    trustProxy: false
  });

  await registerRateLimit(app, {
    max: env.rateLimitMax,
    windowMs: env.rateLimitWindowMs
  });

  await app.register(multipart, {
    limits: { fileSize: env.bodyLimitCsv, files: 1 }
  });

  registerAuth(app, { apiKey: env.apiKey, skipPaths: ["/healthz", "/docs", "/docs/", "/docs/json", "/docs/yaml", "/docs/static/"] });

  registerHealthRoutes(app);
  registerPinsRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerJobsRoutes(app);
  registerBulkRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerCsvRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerSheetRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerCatalogRoutes(app, { brandsDir: input.brandsDir });

  return app;
}
