import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const quoteTemplate: PinTemplate = {
  id: "quote",
  displayName: "Quote / Tip Card",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.accent.family, color: brand.colors.text }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", inset: 0, padding: "0 80px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 180, lineHeight: 1, color: brand.colors.accent, fontFamily: brand.fonts.accent.family }}>"</div>
          <div style={{ marginTop: 24, fontSize: 56, lineHeight: 1.3, fontStyle: "italic" }}>{copy.headline}</div>
          {copy.cta && (
            <div style={{ marginTop: 60, fontSize: 28, opacity: 0.85, fontFamily: brand.fonts.body.family, fontWeight: brand.fonts.body.weight }}>
              {copy.cta}
            </div>
          )}
        </div>
        {footer(brand)}
      </div>
    );
  }
};
