import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

const Row = z.object({
  detected_at: z.string(),
  embedder_domain: z.string(),
  embedder_url: z.string().optional(),
  widget_id: z.string().optional(),
  linked_customer_id: z.string().nullable().default(null),
  referrer_visits_30d: z.number().default(0),
  still_present: z.boolean().default(true),
  last_verified: z.string().optional(),
});

export type CustomerEmbed = z.infer<typeof Row>;

export interface CustomerEmbedsReport {
  rows: CustomerEmbed[];
  active: CustomerEmbed[];
  lost: CustomerEmbed[];
  totalReferrerVisits30d: number;
}

export async function readCustomerEmbeds(): Promise<CustomerEmbedsReport> {
  let raw: string;
  try { raw = await readFile(paths.customerEmbeds, 'utf8'); }
  catch { return empty(); }

  const rows: CustomerEmbed[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('{"_schema"')) continue;
    try { rows.push(Row.parse(JSON.parse(trimmed))); }
    catch { /* skip */ }
  }

  const active = rows.filter((r) => r.still_present);
  const lost = rows.filter((r) => !r.still_present);
  const totalReferrerVisits30d = active.reduce((s, r) => s + (r.referrer_visits_30d || 0), 0);

  return { rows, active, lost, totalReferrerVisits30d };
}

function empty(): CustomerEmbedsReport {
  return { rows: [], active: [], lost: [], totalReferrerVisits30d: 0 };
}
