import { describe, expect, it, vi } from 'vitest';
import { callWithCache, type AnthropicMessagesClient, type AnthropicMessagesCreateParams, type AnthropicMessageResponse } from '../../server/lib/ai/claude-client';
import { CostAccumulator, CostExceededError } from '../../server/lib/ai/cost';
import type { UsagePayload } from '../../server/lib/ai/cost';

function fakeResponse(
  text: string,
  usage: UsagePayload = { input_tokens: 100, output_tokens: 50 },
): AnthropicMessageResponse {
  return {
    id: 'msg_test',
    content: [{ type: 'text', text }],
    usage,
    stop_reason: 'end_turn',
  };
}

describe('callWithCache', () => {
  it('places cache_control on both system segments', async () => {
    let received: AnthropicMessagesCreateParams | null = null;
    const fakeClient: AnthropicMessagesClient = {
      create: vi.fn(async (params: AnthropicMessagesCreateParams) => {
        received = params;
        return fakeResponse('{}');
      }),
    };
    const acc = new CostAccumulator();

    await callWithCache(fakeClient, acc, {
      systemPrompt: 'You are an ordinance extractor.',
      schemaPrompt: '{ "permit_required": "boolean", ... }',
      variableInput: 'Section 5.65.030: Permits required.',
      estimatedUsage: { input_tokens: 500, output_tokens: 200 },
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
    });

    expect(received).not.toBeNull();
    const params = received as unknown as AnthropicMessagesCreateParams;
    expect(params.system).toHaveLength(2);
    expect(params.system[0]!.cache_control).toEqual({ type: 'ephemeral' });
    expect(params.system[1]!.cache_control).toEqual({ type: 'ephemeral' });
  });

  it('does NOT cache the variable user message (per spec — only 1-3k raw input is uncached)', async () => {
    let received: AnthropicMessagesCreateParams | null = null;
    const fakeClient: AnthropicMessagesClient = {
      create: vi.fn(async (params: AnthropicMessagesCreateParams) => {
        received = params;
        return fakeResponse('{}');
      }),
    };
    await callWithCache(fakeClient, new CostAccumulator(), {
      systemPrompt: 'sys',
      schemaPrompt: 'schema',
      variableInput: 'raw',
      estimatedUsage: { input_tokens: 50, output_tokens: 20 },
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 256,
    });
    const params = received as unknown as AnthropicMessagesCreateParams;
    const userBlocks = params.messages[0]!.content;
    expect(userBlocks).toHaveLength(1);
    expect(userBlocks[0]!.cache_control).toBeUndefined();
  });

  it('refuses to call when projected cost exceeds the ceiling', async () => {
    const fakeClient: AnthropicMessagesClient = {
      create: vi.fn(async () => fakeResponse('{}')),
    };
    const acc = new CostAccumulator(0.001); // unrealistically tight
    await expect(
      callWithCache(fakeClient, acc, {
        systemPrompt: 'sys',
        schemaPrompt: 'schema',
        variableInput: 'raw',
        estimatedUsage: { input_tokens: 200_000, output_tokens: 50_000 },
        model: 'claude-opus-4-7',
        maxTokens: 4096,
      }),
    ).rejects.toBeInstanceOf(CostExceededError);
    expect(fakeClient.create).not.toHaveBeenCalled();
  });

  it('records actual usage in the accumulator after a successful call', async () => {
    const fakeClient: AnthropicMessagesClient = {
      create: vi.fn(async () => fakeResponse('{"permit_required": true}', {
        input_tokens: 100,
        cache_creation_input_tokens: 800,
        cache_read_input_tokens: 0,
        output_tokens: 250,
      })),
    };
    const acc = new CostAccumulator();
    const result = await callWithCache(fakeClient, acc, {
      systemPrompt: 'sys',
      schemaPrompt: 'schema',
      variableInput: 'raw',
      estimatedUsage: { input_tokens: 100, output_tokens: 250 },
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
    });
    expect(acc.callCount).toBe(1);
    expect(acc.totalUsd).toBeGreaterThan(0);
    expect(result.costUsd).toBe(acc.totalUsd);
    expect(result.text).toContain('permit_required');
  });

  it('concatenates multiple text blocks in the response', async () => {
    const fakeClient: AnthropicMessagesClient = {
      create: vi.fn(async () => ({
        id: 'm',
        content: [
          { type: 'text' as const, text: 'part-a' },
          { type: 'text' as const, text: 'part-b' },
        ],
        usage: { input_tokens: 10, output_tokens: 5 },
        stop_reason: 'end_turn' as string | null,
      })),
    };
    const result = await callWithCache(fakeClient, new CostAccumulator(), {
      systemPrompt: 'sys',
      schemaPrompt: 'schema',
      variableInput: 'raw',
      estimatedUsage: { input_tokens: 10, output_tokens: 5 },
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 256,
    });
    expect(result.text).toBe('part-a\npart-b');
  });
});
