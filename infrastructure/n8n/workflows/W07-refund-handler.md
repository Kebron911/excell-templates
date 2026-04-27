# W07 — Refund Handler

**Priority:** P1

**Family:** B — Customer data unification

**Summary:** Centralized refund processor. Accepts refund events from Stripe (W01), Gumroad (W02), Etsy (W03), or any platform-direct refund webhook. Normalizes the payload, updates the matching Order in Airtable, recomputes the customer's net LTV, evaluates the rolling 30-day refund rate, emits a metric to W11 if the rate exceeds 8%, tags the IS contact with `refunded:<date>`, and posts a Slack notification.

---

## Trigger

Two entrypoints — both feed the same processing pipeline:

1. **Direct webhook:** `POST https://n8n.thestrledger.com/webhook/refund-handler` from Gumroad/Etsy refund webhooks or manual invocation.
2. **Delegated call:** W01 (Stripe), W02 (Gumroad), W03 (Etsy) call this same webhook URL from their refund-routing branches with a normalized seed payload (`{ source, order_id, email, gross_amount, currency, raw }`).

The first node (Detect Source) auto-detects the platform from `body.source` if provided, otherwise from payload shape.

## Node-by-node configuration

### Node 1 — Webhook (POST)

- **Path:** `/webhook/refund-handler`
- **Method:** POST
- **Response mode:** "Respond immediately" with 200.

### Node 2 — Function: Detect Source

```js
const input = $input.first().json;
const body = input.body || input;
const headers = input.headers || {};

let source = (body.source || '').toLowerCase();

if (!source) {
  if (body.type && String(body.type).startsWith('charge.')) source = 'stripe';
  else if (body.refund_id || body.refund_amount) source = 'gumroad';
  else if (body.receipt_id || body.is_refund !== undefined) source = 'etsy';
  else if (headers['stripe-signature']) source = 'stripe';
}

if (!['stripe','gumroad','etsy'].includes(source)) {
  throw new Error('Unable to determine refund source. Pass body.source = stripe|gumroad|etsy');
}

return [{ json: { source, body, headers, received_at: new Date().toISOString() } }];
```

### Node 3 — Switch: Source

Three outputs route to platform-specific normalizers:
- `stripe` → Normalize Stripe
- `gumroad` → Normalize Gumroad
- `etsy` → Normalize Etsy

### Node 4 — Function: Normalize Stripe

Handles `charge.refunded` events (or seed payloads from W01). Extracts the latest refund record from `obj.refunds.data`.

```js
const env = $input.first().json;
const body = env.body || {};
const obj = (body.data && body.data.object) || body;
const refunds = obj.refunds && obj.refunds.data ? obj.refunds.data : (obj.refunds || []);
const latestRefund = Array.isArray(refunds) && refunds.length ? refunds[refunds.length - 1] : null;

const chargeId = obj.id || obj.charge || (latestRefund && latestRefund.charge);
const paymentIntent = obj.payment_intent || (latestRefund && latestRefund.payment_intent);
const orderRef = paymentIntent ? ('stripe-' + paymentIntent) : (chargeId ? ('stripe-' + chargeId) : null);

const refundAmountCents = (latestRefund && latestRefund.amount) || obj.amount_refunded || 0;
const grossCents = obj.amount || obj.amount_captured || 0;

return [{ json: {
  source: 'stripe',
  order_id: orderRef,
  email: (obj.receipt_email || (obj.billing_details && obj.billing_details.email) || '').toLowerCase(),
  refund_amount: refundAmountCents / 100,
  gross_amount: grossCents / 100,
  currency: obj.currency || 'usd',
  refund_reason: (latestRefund && latestRefund.reason) || obj.failure_reason || 'unspecified',
  refund_id: (latestRefund && latestRefund.id) || obj.id,
  refunded_at: new Date(((latestRefund && latestRefund.created) || obj.created || Math.floor(Date.now()/1000)) * 1000).toISOString(),
  raw_payload: JSON.stringify(body).slice(0, 5000)
}}];
```

### Node 5 — Function: Normalize Gumroad

```js
const env = $input.first().json;
const body = env.body || {};
const saleId = body.sale_id || body.id;
const orderRef = saleId ? ('gumroad-' + saleId) : null;
const priceCents = parseInt(body.price || body.sale_price || 0);
const refundAmount = body.refund_amount ? parseFloat(body.refund_amount) : priceCents / 100;

return [{ json: {
  source: 'gumroad',
  order_id: orderRef,
  email: (body.email || '').toLowerCase(),
  refund_amount: refundAmount,
  gross_amount: priceCents / 100,
  currency: (body.currency || 'usd').toLowerCase(),
  refund_reason: body.refund_reason || body.cancellation_reason || 'unspecified',
  refund_id: body.refund_id || ('gumroad-refund-' + saleId),
  refunded_at: body.refunded_at || new Date().toISOString(),
  raw_payload: JSON.stringify(body).slice(0, 5000)
}}];
```

### Node 6 — Function: Normalize Etsy

```js
const env = $input.first().json;
const body = env.body || {};
const receiptId = body.receipt_id || (body.raw && JSON.parse(typeof body.raw === 'string' ? body.raw : JSON.stringify(body.raw)).receipt_id);
const orderRef = receiptId ? ('etsy-' + receiptId) : (body.order_id || null);
const grossAmount = parseFloat(body.gross_amount || 0);

return [{ json: {
  source: 'etsy',
  order_id: orderRef,
  email: (body.email || '').toLowerCase(),
  refund_amount: parseFloat(body.refund_amount != null ? body.refund_amount : grossAmount),
  gross_amount: grossAmount,
  currency: (body.currency || 'USD').toLowerCase(),
  refund_reason: body.refund_reason || 'etsy_buyer_request',
  refund_id: body.refund_id || ('etsy-refund-' + receiptId),
  refunded_at: body.refunded_at || new Date().toISOString(),
  raw_payload: typeof body.raw === 'string' ? body.raw.slice(0,5000) : JSON.stringify(body).slice(0, 5000)
}}];
```

### Node 7 — Airtable: Find Order

- **Operation:** Search
- **Table:** Orders
- **Filter formula:** `{Order ID} = '{{ $json.order_id }}'`
- **Fields returned:** `Order ID`, `Email`, `Gross amount`, `Customer`

### Node 8 — Switch: Order Found?

- Output 1 (`found`): record `id` non-empty → Update Order Refund
- Fallback: Order Not Found Logger → error branch (Slack alert; ops can backfill manually)

### Node 9 — Airtable: Update Order Refund

- **Operation:** Update
- **Record ID:** `{{ $json.id }}` (from Find Order)
- **Fields:** `Refund amount`, `Refund status=refunded`, `Refund reason`, `Refund ID`, `Refunded at` (each pulled from whichever Normalize* node ran)

### Node 10 — Function: Resolve Refund Context

Selects whichever upstream Normalize* node executed and merges Order/Customer record IDs.

```js
const nodes = ['Normalize Stripe', 'Normalize Gumroad', 'Normalize Etsy'];
let n = null;
for (const name of nodes) {
  try { const v = $node[name].json; if (v && v.order_id) { n = v; break; } } catch (e) {}
}
if (!n) throw new Error('No normalized refund payload found in upstream branches');

const orderRow = $node['Find Order'].json;
const orderRecordId = orderRow && orderRow.id;
const customerLinks = orderRow && orderRow.fields && orderRow.fields['Customer'];
const customerRecordId = Array.isArray(customerLinks) && customerLinks.length ? customerLinks[0] : null;
const email = (orderRow && orderRow.fields && orderRow.fields['Email']) || n.email;

return [{ json: { ...n, order_record_id: orderRecordId, customer_record_id: customerRecordId, email } }];
```

### Node 11 — Airtable: Get Customer Orders

- **Operation:** Search
- **Table:** Orders
- **Filter:** `{Email} = '{{ $json.email }}'`
- **Fields:** `Order ID`, `Email`, `Gross amount`, `Refund amount`, `Refund status`, `Timestamp`

### Node 12 — Function: Recompute Net LTV

```js
const items = $input.all();
const ctx = $node['Resolve Refund Context'].json;

let gross = 0, refunds = 0, orderCount = 0;
for (const it of items) {
  const f = (it.json && it.json.fields) || {};
  gross += parseFloat(f['Gross amount'] || 0);
  refunds += parseFloat(f['Refund amount'] || 0);
  orderCount++;
}
const netLTV = Math.round((gross - refunds) * 100) / 100;

return [{ json: {
  ...ctx,
  gross_total: Math.round(gross * 100) / 100,
  refund_total: Math.round(refunds * 100) / 100,
  net_ltv: netLTV,
  order_count: orderCount
}}];
```

### Node 13 — Airtable: Update Customer LTV

- **Operation:** Update
- **Record ID:** `{{ $json.customer_record_id }}`
- **Fields:** `Net LTV`, `Total refunds`, `Refund count`, `Last refund date`

### Node 14 — HTTP: Get 30-Day Orders

- **Method:** GET
- **URL:** `https://api.airtable.com/v0/{{ $env.AIRTABLE_BASE_ID }}/Orders`
- **Query:** `filterByFormula=IS_AFTER({Timestamp}, DATEADD(NOW(), -30, "days"))`, `pageSize=100`
- **Headers:** `Authorization: Bearer {{ $env.AIRTABLE_API_KEY }}`

### Node 15 — Function: Compute 30-Day Refund Rate

```js
const data = $input.first().json;
const records = (data && data.records) || [];
const ctx = $node['Recompute Net LTV'].json;

let totalGross = 0, totalRefunds = 0, refundedCount = 0;
for (const r of records) {
  const f = r.fields || {};
  totalGross += parseFloat(f['Gross amount'] || 0);
  const refundAmt = parseFloat(f['Refund amount'] || 0);
  totalRefunds += refundAmt;
  if (refundAmt > 0 || (f['Refund status'] && String(f['Refund status']).toLowerCase() === 'refunded')) refundedCount++;
}

const rateByDollar = totalGross > 0 ? totalRefunds / totalGross : 0;
const rateByCount = records.length > 0 ? refundedCount / records.length : 0;

return [{ json: {
  ...ctx,
  refund_rate_by_dollar: Math.round(rateByDollar * 10000) / 100,
  refund_rate_by_count: Math.round(rateByCount * 10000) / 100,
  total_orders_30d: records.length,
  refunded_orders_30d: refundedCount,
  threshold_breached: rateByDollar > 0.08
}}];
```

### Node 16 — Switch: Threshold

- Output 1 (`breached`): `threshold_breached === true` → Emit Threshold Metric
- Fallback: → IS Tag Refunded (skip metric emission)

### Node 17 — Airtable: Emit Threshold Metric

Writes to the Metrics table for W11 to consume on its next poll.

- **Operation:** Create
- **Table:** Metrics
- **Fields:**
  - `Date`: today's date
  - `Metric name`: `refund_rate_30d_breach`
  - `Value`: `{{ $json.refund_rate_by_dollar }}`
  - `Context`: JSON with order/refund counts and threshold
  - `Severity`: `high`
  - `Triggered workflow`: `W11`

### Node 18 — IS API: Tag Refunded

- **Method:** POST
- **URL:** `{{ $env.IS_API_BASE_URL }}/api/contacts/tags`
- **Body:** `{ email, tags: ['refunded:<YYYY-MM-DD>', 'refund_reason:<sanitized>', 'refund_source:<stripe|gumroad|etsy>'] }`

### Node 19 — Slack: Refund Notification

- Channel: `#str-platform-ops`
- Message: `Refund processed: <order_id> ($<amount> <CCY>) from <email> via <source>. Reason: <reason>. 30d refund rate: <pct>%[ THRESHOLD BREACHED — W11 metric emitted.]`

### Error branch (wraps Nodes 2, 7, 9, 11, 14, 17, 18)

1. Build Error Envelope (code) — preserves `node`, `error_message`, `payload`
2. Log Error to Airtable Errors table (status `Open`)
3. Slack alert to `#str-platform-alerts`

The `Order Not Found Logger` is a special path that builds an explicit error envelope (refund received but no Order matched) and feeds it to the same error logging chain.

## Inputs

- Refund webhook payload from Stripe / Gumroad / Etsy or seed payload from W01/W02/W03
- Airtable Orders + Customers tables
- Environment: `IS_API_BASE_URL`, `AIRTABLE_BASE_ID`, `AIRTABLE_API_KEY`

## Outputs

- Airtable Orders row updated: `Refund amount`, `Refund status`, `Refund reason`, `Refund ID`, `Refunded at`
- Airtable Customers row updated: `Net LTV`, `Total refunds`, `Refund count`, `Last refund date`
- (Conditional) Airtable Metrics row created when 30-day refund rate > 8%
- IS contact tagged with `refunded:<date>`, `refund_reason:<sanitized>`, `refund_source:<platform>`
- Slack message in `#str-platform-ops`

## Dependencies

- W01 (Stripe), W02 (Gumroad), W03 (Etsy) all call this webhook on refund detection
- Airtable Orders table fields: `Order ID`, `Email`, `Gross amount`, `Refund amount`, `Refund status`, `Refund reason`, `Refund ID`, `Refunded at`, `Customer` (link), `Timestamp`
- Airtable Customers table fields: `Email`, `Net LTV`, `Total refunds`, `Refund count`, `Last refund date`
- Airtable Metrics table fields: `Date`, `Metric name`, `Value`, `Context`, `Severity`, `Triggered workflow`
- IS API supports POST `/api/contacts/tags` with `{ email, tags[] }`
- W11 Threshold Alerts polls the Metrics table for `refund_rate_30d_breach` rows
- Credentials: Airtable (1), IS API (2), Slack (3), Gumroad (5 — for verifying inbound webhook signatures), Stripe (6 — for verifying inbound webhook signatures when called directly rather than delegated)

## Edge cases

| Case | Handling |
|---|---|
| Refund webhook received but Order not yet created (race with W01/W02/W03 ingestion) | `Find Order` returns empty → `Order Not Found Logger` writes error row; ops backfills manually after the order ingestion catches up |
| Partial refund (refund_amount < gross_amount) | Stored as-is; `Refund status=refunded`; downstream LTV math uses `gross - refund`, supporting partial values |
| Multiple refunds against same order (incremental partial → full) | Latest refund overwrites the Order's refund fields; LTV recomputes from sum across all customer orders so the math stays correct |
| Source not in payload AND not detectable | Detect Source throws → error branch fires; original payload is preserved for manual triage |
| Customer record ID not linked on Order | Update Customer LTV gets empty record ID → fails → error branch fires; root cause is W01/W02/W03 not setting Customer link |
| Refund reason absent | Defaults to `unspecified` (Stripe), `etsy_buyer_request` (Etsy), or `unspecified` (Gumroad) |
| Stripe webhook replay | If the same `refund_id` is processed twice, Order fields just get re-set to the same values; Slack double-notifies (acceptable; idempotent at data layer) |
| Currency mismatch | Stored verbatim; LTV math sums raw amounts (assumes single-currency until multi-currency math is needed) |
| 30-day window has 0 orders | Refund rate computed as 0; threshold not breached |
| Threshold breach but Metrics table write fails | Error branch logs; IS tagging still runs; Slack still notifies |
| IS API down | Error branch logs the tag failure; Slack notifies; refund data is already in Airtable so nothing is lost |

## Test cases

1. **Stripe charge.refunded full refund** — Order updated, Customer LTV decreases, IS tag added, Slack message posts.
2. **Gumroad refund webhook** — Same expected behavior, `Order ID` matched as `gumroad-<sale_id>`.
3. **Etsy delegated refund call from W03** — `body.source='etsy'` short-circuits Detect Source; Etsy normalizer runs.
4. **Partial Stripe refund** — `refund_amount < gross_amount`; Net LTV correctly reflects partial.
5. **Refund for nonexistent order** — Find Order empty; Order Not Found Logger fires; error row created with explanatory message.
6. **30-day refund rate exceeds 8%** — Threshold Switch routes to Metrics emit; Slack message includes breach flag.
7. **30-day refund rate at 7.99%** — No breach; metric NOT emitted; Slack message has period not breach flag.
8. **Detect Source unable to identify platform** — Throws; error branch logs; manual triage required.
9. **Customer with multiple orders, only one refunded** — Net LTV = gross_total - refund_total across all orders.
10. **Stripe webhook replay (duplicate refund event)** — Idempotent rewrite; no duplicate Customer record updates beyond same value writes.
11. **W01 delegated refund call** — Seed payload contains `source: 'stripe'` and `order_id`; pipeline runs end-to-end without re-fetching from Stripe.
12. **IS API failure during tag** — Error branch logs the failure; Slack confirms refund itself was processed; tag retry handled by ops.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Refund webhook → Airtable update latency | < 10s p95 | > 30s p95 = investigate |
| Order Not Found rate | < 2% | > 5% = ingestion lag or order_id format drift |
| 30-day refund rate (rolling) | < 5% healthy / < 8% acceptable | > 8% = W11 alert auto-fires (this workflow emits the metric) |
| IS tag failure rate | < 1% | > 5% = IS API or credential issue |
| Refund processing success rate | > 99% | < 95% = investigate |
| Slack notification gaps | 0 missed for non-error refunds | any miss = check Slack credential |

## Deployment

1. Add the required fields to the Airtable Orders, Customers, and Metrics tables (see Dependencies).
2. Import `W07-refund-handler.json` into n8n.
3. Replace credential placeholders `1` (Airtable), `2` (IS), `3` (Slack), `5` (Gumroad), `6` (Stripe) with real IDs.
4. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_ORDERS`, `TABLE_ID_CUSTOMERS`, `TABLE_ID_METRICS`, `TABLE_ID_ERRORS` with the live Airtable IDs.
5. Set environment variables in n8n: `IS_API_BASE_URL`, `AIRTABLE_BASE_ID`, `AIRTABLE_API_KEY`.
6. Activate the workflow.
7. Configure Gumroad → Settings → Advanced → Refund webhook URL = `/webhook/refund-handler` with `body.source='gumroad'` set in the request template.
8. Verify W01, W02, W03 are configured to call this webhook URL with `body.source` set.
9. Test by issuing a $1 refund in Stripe test mode and verifying Airtable + Slack updates.
10. Trigger a synthetic high-refund-rate scenario (manual Order rows with refund_amount=gross) to verify the 8% threshold path emits the W11 metric.

## Iteration log

- `2026-04-27` — Initial spec. Implements multi-source normalization (Stripe / Gumroad / Etsy), idempotent Order update, customer Net LTV recompute across all customer orders, rolling 30-day refund-rate computation, threshold breach metric emission for W11, IS tagging, and Slack notification. Order-not-found path captured as a logged error rather than a silent drop.
