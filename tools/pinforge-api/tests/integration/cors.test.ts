import { describe, expect, it } from "vitest";
import { buildServer, makeApiEnv } from "../helpers/build.js";

describe("CORS", () => {
  it("does not send CORS headers when corsOrigins empty", async () => {
    const app = await buildServer({ env: makeApiEnv(), brandsDir: "./dummy", outputDir: "./dist/pins" });
    const res = await app.inject({ method: "OPTIONS", url: "/healthz", headers: { origin: "https://app.example.com" } });
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    await app.close();
  });

  it("allows configured origin", async () => {
    const app = await buildServer({
      env: makeApiEnv({ corsOrigins: ["https://app.example.com"] }),
      brandsDir: "./dummy", outputDir: "./dist/pins"
    });
    const res = await app.inject({
      method: "OPTIONS", url: "/healthz",
      headers: { origin: "https://app.example.com", "access-control-request-method": "GET" }
    });
    expect(res.headers["access-control-allow-origin"]).toBe("https://app.example.com");
    await app.close();
  });

  it("rejects unlisted origin (no CORS header in response)", async () => {
    const app = await buildServer({
      env: makeApiEnv({ corsOrigins: ["https://app.example.com"] }),
      brandsDir: "./dummy", outputDir: "./dist/pins"
    });
    const res = await app.inject({
      method: "OPTIONS", url: "/healthz",
      headers: { origin: "https://evil.com", "access-control-request-method": "GET" }
    });
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    await app.close();
  });
});
