import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const listicleTemplate: PinTemplate = {
  id: "listicle",
  displayName: "Listicle",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    const items = copy.items ?? [];
    const useWhiteBanner = background.type === "image" && background.treatment === "white-banner";
    const textColor = useWhiteBanner ? brand.colors.textOnLight : brand.colors.text;
    const bannerStyle = useWhiteBanner
      ? { background: "rgba(255,255,255,0.95)", padding: "40px 50px", borderRadius: 0 }
      : {};

    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.body.family, color: textColor }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", top: 80, left: 60, right: 60, display: "flex", flexDirection: "column", ...bannerStyle }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: useWhiteBanner ? brand.colors.primary : brand.colors.accent, textTransform: "uppercase", fontWeight: 600 }}>
            {brand.displayName}
          </div>
          <div style={{ marginTop: 16, fontSize: 64, lineHeight: 1.1, fontWeight: brand.fonts.headline.weight, fontFamily: brand.fonts.headline.family }}>
            {copy.headline}
          </div>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
            {items.slice(0, 7).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 18, fontSize: 36, lineHeight: 1.3 }}>
                <span style={{ minWidth: 56, fontWeight: brand.fonts.headline.weight, color: useWhiteBanner ? brand.colors.primary : brand.colors.accent }}>{`${i + 1}.`}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        {footer(brand)}
      </div>
    );
  }
};
