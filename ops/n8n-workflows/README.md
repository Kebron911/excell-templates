# n8n workflow definitions — STR Ledger / Excel-Templates project

> Source-of-truth workflow JSON for **this project's** n8n automations. Each `.json` file is a complete n8n workflow that can be uploaded via `deploy-workflow.mjs`. The repo holds the canonical definition; n8n is the runtime.

---

## Namespacing — this project vs others

The n8n instance at `n8ncde.cdeprosperity.com` is **shared across multiple projects**. To prevent cross-project collisions:

| Marker | Project | Tracked in |
|---|---|---|
| Name prefix `STR_*` **and** tag `str-ledger` | **STR Ledger / Excel-Templates** (this repo) | `ops/n8n-workflows/*.json` (this dir) |
| Names `SBS_*`, `SUBFLOW: *`, DB-admin/emoji workflows | Other project | [Kebron911/n8n-builder](https://github.com/Kebron911/n8n-builder) |

**Two-marker convention (prefix + tag) — why both:**
- `sync-from-n8n.mjs` filters by the `str-ledger` **tag** (survives renames).
- The `STR_` **prefix** is human-visible — when scrolling the n8n UI you can tell at a glance what belongs to which project.
- Belt + suspenders: if you rename and drop the prefix, the tag still pulls it. If you drop the tag, the prefix is your fallback.

**Creating a new workflow:**
1. In n8n UI: name it `STR_Something_Descriptive`, add the `str-ledger` tag.
2. Run `pwsh ops/n8n-workflows/sync-from-n8n.mjs` (or `node` if you're not on Windows) to pull it into git.
3. Commit the new `STR_*.json` file.

**Editing existing:** edit in n8n UI as usual, then re-run `sync-from-n8n.mjs` to update the JSON snapshot.

---

## Why JSON in the repo (not just in n8n)

n8n's UI is great for tinkering. Production workflows belong in version control because:

- **Recovery** — if the VPS dies or a workflow gets accidentally deleted in the UI, we can re-deploy from the JSON in 30 seconds.
- **Code review** — workflow changes go through PRs like everything else; reviewers see exactly which nodes are added/removed/edited.
- **Diffability** — diffing two workflow JSONs is straightforward; eyeballing two n8n UI screenshots is not.
- **Multi-environment** — staging vs prod can both pull from the same JSON, swapping env vars on the host.

The flow is **edit JSON in repo → deploy via script → tweak in n8n UI for one-off testing → re-export and commit if the tweak is keep-worthy**.

---

## Workflows in this directory

| File | Workflow name in n8n | Trigger | Status | What it does |
|---|---|---|---|---|
| [STR_Stripe_InfluencerSoft_Tagger.json](STR_Stripe_InfluencerSoft_Tagger.json) | `STR_Stripe_InfluencerSoft_Tagger` | Stripe webhook `checkout.session.completed` | uploaded, **inactive** (id: `i3vRINfSQIb2tkHk`) | Verifies Stripe signature → extracts buyer email + SKUs from session → upserts contact in InfluencerSoft with `customer:stripe` tag → loops SKUs and applies `purchased:<SKU>` tag per item. |
| [STR_Etsy_Token_Refresh.json](STR_Etsy_Token_Refresh.json) | `STR_Etsy_Token_Refresh` | Daily 3am + sub-workflow callable | **inactive** (Etsy shop pending) | Keeps Etsy OAuth refresh token alive (Etsy rotates refresh tokens on every use; without scheduled refresh, integration silently dies at day 90). Also called as sub-workflow by the Order Tagger to fetch the current access_token. Persists token state in workflow staticData. |
| [STR_Etsy_Order_InfluencerSoft_Tagger.json](STR_Etsy_Order_InfluencerSoft_Tagger.json) | `STR_Etsy_Order_InfluencerSoft_Tagger` | Schedule, every 15 min | **inactive** (Etsy shop pending) | Polls Etsy `/v3/application/shops/{shop_id}/receipts` for new paid orders → extracts buyer email + SKUs → upserts contact in InfluencerSoft with `customer:etsy` tag → loops SKUs and applies `purchased:<SKU>` tag per item. Mirrors the Stripe flow but pull-based instead of webhook-based. |

(More to come: `STR_Stripe_Sheets_Ledger`, `STR_Refund_Recovery`, `STR_Daily_Winback_Scan`, `STR_Etsy_Listing_Sync`.)

---

## Deploy a workflow

From the repo root:

```bash
# Dry-run first to see node summary + auth check
node ops/n8n-workflows/deploy-workflow.mjs ops/n8n-workflows/STR_Stripe_InfluencerSoft_Tagger.json --dry

# Upload (leaves workflow INACTIVE — webhook URL printed)
node ops/n8n-workflows/deploy-workflow.mjs ops/n8n-workflows/STR_Stripe_InfluencerSoft_Tagger.json

# Activate explicitly (flips the toggle that makes the production webhook live)
node ops/n8n-workflows/deploy-workflow.mjs ops/n8n-workflows/STR_Stripe_InfluencerSoft_Tagger.json --activate
```

The script:
- Reads `N8N_BASE_URL` + `N8N_API_KEY` from repo-root `.env`.
- POSTs to create, or PUT to update if a workflow with the same `name` already exists.
- Prints the test + production webhook URLs after a successful upload.

---

## Required environment variables on the n8n VPS

The workflow JSON references `$env.<NAME>` for secrets. n8n reads these from the **n8n process's own environment**, NOT from a `.env` file in the repo. You must set them on the VPS:

| Env var | Source | Used by |
|---|---|---|
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → endpoint signing secret | `STR_Stripe_InfluencerSoft_Tagger` (signature verification) |
| `INFLUENCERSOFT_API_KEY` | repo root `.env` | `STR_Stripe_InfluencerSoft_Tagger`, `STR_Etsy_Order_InfluencerSoft_Tagger` (IS API calls) |
| `ETSY_CLIENT_ID` | Etsy Developer dashboard → app → API key (keystring) | `STR_Etsy_Token_Refresh`, `STR_Etsy_Order_InfluencerSoft_Tagger` (OAuth + `x-api-key` header) |
| `ETSY_CLIENT_SECRET` | Etsy Developer dashboard → app → shared secret | `STR_Etsy_Token_Refresh` (refresh grant) |
| `ETSY_REFRESH_TOKEN` | OAuth consent flow (one-time, then auto-rotated by Token Refresh into staticData) | `STR_Etsy_Token_Refresh` (initial seed only — workflow persists rotated tokens to staticData after first run) |
| `ETSY_SHOP_ID` | Etsy Developer dashboard or `GET /users/__SELF__/shops` | `STR_Etsy_Order_InfluencerSoft_Tagger` (receipts endpoint URL) |

### Setting them (Docker example)

```bash
# Edit /etc/n8n/n8n.env or wherever your n8n unit's EnvironmentFile points
echo 'STRIPE_WEBHOOK_SECRET=whsec_...' >> /etc/n8n/n8n.env
echo 'INFLUENCERSOFT_API_KEY=...'       >> /etc/n8n/n8n.env
docker compose restart n8n
```

Or for a non-Docker n8n setup:

```bash
sudo systemctl edit n8n
# Add:
#   [Service]
#   Environment="STRIPE_WEBHOOK_SECRET=whsec_..."
#   Environment="INFLUENCERSOFT_API_KEY=..."
sudo systemctl restart n8n
```

After setting, validate from inside n8n's container/host:

```bash
docker exec n8n env | grep -E "STRIPE|INFLUENCERSOFT"
# should print both lines with values
```

If a Code node throws `STRIPE_WEBHOOK_SECRET env var not set on n8n host`, you missed this step.

---

## Etsy one-time OAuth bootstrap

Etsy uses OAuth 2.0 with PKCE; **n8n cannot complete the consent flow on its own** — you do it once manually to obtain the initial `refresh_token`. After that, the Token Refresh workflow rotates it automatically.

1. **Register an Etsy app** at https://www.etsy.com/developers/your-apps. Note `keystring` (= client_id) and `shared secret`.
2. **Get the shop_id** via:
   ```bash
   curl -H "x-api-key: $ETSY_CLIENT_ID" https://openapi.etsy.com/v3/application/users/__SELF__/shops
   ```
   (Requires an access token from step 3 — chicken-and-egg, so easier: just look up your shop URL in Etsy admin; shop_id appears in the URL or under Shop Manager.)
3. **Get the initial refresh_token** via OAuth consent. Several tools work — easiest is the official Etsy guide at https://developers.etsy.com/documentation/essentials/authentication or a script like:
   ```bash
   # Step A: open in browser, log in, click "Allow"
   #   https://www.etsy.com/oauth/connect?
   #     response_type=code
   #     &redirect_uri=http://localhost:3003/callback
   #     &scope=transactions_r%20listings_r%20shops_r%20shops_w
   #     &client_id=$ETSY_CLIENT_ID
   #     &state=anything
   #     &code_challenge=...  (PKCE — generate via openssl)
   #     &code_challenge_method=S256
   # Step B: catch the redirect, extract `code`
   # Step C: POST to exchange code for tokens:
   curl -X POST https://api.etsy.com/v3/public/oauth/token \
     -d "grant_type=authorization_code" \
     -d "client_id=$ETSY_CLIENT_ID" \
     -d "redirect_uri=http://localhost:3003/callback" \
     -d "code=<from step B>" \
     -d "code_verifier=<PKCE verifier>"
   # Response: { access_token, refresh_token, expires_in: 3600, ... }
   ```
4. **Set env vars on the n8n VPS** (one-time):
   ```bash
   # On the box, edit the n8n docker-compose.yml environment block (or env_file):
   ETSY_CLIENT_ID=...
   ETSY_CLIENT_SECRET=...
   ETSY_REFRESH_TOKEN=...   # from step 3
   ETSY_SHOP_ID=...
   ```
   Then `docker compose up -d n8n`.
5. **Activate** `STR_Etsy_Token_Refresh` first, then run it once manually to verify the refresh exchange works. Check the workflow's staticData (Execution → Inputs/Outputs) shows new `access_token` and `last_refresh_at`.
6. **Activate** `STR_Etsy_Order_InfluencerSoft_Tagger` second.

### Etsy-specific failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| `Token Refresh returned no access_token` in Order workflow | Refresh hasn't run yet OR Etsy returned an error | Run `STR_Etsy_Token_Refresh` manually; check its last execution log |
| `invalid_grant` from `/oauth/token` | Refresh token expired (>90 days unused) or was rotated by an out-of-band call | Re-do the OAuth bootstrap (step 3 above) to get a fresh refresh_token; update `ETSY_REFRESH_TOKEN` env var and clear staticData |
| `unauthorized_client` from Etsy receipts | `x-api-key` header missing or wrong | Confirm `ETSY_CLIENT_ID` env var is the **keystring** (not the OAuth client_id-like UUID); these are the same value but Etsy docs are ambiguous |
| Empty results despite known orders | `min_created` window covers wrong period OR `was_paid=true` filter excludes them | Lower `was_paid` requirement in workflow if you also want pending orders; verify `last_poll_sec` in staticData |
| Duplicate buyer tagging | Workflow re-ran on the same receipt (e.g., manual test runs) | Idempotent — IS `AddUpdateLead` upserts by email; tags are set-like so re-applying is a no-op |

## Stripe webhook setup

After uploading the workflow + setting the env vars + activating, configure Stripe to fire events at the n8n webhook URL:

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**.
2. Endpoint URL: `https://n8ncde.cdeprosperity.com/webhook/stripe-to-is`
3. Events to send: `checkout.session.completed` (and `charge.refunded` once the refund-recovery workflow lands).
4. After creation, copy the **Signing secret** (starts with `whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` on the n8n VPS (see above).
5. Click **Send test webhook** → choose `checkout.session.completed` → check n8n executions list. You should see the workflow run + a 200 OK response.

---

## Failure modes worth knowing

| Symptom | Likely cause | Fix |
|---|---|---|
| "Stripe signature mismatch" in execution log | wrong `STRIPE_WEBHOOK_SECRET` or n8n didn't reload after env var change | Verify the secret matches Stripe's endpoint signing secret; restart n8n |
| "Stripe timestamp outside 5-minute window" | clock skew between Stripe and the n8n VPS | `timedatectl set-ntp true` on the VPS |
| IS HTTP nodes return `error_code: 1, "Not transferred hash"` | API 1.0 hash signing required, not API 2.0 | Confirm endpoint URL uses PascalCase `/api/AddUpdateLead` (this workflow does); legacy 1.0 endpoints use lowercase |
| `For each SKU` loops forever | line_items not in the session payload | Stripe needs to be configured to send `checkout.session.completed` with line_items expanded — set "Include line_items" in the webhook config |
| 404 on the test webhook URL | workflow exists but is INACTIVE | re-run `deploy-workflow.mjs --activate` or flip the toggle in n8n UI |

---

## Re-export from n8n (preferred: `sync-from-n8n.mjs`)

```bash
# Pull every workflow tagged `str-ledger` and write JSON files here.
node ops/n8n-workflows/sync-from-n8n.mjs

# Dry-run first to see what would change
node ops/n8n-workflows/sync-from-n8n.mjs --dry
```

The script filters by tag, not name — so as long as a workflow has `str-ledger` applied, it gets included regardless of what it's called. **Don't forget to apply the tag when creating new STR_* workflows in the UI.**

### Manual fallback (UI download)

If you'd rather download by hand:

1. n8n UI → workflow → top-right menu → **Download** (saves `<workflow-name>.json`)
2. Replace `ops/n8n-workflows/<name>.json` with the downloaded content (or diff and merge selectively)
3. Commit + PR

The `id` field inside the JSON is fine to keep or strip — `deploy-workflow.mjs` matches by `name`, not `id`.
