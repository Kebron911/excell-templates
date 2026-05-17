import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { UnsplashError } from "../../src/errors.js";
import { fetchUnsplash } from "../../src/image/unsplash.js";
import { server } from "../helpers/msw-server.js";

const PNG_URL = "https://images.unsplash.com/photo-test.jpg";

describe("fetchUnsplash", () => {
  it("returns Buffer when search + download both succeed", async () => {
    server.use(
      http.get("https://api.unsplash.com/search/photos", () => HttpResponse.json({
        results: [{ urls: { regular: PNG_URL }, id: "test" } ]
      })),
      http.get(PNG_URL, () => new HttpResponse(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), { status: 200 }))
    );
    const buf = await fetchUnsplash({ query: "airbnb coastal", accessKey: "ak" });
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(0);
  });

  it("throws when no results", async () => {
    server.use(
      http.get("https://api.unsplash.com/search/photos", () => HttpResponse.json({ results: [] }))
    );
    await expect(fetchUnsplash({ query: "x", accessKey: "ak" })).rejects.toBeInstanceOf(UnsplashError);
  });

  it("throws when accessKey missing", async () => {
    await expect(fetchUnsplash({ query: "x", accessKey: undefined })).rejects.toBeInstanceOf(UnsplashError);
  });

  it("throws when search API errors", async () => {
    server.use(
      http.get("https://api.unsplash.com/search/photos", () => new HttpResponse(null, { status: 429 }))
    );
    await expect(fetchUnsplash({ query: "x", accessKey: "ak" })).rejects.toBeInstanceOf(UnsplashError);
  });
});
