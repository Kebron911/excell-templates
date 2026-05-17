import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BrandKit } from "../brand/schema.js";

export interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: "normal" | "italic";
}

export async function loadBrandFonts(brand: BrandKit, brandsDir: string): Promise<SatoriFont[]> {
  const specs = [brand.fonts.headline, brand.fonts.body, brand.fonts.accent];
  return Promise.all(specs.map(async (s) => {
    const buf = await readFile(join(brandsDir, s.file));
    return {
      name: s.family,
      data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
      weight: s.weight,
      style: "normal" as const
    };
  }));
}
