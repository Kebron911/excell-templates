import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

// Mutable flag to trigger mixed results for Task 16
let returnMixed = false;

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => {
      if (returnMixed) {
        return {
          jobId: "job_mocked_mixed",
          succeeded: [{ input: inputs[0], result: makeFakePin() }],
          failed: [
            {
              input: inputs[1],
              error: { code: "VALIDATION", message: "bad input", context: {} }
            }
          ]
        };
      }
      return {
        jobId: "job_mocked",
        succeeded: inputs.map((input) => ({ input, result: makeFakePin() })),
        failed: []
      };
    })
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

  it("enforces bodyLimitJson — rejects oversized JSON body", async () => {
    const app = await buildServer({
      env: makeApiEnv({ bodyLimitJson: 100 }),
      brandsDir: "./dummy",
      outputDir: "./dist/pins"
    });
    // Craft a payload clearly > 100 bytes
    const bigPayload = JSON.stringify({ items: [makeItem(1), makeItem(2), makeItem(3)] });
    expect(bigPayload.length).toBeGreaterThan(100);
    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: bigPayload
    });
    // Fastify returns 413 when bodyLimit is exceeded
    expect(res.statusCode).toBe(413);
    await app.close();
  });

  it("concurrent bulk POSTs produce unique jobIds", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const payload = { items: [makeItem(1)] };
    const headers = { "x-api-key": TEST_API_KEY, "content-type": "application/json" };

    const [r1, r2, r3] = await Promise.all([
      app.inject({ method: "POST", url: "/v1/pins/bulk", headers, payload }),
      app.inject({ method: "POST", url: "/v1/pins/bulk", headers, payload }),
      app.inject({ method: "POST", url: "/v1/pins/bulk", headers, payload })
    ]);

    expect(r1.statusCode).toBe(202);
    expect(r2.statusCode).toBe(202);
    expect(r3.statusCode).toBe(202);

    const ids = [r1.json().jobId, r2.json().jobId, r3.json().jobId];
    const unique = new Set(ids);
    expect(unique.size).toBe(3);
    await app.close();
  });

  it("returns 202 and continues when generateBatch returns mixed succeeded + failed", async () => {
    returnMixed = true;
    try {
      const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
      const items = [makeItem(1), makeItem(2)];
      const res = await app.inject({
        method: "POST",
        url: "/v1/pins/bulk",
        headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
        payload: { items }
      });
      expect(res.statusCode).toBe(202);
      expect(res.json().count).toBe(2);
      expect(res.json().jobId).toMatch(/^job_/);
      await app.close();
    } finally {
      returnMixed = false;
    }
  });
});
