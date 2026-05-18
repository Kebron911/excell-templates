import { loadCatalog } from '@str/catalog';
import { beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../src/server.js';

const API_KEY = 'test-key-must-be-at-least-32-characters-long';

let app: FastifyInstance;

beforeAll(async () => {
  const { catalog } = loadCatalog();
  app = await buildServer({
    env: {
      apiKey: API_KEY,
      port: 0,
      host: '127.0.0.1',
      corsOrigins: [],
      publicMin: true,
    },
    catalog,
  });
  await app.ready();
});

async function call(path: string, opts: { auth?: boolean } = {}): Promise<{ status: number; body: unknown }> {
  const headers: Record<string, string> = {};
  if (opts.auth) headers['x-api-key'] = API_KEY;
  const res = await app.inject({ method: 'GET', url: path, headers });
  return { status: res.statusCode, body: res.json() };
}

describe('catalog-api', () => {
  it('GET /healthz is public', async () => {
    const r = await call('/healthz');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ status: 'ok' });
  });

  it('GET /v1/catalog/min is public when publicMin=true', async () => {
    const r = await call('/v1/catalog/min');
    expect(r.status).toBe(200);
    const body = r.body as { sites: unknown[]; tools: unknown[] };
    expect(Array.isArray(body.sites)).toBe(true);
    expect(Array.isArray(body.tools)).toBe(true);
  });

  it('GET /v1/catalog requires auth', async () => {
    const r = await call('/v1/catalog');
    expect(r.status).toBe(401);
  });

  it('GET /v1/catalog returns full catalog with auth', async () => {
    const r = await call('/v1/catalog', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { sites: unknown[]; tools: unknown[]; schema: string };
    expect(body.schema).toBe('catalog.v1');
    expect(body.sites.length).toBe(8);
  });

  it('GET /v1/sites lists sites', async () => {
    const r = await call('/v1/sites', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { sites: { id: string }[] };
    expect(body.sites.length).toBe(8);
  });

  it('GET /v1/sites/:siteId returns one site', async () => {
    const r = await call('/v1/sites/guests', { auth: true });
    expect(r.status).toBe(200);
  });

  it('GET /v1/sites/:siteId 404s on unknown', async () => {
    const r = await call('/v1/sites/nope', { auth: true });
    expect(r.status).toBe(404);
  });

  it('GET /v1/sites/:siteId/tools filters by site', async () => {
    const r = await call('/v1/sites/guests/tools', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { tools: { site: string }[] };
    expect(body.tools.every((t) => t.site === 'guests')).toBe(true);
  });

  it('GET /v1/tools supports filters', async () => {
    const r = await call('/v1/tools?status=shipped&tier=free', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { tools: { status: string; paidTier: string }[]; count: number };
    expect(body.tools.every((t) => t.status === 'shipped' && t.paidTier === 'free')).toBe(true);
    expect(body.count).toBe(body.tools.length);
  });

  it('GET /v1/tools/:id returns one tool', async () => {
    const r = await call('/v1/tools/guests.house-rules-pdf', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { tool: { id: string } };
    expect(body.tool.id).toBe('guests.house-rules-pdf');
  });

  it('GET /v1/tools/:id 404s on unknown', async () => {
    const r = await call('/v1/tools/nope.nope', { auth: true });
    expect(r.status).toBe(404);
  });

  it('GET /v1/events returns the locked enum', async () => {
    const r = await call('/v1/events', { auth: true });
    expect(r.status).toBe(200);
    const body = r.body as { events: string[] };
    expect(body.events).toContain('pdf_download');
  });
});
