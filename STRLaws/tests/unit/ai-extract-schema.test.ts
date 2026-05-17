import { describe, expect, it } from 'vitest';
import {
  ExtractionParseError,
  extractionSchema,
  parseExtractionResponse,
} from '../../server/lib/ai/extract-schema';

describe('extractionSchema', () => {
  it('accepts a minimal valid extraction (confidence only)', () => {
    const r = extractionSchema.safeParse({ confidence_score: 0.91 });
    expect(r.success).toBe(true);
  });

  it('rejects confidence_score outside [0,1]', () => {
    expect(extractionSchema.safeParse({ confidence_score: 1.2 }).success).toBe(false);
    expect(extractionSchema.safeParse({ confidence_score: -0.1 }).success).toBe(false);
  });

  it('rejects missing confidence_score', () => {
    expect(extractionSchema.safeParse({ permit_required: true }).success).toBe(false);
  });

  it('rejects malformed effective_date', () => {
    expect(
      extractionSchema.safeParse({ confidence_score: 0.9, effective_date: 'May 14, 2026' }).success,
    ).toBe(false);
  });

  it('accepts a full populated extraction', () => {
    const r = extractionSchema.safeParse({
      confidence_score: 0.92,
      permit_required: true,
      permit_cost_usd: 313,
      tax_rate_pct: 6,
      ban_status: 'partial',
      effective_date: '2025-01-01',
      registration_url: 'https://example.gov/register',
    });
    expect(r.success).toBe(true);
  });
});

describe('parseExtractionResponse', () => {
  it('parses a clean JSON-only response', () => {
    const out = parseExtractionResponse('{"confidence_score": 0.9, "permit_required": true}');
    expect(out.confidence_score).toBe(0.9);
    expect(out.permit_required).toBe(true);
  });

  it('parses a fenced ```json code block', () => {
    const out = parseExtractionResponse('```json\n{"confidence_score": 0.7}\n```');
    expect(out.confidence_score).toBe(0.7);
  });

  it('extracts JSON wrapped in prose', () => {
    const out = parseExtractionResponse(
      'Here is the extraction:\n{"confidence_score": 0.95, "tax_rate_pct": 6}\nLet me know if you need anything else.',
    );
    expect(out.confidence_score).toBe(0.95);
    expect(out.tax_rate_pct).toBe(6);
  });

  it('throws ExtractionParseError on unparsable output', () => {
    expect(() => parseExtractionResponse('this is not json at all')).toThrow(ExtractionParseError);
  });

  it('throws ExtractionParseError when JSON is valid but schema-invalid', () => {
    expect(() => parseExtractionResponse('{"confidence_score": "high"}')).toThrow(ExtractionParseError);
  });
});
