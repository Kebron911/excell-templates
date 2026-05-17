import type { ReactNode } from "react";
import type { BrandKit } from "../brand/schema.js";
import type { RenderedBackground } from "./types.js";

/**
 * Common background renderer used by all templates.
 * Handles solid / gradient / image + treatment overlay.
 * Returns absolutely-positioned elements that fill 1000x1500.
 */
export function renderBackground(brand: BrandKit, bg: RenderedBackground): ReactNode {
  if (bg.type === "solid") {
    return <div style={{ position: "absolute", inset: 0, display: "flex", background: brand.colors.primaryDark }} />;
  }
  if (bg.type === "gradient") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.primaryDark} 100%)`
        }}
      />
    );
  }
  // type === "image"
  if (!bg.imageBuffer) {
    throw new Error("background.imageBuffer required when type='image'");
  }
  const dataUri = `data:image/png;base64,${bg.imageBuffer.toString("base64")}`;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `url(${dataUri})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: bg.treatment === "duotone" ? "grayscale(1)" : "none"
        }}
      />
      {bg.treatment === "bottom-gradient" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)"
          }}
        />
      )}
      {bg.treatment === "duotone" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(135deg, ${brand.colors.primary}CC, ${brand.colors.primaryDark}E0)`
          }}
        />
      )}
    </div>
  );
}

export function footer(brand: BrandKit): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 18,
        letterSpacing: 3,
        color: brand.colors.text,
        background: "rgba(0,0,0,0.25)"
      }}
    >
      {brand.logo.footerText}
    </div>
  );
}
