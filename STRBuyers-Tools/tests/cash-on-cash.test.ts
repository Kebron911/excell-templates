import { describe, it, expect } from 'vitest';
import { calculateCashOnCash } from '@/lib/calc/cash-on-cash';

describe('calculateCashOnCash', () => {
  it('classic 6% example', () => {
    const r = calculateCashOnCash({ annualCashFlow: 6000, totalCashInvested: 100_000 });
    expect(r.cocReturn).toBeCloseTo(0.06, 4);
    expect(r.tier).toBe('good');
  });

  it('excellent at 8%+', () => {
    const r = calculateCashOnCash({ annualCashFlow: 8000, totalCashInvested: 100_000 });
    expect(r.tier).toBe('excellent');
  });

  it('marginal between 2 and 5%', () => {
    const r = calculateCashOnCash({ annualCashFlow: 3000, totalCashInvested: 100_000 });
    expect(r.tier).toBe('marginal');
  });

  it('reject below 2%', () => {
    const r = calculateCashOnCash({ annualCashFlow: 1000, totalCashInvested: 100_000 });
    expect(r.tier).toBe('reject');
  });

  it('handles zero invested gracefully', () => {
    const r = calculateCashOnCash({ annualCashFlow: 5000, totalCashInvested: 0 });
    expect(r.cocReturn).toBe(0);
    expect(r.tier).toBe('reject');
  });

  it('handles negative cash flow', () => {
    const r = calculateCashOnCash({ annualCashFlow: -2000, totalCashInvested: 100_000 });
    expect(r.cocReturn).toBeLessThan(0);
    expect(r.tier).toBe('reject');
  });
});
