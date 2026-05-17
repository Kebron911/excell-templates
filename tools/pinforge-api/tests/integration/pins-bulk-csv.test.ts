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

// Large CSV well over 100 bytes
const LARGE_CSV = [
  "brandId,topic,primaryKeyword,destinationUrl",
  ...Array.from({ length: 5 }, (_, i) =>
    `strguests,a very long topic string for row ${i} to pad size,keyword-${i},https://strguests.tools/${i}`
  )
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

  it("enforces bodyLimitCsv — rejects oversized CSV file upload", async () => {
    const app = await buildServer({
      env: makeApiEnv({ bodyLimitCsv: 100 }),
      brandsDir: "./dummy",
      outputDir: "./dist/pins"
    });

    expect(Buffer.byteLength(LARGE_CSV)).toBeGreaterThan(100);

    const form = new FormData();
    form.append("file", Buffer.from(LARGE_CSV), { filename: "big.csv", contentType: "text/csv" });

    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/csv",
      headers: { "x-api-key": TEST_API_KEY, ...form.getHeaders() },
      payload: form.getBuffer()
    });

    // @fastify/multipart throws FST_REQ_FILE_TOO_LARGE (413) when fileSize limit exceeded
    expect(res.statusCode).toBe(413);
    await app.close();
  });
});
