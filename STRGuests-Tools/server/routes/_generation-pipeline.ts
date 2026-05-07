/**
 * Shared pipeline for AI generator endpoints. Consolidates:
 *   - body validation (zod via the prompt's schema)
 *   - rate-limit consume
 *   - aiClient.generate
 *   - generation_logs audit row
 *   - response shaping
 *
 * Each tool's route is a single line: `router.post(path, makeGenerateHandler('listing-description', 'listing'))`.
 */

import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { generate, AiConfigError, AiInputError, PROMPTS, type PromptId } from '../lib/ai/client.js';
import { readState, consume } from '../middleware/rate-limit.js';
import { query } from '../lib/db.js';

export type ToolSlug = 'listing-description' | 'review-response' | 'guest-messages';

export function makeGenerateHandler(toolSlug: ToolSlug, promptId: PromptId) {
  const prompt = PROMPTS[promptId];

  return async (req: Request, res: Response) => {
    const parsed = prompt.schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'invalid_input',
        details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
    }

    const state = await readState(req, toolSlug);
    if (state.remaining <= 0) {
      return res.status(429).json({
        error: 'rate_limited',
        tier: state.tier,
        limit: state.limit,
        resetAt: state.resetAt.toISOString(),
      });
    }

    const consumeResult = await consume(state, toolSlug);
    if (consumeResult.blocked) {
      return res.status(429).json({
        error: 'rate_limited',
        tier: state.tier,
        limit: state.limit,
        resetAt: state.resetAt.toISOString(),
      });
    }

    const t0 = Date.now();
    let result: { text: string; usage: { promptTokens: number; completionTokens: number }; model: string };
    try {
      result = await generate(promptId, parsed.data);
    } catch (err) {
      if (err instanceof AiConfigError) {
        return res.status(503).json({ error: 'ai_unconfigured', message: err.message });
      }
      if (err instanceof AiInputError) {
        return res.status(400).json({ error: 'invalid_input', message: err.message });
      }
      console.error('[generate] AI error:', err);
      await logGeneration({
        toolSlug,
        state,
        model: 'unknown',
        promptText: JSON.stringify(parsed.data),
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - t0,
        status: 'ai_error',
      });
      return res.status(502).json({ error: 'ai_error' });
    }

    const latencyMs = Date.now() - t0;
    await logGeneration({
      toolSlug,
      state,
      model: result.model,
      promptText: JSON.stringify(parsed.data),
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      latencyMs,
      status: 'ok',
    });

    res.json({
      result: result.text,
      tokensUsed: result.usage.promptTokens + result.usage.completionTokens,
      requestsRemaining: consumeResult.remaining,
    });
  };
}

interface LogArgs {
  toolSlug: ToolSlug;
  state: { ipHash: string; email: string | null };
  model: string;
  promptText: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: string;
}

async function logGeneration(args: LogArgs): Promise<void> {
  try {
    const promptHash = createHash('sha256').update(args.promptText).digest('hex');
    await query(
      'INSERT INTO generation_logs (ip_hash, email, tool_slug, model, prompt_tokens, completion_tokens, prompt_hash, latency_ms, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        args.state.ipHash,
        args.state.email,
        args.toolSlug,
        args.model,
        args.promptTokens,
        args.completionTokens,
        promptHash,
        args.latencyMs,
        args.status,
      ],
    );
  } catch (err) {
    // Logging is best-effort. Do not fail the request on log failure.
    console.error('[generation_logs] insert failed:', err);
  }
}
