export interface MaintenanceTask {
  name: string;
  cadenceDays: number;
  season: 'all' | 'spring' | 'summer' | 'fall' | 'winter';
  estimatedCostUsd: [number, number];
  skillLevel: 'diy' | 'pro';
  consequencesOfSkipping: string;
  sourceUrls: string[];
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
