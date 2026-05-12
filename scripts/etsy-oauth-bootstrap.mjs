#!/usr/bin/env node
/**
 * etsy-oauth-bootstrap.mjs — One-time OAuth2 dance for Etsy API v3.
 *
 * Captures: access_token (1h), refresh_token (90d), expires_at — appended to ./.env
 *
 * PREREQ: Add http://localhost:3456/callback to your Etsy app's Redirect URIs
 * at https://www.etsy.com/developers/your-apps  (alongside the n8n callback).
 *
 * Usage (from worktree — main .env is at the repo root, not the worktree root):
 *   node --env-file="C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\.env" scripts/etsy-oauth-bootstrap.mjs "C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\.env"
 *
 * Usage (from main repo):
 *   node --env-file=.env scripts/etsy-oauth-bootstrap.mjs
 *
 * The first CLI arg (optional) overrides where tokens are *written* back.
 * Default write location: ./.env relative to the script.
 *
 * Env required:
 *   ETSY_API_KEY        (24-char keystring)
 *   ETSY_OAUTH_SECRET   (shared secret)
 *
 * On success, appends to ./.env:
 *   ETSY_ACCESS_TOKEN
 *   ETSY_REFRESH_TOKEN
 *   ETSY_TOKEN_EXPIRES_AT  (unix ms; access tokens live 1h)
 *
 * Etsy refresh tokens expire after 90 days of inactivity.
 * To rotate before expiry, re-run this script.
 */

import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
// First CLI arg (optional) overrides write location.
// Useful when running from a git worktree where .env lives in the main repo.
const ENV_FILE = process.argv[2] || path.join(REPO_ROOT, '.env');

const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const SCOPES = [
  'email_r',
  'listings_r', 'listings_w', 'listings_d',
  'transactions_r', 'transactions_w',
  'address_r', 'address_w',
  'profile_r',
  'feedback_r',
  'shops_r', 'shops_w',
].join(' ');

const AUTH_URL = 'https://www.etsy.com/oauth/connect';
const TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token';

// ---------- pre-flight ----------

const apiKey = process.env.ETSY_API_KEY;
const oauthSecret = process.env.ETSY_OAUTH_SECRET;

if (!apiKey || apiKey.length < 8) {
  console.error('FATAL: ETSY_API_KEY missing or too short. Run with: node --env-file=.env scripts/etsy-oauth-bootstrap.mjs');
  process.exit(1);
}
if (!oauthSecret || oauthSecret.length < 4) {
  console.error('FATAL: ETSY_OAUTH_SECRET missing.');
  process.exit(1);
}

// ---------- PKCE ----------

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const codeVerifier = base64url(crypto.randomBytes(32));
const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());
const state = base64url(crypto.randomBytes(16));

const params = new URLSearchParams({
  response_type: 'code',
  client_id: apiKey,
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
  state,
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
});
const authorizeUrl = `${AUTH_URL}?${params.toString()}`;

// ---------- local callback server ----------

function awaitCallback() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      if (url.pathname !== '/callback') {
        res.writeHead(404).end('Not found');
        return;
      }
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Etsy returned error: ${error}</h1><p>${url.searchParams.get('error_description') || ''}</p>`);
        server.close();
        reject(new Error(`Etsy OAuth error: ${error}`));
        return;
      }
      if (returnedState !== state) {
        res.writeHead(400).end('state mismatch — possible CSRF');
        server.close();
        reject(new Error('state mismatch'));
        return;
      }
      if (!code) {
        res.writeHead(400).end('no code in callback');
        server.close();
        reject(new Error('no code'));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>Etsy OAuth complete</h1><p>You can close this tab. Return to the terminal.</p>`);
      server.close();
      resolve(code);
    });
    server.on('error', reject);
    server.listen(PORT, () => {
      console.log(`Local callback server listening on ${REDIRECT_URI}`);
    });
  });
}

// ---------- browser open ----------

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'win32' ? 'cmd' : platform === 'darwin' ? 'open' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}

// ---------- token exchange ----------

async function exchangeCodeForTokens(code) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: apiKey,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await r.text();
  if (!r.ok) {
    throw new Error(`Token exchange failed: ${r.status} ${text}`);
  }
  return JSON.parse(text);
}

// ---------- .env writer ----------

function upsertEnvVar(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(content)) return content.replace(re, line);
  return content.endsWith('\n') ? content + line + '\n' : content + '\n' + line + '\n';
}

function persistTokens({ access_token, refresh_token, expires_in }) {
  const expiresAt = Date.now() + (Number(expires_in) - 60) * 1000; // 60s safety margin
  let content = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8') : '';
  content = upsertEnvVar(content, 'ETSY_ACCESS_TOKEN', access_token);
  content = upsertEnvVar(content, 'ETSY_REFRESH_TOKEN', refresh_token);
  content = upsertEnvVar(content, 'ETSY_TOKEN_EXPIRES_AT', String(expiresAt));
  fs.writeFileSync(ENV_FILE, content, 'utf8');
  return expiresAt;
}

// ---------- main ----------

(async () => {
  console.log('--- Etsy OAuth bootstrap ---');
  console.log(`Redirect URI:  ${REDIRECT_URI}`);
  console.log(`Scopes:        ${SCOPES}`);
  console.log('');
  console.log('Opening browser. If it doesn\'t open, paste this into your browser:');
  console.log(authorizeUrl);
  console.log('');

  openBrowser(authorizeUrl);

  const code = await awaitCallback();
  console.log('Authorization code received. Exchanging for tokens...');

  const tokens = await exchangeCodeForTokens(code);
  const expiresAt = persistTokens(tokens);

  console.log('');
  console.log('--- SUCCESS ---');
  console.log(`Access token:   <set, length ${tokens.access_token.length}>`);
  console.log(`Refresh token:  <set, length ${tokens.refresh_token.length}>`);
  console.log(`Access expires: ${new Date(expiresAt).toISOString()} (refresh in ~1h)`);
  console.log(`Refresh expiry: 90 days from now (re-run this script to rotate)`);
  console.log('');
  console.log('Tokens written to ./.env. Next: wire n8n credentials.');
})().catch(err => {
  console.error('BOOTSTRAP FAILED:', err.message);
  process.exit(1);
});
