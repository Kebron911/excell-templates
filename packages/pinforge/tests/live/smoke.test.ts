import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/env.js";
import { generatePin } from "../../src/orchestrator/generate.js";
import { makeTempDir } from "../helpers/temp-output.js";

const BRANDS_DIR = new URL("../../brands/", import.meta.url).pathname;
const enabled = process.env.LIVE === "1";

describe.skipIf(!enabled)("LIVE smoke — real APIs", () => {
  it("generates a real pin for strguests", { timeout: 120_000 }, async () => {
    const { dir, cleanup } = await makeTempDir();
    try {
      const env = loadEnv();
      const result = await generatePin({
        brandId: "strguests",
        topic: "smoke test — house rules for short-term rentals",
        primaryKeyword: "airbnb house rules",
        destinationUrl: "https://strguests.tools/",
        backgroundType: env.n8nBaseUrl ? "image" : "solid"
      }, { env, brandsDir: BRANDS_DIR, outputDir: dir });
      expect(result.pinPng.length).toBeGreaterThan(1000);
      expect(result.metadata.description.length).toBeGreaterThanOrEqual(150);
      expect(result.metadata.hashtags.length).toBeGreaterThanOrEqual(3);
      console.log(`LIVE smoke pin: ${result.paths.png}`);
    } finally {
      await cleanup();
    }
  });
});
