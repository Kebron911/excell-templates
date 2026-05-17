import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const howToTemplate: PinTemplate = {
  id: "how-to",
  displayName: "How-To Steps",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    const items = copy.items ?? [];
    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.body.family, color: brand.colors.text }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", top: 80, left: 60, right: 60, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: brand.colors.accent, textTransform: "uppercase", fontWeight: 600 }}>HOW-TO</div>
          <div style={{ marginTop: 16, fontSize: 64, lineHeight: 1.1, fontWeight: brand.fonts.headline.weight, fontFamily: brand.fonts.headline.family }}>
            {copy.headline}
          </div>
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 28 }}>
            {items.slice(0, 5).map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 36 }}>
                <span style={{ background: brand.colors.accent, color: brand.colors.primaryDark, width: 64, height: 64, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 36, fontFamily: brand.fonts.headline.family }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        {footer(brand)}
      </div>
    );
  }
};
