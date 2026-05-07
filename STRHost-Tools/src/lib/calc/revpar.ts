/**
 * Occupancy + ADR + RevPAR — pure logic.
 *
 *   occupancy = nightsBooked / nightsAvailable     (0 if denominator 0)
 *   adr       = revenue       / nightsBooked       (0 if denominator 0)
 *   revpar    = revenue       / nightsAvailable    (== adr * occupancy)
 */

export interface RevparInput {
  nightsAvailable: number;
  nightsBooked: number;
  revenue: number;
}

export interface RevparResult {
  occupancy: number;
  adr: number;
  revpar: number;
}

export const REVPAR_DEFAULTS: RevparInput = {
  nightsAvailable: 30,
  nightsBooked: 21,
  revenue: 4200,
};

export function calculateRevpar(i: RevparInput): RevparResult {
  const occupancy = i.nightsAvailable > 0 ? i.nightsBooked / i.nightsAvailable : 0;
  const adr       = i.nightsBooked    > 0 ? i.revenue       / i.nightsBooked    : 0;
  const revpar    = i.nightsAvailable > 0 ? i.revenue       / i.nightsAvailable : 0;
  return { occupancy, adr, revpar };
}
