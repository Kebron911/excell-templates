import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../../src/env.js";
import { generatePin } from "../../src/orchestrator/generate.js";
import { server } from "../helpers/msw-server.js";
import { makeTempDir } from "../helpers/temp-output.js";

const BRANDS_DIR = fileURLToPath(new URL("../../brands/", import.meta.url));

let dir: string;
let cleanup: () => Promise<void>;
beforeEach(async () => {
  ({ dir, cleanup } = await makeTempDir());
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.N8N_BASE_URL = "https://n8n.example.com";
  process.env.UNSPLASH_ACCESS_KEY = "ak";
});
afterEach(async () => { await cleanup(); });

describe("generatePin end-to-end (mocked)", () => {
  it("produces PNG + JSON sidecar for solid background", async () => {
    const env = loadEnv();
    const result = await generatePin(
      { brandId: "strguests", topic: "house rules", primaryKeyword: "airbnb house rules", destinationUrl: "https://strguests.tools/x", backgroundType: "solid" },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    );
    expect(result.metadata.brandId).toBe("strguests");
    expect(result.metadata.backgroundSource).toBe("solid");
    const png = await readFile(result.paths.png);
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("uses n8n image when backgroundType=image", async () => {
    const env = loadEnv();
    const result = await generatePin(
      { brandId: "strguests", topic: "coastal rental", primaryKeyword: "airbnb coastal", destinationUrl: "https://strguests.tools/x", backgroundType: "image", imageTreatment: "duotone" },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    );
    expect(result.metadata.backgroundSource).toBe("n8n");
    expect(result.metadata.fallbackUsed).toBe(false);
  });

  it("falls back to solid when n8n fails AND unsplash fails", async () => {
    server.use(
      http.post(/\/webhook\/pin-image$/, () => new HttpResponse(null, { status: 500 })),
      http.get("https://api.unsplash.com/search/photos", () => new HttpResponse(null, { status: 429 }))
    );
    const env = loadEnv();
    const result = await generatePin(
      { brandId: "strguests", topic: "test", primaryKeyword: "test", destinationUrl: "https://strguests.tools/x", backgroundType: "image" },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    );
    expect(result.metadata.backgroundSource).toBe("solid");
    expect(result.metadata.fallbackUsed).toBe(true);
  });

  it("rejects destinationUrl not in brand.allowedDomains", async () => {
    const env = loadEnv();
    await expect(generatePin(
      { brandId: "strguests", topic: "evil test", primaryKeyword: "evil", destinationUrl: "https://evil.com/x" },
      { env, brandsDir: BRANDS_DIR, outputDir: dir }
    )).rejects.toThrow(/allowedDomains/);
  });
});
