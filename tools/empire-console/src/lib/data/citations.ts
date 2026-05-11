import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const Citation = z.object({
  platform: z.string(),
  tier: z.enum(['T1', 'T2', 'T3']).default('T3'),
  url: z.string().default(''),
  state: z.enum(['pending', 'live', 'stale', 'broken']).default('pending'),
  last_refresh: z.string().nullable().default(null),
  bio_version: z.string().nullable().default(null),
  notes: z.string().optional(),
});

export type Citation = z.infer<typeof Citation>;

const CitationsFileSchema = z.object({
  citations: z.array(Citation).default([]),
});

export interface CitationsReport {
  citations: Citation[];
  byTier: Record<'T1' | 'T2' | 'T3', Citation[]>;
  counts: { live: number; pending: number; stale: number; broken: number; total: number };
}

const STALE_DAYS = 90;

function isStale(c: Citation): boolean {
  if (c.state !== 'live' || !c.last_refresh) return false;
  const ms = new Date(c.last_refresh).getTime();
  if (Number.isNaN(ms)) return false;
  return (Date.now() - ms) / 86_400_000 > STALE_DAYS;
}

export async function readCitations(): Promise<CitationsReport> {
  let raw: string;
  try { raw = await readFile(paths.citations, 'utf8'); }
  catch { return empty(); }

  let parsed;
  try { parsed = CitationsFileSchema.parse(parseYaml(raw) ?? {}); }
  catch { return empty(); }

  const citations = parsed.citations.map((c) => ({
    ...c,
    state: isStale(c) ? ('stale' as const) : c.state,
  }));

  const byTier = { T1: [] as Citation[], T2: [] as Citation[], T3: [] as Citation[] };
  for (const c of citations) byTier[c.tier].push(c);

  const counts = {
    live: citations.filter((c) => c.state === 'live').length,
    pending: citations.filter((c) => c.state === 'pending').length,
    stale: citations.filter((c) => c.state === 'stale').length,
    broken: citations.filter((c) => c.state === 'broken').length,
    total: citations.length,
  };

  return { citations, byTier, counts };
}

function empty(): CitationsReport {
  return {
    citations: [],
    byTier: { T1: [], T2: [], T3: [] },
    counts: { live: 0, pending: 0, stale: 0, broken: 0, total: 0 },
  };
}
