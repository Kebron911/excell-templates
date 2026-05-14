/**
 * Anthropic provider wrapper.
 *
 * Exposes a narrow `AiProvider` interface that the audit pipeline calls.
 * Decouples scorecard code from the @anthropic-ai/sdk surface so tests can
 * swap in a fixture-backed provider with zero network.
 *
 * Prompt caching is enabled by default on the system prompt — the per-dimension
 * rubric is the same across every audit, so cache hits dominate after warmup.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ModelId, TokenUsage } from './pricing';
import { ZERO_USAGE } from './pricing';

export interface AiCompletionRequest {
  model: ModelId;
  /** System prompt that benefits from caching (rubric + format spec). */
  systemCacheable: string;
  /** Optional additional system context that should NOT be cached (per-call). */
  systemDynamic?: string;
  /** User message — the per-audit data. */
  userMessage: string;
  /** Max output tokens. Per-dim calls cap around 700; synth around 1200. */
  maxTokens: number;
  /** Temperature; defaults to 0 for deterministic scoring. */
  temperature?: number;
}

export interface AiCompletionResponse {
  /** Concatenation of all text blocks returned by the model. */
  text: string;
  usage: TokenUsage;
  model: ModelId;
}

export interface AiProvider {
  complete(req: AiCompletionRequest): Promise<AiCompletionResponse>;
}

/** Default production provider — talks to the Anthropic API. */
export class AnthropicProvider implements AiProvider {
  constructor(
    private readonly client: Anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    }),
  ) {}

  async complete(req: AiCompletionRequest): Promise<AiCompletionResponse> {
    const systemBlocks: Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }> = [
      { type: 'text', text: req.systemCacheable, cache_control: { type: 'ephemeral' } },
    ];
    if (req.systemDynamic) {
      systemBlocks.push({ type: 'text', text: req.systemDynamic });
    }

    const res = await this.client.messages.create({
      model: req.model,
      max_tokens: req.maxTokens,
      temperature: req.temperature ?? 0,
      system: systemBlocks as any, // SDK union typing accepts blocks
      messages: [{ role: 'user', content: req.userMessage }],
    });

    const text = res.content
      .map((block: any) => (block.type === 'text' ? block.text : ''))
      .join('');

    const usage: TokenUsage = {
      inputTokens: res.usage?.input_tokens ?? 0,
      outputTokens: res.usage?.output_tokens ?? 0,
      cacheReadTokens: (res.usage as any)?.cache_read_input_tokens ?? 0,
      cacheWriteTokens: (res.usage as any)?.cache_creation_input_tokens ?? 0,
    };

    return { text, usage, model: req.model };
  }
}

/**
 * Test-friendly provider that returns canned responses keyed by a request fingerprint.
 * Used by the scorecard and cost-budget tests to avoid live API calls.
 */
export class FixtureAiProvider implements AiProvider {
  constructor(
    private readonly responses: Map<string, AiCompletionResponse>,
    /** When no fixture matches, default response (for sanity tests). */
    private readonly fallback?: AiCompletionResponse,
  ) {}

  static keyFor(req: AiCompletionRequest): string {
    // Coarse key: model + first 80 chars of user message. Sufficient for tests.
    return `${req.model}::${req.userMessage.slice(0, 80)}`;
  }

  async complete(req: AiCompletionRequest): Promise<AiCompletionResponse> {
    const key = FixtureAiProvider.keyFor(req);
    const hit = this.responses.get(key);
    if (hit) return { ...hit, usage: { ...hit.usage } };
    if (this.fallback) return { ...this.fallback, usage: { ...this.fallback.usage } };
    throw new Error(`fixture_miss: ${key}`);
  }
}

export { ZERO_USAGE };
