import { describe, expect, it, vi, afterEach } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_sheet_mocked",
      succeeded: inputs.map((input) => ({ input, result: makeFakePin() })),
      failed: []
    }))
  };
});

const VALID_URL =
  "https://docs.google.com/spreadsheets/d/abc123/pub?output=csv";

const VALID_CSV = [
  "brandId,topic,primaryKeyword,destinationUrl",
  "strguests,topic one,keyword one,https://strguests.tools/1",
  "strguests,topic two,keyword two,https://strguests.tools/2"
].join("\n");

describe("POST /v1/pins/sheet", () => {
  it("returns 202 with jobId and count when mocked fetch returns valid CSV", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: { get: (h: string) => (h === "content-type" ? "text/csv" : null) },
        text: async () => VALID_CSV
      }))
    );

    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: "./dummy",
      outputDir: "./dist/pins"
    });

    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/sheet",
      headers: {
        "x-api-key": TEST_API_KEY,
        "content-type": "application/json"
      },
      payload: { sheetUrl: VALID_URL }
    });

    expect(res.statusCode).toBe(202);
    const body = res.json();
    expect(body.jobId).toMatch(/^job_/);
    expect(body.count).toBe(2);
    expect(body.pollUrl).toContain("/v1/jobs/");
    await app.close();
  });

  it("returns 400 when sheetUrl host is not docs.google.com", async () => {
    const app = await buildServer({
      env: makeApiEnv(),
      brandsDir: "./dummy",
      outputDir: "./dist/pins"
    });

    const res = await app.inject({
      method: "POST",
      url: "/v1/pins/sheet",
      headers: {
        "x-api-key": TEST_API_KEY,
        "content-type": "application/json"
      },
      payload: { sheetUrl: "https://evil.com/spreadsheets/d/abc/pub?output=csv" }
    });

    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
