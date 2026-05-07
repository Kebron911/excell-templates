/**
 * Down Payment calculator — pure logic.
 *
 * Outputs down payment dollars, loan amount, and a monthly P&I estimate using
 * the loan-type's rate placeholder. Real lender rates vary; this is a
 * scenario tool, not a quote.
 */

import loanTypes from '@/data/loan-types.json';

export type LoanTypeKey = keyof typeof loanTypes;

export interface DownPaymentInput {
  purchasePrice: number;
  loanType: LoanTypeKey;
}

export interface DownPaymentResult {
  loanLabel: string;
  minDownPct: number;
  downPayment: number;
  loanAmount: number;
  estimatedRatePct: number;
  estimatedMonthlyPI: number;
  termYears: number;
  note: string;
}

export const DOWN_PAYMENT_DEFAULTS: DownPaymentInput = {
  purchasePrice: 425000,
  loanType: 'dscr',
};

/**
 * Standard amortizing P&I given P, monthly rate r, number of months n.
 *   m = P * r / (1 - (1+r)^-n)
 */
export function monthlyPI(principal: number, annualRatePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  if (annualRatePct === 0) return principal / (termYears * 12);
  const r = annualRatePct / 12;
  const n = termYears * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function calculateDownPayment(i: DownPaymentInput): DownPaymentResult {
  const lt = (loanTypes as Record<string, {
    label: string;
    minDownPct: number;
    rateEstimatePct: number;
    termYears: number;
    note: string;
  }>)[i.loanType];

  const downPayment = i.purchasePrice * lt.minDownPct;
  const loanAmount = i.purchasePrice - downPayment;
  const estimatedMonthlyPI = monthlyPI(loanAmount, lt.rateEstimatePct, lt.termYears);

  return {
    loanLabel: lt.label,
    minDownPct: lt.minDownPct,
    downPayment,
    loanAmount,
    estimatedRatePct: lt.rateEstimatePct,
    estimatedMonthlyPI,
    termYears: lt.termYears,
    note: lt.note,
  };
}
