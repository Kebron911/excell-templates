import Fastify, { type FastifyInstance } from 'fastify';
import type { HealthStore } from './store.js';

export interface BuildServerInput {
  store: HealthStore;
}

function statusBadge(s: 'ok' | 'warn' | 'fail' | undefined): string {
  if (s === 'ok') return '<span style="color:#0a0">OK</span>';
  if (s === 'warn') return '<span style="color:#a60">WARN</span>';
  if (s === 'fail') return '<span style="color:#a00">FAIL</span>';
  return '<span style="color:#888">…</span>';
}

function renderHtml(store: HealthStore): string {
  const snap = store.snapshot();
  const rows = snap.sites
    .map((s) => {
      const httpCell = s.http
        ? `${statusBadge(s.http.status)} ${s.http.httpStatus ?? ''} (${s.http.responseTimeMs}ms)`
        : statusBadge(undefined);
      const sslCell = s.ssl
        ? `${statusBadge(s.ssl.status)} ${s.ssl.daysUntilExpiry !== undefined ? `${s.ssl.daysUntilExpiry}d left` : ''}`
        : statusBadge(undefined);
      return `<tr><td>${s.displayName}</td><td>${s.domain}</td><td>${httpCell}</td><td>${sslCell}</td></tr>`;
    })
    .join('\n');

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Empire Health</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;color:#222}
  h1{font-size:1.4rem}
  table{width:100%;border-collapse:collapse}
  th,td{text-align:left;padding:.5rem;border-bottom:1px solid #eee}
  .pill{display:inline-block;padding:.1rem .5rem;border-radius:99px;background:#eee;font-size:.85em}
</style></head><body>
<h1>Empire Health <span class="pill">${statusBadge(snap.overall)}</span></h1>
<p>Generated: ${snap.generatedAt}</p>
<table>
  <thead><tr><th>Site</th><th>Domain</th><th>HTTP</th><th>SSL</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`;
}

export function buildServer(input: BuildServerInput): FastifyInstance {
  const app = Fastify({ logger: true, trustProxy: false });

  app.get('/healthz', async () => ({ status: 'ok', version: '0.1.0' }));

  app.get('/v1/status', async () => input.store.snapshot());

  app.get('/', async (_req, reply) => {
    reply.header('Content-Type', 'text/html; charset=utf-8');
    return renderHtml(input.store);
  });

  return app;
}
