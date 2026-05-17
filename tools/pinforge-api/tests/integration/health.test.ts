import { describe, expect, it } from "vitest";
import { buildServer, makeApiEnv } from "../helpers/build.js";

describe("GET /healthz", () => {
  it("returns 200 with ok and version, no auth required", async () => {
    const env = makeApiEnv();
    const app = await buildServer({ env, brandsDir: "/tmp/brands", outputDir: "/tmp/out" });

    const res = await app.inject({ method: "GET", url: "/healthz" });

    expect(res.statusCode).toBe(200);
    const body = res.json<{ ok: boolean; version: string }>();
    expect(body.ok).toBe(true);
    expect(typeof body.version).toBe("string");
    expect(body.version.length).toBeGreaterThan(0);
  });
});
