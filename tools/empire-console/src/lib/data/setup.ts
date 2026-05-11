import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { resolve } from 'node:path';
import { paths } from '../paths.js';

/**
 * Setup checklist — Phase 5 activation steps from `ops/setup-checklist.yaml`.
 * Read by /maintain/setup. Daniel marks items by editing the YAML status field.
 */

const SetupStatus = z.enum(['pending', 'in-progress', 'done', 'skipped']);
export type SetupStatus = z.infer<typeof SetupStatus>;

const SetupItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: SetupStatus.default('pending'),
  link: z.string().optional(),
  note: z.string().optional(),
  requires: z.union([z.string(), z.array(z.string())]).optional()
    .transform((v) => Array.isArray(v) ? v : v ? [v] : []),
});
export type SetupItem = z.infer<typeof SetupItemSchema>;

const SetupCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  items: z.array(SetupItemSchema).default([]),
});
export type SetupCategory = z.infer<typeof SetupCategorySchema>;

const SetupFileSchema = z.object({
  categories: z.array(SetupCategorySchema).default([]),
});

export interface SetupReport {
  categories: SetupCategory[];
  totals: {
    total: number;
    done: number;
    inProgress: number;
    skipped: number;
    pending: number;
    percentComplete: number; // 0–100, counting done+skipped as completed
  };
  /** Next concrete action: first item whose status is pending or in-progress, in YAML order. */
  nextAction: { categoryLabel: string; item: SetupItem } | null;
}

const PATH = resolve(paths.ops, 'setup-checklist.yaml');

export async function readSetup(): Promise<SetupReport> {
  let raw: string;
  try { raw = await readFile(PATH, 'utf8'); }
  catch {
    return {
      categories: [],
      totals: { total: 0, done: 0, inProgress: 0, skipped: 0, pending: 0, percentComplete: 0 },
      nextAction: null,
    };
  }
  const parsed = SetupFileSchema.parse(parseYaml(raw) ?? { categories: [] });
  const allItems = parsed.categories.flatMap((c) => c.items.map((i) => ({ cat: c, item: i })));

  const done = allItems.filter((x) => x.item.status === 'done').length;
  const inProgress = allItems.filter((x) => x.item.status === 'in-progress').length;
  const skipped = allItems.filter((x) => x.item.status === 'skipped').length;
  const pending = allItems.filter((x) => x.item.status === 'pending').length;
  const total = allItems.length;
  const percentComplete = total === 0 ? 0 : Math.round(((done + skipped) / total) * 100);

  const next = allItems.find((x) => x.item.status === 'pending' || x.item.status === 'in-progress');

  return {
    categories: parsed.categories,
    totals: { total, done, inProgress, skipped, pending, percentComplete },
    nextAction: next ? { categoryLabel: next.cat.label, item: next.item } : null,
  };
}
