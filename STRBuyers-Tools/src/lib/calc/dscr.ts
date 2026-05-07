/**
 * DSCR (Debt Service Coverage Ratio) calculator — pure logic.
 *
 * STR DSCR lenders typically use:
 *   DSCR = monthly gross rental income / monthly PITIA
 * where PITIA = Principal + Interest + Taxes + Insurance + HOA/Assoc.
 *
 * Tier labels reflect how most DSCR lenders price the loan:
 *   ≥ 1.25  — strong: best rates, max LTV
 *   1.00–1.24 — qualifying: rate adjustments may apply, LTV may step down
 *   < 1.00 — short: borrower must put more down or carry rate hit
 */

export type DscrTier = 'strong' | 'qualifying' | 'short';

export interface DscrInput {
  /** Expected monthly gross rental income (1007 form / market rent letter). */
  monthlyRent: number;
  /** Total monthly PITIA payment. */
  monthlyPitia: number;
}

export interface DscrResult {
  ratio: number;
  tier: DscrTier;
  /** One-line lender-perspective note. */
  note: string;
}

export const DSCR_DEFAULTS = {
  monthlyRent: 5000,
  monthlyPitia: 3500,
} as const;

export function calculateDscr(i: DscrInput): DscrResult {
  const ratio = i.monthlyPitia > 0 ? i.monthlyRent / i.monthlyPitia : 0;
  let tier: DscrTier;
  let note: string;
  if (ratio >= 1.25) {
    tier = 'strong';
    note = 'Strong DSCR. Best rates, max LTV (typically 75–80%).';
  } else if (ratio >= 1.0) {
    tier = 'qualifying';
    note = 'Qualifying. Most lenders fund — expect rate add-ons or reduced LTV.';
  } else {
    tier = 'short';
    note = 'Short. Lower the loan amount (more down) or raise expected rent.';
  }
  return { ratio, tier, note };
}
