#!/usr/bin/env node
/**
 * sync-from-n8n.mjs — pull workflows tagged `str-ledger` from n8n and write JSON to this dir.
 *
 * Usage:
 *   node sync-from-n8n.mjs           # writes/overwrites JSON files for every str-ledger-tagged workflow
 *   node sync-from-n8n.mjs --dry     # list what would be written, don't touch files
 *
 * Companion to deploy-workflow.mjs:
 *   - deploy-workflow.mjs:   repo JSON  ->  n8n  (push)
 *   - sync-from-n8n.mjs:     n8n        ->  repo JSON  (pull, this script)
 *
 * Filtering: only workflows with the `str-ledger` tag are pulled. Other-project workflows
 * (SBS_*, DB-admin emoji ones from Kebron911/n8n-builder) are ignored.
 *
 * Filename: `<sanitized-workflow-name>.json` (matches what deploy-workflow.mjs treats as canonical).
 * If you renamed a workflow in n8n, the next sync may produce a NEW filename; delete the
 * stale one manually after verifying.
 *
 * Credentials: workflow JSON contains credential REFS (ids) only, not secret values. Safe to commit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ENV_PATH = path.join(REPO_ROOT, '.env');
const OUT_DIR = __dirname;

const DRY = process.argv.includes('--dry');
const PROJECT_TAG = 'str-ledger';

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
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

const headers = { 'X-N8N-API-KEY': key, 'Accept': 'application/json' };

async function n8n(method, p) {
  const r = await fetch(base + p, { method, headers });
  const text = await r.text();
  let body; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!r.ok) throw new Error(`HTTP ${r.status} ${method} ${p}: ${typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300)}`);
  return body;
}

function slug(name) {
  return name.replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '');
}

(async () => {
  const all = (await n8n('GET', '/api/v1/workflows?limit=250')).data || [];
  const tagged = all.filter((w) => (w.tags || []).some((t) => t.name === PROJECT_TAG));

  console.log(`Found ${tagged.length} workflow(s) tagged "${PROJECT_TAG}" out of ${all.length} total.`);
  console.log(`Output dir: ${path.relative(REPO_ROOT, OUT_DIR)}`);
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'WRITE'}`);
  console.log('');

  for (const w of tagged) {
    const full = await n8n('GET', `/api/v1/workflows/${w.id}`);
    const filename = `${slug(full.name)}.json`;
    const outPath = path.join(OUT_DIR, filename);

    // Strip runtime-only fields so the JSON matches deploy-workflow.mjs's accepted shape.
    const exportable = {
      name: full.name,
      nodes: full.nodes,
      connections: full.connections,
      settings: full.settings ?? {},
      staticData: full.staticData ?? null,
    };
    const json = JSON.stringify(exportable, null, 2);

    if (DRY) {
      console.log(`  [dry] would write: ${filename}  (${(json.length / 1024).toFixed(1)} kB)`);
    } else {
      fs.writeFileSync(outPath, json, 'utf8');
      console.log(`  wrote: ${filename}  (${(json.length / 1024).toFixed(1)} kB)`);
    }
  }

  if (tagged.length === 0) {
    console.log('Nothing to pull. Tag a workflow in n8n with `str-ledger` to include it here.');
  }
})().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
