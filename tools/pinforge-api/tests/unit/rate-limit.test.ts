import { describe, expect, it } from "vitest";
import Fastify from "fastify";
import { registerRateLimit } from "../../src/rate-limit.js";
import { registerAuth } from "../../src/auth.js";

const TEST_KEY = "test-api-key-32-chars-min-aaaaaa";

describe("rate limit", () => {
  it("allows 3 requests then 429 on 4th", async () => {
    const app = Fastify({ logger: false });
    await registerRateLimit(app, { max: 3, windowMs: 60_000 });
    registerAuth(app, { apiKey: TEST_KEY });
    app.get("/test", async () => ({ ok: true }));
    await app.ready();

    const headers = { "x-api-key": TEST_KEY };
    const r1 = await app.inject({ method: "GET", url: "/test", headers });
    const r2 = await app.inject({ method: "GET", url: "/test", headers });
    const r3 = await app.inject({ method: "GET", url: "/test", headers });
    const r4 = await app.inject({ method: "GET", url: "/test", headers });

    expect(r1.statusCode).toBe(200);
    expect(r2.statusCode).toBe(200);
    expect(r3.statusCode).toBe(200);
    expect(r4.statusCode).toBe(429);
  });
});
