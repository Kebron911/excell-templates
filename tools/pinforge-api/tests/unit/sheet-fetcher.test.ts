import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchPublishedSheetCsv } from "../../src/sheet-fetcher.js";

const ORIG_FETCH = global.fetch;

afterEach(() => {
  vi.restoreAllMocks();
});

const VALID_URL = "https://docs.google.com/spreadsheets/d/abc123/pub?output=csv";
const VALID_CSV = "brandId,topic,primaryKeyword,destinationUrl\nstrguests,topic one,keyword one,https://strguests.tools/1\n";

function mockFetch(status: number, body: string, contentType: string): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? "OK" : "Not Found",
      headers: { get: (h: string) => (h === "content-type" ? contentType : null) },
      text: async () => body
    }))
  );
}

describe("fetchPublishedSheetCsv", () => {
  it("returns CSV body on 200 text/csv response", async () => {
    mockFetch(200, VALID_CSV, "text/csv; charset=utf-8");
    const result = await fetchPublishedSheetCsv(VALID_URL);
    expect(result).toBe(VALID_CSV);
  });

  it("throws on 404 response (message contains '404')", async () => {
    mockFetch(404, "not found", "text/html");
    await expect(fetchPublishedSheetCsv(VALID_URL)).rejects.toThrow("404");
  });

  it("throws when host is not docs.google.com (message contains 'host')", async () => {
    await expect(
      fetchPublishedSheetCsv("https://evil.com/spreadsheets/d/abc/pub?output=csv")
    ).rejects.toThrow("host");
  });

  it("throws when protocol is not https (message contains 'https')", async () => {
    await expect(
      fetchPublishedSheetCsv("http://docs.google.com/spreadsheets/d/abc/pub?output=csv")
    ).rejects.toThrow("https");
  });

  it("rejects shadow-domain (e.g., evil-docs.google.com)", async () => {
    await expect(fetchPublishedSheetCsv("https://evil-docs.google.com/x")).rejects.toThrow(/host/);
  });

  it("accepts legitimate subdomain (e.g., spreadsheets.docs.google.com)", async () => {
    global.fetch = vi.fn(async () => new Response("a,b\n1,2\n", { status: 200, headers: { "content-type": "text/csv" } })) as any;
    const text = await fetchPublishedSheetCsv("https://spreadsheets.docs.google.com/x");
    expect(text).toContain("a,b");
    global.fetch = ORIG_FETCH;
  });
});
