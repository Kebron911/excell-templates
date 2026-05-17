import { afterEach, describe, expect, it } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { _resetJobs, createJobId, registerJob, completeJob } from "../../src/jobs.js";

afterEach(() => {
  _resetJobs();
});

describe("GET /v1/jobs/:id/results.csv", () => {
  it("returns CSV with header and one row per result", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });

    const jobId = createJobId();
    registerJob(jobId, { total: 2 });
    completeJob(jobId, [
      {
        ok: true,
        pin: { brandId: "strguests", templateId: "big-hook", title: "Pin One" },
        paths: { png: "/dist/pins/pin-one.png" }
      },
      {
        ok: false,
        error: { code: "BRAND_NOT_FOUND", message: "brand missing", context: {} }
      }
    ]);

    const res = await app.inject({
      method: "GET",
      url: `/v1/jobs/${jobId}/results.csv`,
      headers: { "x-api-key": TEST_API_KEY }
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain("attachment");

    const lines = res.body.trim().split("\n");
    expect(lines[0]).toMatch(/status/);
    expect(lines[0]).toMatch(/brandId/);
    expect(lines[0]).toMatch(/templateId/);
    expect(lines[0]).toMatch(/title/);
    expect(lines[0]).toMatch(/pngPath/);
    expect(lines[0]).toMatch(/error/);

    // ok row
    expect(lines[1]).toContain("ok");
    expect(lines[1]).toContain("strguests");
    expect(lines[1]).toContain("big-hook");

    // failed row
    expect(lines[2]).toContain("failed");
    expect(lines[2]).toContain("brand missing");

    await app.close();
  });

  it("returns 404 for unknown job", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "GET",
      url: "/v1/jobs/job_nonexistent_0000/results.csv",
      headers: { "x-api-key": TEST_API_KEY }
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
