import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { buildSystemPrompt, buildUserPrompt } from "../../src/seo/prompts.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

describe("buildSystemPrompt", () => {
  it("includes brand voice", async () => {
    const brand = await loadBrand();
    const p = buildSystemPrompt(brand);
    expect(p).toContain(brand.voice);
  });
  it("lists disallowed terms", async () => {
    const brand = await loadBrand();
    const p = buildSystemPrompt(brand);
    expect(p.toLowerCase()).toContain("cheap");
    expect(p.toLowerCase()).toContain("easy money");
  });
  it("includes JSON schema instructions", async () => {
    const brand = await loadBrand();
    const p = buildSystemPrompt(brand);
    expect(p).toContain("JSON");
    expect(p).toContain("headline");
    expect(p).toContain("hashtags");
  });
});

describe("buildUserPrompt", () => {
  it("includes topic + keyword + templateId", async () => {
    const brand = await loadBrand();
    const p = buildUserPrompt({ brand, topic: "house rules", primaryKeyword: "airbnb rules", templateId: "big-hook" });
    expect(p).toContain("house rules");
    expect(p).toContain("airbnb rules");
    expect(p).toContain("big-hook");
  });
  it("requests items array for listicle template", async () => {
    const brand = await loadBrand();
    const p = buildUserPrompt({ brand, topic: "x", primaryKeyword: "y", templateId: "listicle" });
    expect(p.toLowerCase()).toContain("items");
  });
  it("requests stat for big-stat template", async () => {
    const brand = await loadBrand();
    const p = buildUserPrompt({ brand, topic: "x", primaryKeyword: "y", templateId: "big-stat" });
    expect(p.toLowerCase()).toContain("stat");
  });
});
