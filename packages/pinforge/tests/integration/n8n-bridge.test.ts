import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { N8nImageError } from "../../src/errors.js";
import { fetchPinBackground } from "../../src/image/n8n-bridge.js";
import { server } from "../helpers/msw-server.js";

const FAKE_BRAND = { displayName: "X", imageStyle: undefined, imageKeywords: undefined } as any;

describe("fetchPinBackground via n8n", () => {
  it("returns Buffer on 200", async () => {
    const buf = await fetchPinBackground(
      { brand: FAKE_BRAND, topic: "t", primaryKeyword: "k" },
      { baseUrl: "https://n8n.example.com", apiKey: "k", timeoutMs: 1000 }
    );
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(0);
  });

  it("throws N8nImageError on 500", async () => {
    server.use(http.post(/\/webhook\/pin-image$/, () => new HttpResponse(null, { status: 500 })));
    await expect(
      fetchPinBackground({ brand: FAKE_BRAND, topic: "t", primaryKeyword: "k" },
        { baseUrl: "https://n8n.example.com", apiKey: "k", timeoutMs: 1000 })
    ).rejects.toBeInstanceOf(N8nImageError);
  });

  it("throws N8nImageError on timeout", async () => {
    server.use(http.post(/\/webhook\/pin-image$/, async () => {
      await new Promise(r => setTimeout(r, 2000));
      return HttpResponse.json({});
    }));
    await expect(
      fetchPinBackground({ brand: FAKE_BRAND, topic: "t", primaryKeyword: "k" },
        { baseUrl: "https://n8n.example.com", apiKey: "k", timeoutMs: 100 })
    ).rejects.toBeInstanceOf(N8nImageError);
  });

  it("throws when baseUrl missing", async () => {
    await expect(
      fetchPinBackground({ brand: FAKE_BRAND, topic: "t", primaryKeyword: "k" },
        { baseUrl: undefined, apiKey: "k", timeoutMs: 1000 })
    ).rejects.toBeInstanceOf(N8nImageError);
  });
});
