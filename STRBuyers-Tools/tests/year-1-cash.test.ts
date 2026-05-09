import { describe, it, expect } from 'vitest';
import { calculateYear1Cash } from '@/lib/calc/year-1-cash';

describe('calculateYear1Cash', () => {
  it('canonical scenario: $400k @ 20% + 3% closing + $25k furnish + 6mo×$3k reserves + 3mo×$3k ramp = $144k', () => {
    const r = calculateYear1Cash({
      downPayment: 80_000,
      closingCosts: 12_000,
      furnishings: 25_000,
      reserves: 18_000,
      monthsHoldingCost: 9_000,
    });
    expect(r.total).toBe(144_000);
  });

  it('breakdown sums to total', () => {
    const r = calculateYear1Cash({
      downPayment: 50_000,
      closingCosts: 10_000,
      furnishings: 20_000,
      reserves: 12_000,
      monthsHoldingCost: 6_000,
    });
    const summed = r.breakdown.reduce((a, b) => a + b.amount, 0);
    expect(summed).toBeCloseTo(r.total, 2);
  });

  it('breakdown returns five named categories in order', () => {
    const r = calculateYear1Cash({
      downPayment: 1,
      closingCosts: 2,
      furnishings: 3,
      reserves: 4,
      monthsHoldingCost: 5,
    });
    expect(r.breakdown.map((b) => b.label)).toEqual([
      'Down payment',
      'Closing costs',
      'Furnishing & setup',
      'Reserves',
      'Ramp-up holding cost',
    ]);
  });

  it('handles zero across the board without throwing', () => {
    const r = calculateYear1Cash({
      downPayment: 0,
      closingCosts: 0,
      furnishings: 0,
      reserves: 0,
      monthsHoldingCost: 0,
    });
    expect(r.total).toBe(0);
  });
});
