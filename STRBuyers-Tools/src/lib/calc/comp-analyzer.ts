/**
 * Comp analyzer — given a small set of comparable listings, computes
 * average ADR / occupancy / RevPAR and flags rows whose value deviates
 * by more than 25% from the mean (the "outlier" threshold).
 *
 * Tiny by design: 3-row paste is the launch UX; doesn't need full
 * statistical machinery. Mean + percent-deviation is enough for a
 * buyer to spot a comp that's off.
 */

const OUTLIER_PCT = 0.25;

export interface Listing {
  label: string;
  adr: number;
  occupancy: number;
  revPar?: number;
}

export interface EnrichedListing extends Listing {
  revPar: number;
}

export interface CompResult {
  listings: EnrichedListing[];
  avgAdr: number;
  avgOcc: number;
  avgRevpar: number;
  outliers: {
    adr: number[];
    occupancy: number[];
    revPar: number[];
  };
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function findOutliers(xs: number[], avg: number): number[] {
  if (avg === 0) return [];
  const out: number[] = [];
  xs.forEach((x, i) => {
    const dev = Math.abs(x - avg) / avg;
    if (dev > OUTLIER_PCT) out.push(i);
  });
  return out;
}

export function analyzeComps(rows: Listing[]): CompResult {
  const enriched: EnrichedListing[] = rows.map((r) => ({
    ...r,
    revPar: r.revPar ?? r.adr * r.occupancy,
  }));
  const adrs = enriched.map((r) => r.adr);
  const occs = enriched.map((r) => r.occupancy);
  const rps = enriched.map((r) => r.revPar);

  const avgAdr = mean(adrs);
  const avgOcc = mean(occs);
  const avgRevpar = mean(rps);

  return {
    listings: enriched,
    avgAdr,
    avgOcc,
    avgRevpar,
    outliers: {
      adr: findOutliers(adrs, avgAdr),
      occupancy: findOutliers(occs, avgOcc),
      revPar: findOutliers(rps, avgRevpar),
    },
  };
}
