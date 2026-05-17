import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import type { ApiEnv } from "./env.js";
import { registerRateLimit } from "./rate-limit.js";
import { registerAuth } from "./auth.js";
import { registerHealthRoutes } from "./routes/health.js";

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

  registerAuth(app, { apiKey: env.apiKey, skipPaths: ["/healthz"] });

  registerHealthRoutes(app);

  return app;
}
