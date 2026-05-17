/**
 * Diff engine types (spec §7 stage 3: detect-changes).
 *
 * A diff compares the latest regulations row for a city against the
 * previously-published one. The orchestrator persists DiffResult as a
 * regulation_changes row (migration 0002).
 *
 * RegulationRow is intentionally duplicated from src/lib/city-data here:
 * the server tsconfig rootDir excludes the frontend data layer, so this
 * module keeps its own copy. Keep field set in sync with the regulations
 * MySQL table (migration 0001).
 */
export interface RegulationRow {
  id: number;
  city_id: number;
  snapshot_id: number | null;
  effective_date: string | null;
  permit_required: number | null;
  permit_cost_usd: number | null;
  permit_url: string | null;
  occupancy_cap_persons: number | null;
  tax_rate_pct: number | null;
  tax_authority: string | null;
  ban_status: 'none' | 'partial' | 'full' | 'moratorium' | null;
  ban_details_md: string | null;
  registration_required: number | null;
  registration_url: string | null;
  primary_residence_only: number | null;
  max_nights_per_year: number | null;
  zoning_notes_md: string | null;
  enforcement_notes_md: string | null;
}

export type ChangeSeverity = 'minor' | 'material' | 'major';

export interface FieldChange<T = unknown> {
  field: keyof RegulationRow;
  before: T;
  after: T;
  /** Severity contribution of this single field. The overall diff
   *  takes the max across all FieldChanges. */
  severity: ChangeSeverity;
  /** Human-readable summary. Drives blog-post + alert email copy. */
  description: string;
}

export interface DiffResult {
  cityId: number;
  prevRegulationId: number | null;
  nextRegulationId: number;
  severity: ChangeSeverity;
  changes: FieldChange[];
  /** True when the regulations look unchanged (no FieldChanges).
   *  The orchestrator skips persisting these. */
  isNoop: boolean;
}
