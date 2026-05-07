import { describe, it, expect } from 'vitest';
import { buildIcs } from '@/lib/calendar/ics';

describe('ics builder', () => {
  it('emits valid VCALENDAR for a non-empty schedule', () => {
    const ics = buildIcs({
      events: [
        { taskSlug: 'hvac-filter-change', name: 'HVAC filter change', date: '2026-03-01', cadenceDays: 60 },
        { taskSlug: 'smoke-detector-test', name: 'Smoke detector test', date: '2026-04-01', cadenceDays: 90 },
      ],
    });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('SUMMARY:Maintenance: HVAC filter change');
    expect(ics).toContain('SUMMARY:Maintenance: Smoke detector test');
  });

  it('emits a valid (empty) VCALENDAR for an empty schedule', () => {
    const ics = buildIcs({ events: [] });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('uses CRLF line separators (RFC 5545 requirement)', () => {
    const ics = buildIcs({
      events: [
        { taskSlug: 'x', name: 'X', date: '2026-01-15', cadenceDays: 30 },
      ],
    });
    expect(ics).toContain('\r\n');
  });
});
