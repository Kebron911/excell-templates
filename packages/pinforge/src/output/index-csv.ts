import { appendFile, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";
import type { PinMetadata } from "../input.js";

const HEADER = "slug,brandId,templateId,title,destinationUrl,boardHint,fallbackUsed,backgroundSource,hashtags\n";

export interface AppendIndexInput {
  outputDir: string;
  date: string;
  slug: string;
  metadata: PinMetadata;
}

export async function appendIndexCsv(input: AppendIndexInput): Promise<void> {
  const indexPath = join(input.outputDir, input.date, "_index.csv");
  try {
    await access(indexPath, constants.F_OK);
  } catch {
    await writeFile(indexPath, HEADER, "utf8");
  }
  const m = input.metadata;
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const row = [
    input.slug, m.brandId, m.templateId,
    escape(m.title), m.destinationUrl, escape(m.boardHint),
    String(m.fallbackUsed), m.backgroundSource,
    escape(m.hashtags.join(" "))
  ].join(",") + "\n";
  await appendFile(indexPath, row, "utf8");
}
