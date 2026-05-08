import type { TaskCatalog } from '@lib/types';

export interface ScheduleInput {
  startDate: string;
  horizonDays: number;
  propertyTraits: {
    hasHvac: boolean;
    hasFireplace: boolean;
    climate: 'cold' | 'temperate' | 'hot';
  };
  catalog: TaskCatalog;
}
export interface ScheduleEvent {
  taskSlug: string;
  name: string;
  date: string;
  cadenceDays: number;
}
export interface ScheduleResult {
  events: ScheduleEvent[];
}

function applies(slug: string, traits: ScheduleInput['propertyTraits']): boolean {
  if (slug === 'hvac-filter-change' || slug === 'ac-tune-up') return traits.hasHvac;
  if (slug === 'chimney-sweep') return traits.hasFireplace;
  return true;
}

export function buildSchedule(input: ScheduleInput): ScheduleResult {
  const events: ScheduleEvent[] = [];
  const start = new Date(input.startDate + 'T00:00:00Z').getTime();
  const horizonMs = input.horizonDays * 86_400_000;
  for (const [slug, t] of Object.entries(input.catalog)) {
    if (!applies(slug, input.propertyTraits)) continue;
    let when = start + t.cadenceDays * 86_400_000;
    while (when - start <= horizonMs) {
      events.push({
        taskSlug: slug,
        name: t.name,
        date: new Date(when).toISOString().slice(0, 10),
        cadenceDays: t.cadenceDays,
      });
      when += t.cadenceDays * 86_400_000;
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));
  return { events };
}
