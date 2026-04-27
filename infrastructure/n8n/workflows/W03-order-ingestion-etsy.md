# W03 — Order Ingestion (Etsy polling)

**Priority:** P1

**Family:** B — Customer data unification

**Summary:** Polls Etsy Open API every 15 minutes for new/updated paid receipts (Etsy provides no webhooks), normalizes them, upserts Customer + Order rows in Airtable, and routes refunds to W07. Maintains a `last_poll` cursor in the Airtable Config table.

---

## Trigger

Cron schedule trigger — every 15 minutes (`*/15 * * * *`).

Etsy Open API v3 has a 10,000-call/day quota. 96 polls/day per shop is well under that ceiling. The polling cursor is stored in the Airtable Config table under key `etsy_last_poll`.

## Node-by-node configuration

### Node 1 — Schedule Trigger (Every 15 Minutes)

- **Cron expression:** `*/15 * * * *`
- **Timezone:** America/New_York (inherited from workflow settings)

### Node 2 — Airtable: Get Last Poll Timestamp

- **Operation:** Search
- **Table:** Config
- **Filter formula:** `{Key} = 'etsy_last_poll'`
- **Fields returned:** `Key`, `Value`

### Node 3 — Function: Compute Poll Window

```js
const items = $input.all();
const now = new Date();
const fallbackWindowSec = 60 * 60; // 1 hour fallback

let lastPollSec;
let configRecordId = null;

if (items.length && items[0].json && items[0].json.fields) {
  const v = items[0].json.fields.Value;
  configRecordId = items[0].json.id;
  lastPollSec = v
    ? Math.floor(new Date(v).getTime() / 1000)
    : Math.floor(now.getTime() / 1000) - fallbackWindowSec;
} else {
  lastPollSec = Math.floor(now.getTime() / 1000) - fallbackWindowSec;
}

const maxWindowSec = 7 * 24 * 60 * 60;
const nowSec = Math.floor(now.getTime() / 1000);
if (nowSec - lastPollSec > maxWindowSec) {
  lastPollSec = nowSec - maxWindowSec;
}

return [{ json: {
  min_last_modified: lastPollSec,
  poll_started_at: now.toISOString(),
  config_record_id: configRecordId,
  shop_id: $env.ETSY_SHOP_ID || ''
}}];
```

### Node 4 — HTTP: Etsy GET Receipts

- **Method:** GET
- **URL:** `https://openapi.etsy.com/v3/application/shops/{{ $env.ETSY_SHOP_ID }}/receipts`
- **Authentication:** Predefined credential type → `etsyOAuth2Api` (credential ID `4`)
- **Query string:**
  - `was_paid=true`
  - `min_last_modified={{ $json.min_last_modified }}`
  - `limit=100`
  - `offset=0`
- **Headers:**
  - `x-api-key: {{ $env.ETSY_KEYSTRING }}` (Etsy requires both OAuth bearer + keystring)

### Node 5 — Function: Iterate Receipts

```js
const data = $input.first().json;
const pollMeta = $node['Compute Poll Window'].json;
const receipts = data.results || [];

if (!receipts.length) {
  return [{ json: { __empty: true, poll_started_at: pollMeta.poll_started_at, config_record_id: pollMeta.config_record_id, receipt_count: 0 }}];
}

const out = [];
for (const r of receipts) {
  const email = (r.buyer_email || '').toLowerCase();
  const firstName = (r.name || '').split(' ')[0] || '';
  const grossCents = (r.grandtotal && r.grandtotal.amount) || (r.total_price && r.total_price.amount) || 0;
  const divisor = (r.grandtotal && r.grandtotal.divisor) || 100;
  const grossAmount = grossCents / divisor;
  const platformFee = grossAmount * 0.065 + 0.20 + (grossAmount * 0.03 + 0.25);
  const transactions = r.transactions || [];
  const productSkus = transactions.map(t => t.sku || ('etsy-listing-' + t.listing_id)).filter(Boolean);
  const isRefund = !!r.is_refund || ((r.refunds || []).length > 0);

  out.push({ json: {
    receipt_id: String(r.receipt_id),
    order_id: 'etsy-' + r.receipt_id,
    timestamp: new Date((r.create_timestamp || Math.floor(Date.now()/1000)) * 1000).toISOString(),
    email,
    first_name: firstName,
    gross_amount: grossAmount,
    platform_fee: Math.round(platformFee * 100) / 100,
    currency: (r.grandtotal && r.grandtotal.currency_code) || 'USD',
    platform: 'etsy',
    products: productSkus,
    is_refund: isRefund,
    raw_payload: JSON.stringify(r).slice(0, 5000),
    poll_started_at: pollMeta.poll_started_at,
    config_record_id: pollMeta.config_record_id
  }});
}

return out;
```

### Node 6 — Switch: Has Receipts?

- Route 1 (`empty`): if `__empty === true` → No-Op Empty Window → Aggregate Run Summary
- Route 2 (`hasItems`): if `receipt_id` is non-empty → Upsert Customer

### Node 7 — Airtable: Upsert Customer

- **Operation:** Upsert
- **Table:** Customers
- **Match on:** `Email`
- **Fields:**
  - `Email`: `{{ $json.email || ('etsy-buyer-' + $json.receipt_id + '@unknown.local') }}` (Etsy obfuscates email until buyer opts in via Companion PDF; placeholder keeps the row keyed)
  - `First name`: `{{ $json.first_name }}`
  - `Acquisition source`: `etsy`
  - `First contact date` / `First purchase date` / `Last purchase date`: `{{ $json.timestamp }}`
  - `Etsy buyer?`: `true`

### Node 8 — Airtable: Upsert Order (idempotent dedupe)

- **Operation:** Upsert
- **Table:** Orders
- **Match on:** `Order ID` (deduplicates overlapping polls by `etsy-<receipt_id>`)
- **Fields:** `Order ID`, `Timestamp`, `Platform=etsy`, `Gross amount`, `Platform fee`, `Tax collected`, `Shipping`, `Discount amount`, `Currency`, `Refund status` (`refunded` or `none`), `Etsy receipt ID`, `Raw webhook payload`

### Node 9 — Switch: Refund?

- Route 1 (`refund`): `is_refund === true` → Trigger W07 Refund Handler
- Fallback (`extra`): → Aggregate Run Summary

### Node 10 — HTTP: Trigger W07 Refund Handler

- **Method:** POST
- **URL:** `{{ $env.N8N_BASE_URL }}/webhook/refund-handler`
- **Body:** `{ source: 'etsy', order_id, receipt_id, email, gross_amount, currency, raw }`

### Node 11 — Function: Aggregate Run Summary

```js
const items = $input.all();
let receiptCount = 0, refundCount = 0, grossTotal = 0;
let pollStartedAt = null, configRecordId = null;
for (const it of items) {
  const j = it.json || {};
  if (j.receipt_id) receiptCount++;
  if (j.is_refund) refundCount++;
  if (typeof j.gross_amount === 'number') grossTotal += j.gross_amount;
  pollStartedAt = pollStartedAt || j.poll_started_at;
  configRecordId = configRecordId || j.config_record_id;
}
return [{ json: {
  receipt_count: receiptCount,
  refund_count: refundCount,
  gross_total: Math.round(grossTotal * 100) / 100,
  poll_started_at: pollStartedAt || new Date().toISOString(),
  config_record_id: configRecordId,
  next_last_poll: new Date().toISOString()
}}];
```

### Node 12 — Airtable: Update Last Poll Timestamp

- **Operation:** Upsert
- **Table:** Config
- **Match on:** `Key` (= `etsy_last_poll`)
- **Fields:** `Key=etsy_last_poll`, `Value={{ $json.next_last_poll }}`, `Updated at={{ $json.next_last_poll }}`

### Node 13 — Slack: Poll Summary

- Channel: `#str-platform-wins`
- Message template:
  - With receipts: `Etsy poll: <N> receipt(s), $<gross> gross, <R> refund(s).`
  - Empty: `Etsy poll: no new receipts.`

### Error branch (wraps Nodes 2, 4, 7, 8, 10, 12)

1. Build Error Envelope (code) — captures workflow, node, error message, payload
2. Log Error to Airtable (Errors table, status `Open`)
3. Slack alert to `#str-platform-alerts`

## Inputs

- Etsy Open API v3 (`/shops/{shop_id}/receipts`)
- Airtable Config table (key `etsy_last_poll`)
- Environment: `ETSY_SHOP_ID`, `ETSY_KEYSTRING`, `N8N_BASE_URL`, plus n8n-managed Etsy OAuth2 refresh token (credential ID `4`)

## Outputs

- Airtable Customers row (upserted, `Acquisition source = etsy`)
- Airtable Orders row (upserted by `Order ID = etsy-<receipt_id>` for idempotency)
- W07 invocation when receipt is refunded
- Airtable Config row updated with new `etsy_last_poll`
- Slack summary in `#str-platform-wins`

## Dependencies

- W01-style Airtable schema (Customers, Orders, Errors tables) created
- Airtable Config table with at least `Key` (single line) and `Value` (single line) and `Updated at` (datetime); Key field must be primary or unique to support upsert match
- Etsy Open API v3 OAuth 2.0 app provisioned and authenticated (one-time manual flow); credential stored in n8n as `etsyOAuth2Api`
- Etsy keystring stored as `ETSY_KEYSTRING` env var (Etsy requires both bearer token AND keystring on every call)
- `ETSY_SHOP_ID` env var set to numeric shop ID from Etsy dashboard
- W07 Refund Handler webhook live at `/webhook/refund-handler`

## Edge cases

| Case | Handling |
|---|---|
| Overlapping polls (Etsy returns same receipt twice) | `Order ID` upsert dedupes by `etsy-<receipt_id>` |
| Buyer email obfuscated | Customer row created with placeholder `etsy-buyer-<id>@unknown.local`; W08 reconciles when buyer downloads Companion PDF |
| `last_poll` missing or stale (>7d) | Window capped to last 7 days to avoid pulling thousands of historical receipts |
| Etsy API rate-limit (429) | HTTP node retries via n8n's built-in policy; persistent failures route to error branch |
| OAuth token expired | n8n auto-refreshes via `etsyOAuth2Api` credential type; if refresh fails, error branch fires |
| Receipt with `is_refund=true` | Order row created with `Refund status=refunded`; W07 invoked separately for LTV recompute |
| Currency other than USD | Stored on Order row; downstream LTV/metrics handle conversion |
| Empty result set | No-Op branch still updates `etsy_last_poll` and posts a quiet Slack summary |
| Etsy returns >100 receipts in a window | Current page size = 100; if `count > 100`, surfaced via error envelope; pagination is a Phase 2 enhancement (rare given 15-min cadence) |

## Test cases

1. **Cold start (no `etsy_last_poll` row)** — fallback window of 1 hour applied; Config row created on first run.
2. **Single new paid receipt** — 1 Customer upserted, 1 Order created, Slack summary fires.
3. **Repeat poll, no new receipts** — empty branch, Slack summary `no new receipts`, `etsy_last_poll` advances.
4. **Receipt arriving twice across two polls** — second poll re-upserts but Order ID matches existing; no duplicate row.
5. **Receipt with `is_refund=true`** — W07 webhook fires with correct payload; Order row marked `refunded`.
6. **Etsy API 401 (token expired)** — credential refresh succeeds on retry; if not, error branch logs + alerts.
7. **Etsy API 429 (rate-limited)** — n8n retries; final failure escalates to error branch.
8. **Receipt with obfuscated email** — placeholder email used; row keyed by `receipt_id` so later W08 can merge.
9. **Stale cursor (last_poll > 7d ago)** — window capped to 7d; Slack summary still accurate for what was fetched.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Poll execution success rate | > 99% | < 95% over 24h = investigate |
| Receipts ingested per day | within 20% of Etsy seller dashboard count | > 20% delta = reconcile |
| Etsy API quota consumed | < 200 calls/day | > 1,000/day = investigate runaway pagination |
| Time from receipt creation to Airtable row | < 20 min p95 | > 60 min p95 = poll lag |
| Orphan Orders (Customer not linked) | 0 | > 0 = Node 7 issue |

## Deployment

1. Create the Airtable **Config** table if not present: fields `Key` (single line, primary), `Value` (single line), `Updated at` (datetime).
2. Register Etsy app at https://www.etsy.com/developers and complete OAuth 2.0 authorization for shop owner account; copy refresh token into n8n credentials manager as type `etsyOAuth2Api` (credential ID `4`).
3. Set environment variables in n8n container: `ETSY_SHOP_ID`, `ETSY_KEYSTRING`, `N8N_BASE_URL`.
4. Import `W03-order-ingestion-etsy.json` into n8n.
5. Replace placeholder credential IDs `1` (Airtable), `3` (Slack), `4` (Etsy OAuth2) with real IDs from your n8n credentials store.
6. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_CONFIG`, `TABLE_ID_CUSTOMERS`, `TABLE_ID_ORDERS`, `TABLE_ID_ERRORS` with the live Airtable IDs.
7. Run a manual execution with no `etsy_last_poll` row to validate cold-start path.
8. Activate the workflow.
9. Monitor first 4 polls (1 hour) in Slack `#str-platform-wins`.

## Iteration log

- `2026-04-27` — Initial spec. Implements 15-min polling, idempotent upserts, refund delegation to W07, and `etsy_last_poll` cursor in Config table. Pagination beyond 100 receipts/window deferred to Phase 2.
