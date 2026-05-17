import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadEnv } from "../../src/env.js";

const ORIG = { ...process.env };
afterEach(() => { process.env = { ...ORIG }; });

describe("loadEnv", () => {
  it("returns parsed config when required vars set", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.N8N_BASE_URL = "https://n8n.example.com";
    process.env.PINFORGE_OUTPUT_DIR = "./dist/pins";
    const cfg = loadEnv();
    expect(cfg.openaiApiKey).toBe("sk-test");
    expect(cfg.n8nBaseUrl).toBe("https://n8n.example.com");
    expect(cfg.queueConcurrency).toBe(3);
  });

  it("throws when OPENAI_API_KEY missing", () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => loadEnv()).toThrow(/OPENAI_API_KEY/);
  });

  it("respects PINFORGE_QUEUE_CONCURRENCY override", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.PINFORGE_QUEUE_CONCURRENCY = "5";
    const cfg = loadEnv();
    expect(cfg.queueConcurrency).toBe(5);
  });
});
