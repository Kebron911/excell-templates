import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { paths } from '../paths.js';

export interface Newsletter {
  id: string;
  name: string;
  list_source?: 'influencersoft' | 'ghost' | string;
  is_tag?: string;
  cadence?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  planned_send_day?: string;
  owner?: string;
  notes?: string;
}
export interface SentBroadcast {
  newsletter_id: string;
  subject: string;
  sent_at: string;
  recipients?: number;
  opens?: number;
  open_rate?: number;
  clicks?: number;
  click_rate?: number;
  unsubs?: number;
  complaints?: number;
  replies?: number;
}
export interface DraftBroadcast {
  newsletter_id: string;
  subject: string;
  state?: 'draft' | 'scheduled' | 'sent';
  scheduled_for?: string;
  body_path?: string;
}

export interface NewsletterReport {
  newsletters: Newsletter[];
  drafts: DraftBroadcast[];
  scheduled: DraftBroadcast[];
  sent: SentBroadcast[];
  daysSinceLastSend: number | null;
  isCadenceStale: boolean;       // > 14d since last send on a weekly newsletter
  recentAvgOpenRate: number | null;
  recentAvgClickRate: number | null;
  totalSubscribers: number | null;   // populated from IS API in Phase 4
}

export async function readNewsletter(): Promise<NewsletterReport> {
  let raw: string;
  try { raw = await readFile(paths.newsletter, 'utf8'); }
  catch {
    return emptyReport();
  }
  const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
  const newsletters = (Array.isArray(data.newsletters) ? data.newsletters : []) as Newsletter[];
  const drafts = (Array.isArray(data.drafts) ? data.drafts : []) as DraftBroadcast[];
  const scheduled = (Array.isArray(data.scheduled) ? data.scheduled : []) as DraftBroadcast[];
  const sent = (Array.isArray(data.sent) ? data.sent : []) as SentBroadcast[];

  const sortedSent = [...sent].sort((a, b) =>
    new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  const lastSend = sortedSent[0];
  const daysSinceLastSend = lastSend
    ? Math.floor((Date.now() - new Date(lastSend.sent_at).getTime()) / 86_400_000)
    : null;
  const last5 = sortedSent.slice(0, 5);
  const recentAvgOpenRate = last5.length
    ? last5.reduce((s, b) => s + (b.open_rate ?? 0), 0) / last5.length
    : null;
  const recentAvgClickRate = last5.length
    ? last5.reduce((s, b) => s + (b.click_rate ?? 0), 0) / last5.length
    : null;

  return {
    newsletters,
    drafts,
    scheduled,
    sent: sortedSent,
    daysSinceLastSend,
    isCadenceStale: daysSinceLastSend !== null && daysSinceLastSend > 14,
    recentAvgOpenRate,
    recentAvgClickRate,
    totalSubscribers: null,   // wires to IS API in Phase 4
  };
}

function emptyReport(): NewsletterReport {
  return {
    newsletters: [], drafts: [], scheduled: [], sent: [],
    daysSinceLastSend: null, isCadenceStale: false,
    recentAvgOpenRate: null, recentAvgClickRate: null,
    totalSubscribers: null,
  };
}
