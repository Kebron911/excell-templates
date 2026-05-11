import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { paths } from '../paths.js';

export const Domain = z.enum(['Money', 'Trajectory', 'Wisdom', 'Thrive', 'Freedom', 'Self', 'Social']);
export type Domain = z.infer<typeof Domain>;

export const TimeEntry = z.object({
  id: z.string(),
  ts: z.string(),         // session end timestamp ISO
  domain: Domain,
  minutes: z.number().int().nonnegative(),
  note: z.string().optional(),
});
export type TimeEntry = z.infer<typeof TimeEntry>;

export interface TimeReport {
  weekTotalMinutes: number;
  weekByDomain: Record<Domain, number>;
  todayMinutes: number;
  recentEntries: TimeEntry[];
}

export async function readTimeLog(): Promise<TimeReport> {
  const empty: Record<Domain, number> = {
    Money: 0, Trajectory: 0, Wisdom: 0, Thrive: 0, Freedom: 0, Self: 0, Social: 0,
  };
  let raw: string;
  try { raw = await readFile(paths.timeLog, 'utf8'); }
  catch { return { weekTotalMinutes: 0, weekByDomain: empty, todayMinutes: 0, recentEntries: [] }; }

  const now = Date.now();
  const startOfWeek = (() => {
    const d = new Date();
    const dow = d.getDay(); // 0=Sun, 1=Mon
    const monday = new Date(d);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(d.getDate() - ((dow + 6) % 7)); // last Monday
    return monday.getTime();
  })();
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);

  const entries: TimeEntry[] = [];
  for (const line of raw.split(/\r?\n/).filter(Boolean)) {
    try { entries.push(TimeEntry.parse(JSON.parse(line))); }
    catch { /* skip */ }
  }

  const weekByDomain = { ...empty };
  let weekTotalMinutes = 0;
  let todayMinutes = 0;
  for (const e of entries) {
    const t = new Date(e.ts).getTime();
    if (t >= startOfWeek) {
      weekByDomain[e.domain] = (weekByDomain[e.domain] ?? 0) + e.minutes;
      weekTotalMinutes += e.minutes;
    }
    if (t >= startOfDay.getTime()) todayMinutes += e.minutes;
  }

  return {
    weekTotalMinutes,
    weekByDomain,
    todayMinutes,
    recentEntries: entries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()).slice(0, 30),
  };
}
