import { describe, it, expect } from 'vitest';
import { computeSchedule, hasConflict, type Booking } from '@/lib/calc/turnover';

describe('turnover schedule', () => {
  const bookings: Booking[] = [
    { id: 'b1', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
    { id: 'b2', propertyId: 'p1', checkIn: '2026-06-05', checkOut: '2026-06-08' },
    { id: 'b3', propertyId: 'p1', checkIn: '2026-06-09', checkOut: '2026-06-12' },
  ];

  it('computes turnover gap in hours (same-day flagged tight)', () => {
    const r = computeSchedule(bookings, { turnoverHours: 4 });
    const gap1 = r.turnovers.find(t => t.fromBooking === 'b1' && t.toBooking === 'b2');
    expect(gap1).toBeTruthy();
    expect(gap1!.gapHours).toBe(4);
    expect(gap1!.tight).toBe(false);
  });

  it('flags tight turnovers below threshold', () => {
    const r = computeSchedule(bookings, { turnoverHours: 5 });
    const gap1 = r.turnovers.find(t => t.fromBooking === 'b1' && t.toBooking === 'b2');
    expect(gap1!.tight).toBe(true);
  });

  it('flags overlap as conflict', () => {
    const overlapping: Booking[] = [
      { id: 'a', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
      { id: 'b', propertyId: 'p1', checkIn: '2026-06-04', checkOut: '2026-06-07' },
    ];
    const r = computeSchedule(overlapping, { turnoverHours: 4 });
    expect(r.conflicts.length).toBe(1);
    expect(hasConflict(r)).toBe(true);
  });

  it('groups by property', () => {
    const r = computeSchedule(
      [...bookings, { id: 'b4', propertyId: 'p2', checkIn: '2026-06-01', checkOut: '2026-06-04' }],
      { turnoverHours: 4 },
    );
    expect(Object.keys(r.byProperty).sort()).toEqual(['p1', 'p2']);
  });

  it('empty input returns empty result', () => {
    const r = computeSchedule([], { turnoverHours: 4 });
    expect(r.turnovers).toEqual([]);
    expect(r.conflicts).toEqual([]);
    expect(hasConflict(r)).toBe(false);
  });
});
