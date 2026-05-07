/**
 * Shared type contracts for strops.tools data models.
 *
 * Used by Phase 2 maintenance-schedule + damage-cost-lookup, and Phase 3
 * programmatic /maintenance/[task] + /replace/[item] page generators.
 */

export interface MaintenanceTask {
  name: string;
  /** Days between recurrences. */
  cadenceDays: number;
  season: 'all' | 'spring' | 'summer' | 'fall' | 'winter';
  estimatedCostUsd: [number, number];
  skillLevel: 'diy' | 'pro';
  consequencesOfSkipping: string;
  sourceUrls: string[];
  /** ISO YYYY-MM-DD. */
  lastVerified: string;
}

export type TaskCatalog = Record<string, MaintenanceTask>;

export interface ReplacementItem {
  name: string;
  category: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'electronics' | 'outdoor' | 'utility';
  costRange: [number, number];
  lifespanYears: number;
  brandRecs: string[];
  sourceUrls: string[];
  lastVerified: string;
}

export type ItemCatalog = Record<string, ReplacementItem>;
