import { describe, it, expect } from 'vitest';
import { calculateCohostSplit } from '@/lib/calc/cohost-split';

describe('calculateCohostSplit', () => {
  it('percent mode: cohost takes a fraction of net revenue', () => {
    const r = calculateCohostSplit({
      mode: 'percent',
      adr: 200, nightsBooked: 20,
      passThroughCosts: 500,
      cohostPct: 0.20,
      flatFeePerBooking: 0, perNightFee: 0, bookings: 0,
    });
    // gross = 200 * 20 = 4000
    // net = 4000 - 500 = 3500
    // cohost = 3500 * 0.20 = 700
    // owner = 3500 - 700 = 2800
    expect(r.grossRevenue).toBe(4000);
    expect(r.netRevenue).toBe(3500);
    expect(r.cohostShare).toBeCloseTo(700, 2);
    expect(r.ownerShare).toBeCloseTo(2800, 2);
  });

  it('flat mode: per-booking + per-night fees', () => {
    const r = calculateCohostSplit({
      mode: 'flat',
      adr: 200, nightsBooked: 20,
      passThroughCosts: 500,
      cohostPct: 0,
      flatFeePerBooking: 50, perNightFee: 5, bookings: 8,
    });
    // gross 4000, net 3500
    // cohost = 50 * 8 + 5 * 20 = 400 + 100 = 500
    // owner = 3500 - 500 = 3000
    expect(r.cohostShare).toBe(500);
    expect(r.ownerShare).toBe(3000);
  });

  it('clamps owner to 0 when cohost share exceeds net revenue', () => {
    const r = calculateCohostSplit({
      mode: 'flat',
      adr: 100, nightsBooked: 1,
      passThroughCosts: 0,
      cohostPct: 0,
      flatFeePerBooking: 200, perNightFee: 0, bookings: 1,
    });
    // gross 100, net 100, cohost flat 200 -> owner clamped to 0
    expect(r.ownerShare).toBe(0);
  });

  it('handles zero revenue gracefully', () => {
    const r = calculateCohostSplit({
      mode: 'percent',
      adr: 0, nightsBooked: 0,
      passThroughCosts: 0,
      cohostPct: 0.20,
      flatFeePerBooking: 0, perNightFee: 0, bookings: 0,
    });
    expect(r.grossRevenue).toBe(0);
    expect(r.netRevenue).toBe(0);
    expect(r.cohostShare).toBe(0);
    expect(r.ownerShare).toBe(0);
  });
});
