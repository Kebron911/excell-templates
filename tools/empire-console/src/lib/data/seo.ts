import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

/**
 * SEO cache — written by n8n nightly-refresh (Search Console + PSI/CrUX).
 * Returns zeroed shape when cache missing.
 */

const QueryRow = z.object({
  query: z.string(),
  impressions: z.number().default(0),
  clicks: z.number().default(0),
  position: z.number().default(0),
  deltaPosition: z.number().default(0),
});

const StrikingDistance = z.object({
  query: z.string(),
  position: z.number(),
  impressions: z.number(),
  page: z.string().optional(),
});

const IndexingIssue = z.object({
  url: z.string(),
  status: z.string(),
  detectedAt: z.string(),
});

const SeoCacheSchema = z.object({
  generatedAt: z.string().optional(),
  gsc: z.object({
    impressions: z.number().default(0),
    clicks: z.number().default(0),
    ctr: z.number().default(0),
    avgPosition: z.number().default(0),
    indexingErrors: z.number().default(0),
  }).default({ impressions: 0, clicks: 0, ctr: 0, avgPosition: 0, indexingErrors: 0 }),
  cwv: z.object({
    pagesGood: z.number().default(0),
    pagesNeedsImprovement: z.number().default(0),
    pagesPoor: z.number().default(0),
    worstLcpMs: z.number().nullable().default(null),
    worstCls: z.number().nullable().default(null),
    worstInpMs: z.number().nullable().default(null),
  }).default({
    pagesGood: 0, pagesNeedsImprovement: 0, pagesPoor: 0,
    worstLcpMs: null, worstCls: null, worstInpMs: null,
  }),
  topQueries: z.array(QueryRow).default([]),
  strikingDistance: z.array(StrikingDistance).default([]),
  indexingIssues: z.array(IndexingIssue).default([]),
});

export type SeoCache = z.infer<typeof SeoCacheSchema>;

export interface SeoReport extends SeoCache {
  isCacheReady: boolean;
}

const EMPTY: SeoCache = {
  gsc: { impressions: 0, clicks: 0, ctr: 0, avgPosition: 0, indexingErrors: 0 },
  cwv: {
    pagesGood: 0, pagesNeedsImprovement: 0, pagesPoor: 0,
    worstLcpMs: null, worstCls: null, worstInpMs: null,
  },
  topQueries: [],
  strikingDistance: [],
  indexingIssues: [],
};

export async function readSeo(): Promise<SeoReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.seo, 'utf8'); }
  catch { return { ...EMPTY, isCacheReady: false }; }
  try {
    const parsed = SeoCacheSchema.parse(JSON.parse(raw));
    return { ...parsed, isCacheReady: true };
  } catch {
    return { ...EMPTY, isCacheReady: false };
  }
}
