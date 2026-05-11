import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

const TopPin = z.object({
  pin_id: z.string(),
  blog_post_slug: z.string().optional(),
  title: z.string().default(''),
  style: z.string().optional(),
  impressions_30d: z.number().default(0),
  saves_30d: z.number().default(0),
  outbound_clicks_30d: z.number().default(0),
  pin_url: z.string().optional(),
});

export const PinterestCacheSchema = z.object({
  generatedAt: z.string().optional(),
  pins_published_7d: z.number().default(0),
  pins_published_30d: z.number().default(0),
  impressions_7d: z.number().default(0),
  impressions_30d: z.number().default(0),
  saves_30d: z.number().default(0),
  outbound_clicks_30d: z.number().default(0),
  ctr_30d: z.number().default(0),
  top_pins: z.array(TopPin).default([]),
});

export type PinterestCache = z.infer<typeof PinterestCacheSchema>;

export interface PinterestReport extends PinterestCache {
  isCacheReady: boolean;
}

const EMPTY: PinterestCache = {
  pins_published_7d: 0,
  pins_published_30d: 0,
  impressions_7d: 0,
  impressions_30d: 0,
  saves_30d: 0,
  outbound_clicks_30d: 0,
  ctr_30d: 0,
  top_pins: [],
};

export async function readPinterest(): Promise<PinterestReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.pinterest, 'utf8'); }
  catch { return { ...EMPTY, isCacheReady: false }; }
  try {
    const parsed = PinterestCacheSchema.parse(JSON.parse(raw));
    return { ...parsed, isCacheReady: true };
  } catch {
    return { ...EMPTY, isCacheReady: false };
  }
}
