# Etsy OAuth2 Credential — n8n Manual Setup

> Walkthrough for creating the **Etsy OAuth2 — STR Ledger** credential in n8n.
> Manual UI flow because n8n's public REST API rejects PKCE-enabled OAuth2 credentials
> (see comment header in `scripts/n8n-etsy-credential-setup.mjs`).
>
> Time: ~2 minutes after the Etsy app is approved + redirect URI registered.

## Pre-requisites (all should be ✅ by the time you do this)

- [x] Etsy app **STR Ledger Empire** registered, status **Personal Access** (approved)
- [x] Callback URLs on Etsy app include `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback`
- [x] `ETSY_API_KEY` (24 chars) + `ETSY_OAUTH_SECRET` (10 chars) in `./.env`
- [x] OAuth bootstrap already run (n8n will run its **own** OAuth dance — it stores a separate refresh token from the one in `.env`)

## Walkthrough

1. Open **https://n8ncde.cdeprosperity.com/credentials**
2. **+ Add credential** → search **OAuth2 API** (generic, not a service-specific one) → **Continue**
3. Fill the fields:

| Field | Value |
|---|---|
| Credential Name (top of dialog) | `Etsy OAuth2 — STR Ledger` |
| Grant Type | `Authorization Code` |
| Authorization URL | `https://www.etsy.com/oauth/connect` |
| Access Token URL | `https://api.etsy.com/v3/public/oauth/token` |
| Client ID | *(from `.env` → `ETSY_API_KEY`, 24-char keystring)* |
| Client Secret | *(from `.env` → `ETSY_OAUTH_SECRET`, 10-char shared secret)* |
| Scope | `email_r listings_r listings_w transactions_r` |
| Auth URI Query Parameters | *(leave blank)* |
| Authentication | `Header` |
| Enable PKCE | ✅ **ON** — Etsy requires this; without it the OAuth dance returns Etsy's generic `error.php` |

4. Click **Save**
5. Click **"Connect my account"** (button appears after first save)
6. Etsy's authorization page opens → click **Allow**
7. Browser redirects to `https://n8ncde.cdeprosperity.com/rest/oauth2-credential/callback` → n8n confirms success
8. Green **Connected** badge appears on the credential row

## Verification

- Credential should show **Connected** state in n8n's Credentials list
- Open any HTTP Request node → set Authentication to **Predefined Credential Type** → **OAuth2 API** → pick `Etsy OAuth2 — STR Ledger` from the dropdown
- Test with a GET to `https://openapi.etsy.com/v3/application/users/me` — should return your user object with `user_id` matching the shop owner

## Two refresh tokens, no conflict

- `.env` tokens (from `scripts/etsy-oauth-bootstrap.mjs`) → used by local scripts like `etsy-bulk-publish-listings.mjs --live`
- n8n credential's tokens (from this UI walkthrough) → used by n8n workflows like W03 order-ingestion
- Each refreshes on its own schedule. They share the same Etsy app but have independent grants.

## Scope limitations (Personal Access)

Etsy's Personal Access apps cannot request:

- `address_r`, `address_w`
- `transactions_w`
- `shops_r`, `shops_w`
- `listings_d`
- `profile_r`
- `feedback_r`

Verified empirically on 2026-05-12 — any of these in the requested scope set causes Etsy's auth flow to redirect to `error.php`.

If you ever need broader scopes (e.g., shipping address access for non-digital products), submit the app for **public app review** at https://www.etsy.com/developers/your-apps. Review takes ~1–2 weeks.

## Token rotation

- Etsy access tokens: 1-hour TTL — n8n auto-refreshes on every request
- Etsy refresh tokens: 90-day TTL (inactivity-based) — re-run the OAuth dance via "Disconnect" + "Connect my account" in the n8n UI before then

Last verified: 2026-05-12
