import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { buildPinImagePrompt } from "../../src/image/prompt.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

describe("buildPinImagePrompt", () => {
  it("includes topic + keyword", async () => {
    const brand = await loadBrand();
    const p = buildPinImagePrompt({ brand, topic: "vacation rental", primaryKeyword: "airbnb coastal" });
    expect(p).toContain("vacation rental");
    expect(p).toContain("airbnb coastal");
  });
  it("specifies vertical 2:3 composition", async () => {
    const brand = await loadBrand();
    const p = buildPinImagePrompt({ brand, topic: "x", primaryKeyword: "y" });
    expect(p.toLowerCase()).toContain("vertical");
    expect(p.toLowerCase()).toMatch(/2:3|2x3|portrait/);
  });
  it("leaves space for text overlay", async () => {
    const brand = await loadBrand();
    const p = buildPinImagePrompt({ brand, topic: "x", primaryKeyword: "y" });
    expect(p.toLowerCase()).toContain("overlay");
  });
});
