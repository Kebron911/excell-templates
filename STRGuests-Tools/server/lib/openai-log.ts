/**
 * Shared "call OpenAI + record to generation_logs" helper used by all 3 AI generators.
 *
 * Folds the OpenAI call, the audit-log INSERT, and the prompt-hash computation into one
 * function so individual route handlers stay short and don't drift on log column names.
 */

import { createHash } from 'node:crypto';
import { generate, type GenerateOutput } from './openai-client';
import { query } from './db';
import type { RateState } from './rate-limit';

export interface GenerateAndLogInput {
  toolSlug: string;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
  rateState: RateState;
}

export interface GenerateAndLogResult extends GenerateOutput {
  remaining: number;
  resetAt: Date;
}

function promptHash(system: string, user: string): string {
  return createHash('sha256').update(system).update('\n----\n').update(user).digest('hex');
}

export async function generateAndLog(input: GenerateAndLogInput): Promise<GenerateAndLogResult> {
  const start = Date.now();
  let result: GenerateOutput | null = null;
  let status: 'ok' | 'openai_error' = 'ok';
  try {
    result = await generate({
      system: input.system,
      user: input.user,
      maxTokens: input.maxTokens,
      temperature: input.temperature,
    });
  } catch (err) {
    status = 'openai_error';
    await query(
      `INSERT INTO generation_logs
       (ip_hash, email, tool_slug, model, prompt_tokens, completion_tokens, prompt_hash, latency_ms, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.rateState.identifier,
        input.rateState.email ?? null,
        input.toolSlug,
        'gpt-4o-mini',
        0,
        0,
        promptHash(input.system, input.user),
        Date.now() - start,
        status,
      ],
    );
    throw err;
  }

  await query(
    `INSERT INTO generation_logs
     (ip_hash, email, tool_slug, model, prompt_tokens, completion_tokens, prompt_hash, latency_ms, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.rateState.identifier,
      input.rateState.email ?? null,
      input.toolSlug,
      result.model,
      result.promptTokens,
      result.completionTokens,
      promptHash(input.system, input.user),
      result.latencyMs,
      status,
    ],
  );

  return {
    ...result,
    remaining: input.rateState.remaining,
    resetAt: input.rateState.resetAt,
  };
}
