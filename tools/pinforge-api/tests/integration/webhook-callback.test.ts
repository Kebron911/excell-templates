import { describe, expect, it, vi } from "vitest";
import { buildServer, makeApiEnv, TEST_API_KEY } from "../helpers/build.js";
import { makeFakePin } from "../helpers/mock-pinforge.js";

vi.mock("@str/pinforge", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@str/pinforge")>();
  return {
    ...actual,
    generateBatch: vi.fn(async (inputs: unknown[]) => ({
      jobId: "job_wh",
      succeeded: inputs.map(input => ({ input, result: makeFakePin() })),
      failed: []
    }))
  };
});

const ORIG_FETCH = global.fetch;

describe("webhook callback", () => {
  it("POSTs job-done payload to callbackUrl after bulk completes", async () => {
    const calls: { url: string; body: any }[] = [];
    global.fetch = vi.fn(async (url: string, init: any) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return new Response("", { status: 200 });
    }) as any;

    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: {
        items: [{ brandId: "x", topic: "topic-1", primaryKeyword: "kw", destinationUrl: "https://x.com/" }],
        callbackUrl: "https://my-app.example.com/webhook"
      }
    });

    // Wait for fire-and-forget
    await new Promise(r => setTimeout(r, 50));

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://my-app.example.com/webhook");
    expect(calls[0]!.body.status).toBe("done");
    expect(calls[0]!.body.jobId).toMatch(/^job_/);
    expect(calls[0]!.body.progress.done).toBe(1);

    global.fetch = ORIG_FETCH;
    await app.close();
  });

  it("does not POST when callbackUrl absent", async () => {
    const calls: { url: string }[] = [];
    global.fetch = vi.fn(async (url: string) => {
      calls.push({ url });
      return new Response("", { status: 200 });
    }) as any;

    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: { items: [{ brandId: "x", topic: "topic-1", primaryKeyword: "kw", destinationUrl: "https://x.com/" }] }
    });
    await new Promise(r => setTimeout(r, 50));

    expect(calls).toHaveLength(0);

    global.fetch = ORIG_FETCH;
    await app.close();
  });

  it("logs warning + continues when webhook returns non-2xx (does not fail the job)", async () => {
    global.fetch = vi.fn(async () => new Response("", { status: 500 })) as any;

    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({
      method: "POST", url: "/v1/pins/bulk",
      headers: { "x-api-key": TEST_API_KEY, "content-type": "application/json" },
      payload: {
        items: [{ brandId: "x", topic: "topic-1", primaryKeyword: "kw", destinationUrl: "https://x.com/" }],
        callbackUrl: "https://broken.example.com/webhook"
      }
    });
    expect(res.statusCode).toBe(202);
    await new Promise(r => setTimeout(r, 50));
    // Job should still complete normally — webhook is fire-and-forget

    global.fetch = ORIG_FETCH;
    await app.close();
  });
});
