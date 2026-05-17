import { afterEach, describe, expect, it } from "vitest";
import { loadApiEnv } from "../../src/env.js";

const ORIG = { ...process.env };
afterEach(() => {
  process.env = { ...ORIG };
});

describe("loadApiEnv", () => {
  it("returns parsed config when required vars set", () => {
    process.env.PINFORGE_API_KEY = "test-key-32-chars-min-aaaaaaaaaa";
    process.env.OPENAI_API_KEY = "sk-test";
    const cfg = loadApiEnv();
    expect(cfg.apiKey).toBe("test-key-32-chars-min-aaaaaaaaaa");
    expect(cfg.port).toBe(8787);
    expect(cfg.host).toBe("127.0.0.1");
  });

  it("throws when PINFORGE_API_KEY is missing", () => {
    delete process.env.PINFORGE_API_KEY;
    process.env.OPENAI_API_KEY = "sk-test";
    expect(() => loadApiEnv()).toThrow(/PINFORGE_API_KEY/);
  });

  it("rejects API key shorter than 32 chars", () => {
    process.env.PINFORGE_API_KEY = "tooshort";
    process.env.OPENAI_API_KEY = "sk-test";
    expect(() => loadApiEnv()).toThrow(/32/);
  });

  it("respects PINFORGE_API_PORT override", () => {
    process.env.PINFORGE_API_KEY = "test-key-32-chars-min-aaaaaaaaaa";
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.PINFORGE_API_PORT = "9000";
    expect(loadApiEnv().port).toBe(9000);
  });
});
