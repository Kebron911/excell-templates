import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const CompetitorSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  tier: z.enum(['direct', 'adjacent', 'aspirational']),
  category: z.string().optional(),
  pricing: z.string().optional(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  moves: z.array(z.string()).default([]),
  last_checked: z.string().optional(),
  notes: z.string().optional(),
});
export type Competitor = z.infer<typeof CompetitorSchema>;

const FileSchema = z.object({ competitors: z.array(CompetitorSchema).default([]) });

export interface CompetitorReport {
  competitors: (Competitor & { daysSinceCheck: number | null; isStale: boolean })[];
  byTier: { direct: number; adjacent: number; aspirational: number };
  staleCount: number;
}

import { STALE_DAYS } from './staleness.js';

export async function readCompetitors(): Promise<CompetitorReport> {
  let raw: string;
  try { raw = await readFile(paths.competitors, 'utf8'); }
  catch { return { competitors: [], byTier: { direct: 0, adjacent: 0, aspirational: 0 }, staleCount: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { competitors: [] });
  const enriched = parsed.competitors.map((c) => {
    const daysSinceCheck = c.last_checked
      ? Math.floor((Date.now() - new Date(c.last_checked).getTime()) / 86_400_000)
      : null;
    return { ...c, daysSinceCheck, isStale: daysSinceCheck === null || daysSinceCheck > STALE_DAYS.competitor };
  });
  return {
    competitors: enriched,
    byTier: {
      direct: enriched.filter((c) => c.tier === 'direct').length,
      adjacent: enriched.filter((c) => c.tier === 'adjacent').length,
      aspirational: enriched.filter((c) => c.tier === 'aspirational').length,
    },
    staleCount: enriched.filter((c) => c.isStale).length,
  };
}
