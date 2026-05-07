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

import { makeGenerateMessageRouter } from '../../../server/routes/generate-message';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(makeGenerateMessageRouter());
  return app;
}

describe('POST /api/generate-message', () => {
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

  it('rejects unknown messageType', async () => {
    const res = await request(makeApp())
      .post('/api/generate-message')
      .send({ messageType: 'unknown', propertyName: 'X', hostName: 'Y' });
    expect(res.status).toBe(400);
  });

  it('returns the generated message preserving Mustache placeholders', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    generateMock.mockResolvedValueOnce({
      text: 'Hi {{guestFirstName}} — your stay at {{propertyName}} is confirmed. — {{hostName}}',
      usage: { promptTokens: 80, completionTokens: 25 },
      model: 'claude-haiku-4-5',
    });
    const res = await request(makeApp())
      .post('/api/generate-message')
      .send({
        messageType: 'booking-confirmation',
        propertyName: 'Cozy Cabin',
        hostName: 'Daniel',
      });
    expect(res.status).toBe(200);
    expect(res.body.result).toMatch(/\{\{guestFirstName\}\}/);
    expect(res.body.result).toMatch(/\{\{propertyName\}\}/);
    expect(res.body.tokensUsed).toBe(105);
  });

  it('passes scenarioDetails through when provided', async () => {
    queryOneMock.mockResolvedValueOnce({ count: 0 });
    queryMock.mockResolvedValue([]);
    generateMock.mockResolvedValueOnce({
      text: 'ok',
      usage: { promptTokens: 1, completionTokens: 1 },
      model: 'claude-haiku-4-5',
    });
    await request(makeApp())
      .post('/api/generate-message')
      .send({
        messageType: 'noise-complaint',
        propertyName: 'X',
        hostName: 'Y',
        scenarioDetails: 'Neighbor complained about late-night music.',
      });
    expect(generateMock).toHaveBeenCalledWith(
      'message',
      expect.objectContaining({ scenarioDetails: 'Neighbor complained about late-night music.' }),
    );
  });
});
