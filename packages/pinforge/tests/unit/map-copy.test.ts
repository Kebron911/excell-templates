import { describe, expect, it } from "vitest";
import { mapSeoToRenderedCopy } from "../../src/orchestrator/map-copy.js";

const SEO = {
  headline: "Headline",
  pinTitle: "Pin Title",
  description: "D".repeat(160),
  altText: "Alt",
  hashtags: ["#a", "#b", "#c"],
  items: ["one", "two"],
  stat: "73%"
};

describe("mapSeoToRenderedCopy", () => {
  it("maps headline + description + cta from brand", () => {
    const r = mapSeoToRenderedCopy(SEO as any, "→ CTA suffix");
    expect(r.headline).toBe("Headline");
    expect(r.description).toBe(SEO.description);
    expect(r.cta).toBe("→ CTA suffix");
    expect(r.items).toEqual(["one", "two"]);
    expect(r.stat).toBe("73%");
  });
});
