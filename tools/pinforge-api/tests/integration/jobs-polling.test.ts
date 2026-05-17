import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";
import { _resetJobs } from "../../src/jobs.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return { ...actual, generatePin: vi.fn(async () => makeFakePin()) };
});

beforeEach(() => {
  _resetJobs();
});

describe("GET /v1/jobs/:id", () => {
  it("returns 404 for unknown jobId", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "GET",
      url: "/v1/jobs/job_nonexistent_0000",
      headers: { "x-api-key": TEST_API_KEY }
    });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe("JOB_NOT_FOUND");
    await app.close();
  });

  it("POST /v1/pins → poll /v1/jobs/:id returns done after 30ms tick", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });

    const created = await app.inject({
      method: "POST",
      url: "/v1/pins",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: {
        brandId: "strguests",
        topic: "polling test topic",
        primaryKeyword: "kw",
        destinationUrl: "https://strguests.tools/x"
      }
    });
    expect(created.statusCode).toBe(202);
    const { jobId } = created.json();

    // Wait a tick for the fire-and-forget generatePin mock to complete
    await new Promise(r => setTimeout(r, 30));

    const poll = await app.inject({
      method: "GET",
      url: `/v1/jobs/${jobId}`,
      headers: { "x-api-key": TEST_API_KEY }
    });
    expect(poll.statusCode).toBe(200);
    expect(poll.json().status).toBe("done");
    expect(poll.json().progress.done).toBe(1);
    await app.close();
  });
});
