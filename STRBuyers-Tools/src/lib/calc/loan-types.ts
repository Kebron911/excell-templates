/**
 * Loan-types data shape — wraps src/data/loan-types.json with a typed
 * import for the Down Payment calculator and the DSCR calculator.
 */

export interface LoanType {
  id: 'conventional' | 'dscr' | 'second-home' | 'fha';
  label: string;
  minDownPct: number;
  dscrThreshold: number | null;
  rateEstimateBps: number;
  notes: string[];
  affiliateMatch: string[];
}

import data from '@/data/loan-types.json';

export const LOAN_TYPES = data as LoanType[];
