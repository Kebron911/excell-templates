/**
 * Confidence-gate routing decision (spec §7).
 *
 * Pure decision logic — no I/O. Caller is responsible for executing the
 * decision (insert into regulations vs review_queue, retry call against Opus,
 * post Slack notification, etc.).
 *
 *   confidence ≥ 0.85         → publish
 *   0.5 ≤ confidence < 0.85   → retry on Opus (only on Haiku pass)
 *   confidence < 0.5          → review_queue (reason='low_confidence')
 *   parse failure             → review_queue (reason='extraction_failed')
 *   cost ceiling exceeded     → review_queue (reason='cost_exceeded')
 */
import type { ExtractionPayload } from './extract-schema';

export const PUBLISH_THRESHOLD = 0.85;
export const RETRY_THRESHOLD = 0.5;

export type ReviewReason = 'low_confidence' | 'cost_exceeded' | 'extraction_failed' | 'manual';

export type RoutingDecision =
  | { kind: 'publish'; payload: ExtractionPayload; confidence: number }
  | { kind: 'retry_opus'; previousPayload: ExtractionPayload; confidence: number }
  | { kind: 'review'; reason: ReviewReason; confidence: number | null; payload?: ExtractionPayload };

export interface RoutingInput {
  /** Whether we've already retried on Opus for this snapshot. */
  haikuPassComplete: boolean;
  payload: ExtractionPayload;
}

export function routeExtraction(input: RoutingInput): RoutingDecision {
  const c = input.payload.confidence_score;

  if (c >= PUBLISH_THRESHOLD) {
    return { kind: 'publish', payload: input.payload, confidence: c };
  }

  if (c >= RETRY_THRESHOLD && !input.haikuPassComplete) {
    return { kind: 'retry_opus', previousPayload: input.payload, confidence: c };
  }

  return {
    kind: 'review',
    reason: 'low_confidence',
    confidence: c,
    payload: input.payload,
  };
}

export function routeParseFailure(): RoutingDecision {
  return { kind: 'review', reason: 'extraction_failed', confidence: null };
}

export function routeCostExceeded(confidenceIfKnown: number | null = null): RoutingDecision {
  return { kind: 'review', reason: 'cost_exceeded', confidence: confidenceIfKnown };
}
