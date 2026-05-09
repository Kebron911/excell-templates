/**
 * Market score — 0–100 grade for an STR market profile based on
 * regulation status, RevPAR economics, and saturation tier.
 *
 * Weighting: regulation 40%, economics 40%, saturation 20%.
 *
 * Tiers:
 *   85+  → A
 *   70+  → B
 *   55+  → C
 *   40+  → D
 *   <40  → F (still labeled 'D' in the launch UX to match buyer
 *           dropdown options; 'F' could land in a v2 tier rebalance)
 *
 * Phase 3 swaps the manual inputs for cities.json lookups.
 */

export type RegulationStatus = 'open' | 'gray' | 'restricted';
export type SaturationTier = 'low' | 'medium' | 'high';

export interface MarketScoreInputs {
  adr: number;
  occupancy: number;
  regulationStatus: RegulationStatus;
  saturationTier: SaturationTier;
}

export type MarketTier = 'A' | 'B' | 'C' | 'D';

export interface MarketScoreResult {
  score: number;
  tier: MarketTier;
  breakdown: {
    regulation: number;
    economics: number;
    saturation: number;
  };
  headline: string;
  flags: string[];
}

const REG: Record<RegulationStatus, number> = { open: 100, gray: 65, restricted: 35 };
const SAT: Record<SaturationTier, number> = { low: 100, medium: 60, high: 30 };

export function scoreMarket(i: MarketScoreInputs): MarketScoreResult {
  const regulation = REG[i.regulationStatus];
  const revPar = i.adr * i.occupancy;
  const economics = Math.min(100, Math.round((revPar / 200) * 100));
  const saturation = SAT[i.saturationTier];

  const score = Math.round(regulation * 0.4 + economics * 0.4 + saturation * 0.2);
  const tier: MarketTier =
    score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D';

  const headline =
    tier === 'A'
      ? "Strong buyer's market — green lights."
      : tier === 'B'
      ? 'Solid market — verify regulation before offer.'
      : tier === 'C'
      ? 'Mixed signals — proceed with diligence.'
      : 'Difficult market — high regulatory or saturation risk.';

  const flags: string[] = [];
  if (i.regulationStatus === 'restricted') {
    flags.push('Restricted regulation — verify exact municipality before offer.');
  }
  if (i.regulationStatus === 'gray') {
    flags.push('Gray-zone regulation — rules are evolving; subscribe to local news.');
  }
  if (i.saturationTier === 'high') {
    flags.push('High saturation — break-in occupancy may take 3–6 mo. longer than projected.');
  }
  if (revPar < 100) {
    flags.push('RevPAR below $100 — STR economics likely thinner than long-term rental.');
  }

  return {
    score,
    tier,
    breakdown: { regulation, economics, saturation },
    headline,
    flags,
  };
}
