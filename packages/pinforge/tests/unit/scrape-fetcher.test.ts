import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { fetchHtml } from "../../src/scrape/fetcher.js";
import { server } from "../helpers/msw-server.js";

describe("fetchHtml", () => {
  it("returns HTML body on 200", async () => {
    server.use(
      http.get("https://blog.example.com/post", () => HttpResponse.html("<html><body>hi</body></html>"))
    );
    const html = await fetchHtml("https://blog.example.com/post", { timeoutMs: 5000, maxBytes: 100_000 });
    expect(html).toContain("<body>hi</body>");
  });

  it("throws on 404", async () => {
    server.use(
      http.get("https://x.com/missing", () => new HttpResponse(null, { status: 404 }))
    );
    await expect(
      fetchHtml("https://x.com/missing", { timeoutMs: 5000, maxBytes: 100_000 })
    ).rejects.toThrow(/404/);
  });

  it("throws on non-html content-type", async () => {
    server.use(
      http.get("https://x.com/json", () => HttpResponse.json({ a: 1 }))
    );
    await expect(
      fetchHtml("https://x.com/json", { timeoutMs: 5000, maxBytes: 100_000 })
    ).rejects.toThrow(/content-type/i);
  });

  it("throws on body exceeding maxBytes", async () => {
    server.use(
      http.get("https://x.com/big", () => HttpResponse.html("x".repeat(2000)))
    );
    await expect(
      fetchHtml("https://x.com/big", { timeoutMs: 5000, maxBytes: 100 })
    ).rejects.toThrow(/size/i);
  });

  it("throws on non-http(s) URL", async () => {
    await expect(
      fetchHtml("javascript:alert(1)", { timeoutMs: 5000, maxBytes: 100_000 })
    ).rejects.toThrow(/protocol/i);
  });
});
