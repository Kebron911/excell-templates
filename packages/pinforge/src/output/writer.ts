import { mkdir, rename, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { OutputWriteError } from "../errors.js";
import type { PinMetadata } from "../input.js";
import { appendIndexCsv } from "./index-csv.js";

const SAFE_RE = /^[a-z0-9-]+$/;

export interface WritePinInput {
  outputDir: string;
  slug: string;
  date: string;
  png: Buffer;
  metadata: PinMetadata;
}

export interface WrittenPaths {
  png: string;
  json: string;
}

export async function writePin(input: WritePinInput): Promise<WrittenPaths> {
  if (!SAFE_RE.test(input.slug)) throw new OutputWriteError(`Unsafe slug: ${input.slug}`, { slug: input.slug });
  if (!SAFE_RE.test(input.metadata.brandId)) throw new OutputWriteError(`Unsafe brandId: ${input.metadata.brandId}`, { brandId: input.metadata.brandId });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new OutputWriteError(`Unsafe date: ${input.date}`, { date: input.date });

  const dayDir = join(input.outputDir, input.date, input.metadata.brandId);
  await mkdir(dayDir, { recursive: true });

  const pngPath = resolve(dayDir, `${input.slug}.png`);
  const jsonPath = resolve(dayDir, `${input.slug}.json`);
  const pngTmp = `${pngPath}.tmp`;
  const jsonTmp = `${jsonPath}.tmp`;

  const metaWithPath: PinMetadata = {
    ...input.metadata,
    imagePath: `pins/${input.date}/${input.metadata.brandId}/${input.slug}.png`
  };

  try {
    await writeFile(pngTmp, input.png);
    await writeFile(jsonTmp, JSON.stringify(metaWithPath, null, 2) + "\n", "utf8");
    await rename(pngTmp, pngPath);
    await rename(jsonTmp, jsonPath);
  } catch (e) {
    throw new OutputWriteError(`Failed to write pin: ${e instanceof Error ? e.message : String(e)}`, { slug: input.slug, cause: String(e) });
  }

  await appendIndexCsv({ outputDir: input.outputDir, date: input.date, metadata: metaWithPath, slug: input.slug });

  return { png: pngPath, json: jsonPath };
}
