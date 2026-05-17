import { http, HttpResponse } from "msw";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadEnv } from "../../src/env.js";
import { generatePin } from "../../src/orchestrator/generate.js";
import { server } from "../helpers/msw-server.js";
import { makeTempDir } from "../helpers/temp-output.js";

const BRANDS_DIR = fileURLToPath(new URL("../../brands/", import.meta.url));
const FIXTURE_HTML = readFileSync(fileURLToPath(new URL("../fixtures/blog-post-fixture.html", import.meta.url)), "utf8");

let dir: string;
let cleanup: () => Promise<void>;
beforeEach(async () => {
  ({ dir, cleanup } = await makeTempDir());
  process.env.OPENAI_API_KEY = "sk-test";
});
afterEach(async () => { await cleanup(); });

describe("generatePin with inputMode=url", () => {
  it("scrapes URL and generates pin from grounded prompt", async () => {
    server.use(
      http.get("https://strguests.tools/house-rules", () => HttpResponse.html(FIXTURE_HTML))
    );

    const env = loadEnv();
    const result = await generatePin(
      {
        brandId: "strguests",
        topic: "house rules from blog",
        primaryKeyword: "airbnb house rules",
        destinationUrl: "https://strguests.tools/house-rules-generator",
        inputMode: "url",
        sourceUrl: "https://strguests.tools/house-rules",
        backgroundType: "solid"
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    );
    expect(result.metadata.brandId).toBe("strguests");
    expect(result.metadata.sourceInputs.inputMode).toBe("url");
    expect(result.metadata.sourceInputs.sourceUrl).toBe("https://strguests.tools/house-rules");
    expect(result.metadata.description.length).toBeGreaterThanOrEqual(150);
  });

  it("throws ValidationError when inputMode=url but sourceUrl missing", async () => {
    const env = loadEnv();
    await expect(generatePin(
      {
        brandId: "strguests",
        topic: "missing source test",
        primaryKeyword: "missing",
        destinationUrl: "https://strguests.tools/x",
        inputMode: "url"
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    )).rejects.toThrow(/sourceUrl|Invalid PinInput/);
  });

  it("propagates scrape failures with proper error", async () => {
    server.use(
      http.get("https://broken.example.com/post", () => new HttpResponse(null, { status: 500 }))
    );
    const env = loadEnv();
    await expect(generatePin(
      {
        brandId: "strguests",
        topic: "broken source test",
        primaryKeyword: "broken",
        destinationUrl: "https://strguests.tools/x",
        inputMode: "url",
        sourceUrl: "https://broken.example.com/post"
      },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    )).rejects.toThrow(/500|fetch/);
  });
});
