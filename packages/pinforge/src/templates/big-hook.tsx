import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const bigHookTemplate: PinTemplate = {
  id: "big-hook",
  displayName: "Big Bold Hook",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.headline.family, color: brand.colors.text }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, padding: "0 60px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, opacity: 0.9, fontFamily: brand.fonts.body.family, fontWeight: brand.fonts.body.weight, textTransform: "uppercase" }}>
            {`For ${brand.displayName} readers`}
          </div>
          <div style={{ marginTop: 24, fontSize: 96, lineHeight: 1.05, fontWeight: brand.fonts.headline.weight }}>
            {copy.headline}
          </div>
        </div>
        {footer(brand)}
      </div>
    );
  }
};
