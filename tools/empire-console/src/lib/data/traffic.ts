import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

/**
 * Traffic cache — written by n8n nightly-refresh (Plausible primary, GA4 secondary).
 * Returns zeroed shape when cache missing.
 */

const SiteSessions = z.object({
  id: z.string(),
  name: z.string(),
  sessions: z.number().default(0),
  users: z.number().default(0),
  deltaPct14d: z.number().nullable().default(null),
});

const SourceRow = z.object({
  source: z.string(),
  sessions: z.number().default(0),
  share: z.number().default(0),
});

const Anomaly = z.object({
  siteId: z.string(),
  dropPct: z.number(),
  baseline14d: z.number(),
  yesterday: z.number(),
  triggerAt: z.string(),
});

const TrafficCacheSchema = z.object({
  generatedAt: z.string().optional(),
  yesterday: z.object({
    sessions: z.number().default(0),
    users: z.number().default(0),
  }).default({ sessions: 0, users: 0 }),
  week: z.object({
    sessions: z.number().default(0),
    users: z.number().default(0),
  }).default({ sessions: 0, users: 0 }),
  mtd: z.object({
    sessions: z.number().default(0),
    users: z.number().default(0),
  }).default({ sessions: 0, users: 0 }),
  bySite: z.array(SiteSessions).default([]),
  topSources: z.array(SourceRow).default([]),
  anomalies: z.array(Anomaly).default([]),
});

export type TrafficCache = z.infer<typeof TrafficCacheSchema>;

export interface TrafficReport extends TrafficCache {
  isCacheReady: boolean;
}

const DEFAULT_SITES = [
  { id: 'thestrledger', name: 'thestrledger.com' },
  { id: 'strguests',    name: 'strguests.tools'  },
  { id: 'strhost',      name: 'strhost.tools'    },
  { id: 'strops',       name: 'strops.tools'     },
  { id: 'strbuyers',    name: 'strbuyers.tools'  },
];

const EMPTY: TrafficCache = {
  yesterday: { sessions: 0, users: 0 },
  week:      { sessions: 0, users: 0 },
  mtd:       { sessions: 0, users: 0 },
  bySite: DEFAULT_SITES.map((s) => ({ ...s, sessions: 0, users: 0, deltaPct14d: null })),
  topSources: [],
  anomalies: [],
};

export async function readTraffic(): Promise<TrafficReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.traffic, 'utf8'); }
  catch { return { ...EMPTY, isCacheReady: false }; }
  try {
    const parsed = TrafficCacheSchema.parse(JSON.parse(raw));
    return { ...parsed, isCacheReady: true };
  } catch {
    return { ...EMPTY, isCacheReady: false };
  }
}
