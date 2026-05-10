import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { paths } from '../paths.js';

// Generic outreach pipeline reader for backlinks / influencers / press.
// Each YAML has a different shape but they share the prospect → contacted → ... pattern.

export interface PipelineCounts {
  prospect: number;
  active: number;
  total: number;
  nextActions7d: number;
  overdue: number;
}

async function loadYaml(path: string): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(path, 'utf8');
    return (parseYaml(raw) as Record<string, unknown>) ?? {};
  } catch { return {}; }
}

function isDueOrOverdue(dateStr: unknown): { due: boolean; overdue: boolean } {
  if (typeof dateStr !== 'string') return { due: false, overdue: false };
  const ms = new Date(dateStr).getTime();
  if (Number.isNaN(ms)) return { due: false, overdue: false };
  const days = Math.floor((ms - Date.now()) / 86_400_000);
  return { due: days >= 0 && days <= 7, overdue: days < 0 };
}

function summarize(items: unknown[]): PipelineCounts {
  let prospect = 0, active = 0, nextActions7d = 0, overdue = 0;
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const state = String(item.state ?? '');
    if (state === 'prospect' || state === 'contacted' || state === 'replied') prospect++;
    if (state === 'active' || state === 'published' || state === 'negotiating') active++;
    const { due, overdue: isOverdue } = isDueOrOverdue(item.next_action_date);
    if (due) nextActions7d++;
    if (isOverdue) overdue++;
  }
  return { prospect, active, total: items.length, nextActions7d, overdue };
}

export async function readBacklinksPipeline() {
  const data = await loadYaml(paths.backlinks);
  const outreach = Array.isArray(data.outreach) ? data.outreach : [];
  const acquired = Array.isArray(data.acquired) ? data.acquired : [];
  return {
    outreach: { items: outreach, ...summarize(outreach) },
    acquired: { items: acquired, count: acquired.length },
  };
}

export async function readInfluencersPipeline() {
  const data = await loadYaml(paths.influencers);
  const prospects = Array.isArray(data.prospects) ? data.prospects : [];
  const active = Array.isArray(data.active) ? data.active : [];
  return {
    prospects: { items: prospects, ...summarize(prospects) },
    active: { items: active, count: active.length },
  };
}

export async function readPressPipeline() {
  const data = await loadYaml(paths.press);
  const podcasts = Array.isArray(data.podcasts) ? data.podcasts : [];
  const guestPosts = Array.isArray(data.guest_posts) ? data.guest_posts : [];
  const haro = Array.isArray(data.haro_qwoted) ? data.haro_qwoted : [];
  const mentions = Array.isArray(data.mentions) ? data.mentions : [];
  return {
    podcasts:   { items: podcasts,   ...summarize(podcasts) },
    guestPosts: { items: guestPosts, ...summarize(guestPosts) },
    haro:       { items: haro,       count: haro.length },
    mentions:   { items: mentions,   count: mentions.length },
  };
}
