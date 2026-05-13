# Etsy API in n8n — The Working Pattern

> **TL;DR — n8n 1.122 self-hosted does NOT play nicely with Etsy's OAuth2.** Both the
> generic OAuth2 API credential (omits PKCE, which Etsy requires) and the Custom Auth
> credential (corrupts 100-char Bearer tokens during JSON parsing) failed in testing
> on 2026-05-13.
>
> **Working pattern: inline headers on the HTTP Request node**, sourced from a token
> store that's refreshed by a scheduled workflow. Documented below.

## What we tried and why it didn't work

| Attempt | Result | Root cause |
|---|---|---|
| OAuth2 API credential — "Connect my account" | Etsy `error.php` → `code_challenge is required` | n8n's generic OAuth2 omits PKCE; Etsy mandates it |
| Custom Auth credential — JSON with `headers.{Authorization, x-api-key}` | 403 `Invalid access token: not a Bearer token` | n8n appears to mangle 100-char string values during credential JSON parsing (verified by identical headers working from PowerShell and inline-on-node) |
| HTTP Request node — `Send Headers` ON, manual rows | **✅ 200 OK** | Headers passed verbatim without JSON intermediate |

## The working pattern

For now, every Etsy-touching HTTP Request node sets headers inline:

| Name | Value |
|---|---|
| `Authorization` | `Bearer <ETSY_ACCESS_TOKEN>` |
| `x-api-key` | `<keystring>:<shared_secret>` |

**Notes on the `x-api-key` format:** Etsy's official docs say the value is the keystring alone. The Personal Access app's API actually demands `keystring:shared_secret` (verified empirically). Use the colon-separated form. Single keystring returns 403.

The auth-related node fields:

- **Authentication:** `None`
- **Send Headers:** `ON`
- **Specify Headers:** `Using Fields Below`
- **Header Parameters:** the two rows above

## Token rotation

Etsy access tokens expire after **1 hour**. Refresh tokens rotate on every refresh call and have a **90-day inactivity TTL**.

### Manual refresh (current state — minimal automation)

When you hit a 403 on Etsy in n8n:

1. Re-run the token refresh script:
   ```powershell
   node --env-file="C:\...\.env" "C:\...\scripts\etsy-token-refresh.mjs" "C:\...\.env"
   ```
2. Read the new access token:
   ```powershell
   Select-String -Path "C:\...\.env" -Pattern "^ETSY_ACCESS_TOKEN="
   ```
3. Update the `Authorization` header value in every Etsy-using HTTP Request node.

> This is obviously bad. Step 3 doesn't scale past ~3 workflows.

### Planned automation (next iteration)

A scheduled `etsy-token-refresh` workflow in n8n:

1. Cron trigger: every 50 minutes
2. Reads current `refresh_token` from n8n workflow static data
3. POSTs to `https://api.etsy.com/v3/public/oauth/token` with `grant_type=refresh_token`
4. Writes new `access_token` + `refresh_token` to workflow static data
5. Downstream Etsy workflows read `$workflow.static.access_token` to build the `Authorization` header

Implementation note: n8n's `$getWorkflowStaticData()` is the persistence mechanism. Code node + `n8n.getWorkflowStaticData('global')` lets a workflow read/write tokens that survive restarts.

## Initial bootstrap (one-time)

1. Run `scripts/etsy-oauth-bootstrap.mjs` from the local machine (browser-based PKCE OAuth dance). Captures the first refresh token.
2. Copy the refresh token from `.env` into the n8n token-refresh workflow's static data initialiser.
3. From then on, the refresh workflow keeps tokens fresh; no further local intervention.

## Personal Access scope limits

The scope set must remain at the 4-scope minimum:

```
email_r listings_r listings_w transactions_r
```

Requesting any of `address_r/w`, `transactions_w`, `shops_r/w`, `listings_d`, `profile_r`, `feedback_r` triggers Etsy's `error.php` redirect during the OAuth dance. To unlock broader scopes, submit the app for **public app review** at https://www.etsy.com/developers/your-apps (1–2 week turnaround).

## Verified facts (2026-05-13)

Test call against `https://openapi.etsy.com/v3/application/shops/65957104/listings?state=draft` returned 200 + 1 draft listing (`STR Template — Coming Soon`, taxonomy_id `12487`, price `900` cents).

This confirms:

- The 4-scope OAuth grant works against listing-read endpoints
- Etsy taxonomy_id `12487` is the right category for digital templates on this shop
- `keystring:shared_secret` is the right `x-api-key` format for Personal Access apps
- Tokens issued by `scripts/etsy-oauth-bootstrap.mjs` are accepted by Etsy

Last verified: 2026-05-13
