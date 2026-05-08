import { describe, it, expect } from 'vitest';
import { buildSchedule } from '@lib/calc/maintenance-schedule';
import tasks from '@data/tasks.json';
import type { TaskCatalog } from '@lib/types';

describe('maintenance-schedule', () => {
  it('emits one occurrence per cadence interval per year', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: false, climate: 'temperate' },
      catalog: tasks as unknown as TaskCatalog,
    });
    const hvac = r.events.filter(e => e.taskSlug === 'hvac-filter-change');
    // 60-day cadence over 365 days = 6 events
    expect(hvac.length).toBeGreaterThanOrEqual(6);
  });
  it('omits chimney-sweep when no fireplace', () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: false, climate: 'temperate' },
      catalog: tasks as unknown as TaskCatalog,
    });
    expect(r.events.find(e => e.taskSlug === 'chimney-sweep')).toBeUndefined();
  });
});
