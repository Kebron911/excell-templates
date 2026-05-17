import { open, appendFile } from "node:fs/promises";
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

  // Atomic create-with-header: succeeds for first writer, EEXIST for others
  try {
    const handle = await open(indexPath, "wx");
    await handle.writeFile(HEADER, "utf8");
    await handle.close();
  } catch (e: unknown) {
    // EEXIST is expected if another worker created it first
    if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
  }

  // append the row (multiple appends are individually atomic at OS level for small writes)
  const m = input.metadata;
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const row = [
    escape(input.slug),
    escape(m.brandId),
    escape(m.templateId),
    escape(m.title),
    escape(m.destinationUrl),
    escape(m.boardHint),
    String(m.fallbackUsed),
    escape(m.backgroundSource),
    escape(m.hashtags.join(" "))
  ].join(",") + "\n";
  await appendFile(indexPath, row, "utf8");
}
