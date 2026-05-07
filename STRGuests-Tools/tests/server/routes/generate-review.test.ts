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

import { makeGenerateReviewRouter } from '../../../server/routes/generate-review';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(makeGenerateReviewRouter());
  return app;
}

describe('POST /api/generate-review', () => {
  beforeEach(() => {
    queryMock.mockReset();
    queryOneMock.mockReset();
    generateMock.mockReset();
    process.env.IP_HASH_SALT = 'test-salt';
    process.env.EMAIL_VERIFY_SECRET = 'a-test-secret-with-enough-bytes';
  });
  afterEach(() => {
    delete process.env.IP_HASH_SALT;
    delete process.env.EMAIL_VERIFY_SECRET;
  });

  const goodBody = {
    reviewText: 'Loved it. Wifi was spotty.',
    starRating: 4,
    tone: 'warm',
    responseGoal: 'address-issue',
  };

  it('rejects bad starRating', async () => {
    const res = await request(makeApp())
      .post('/api/generate-review')
      .send({ ...goodBody, starRating: 10 });
    expect(res.status).toBe(400);
  });

  it('returns the generated text + remaining count on success', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    generateMock.mockResolvedValueOnce({
      text: 'Thanks for the kind words! Wifi router was upgraded last week.',
      usage: { promptTokens: 120, completionTokens: 35 },
      model: 'claude-haiku-4-5',
    });
    const res = await request(makeApp()).post('/api/generate-review').send(goodBody);
    expect(res.status).toBe(200);
    expect(res.body.result).toMatch(/Wifi/);
    expect(res.body.tokensUsed).toBe(155);
    expect(generateMock).toHaveBeenCalledWith('review', expect.objectContaining({ starRating: 4 }));
  });
});
