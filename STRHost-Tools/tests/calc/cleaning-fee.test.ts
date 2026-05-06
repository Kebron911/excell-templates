import { describe, it, expect } from 'vitest';
import { calculateCleaningFee, CLEANING_FEE_DEFAULTS } from '@/lib/calc/cleaning-fee';

describe('calculateCleaningFee', () => {
  it('computes recommended fee from labor + supplies + laundry + buffer', () => {
    const r = calculateCleaningFee({
      hours: 4, hourlyRate: 25,
      suppliesCost: 10, laundryCost: 15, buffer: 10,
      avgNightsPerStay: 3, nightlyRate: 200,
    });
    // labor = 4 * 25 = 100; total = 100 + 10 + 15 + 10 = 135
    expect(r.laborCost).toBe(100);
    expect(r.recommendedCleaningFee).toBe(135);
    expect(r.perNightCost).toBeCloseTo(45, 2);   // 135 / 3
    expect(r.pctOfNightly).toBeCloseTo(0.675, 4); // 135 / 200
  });

  it('returns 0 pct when nightly rate is 0', () => {
    const r = calculateCleaningFee({
      hours: 1, hourlyRate: 20,
      suppliesCost: 0, laundryCost: 0, buffer: 0,
      avgNightsPerStay: 1, nightlyRate: 0,
    });
    expect(r.pctOfNightly).toBe(0);
  });

  it('returns 0 per-night when avgNightsPerStay is 0', () => {
    const r = calculateCleaningFee({
      ...CLEANING_FEE_DEFAULTS,
      avgNightsPerStay: 0,
    });
    expect(r.perNightCost).toBe(0);
  });

  it('exposes sane defaults', () => {
    expect(CLEANING_FEE_DEFAULTS.hours).toBeGreaterThan(0);
    expect(CLEANING_FEE_DEFAULTS.hourlyRate).toBeGreaterThan(0);
  });
});
