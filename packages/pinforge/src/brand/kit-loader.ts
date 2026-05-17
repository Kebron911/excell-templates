import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { BrandNotFoundError, ValidationError } from "../errors.js";
import { BrandKitSchema, type BrandKit } from "./schema.js";

const BRAND_ID_RE = /^[a-z0-9-]+$/;

export async function listBrandIds(brandsDir: string): Promise<string[]> {
  const entries = await readdir(brandsDir);
  return entries
    .filter(e => e.endsWith(".json"))
    .map(e => e.replace(/\.json$/, ""))
    .sort();
}

export async function loadBrandKit(brandId: string, brandsDir: string): Promise<BrandKit> {
  if (!BRAND_ID_RE.test(brandId)) {
    throw new ValidationError(`Invalid brandId '${brandId}' — must match ${BRAND_ID_RE}`, { brandId });
  }
  const filePath = join(brandsDir, `${brandId}.json`);
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    const available = await listBrandIds(brandsDir);
    throw new BrandNotFoundError(brandId, available);
  }
  const parsed = BrandKitSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new ValidationError(`Brand kit '${brandId}' failed schema validation`, { issues: parsed.error.issues });
  }
  return parsed.data;
}
