/**
 * Lodging-tax data shape — single row per US state (+ DC).
 *
 * Hand-compiled from state DOR sources. Annual review cadence; the
 * `lastVerified` field flags entries older than 12 months.
 *
 * Rates are expressed as DECIMAL fractions (0.06, not 6.0). Local add-on
 * range is [low, high] tuple representing the bounds across all
 * municipalities in that state.
 */

export interface StateTaxEntry {
  /** Full state name, e.g. "Texas". */
  name: string;
  /** Statewide lodging tax rate as a decimal (0.06 = 6%). */
  stateRate: number;
  /** Platforms that collect and remit on behalf of the host. */
  platformCollects: Array<'airbnb' | 'vrbo'>;
  /** Local add-on rate range [low, high] across all municipalities. */
  localAddOnRange: [number, number];
  /** Authoritative source URL for verification. */
  sourceUrl: string;
  /** ISO date the entry was last verified against the source. */
  lastVerified: string;
  /** One-sentence summary of the tax structure. */
  notes: string;
}

/** Map keyed by lowercase USPS state code (`tx`, `ca`, `dc`, ...). */
export type LodgingTaxData = Record<string, StateTaxEntry>;
