import { describe, it, expect } from 'vitest';
import { calculateComp, COMP_DEFAULTS } from '@/lib/calc/comp-analyzer';

describe('calculateComp', () => {
  it('computes per-listing booked nights as 365 * occupancy', () => {
    const r = calculateComp([{ nightlyRate: 200, occupancyPct: 0.5, cleaningFee: 100 }]);
    expect(r.perListing[0].bookedNights).toBeCloseTo(182.5, 4);
  });

  it('computes annual rent as bookedNights * nightlyRate', () => {
    const r = calculateComp([{ nightlyRate: 200, occupancyPct: 0.5, cleaningFee: 0 }]);
    expect(r.perListing[0].annualRent).toBeCloseTo(36500, 0);
  });

  it('flags single-listing input as "single" spread label', () => {
    const r = calculateComp([{ nightlyRate: 200, occupancyPct: 0.5, cleaningFee: 100 }]);
    expect(r.spreadLabel).toBe('single');
  });

  it('flags tight spread (<15%) for similar listings', () => {
    const r = calculateComp([
      { nightlyRate: 200, occupancyPct: 0.6, cleaningFee: 100 },
      { nightlyRate: 205, occupancyPct: 0.6, cleaningFee: 100 },
      { nightlyRate: 210, occupancyPct: 0.6, cleaningFee: 100 },
    ]);
    expect(r.spreadLabel).toBe('tight');
    expect(r.spreadPct).toBeLessThan(0.15);
  });

  it('flags wide spread (>30%) for divergent listings', () => {
    const r = calculateComp([
      { nightlyRate: 100, occupancyPct: 0.5, cleaningFee: 50 },
      { nightlyRate: 250, occupancyPct: 0.7, cleaningFee: 150 },
      { nightlyRate: 200, occupancyPct: 0.6, cleaningFee: 100 },
    ]);
    expect(r.spreadLabel).toBe('wide');
    expect(r.spreadPct).toBeGreaterThan(0.30);
  });

  it('average is the mean of per-listing gross', () => {
    const r = calculateComp(COMP_DEFAULTS);
    const expectedAvg = (r.perListing[0].annualGross + r.perListing[1].annualGross + r.perListing[2].annualGross) / 3;
    expect(r.averageGross).toBeCloseTo(expectedAvg, 2);
  });

  it('handles empty input without throwing', () => {
    const r = calculateComp([]);
    expect(r.averageGross).toBe(0);
    expect(r.spreadPct).toBe(0);
    expect(r.spreadLabel).toBe('single');
  });
});
