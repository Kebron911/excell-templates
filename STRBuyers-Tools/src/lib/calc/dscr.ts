/**
 * DSCR (Debt-Service-Coverage Ratio) for STR investors.
 *
 * DSCR = annual NOI / annual debt service (P&I only, taxes/insurance NOT
 * included in the denominator — that is the standard lender definition).
 *
 * Lender-tier output mirrors the typical DSCR program rate sheet:
 *   ≥ 1.25x  → "A" (best rate)
 *   ≥ 1.10x  → "B" (standard rate)
 *   <  1.10x → "rejected" (lender will pass or quote a no-ratio program)
 *
 * The qualifies10/125/150 booleans line up with the three threshold
 * tickmarks shown on the calculator.
 */

export interface DscrInputs {
  /** Monthly gross STR revenue. */
  monthlyRent: number;
  /** Annual operating expenses (taxes, insurance, HOA, utilities, mgmt, cleaning). */
  annualOpex: number;
  /** Loan principal. */
  loanAmount: number;
  /** Rate in basis points (725 = 7.25%). */
  rateBps: number;
  /** Loan term, years. */
  termYears: number;
}

export type LenderTier = 'A' | 'B' | 'rejected';

export interface DscrResults {
  annualNOI: number;
  annualDebtService: number;
  monthlyPayment: number;
  dscr: number;
  qualifies10: boolean;
  qualifies125: boolean;
  qualifies150: boolean;
  lenderTier: LenderTier;
}

export function monthlyPayment(loan: number, rateBps: number, termYears: number): number {
  if (loan <= 0 || termYears <= 0) return 0;
  const r = rateBps / 10_000 / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
}

export function calcDscr(i: DscrInputs): DscrResults {
  const annualGross = i.monthlyRent * 12;
  const annualNOI = annualGross - i.annualOpex;
  const monthly = monthlyPayment(i.loanAmount, i.rateBps, i.termYears);
  const annualDebtService = monthly * 12;
  const dscr = annualDebtService > 0 ? annualNOI / annualDebtService : 0;
  // Float tolerance — guards against (1.25 + 1e-15) ratios that would
  // otherwise mis-tier an exact-on-the-boundary deal.
  const EPS = 1e-9;
  const lenderTier: LenderTier =
    dscr + EPS >= 1.25 ? 'A' : dscr + EPS >= 1.10 ? 'B' : 'rejected';
  return {
    annualNOI,
    annualDebtService,
    monthlyPayment: monthly,
    dscr,
    qualifies10: dscr + EPS >= 1.0,
    qualifies125: dscr + EPS >= 1.25,
    qualifies150: dscr + EPS >= 1.5,
    lenderTier,
  };
}

export const DSCR_DEFAULTS: DscrInputs = {
  monthlyRent: 6500,
  annualOpex: 12000,
  loanAmount: 400_000,
  rateBps: 825,
  termYears: 30,
};
