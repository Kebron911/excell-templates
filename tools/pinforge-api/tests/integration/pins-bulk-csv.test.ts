import { describe, expect, it, vi } from "vitest";
import FormData from "form-data";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_csv_mocked",
      succeeded: inputs.map((input) => ({ input, result: makeFakePin() })),
      failed: []
    }))
  };
});

const VALID_CSV = [
  "brandId,topic,primaryKeyword,destinationUrl",
  "strguests,topic one,keyword one,https://strguests.tools/1",
  "strguests,topic two,keyword two,https://strguests.tools/2"
].join("\n");

const CSV_WITH_BAD_ROW = [
  "brandId,topic,primaryKeyword,destinationUrl",
  "strguests,topic one,keyword one,https://strguests.tools/1",
  "INVALID ROW --- missing all fields"
].join("\n");

describe("POST /v1/pins/csv", () => {
  it("accepts valid CSV upload and returns 202 with jobId and count", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });

    const form = new FormData();
    form.append("file", Buffer.from(VALID_CSV), { filename: "pins.csv", contentType: "text/csv" });

    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/csv",
      headers: { "x-api-key": TEST_API_KEY, ...form.getHeaders() },
      payload: form.getBuffer()
    });

    expect(res.statusCode).toBe(202);
    const body = res.json();
    expect(body.jobId).toMatch(/^job_/);
    expect(body.count).toBe(2);
    expect(body.pollUrl).toContain("/v1/jobs/job_");
    await app.close();
  });

  it("accepts CSV with one bad row, returns 202 with count=1 and parseErrors", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });

    const form = new FormData();
    form.append("file", Buffer.from(CSV_WITH_BAD_ROW), { filename: "pins.csv", contentType: "text/csv" });

    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/csv",
      headers: { "x-api-key": TEST_API_KEY, ...form.getHeaders() },
      payload: form.getBuffer()
    });

    expect(res.statusCode).toBe(202);
    const body = res.json();
    expect(body.count).toBe(1);
    expect(body.parseErrors).toBeDefined();
    expect(body.parseErrors.length).toBeGreaterThan(0);
    await app.close();
  });
});
