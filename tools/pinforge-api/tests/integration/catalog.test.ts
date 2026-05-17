import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";

// Real brands dir — relative from this test file location
// tools/pinforge-api/tests/integration/ → packages/pinforge/brands/
const BRANDS_DIR = resolve(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "..",
  "..",
  "..",
  "packages",
  "pinforge",
  "brands"
);

describe("GET /v1/brands", () => {
  it("returns array containing strguests and excel-templates", async () => {
    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: BRANDS_DIR,
      outputDir: "./dist/pins"
    });

    const res = await app.inject({
      method: "GET",
      url: "/v1/brands",
      headers: { "x-api-key": TEST_API_KEY }
    });

    expect(res.statusCode).toBe(200);
    const brands = res.json() as Array<{ brandId: string }>;
    const ids = brands.map((b) => b.brandId);
    expect(ids).toContain("strguests");
    expect(ids).toContain("excel-templates");
    await app.close();
  });
});

describe("GET /v1/templates", () => {
  it("returns 6 templates including big-hook", async () => {
    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: BRANDS_DIR,
      outputDir: "./dist/pins"
    });

    const res = await app.inject({
      method: "GET",
      url: "/v1/templates",
      headers: { "x-api-key": TEST_API_KEY }
    });

    expect(res.statusCode).toBe(200);
    const templates = res.json() as Array<{ id: string }>;
    expect(templates.length).toBeGreaterThanOrEqual(6);
    const ids = templates.map((t) => t.id);
    expect(ids).toContain("big-hook");
    await app.close();
  });
});
