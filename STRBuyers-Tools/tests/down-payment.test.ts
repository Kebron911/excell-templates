import { describe, it, expect } from 'vitest';
import { compareLoans } from '@/lib/calc/down-payment';
import { LOAN_TYPES } from '@/lib/calc/loan-types';

describe('compareLoans', () => {
  it('FHA at $400k = $14,000 down (3.5%)', () => {
    const r = compareLoans(400_000, LOAN_TYPES);
    const fha = r.find((x) => x.loanType === 'fha')!;
    expect(fha.downPayment).toBeCloseTo(14_000, 0);
    expect(fha.loanAmount).toBeCloseTo(386_000, 0);
  });

  it('DSCR at $500k = $100,000 down (20%)', () => {
    const r = compareLoans(500_000, LOAN_TYPES);
    const dscr = r.find((x) => x.loanType === 'dscr')!;
    expect(dscr.downPayment).toBe(100_000);
    expect(dscr.loanAmount).toBe(400_000);
    expect(dscr.affiliateMatch).toContain('visio');
  });

  it('returns one row per loan type', () => {
    const r = compareLoans(400_000, LOAN_TYPES);
    expect(r).toHaveLength(LOAN_TYPES.length);
  });

  it('monthly payment is positive for all comparisons at $400k', () => {
    const r = compareLoans(400_000, LOAN_TYPES);
    for (const row of r) {
      expect(row.monthlyPayment).toBeGreaterThan(0);
    }
  });

  it('second-home requires 10% down', () => {
    const r = compareLoans(600_000, LOAN_TYPES);
    const sh = r.find((x) => x.loanType === 'second-home')!;
    expect(sh.downPayment).toBe(60_000);
  });
});
