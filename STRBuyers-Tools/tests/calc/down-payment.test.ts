import { describe, it, expect } from 'vitest';
import { calculateDownPayment, monthlyPI } from '@/lib/calc/down-payment';

describe('monthlyPI', () => {
  it('returns 0 for zero principal', () => {
    expect(monthlyPI(0, 0.07, 30)).toBe(0);
  });

  it('returns principal/months when rate is 0', () => {
    expect(monthlyPI(36000, 0, 30)).toBeCloseTo(100, 4);
  });

  it('matches a known 30-year fixed at 7%', () => {
    // $300,000 @ 7% / 30y → ~$1,995.91/mo
    expect(monthlyPI(300_000, 0.07, 30)).toBeCloseTo(1995.91, 0);
  });
});

describe('calculateDownPayment', () => {
  it('DSCR uses 20% min down on $425k', () => {
    const r = calculateDownPayment({ purchasePrice: 425_000, loanType: 'dscr' });
    expect(r.minDownPct).toBe(0.2);
    expect(r.downPayment).toBe(85_000);
    expect(r.loanAmount).toBe(340_000);
  });

  it('Conventional investment uses 25% min down', () => {
    const r = calculateDownPayment({ purchasePrice: 400_000, loanType: 'conventional-investment' });
    expect(r.downPayment).toBe(100_000);
    expect(r.loanAmount).toBe(300_000);
  });

  it('Second home uses 10% min down', () => {
    const r = calculateDownPayment({ purchasePrice: 500_000, loanType: 'second-home' });
    expect(r.downPayment).toBe(50_000);
    expect(r.loanAmount).toBe(450_000);
  });

  it('FHA uses 3.5% down', () => {
    const r = calculateDownPayment({ purchasePrice: 400_000, loanType: 'fha-primary' });
    expect(r.downPayment).toBeCloseTo(14_000, 4);
  });

  it('passes through label, rate, and lender note', () => {
    const r = calculateDownPayment({ purchasePrice: 425_000, loanType: 'dscr' });
    expect(r.loanLabel).toBe('DSCR loan');
    expect(r.estimatedRatePct).toBeGreaterThan(0);
    expect(r.note).toMatch(/cash flow/i);
  });
});
