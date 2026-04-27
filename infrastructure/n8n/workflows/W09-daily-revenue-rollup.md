# W09 — Daily Revenue Rollup

**Priority:** P1

**Family:** D — Reporting & analytics

**Summary:** Aggregates the prior day's Orders into per-platform / per-product metrics, writes one row per metric to the Metrics table, reconciles totals against Stripe and Gumroad APIs (flags > 1% delta), then posts a Slack summary.

---

## Trigger

Cron schedule (n8n Schedule Trigger): `0 6 * * *` evaluated in `America/New_York`.

This fires every day at 06:00 ET, after all prior-day webhook traffic from W01/W02/W03 has settled.

## Node-by-node configuration

### Node 1 — Schedule Trigger (06:00 ET daily)

- **Type:** `scheduleTrigger` v1.2
- **Cron:** `0 6 * * *`
- **Timezone:** `America/New_York` (workflow setting)

### Node 2 — Function: Compute Yesterday Range

```js
const now = new Date();
const etOffsetMs = -5 * 60 * 60 * 1000; // EST baseline; n8n timezone setting handles DST display
const nowEt = new Date(now.getTime() + etOffsetMs);

const yesterdayEt = new Date(nowEt);
yesterdayEt.setUTCDate(nowEt.getUTCDate() - 1);
yesterdayEt.setUTCHours(0, 0, 0, 0);

const todayEt = new Date(yesterdayEt);
todayEt.setUTCDate(yesterdayEt.getUTCDate() + 1);

const startUtc = new Date(yesterdayEt.getTime() - etOffsetMs).toISOString();
const endUtc = new Date(todayEt.getTime() - etOffsetMs).toISOString();
const dateStr = yesterdayEt.toISOString().slice(0, 10);

const startUnix = Math.floor(new Date(startUtc).getTime() / 1000);
const endUnix = Math.floor(new Date(endUtc).getTime() / 1000);

const rollingStart = new Date(yesterdayEt);
rollingStart.setUTCDate(yesterdayEt.getUTCDate() - 29);
const rollingStartUtc = new Date(rollingStart.getTime() - etOffsetMs).toISOString();

return [{ json: {
  date: dateStr,
  start_utc: startUtc,
  end_utc: endUtc,
  start_unix: startUnix,
  end_unix: endUnix,
  rolling_start_utc: rollingStartUtc,
  generated_at: now.toISOString()
}}];
```

### Node 3 — Airtable: List Orders Yesterday

- **Operation:** Search
- **Table:** Orders (`TABLE_ID_ORDERS`)
- **Filter formula:** `AND(IS_AFTER({Timestamp}, '<start_utc>'), IS_BEFORE({Timestamp}, '<end_utc>'))`
- **Fields:** Order ID, Timestamp, Platform, Gross amount, Platform fee, OrderBump taken?, OTO taken?, Refund status, Refund amount, Product
- **onError:** `continueErrorOutput`

### Node 4 — Airtable: List Orders Last 30 Days (rolling refund window)

- **Operation:** Search
- **Filter formula:** `IS_AFTER({Timestamp}, '<rolling_start_utc>')`
- **Fields:** Order ID, Timestamp, Platform, Gross amount, Refund status, Refund amount

### Node 5 — Function: Aggregate Metrics

Computes the daily revenue object and emits one item per metric for downstream Airtable writes:

```js
const range = $node['Compute Yesterday Range'].json;
const yesterday = $node['List Orders Yesterday'].all().map(i => i.json.fields || i.json);
const rolling = $node['List Orders Last 30 Days'].all().map(i => i.json.fields || i.json);

const sum = (arr, fn) => arr.reduce((acc, r) => acc + (fn(r) || 0), 0);
const count = (arr, pred) => arr.filter(pred).length;
const byPlatform = (plat) => yesterday.filter(o => (o['Platform'] || '').toLowerCase() === plat);

const revenue_total = sum(yesterday, o => Number(o['Gross amount']));
const revenue_etsy = sum(byPlatform('etsy'), o => Number(o['Gross amount']));
const revenue_gumroad = sum(byPlatform('gumroad'), o => Number(o['Gross amount']));
const revenue_is = sum(byPlatform('is'), o => Number(o['Gross amount']));
const orders_total = yesterday.length;
const orderbumps = count(yesterday, o => o['OrderBump taken?'] === true);
const otos = count(yesterday, o => o['OTO taken?'] === true);
const orderbump_rate = orders_total ? orderbumps / orders_total : 0;
const oto_rate = orders_total ? otos / orders_total : 0;

const refunded30 = count(rolling, o => ['full', 'partial'].includes((o['Refund status'] || '').toLowerCase()));
const refund_rate_rolling_30 = rolling.length ? refunded30 / rolling.length : 0;

const productMap = {};
for (const o of yesterday) {
  const sku = Array.isArray(o['Product']) ? (o['Product'][0]?.name || o['Product'][0] || 'unknown') : (o['Product'] || 'unknown');
  const key = String(sku);
  if (!productMap[key]) productMap[key] = { sku: key, units: 0, revenue: 0 };
  productMap[key].units += 1;
  productMap[key].revenue += Number(o['Gross amount']) || 0;
}
const top_products = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
```

Output shape:

```
{
  date: '2026-04-26',
  revenue_total: 1847.00,
  revenue_etsy: 480.00,
  revenue_gumroad: 127.00,
  revenue_is: 1240.00,
  orders_total: 23,
  orderbump_rate: 0.34,
  oto_rate: 0.18,
  refund_rate_rolling_30: 0.04,
  top_products: [{ sku, units, revenue }, ...]
}
```

### Node 6 — Airtable: Write Metrics Rows

- **Operation:** Create
- **Table:** Metrics (`TABLE_ID_METRICS`)
- **Fields per row:** `Date`, `Metric name`, `Value`, `Notes`, `Source workflow = W09-daily-revenue-rollup`
- One row created per metric: `revenue_total`, `revenue_etsy`, `revenue_gumroad`, `revenue_is`, `orders_total`, `orderbump_rate`, `oto_rate`, `refund_rate_rolling_30`, `top_products` (JSON in Notes).

### Node 7 — HTTP Stripe: GET /v1/balance_transactions

- **URL:** `https://api.stripe.com/v1/balance_transactions`
- **Auth:** Stripe API credential id `6`
- **Query:** `created[gte]=<start_unix>`, `created[lt]=<end_unix>`, `type=charge`, `limit=100`

### Node 8 — HTTP Gumroad: GET /v2/sales

- **URL:** `https://api.gumroad.com/v2/sales`
- **Auth:** Header auth credential id `5` (Gumroad)
- **Query:** `after=<date>`, `before=<date+1>`

### Node 9 — Function: Reconcile Totals

Compares Airtable per-platform totals against API totals; flags any platform whose delta exceeds 1%.

```js
const summary = $node['Aggregate Metrics'].first().json.summary;
const stripeTxns = ($node['Stripe Balance Transactions'].first().json || {}).data || [];
const stripeTotal = stripeTxns.reduce((a, t) => a + ((t.amount || 0) / 100), 0);
const gumroadSales = ($node['Gumroad Sales Yesterday'].first().json || {}).sales || [];
const gumroadTotal = gumroadSales.reduce((a, s) => a + (parseFloat(s.price) || 0), 0);

const pctDelta = (a, b) => (a === 0 && b === 0) ? 0 : (a === 0 ? 1 : Math.abs((a - b) / a));
const discrepancies = [];
if (pctDelta(summary.revenue_is, stripeTotal) > 0.01) discrepancies.push({ platform: 'stripe', airtable: summary.revenue_is, api: stripeTotal });
if (pctDelta(summary.revenue_gumroad, gumroadTotal) > 0.01) discrepancies.push({ platform: 'gumroad', airtable: summary.revenue_gumroad, api: gumroadTotal });
```

### Node 10 — Switch: Has Discrepancy?

- Route 1 (`reconciled === false`): Log Reconciliation Error + Slack summary
- Default: Slack summary only

### Node 11 — Airtable: Log Reconciliation Error

Writes an Errors row with `Status = Open`, `Workflow = W09-daily-revenue-rollup`, `Node = Reconcile Totals` and a JSON dump of the per-platform discrepancies.

### Node 12 — Slack: Daily Summary

Channel: `#str-platform-wins`. Message includes per-platform revenue, order count, OrderBump/OTO/refund rates, top product, and a reconciliation status flag.

### Error branch

Standard pattern: Build Error Envelope → Log Error to Airtable (Errors table, status `Open`) → Slack alert to `#str-platform-alerts`.

## Inputs

- Airtable Orders rows (yesterday + last 30 days)
- Stripe API (balance transactions for prior day)
- Gumroad API (sales for prior day)

## Outputs

- 9 rows in Metrics table for the prior date
- (Conditional) 1 Errors row when reconciliation delta > 1%
- Slack summary in `#str-platform-wins`

## Dependencies

- W01 / W02 / W03 ingestion workflows have populated Orders for the prior day
- Airtable Metrics table exists with fields `Date`, `Metric name`, `Value`, `Notes`, `Source workflow`
- Stripe API credential id `6` configured
- Gumroad API credential id `5` configured (header auth)
- Slack credential id `3`

## Edge cases

| Case | Handling |
|---|---|
| Zero orders yesterday | All metrics emit value `0`; Slack summary still posts |
| Stripe API empty data array | `stripeTotal = 0`, treated as zero — delta vs Airtable surfaces real mismatches |
| Gumroad timezone differs from ET | Acceptable up to 1% delta; > 1% logs to Errors |
| Airtable rate limit on Metrics writes | `onError: continueErrorOutput` routes failures to error branch |
| DST transition day (March/November) | n8n schedule fires once at 06:00 local; range computed from local midnight |
| Manual backfill | Trigger workflow manually; `Compute Yesterday Range` always uses now-1 day |

## Test cases

1. **Normal day, all platforms reconcile**
   - Trigger: 10 Orders across 3 platforms, totals match API ± < 1%
   - Expected: 9 Metrics rows, no Errors row, Slack summary with `Reconciled: ✅`
2. **Stripe delta > 1%**
   - Trigger: Mock Stripe API returning a different total
   - Expected: Errors row created, Slack summary shows ⚠️ + JSON discrepancy block
3. **Zero-order day**
   - Expected: 9 Metrics rows with value 0; `top_products = []`; no errors
4. **Airtable rate-limited on rollup write**
   - Expected: Failure routed to Build Error Envelope, Errors row + Slack alert
5. **Manual re-run**
   - Trigger: Click Execute Workflow
   - Expected: Same prior-day calculation; if Metrics row already exists for the date, both rows persist (audit trail)

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Daily success rate | 100% | Any failure = Slack alert |
| Reconciliation delta (per platform) | < 1% | > 1% logs to Errors |
| End-to-end runtime | < 60s | > 180s = investigate Airtable list pagination |
| Missing Metrics row for yesterday | 0 | Auto-page if absent at 07:00 |

## Deployment

1. Import `W09-daily-revenue-rollup.json` into n8n
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_ORDERS`, `TABLE_ID_METRICS`, `TABLE_ID_ERRORS` with real Airtable IDs
3. Confirm Stripe credential `6` and Gumroad credential `5` are present
4. Activate workflow
5. Manually execute once to verify prior day's metrics land
6. Observe next 06:00 ET execution
7. Commit final JSON to `infrastructure/n8n/workflows/W09-daily-revenue-rollup.json`

## Iteration log

- `2026-04-27` — Initial spec + import-ready JSON. Unimplemented in production.
