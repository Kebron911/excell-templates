import { readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import "../../src/templates/index.js";
import { listTemplates } from "../../src/templates/registry.js";
import { BrandKitSchema } from "../../src/brand/schema.js";
import { renderToSvg } from "../../src/render/satori.js";
import { composePng } from "../../src/render/compose.js";
import { loadBrandFonts } from "../../src/render/fonts.js";

const GOLDEN_DIR = fileURLToPath(new URL("./golden/", import.meta.url));
const BRANDS_DIR = fileURLToPath(new URL("../../brands/", import.meta.url));
const PIXEL_THRESHOLD = 0.05;

const COPY = {
  headline: "7 House Rules",
  description: "D".repeat(160),
  items: ["one", "two", "three"],
  stat: "73%",
  cta: "→ free at strguests.tools",
  beforeText: "Before",
  afterText: "After"
};

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

async function fileExists(p: string): Promise<boolean> {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

describe("visual regression — solid background", () => {
  it.each(["big-hook", "listicle", "quote", "how-to", "big-stat"])("%s renders deterministically", async (templateId) => {
    const brand = await loadBrand();
    const fonts = await loadBrandFonts(brand, BRANDS_DIR);
    const template = listTemplates().find(t => t.id === templateId)!;
    const node = template.render({ brand, copy: COPY, background: { type: "solid" } });
    const svg = await renderToSvg(node, { width: 1000, height: 1500, fonts });
    const png = await composePng(svg, { width: 1000, height: 1500 });

    const goldenPath = join(GOLDEN_DIR, `${templateId}-solid.png`);
    if (!(await fileExists(goldenPath))) {
      await writeFile(goldenPath, png);
      console.log(`Wrote golden: ${goldenPath}`);
      return;
    }
    const golden = PNG.sync.read(await readFile(goldenPath));
    const actual = PNG.sync.read(png);
    expect(actual.width).toBe(golden.width);
    expect(actual.height).toBe(golden.height);
    const diff = new PNG({ width: golden.width, height: golden.height });
    const diffPixels = pixelmatch(golden.data, actual.data, diff.data, golden.width, golden.height, { threshold: 0.2 });
    const ratio = diffPixels / (golden.width * golden.height);
    expect(ratio).toBeLessThan(PIXEL_THRESHOLD);
  });
});
