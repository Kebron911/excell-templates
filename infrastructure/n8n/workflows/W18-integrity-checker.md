# W18 — Integrity Checker

**Priority:** P1

**Family:** Z — Operational hygiene / drift detection

**Summary:** Daily 03:00 ET cron sweeps Airtable (SSOT) against IS, Gumroad, and Stripe. Catches drift on product fields (name, description, price, file hash), customer tags, and prior-day order count. Auto-resyncs minor drift via W06 webhook; alerts humans on major drift.

---

## Trigger

Schedule trigger — cron `0 3 * * *` in `America/New_York` timezone. Runs once per day at 03:00 ET (well after midnight order tail and before any business hours activity).

## Node-by-node configuration

### Node 1 — Schedule Trigger (`scheduleTrigger` v1.2)

- **Cron expression:** `0 3 * * *`
- **Timezone:** workflow setting `America/New_York`

### Node 2 — Code: Init Run Context

```js
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
return [{ json: {
  run_id: `w18-${now.toISOString().slice(0,10)}`,
  run_started_at: now.toISOString(),
  prior_day_iso: yesterday.toISOString().slice(0, 10),
  prior_day_start_unix: Math.floor(startOfYesterday.getTime() / 1000),
  prior_day_end_unix: Math.floor(endOfYesterday.getTime() / 1000),
  mismatches_minor: 0,
  mismatches_major: 0,
  total_checks: 0
}}];
```

### Node 3 — Airtable: List IS-Live Products

- **Operation:** Search
- **Table:** Products
- **Filter formula:** `AND({Live on IS} = TRUE(), {IS product ID} != '')`

### Node 4 — SplitInBatches (size 1) — IS Products loop

### Node 5 — HTTP: IS API Get Product

- **Method:** GET
- **URL:** `{{ $env.IS_API_BASE_URL }}/api/products/{{ $json.fields['IS product ID'] }}`
- **Auth:** httpHeaderAuth (cred id `2` — IS API Key)

### Node 6 — Code: Compare IS Product

```js
const crypto = require('crypto');
const remote = $input.first().json;
const local = $node['Split IS Products'].json.fields;
const recordId = $node['Split IS Products'].json.id;

const mismatches = [];
let severity = 'none';

if ((remote.name || '').trim() !== (local['Name'] || '').trim()) {
  mismatches.push({ field: 'name', local: local['Name'], remote: remote.name });
  severity = 'major';
}
if ((remote.description || '').trim() !== (local['Description'] || '').trim()) {
  mismatches.push({ field: 'description', local: (local['Description'] || '').slice(0, 100), remote: (remote.description || '').slice(0, 100) });
  if (severity !== 'major') severity = 'minor';
}
const localPrice = parseFloat(local['Price (USD)'] || 0);
const remotePrice = parseFloat(remote.price || 0);
if (Math.abs(localPrice - remotePrice) > 0.01) {
  mismatches.push({ field: 'price', local: localPrice, remote: remotePrice });
  if (severity !== 'major') severity = 'minor';
}
const localHash = local['File hash'] || '';
const remoteHash = remote.file_hash || '';
if (localHash && remoteHash && localHash !== remoteHash) {
  mismatches.push({ field: 'file_hash', local: localHash, remote: remoteHash });
  severity = 'major';
}
return [{ json: { has_mismatch: mismatches.length > 0, severity, mismatches /* + identifiers */ } }];
```

### Node 7 — Switch: IF IS Mismatch

Two outputs: `minor` (price/description) and `major` (name/file_hash).

### Node 8 — Airtable Create row in Errors (drift log)

### Node 9 — HTTP: Trigger W06 Resync (minor only)

- **Method:** POST
- **URL:** `{{ $env.N8N_BASE_URL }}/webhook/product-resync`
- **Body:** `{ platform, product_record_id, reason, mismatches }`

### Node 10 — Slack `#str-platform-alerts` (major only)

### Node 11 — NoOp loop-back to Split IS Products

### Nodes 12–20 — Gumroad branch (mirror of nodes 3–11)

- Filter formula: `AND({Live on Gumroad} = TRUE(), {Gumroad product ID} != '')`
- HTTP GET `https://api.gumroad.com/v2/products/{id}` with cred id `5`
- Comparison normalizes Gumroad's HTML description and cents-priced amounts
- Same minor/major routing → resync or human alert

### Nodes 21–27 — IS Contact tag drift branch

- List Customers where `IS contact ID` is set
- For each: GET `{IS_API_BASE_URL}/api/contacts/{id}`
- Compare expected tags (built from `Purchased SKUs` + `LTV (USD)` persona inference) vs remote `tags[]`
- Log drift to Errors; do not auto-fix (tags often diverge legitimately via IS automations)

### Nodes 28–33 — Stripe reconciliation branch

- HTTP GET `https://api.stripe.com/v1/charges?created[gte]={prior_day_start_unix}&created[lte]={prior_day_end_unix}&limit=100` with cred id `6`
- Airtable Search Orders for `Platform = 'is'` AND `Timestamp` in prior day
- Code reconcile:

```js
const stripeData = $node['Stripe Charges Prior Day'].json;
const airtableItems = $node['List Airtable IS Orders Prior Day'].all();
const stripeCount = (stripeData.data || []).filter(c => c.status === 'succeeded' && !c.refunded).length;
const airtableCount = airtableItems.length;
const delta = stripeCount - airtableCount;
return [{ json: { stripe_count: stripeCount, airtable_count: airtableCount, delta, has_mismatch: Math.abs(delta) > 0 } }];
```

- If mismatch: Errors row + Slack alert (suggests W01 webhook delivery failure).

### Node 34 — Slack run summary (`#str-platform-alerts`)

Posts at end of stripe branch with run id + check overview.

### Error branch

Standard 3-node Build → Log → Slack pattern (cred ids `1`, `3`). Every HTTP and Airtable node has `onError: continueErrorOutput` routing to the error envelope builder.

## Inputs

- Airtable Products / Customers / Orders rows
- Live IS, Gumroad, Stripe APIs
- Env: `IS_API_BASE_URL`, `N8N_BASE_URL`

## Outputs

- Airtable Errors rows for every drift detected
- Slack alerts on major drift + Stripe reconciliation
- Inbound triggers to W06 (`/webhook/product-resync`) for self-healing minor drift

## Dependencies

- W01 must be live (so Airtable Orders is populated for Stripe reconciliation)
- W05/W06 must exist (resync target)
- Airtable Products must have `IS product ID`, `Gumroad product ID`, `File hash` columns populated by W05 on publish

## Edge cases

| Case | Handling |
|---|---|
| Product not yet published on a platform | Filter formula excludes (requires non-empty platform ID) |
| IS API timeout | onError → error envelope; loop continues with next product |
| Gumroad rate limit (429) | Single-batch loop keeps RPS low; failed product logged, loop continues |
| Stripe charge in pending state | Excluded from count (`status !== 'succeeded'`) to avoid false positives |
| Customer with stale `Purchased SKUs` cache | Tag drift logged but not auto-fixed; Daniel reviews |
| File hash blank on either side | Skipped (treated as not-yet-hashed, not drift) |
| Cron skipped (n8n down) | Next day's run will see 2-day delta; documented as known limitation |
| DST transition | Cron uses `America/New_York` zone, n8n handles shift |

## Test cases

1. **Clean run (no drift):** seed Airtable + IS with matching product → expect 0 Errors rows, summary Slack post only.
2. **Minor IS drift:** change description in IS dashboard → expect 1 Errors row (severity=minor) + W06 webhook called with `reason=w18-minor-drift`.
3. **Major IS drift:** change product name in IS → expect Errors row + Slack `#str-platform-alerts` major alert; no W06 call.
4. **Gumroad price mismatch:** change Gumroad price → expect minor drift, resync triggered.
5. **Contact tag drift:** manually remove `product:xxx` tag from IS contact → expect Errors row.
6. **Stripe/Airtable delta:** delete an Airtable Orders row from prior day → expect Stripe reconciliation alert with delta=1.
7. **API outage:** kill IS API mid-loop → error envelope catches, continues with Gumroad branch.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Daily runs | 1/day | 0 = cron failed |
| Errors rows created per run | < 5 | > 20 = systemic drift |
| Stripe reconciliation delta | 0 | abs > 1 = investigate W01 |
| Run duration | < 5 min | > 10 min = batch tuning needed |

## Deployment

1. Import `W18-integrity-checker.json` into n8n.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_PRODUCTS`, `TABLE_ID_CUSTOMERS`, `TABLE_ID_ORDERS`, `TABLE_ID_ERRORS` with real IDs.
3. Verify credentials `1` (Airtable), `2` (IS), `3` (Slack), `5` (Gumroad), `6` (Stripe) exist.
4. Set env vars: `IS_API_BASE_URL`, `N8N_BASE_URL`.
5. Activate.
6. Manual test run; confirm summary Slack message lands.
7. Monitor first 7 days for false positives — tune comparison normalization as needed.

## Iteration log

- `2026-04-27` — Initial spec + JSON. Unimplemented in production.
