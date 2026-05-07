import { describe, it, expect } from 'vitest';
import { calculateBreakEven, BREAK_EVEN_DEFAULTS } from '@/lib/calc/break-even';

describe('calculateBreakEven', () => {
  it('computes break-even nights and occupancy', () => {
    const r = calculateBreakEven({
      mortgage: 1800, insurance: 100, propertyTaxAnnual: 4800,
      hoa: 50, utilities: 250, otherFixed: 0,
      adr: 200, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 5,
    });
    // monthly costs = 1800 + 100 + (4800/12) + 50 + 250 + 0 = 2600
    // net per night = 200 * 0.97 - 100 - 5 = 194 - 105 = 89
    // breakEvenNights = 2600 / 89 ≈ 29.213
    // breakEvenOccupancy = breakEvenNights / 30 ≈ 0.974
    expect(r.monthlyCosts).toBe(2600);
    expect(r.netPerNight).toBeCloseTo(89, 2);
    expect(r.breakEvenNights).toBeCloseTo(2600 / 89, 2);
    expect(r.breakEvenOccupancy).toBeCloseTo(2600 / 89 / 30, 4);
    expect(r.feasible).toBe(true);
  });

  it('flags infeasible when net per night is <= 0', () => {
    const r = calculateBreakEven({
      mortgage: 1000, insurance: 0, propertyTaxAnnual: 0,
      hoa: 0, utilities: 0, otherFixed: 0,
      adr: 50, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 0,
    });
    // net = 50*0.97 - 100 = -51.5 (negative)
    expect(r.feasible).toBe(false);
    expect(Number.isFinite(r.breakEvenNights)).toBe(false);
    expect(Number.isFinite(r.breakEvenOccupancy)).toBe(false);
  });

  it('handles zero costs (instant break-even)', () => {
    const r = calculateBreakEven({
      mortgage: 0, insurance: 0, propertyTaxAnnual: 0,
      hoa: 0, utilities: 0, otherFixed: 0,
      adr: 200, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 5,
    });
    expect(r.monthlyCosts).toBe(0);
    expect(r.breakEvenNights).toBe(0);
    expect(r.breakEvenOccupancy).toBe(0);
  });

  it('exposes sane defaults', () => {
    expect(BREAK_EVEN_DEFAULTS.adr).toBeGreaterThan(0);
  });
});
