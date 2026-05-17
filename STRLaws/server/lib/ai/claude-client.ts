/**
 * Claude client wrapper with mandatory prompt caching + cost-ceiling enforcement.
 *
 * Spec invariants:
 *   - Every call MUST place cache_control markers on stable prompt segments
 *     (system + schema + examples). Callers pass system + schema; this module
 *     ensures the cache marker is set.
 *   - Per-snapshot ceiling ($0.05 default) is checked BEFORE the call leaves;
 *     a projected over-spend throws CostExceededError without an API hit.
 *   - Caller owns the CostAccumulator so a single snapshot can stretch across
 *     a Haiku → Opus escalation without losing budget state.
 *
 * The client is dependency-injected so unit tests can stub it without an API key.
 */
import { CostAccumulator, type UsagePayload } from './cost';
import type { ClaudeModel } from './pricing';

/** Minimal shape of an Anthropic Messages API client (compatible with @anthropic-ai/sdk). */
export interface AnthropicMessagesClient {
  create(params: AnthropicMessagesCreateParams): Promise<AnthropicMessageResponse>;
}

export interface AnthropicMessagesCreateParams {
  model: ClaudeModel;
  max_tokens: number;
  system: Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }>;
  messages: Array<{
    role: 'user' | 'assistant';
    content: Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }>;
  }>;
  temperature?: number;
}

export interface AnthropicMessageResponse {
  id: string;
  content: Array<{ type: 'text'; text: string }>;
  usage: UsagePayload;
  stop_reason: string | null;
}

export interface CachedCallInput {
  /** Stable system prompt — cache_control marker is auto-applied. */
  systemPrompt: string;
  /**
   * Stable schema or examples block — cache_control marker is auto-applied.
   * Separate breakpoint from systemPrompt so the cache survives schema-only edits.
   */
  schemaPrompt: string;
  /** The variable portion (e.g. raw ordinance text). NOT cached. */
  variableInput: string;
  /** Estimated token usage for pre-flight ceiling check. */
  estimatedUsage: UsagePayload;
  model: ClaudeModel;
  maxTokens: number;
  temperature?: number;
}

export interface CachedCallResult {
  text: string;
  usage: UsagePayload;
  stopReason: string | null;
  costUsd: number;
}

/**
 * Issue a cache-controlled message call, enforcing the per-snapshot budget.
 * Caller owns the CostAccumulator instance.
 */
export async function callWithCache(
  client: AnthropicMessagesClient,
  accumulator: CostAccumulator,
  input: CachedCallInput,
): Promise<CachedCallResult> {
  accumulator.assertCanAfford(input.model, input.estimatedUsage);

  const params: AnthropicMessagesCreateParams = {
    model: input.model,
    max_tokens: input.maxTokens,
    temperature: input.temperature ?? 0,
    system: [
      { type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: input.schemaPrompt, cache_control: { type: 'ephemeral' } },
    ],
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: input.variableInput }],
      },
    ],
  };

  const response = await client.create(params);
  const cost = accumulator.record(input.model, response.usage);
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return {
    text,
    usage: response.usage,
    stopReason: response.stop_reason,
    costUsd: cost.totalUsd,
  };
}

/**
 * Lazily build a real Anthropic SDK client. Returns null if the SDK
 * is not installed or ANTHROPIC_API_KEY is missing — caller decides
 * whether to fall back or fail loud.
 */
export async function loadDefaultClient(): Promise<AnthropicMessagesClient | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const mod = await import('@anthropic-ai/sdk');
    const Anthropic = (mod as { default?: unknown }).default ?? (mod as { Anthropic?: unknown }).Anthropic;
    if (!Anthropic) return null;
    const Ctor = Anthropic as new (init: { apiKey: string }) => { messages: AnthropicMessagesClient };
    const client = new Ctor({ apiKey });
    return client.messages;
  } catch {
    return null;
  }
}
