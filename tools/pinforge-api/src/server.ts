import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
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

  if (input.env.corsOrigins.length > 0) {
    await app.register(cors, {
      origin: input.env.corsOrigins,
      credentials: input.env.corsCredentials,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["X-API-Key", "Content-Type"],
      exposedHeaders: ["Content-Disposition"]  // for CSV download
    });
  }

  await registerRateLimit(app, {
    max: env.rateLimitMax,
    windowMs: env.rateLimitWindowMs
  });

  await app.register(multipart, {
    limits: { fileSize: env.bodyLimitCsv, files: 1 }
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "PinForge API",
        version: "0.1.0",
        description: "Pinterest pin generator — REST wrapper for @str/pinforge."
      },
      components: {
        securitySchemes: {
          apiKey: { type: "apiKey", in: "header", name: "X-API-Key" }
        }
      },
      security: [{ apiKey: [] }]
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: false }
  });

  registerAuth(app, {
    apiKey: env.apiKey,
    skipPaths: ["/healthz"],
    skipPrefixes: ["/docs"]
  });

  registerHealthRoutes(app);
  registerPinsRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerJobsRoutes(app);
  registerBulkRoutes(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerCsvRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerSheetRoute(app, { env: input.env, brandsDir: input.brandsDir, outputDir: input.outputDir });
  registerCatalogRoutes(app, { brandsDir: input.brandsDir });

  return app;
}
