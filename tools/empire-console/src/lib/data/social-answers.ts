import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

const Row = z.object({
  surfaced_at: z.string(),
  platform: z.string().default('reddit'),
  subreddit_or_topic: z.string().default(''),
  question_url: z.string().default(''),
  title: z.string().optional(),
  excerpt: z.string().optional(),
  answered: z.boolean().default(false),
  answer_url: z.string().optional(),
  posted_at: z.string().optional(),
  est_visits: z.number().default(0),
});

export type SocialAnswer = z.infer<typeof Row>;

export interface SocialAnswersReport {
  rows: SocialAnswer[];
  surfaced7d: number;
  surfaced30d: number;
  answered7d: number;
  answered30d: number;
  conversionRate7d: number;
  estVisits30d: number;
  byPlatform: Record<string, number>;
}

const MS_DAY = 86_400_000;

function within(iso: string | undefined, days: number): boolean {
  if (!iso) return false;
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return false;
  return (Date.now() - ms) <= days * MS_DAY;
}

export async function readSocialAnswers(): Promise<SocialAnswersReport> {
  let raw: string;
  try { raw = await readFile(paths.socialAnswers, 'utf8'); }
  catch { return empty(); }

  const rows: SocialAnswer[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('{"_schema"')) continue;
    try {
      const parsed = Row.parse(JSON.parse(trimmed));
      rows.push(parsed);
    } catch {
      // skip malformed line
    }
  }

  const surfaced7d  = rows.filter((r) => within(r.surfaced_at, 7)).length;
  const surfaced30d = rows.filter((r) => within(r.surfaced_at, 30)).length;
  const answered7d  = rows.filter((r) => r.answered && within(r.posted_at, 7)).length;
  const answered30d = rows.filter((r) => r.answered && within(r.posted_at, 30)).length;
  const conversionRate7d = surfaced7d === 0 ? 0 : answered7d / surfaced7d;
  const estVisits30d = rows
    .filter((r) => r.answered && within(r.posted_at, 30))
    .reduce((sum, r) => sum + (r.est_visits || 0), 0);

  const byPlatform: Record<string, number> = {};
  for (const r of rows) byPlatform[r.platform] = (byPlatform[r.platform] || 0) + 1;

  return { rows, surfaced7d, surfaced30d, answered7d, answered30d, conversionRate7d, estVisits30d, byPlatform };
}

function empty(): SocialAnswersReport {
  return {
    rows: [], surfaced7d: 0, surfaced30d: 0, answered7d: 0, answered30d: 0,
    conversionRate7d: 0, estVisits30d: 0, byPlatform: {},
  };
}
