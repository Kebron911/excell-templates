import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const MetricSchema = z.object({
  metric: z.string(),
  unit: z.enum(['usd', 'count', 'percent']),
  period: z.enum(['month', 'quarter', 'year']),
  target: z.number(),
  actual: z.number().default(0),
  updated: z.string().optional(),
  notes: z.string().optional(),
});
export type TargetMetric = z.infer<typeof MetricSchema>;

const PeriodSchema = z.object({
  label: z.string(),
  start: z.string(),
  end: z.string(),
  metrics: z.array(MetricSchema).default([]),
});
export type TargetPeriod = z.infer<typeof PeriodSchema>;

const FileSchema = z.object({
  quarter: PeriodSchema.optional(),
  month: PeriodSchema.optional(),
  year: PeriodSchema.optional(),
});

export interface EnrichedMetric extends TargetMetric {
  /** % of target achieved (0–1+, can exceed 1) */
  progressRatio: number;
  /** % of period elapsed (0–1) */
  paceRatio: number;
  /** + = ahead, − = behind, 0 = on pace. Compares progress vs pace. */
  paceDelta: number;
  status: 'ahead' | 'on-pace' | 'behind' | 'critical';
}

export interface TargetsReport {
  quarter: { label: string; metrics: EnrichedMetric[] } | null;
  month:   { label: string; metrics: EnrichedMetric[] } | null;
}

export async function readTargets(): Promise<TargetsReport> {
  let raw: string;
  try { raw = await readFile(paths.targets, 'utf8'); }
  catch { return { quarter: null, month: null }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? {});

  return {
    quarter: parsed.quarter ? { label: parsed.quarter.label, metrics: enrich(parsed.quarter) } : null,
    month:   parsed.month   ? { label: parsed.month.label,   metrics: enrich(parsed.month)   } : null,
  };
}

function enrich(p: TargetPeriod): EnrichedMetric[] {
  const start = new Date(p.start).getTime();
  const end = new Date(p.end).getTime();
  const now = Date.now();
  const paceRatio = Math.max(0, Math.min(1, (now - start) / Math.max(1, end - start)));
  return p.metrics.map((m) => {
    const progressRatio = m.target > 0 ? m.actual / m.target : 0;
    const paceDelta = progressRatio - paceRatio;
    const status: EnrichedMetric['status'] =
      paceDelta > 0.05 ? 'ahead' :
      paceDelta > -0.05 ? 'on-pace' :
      paceDelta > -0.20 ? 'behind' : 'critical';
    return { ...m, progressRatio, paceRatio, paceDelta, status };
  });
}

/** Worst-status metric across both periods — for the Today scorecard. */
export function worstStatus(report: TargetsReport): EnrichedMetric | null {
  const all = [...(report.month?.metrics ?? []), ...(report.quarter?.metrics ?? [])];
  if (!all.length) return null;
  const order = { critical: 3, behind: 2, 'on-pace': 1, ahead: 0 };
  return all.sort((a, b) => order[b.status] - order[a.status])[0];
}
