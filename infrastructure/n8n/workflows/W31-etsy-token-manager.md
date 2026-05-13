# W31 — Etsy Token Manager

> **The frame.** Single source of truth for Etsy access tokens inside n8n.
> Every Etsy-touching workflow calls this one to get a fresh `Authorization` +
> `x-api-key` pair, refreshing the underlying refresh-token if necessary.

## Why this exists

- Etsy access tokens expire after **1 hour**.
- Etsy rotates the refresh token on **every** refresh call — old refresh tokens become invalid after ~5 minutes.
- n8n's OAuth2 API credential doesn't support PKCE (Etsy requires it).
- n8n's Custom Auth credential corrupts 100-char Bearer tokens during JSON parsing.
- → Manual token paste into nodes doesn't scale; needs centralized auto-refresh.

## Architecture

```
┌──────────────────────┐
│ Manual Trigger       │── init mode (one-time): paste refresh_token from .env
│ (init/test)          │── test mode (any-time): inspect current state
├──────────────────────┤
│ Cron Every 50 Min    │── proactive refresh
├──────────────────────┤
│ Execute Wf Trigger   │── on-demand by other workflows
└──────────────────────┘
            │
            ▼
   Read State + Check Expiry   ── reads $getWorkflowStaticData('global')
            │
            ▼
       Needs Refresh? ──── no ──→ Use Current Token ─┐
            │                                        │
           yes                                       │
            ▼                                        │
     Refresh Etsy Token  (POST oauth/token)          │
            │                                        │
            ▼                                        │
     Persist New Tokens  ── writes static data       │
            │                                        │
            └───────────────┬────────────────────────┘
                            ▼
                     Build Auth Headers   ── returns:
                                              Authorization: Bearer <token>
                                              x-api-key: <keystring>:<secret>
                                              access_token, expires_at, refreshed
```

State stored in workflow static data:

| Key | Type | Notes |
|---|---|---|
| `refresh_token` | string | Rotates on each refresh call |
| `access_token` | string | 100-char, 1h TTL |
| `expires_at` | number | unix ms; refreshed if `expires_at - now < 5 min` |
| `keystring` | string | 24-char Etsy app keystring |
| `shared_secret` | string | 10-char Etsy app shared secret |
| `last_refresh` | string | ISO timestamp for debugging |

## One-time bootstrap

1. Run the local refresh script to make sure `.env` has a fresh refresh token:
   ```powershell
   node --env-file=".env" scripts/etsy-token-refresh.mjs ".env"
   ```
2. Pull current values:
   ```powershell
   $env = Get-Content .env -Raw
   $rt = ([regex]::Match($env, '(?m)^ETSY_REFRESH_TOKEN=(.+)$')).Groups[1].Value.Trim()
   $ks = ([regex]::Match($env, '(?m)^ETSY_API_KEY=(.+)$')).Groups[1].Value.Trim()
   $ss = ([regex]::Match($env, '(?m)^ETSY_OAUTH_SECRET=(.+)$')).Groups[1].Value.Trim()
   "init_refresh_token = $rt"
   "init_keystring     = $ks"
   "init_shared_secret = $ss"
   ```
3. Import `W31-etsy-token-manager.json` into n8n.
4. Open the workflow → click **Manual Trigger (init/test)** → set the input data to:
   ```json
   {
     "init_refresh_token": "<paste rt>",
     "init_keystring":     "<paste ks>",
     "init_shared_secret": "<paste ss>"
   }
   ```
5. Execute Workflow. The `Read State + Check Expiry` Code node writes those values to static data; the `Refresh Etsy Token` HTTP node calls Etsy and gets the first fresh access token; `Persist New Tokens` stores it.
6. Confirm the final `Build Auth Headers` node returns a non-empty `Authorization` and `x-api-key`.
7. Activate the workflow (top-right toggle). The cron will keep tokens warm forever.

## Calling from other workflows

In any Etsy-touching workflow:

1. Add **Execute Workflow** node → workflow: `W31 — Etsy Token Manager` → wait for completion
2. The Execute Workflow output now carries `{ Authorization, "x-api-key", access_token, expires_at, refreshed }`
3. Use those values in your **HTTP Request** node's headers (Authentication: None; Send Headers ON; reference via `{{ $('Execute Workflow').item.json.Authorization }}` etc.)

## Recovery scenarios

| Symptom | Cause | Fix |
|---|---|---|
| 401 / `Invalid access token` on Etsy call | Static data lost or never initialized | Re-run bootstrap step 4 with current refresh token |
| `Refresh response missing tokens` thrown by Persist Tokens node | Refresh token expired (>90 days inactivity) | Re-run `scripts/etsy-oauth-bootstrap.mjs` locally, then re-init this workflow |
| Cron skipped overnight (n8n was down) | Refresh window exceeded | Same — re-init; refresh tokens have 90d slack, single-night outage is fine |

## Security notes

- Static data is stored in n8n's database (encrypted at rest in n8n 1.x).
- Anyone with edit access to this workflow in n8n can see the tokens via the Code node output. Treat n8n editor access as equivalent to Etsy API access.
- Tokens never leave the n8n instance via this workflow — no Slack/webhook/email pipes the refresh token outward.

Last updated: 2026-05-13
