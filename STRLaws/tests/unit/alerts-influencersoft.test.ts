import { describe, expect, it, vi } from 'vitest';
import { createInfluencersoftProvider, type HttpClient } from '../../server/lib/alerts/influencersoft-client';

function mockOk(body: unknown): ReturnType<HttpClient> {
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(''),
    json: () => Promise.resolve(body),
  });
}

function mockFail(status: number, text = 'error'): ReturnType<HttpClient> {
  return Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(text),
    json: () => Promise.resolve({}),
  });
}

const config = {
  apiKey: 'test_key',
  baseUrl: 'https://api.influencersoft.test',
  freeAlertsListId: 'list_123',
};

describe('createInfluencersoftProvider — send()', () => {
  it('returns sent + providerMessageId on 200', async () => {
    const http = vi.fn(() => mockOk({ id: 'msg_abc' })) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    const r = await provider.send({ to: 'x@y.com', subject: 's', text: 't', html: 'h' });
    expect(r.status).toBe('sent');
    expect(r.providerMessageId).toBe('msg_abc');
    expect(r.errorMessage).toBeNull();
  });

  it('returns failed + error message on non-2xx', async () => {
    const http = vi.fn(() => mockFail(429, 'rate limited')) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    const r = await provider.send({ to: 'x@y.com', subject: 's', text: 't', html: 'h' });
    expect(r.status).toBe('failed');
    expect(r.errorMessage).toContain('429');
    expect(r.errorMessage).toContain('rate limited');
  });

  it('returns failed when http throws', async () => {
    const http = vi.fn(() => Promise.reject(new Error('ECONNRESET'))) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    const r = await provider.send({ to: 'x@y.com', subject: 's', text: 't', html: 'h' });
    expect(r.status).toBe('failed');
    expect(r.errorMessage).toContain('ECONNRESET');
  });

  it('sends Authorization Bearer header', async () => {
    const http = vi.fn(() => mockOk({ id: 'm' })) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    await provider.send({ to: 'x@y.com', subject: 's', text: 't', html: 'h' });
    const call = (http as unknown as { mock: { calls: Array<[string, { headers: Record<string, string> }]> } }).mock.calls[0]!;
    expect(call[1].headers.Authorization).toBe('Bearer test_key');
  });

  it('channel is influencersoft', () => {
    const provider = createInfluencersoftProvider(config, (() => mockOk({})) as unknown as HttpClient);
    expect(provider.channel).toBe('influencersoft');
  });
});

describe('createInfluencersoftProvider — upsertContact()', () => {
  it('upserts to the configured free-alerts list', async () => {
    const http = vi.fn(() => mockOk({ id: 'contact_123' })) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    const r = await provider.upsertContact('x@y.com', ['utah', 'salt-lake-city']);
    expect(r.contactId).toBe('contact_123');
    expect(r.error).toBeNull();
    const call = (http as unknown as { mock: { calls: Array<[string, { body: string }]> } }).mock.calls[0]!;
    const body = JSON.parse(call[1].body);
    expect(body.email).toBe('x@y.com');
    expect(body.lists).toEqual(['list_123']);
    expect(body.tags).toEqual(['utah', 'salt-lake-city']);
  });

  it('returns error on non-2xx', async () => {
    const http = vi.fn(() => mockFail(500)) as unknown as HttpClient;
    const provider = createInfluencersoftProvider(config, http);
    const r = await provider.upsertContact('x@y.com');
    expect(r.contactId).toBeNull();
    expect(r.error).toContain('500');
  });
});
