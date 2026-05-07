import { describe, it, expect } from 'vitest';
import { calculateYear1Cash } from '@/lib/calc/year-1-cash-needs';

describe('calculateYear1Cash', () => {
  it('sums down + closing + furnishing + reserve', () => {
    const r = calculateYear1Cash({
      purchasePrice: 400_000,
      downPaymentPct: 0.25,
      closingCostsPct: 0.03,
      furnishingBudget: 20_000,
      reserveMonths: 6,
      monthlyExpenseEstimate: 3_000,
    });
    // 100k + 12k + 20k + 18k = 150k
    expect(r.downPayment).toBe(100_000);
    expect(r.closingCosts).toBe(12_000);
    expect(r.furnishing).toBe(20_000);
    expect(r.operatingReserve).toBe(18_000);
    expect(r.totalCashNeeded).toBe(150_000);
  });

  it('shares add to ~1.0', () => {
    const r = calculateYear1Cash({
      purchasePrice: 400_000,
      downPaymentPct: 0.25,
      closingCostsPct: 0.03,
      furnishingBudget: 20_000,
      reserveMonths: 6,
      monthlyExpenseEstimate: 3_000,
    });
    const total = r.shares.downPct + r.shares.closingPct + r.shares.furnishingPct + r.shares.reservePct;
    expect(total).toBeCloseTo(1.0, 6);
  });

  it('handles zero reserve months', () => {
    const r = calculateYear1Cash({
      purchasePrice: 400_000,
      downPaymentPct: 0.20,
      closingCostsPct: 0.03,
      furnishingBudget: 0,
      reserveMonths: 0,
      monthlyExpenseEstimate: 0,
    });
    expect(r.operatingReserve).toBe(0);
    expect(r.totalCashNeeded).toBe(80_000 + 12_000);
  });

  it('zero total returns zero shares', () => {
    const r = calculateYear1Cash({
      purchasePrice: 0,
      downPaymentPct: 0.20,
      closingCostsPct: 0.03,
      furnishingBudget: 0,
      reserveMonths: 0,
      monthlyExpenseEstimate: 0,
    });
    expect(r.totalCashNeeded).toBe(0);
    expect(r.shares.downPct).toBe(0);
  });
});
