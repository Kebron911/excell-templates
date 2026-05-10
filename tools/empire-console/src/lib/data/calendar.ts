import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const ItemSchema = z.object({
  label: z.string(),
  category: z.enum(['tax', 'sales-tax', 'filing', 'insurance', 'renewal', 'content', 'review']),
  cadence: z.enum(['weekly', 'monthly', 'quarterly', 'annual', 'one-off']),
  next_due: z.string(),
  owner: z.string().optional(),
  notes: z.string().optional(),
});
export type CalendarItem = z.infer<typeof ItemSchema>;

const FileSchema = z.object({ items: z.array(ItemSchema).default([]) });

export interface CalendarReport {
  items: (CalendarItem & { daysUntil: number; isOverdue: boolean; isDueSoon: boolean })[];
  overdue: number;
  dueWithin7d: number;
  dueWithin30d: number;
}

export async function readCalendar(): Promise<CalendarReport> {
  let raw: string;
  try { raw = await readFile(paths.calendar, 'utf8'); }
  catch { return { items: [], overdue: 0, dueWithin7d: 0, dueWithin30d: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { items: [] });
  const now = Date.now();
  const enriched = parsed.items.map((it) => {
    const dueMs = new Date(it.next_due).getTime();
    const daysUntil = Math.floor((dueMs - now) / 86_400_000);
    return { ...it, daysUntil, isOverdue: daysUntil < 0, isDueSoon: daysUntil >= 0 && daysUntil <= 7 };
  }).sort((a, b) => a.daysUntil - b.daysUntil);
  return {
    items: enriched,
    overdue: enriched.filter((i) => i.isOverdue).length,
    dueWithin7d: enriched.filter((i) => i.isDueSoon).length,
    dueWithin30d: enriched.filter((i) => i.daysUntil >= 0 && i.daysUntil <= 30).length,
  };
}
