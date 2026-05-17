import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_mocked",
      succeeded: inputs.map((input) => ({ input, result: makeFakePin() })),
      failed: []
    }))
  };
});

function makeItem(i: number) {
  return {
    brandId: "strguests",
    topic: `topic-${i}`,
    primaryKeyword: `keyword-${i}`,
    destinationUrl: `https://strguests.tools/${i}`
  };
}

describe("POST /v1/pins/bulk (JSON)", () => {
  it("accepts 3 items and returns 202 with jobId, count, pollUrl", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items }
    });
    expect(res.statusCode).toBe(202);
    const body = res.json();
    expect(body.jobId).toMatch(/^job_/);
    expect(body.count).toBe(3);
    expect(body.pollUrl).toContain("/v1/jobs/job_");
    await app.close();
  });

  it("rejects items array exceeding bulkMax", async () => {
    const app = await buildServer({ env: makeApiEnv({ bulkMax: 2 }), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION");
    await app.close();
  });

  it("rejects empty items array", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items: [] }
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
