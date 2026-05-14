/**
 * Shared scaffolding for per-dimension prompts.
 *
 * Every dimension prompt follows the same contract:
 *   - cacheable system block declares role, rubric, output schema (stable across audits)
 *   - dynamic user message contains the just-this-listing data
 *   - model returns ONLY valid JSON conforming to DimensionPromptOutput
 *
 * The wrapper here handles parsing + zod validation + safe error fallback so
 * callers only ever deal with a typed `DimensionScore`.
 */

import { z } from 'zod';
import type { Dimension, DimensionScore, Fix } from '../../audit/types';
import type { AiCompletionRequest, AiCompletionResponse, AiProvider } from '../anthropic';
import type { ModelId } from '../pricing';

const FixSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(5),
  description: z.string().min(10),
  impact: z.enum(['high', 'medium', 'low']),
  effort: z.enum(['low', 'medium', 'high']),
});

const DimensionOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  reasoning: z.string().min(10),
  fixes: z.array(FixSchema).min(0).max(6),
});

export type DimensionPromptOutput = z.infer<typeof DimensionOutputSchema>;

export const PER_DIM_MODEL: ModelId = 'claude-haiku-4-5';
export const SYNTH_MODEL: ModelId = 'claude-sonnet-4-5';

/**
 * Strict JSON parser. Strips Markdown code fences if the model emits them.
 * Throws when the output cannot be parsed; callers catch and emit a low-confidence
 * fallback rather than failing the whole audit.
 */
export function parseModelJson(raw: string): unknown {
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(text);
}

export function buildDimensionUserMessage(label: string, payload: unknown): string {
  return `Listing data for the ${label} dimension:\n\n${JSON.stringify(payload, null, 2)}`;
}

export interface RunDimensionArgs {
  ai: AiProvider;
  dimension: Dimension;
  systemCacheable: string;
  payload: unknown;
  maxTokens?: number;
}

/** Calls the AI for a single dimension and returns the validated DimensionScore. */
export async function runDimensionPrompt(
  args: RunDimensionArgs,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  const req: AiCompletionRequest = {
    model: PER_DIM_MODEL,
    systemCacheable: args.systemCacheable,
    userMessage: buildDimensionUserMessage(args.dimension, args.payload),
    maxTokens: args.maxTokens ?? 800,
  };

  const response = await args.ai.complete(req);
  let parsed: DimensionPromptOutput;
  try {
    parsed = DimensionOutputSchema.parse(parseModelJson(response.text));
  } catch (err) {
    // Soft-fail: return a low-confidence neutral score rather than killing the audit.
    parsed = {
      score: 50,
      reasoning: `Could not parse model output for ${args.dimension} — defaulted to 50/100. Operator should inspect logs.`,
      fixes: [],
    };
  }

  const fixes: Fix[] = parsed.fixes.map((f) => ({
    id: f.id.startsWith(`${args.dimension}:`) ? f.id : `${args.dimension}:${f.id}`,
    dimension: args.dimension,
    title: f.title,
    description: f.description,
    impact: f.impact,
    effort: f.effort,
  }));

  return {
    score: {
      dimension: args.dimension,
      score: parsed.score,
      reasoning: parsed.reasoning,
      fixes,
    },
    response,
  };
}
