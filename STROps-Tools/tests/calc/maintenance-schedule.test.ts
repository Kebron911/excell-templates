import { describe, it, expect } from 'vitest';
import { buildSchedule } from '@/lib/calc/maintenance-schedule';
import type { TaskCatalog } from '@/lib/types';
import seed from '@/data/maintenance-tasks-seed.json';

const catalog = seed as TaskCatalog;

describe('maintenance-schedule', () => {
  it('emits one occurrence per cadence interval per year (HVAC, 60d, 365d horizon)', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: false, climate: 'temperate' },
      catalog,
    });
    const hvac = r.events.filter(e => e.taskSlug === 'hvac-filter-change');
    // 60d cadence over 365d → 6 events
    expect(hvac.length).toBe(6);
  });

  it('skips HVAC-only tasks when hasHvac=false', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: false, hasFireplace: false, climate: 'temperate' },
      catalog,
    });
    expect(r.events.find(e => e.taskSlug === 'hvac-filter-change')).toBeUndefined();
    expect(r.events.find(e => e.taskSlug === 'ac-tune-up')).toBeUndefined();
  });

  it('skips chimney sweep when hasFireplace=false', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: false, climate: 'temperate' },
      catalog,
    });
    expect(r.events.find(e => e.taskSlug === 'chimney-sweep')).toBeUndefined();
  });

  it('includes chimney sweep when hasFireplace=true', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: true, climate: 'cold' },
      catalog,
    });
    expect(r.events.find(e => e.taskSlug === 'chimney-sweep')).toBeTruthy();
  });

  it('events are sorted by date', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: true, climate: 'cold' },
      catalog,
    });
    for (let i = 1; i < r.events.length; i++) {
      expect(r.events[i].date >= r.events[i - 1].date).toBe(true);
    }
  });

  it('zero-day horizon emits no events', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 0,
      propertyTraits: { hasHvac: true, hasFireplace: true, climate: 'temperate' },
      catalog,
    });
    expect(r.events).toEqual([]);
  });
});
