#!/usr/bin/env node
/**
 * n8n-etsy-credential-setup.mjs — Register the Etsy OAuth2 credential in n8n.
 *
 * ⚠️  KNOWN LIMITATION (2026-05-12, n8n self-hosted at n8ncde.cdeprosperity.com):
 *     n8n's PUBLIC REST API uses a stricter `oAuth2Api` schema than its internal UI.
 *     POST /api/v1/credentials rejects this script's payload with:
 *       "is not allowed to have the additional property 'enablePKCE'"
 *       "requires property 'serverUrl'"
 *     Etsy mandates PKCE; without enablePKCE this credential won't work.
 *     RECOMMENDED PATH for now: create the Etsy OAuth2 credential through the
 *     n8n UI (Credentials → +Add → OAuth2 API). See docs/runbooks/etsy-n8n-credential.md
 *     or the project's etsy-manual-setup-guide.md for the field-by-field walkthrough.
 *
 * This script is kept for future use if/when n8n's public API accepts PKCE
 * credentials (n8n issue tracker: search "oAuth2Api enablePKCE public API").
 *
 * Two modes (when the API permits):
 *
 * 1. SKELETON (default — Etsy app not yet OAuth-bootstrapped):
 *    Creates credential with authUrl/accessTokenUrl/clientId/clientSecret/scope/PKCE
 *    populated. User clicks "Connect my account" in n8n UI to complete OAuth.
 *
 * 2. PRE-LOADED (ETSY_REFRESH_TOKEN present in env):
 *    Creates credential with oauthTokenData already populated — skips the
 *    "Connect my account" step entirely. Use this after running
 *    scripts/etsy-oauth-bootstrap.mjs.
 *
 * Idempotent: if a credential named "Etsy OAuth2 — STR Ledger" already exists,
 * the script updates it instead of creating a duplicate.
 *
 * Usage:
 *   node --env-file=".env" scripts/n8n-etsy-credential-setup.mjs
 *   node --env-file="C:\path\to\.env" scripts/n8n-etsy-credential-setup.mjs
 *
 * Env required:
 *   N8N_API_KEY        (JWT)
 *   N8N_BASE_URL       (e.g. https://n8ncde.cdeprosperity.com)
 *   ETSY_API_KEY       (keystring → clientId)
 *   ETSY_OAUTH_SECRET  (shared secret → clientSecret)
 *
 * Env optional (enables pre-loaded mode):
 *   ETSY_ACCESS_TOKEN
 *   ETSY_REFRESH_TOKEN
 *   ETSY_TOKEN_EXPIRES_AT  (unix ms)
 */

const CREDENTIAL_NAME = 'Etsy OAuth2 — STR Ledger';
const CREDENTIAL_TYPE = 'oAuth2Api';

// Etsy Personal Access — empirically minimum scope set (see
// scripts/etsy-oauth-bootstrap.mjs comment for rationale). Keep in sync.
const SCOPES = [
  'email_r',
  'listings_r', 'listings_w',
  'transactions_r',
].join(' ');

// ---------- pre-flight ----------

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = (process.env.N8N_BASE_URL || '').replace(/\/+$/, '');
const ETSY_API_KEY = process.env.ETSY_API_KEY;
const ETSY_OAUTH_SECRET = process.env.ETSY_OAUTH_SECRET;
const ETSY_REFRESH_TOKEN = process.env.ETSY_REFRESH_TOKEN;
const ETSY_ACCESS_TOKEN = process.env.ETSY_ACCESS_TOKEN;
const ETSY_TOKEN_EXPIRES_AT = process.env.ETSY_TOKEN_EXPIRES_AT;

for (const [name, val] of Object.entries({
  N8N_API_KEY, N8N_BASE_URL, ETSY_API_KEY, ETSY_OAUTH_SECRET,
})) {
  if (!val) {
    console.error(`FATAL: ${name} missing from env.`);
    process.exit(1);
  }
}

const PRELOADED = Boolean(ETSY_REFRESH_TOKEN);

// ---------- n8n API client ----------

async function n8nFetch(pathOnly, init = {}) {
  const url = `${N8N_BASE_URL}${pathOnly}`;
  const headers = {
    'X-N8N-API-KEY': N8N_API_KEY,
    'Accept': 'application/json',
    ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    ...(init.headers || {}),
  };
  const r = await fetch(url, { ...init, headers });
  const text = await r.text();
  if (!r.ok) {
    throw new Error(`n8n ${init.method || 'GET'} ${pathOnly} → ${r.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function findExistingCredential() {
  // n8n's public REST API uses /api/v1/credentials. Listing requires admin scope on the API key.
  // We GET all and filter client-side rather than relying on query support that may vary by version.
  try {
    const r = await n8nFetch('/api/v1/credentials?limit=250');
    const list = r?.data || r || [];
    return list.find?.((c) => c.name === CREDENTIAL_NAME) || null;
  } catch (e) {
    // Some n8n versions don't expose credential listing on the public API — that's OK,
    // we'll just create and ignore duplicate-name errors.
    console.warn(`(note: credential listing not available — ${e.message.slice(0, 120)})`);
    return null;
  }
}

// ---------- credential payload ----------

function buildCredentialData() {
  const data = {
    grantType: 'authorizationCode',
    authUrl: 'https://www.etsy.com/oauth/connect',
    accessTokenUrl: 'https://api.etsy.com/v3/public/oauth/token',
    clientId: ETSY_API_KEY,
    clientSecret: ETSY_OAUTH_SECRET,
    scope: SCOPES,
    authQueryParameters: '',
    authentication: 'header',
    // n8n PKCE flag (supported on oAuth2Api from n8n v1.x onward). Etsy requires PKCE.
    enablePKCE: true,
  };

  if (PRELOADED) {
    const oauthTokenData = {
      access_token: ETSY_ACCESS_TOKEN,
      refresh_token: ETSY_REFRESH_TOKEN,
      token_type: 'Bearer',
    };
    if (ETSY_TOKEN_EXPIRES_AT) {
      const expiresInSec = Math.max(60, Math.floor((Number(ETSY_TOKEN_EXPIRES_AT) - Date.now()) / 1000));
      oauthTokenData.expires_in = expiresInSec;
    }
    data.oauthTokenData = oauthTokenData;
  }

  return data;
}

// ---------- main ----------

(async () => {
  console.log('--- n8n Etsy credential setup ---');
  console.log(`Target n8n:    ${N8N_BASE_URL}`);
  console.log(`Credential:    ${CREDENTIAL_NAME}`);
  console.log(`Mode:          ${PRELOADED ? 'PRE-LOADED (refresh token from env)' : 'SKELETON (user finishes OAuth in n8n UI)'}`);
  console.log(`Scopes:        ${SCOPES}`);
  console.log('');

  const existing = await findExistingCredential();
  const payload = {
    name: CREDENTIAL_NAME,
    type: CREDENTIAL_TYPE,
    data: buildCredentialData(),
  };

  if (existing?.id) {
    console.log(`Found existing credential id=${existing.id} — updating...`);
    await n8nFetch(`/api/v1/credentials/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    console.log(`Updated credential id=${existing.id}`);
  } else {
    console.log('Creating new credential...');
    const created = await n8nFetch('/api/v1/credentials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log(`Created credential id=${created?.id || '<unknown>'}`);
  }

  console.log('');
  console.log('--- DONE ---');
  if (PRELOADED) {
    console.log('Credential is fully configured with refresh token. n8n can call Etsy API immediately.');
    console.log('Verify in n8n UI: Credentials → Etsy OAuth2 — STR Ledger → "Connection successful" badge.');
  } else {
    console.log('Skeleton created. To complete the OAuth dance:');
    console.log(`  1. Open ${N8N_BASE_URL}/home/credentials`);
    console.log(`  2. Click "${CREDENTIAL_NAME}"`);
    console.log('  3. Click "Connect my account" — browser opens to Etsy authorization');
    console.log('  4. Click Allow on Etsy');
    console.log('  5. n8n stores the refresh token automatically');
    console.log('');
    console.log('NOTE: Requires Etsy app to be approved out of "Pending Personal Approval".');
    console.log('Approval also unlocks the n8n callback URL (already registered in app config).');
  }
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
