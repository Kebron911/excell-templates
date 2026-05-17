import { http, HttpResponse } from "msw";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { resolvePinBackground } from "../../src/image/fallback.js";
import { server } from "../helpers/msw-server.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

describe("resolvePinBackground fallback chain", () => {
  it("uses n8n result when available", async () => {
    const brand = await loadBrand();
    const result = await resolvePinBackground(
      { brand, topic: "t", primaryKeyword: "k" },
      { n8nBaseUrl: "https://n8n.example.com", n8nKey: "k", n8nTimeoutMs: 1000, unsplashKey: "u" }
    );
    expect(result.source).toBe("n8n");
    expect(result.fallbackUsed).toBe(false);
    expect(Buffer.isBuffer(result.buffer)).toBe(true);
  });

  it("falls back to Unsplash when n8n returns 500", async () => {
    server.use(
      http.post(/\/webhook\/pin-image$/, () => new HttpResponse(null, { status: 500 })),
      http.get("https://api.unsplash.com/search/photos", () => HttpResponse.json({
        results: [{ urls: { regular: "https://images.unsplash.com/x.jpg" } }]
      })),
      http.get("https://images.unsplash.com/x.jpg", () => new HttpResponse(Buffer.from([137,80,78,71,13,10,26,10]), { status: 200 }))
    );
    const brand = await loadBrand();
    const result = await resolvePinBackground(
      { brand, topic: "t", primaryKeyword: "k" },
      { n8nBaseUrl: "https://n8n.example.com", n8nKey: "k", n8nTimeoutMs: 1000, unsplashKey: "u" }
    );
    expect(result.source).toBe("unsplash");
    expect(result.fallbackUsed).toBe(true);
  });

  it("falls back to solid when both n8n and Unsplash fail", async () => {
    server.use(
      http.post(/\/webhook\/pin-image$/, () => new HttpResponse(null, { status: 500 })),
      http.get("https://api.unsplash.com/search/photos", () => new HttpResponse(null, { status: 429 }))
    );
    const brand = await loadBrand();
    const result = await resolvePinBackground(
      { brand, topic: "t", primaryKeyword: "k" },
      { n8nBaseUrl: "https://n8n.example.com", n8nKey: "k", n8nTimeoutMs: 1000, unsplashKey: "u" }
    );
    expect(result.source).toBe("solid");
    expect(result.fallbackUsed).toBe(true);
    expect(Buffer.isBuffer(result.buffer)).toBe(true);
  });

  it("skips n8n entirely when n8nBaseUrl is undefined", async () => {
    server.use(
      http.get("https://api.unsplash.com/search/photos", () => HttpResponse.json({
        results: [{ urls: { regular: "https://images.unsplash.com/y.jpg" } }]
      })),
      http.get("https://images.unsplash.com/y.jpg", () => new HttpResponse(Buffer.from([137,80,78,71,13,10,26,10]), { status: 200 }))
    );
    const brand = await loadBrand();
    const result = await resolvePinBackground(
      { brand, topic: "t", primaryKeyword: "k" },
      { n8nBaseUrl: undefined, n8nKey: undefined, n8nTimeoutMs: 1000, unsplashKey: "u" }
    );
    expect(result.source).toBe("unsplash");
  });
});
