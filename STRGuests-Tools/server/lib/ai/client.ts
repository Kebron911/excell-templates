/**
 * Anthropic SDK wrapper.
 *
 * Above this module: callers see `generate(promptVersion, vars) -> { text, usage }`.
 * Below this module: a swap to OpenAI / any other provider is one file.
 *
 * The SDK constructor reads ANTHROPIC_API_KEY lazily at first call (not import),
 * so the rest of the server can boot in tests / dev without a key set.
 */

import Anthropic from '@anthropic-ai/sdk';
import { LISTING_V1 } from './prompts/listing.js';
import { REVIEW_V1 } from './prompts/review.js';
import { MESSAGE_V1 } from './prompts/message.js';

export class AiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiConfigError';
  }
}

export class AiInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiInputError';
  }
}

export const PROMPTS = {
  listing: LISTING_V1,
  review: REVIEW_V1,
  message: MESSAGE_V1,
} as const;

export type PromptId = keyof typeof PROMPTS;

const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AiConfigError(
      'ANTHROPIC_API_KEY is not set. Provide a key in .env to enable AI generators.',
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}

export interface GenerateResult {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  model: string;
}

export async function generate<P extends PromptId>(
  promptId: P,
  vars: unknown,
): Promise<GenerateResult> {
  const prompt = PROMPTS[promptId];
  const parsed = prompt.schema.safeParse(vars);
  if (!parsed.success) {
    throw new AiInputError(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  }

  const userMessage = (prompt.user as (v: unknown) => string)(parsed.data);
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  const response = await getClient().messages.create({
    model,
    max_tokens: MAX_TOKENS,
    system: prompt.system,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  return {
    text,
    usage: {
      promptTokens: response.usage?.input_tokens ?? 0,
      completionTokens: response.usage?.output_tokens ?? 0,
    },
    model,
  };
}

/**
 * Test-only hook to reset the cached SDK client between tests.
 * Production code never calls this.
 */
export function __resetClientForTests(): void {
  client = null;
}
