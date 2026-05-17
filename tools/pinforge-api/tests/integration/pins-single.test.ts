import { describe, expect, it, vi, beforeEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return { ...actual, generatePin: vi.fn(async () => makeFakePin()) };
});

describe("POST /v1/pins", () => {
  it("returns 401 without auth", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins",
      headers: { "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "test", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" }
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 202 with jobId + pollUrl for async (default)", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "test topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" }
    });
    expect(res.statusCode).toBe(202);
    const body = res.json();
    expect(body.jobId).toMatch(/^job_/);
    expect(body.pollUrl).toBe(`/v1/jobs/${body.jobId}`);
    await app.close();
  });

  it("returns 200 with pin + paths for ?sync=1", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins?sync=1",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests", topic: "test topic", primaryKeyword: "kw", destinationUrl: "https://strguests.tools/x" }
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.pin).toBeDefined();
    expect(body.paths).toBeDefined();
    await app.close();
  });

  it("returns 400 on malformed body (missing required fields)", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { brandId: "strguests" } // missing topic, primaryKeyword, destinationUrl
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION");
    await app.close();
  });
});

describe("GET /v1/pins/:slug", () => {
  beforeEach(async () => {
    const { _resetJobs } = await import("../../src/jobs.js");
    _resetJobs();
  });

  it("returns pin found on disk by slug", async () => {
    const dir = join(tmpdir(), `pinforge-test-slug-${Date.now()}`);
    try {
      await mkdir(join(dir, "2026-05-17", "strguests"), { recursive: true });
      await writeFile(
        join(dir, "2026-05-17", "strguests", "test-pin-abcd.json"),
        JSON.stringify({ brandId: "strguests", title: "Hi" })
      );
      await writeFile(
        join(dir, "2026-05-17", "strguests", "test-pin-abcd.png"),
        Buffer.from([137, 80, 78, 71])
      );

      const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: dir });
      const res = await app.inject({
        method: "GET",
        url: "/v1/pins/test-pin-abcd",
        headers: { "x-api-key": TEST_API_KEY }
      });
      expect(res.statusCode).toBe(200);
      expect(res.json().pin.brandId).toBe("strguests");
      await app.close();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("returns 404 for missing slug", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "GET",
      url: "/v1/pins/nonexistent-slug",
      headers: { "x-api-key": TEST_API_KEY }
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it("returns 404 for unsafe slug (path traversal)", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "GET",
      url: "/v1/pins/..%2Fetc%2Fpasswd",
      headers: { "x-api-key": TEST_API_KEY }
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});

describe("GET /v1/pins/:slug/image", () => {
  it("streams PNG with content-type image/png when found", async () => {
    const dir = join(tmpdir(), `pinforge-test-img-${Date.now()}`);
    try {
      await mkdir(join(dir, "2026-05-17", "strguests"), { recursive: true });
      await writeFile(
        join(dir, "2026-05-17", "strguests", "img-pin-abcd.json"),
        JSON.stringify({ brandId: "strguests", title: "Image test" })
      );
      const pngBytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
      await writeFile(join(dir, "2026-05-17", "strguests", "img-pin-abcd.png"), pngBytes);

      const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: dir });
      const res = await app.inject({
        method: "GET",
        url: "/v1/pins/img-pin-abcd/image",
        headers: { "x-api-key": TEST_API_KEY }
      });
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("image/png");
      await app.close();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
