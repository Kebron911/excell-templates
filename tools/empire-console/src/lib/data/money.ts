import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

/**
 * Operational money — reads ops/cache/money.json populated by n8n nightly-refresh.
 * Returns zeroed shape when cache is missing (Phase 3 stub state).
 *
 * n8n contract: nightly-refresh + revenue-watch + refund-spike-watch all
 * write to this same file (atomic temp + rename).
 */

const ChannelMetrics = z.object({
  name: z.string(),
  amount: z.number().default(0),
  share: z.number().default(0),
  orders: z.number().default(0),
  refunds: z.number().default(0),
});

const SkuRow = z.object({
  sku: z.string(),
  title: z.string().optional(),
  revenue: z.number().default(0),
  orders: z.number().default(0),
  refundRate: z.number().default(0),
});

const RefundSpike = z.object({
  sku: z.string(),
  refundCount24h: z.number(),
  refundRate24h: z.number(),
  triggerAt: z.string(),
});

const MoneyCacheSchema = z.object({
  generatedAt: z.string().optional(),
  yesterday: z.object({
    revenue: z.number().default(0),
    orders: z.number().default(0),
    refunds: z.number().default(0),
  }).default({ revenue: 0, orders: 0, refunds: 0 }),
  week: z.object({
    revenue: z.number().default(0),
    orders: z.number().default(0),
    refunds: z.number().default(0),
  }).default({ revenue: 0, orders: 0, refunds: 0 }),
  mtd: z.object({
    revenue: z.number().default(0),
    orders: z.number().default(0),
    refunds: z.number().default(0),
    burn: z.number().default(0),
  }).default({ revenue: 0, orders: 0, refunds: 0, burn: 0 }),
  channels: z.array(ChannelMetrics).default([]),
  topSkus: z.array(SkuRow).default([]),
  killSkuCandidates: z.array(SkuRow).default([]),
  refundSpikes: z.array(RefundSpike).default([]),
});

export type MoneyCache = z.infer<typeof MoneyCacheSchema>;

export interface MoneyReport extends MoneyCache {
  isCacheReady: boolean;
  aboveTheLineRatio: number | null;
}

const EMPTY: MoneyCache = {
  yesterday: { revenue: 0, orders: 0, refunds: 0 },
  week:      { revenue: 0, orders: 0, refunds: 0 },
  mtd:       { revenue: 0, orders: 0, refunds: 0, burn: 0 },
  channels: [],
  topSkus: [],
  killSkuCandidates: [],
  refundSpikes: [],
};

export async function readMoney(): Promise<MoneyReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.money, 'utf8'); }
  catch {
    return { ...EMPTY, isCacheReady: false, aboveTheLineRatio: null };
  }
  let parsed: MoneyCache;
  try { parsed = MoneyCacheSchema.parse(JSON.parse(raw)); }
  catch { return { ...EMPTY, isCacheReady: false, aboveTheLineRatio: null }; }

  const aboveTheLineRatio = parsed.mtd.burn > 0
    ? parsed.mtd.revenue / parsed.mtd.burn
    : null;

  return { ...parsed, isCacheReady: true, aboveTheLineRatio };
}
