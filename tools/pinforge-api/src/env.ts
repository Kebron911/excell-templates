import { z } from "zod";
import { loadEnv as loadPinforgeEnv, type PinforgeEnv } from "@str/pinforge";

const ApiEnvSchema = z.object({
  PINFORGE_API_KEY: z
    .string({ required_error: "PINFORGE_API_KEY is required" })
    .min(32, "PINFORGE_API_KEY must be at least 32 characters"),
  PINFORGE_API_PORT: z.coerce.number().int().positive().default(8787),
  PINFORGE_API_HOST: z.string().default("127.0.0.1"),
  PINFORGE_API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  PINFORGE_API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  PINFORGE_API_BODY_LIMIT_JSON: z.coerce.number().int().positive().default(256 * 1024),
  PINFORGE_API_BODY_LIMIT_CSV: z.coerce.number().int().positive().default(5 * 1024 * 1024),
  PINFORGE_API_BULK_MAX: z.coerce.number().int().positive().default(500),
  PINFORGE_API_SYNC_TIMEOUT_MS: z.coerce.number().int().positive().default(90_000),
  PINFORGE_API_CORS_ORIGINS: z.string().default(""),  // comma-separated list, empty = CORS off
  PINFORGE_API_CORS_CREDENTIALS: z.coerce.boolean().default(false)
});

export interface ApiEnv {
  apiKey: string;
  port: number;
  host: string;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  bodyLimitJson: number;
  bodyLimitCsv: number;
  bulkMax: number;
  syncTimeoutMs: number;
  corsOrigins: string[];        // parsed from comma-sep, empty array = CORS off
  corsCredentials: boolean;
  pinforge: PinforgeEnv;
}

export function loadApiEnv(source: NodeJS.ProcessEnv = process.env): ApiEnv {
  const parsed = ApiEnvSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid API env: ${msg}`);
  }
  const e = parsed.data;
  const pinforge = loadPinforgeEnv(source);
  return {
    apiKey: e.PINFORGE_API_KEY,
    port: e.PINFORGE_API_PORT,
    host: e.PINFORGE_API_HOST,
    rateLimitMax: e.PINFORGE_API_RATE_LIMIT_MAX,
    rateLimitWindowMs: e.PINFORGE_API_RATE_LIMIT_WINDOW_MS,
    bodyLimitJson: e.PINFORGE_API_BODY_LIMIT_JSON,
    bodyLimitCsv: e.PINFORGE_API_BODY_LIMIT_CSV,
    bulkMax: e.PINFORGE_API_BULK_MAX,
    syncTimeoutMs: e.PINFORGE_API_SYNC_TIMEOUT_MS,
    corsOrigins: e.PINFORGE_API_CORS_ORIGINS.split(",").map(s => s.trim()).filter(Boolean),
    corsCredentials: e.PINFORGE_API_CORS_CREDENTIALS,
    pinforge
  };
}
