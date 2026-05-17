import { z } from "zod";
import { ValidationError } from "./errors.js";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  N8N_BASE_URL: z.string().url().optional(),
  N8N_PIN_KEY: z.string().optional(),
  UNSPLASH_ACCESS_KEY: z.string().optional(),
  PINFORGE_OUTPUT_DIR: z.string().default("./dist/pins"),
  PINFORGE_JOBS_DIR: z.string().default("./dist/jobs"),
  PINFORGE_QUEUE_CONCURRENCY: z.coerce.number().int().positive().default(3),
  PINFORGE_QUEUE_INTERVAL_CAP: z.coerce.number().int().positive().default(10),
  PINFORGE_QUEUE_INTERVAL_MS: z.coerce.number().int().positive().default(60_000),
  PINFORGE_N8N_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000)
});

export interface PinforgeEnv {
  openaiApiKey: string;
  openaiModel: string;
  n8nBaseUrl: string | undefined;
  n8nPinKey: string | undefined;
  unsplashAccessKey: string | undefined;
  outputDir: string;
  jobsDir: string;
  queueConcurrency: number;
  queueIntervalCap: number;
  queueIntervalMs: number;
  n8nTimeoutMs: number;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): PinforgeEnv {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new ValidationError(`Invalid env: ${msg}`, { issues: parsed.error.issues });
  }
  const e = parsed.data;
  return {
    openaiApiKey: e.OPENAI_API_KEY,
    openaiModel: e.OPENAI_MODEL,
    n8nBaseUrl: e.N8N_BASE_URL,
    n8nPinKey: e.N8N_PIN_KEY,
    unsplashAccessKey: e.UNSPLASH_ACCESS_KEY,
    outputDir: e.PINFORGE_OUTPUT_DIR,
    jobsDir: e.PINFORGE_JOBS_DIR,
    queueConcurrency: e.PINFORGE_QUEUE_CONCURRENCY,
    queueIntervalCap: e.PINFORGE_QUEUE_INTERVAL_CAP,
    queueIntervalMs: e.PINFORGE_QUEUE_INTERVAL_MS,
    n8nTimeoutMs: e.PINFORGE_N8N_TIMEOUT_MS
  };
}
