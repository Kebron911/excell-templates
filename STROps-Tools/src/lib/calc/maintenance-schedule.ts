/**
 * Maintenance schedule generator.
 *
 * For each task in the catalog (only those that apply to the property's
 * traits), emit recurring events from `startDate` over `horizonDays` at
 * the task's cadence. Events sorted by date.
 *
 * Trait gates:
 *   - hvac-filter-change, ac-tune-up → require hasHvac
 *   - chimney-sweep → require hasFireplace
 *   - other tasks apply universally
 *
 * Climate is captured for downstream prioritization (Phase 3 will weight
 * cold-climate-only tasks differently) but doesn't currently filter.
 */

import type { TaskCatalog } from '../types';

export interface PropertyTraits {
  hasHvac: boolean;
  hasFireplace: boolean;
  climate: 'cold' | 'temperate' | 'hot';
}

export interface ScheduleInput {
  /** ISO YYYY-MM-DD. */
  startDate: string;
  horizonDays: number;
  propertyTraits: PropertyTraits;
  catalog: TaskCatalog;
}

export interface ScheduleEvent {
  taskSlug: string;
  name: string;
  /** ISO YYYY-MM-DD. */
  date: string;
  cadenceDays: number;
}

export interface ScheduleResult {
  events: ScheduleEvent[];
}

function applies(slug: string, traits: PropertyTraits): boolean {
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

  events.sort((a, b) => a.date.localeCompare(b.date) || a.taskSlug.localeCompare(b.taskSlug));
  return { events };
}
