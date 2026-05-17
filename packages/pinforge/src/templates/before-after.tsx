import type { PinTemplate } from "./types.js";
import { footer, renderBackground } from "./background.js";

export const beforeAfterTemplate: PinTemplate = {
  id: "before-after",
  displayName: "Before / After",
  supports: ["solid", "gradient", "image"] as const,
  dimensions: { width: 1000, height: 1500 },
  render({ brand, copy, background }) {
    return (
      <div style={{ position: "relative", width: 1000, height: 1500, display: "flex", fontFamily: brand.fonts.headline.family, color: brand.colors.text }}>
        {renderBackground(brand, background)}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 720, background: "linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 30, left: 30, background: "#fecaca", color: "#7f1d1d", padding: "6px 18px", fontSize: 22, fontWeight: 800, borderRadius: 999 }}>BEFORE</div>
          <div style={{ fontSize: 56, textAlign: "center", padding: "0 60px", lineHeight: 1.2 }}>{copy.beforeText ?? copy.headline}</div>
        </div>
        <div style={{ position: "absolute", top: 780, left: 0, right: 0, height: 720, background: "linear-gradient(180deg, #065f46 0%, #022c22 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 30, left: 30, background: "#a7f3d0", color: "#065f46", padding: "6px 18px", fontSize: 22, fontWeight: 800, borderRadius: 999 }}>AFTER</div>
          <div style={{ fontSize: 56, textAlign: "center", padding: "0 60px", lineHeight: 1.2 }}>{copy.afterText ?? ""}</div>
        </div>
        <div style={{ position: "absolute", top: 720, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 900, background: brand.colors.text, color: brand.colors.primaryDark }}>VS</div>
        {footer(brand)}
      </div>
    );
  }
};
