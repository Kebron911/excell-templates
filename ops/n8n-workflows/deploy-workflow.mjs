#!/usr/bin/env node
/**
 * deploy-workflow.mjs — idempotent uploader for n8n workflow JSON files.
 *
 * Usage:
 *   node deploy-workflow.mjs <path-to-workflow.json>           # create or update by name (inactive)
 *   node deploy-workflow.mjs <path-to-workflow.json> --activate # also set active:true after upload
 *   node deploy-workflow.mjs <path-to-workflow.json> --dry      # don't call n8n, just print intent
 *
 * Reads N8N_BASE_URL + N8N_API_KEY from the repo-root `.env`.
 *
 * Behavior:
 *   - GETs /api/v1/workflows, finds any existing workflow with the same `name`.
 *   - If none → POST /api/v1/workflows to create.
 *   - If exact-name match → PATCH /api/v1/workflows/{id} to update fields.
 *   - Does NOT activate unless --activate is passed (production webhooks should be flipped on deliberately).
 *
 * Note on env vars for the workflow itself:
 *   The workflow references `$env.STRIPE_WEBHOOK_SECRET` and `$env.INFLUENCERSOFT_API_KEY`. n8n reads these
 *   from the n8n PROCESS environment, NOT from a .env file. You must set them on the n8n VPS:
 *     - Docker: pass via `-e STRIPE_WEBHOOK_SECRET=... -e INFLUENCERSOFT_API_KEY=...`
 *     - systemd: add `Environment=STRIPE_WEBHOOK_SECRET=...` to the unit file
 *     - Then `docker restart n8n` / `systemctl restart n8n` for the new vars to take effect.
 *   Until those are set on the host, the workflow's Code nodes will throw "STRIPE_WEBHOOK_SECRET env var not set".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ENV_PATH = path.join(REPO_ROOT, '.env');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ACTIVATE = args.includes('--activate');
const workflowPath = args.find((a) => a.endsWith('.json'));

if (!workflowPath) {
  console.error('usage: node deploy-workflow.mjs <path-to-workflow.json> [--activate] [--dry]');
  process.exit(1);
}

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const text = fs.readFileSync(ENV_PATH, 'utf8');
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2];
  }
  return out;
}

const env = { ...loadEnv(), ...process.env };
const base = (env.N8N_BASE_URL || '').replace(/\/$/, '');
const key = env.N8N_API_KEY;

if (!base || !key) {
  console.error('N8N_BASE_URL and N8N_API_KEY must be set in', ENV_PATH);
  process.exit(1);
}

const authHeaders = {
  'X-N8N-API-KEY': key,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

async function n8n(method, pathSegment, body) {
  const url = base + pathSegment;
  const opts = { method, headers: authHeaders };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const text = await r.text();
  let parsed;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  if (!r.ok) {
    throw new Error(`HTTP ${r.status} on ${method} ${pathSegment}: ${typeof parsed === 'string' ? parsed.slice(0, 300) : JSON.stringify(parsed).slice(0, 300)}`);
  }
  return parsed;
}

async function findWorkflowByName(name) {
  // n8n lists 100 at a time; paginate via cursor.
  let cursor = '';
  for (let i = 0; i < 10; i++) {
    const list = await n8n('GET', `/api/v1/workflows?limit=100${cursor ? `&cursor=${cursor}` : ''}`);
    const match = (list.data || []).find((w) => w.name === name);
    if (match) return match;
    if (!list.nextCursor) return null;
    cursor = list.nextCursor;
  }
  return null;
}

(async () => {
  const raw = fs.readFileSync(workflowPath, 'utf8');
  const workflow = JSON.parse(raw);

  if (!workflow.name) {
    console.error('workflow JSON must include a top-level `name`.');
    process.exit(1);
  }

  console.log(`Workflow: ${workflow.name}`);
  console.log(`Source:   ${path.relative(REPO_ROOT, workflowPath)}`);
  console.log(`Mode:     ${DRY ? 'DRY-RUN' : 'LIVE'}`);
  console.log(`Activate: ${ACTIVATE ? 'yes (will flip active=true after upload)' : 'no (leaves active=false)'}`);
  console.log('');

  if (DRY) {
    console.log('--- node summary ---');
    for (const n of workflow.nodes) {
      console.log(`  ${n.type.padEnd(40)}  ${n.name}`);
    }
    return;
  }

  // Find existing.
  const existing = await findWorkflowByName(workflow.name);

  let result;
  if (existing) {
    console.log(`Found existing workflow id=${existing.id} — patching.`);
    // n8n PATCH expects nodes, connections, settings, staticData. `active` is set via separate /activate endpoint.
    const patchBody = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings || {},
      staticData: workflow.staticData ?? null,
    };
    result = await n8n('PUT', `/api/v1/workflows/${existing.id}`, patchBody);
    console.log(`Updated id=${result.id}`);
  } else {
    console.log('No existing workflow with that name — creating.');
    const createBody = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings || {},
      staticData: workflow.staticData ?? null,
    };
    result = await n8n('POST', '/api/v1/workflows', createBody);
    console.log(`Created id=${result.id}`);
  }

  // Webhook URL for any webhook trigger nodes.
  const webhookNodes = workflow.nodes.filter((n) => n.type === 'n8n-nodes-base.webhook');
  for (const w of webhookNodes) {
    const wpath = w.parameters?.path || w.webhookId || '(unknown)';
    console.log(`Webhook URL — ${w.name}:`);
    console.log(`  TEST URL (active=false): ${base}/webhook-test/${wpath}`);
    console.log(`  PROD URL (active=true) : ${base}/webhook/${wpath}`);
  }

  if (ACTIVATE) {
    await n8n('POST', `/api/v1/workflows/${result.id}/activate`);
    console.log(`Activated id=${result.id}`);
  } else {
    console.log('');
    console.log('Workflow is INACTIVE. To activate later:');
    console.log(`  curl -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" "${base}/api/v1/workflows/${result.id}/activate"`);
    console.log('Or re-run with --activate.');
  }
})().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
