# W42 — Citation / Profile Refresher

**Priority:** P2 (Phase 4 — Traffic Engines)

**Family:** I — Research / off-page

**Summary:** When Daniel updates his bio, headshot, or product list in Airtable `Identity`, W42 propagates that change across the 12–25 free profiles tracked in `ops/citations.yaml`. For platforms with APIs (LinkedIn Company Pages, Crunchbase, etc.), it pushes the update directly. For platforms without writable APIs, it queues a Slack-card refresh task with the diff so Daniel can update manually in 30 seconds. Also runs a weekly cron pass that flags any `live` citation with `last_refresh > 90 days ago` as `stale`.

---

## Triggers

Two trigger nodes:

1. **Webhook** — POST `/webhook/identity-changed`. Fired by an Airtable automation on `Identity` row change (any of: `bio_short`, `bio_long`, `headshot_url`, `tagline`, `product_count`).
2. **Cron** — weekly Sunday 23:00 ET. Stale-detection sweep.

## Node-by-node configuration

### Node 1a — Webhook `/webhook/identity-changed`
Body: `{ "identity_record_id": "rec...", "fields_changed": ["bio_short", "headshot_url"] }`.

### Node 1b — Cron Sunday 23:00 (`scheduleTrigger`)
Triggers Node 7 (stale sweep) directly, bypassing Nodes 2–6.

### Node 2 — Airtable Get Identity Row
- Base: `BASE_ID_PLACEHOLDER`
- Table: `Identity`
- Record ID: `={{ $json.identity_record_id }}`

### Node 3 — Local Filesystem: Read `ops/citations.yaml`
- Path: `/data/ops/citations.yaml`
- Operation: read

### Node 4 — Code: Parse Citations YAML + Filter to `live`
```js
const yaml = require('yaml');
const text = $input.first().json.data || $input.first().binary?.data?.toString('utf8');
const parsed = yaml.parse(text);
const live = (parsed?.citations || []).filter(c => c.state === 'live');
return live.map(c => ({ json: c }));
```

### Node 5 — SplitInBatches — One citation per iteration

### Node 6 — Switch on Platform
Routes by `platform` field to:
- **LinkedIn Company Page** → Node 6a (LinkedIn Pages API: PATCH organization)
- **Crunchbase** → Node 6b (Crunchbase Enterprise API — paid tier; for free tier, route to Manual Queue)
- **Substack publication** → Node 6c (Substack API: PATCH publication metadata)
- **Medium publication** → Node 6d (Medium API: PATCH publication settings)
- **YouTube channel about** → Node 6e (YouTube Data API: channels.update)
- **Pinterest profile** → Node 6f (Pinterest API: PATCH user)
- **(Default)** → Node 6z Manual Queue (everything else: G2, Capterra, Trustpilot, Product Hunt, About.me, Indie Hackers, AngelList, BetaList, niche directories — none have write APIs on free tier)

### Nodes 6a–6f — Per-platform API PATCH
Each: HTTP node with the platform's auth + body shaped from Identity row. On success → Node 8 update YAML. On failure → log warning, fall through to Manual Queue (6z) so the change isn't lost.

### Node 6z — Push to Slack Manual Queue `#str-platform-traffic`
Block kit:
- Title: "Refresh required: <platform>"
- Fields: profile URL, fields changed, new bio (preview), new headshot URL
- Button: `[Done]` → calls `/webhook/citation-refreshed` with `{ platform, identity_version }`

### Node 7 — Cron: Stale Sweep Branch
- Read `ops/citations.yaml`
- For each `live` citation: compute days since `last_refresh`
- If > 90: mark `state = stale` in YAML write-back
- Slack digest to `#str-platform-traffic`: "N citations stale: <list>. Refresh via /promote/citations."

### Node 8 — Local Filesystem: Write `ops/citations.yaml` (with `last_refresh` updated)
- Read current YAML
- For each successfully-refreshed platform: update `last_refresh = today`, `bio_version = identity.version`
- Atomic write: write to `.tmp`, rename to original

### Node 9 — Webhook `/webhook/citation-refreshed`
Body: `{ platform, identity_version }`. Fired by Slack `[Done]` button (Slack interactivity → n8n).

### Node 10 — Code: Update YAML for manual refresh
Same as Node 8 but for the single platform that came in via the webhook.

### Error branch — standard envelope per W21 pattern.

## Inputs

- Airtable `Identity` row (one row, `version` autoincrements on edit)
- `ops/citations.yaml` (read + write)
- Per-platform API credentials (only those that have write APIs)
- Slack bot for manual refresh queue

## Outputs

- API patches to platforms where supported
- Slack cards for the manual refresh queue
- Updated `ops/citations.yaml` with fresh `last_refresh` and `bio_version`
- Surfaces on `/promote/citations`

## Dependencies

- `ops/citations.yaml` mounted writable
- Airtable `Identity` table with `bio_short`, `bio_long`, `headshot_url`, `tagline`, `product_count`, `version` (autonumber)
- Airtable automation: on `Identity` row change → POST `/webhook/identity-changed`
- Slack interactivity URL: `https://n8n.thestrledger.com/webhook/citation-refreshed`

## Edge cases

| Case | Handling |
|---|---|
| Citation YAML malformed | Parse fails → error envelope; do not write |
| Platform API auth expired | Falls through to Manual Queue with platform-specific note |
| Daniel never clicks `[Done]` on a manual card | Stale sweep catches it after 90 days |
| Multiple Identity edits in <5 min | Each fires the webhook; YAML write-back is last-wins; OK because all rows reflect the same final state by the time the second run completes |
| Pinterest verified-domain cookie expired | Manual Queue card explicitly mentions "re-verify domain in Pinterest settings" |
| Citation has `state=pending` | Skipped by Node 4 filter (only `live` gets refreshed) |

## Test cases

1. **Bio update propagates:** edit Identity bio_short → webhook fires → all `live` citations queued for refresh → API platforms succeed → manual platforms slack-carded → YAML `last_refresh` updated for those that succeeded.
2. **Stale sweep:** mock 5 citations with `last_refresh = 100 days ago` → cron run → all marked `stale` → slack digest sent.
3. **API failure fallback:** mock LinkedIn 401 → workflow falls back to Manual Queue card → Daniel clicks Done → YAML updated.
4. **Empty Identity:** fire webhook with no changed fields → workflow exits cleanly (idempotent).

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Citations stale | < 3 | > 5 = build manual refresh into Daniel's weekly routine |
| Auto-refresh success rate | > 80% on API platforms | < 50% sustained = API auth issue |
| Time from Identity edit to all citations refreshed | < 24 hours | > 72 hours = manual queue not getting cleared |

## Deployment

1. Import `W42-citation-refresher.json`.
2. Configure credentials for the API platforms you have access to (likely just LinkedIn + YouTube + Pinterest at start).
3. Build Airtable automation: `Identity` row change → POST `/webhook/identity-changed`.
4. Wire Slack interactivity → `/webhook/citation-refreshed`.
5. Mount `ops/citations.yaml` writable in n8n container.
6. Activate. Test by editing Identity bio_short and confirming Slack cards arrive.

## Iteration log

- `2026-05-10` — Initial spec. P2 build for Phase 4 Traffic Engines (W42).
