import { describe, it, expect } from 'vitest';
import { calculateRevpar } from '@/lib/calc/revpar';

describe('calculateRevpar', () => {
  it('computes occupancy / ADR / RevPAR', () => {
    const r = calculateRevpar({ nightsAvailable: 30, nightsBooked: 21, revenue: 4200 });
    expect(r.occupancy).toBeCloseTo(0.7, 4);
    expect(r.adr).toBeCloseTo(200, 2);
    expect(r.revpar).toBeCloseTo(140, 2);
  });

  it('zero-protects all three metrics', () => {
    const r = calculateRevpar({ nightsAvailable: 0, nightsBooked: 0, revenue: 0 });
    expect(r.occupancy).toBe(0);
    expect(r.adr).toBe(0);
    expect(r.revpar).toBe(0);
  });

  it('zero-protects ADR when no nights booked', () => {
    const r = calculateRevpar({ nightsAvailable: 30, nightsBooked: 0, revenue: 0 });
    expect(r.adr).toBe(0);
    expect(r.occupancy).toBe(0);
  });

  it('verifies the algebraic identity ADR * occupancy = RevPAR', () => {
    const r = calculateRevpar({ nightsAvailable: 30, nightsBooked: 24, revenue: 4800 });
    expect(r.adr * r.occupancy).toBeCloseTo(r.revpar, 4);
  });
});
