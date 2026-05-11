import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const RiskSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['platform', 'financial', 'technical', 'legal', 'operational', 'strategic']),
  likelihood: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  mitigation: z.string().optional(),
  contingency: z.string().optional(),
  owner: z.string().optional(),
  last_reviewed: z.string().optional(),
  notes: z.string().optional(),
});
export type Risk = z.infer<typeof RiskSchema>;

const FileSchema = z.object({ risks: z.array(RiskSchema).default([]) });

export interface EnrichedRisk extends Risk {
  score: number;             // likelihood × impact (1-25)
  tier: 'critical' | 'high' | 'medium' | 'low';
  daysSinceReview: number | null;
  isStale: boolean;
}

export interface RiskReport {
  risks: EnrichedRisk[];
  critical: number;          // score ≥16
  high: number;              // score 10-15
  medium: number;            // score 5-9
  low: number;               // score <5
  staleCount: number;        // last_reviewed >180d
}

import { STALE_DAYS } from './staleness.js';

export async function readRisks(): Promise<RiskReport> {
  let raw: string;
  try { raw = await readFile(paths.risks, 'utf8'); }
  catch { return { risks: [], critical: 0, high: 0, medium: 0, low: 0, staleCount: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { risks: [] });

  const enriched: EnrichedRisk[] = parsed.risks.map((r) => {
    const score = r.likelihood * r.impact;
    const tier: EnrichedRisk['tier'] =
      score >= 16 ? 'critical' :
      score >= 10 ? 'high' :
      score >= 5  ? 'medium' : 'low';
    const daysSinceReview = r.last_reviewed
      ? Math.floor((Date.now() - new Date(r.last_reviewed).getTime()) / 86_400_000)
      : null;
    return { ...r, score, tier, daysSinceReview, isStale: daysSinceReview === null || daysSinceReview > STALE_DAYS.risk };
  }).sort((a, b) => b.score - a.score);

  return {
    risks: enriched,
    critical: enriched.filter((r) => r.tier === 'critical').length,
    high: enriched.filter((r) => r.tier === 'high').length,
    medium: enriched.filter((r) => r.tier === 'medium').length,
    low: enriched.filter((r) => r.tier === 'low').length,
    staleCount: enriched.filter((r) => r.isStale).length,
  };
}
