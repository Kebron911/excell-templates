import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

/**
 * Contacts cache — written by n8n nightly-refresh from Influencersoft.
 * Returns zeroed shape when cache missing.
 */

const FunnelStage = z.object({
  label: z.string(),
  count: z.number().default(0),
});

const SourceRow = z.object({
  source: z.string(),
  signups: z.number().default(0),
});

const SequenceRow = z.object({
  name: z.string(),
  metric: z.string(),
  value: z.string(),
});

const ContactsCacheSchema = z.object({
  generatedAt: z.string().optional(),
  list: z.object({
    total: z.number().default(0),
    new7d: z.number().default(0),
    new7dDelta: z.number().default(0),
    engaged30d: z.number().default(0),
    cold90d: z.number().default(0),
  }).default({ total: 0, new7d: 0, new7dDelta: 0, engaged30d: 0, cold90d: 0 }),
  funnel: z.array(FunnelStage).default([]),
  topSources: z.array(SourceRow).default([]),
  health: z.object({
    bounceRate: z.number().default(0),
    unsubRate: z.number().default(0),
    complaintRate: z.number().default(0),
    avgOpen: z.number().default(0),
    avgClick: z.number().default(0),
  }).default({ bounceRate: 0, unsubRate: 0, complaintRate: 0, avgOpen: 0, avgClick: 0 }),
  sequences: z.array(SequenceRow).default([]),
});

export type ContactsCache = z.infer<typeof ContactsCacheSchema>;

export interface ContactsReport extends ContactsCache {
  isCacheReady: boolean;
}

const DEFAULT_FUNNEL = [
  { label: 'Visitor',      count: 0 },
  { label: 'Email opt-in', count: 0 },
  { label: 'Engaged',      count: 0 },
  { label: 'Purchaser',    count: 0 },
];

const EMPTY: ContactsCache = {
  list: { total: 0, new7d: 0, new7dDelta: 0, engaged30d: 0, cold90d: 0 },
  funnel: DEFAULT_FUNNEL,
  topSources: [],
  health: { bounceRate: 0, unsubRate: 0, complaintRate: 0, avgOpen: 0, avgClick: 0 },
  sequences: [],
};

export async function readContacts(): Promise<ContactsReport> {
  let raw: string;
  try { raw = await readFile(paths.cache.contacts, 'utf8'); }
  catch { return { ...EMPTY, isCacheReady: false }; }
  try {
    const parsed = ContactsCacheSchema.parse(JSON.parse(raw));
    if (parsed.funnel.length === 0) parsed.funnel = DEFAULT_FUNNEL;
    return { ...parsed, isCacheReady: true };
  } catch {
    return { ...EMPTY, isCacheReady: false };
  }
}
