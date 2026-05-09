/**
 * Cash-on-cash return — annual cash flow ÷ total cash invested.
 *
 * Tiers:
 *   ≥ 0.08  → 'excellent'
 *   0.05–0.08 → 'good'
 *   0.02–0.05 → 'marginal'
 *   <  0.02 → 'reject'
 */

export type CocTier = 'excellent' | 'good' | 'marginal' | 'reject';

export interface CocInputs {
  annualCashFlow: number;
  totalCashInvested: number;
}

export interface CocResult {
  cocReturn: number;
  tier: CocTier;
}

const EPS = 1e-9;

export function calculateCashOnCash(i: CocInputs): CocResult {
  const cocReturn = i.totalCashInvested > 0 ? i.annualCashFlow / i.totalCashInvested : 0;
  const tier: CocTier =
    cocReturn + EPS >= 0.08
      ? 'excellent'
      : cocReturn + EPS >= 0.05
      ? 'good'
      : cocReturn + EPS >= 0.02
      ? 'marginal'
      : 'reject';
  return { cocReturn, tier };
}
