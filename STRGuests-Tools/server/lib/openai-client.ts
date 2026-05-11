/**
 * OpenAI client wrapper — pinned to gpt-4o-mini for cost control.
 *
 * Exposes a single `generate({ system, user, maxTokens, temperature })`
 * helper that:
 *
 *   - Calls Chat Completions with the strguests system+user pair
 *   - Caps max_tokens (default 800) — prevents runaway responses
 *   - Aborts after ~30s (per-attempt) via AbortController
 *   - Retries 429 + 5xx (max 3 attempts total) with exponential backoff
 *   - Surfaces 4xx (non-429) immediately — caller validates input
 *
 * Returns: `{ text, promptTokens, completionTokens, latencyMs }`
 *
 * Used by:
 *   - server/routes/generate-listing.ts (Task 19)
 *   - server/routes/generate-review.ts  (Task 20)
 *   - server/routes/generate-message.ts (Task 21)
 *
 * Tested with vi.mock('openai') in tests/server/openai-client.test.ts.
 */

import OpenAI from 'openai';

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_MAX_TOKENS = 800;
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 400;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  client = new OpenAI({ apiKey });
  return client;
}

/** Test/dev hook — reset the cached singleton. */
export function resetOpenAiClient(): void {
  client = null;
}

export interface GenerateInput {
  /** Pinned system prompt (tool-specific). */
  system: string;
  /** Rendered user prompt (form-built). */
  user: string;
  /** Output cap — defaults to 800. */
  maxTokens?: number;
  /** 0–1; defaults to 0.7. */
  temperature?: number;
  /** Per-attempt timeout in ms. Defaults to 30_000. */
  timeoutMs?: number;
}

export interface GenerateOutput {
  text: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  model: string;
}

function isRetryableError(err: unknown): boolean {
  const e = err as { status?: number; code?: string };
  if (!e) return false;
  if (e.status === 429) return true;
  if (typeof e.status === 'number' && e.status >= 500 && e.status < 600) return true;
  // Network-ish errors (ECONNRESET, ETIMEDOUT, etc.) — always retry.
  if (e.code && /^(ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED)$/.test(e.code)) {
    return true;
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Single attempt. Caller wraps with retry logic.
 */
async function callOnce(input: Required<Pick<GenerateInput, 'system' | 'user' | 'maxTokens' | 'temperature' | 'timeoutMs'>>): Promise<GenerateOutput> {
  const c = getClient();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), input.timeoutMs);
  const start = Date.now();
  try {
    const res = await c.chat.completions.create(
      {
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
        max_tokens: input.maxTokens,
        temperature: input.temperature,
      },
      { signal: ac.signal },
    );
    const latencyMs = Date.now() - start;
    const text = res.choices?.[0]?.message?.content ?? '';
    return {
      text,
      promptTokens: res.usage?.prompt_tokens ?? 0,
      completionTokens: res.usage?.completion_tokens ?? 0,
      latencyMs,
      model: res.model ?? DEFAULT_MODEL,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Public entry point. Retries 429/5xx/network errors up to 3 attempts total
 * with exponential backoff (400ms → 800ms).
 */
export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  const cfg = {
    system: input.system,
    user: input.user,
    maxTokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: input.temperature ?? DEFAULT_TEMPERATURE,
    timeoutMs: input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await callOnce(cfg);
    } catch (err) {
      lastErr = err;
      if (attempt === MAX_ATTEMPTS || !isRetryableError(err)) {
        throw err;
      }
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

export const __test = {
  DEFAULT_MODEL,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  MAX_ATTEMPTS,
  isRetryableError,
};
