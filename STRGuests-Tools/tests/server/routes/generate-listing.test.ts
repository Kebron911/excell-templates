import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const queryMock = vi.fn();
const queryOneMock = vi.fn();
const generateMock = vi.fn();

vi.mock('../../../server/lib/db', () => ({
  query: (...args: unknown[]) => queryMock(...args),
  queryOne: (...args: unknown[]) => queryOneMock(...args),
}));

vi.mock('../../../server/lib/ai/client', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    generate: (...args: unknown[]) => generateMock(...args),
  };
});

import { makeGenerateListingRouter } from '../../../server/routes/generate-listing';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(makeGenerateListingRouter());
  return app;
}

describe('POST /api/generate-listing', () => {
  beforeEach(() => {
    queryMock.mockReset();
    queryOneMock.mockReset();
    generateMock.mockReset();
    process.env.IP_HASH_SALT = 'test-salt';
    process.env.EMAIL_VERIFY_SECRET = 'a-test-secret-with-enough-bytes';
    delete process.env.NODE_ENV;
  });
  afterEach(() => {
    delete process.env.IP_HASH_SALT;
    delete process.env.EMAIL_VERIFY_SECRET;
  });

  const goodBody = {
    propertyType: 'cabin',
    bedrooms: 2,
    bathrooms: 1,
    sleeps: 4,
    location: 'Asheville, NC',
    features: ['hot tub', 'fire pit'],
    tone: 'warm',
    length: 'short',
  };

  it('returns 400 on invalid body', async () => {
    const res = await request(makeApp()).post('/api/generate-listing').send({ tone: 'warm' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_input');
    expect(generateMock).not.toHaveBeenCalled();
  });

  it('returns 429 when rate-limited (count == limit)', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 5 });
    const res = await request(makeApp()).post('/api/generate-listing').send(goodBody);
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('rate_limited');
    expect(generateMock).not.toHaveBeenCalled();
  });

  it('returns the generated text + remaining count on success', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    generateMock.mockResolvedValueOnce({
      text: 'A warm cabin perched above the lake.',
      usage: { promptTokens: 215, completionTokens: 88 },
      model: 'claude-haiku-4-5',
    });
    const res = await request(makeApp()).post('/api/generate-listing').send(goodBody);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('A warm cabin perched above the lake.');
    expect(res.body.tokensUsed).toBe(303);
    expect(res.body.requestsRemaining).toBe(4);
    expect(generateMock).toHaveBeenCalledWith('listing', expect.objectContaining({ propertyType: 'cabin' }));
  });

  it('writes a row to generation_logs on success', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    generateMock.mockResolvedValueOnce({
      text: 'ok',
      usage: { promptTokens: 1, completionTokens: 1 },
      model: 'claude-haiku-4-5',
    });
    await request(makeApp()).post('/api/generate-listing').send(goodBody);
    const insertCalls = queryMock.mock.calls.filter((c) => /generation_logs/.test(c[0] as string));
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0][1][3]).toBe('claude-haiku-4-5');
  });

  it('returns 503 when ANTHROPIC_API_KEY is missing', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    const { AiConfigError } = await import('../../../server/lib/ai/client');
    generateMock.mockRejectedValueOnce(new AiConfigError('ANTHROPIC_API_KEY is not set.'));
    const res = await request(makeApp()).post('/api/generate-listing').send(goodBody);
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('ai_unconfigured');
  });
});
