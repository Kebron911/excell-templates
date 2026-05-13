#!/usr/bin/env node
/**
 * etsy-token-refresh.mjs — Rotate Etsy access token using stored refresh token.
 *
 * Etsy access tokens have 1h TTL; refresh tokens have 90d inactivity TTL.
 * Refreshing rotates BOTH — Etsy issues a new refresh_token on every refresh call.
 * If you don't refresh within 90 days, the refresh token expires and you must
 * re-run the full OAuth dance (scripts/etsy-oauth-bootstrap.mjs).
 *
 * Usage (from worktree — main .env is at the parent repo root):
 *   node --env-file="C:\path\to\.env" scripts/etsy-token-refresh.mjs "C:\path\to\.env"
 *
 * Usage (from main repo):
 *   node --env-file=.env scripts/etsy-token-refresh.mjs
 *
 * Env required:
 *   ETSY_API_KEY        (24-char keystring — used as client_id)
 *   ETSY_REFRESH_TOKEN  (from prior bootstrap or refresh run)
 *
 * On success, updates in the .env file:
 *   ETSY_ACCESS_TOKEN      (new, 1h)
 *   ETSY_REFRESH_TOKEN     (new — Etsy rotates on every refresh)
 *   ETSY_TOKEN_EXPIRES_AT  (unix ms)
 *
 * Prints (truncated) the new access_token so you can update n8n credentials.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = process.argv[2] || path.join(REPO_ROOT, '.env');

const TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token';

const apiKey = process.env.ETSY_API_KEY;
const refreshToken = process.env.ETSY_REFRESH_TOKEN;

if (!apiKey || apiKey.length < 8) {
  console.error('FATAL: ETSY_API_KEY missing. Re-check .env or pass via --env-file=.');
  process.exit(1);
}
if (!refreshToken || refreshToken.length < 16) {
  console.error('FATAL: ETSY_REFRESH_TOKEN missing or too short. Re-run scripts/etsy-oauth-bootstrap.mjs.');
  process.exit(1);
}

function upsertEnvVar(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(content)) return content.replace(re, line);
  return content.endsWith('\n') ? content + line + '\n' : content + '\n' + line + '\n';
}

async function refresh() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: apiKey,
    refresh_token: refreshToken,
  });
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await r.text();
  if (!r.ok) {
    throw new Error(`Refresh failed: ${r.status} ${text}`);
  }
  return JSON.parse(text);
}

(async () => {
  console.log('--- Etsy token refresh ---');
  console.log(`Env file:       ${ENV_FILE}`);
  console.log(`Refresh token:  <set, length ${refreshToken.length}>`);
  console.log('');

  const tokens = await refresh();
  const expiresAt = Date.now() + (Number(tokens.expires_in) - 60) * 1000;

  let content = fs.readFileSync(ENV_FILE, 'utf8');
  content = upsertEnvVar(content, 'ETSY_ACCESS_TOKEN', tokens.access_token);
  content = upsertEnvVar(content, 'ETSY_REFRESH_TOKEN', tokens.refresh_token);
  content = upsertEnvVar(content, 'ETSY_TOKEN_EXPIRES_AT', String(expiresAt));
  fs.writeFileSync(ENV_FILE, content, 'utf8');

  console.log('--- SUCCESS ---');
  console.log(`New access token:    ${tokens.access_token.slice(0, 12)}…${tokens.access_token.slice(-8)} (length ${tokens.access_token.length})`);
  console.log(`New refresh token:   <set, length ${tokens.refresh_token.length}>`);
  console.log(`Expires at (local):  ${new Date(expiresAt).toLocaleString()}`);
  console.log('');
  console.log('Next: update the n8n Custom Auth credential `Etsy API — STR Ledger`');
  console.log('with the new Authorization header — copy the full access_token from .env line:');
  console.log(`  grep ETSY_ACCESS_TOKEN "${ENV_FILE}"`);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
