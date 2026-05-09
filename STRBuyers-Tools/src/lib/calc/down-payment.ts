/**
 * Down-payment comparison across STR-eligible loan products.
 *
 * For a given purchase price, returns one DownPaymentResult per loan
 * type from loan-types.json — down payment, loan amount, monthly P&I,
 * and the affiliate vendors that lend that product.
 */

import type { LoanType } from './loan-types';
import { monthlyPayment } from './dscr';

export interface DownPaymentResult {
  loanType: LoanType['id'];
  label: string;
  downPayment: number;
  downPaymentPct: number;
  loanAmount: number;
  monthlyPayment: number;
  rateEstimateBps: number;
  notes: string[];
  affiliateMatch: string[];
}

export function compareLoans(price: number, loans: LoanType[]): DownPaymentResult[] {
  return loans.map((l) => {
    const dp = price * l.minDownPct;
    const loan = price - dp;
    return {
      loanType: l.id,
      label: l.label,
      downPayment: dp,
      downPaymentPct: l.minDownPct,
      loanAmount: loan,
      monthlyPayment: monthlyPayment(loan, l.rateEstimateBps, 30),
      rateEstimateBps: l.rateEstimateBps,
      notes: l.notes,
      affiliateMatch: l.affiliateMatch,
    };
  });
}

/**
 * Single-loan helper for the URL-state-driven UI when a user selects
 * one loan type from a dropdown.
 */
export function calculateDownPayment(args: {
  propertyPrice: number;
  loan: LoanType;
  customPercent?: number;
}): DownPaymentResult {
  const { propertyPrice, loan, customPercent } = args;
  const pct = customPercent !== undefined ? customPercent : loan.minDownPct;
  const dp = propertyPrice * pct;
  const principal = propertyPrice - dp;
  return {
    loanType: loan.id,
    label: loan.label,
    downPayment: dp,
    downPaymentPct: pct,
    loanAmount: principal,
    monthlyPayment: monthlyPayment(principal, loan.rateEstimateBps, 30),
    rateEstimateBps: loan.rateEstimateBps,
    notes: loan.notes,
    affiliateMatch: loan.affiliateMatch,
  };
}
