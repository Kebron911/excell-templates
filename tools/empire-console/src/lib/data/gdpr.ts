import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { resolve } from 'node:path';
import { paths } from '../paths.js';

/**
 * GDPR requests log — written by the n8n gdpr-intake webhook (one JSON line
 * per request). Read by /maintain/compliance for triage.
 */

export const GdprRequestSchema = z.object({
  id: z.string(),
  email: z.string(),
  type: z.enum(['access', 'erasure', 'portability', 'rectification', 'restriction', 'objection', 'other']),
  details: z.string().default(''),
  origin: z.string().default(''),
  ts: z.string(),
  dueAt: z.string(),
  status: z.enum(['open', 'in-progress', 'resolved', 'rejected']).default('open'),
});

export type GdprRequest = z.infer<typeof GdprRequestSchema>;

export interface GdprReport {
  requests: GdprRequest[];
  totals: {
    total: number;
    open: number;
    overdue: number;
    dueWithin7d: number;
    byType: Record<string, number>;
  };
}

const GDPR_PATH = resolve(paths.ops, 'gdpr-requests.ndjson');

export async function readGdpr(): Promise<GdprReport> {
  let raw: string;
  try { raw = await readFile(GDPR_PATH, 'utf8'); }
  catch {
    return { requests: [], totals: { total: 0, open: 0, overdue: 0, dueWithin7d: 0, byType: {} } };
  }
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const requests: GdprRequest[] = [];
  for (const line of lines) {
    try { requests.push(GdprRequestSchema.parse(JSON.parse(line))); }
    catch { /* skip malformed lines silently — surface count via lines.length - requests.length if needed */ }
  }
  requests.sort((a, b) => b.ts.localeCompare(a.ts));

  const now = Date.now();
  const byType: Record<string, number> = {};
  for (const r of requests) {
    byType[r.type] = (byType[r.type] ?? 0) + 1;
  }
  return {
    requests,
    totals: {
      total: requests.length,
      open: requests.filter((r) => r.status === 'open' || r.status === 'in-progress').length,
      overdue: requests.filter((r) =>
        (r.status === 'open' || r.status === 'in-progress') &&
        new Date(r.dueAt).getTime() < now,
      ).length,
      dueWithin7d: requests.filter((r) => {
        if (r.status === 'resolved' || r.status === 'rejected') return false;
        const ms = new Date(r.dueAt).getTime() - now;
        return ms > 0 && ms <= 7 * 864e5;
      }).length,
      byType,
    },
  };
}
