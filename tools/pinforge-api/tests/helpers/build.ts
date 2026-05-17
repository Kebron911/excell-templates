import type { ApiEnv } from "../../src/env.js";
import { buildServer } from "../../src/server.js";

export const TEST_API_KEY = "test-api-key-32-chars-minimum-xx";

export function makeApiEnv(overrides: Partial<ApiEnv> = {}): ApiEnv {
  return {
    apiKey: TEST_API_KEY,
    port: 8787,
    host: "127.0.0.1",
    rateLimitMax: 100,
    rateLimitWindowMs: 60_000,
    bodyLimitJson: 256 * 1024,
    bodyLimitCsv: 5 * 1024 * 1024,
    bulkMax: 500,
    syncTimeoutMs: 90_000,
    corsOrigins: [],
    corsCredentials: false,
    pinforge: {
      openaiApiKey: "sk-test",
      openaiModel: "gpt-4o-mini",
      n8nBaseUrl: undefined,
      n8nPinKey: undefined,
      unsplashAccessKey: undefined,
      outputDir: "./dist/pins",
      jobsDir: "./dist/jobs",
      queueConcurrency: 3,
      queueIntervalCap: 10,
      queueIntervalMs: 60_000,
      n8nTimeoutMs: 60_000
    },
    ...overrides
  };
}

export { buildServer };
