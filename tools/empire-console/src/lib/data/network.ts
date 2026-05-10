import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const Person = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['mentor', 'advisor', 'peer', 'customer', 'partner', 'other']),
  category: z.enum(['finance', 'tech', 'str-niche', 'marketing', 'legal', 'other']).optional(),
  contact: z.string().optional(),
  last_contact: z.string().optional(),
  context: z.string().optional(),
  ask_debt: z.enum(['me-owes', 'them-owes', 'balanced']).optional(),
  notes: z.string().optional(),
});
export type NetworkPerson = z.infer<typeof Person>;
// Tolerate `people:` with no items (YAML null) — treat as empty.
const FileSchema = z.object({
  people: z.array(Person).nullable().default([]).transform((v) => v ?? []),
});

import { STALE_DAYS } from './staleness.js';

export interface NetworkReport {
  people: (NetworkPerson & { daysSinceContact: number | null; isCold: boolean })[];
  total: number;
  cold: number;
  meOwesCount: number;
  byRole: Record<string, number>;
}

export async function readNetwork(): Promise<NetworkReport> {
  let raw: string;
  try { raw = await readFile(paths.network, 'utf8'); }
  catch { return { people: [], total: 0, cold: 0, meOwesCount: 0, byRole: {} }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { people: [] });

  const enriched = parsed.people.map((p) => {
    const daysSinceContact = p.last_contact
      ? Math.floor((Date.now() - new Date(p.last_contact).getTime()) / 86_400_000)
      : null;
    return { ...p, daysSinceContact, isCold: daysSinceContact === null || daysSinceContact > STALE_DAYS.networkContact };
  }).sort((a, b) => (a.daysSinceContact ?? 9999) > (b.daysSinceContact ?? 9999) ? -1 : 1);

  const byRole = enriched.reduce<Record<string, number>>((acc, p) => {
    acc[p.role] = (acc[p.role] ?? 0) + 1; return acc;
  }, {});

  return {
    people: enriched,
    total: enriched.length,
    cold: enriched.filter((p) => p.isCold).length,
    meOwesCount: enriched.filter((p) => p.ask_debt === 'me-owes').length,
    byRole,
  };
}
