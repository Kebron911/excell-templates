/**
 * Public types for the audit pipeline output.
 * Stored shape persisted to `audit_runs.scores_json` and `audit_runs.fixes_json`.
 */

import type { TokenUsage } from '../ai/pricing';

export type Dimension =
  | 'title'
  | 'description'
  | 'photos'
  | 'amenities'
  | 'reviews';

export type Impact = 'high' | 'medium' | 'low';
export type Effort = 'low' | 'medium' | 'high';

export interface Fix {
  /** Stable identifier — `<dimension>:<short-slug>`, e.g. `title:add-location`. */
  id: string;
  dimension: Dimension;
  /** One-sentence problem statement aimed at the host. */
  title: string;
  /** ~2 sentence rationale + concrete next-step instruction. */
  description: string;
  impact: Impact;
  effort: Effort;
}

export interface DimensionScore {
  dimension: Dimension;
  /** 0-100 integer. */
  score: number;
  /** 1-3 sentence summary of why this score. */
  reasoning: string;
  /** Dimension-specific fixes the model proposed. Synthesizer picks top 5 overall. */
  fixes: Fix[];
}

export interface AuditResult {
  /** Per-dimension scores in canonical order. */
  scores: DimensionScore[];
  /** Composite 0-100 score — weighted average across dimensions. */
  overallScore: number;
  /** Top 5 fixes selected by the synthesizer across all dimensions. */
  topFixes: Fix[];
  /** One-paragraph executive summary aimed at the host. */
  summary: string;
}

export interface AuditCostBreakdown {
  perDim: TokenUsage[];
  synth: TokenUsage;
  total: TokenUsage;
  totalCostUsd: number;
}
