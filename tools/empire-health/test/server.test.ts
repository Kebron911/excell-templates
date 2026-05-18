import { beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../src/server.js';
import { HealthStore } from '../src/store.js';

let app: FastifyInstance;
let store: HealthStore;

beforeAll(async () => {
  store = new HealthStore();
  store.setSite({ siteId: 'guests', displayName: 'Guests', domain: 'strguests.tools' });
  store.updateHttp('guests', { status: 'ok', httpStatus: 200, responseTimeMs: 73 });
  store.updateSsl('guests', { status: 'ok', daysUntilExpiry: 60, validTo: 'X', validFrom: 'Y' });

  app = buildServer({ store });
  await app.ready();
});

describe('empire-health server', () => {
  it('GET /healthz', async () => {
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });

  it('GET /v1/status returns snapshot JSON', async () => {
    const res = await app.inject({ method: 'GET', url: '/v1/status' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { overall: string; sites: Array<{ siteId: string }> };
    expect(body.overall).toBe('ok');
    expect(body.sites[0]!.siteId).toBe('guests');
  });

  it('GET / renders HTML status page', async () => {
    const res = await app.inject({ method: 'GET', url: '/' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.body).toContain('Empire Health');
    expect(res.body).toContain('strguests.tools');
  });
});
