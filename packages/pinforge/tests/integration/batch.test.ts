import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../../src/env.js";
import { generateBatch } from "../../src/queue/batch.js";
import { makeTempDir } from "../helpers/temp-output.js";
import "../helpers/msw-server.js";

const BRANDS_DIR = fileURLToPath(new URL("../../brands/", import.meta.url));

let dir: string;
let cleanup: () => Promise<void>;
beforeEach(async () => {
  ({ dir, cleanup } = await makeTempDir());
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.PINFORGE_QUEUE_CONCURRENCY = "2";
});
afterEach(async () => { await cleanup(); });

describe("generateBatch", () => {
  it("processes 3 inputs and returns mixed results", async () => {
    const env = loadEnv();
    const inputs = [
      { brandId: "strguests", topic: "a-topic", primaryKeyword: "ak", destinationUrl: "https://strguests.tools/a", backgroundType: "solid" as const },
      { brandId: "strguests", topic: "b-topic", primaryKeyword: "bk", destinationUrl: "https://strguests.tools/b", backgroundType: "solid" as const },
      { brandId: "strguests", topic: "c-topic", primaryKeyword: "ck", destinationUrl: "https://strguests.tools/c", backgroundType: "solid" as const }
    ];
    const result = await generateBatch(inputs, { env, brandsDir: BRANDS_DIR, outputDir: dir });
    expect(result.jobId).toMatch(/^job_/);
    expect(result.succeeded).toHaveLength(3);
    expect(result.failed).toHaveLength(0);
  });

  it("continues after one input fails", async () => {
    const env = loadEnv();
    const inputs = [
      { brandId: "nonexistent-brand", topic: "x-topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" },
      { brandId: "strguests", topic: "good-topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/g", backgroundType: "solid" as const }
    ];
    const result = await generateBatch(inputs, { env, brandsDir: BRANDS_DIR, outputDir: dir });
    expect(result.failed).toHaveLength(1);
    expect(result.succeeded).toHaveLength(1);
    expect(result.failed[0]!.error.code).toBe("BRAND_NOT_FOUND");
  });
});
