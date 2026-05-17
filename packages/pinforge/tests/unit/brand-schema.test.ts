import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";

describe("BrandKitSchema", () => {
  it("accepts the strguests fixture", async () => {
    const raw = JSON.parse(await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8"));
    const result = BrandKitSchema.safeParse(raw);
    if (!result.success) console.error(result.error.issues);
    expect(result.success).toBe(true);
  });

  it("rejects missing brandId", () => {
    const result = BrandKitSchema.safeParse({ displayName: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects bad color hex", () => {
    const bad = { brandId: "x", displayName: "X", domain: "x.com", voice: "v",
      colors: { primary: "not-a-hex", primaryDark: "#000", accent: "#000", text: "#fff", textOnLight: "#000" },
      fonts: { headline: { family: "f", weight: 800, file: "x.ttf" }, body: { family: "f", weight: 500, file: "x.ttf" }, accent: { family: "f", weight: 400, file: "x.ttf" } },
      logo: { footerText: "X" },
      defaults: { templateId: "big-hook", backgroundType: "solid", boardHint: "X" },
      seo: { keywords: [], disallowedTerms: [], ctaSuffix: "" },
      allowedDomains: ["x.com"] };
    const result = BrandKitSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("enforces backgroundType enum", () => {
    const result = BrandKitSchema.safeParse({ brandId: "x", defaults: { backgroundType: "rainbow" } });
    expect(result.success).toBe(false);
  });
});
