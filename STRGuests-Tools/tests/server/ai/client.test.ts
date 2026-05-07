import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createMock = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      apiKey: string;
      messages = { create: createMock };
      constructor(opts: { apiKey: string }) {
        this.apiKey = opts.apiKey;
      }
    },
  };
});

describe('ai/client.generate', () => {
  beforeEach(async () => {
    createMock.mockReset();
    const { __resetClientForTests } = await import('../../../server/lib/ai/client');
    __resetClientForTests();
    process.env.ANTHROPIC_API_KEY = 'test-key';
    delete process.env.ANTHROPIC_MODEL;
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_MODEL;
  });

  it('throws AiConfigError when ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const { generate, AiConfigError } = await import('../../../server/lib/ai/client');
    await expect(
      generate('listing', {
        propertyType: 'cabin',
        bedrooms: 2,
        bathrooms: 1,
        sleeps: 4,
        location: 'Asheville, NC',
        features: ['hot tub'],
        tone: 'warm',
        length: 'short',
      }),
    ).rejects.toBeInstanceOf(AiConfigError);
  });

  it('rejects invalid input via AiInputError before calling the SDK', async () => {
    const { generate, AiInputError } = await import('../../../server/lib/ai/client');
    await expect(generate('listing', { tone: 'warm' })).rejects.toBeInstanceOf(AiInputError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('passes system + user message to the SDK and returns shaped result', async () => {
    createMock.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'A warm cabin perched above the lake.' }],
      usage: { input_tokens: 215, output_tokens: 88 },
    });
    const { generate } = await import('../../../server/lib/ai/client');
    const out = await generate('listing', {
      propertyType: 'cabin',
      bedrooms: 2,
      bathrooms: 1,
      sleeps: 4,
      location: 'Asheville, NC',
      features: ['hot tub', 'fire pit'],
      tone: 'warm',
      length: 'short',
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    const call = createMock.mock.calls[0][0];
    expect(call.model).toBe('claude-haiku-4-5');
    expect(call.max_tokens).toBeGreaterThan(0);
    expect(typeof call.system).toBe('string');
    expect(call.messages).toHaveLength(1);
    expect(call.messages[0].role).toBe('user');
    expect(call.messages[0].content).toMatch(/cabin/);
    expect(call.messages[0].content).toMatch(/Asheville/);
    expect(out.text).toBe('A warm cabin perched above the lake.');
    expect(out.usage).toEqual({ promptTokens: 215, completionTokens: 88 });
    expect(out.model).toBe('claude-haiku-4-5');
  });

  it('honors ANTHROPIC_MODEL override', async () => {
    process.env.ANTHROPIC_MODEL = 'claude-sonnet-4-6';
    createMock.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'ok' }],
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    const { generate } = await import('../../../server/lib/ai/client');
    await generate('review', {
      reviewText: 'Great stay!',
      starRating: 5,
      tone: 'warm',
      responseGoal: 'thank',
    });
    expect(createMock.mock.calls[0][0].model).toBe('claude-sonnet-4-6');
  });

  it('concatenates multiple text blocks in the response', async () => {
    createMock.mockResolvedValueOnce({
      content: [
        { type: 'text', text: 'Part one.' },
        { type: 'tool_use', id: 'x' }, // ignored
        { type: 'text', text: 'Part two.' },
      ],
      usage: { input_tokens: 10, output_tokens: 5 },
    });
    const { generate } = await import('../../../server/lib/ai/client');
    const out = await generate('message', {
      messageType: 'pre-arrival',
      propertyName: 'Cozy Cabin',
      hostName: 'Daniel',
    });
    expect(out.text).toBe('Part one.\nPart two.');
  });
});
