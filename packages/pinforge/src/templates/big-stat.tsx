import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const bigStatTemplate: PinTemplate = {
  id: "big-stat",
  displayName: "Big Stat",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.headline.family, color: brand.colors.text }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", inset: 0, padding: "0 60px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 240, fontWeight: 900, lineHeight: 1, color: brand.colors.accent }}>{copy.stat ?? "—"}</div>
          <div style={{ marginTop: 32, fontSize: 36, color: brand.colors.accent, fontWeight: brand.fonts.body.weight, fontFamily: brand.fonts.body.family, lineHeight: 1.3 }}>
            {copy.description ?? ""}
          </div>
          <div style={{ marginTop: 60, fontSize: 56, fontWeight: brand.fonts.headline.weight, lineHeight: 1.2 }}>
            {copy.headline}
          </div>
        </div>
        {footer(brand)}
      </div>
    );
  }
};
