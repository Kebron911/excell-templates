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

  registerAuth(app, { apiKey: env.apiKey, skipPaths: ["/healthz"] });

  registerHealthRoutes(app);
  registerPinsRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerJobsRoutes(app);
  registerBulkRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerCsvRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });

  return app;
}
