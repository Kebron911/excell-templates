import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { buildUrlGroundedUserPrompt } from "../../src/seo/prompts.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

const SCRAPED = {
  sourceUrl: "https://strguests.tools/house-rules",
  title: "7 House Rules That Stop Bad Reviews",
  h1: "7 House Rules That Stop Bad Reviews",
  metaDescription: "Tired of guests breaking rules?",
  ogTitle: "7 House Rules That Stop Bad Reviews",
  ogDescription: "Stop bad reviews with these 7 simple house rules.",
  bodySample: "Every STR host runs into the same set of guest behaviors that lead to one-star reviews. The fix isn't more rules — it's better-worded rules.",
  lang: "en"
};

describe("buildUrlGroundedUserPrompt", () => {
  it("includes all scraped fields as context", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    expect(p).toContain("strguests.tools/house-rules");
    expect(p).toContain("7 House Rules That Stop Bad Reviews");
    expect(p).toContain("Every STR host");
  });

  it("instructs LLM to REWRITE, not copy verbatim", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    expect(p).toContain("REWRITE");
    expect(p.toLowerCase()).toContain("verbatim");
  });

  it("includes template-specific items instruction for listicle", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "listicle" });
    expect(p.toLowerCase()).toContain("items");
    expect(p).toContain("5-7");
  });

  it("includes brand domain and knows where the content came from", async () => {
    const brand = await loadBrand();
    const p = buildUrlGroundedUserPrompt({ brand, scraped: SCRAPED, templateId: "big-hook" });
    expect(p).toContain(brand.domain);
    expect(p).toContain(SCRAPED.sourceUrl);
  });
});
