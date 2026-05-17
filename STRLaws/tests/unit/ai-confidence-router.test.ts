import { describe, expect, it } from 'vitest';
import {
  PUBLISH_THRESHOLD,
  RETRY_THRESHOLD,
  routeCostExceeded,
  routeExtraction,
  routeParseFailure,
} from '../../server/lib/ai/confidence-router';
import type { ExtractionPayload } from '../../server/lib/ai/extract-schema';

function payload(confidence: number, extra: Partial<ExtractionPayload> = {}): ExtractionPayload {
  return { confidence_score: confidence, ...extra };
}

describe('routeExtraction', () => {
  it('publishes when confidence ≥ 0.85', () => {
    const d = routeExtraction({ haikuPassComplete: false, payload: payload(0.9) });
    expect(d.kind).toBe('publish');
  });

  it('uses 0.85 as the exact publish boundary', () => {
    expect(routeExtraction({ haikuPassComplete: false, payload: payload(PUBLISH_THRESHOLD) }).kind).toBe('publish');
    expect(routeExtraction({ haikuPassComplete: false, payload: payload(PUBLISH_THRESHOLD - 0.001) }).kind).toBe('retry_opus');
  });

  it('retries on Opus when 0.5 ≤ confidence < 0.85 and Haiku has NOT yet run', () => {
    const d = routeExtraction({ haikuPassComplete: false, payload: payload(0.7) });
    expect(d.kind).toBe('retry_opus');
  });

  it('routes mid-confidence to review after Haiku already retried', () => {
    const d = routeExtraction({ haikuPassComplete: true, payload: payload(0.7) });
    expect(d.kind).toBe('review');
    if (d.kind === 'review') {
      expect(d.reason).toBe('low_confidence');
      expect(d.confidence).toBe(0.7);
    }
  });

  it('uses 0.5 as the retry boundary', () => {
    expect(routeExtraction({ haikuPassComplete: false, payload: payload(RETRY_THRESHOLD) }).kind).toBe('retry_opus');
    expect(routeExtraction({ haikuPassComplete: false, payload: payload(RETRY_THRESHOLD - 0.001) }).kind).toBe('review');
  });

  it('routes confidence < 0.5 directly to review_queue', () => {
    const d = routeExtraction({ haikuPassComplete: false, payload: payload(0.3) });
    expect(d.kind).toBe('review');
    if (d.kind === 'review') expect(d.reason).toBe('low_confidence');
  });

  it('preserves the payload through the routing decision', () => {
    const p = payload(0.95, { permit_cost_usd: 250 });
    const d = routeExtraction({ haikuPassComplete: false, payload: p });
    if (d.kind === 'publish') {
      expect(d.payload.permit_cost_usd).toBe(250);
    } else {
      throw new Error('expected publish kind');
    }
  });
});

describe('routeParseFailure', () => {
  it('returns review with reason=extraction_failed', () => {
    const d = routeParseFailure();
    expect(d.kind).toBe('review');
    if (d.kind === 'review') expect(d.reason).toBe('extraction_failed');
  });

  it('reports null confidence (no payload was parsed)', () => {
    const d = routeParseFailure();
    if (d.kind === 'review') expect(d.confidence).toBeNull();
  });
});

describe('routeCostExceeded', () => {
  it('returns review with reason=cost_exceeded', () => {
    const d = routeCostExceeded();
    expect(d.kind).toBe('review');
    if (d.kind === 'review') expect(d.reason).toBe('cost_exceeded');
  });

  it('preserves a known confidence if the cost ran out mid-retry', () => {
    const d = routeCostExceeded(0.6);
    if (d.kind === 'review') expect(d.confidence).toBe(0.6);
  });
});
