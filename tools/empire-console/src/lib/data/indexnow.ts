import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

const Submission = z.object({
  url: z.string(),
  submitted_at: z.string(),
  gsc_status: z.union([z.string(), z.number()]).optional(),
  bing_status: z.union([z.string(), z.number()]).optional(),
  yandex_status: z.union([z.string(), z.number()]).optional(),
  pinterest_status: z.union([z.string(), z.number()]).optional(),
  success_count: z.number().default(0),
});

export const IndexNowCacheSchema = z.object({
  generatedAt: z.string().optional(),
  submissions_24h: z.number().default(0),
  submissions_7d: z.number().default(0),
  errors_7d: z.number().default(0),
  last_submission_at: z.string().nullable().default(null),
  recent_submissions: z.array(Submission).default([]),
});

export type IndexNowCache = z.infer<typeof IndexNowCacheSchema>;

export interface IndexNowReport extends IndexNowCache {
  isCacheReady: boolean;
}

const EMPTY: IndexNowCache = {
  submissions_24h: 0,
  submissions_7d: 0,
  errors_7d: 0,
  last_submission_at: null,
  recent_submissions: [],
};

export async function readIndexNow(): Promise<IndexNowReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.indexnow, 'utf8'); }
  catch { return { ...EMPTY, isCacheReady: false }; }
  try {
    const parsed = IndexNowCacheSchema.parse(JSON.parse(raw));
    return { ...parsed, isCacheReady: true };
  } catch {
    return { ...EMPTY, isCacheReady: false };
  }
}
