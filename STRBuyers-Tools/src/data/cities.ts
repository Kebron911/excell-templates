/**
 * Aggregated cities directory for strbuyers.tools.
 *
 * Source data is split across four cities-part-N.json files purely for tooling
 * and review ergonomics — combined into a single map at build time.
 *
 * Schema per entry:
 *   slug              kebab-case city-state slug (e.g. "austin-tx")
 *   name              display name
 *   state             two-letter state code
 *   stateName         full state name
 *   population        latest available population estimate
 *   adrAvg            average daily rate, dollars
 *   occupancyAvg      0–1 average occupancy
 *   revparAvg         adrAvg × occupancyAvg, dollars (precomputed)
 *   regulationStatus  'permissive' | 'moderate' | 'restrictive' | 'banned'
 *   saturationTier    'A' | 'B' | 'C' | 'D' (A = least saturated, D = most)
 *   marketScore       0–100 (computed via market-score formula)
 *   notes             short flavor / regulatory note
 *   dataQuality       'researched' | 'estimated'
 *   lastReviewed      ISO date string
 */

import part1 from './cities-part-1.json';
import part2 from './cities-part-2.json';
import part3 from './cities-part-3.json';
import part4 from './cities-part-4.json';

export type RegulationStatus = 'permissive' | 'moderate' | 'restrictive' | 'banned';
export type SaturationTier = 'A' | 'B' | 'C' | 'D';

export interface CityEntry {
  slug: string;
  name: string;
  state: string;
  stateName: string;
  population: number;
  adrAvg: number;
  occupancyAvg: number;
  revparAvg: number;
  regulationStatus: RegulationStatus;
  saturationTier: SaturationTier;
  marketScore: number;
  notes: string;
  dataQuality: 'researched' | 'estimated';
  lastReviewed: string;
}

const cities = {
  ...(part1 as Record<string, CityEntry>),
  ...(part2 as Record<string, CityEntry>),
  ...(part3 as Record<string, CityEntry>),
  ...(part4 as Record<string, CityEntry>),
} as Record<string, CityEntry>;

export default cities;

export function getCity(slug: string): CityEntry | undefined {
  return cities[slug];
}

export function listCities(): CityEntry[] {
  return Object.values(cities);
}
