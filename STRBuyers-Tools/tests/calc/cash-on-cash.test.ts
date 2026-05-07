import { describe, it, expect } from 'vitest';
import { calculateCashOnCash } from '@/lib/calc/cash-on-cash';

describe('calculateCashOnCash', () => {
  it('computes CoC = annualCashFlow / totalCashInvested', () => {
    const r = calculateCashOnCash({ annualCashFlow: 14_000, totalCashInvested: 140_000 });
    expect(r.coc).toBeCloseTo(0.10, 4);
  });

  it('labels ≥10% as strong', () => {
    const r = calculateCashOnCash({ annualCashFlow: 14_000, totalCashInvested: 140_000 });
    expect(r.benchmark).toBe('strong');
  });

  it('labels 6–10% as solid', () => {
    const r = calculateCashOnCash({ annualCashFlow: 9_800, totalCashInvested: 140_000 });
    expect(r.benchmark).toBe('solid');
  });

  it('labels 3–6% as marginal', () => {
    const r = calculateCashOnCash({ annualCashFlow: 5_600, totalCashInvested: 140_000 });
    expect(r.benchmark).toBe('marginal');
  });

  it('labels <3% as revisit', () => {
    const r = calculateCashOnCash({ annualCashFlow: 2_800, totalCashInvested: 140_000 });
    expect(r.benchmark).toBe('revisit');
  });

  it('handles zero invested gracefully', () => {
    const r = calculateCashOnCash({ annualCashFlow: 5000, totalCashInvested: 0 });
    expect(r.coc).toBe(0);
    expect(r.benchmark).toBe('revisit');
  });
});
