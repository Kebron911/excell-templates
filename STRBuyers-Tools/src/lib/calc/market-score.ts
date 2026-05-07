/**
 * Market Score — pure logic.
 *
 * Heuristic 0–100 score combining:
 *   - ADR (median nightly rate)         — weight 30
 *   - Occupancy %                        — weight 30
 *   - Regulation status                  — weight 20 (allowed | restrictive | banned)
 *   - Saturation tier                    — weight 20 (low | medium | high)
 *
 * Caps + floors prevent any single dimension from dominating; the regulation
 * score zero-floors the total when the market is banned (no STRs allowed).
 */

export type RegulationStatus = 'allowed' | 'restrictive' | 'banned';
export type SaturationTier = 'low' | 'medium' | 'high';

export interface MarketScoreInput {
  /** Median ADR in dollars. */
  medianADR: number;
  /** Annual occupancy as decimal 0–1. */
  occupancyPct: number;
  regulationStatus: RegulationStatus;
  saturationTier: SaturationTier;
}

export type MarketLabel = 'avoid' | 'marginal' | 'mixed' | 'strong';

export interface MarketScoreResult {
  score: number;        // 0–100
  label: MarketLabel;
  notes: string[];
  components: {
    adr: number;        // 0–30
    occupancy: number;  // 0–30
    regulation: number; // 0–20
    saturation: number; // 0–20
  };
}

export const MARKET_SCORE_DEFAULTS: MarketScoreInput = {
  medianADR: 220,
  occupancyPct: 0.62,
  regulationStatus: 'allowed',
  saturationTier: 'medium',
};

const REGULATION_POINTS: Record<RegulationStatus, number> = {
  allowed: 20,
  restrictive: 10,
  banned: 0,
};

const SATURATION_POINTS: Record<SaturationTier, number> = {
  low: 20,
  medium: 12,
  high: 4,
};

/**
 * ADR scoring scale (out of 30):
 *   $80 → 0, $400+ → 30, linear in between.
 */
function adrPoints(adr: number): number {
  const min = 80;
  const max = 400;
  if (adr <= min) return 0;
  if (adr >= max) return 30;
  return ((adr - min) / (max - min)) * 30;
}

/**
 * Occupancy scoring scale (out of 30):
 *   0.30 → 0, 0.75+ → 30.
 */
function occupancyPoints(occ: number): number {
  const min = 0.30;
  const max = 0.75;
  if (occ <= min) return 0;
  if (occ >= max) return 30;
  return ((occ - min) / (max - min)) * 30;
}

export function calculateMarketScore(i: MarketScoreInput): MarketScoreResult {
  const components = {
    adr: adrPoints(i.medianADR),
    occupancy: occupancyPoints(i.occupancyPct),
    regulation: REGULATION_POINTS[i.regulationStatus],
    saturation: SATURATION_POINTS[i.saturationTier],
  };

  let score = components.adr + components.occupancy + components.regulation + components.saturation;

  // Banned regulation zeros the total.
  if (i.regulationStatus === 'banned') score = 0;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label: MarketLabel;
  if (i.regulationStatus === 'banned' || score < 30) label = 'avoid';
  else if (score < 50) label = 'marginal';
  else if (score < 70) label = 'mixed';
  else label = 'strong';

  const notes: string[] = [];
  if (i.regulationStatus === 'banned') notes.push('STRs are not allowed in this market — score forced to 0.');
  if (i.regulationStatus === 'restrictive') notes.push('Restrictive regs add operational risk and cap upside.');
  if (i.saturationTier === 'high') notes.push('High saturation drags ADR over time. Watch for price wars.');
  if (components.adr < 15) notes.push('Median ADR is on the low end — model thin margins carefully.');
  if (components.occupancy < 15) notes.push('Occupancy below 50% means a lot of fixed costs against fewer booked nights.');

  return { score, label, notes, components };
}
