/**
 * Cash-on-Cash Return calculator — pure logic.
 *
 *   CoC = annual cash flow / total cash invested
 *
 * Benchmarks (rough, US single-family STR market 2025–26):
 *   ≥ 10% : strong
 *   6–10% : solid
 *   3–6%  : marginal — watch overhead drift
 *   < 3%  : revisit assumptions or pass
 */

export type CocBenchmark = 'strong' | 'solid' | 'marginal' | 'revisit';

export interface CashOnCashInput {
  annualCashFlow: number;       // post-debt service, post-expense
  totalCashInvested: number;    // down + closing + furnishing + reserves
}

export interface CashOnCashResult {
  coc: number;            // 0–1 decimal (e.g. 0.085 for 8.5%)
  benchmark: CocBenchmark;
  note: string;
}

export const COC_DEFAULTS: CashOnCashInput = {
  annualCashFlow: 12_000,
  totalCashInvested: 140_000,
};

export function calculateCashOnCash(i: CashOnCashInput): CashOnCashResult {
  const coc = i.totalCashInvested > 0 ? i.annualCashFlow / i.totalCashInvested : 0;
  let benchmark: CocBenchmark;
  let note: string;
  if (coc >= 0.10) {
    benchmark = 'strong';
    note = 'Strong CoC. Pencils out cleanly even with conservative occupancy.';
  } else if (coc >= 0.06) {
    benchmark = 'solid';
    note = 'Solid. In line with most STR investors’ buy boxes for 2025–26.';
  } else if (coc >= 0.03) {
    benchmark = 'marginal';
    note = 'Marginal. Re-check expense estimates; line items drift higher than projections.';
  } else {
    benchmark = 'revisit';
    note = 'Below most operators’ hurdle. Revisit purchase price or expense projections.';
  }
  return { coc, benchmark, note };
}
