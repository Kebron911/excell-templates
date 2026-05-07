import { describe, it, expect } from 'vitest';
import { calculateProfit, PROFIT_DEFAULTS } from '@/lib/calc/profit';

describe('calculateProfit', () => {
  it('computes monthly P&L for the spec scenario', () => {
    const r = calculateProfit({
      adr: 200, nightsBooked: 20, turnovers: 8,
      cleaningPerTurnover: 100, suppliesPerNight: 5,
      utilitiesMonthly: 250, platformFees: 120,
      mortgageMonthly: 1800, insuranceMonthly: 100,
      propertyTaxAnnual: 4800, hoaMonthly: 50,
      managementFeeRate: 0,
      months: 1,
    });
    // gross = 200 * 20 = 4000
    expect(r.grossRevenue).toBe(4000);
    // variable = 100*8 + 5*20 + 250*1 + 120 = 800 + 100 + 250 + 120 = 1270
    expect(r.variableCosts).toBe(1270);
    // fixed = 1800 + 100 + 4800/12 + 50 + 0 = 1800 + 100 + 400 + 50 = 2350
    expect(r.fixedCosts).toBe(2350);
    expect(r.netProfit).toBe(4000 - 1270 - 2350); // 380
    expect(r.profitMargin).toBeCloseTo(380 / 4000, 4);
  });

  it('returns 0 margin when gross revenue is 0', () => {
    const r = calculateProfit({
      adr: 0, nightsBooked: 0, turnovers: 0,
      cleaningPerTurnover: 0, suppliesPerNight: 0,
      utilitiesMonthly: 0, platformFees: 0,
      mortgageMonthly: 0, insuranceMonthly: 0,
      propertyTaxAnnual: 0, hoaMonthly: 0,
      managementFeeRate: 0, months: 1,
    });
    expect(r.profitMargin).toBe(0);
  });

  it('applies management fee as a fraction of gross revenue', () => {
    const r = calculateProfit({
      ...PROFIT_DEFAULTS,
      managementFeeRate: 0.20,
      mortgageMonthly: 0, insuranceMonthly: 0,
      propertyTaxAnnual: 0, hoaMonthly: 0,
      utilitiesMonthly: 0, platformFees: 0,
      cleaningPerTurnover: 0, suppliesPerNight: 0,
    });
    // gross = 200*20 = 4000, mgmt fee = 0.20 * 4000 = 800; everything else zero
    expect(r.fixedCosts).toBe(800);
    expect(r.netProfit).toBe(4000 - 800);
  });

  it('annualizes property tax across the months window', () => {
    const r = calculateProfit({
      ...PROFIT_DEFAULTS,
      propertyTaxAnnual: 12000,
      months: 6,
      mortgageMonthly: 0, insuranceMonthly: 0, hoaMonthly: 0,
      managementFeeRate: 0,
      cleaningPerTurnover: 0, suppliesPerNight: 0,
      utilitiesMonthly: 0, platformFees: 0,
    });
    // fixed = (12000 * 6) / 12 = 6000
    expect(r.fixedCosts).toBe(6000);
  });

  it('emits negative net profit when costs exceed revenue', () => {
    const r = calculateProfit({
      ...PROFIT_DEFAULTS,
      adr: 50, nightsBooked: 5, // gross = 250
    });
    expect(r.netProfit).toBeLessThan(0);
    expect(r.profitMargin).toBeLessThan(0);
  });
});
