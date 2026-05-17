import { describe, expect, it } from "vitest";
import { makeSlug, slugify } from "../../src/slug.js";

describe("slugify", () => {
  it("lowercases, strips punctuation, hyphenates", () => {
    expect(slugify("7 House Rules That Stop Bad Reviews!")).toBe("7-house-rules-that-stop-bad-reviews");
  });
  it("collapses repeated separators", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });
  it("trims to max length", () => {
    const s = slugify("x".repeat(200));
    expect(s.length).toBeLessThanOrEqual(80);
  });
});

describe("makeSlug", () => {
  it("is deterministic for same inputs on same date", () => {
    const args = { topic: "house rules", brandId: "strguests", templateId: "big-hook", date: "2026-05-16" };
    expect(makeSlug(args)).toBe(makeSlug(args));
  });
  it("differs across days", () => {
    const a = makeSlug({ topic: "x", brandId: "y", templateId: "z", date: "2026-05-16" });
    const b = makeSlug({ topic: "x", brandId: "y", templateId: "z", date: "2026-05-17" });
    expect(a).not.toBe(b);
  });
  it("matches ^[a-z0-9-]+$", () => {
    const s = makeSlug({ topic: "Hello, World!", brandId: "strguests", templateId: "big-hook", date: "2026-05-16" });
    expect(s).toMatch(/^[a-z0-9-]+$/);
  });
});
