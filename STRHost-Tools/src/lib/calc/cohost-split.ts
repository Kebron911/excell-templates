/**
 * Co-host split calculator — pure logic.
 *
 * Two modes:
 *   percent: cohostShare = netRevenue * cohostPct
 *   flat:    cohostShare = flatFeePerBooking * bookings + perNightFee * nightsBooked
 *
 * In both modes:
 *   grossRevenue = adr * nightsBooked
 *   netRevenue   = grossRevenue - passThroughCosts
 *   cohostShare  = max(0, computed cohost share)
 *   ownerShare   = max(0, netRevenue - cohostShare)
 *
 * The clamp prevents weird negative-share displays when fixed cohost fees
 * exceed a slow month's net revenue.
 */

export type CohostMode = 'percent' | 'flat';

export interface CohostSplitInput {
  mode: CohostMode;
  adr: number;
  nightsBooked: number;
  passThroughCosts: number;
  // Percent mode:
  cohostPct: number;
  // Flat mode:
  flatFeePerBooking: number;
  perNightFee: number;
  bookings: number;
}

export interface CohostSplitResult {
  grossRevenue: number;
  netRevenue: number;
  cohostShare: number;
  ownerShare: number;
}

export const COHOST_DEFAULTS: CohostSplitInput = {
  mode: 'percent',
  adr: 200,
  nightsBooked: 20,
  passThroughCosts: 500,
  cohostPct: 0.20,
  flatFeePerBooking: 50,
  perNightFee: 5,
  bookings: 8,
};

export function calculateCohostSplit(i: CohostSplitInput): CohostSplitResult {
  const grossRevenue = i.adr * i.nightsBooked;
  const netRevenue = grossRevenue - i.passThroughCosts;
  const cohostRaw =
    i.mode === 'percent'
      ? netRevenue * i.cohostPct
      : i.flatFeePerBooking * i.bookings + i.perNightFee * i.nightsBooked;
  const cohostShare = Math.max(0, cohostRaw);
  const ownerShare = Math.max(0, netRevenue - cohostShare);
  return { grossRevenue, netRevenue, cohostShare, ownerShare };
}
