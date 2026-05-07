/**
 * Comp Analyzer — pure logic.
 *
 * Inputs: 3 listings × {nightlyRate, occupancyPct, cleaningFee}.
 * Output:
 *   per-listing: annual gross revenue (rent only) and annual gross with cleaning
 *   summary: average annual gross, spread (max-min as % of average)
 *
 * Spread is the headline metric: a tight spread (<15%) means the comps agree;
 * a wide spread (>30%) means at least one outlier and the buyer should dig.
 */

const NIGHTS_PER_YEAR = 365;

export interface CompListing {
  nightlyRate: number;
  occupancyPct: number;   // 0–1 decimal
  cleaningFee: number;
}

export interface CompResult {
  perListing: {
    listing: CompListing;
    bookedNights: number;
    annualRent: number;
    annualCleaning: number;
    annualGross: number;
  }[];
  averageGross: number;
  minGross: number;
  maxGross: number;
  /** (max - min) / average. */
  spreadPct: number;
  /** "tight" (<15%) | "moderate" (15–30%) | "wide" (>30%) | "single" (1 listing) */
  spreadLabel: 'single' | 'tight' | 'moderate' | 'wide';
}

export const COMP_DEFAULTS: CompListing[] = [
  { nightlyRate: 220, occupancyPct: 0.62, cleaningFee: 110 },
  { nightlyRate: 245, occupancyPct: 0.58, cleaningFee: 130 },
  { nightlyRate: 195, occupancyPct: 0.70, cleaningFee: 95 },
];

export function calculateComp(listings: CompListing[]): CompResult {
  const perListing = listings.map((l) => {
    const bookedNights = NIGHTS_PER_YEAR * l.occupancyPct;
    const annualRent = bookedNights * l.nightlyRate;
    // Each booking averages ~3 nights → ~bookedNights / 3 cleaning fees collected
    const annualCleaning = (bookedNights / 3) * l.cleaningFee;
    return {
      listing: l,
      bookedNights,
      annualRent,
      annualCleaning,
      annualGross: annualRent + annualCleaning,
    };
  });

  const grosses = perListing.map((p) => p.annualGross);
  const minGross = grosses.length > 0 ? Math.min(...grosses) : 0;
  const maxGross = grosses.length > 0 ? Math.max(...grosses) : 0;
  const averageGross = grosses.length > 0
    ? grosses.reduce((a, b) => a + b, 0) / grosses.length
    : 0;
  const spreadPct = averageGross > 0 ? (maxGross - minGross) / averageGross : 0;

  let spreadLabel: CompResult['spreadLabel'];
  if (listings.length < 2) spreadLabel = 'single';
  else if (spreadPct < 0.15) spreadLabel = 'tight';
  else if (spreadPct < 0.30) spreadLabel = 'moderate';
  else spreadLabel = 'wide';

  return { perListing, averageGross, minGross, maxGross, spreadPct, spreadLabel };
}
