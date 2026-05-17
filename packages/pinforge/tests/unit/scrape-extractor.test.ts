import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { extractContent } from "../../src/scrape/extractor.js";

const HTML = readFileSync(
  fileURLToPath(new URL("../fixtures/blog-post-fixture.html", import.meta.url)),
  "utf8"
);

describe("extractContent", () => {
  it("extracts title, h1, meta, og fields from fixture", () => {
    const r = extractContent(HTML, "https://strguests.tools/house-rules");
    expect(r.title).toBe("7 House Rules That Stop Bad Reviews | STRGuests");
    expect(r.h1).toBe("7 House Rules That Stop Bad Reviews");
    expect(r.metaDescription).toBe("Tired of guests breaking rules? These 7 templates fix it.");
    expect(r.ogTitle).toBe("7 House Rules That Stop Bad Reviews");
    expect(r.ogDescription).toBe("Stop bad reviews with these 7 simple house rules.");
  });

  it("sets sourceUrl and lang from html element", () => {
    const r = extractContent(HTML, "https://strguests.tools/house-rules");
    expect(r.sourceUrl).toBe("https://strguests.tools/house-rules");
    expect(r.lang).toBe("en");
  });

  it("strips nav/header/footer from bodySample", () => {
    const r = extractContent(HTML, "https://strguests.tools/house-rules");
    expect(r.bodySample).not.toContain("Home");
    expect(r.bodySample).not.toContain("Privacy");
    expect(r.bodySample).toContain("Every STR host");
  });

  it("caps bodySample at 500 chars", () => {
    const long = "<html><body><p>" + "a".repeat(1000) + "</p></body></html>";
    const r = extractContent(long, "https://x.com/");
    expect(r.bodySample.length).toBeLessThanOrEqual(500);
  });
});
