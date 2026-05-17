import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const SAFE_SLUG = /^[a-z0-9-]+$/;
const SAFE_BRAND = /^[a-z0-9-]+$/;

export interface FetchPinInput {
  outputDir: string;
  slug: string;
}

export interface FetchedPin {
  metadata: unknown;
  pngPath: string;
  jsonPath: string;
  date: string;
  brandId: string;
}

export async function fetchPinBySlug(input: FetchPinInput): Promise<FetchedPin | null> {
  if (!SAFE_SLUG.test(input.slug)) return null;

  // Walk outputDir/<YYYY-MM-DD>/<brandId>/<slug>.json — latest date first
  let dates: string[] = [];
  try {
    dates = (await readdir(input.outputDir))
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();
  } catch {
    return null;
  }

  for (const date of dates) {
    let brands: string[] = [];
    try {
      brands = (await readdir(join(input.outputDir, date))).filter(b => SAFE_BRAND.test(b));
    } catch {
      continue;
    }
    for (const brand of brands) {
      const jsonPath = join(input.outputDir, date, brand, `${input.slug}.json`);
      const pngPath = join(input.outputDir, date, brand, `${input.slug}.png`);
      try {
        const raw = await readFile(jsonPath, "utf8");
        return {
          metadata: JSON.parse(raw),
          pngPath,
          jsonPath,
          date,
          brandId: brand
        };
      } catch {
        // not in this brand dir, continue
      }
    }
  }
  return null;
}
