import { describe, it, expect } from 'vitest';
import { buildIcs } from '@lib/calendar/ics';

describe('ics export', () => {
  it('emits one VEVENT per scheduled event (round-trip count)', () => {
    const ics = buildIcs({
      events: [
        { taskSlug: 'a', name: 'Replace HVAC filter', date: '2026-03-01', cadenceDays: 60 },
        { taskSlug: 'b', name: 'Test smoke detectors', date: '2026-04-01', cadenceDays: 90 },
        { taskSlug: 'c', name: 'Deep clean', date: '2026-04-15', cadenceDays: 90 },
      ],
    });
    const beginCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
    const endCount = (ics.match(/END:VEVENT/g) ?? []).length;
    expect(beginCount).toBe(3);
    expect(endCount).toBe(3);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('Maintenance: Replace HVAC filter');
  });
});
