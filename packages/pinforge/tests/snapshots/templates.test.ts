import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import "../../src/templates/index.js";
import { listTemplates } from "../../src/templates/registry.js";
import { BrandKitSchema } from "../../src/brand/schema.js";

async function loadBrand() {
  const raw = await readFile(new URL("../fixtures/strguests-fixture.json", import.meta.url), "utf8");
  return BrandKitSchema.parse(JSON.parse(raw));
}

const COPY = {
  headline: "7 House Rules That Stop Bad Reviews",
  description: "A short description that fits within the test fixture envelope.",
  items: ["Wi-Fi + house code", "Local food picks", "Quiet hours", "Trash day", "Emergency contact"],
  stat: "73%",
  cta: "→ Free at strguests.tools",
  beforeText: "Cluttered welcome doc",
  afterText: "One-page guest sheet"
};

describe("template snapshots", () => {
  it("each template renders for solid background", async () => {
    const brand = await loadBrand();
    for (const t of listTemplates()) {
      const node = t.render({ brand, copy: COPY, background: { type: "solid" } });
      const html = renderToStaticMarkup(node as any);
      expect(html).toMatchSnapshot(`${t.id}-solid`);
    }
  });

  it("each template renders for gradient background", async () => {
    const brand = await loadBrand();
    for (const t of listTemplates()) {
      const node = t.render({ brand, copy: COPY, background: { type: "gradient" } });
      const html = renderToStaticMarkup(node as any);
      expect(html).toMatchSnapshot(`${t.id}-gradient`);
    }
  });
});
