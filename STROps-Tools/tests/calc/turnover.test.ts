import { describe, it, expect } from 'vitest';
import { computeSchedule, hasConflict } from '@lib/calc/turnover';

describe('turnover schedule', () => {
  const bookings = [
    { id: 'b1', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
    { id: 'b2', propertyId: 'p1', checkIn: '2026-06-05', checkOut: '2026-06-08' },
    { id: 'b3', propertyId: 'p1', checkIn: '2026-06-09', checkOut: '2026-06-12' },
  ];
  it('computes turnover gap in hours', () => {
    const r = computeSchedule(bookings, { turnoverHours: 4 });
    const gap1 = r.turnovers.find(t => t.fromBooking === 'b1' && t.toBooking === 'b2');
    expect(gap1).toBeTruthy();
    expect(gap1!.gapHours).toBe(4); // 11:00 -> 15:00 same day = 4h
    expect(gap1!.tight).toBe(false); // exactly equals threshold
  });
  it('flags conflicts', () => {
    const overlapping = [
      { id: 'a', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
      { id: 'b', propertyId: 'p1', checkIn: '2026-06-04', checkOut: '2026-06-07' },
    ];
    const r = computeSchedule(overlapping, { turnoverHours: 4 });
    expect(r.conflicts.length).toBe(1);
    expect(hasConflict(r)).toBe(true);
  });
  it('groups by property', () => {
    const r = computeSchedule([
      ...bookings,
      { id: 'b4', propertyId: 'p2', checkIn: '2026-06-01', checkOut: '2026-06-04' },
    ], { turnoverHours: 4 });
    expect(Object.keys(r.byProperty).sort()).toEqual(['p1','p2']);
  });
  it('flags tight turnover when gap < threshold', () => {
    const r = computeSchedule(bookings, { turnoverHours: 6 });
    const g = r.turnovers.find(t => t.fromBooking === 'b1' && t.toBooking === 'b2');
    expect(g!.tight).toBe(true);
  });
});
