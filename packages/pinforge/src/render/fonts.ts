import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BrandKit } from "../brand/schema.js";

export interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: "normal" | "italic";
}

const FONT_CACHE = new Map<string, Promise<SatoriFont[]>>();

export async function loadBrandFonts(brand: BrandKit, brandsDir: string): Promise<SatoriFont[]> {
  const cacheKey = `${brand.brandId}|${brandsDir}`;
  const cached = FONT_CACHE.get(cacheKey);
  if (cached) return cached;

  const promise = loadFonts(brand, brandsDir);
  FONT_CACHE.set(cacheKey, promise);
  // If load fails, don't cache the rejection — let the next call retry
  promise.catch(() => FONT_CACHE.delete(cacheKey));
  return promise;
}

async function loadFonts(brand: BrandKit, brandsDir: string): Promise<SatoriFont[]> {
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

/** Test helper — clears cache between tests if needed. */
export function _clearFontCache(): void {
  FONT_CACHE.clear();
}
