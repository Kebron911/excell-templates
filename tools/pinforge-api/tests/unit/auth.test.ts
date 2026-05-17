import { describe, expect, it } from "vitest";
import Fastify from "fastify";
import { registerAuth } from "../../src/auth.js";

const TEST_KEY = "test-api-key-32-chars-min-aaaaaa";

function buildTestApp(skipPaths?: string[]) {
  const app = Fastify({ logger: false });
  registerAuth(app, skipPaths !== undefined ? { apiKey: TEST_KEY, skipPaths } : { apiKey: TEST_KEY });
  app.get("/healthz", async () => ({ ok: true }));
  app.get("/protected", async () => ({ data: "secret" }));
  return app;
}

describe("registerAuth", () => {
  it("allows /healthz without API key", async () => {
    const app = buildTestApp(["/healthz"]);
    const res = await app.inject({ method: "GET", url: "/healthz" });
    expect(res.statusCode).toBe(200);
  });

  it("returns 401 for /protected without key", async () => {
    const app = buildTestApp(["/healthz"]);
    const res = await app.inject({ method: "GET", url: "/protected" });
    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 for wrong key", async () => {
    const app = buildTestApp(["/healthz"]);
    const res = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { "x-api-key": "wrong-key-that-is-not-right-at-all" }
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 200 for correct key", async () => {
    const app = buildTestApp(["/healthz"]);
    const res = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { "x-api-key": TEST_KEY }
    });
    expect(res.statusCode).toBe(200);
  });
});
