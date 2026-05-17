import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";

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

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "pinforge-api-e2e-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("E2E roundtrip", () => {
  it("creates a single pin and fetches it back by slug", async () => {
    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: BRANDS_DIR,
      outputDir: dir,
    });

    const created = await app.inject({
      method: "POST",
      url: "/v1/pins?sync=1",
      headers: {
        "x-api-key": TEST_API_KEY,
        "content-type": "application/json",
      },
      payload: {
        brandId: "strguests",
        topic: "e2e roundtrip test",
        primaryKeyword: "test keyword",
        destinationUrl: "https://strguests.tools/x",
        backgroundType: "solid",
      },
    });

    expect(created.statusCode).toBe(200);
    const body = created.json();
    expect(body.pin.brandId).toBe("strguests");

    const slug = (body.pin.imagePath as string)
      .split(/[\/\\]/)
      .pop()!
      .replace(/\.png$/, "");
    expect(slug).toBeTypeOf("string");
    expect(slug.length).toBeGreaterThan(0);

    const fetched = await app.inject({
      method: "GET",
      url: `/v1/pins/${slug}`,
      headers: { "x-api-key": TEST_API_KEY },
    });
    expect(fetched.statusCode).toBe(200);
    expect(fetched.json().pin.brandId).toBe("strguests");

    const image = await app.inject({
      method: "GET",
      url: `/v1/pins/${slug}/image`,
      headers: { "x-api-key": TEST_API_KEY },
    });
    expect(image.statusCode).toBe(200);
    expect(image.headers["content-type"]).toBe("image/png");
    expect(image.rawPayload.length).toBeGreaterThan(0);

    await app.close();
  }, 30_000);

  it("lists brands and templates", async () => {
    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: BRANDS_DIR,
      outputDir: dir,
    });

    const brands = await app.inject({
      method: "GET",
      url: "/v1/brands",
      headers: { "x-api-key": TEST_API_KEY },
    });
    expect(brands.statusCode).toBe(200);
    expect(brands.json().length).toBeGreaterThanOrEqual(2);

    const templates = await app.inject({
      method: "GET",
      url: "/v1/templates",
      headers: { "x-api-key": TEST_API_KEY },
    });
    expect(templates.statusCode).toBe(200);
    expect(templates.json()).toHaveLength(6);

    await app.close();
  });
});
