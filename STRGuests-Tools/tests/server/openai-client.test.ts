import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests the OpenAI client wrapper at server/lib/openai-client.ts.
 *
 * The OpenAI SDK is mocked so no real HTTP traffic occurs and we can
 * deterministically test retry + error-mapping behaviour.
 */

// Module-scoped state shared with the mocked OpenAI constructor.
const state: {
  responses: Array<() => Promise<any>>;
  calls: number;
} = { responses: [], calls: 0 };

vi.mock('openai', () => {
  class OpenAI {
    apiKey: string;
    chat: { completions: { create: (...args: any[]) => Promise<any> } };
    constructor(opts: { apiKey: string }) {
      this.apiKey = opts.apiKey;
      this.chat = {
        completions: {
          create: vi.fn(async () => {
            const next = state.responses.shift();
            state.calls += 1;
            if (!next) {
              throw new Error('No more mock responses queued');
            }
            return next();
          }),
        },
      };
    }
  }
  return { default: OpenAI };
});

function ok(text = 'hello world', prompt_tokens = 10, completion_tokens = 5) {
  return async () => ({
    choices: [{ message: { content: text } }],
    usage: { prompt_tokens, completion_tokens, total_tokens: prompt_tokens + completion_tokens },
    model: 'gpt-4o-mini-2024-07-18',
  });
}

function fail(status: number, message = 'mock failure') {
  return async () => {
    const err: any = new Error(message);
    err.status = status;
    throw err;
  };
}

describe('openai-client.generate', () => {
  beforeEach(async () => {
    state.responses = [];
    state.calls = 0;
    process.env.OPENAI_API_KEY = 'test-key';
    const mod = await import('../../server/lib/openai-client');
    mod.resetOpenAiClient();
  });

  it('returns text, token counts, latency on success', async () => {
    state.responses.push(ok('Generated copy.', 12, 7));
    const { generate } = await import('../../server/lib/openai-client');
    const out = await generate({ system: 'sys', user: 'usr' });
    expect(out.text).toBe('Generated copy.');
    expect(out.promptTokens).toBe(12);
    expect(out.completionTokens).toBe(7);
    expect(out.model).toMatch(/gpt-4o-mini/);
    expect(out.latencyMs).toBeGreaterThanOrEqual(0);
    expect(state.calls).toBe(1);
  });

  it('retries on 429 then succeeds', async () => {
    state.responses.push(fail(429, 'rate limit'));
    state.responses.push(ok('OK after retry'));
    const { generate } = await import('../../server/lib/openai-client');
    const out = await generate({ system: 's', user: 'u' });
    expect(out.text).toBe('OK after retry');
    expect(state.calls).toBe(2);
  });

  it('retries on 503 then succeeds', async () => {
    state.responses.push(fail(503, 'svc unavail'));
    state.responses.push(ok('recovered'));
    const { generate } = await import('../../server/lib/openai-client');
    const out = await generate({ system: 's', user: 'u' });
    expect(out.text).toBe('recovered');
    expect(state.calls).toBe(2);
  });

  it('gives up after 3 attempts on persistent 500s', async () => {
    state.responses.push(fail(500), fail(500), fail(500));
    const { generate } = await import('../../server/lib/openai-client');
    await expect(generate({ system: 's', user: 'u' })).rejects.toMatchObject({ status: 500 });
    expect(state.calls).toBe(3);
  });

  it('surfaces 400 immediately (no retry)', async () => {
    state.responses.push(fail(400, 'bad request'));
    const { generate } = await import('../../server/lib/openai-client');
    await expect(generate({ system: 's', user: 'u' })).rejects.toMatchObject({ status: 400 });
    expect(state.calls).toBe(1);
  });

  it('throws clearly when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { generate, resetOpenAiClient } = await import('../../server/lib/openai-client');
    resetOpenAiClient();
    await expect(generate({ system: 's', user: 'u' })).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it('pins the gpt-4o-mini model', async () => {
    const { __test } = await import('../../server/lib/openai-client');
    expect(__test.DEFAULT_MODEL).toBe('gpt-4o-mini');
  });

  it('isRetryableError classifies 429 + 5xx as retryable, 400 as not', async () => {
    const { __test } = await import('../../server/lib/openai-client');
    expect(__test.isRetryableError({ status: 429 })).toBe(true);
    expect(__test.isRetryableError({ status: 500 })).toBe(true);
    expect(__test.isRetryableError({ status: 503 })).toBe(true);
    expect(__test.isRetryableError({ status: 400 })).toBe(false);
    expect(__test.isRetryableError({ status: 200 })).toBe(false);
    expect(__test.isRetryableError({ code: 'ECONNRESET' })).toBe(true);
  });
});
