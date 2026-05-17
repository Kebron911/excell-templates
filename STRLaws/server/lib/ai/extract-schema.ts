/**
 * Zod schema for the structured ordinance extraction the model returns.
 *
 * Mirrors the regulations table (server/db/migrations/0001_init.sql). Every
 * field is optional from the model's perspective — we'd rather take a
 * partial extraction with high confidence than reject it outright.
 * The confidence_score is the ONLY required output: extractions without it
 * route to review_queue regardless of other fields.
 */
import { z } from 'zod';

const banStatusSchema = z.enum(['none', 'partial', 'full', 'moratorium']);

export const extractionSchema = z.object({
  confidence_score: z.number().min(0).max(1),
  permit_required: z.boolean().nullable().optional(),
  permit_cost_usd: z.number().nonnegative().nullable().optional(),
  permit_url: z.string().url().nullable().optional(),
  occupancy_cap_persons: z.number().int().positive().nullable().optional(),
  occupancy_cap_bedrooms_ratio: z.number().nonnegative().nullable().optional(),
  tax_rate_pct: z.number().min(0).max(100).nullable().optional(),
  tax_authority: z.string().nullable().optional(),
  ban_status: banStatusSchema.nullable().optional(),
  ban_details_md: z.string().nullable().optional(),
  registration_required: z.boolean().nullable().optional(),
  registration_url: z.string().url().nullable().optional(),
  primary_residence_only: z.boolean().nullable().optional(),
  max_nights_per_year: z.number().int().positive().nullable().optional(),
  inspection_required: z.boolean().nullable().optional(),
  insurance_minimum_usd: z.number().int().nonnegative().nullable().optional(),
  zoning_notes_md: z.string().nullable().optional(),
  enforcement_notes_md: z.string().nullable().optional(),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

export type ExtractionPayload = z.infer<typeof extractionSchema>;

export class ExtractionParseError extends Error {
  constructor(
    message: string,
    public readonly rawText: string,
    public readonly zodIssues?: unknown,
  ) {
    super(message);
    this.name = 'ExtractionParseError';
  }
}

/**
 * Pull the first JSON object out of the model's text response and validate it.
 * The model is instructed to return JSON-only, but in practice it sometimes
 * wraps the payload in fenced code blocks or prose. This handles both.
 */
export function parseExtractionResponse(text: string): ExtractionPayload {
  const trimmed = text.trim();
  const candidates: string[] = [];

  // Fenced ```json … ``` block
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (fenceMatch?.[1]) candidates.push(fenceMatch[1]);

  // Raw {…} object (first balanced one)
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end > start) candidates.push(trimmed.slice(start, end + 1));

  candidates.push(trimmed);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const result = extractionSchema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      // try the next candidate
    }
  }

  throw new ExtractionParseError(
    'Could not parse a valid extraction payload from model output',
    text,
  );
}
