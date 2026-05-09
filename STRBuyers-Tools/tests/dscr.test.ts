import { describe, it, expect } from 'vitest';
import { calcDscr, monthlyPayment } from '@/lib/calc/dscr';

describe('monthlyPayment', () => {
  it('amortization sanity: $100k @ 6% / 30y ≈ $599.55/mo', () => {
    expect(monthlyPayment(100_000, 600, 30)).toBeCloseTo(599.55, 1);
  });

  it('returns 0 for non-positive loan or term', () => {
    expect(monthlyPayment(0, 600, 30)).toBe(0);
    expect(monthlyPayment(100_000, 600, 0)).toBe(0);
  });

  it('handles 0% rate via straight-line amortization', () => {
    expect(monthlyPayment(120_000, 0, 10)).toBeCloseTo(1000, 2);
  });
});

describe('calcDscr', () => {
  it('hits exactly 1.00x threshold', () => {
    const monthly = monthlyPayment(300_000, 725, 30);
    const r = calcDscr({
      monthlyRent: (monthly * 12 + 6000) / 12,
      annualOpex: 6000,
      loanAmount: 300_000,
      rateBps: 725,
      termYears: 30,
    });
    expect(r.dscr).toBeCloseTo(1.0, 2);
    expect(r.qualifies10).toBe(true);
    expect(r.qualifies125).toBe(false);
    expect(r.lenderTier).toBe('rejected');
  });

  it('hits 1.25x threshold', () => {
    const monthly = monthlyPayment(300_000, 725, 30);
    const targetNOI = monthly * 12 * 1.25;
    const r = calcDscr({
      monthlyRent: (targetNOI + 6000) / 12,
      annualOpex: 6000,
      loanAmount: 300_000,
      rateBps: 725,
      termYears: 30,
    });
    expect(r.dscr).toBeCloseTo(1.25, 2);
    expect(r.qualifies125).toBe(true);
    expect(r.qualifies150).toBe(false);
    expect(r.lenderTier).toBe('A');
  });

  it('hits 1.50x threshold', () => {
    const monthly = monthlyPayment(300_000, 725, 30);
    const targetNOI = monthly * 12 * 1.5;
    const r = calcDscr({
      monthlyRent: (targetNOI + 6000) / 12,
      annualOpex: 6000,
      loanAmount: 300_000,
      rateBps: 725,
      termYears: 30,
    });
    expect(r.dscr).toBeCloseTo(1.5, 2);
    expect(r.qualifies150).toBe(true);
    expect(r.lenderTier).toBe('A');
  });

  it('fails below 1.0x → rejected', () => {
    const r = calcDscr({
      monthlyRent: 1500,
      annualOpex: 8000,
      loanAmount: 300_000,
      rateBps: 725,
      termYears: 30,
    });
    expect(r.dscr).toBeLessThan(1.0);
    expect(r.qualifies10).toBe(false);
    expect(r.lenderTier).toBe('rejected');
  });

  it('B-tier between 1.10 and 1.24', () => {
    const monthly = monthlyPayment(300_000, 725, 30);
    const targetNOI = monthly * 12 * 1.15;
    const r = calcDscr({
      monthlyRent: (targetNOI + 6000) / 12,
      annualOpex: 6000,
      loanAmount: 300_000,
      rateBps: 725,
      termYears: 30,
    });
    expect(r.lenderTier).toBe('B');
  });

  it('returns 0 dscr if debt service is 0', () => {
    const r = calcDscr({
      monthlyRent: 5000,
      annualOpex: 0,
      loanAmount: 0,
      rateBps: 0,
      termYears: 30,
    });
    expect(r.dscr).toBe(0);
  });
});
