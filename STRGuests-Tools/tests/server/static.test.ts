import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

/**
 * Verifies the Express server serves the Astro static build alongside /api/*.
 *
 * Sets STATIC_DIR to a fixture directory before importing server/index.ts,
 * then makes real HTTP requests to assert ordering: API routes win over
 * static, /api/* unknown returns JSON 404 (not index.html), static paths
 * resolve, and unmatched paths fall through to 404.html.
 */

const fixture = mkdtempSync(join(tmpdir(), 'strguests-static-'));
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  writeFileSync(join(fixture, 'index.html'), '<!doctype html><title>home</title>');
  writeFileSync(join(fixture, '404.html'), '<!doctype html><title>not found</title>');
  mkdirSync(join(fixture, 'about'));
  writeFileSync(join(fixture, 'about', 'index.html'), '<!doctype html><title>about</title>');

  process.env.STATIC_DIR = fixture;

  const { app } = await import('../../server/index');
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const port = (server.address() as AddressInfo).port;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  rmSync(fixture, { recursive: true, force: true });
});

describe('static + api server', () => {
  it('serves /api/health as JSON', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  it('returns JSON 404 for unknown /api/* (not index.html)', async () => {
    const res = await fetch(`${baseUrl}/api/does-not-exist`);
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(/application\/json/);
    const body = await res.json();
    expect(body.error).toBe('not_found');
  });

  it('serves index.html at /', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<title>home</title>');
  });

  it('serves nested page via /about', async () => {
    const res = await fetch(`${baseUrl}/about`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<title>about</title>');
  });

  it('falls back to 404.html for unmatched non-api paths', async () => {
    const res = await fetch(`${baseUrl}/no-such-page`);
    expect(res.status).toBe(404);
    expect(await res.text()).toContain('<title>not found</title>');
  });
});
