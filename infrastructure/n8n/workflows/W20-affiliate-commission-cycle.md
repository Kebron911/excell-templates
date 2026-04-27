# W20 — Affiliate Commission Cycle

**Priority:** P3 (Phase 2 — affiliate program launches Month 3)

**Family:** D — Partners & affiliate operations

**Summary:** Monthly cron computes prior-month affiliate commissions per tier (30/40/50%), queues PayoutQueue rows, emails Daniel for approval, and on approval (via webhook) issues transfers via Wise or Stripe Connect, logs Payouts rows, marks queue Paid, and pings Slack.

---

## Trigger

Two trigger nodes share this workflow:

1. **Schedule trigger** — cron `0 6 1 * *` (1st of each month at 06:00 ET).
2. **Webhook** — POST `https://n8n.thestrledger.com/webhook/payout-approved` body `{ "period": "YYYY-MM" }` invoked by Daniel from Airtable PayoutQueue Approve button (or Airtable automation that fires on `Status = Approved`).

## Node-by-node configuration

### Node 1 — Schedule Trigger (`scheduleTrigger` v1.2)

- Cron: `0 6 1 * *`
- Timezone: workflow setting `America/New_York`

### Node 2 — Code: Compute Prior Month Range

```js
const now = new Date();
const y = now.getUTCFullYear();
const m = now.getUTCMonth();
const startPrior = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
const endPrior = new Date(Date.UTC(y, m, 1, 0, 0, 0) - 1);
const periodLabel = `${startPrior.getUTCFullYear()}-${String(startPrior.getUTCMonth() + 1).padStart(2, '0')}`;
return [{ json: { period: periodLabel, period_start_iso: startPrior.toISOString(), period_end_iso: endPrior.toISOString(), period_start_date: startPrior.toISOString().slice(0, 10), period_end_date: endPrior.toISOString().slice(0, 10) } }];
```

### Node 3 — Airtable Search Orders

- **Filter formula:** `AND(LEFT({Source campaign}, 10) = 'affiliate:', IS_AFTER({Timestamp}, 'YYYY-MM-DD 00:00:00'), IS_BEFORE({Timestamp}, 'YYYY-MM-DD 23:59:59'), {Refund status} != 'full')`

### Node 4 — Airtable Search Partners

- Filter `{Status} = 'Active'`. Loaded once for tier override + payout method lookup.

### Node 5 — Code: Group + Compute Commissions

```js
const orderItems = $node['List Prior-Month Affiliate Orders'].all();
const partnerItems = $node['List Partners'].all();

const partners = {};
for (const p of partnerItems) {
  const f = p.json.fields;
  if (f['Affiliate ID']) partners[f['Affiliate ID']] = { record_id: p.json.id, name: f['Name'], email: f['Email'], payout_method: f['Payout method'] || 'wise', payout_destination: f['Payout destination'] || '', manual_tier_override: f['Manual tier override'] || null };
}

const grouped = {};
for (const o of orderItems) {
  const f = o.json.fields;
  const affId = (f['Source campaign'] || '').slice('affiliate:'.length).split(':')[0].trim();
  if (!affId) continue;
  if (!grouped[affId]) grouped[affId] = { affiliate_id: affId, orders: [], referral_count: 0, net_total: 0 };
  const net = parseFloat(f['Net amount'] || (f['Gross amount'] || 0) - (f['Platform fee'] || 0));
  grouped[affId].orders.push({ order_id: f['Order ID'], net_amount: net, timestamp: f['Timestamp'] });
  grouped[affId].referral_count += 1;
  grouped[affId].net_total += net;
}

function tierFor(refs, override) {
  if (override) return override;
  if (refs >= 10) return 'top';
  if (refs >= 3) return 'active';
  return 'standard';
}
const rates = { standard: 0.30, active: 0.40, top: 0.50 };
// emit one item per affiliate
```

**Tier table:**

| Referrals last month | Tier | Rate |
|---|---|---|
| 10+ | top | 50% |
| 3–9 | active | 40% |
| 1–2 | standard | 30% |

Partners can also have a `Manual tier override` (e.g. for legacy contracts).

### Node 6 — SplitInBatches (1) — Per-affiliate loop

### Node 7 — Airtable Create PayoutQueue Row

- Status: `Pending`
- Fields: Affiliate ID, Partner link, Period, Tier, Commission rate, Referral count, Net total (USD), Total commission (USD), Flag (`unknown_affiliate` if no Partner row), Orders payload (JSON dump for audit), Created at.

### Node 8 — Code: Aggregate Payouts (after loop)

Sums total + builds plain-text email body lines.

### Node 9 — Email Daniel — Approval Request (SMTP cred id `8`)

- To: `ltharrisond@hotmail.com`
- Subject: `[STR Ledger] Affiliate payouts ready: <period> ($X across N affiliates)`
- Body includes per-affiliate breakdown + Airtable approve URL + alternative `POST /webhook/payout-approved` instruction.

### Node 10 — Webhook trigger (POST `/webhook/payout-approved`)

Body: `{ "period": "YYYY-MM" }`.

### Node 11 — Airtable Search PayoutQueue

Filter formula: `AND({Period} = 'YYYY-MM', {Status} = 'Approved')` — Daniel sets each row's Status to `Approved` (or `Rejected`) in Airtable before firing the webhook.

### Node 12 — SplitInBatches (1) — Per-approved-payout loop

### Node 13 — Switch: Route by Payout Method

- Branch A: `Payout method = wise` → Wise transfer
- Branch B: `Payout method = stripe` → Stripe Connect

### Node 14 — HTTP: Wise Create Transfer (cred id `16`)

- POST `https://api.wise.com/v1/transfers`
- Body includes `targetAccount`, `customerTransactionId` (idempotency: `w20-{affiliate_id}-{period}`), `sourceAmount`, `details.reference`.

### Node 15 — HTTP: Stripe Connect Transfer (cred id `6`)

- POST `https://api.stripe.com/v1/transfers`
- form-urlencoded: `amount` (cents), `currency=usd`, `destination` (Stripe account id), `transfer_group=w20-{period}`, metadata.

### Node 16 — Code: Normalize Transfer Result

Extracts `transaction_id`, `status` from the API response.

### Node 17 — Airtable Create Payouts Row

- Status: `Sent`, Transaction ID, Sent at, Amount, Period, Affiliate ID, Partner link, raw response.

### Node 18 — Airtable Update PayoutQueue (Paid)

- Status → `Paid`, Transaction ID, Paid at.

### Node 19 — NoOp loop-back to Split Approved

### Node 20 — Slack `#str-platform-wins` confirmation per payout

### Error branch (3 nodes — Build → Log → Slack)

Standard envelope; cred `1`/`3`. Wise/Stripe failures stay in PayoutQueue with `Status = Approved`, allowing safe retry once root cause fixed.

## Inputs

- Airtable Orders rows tagged `Source campaign = affiliate:<slug>`
- Airtable Partners rows with `Affiliate ID`, `Status`, `Payout method`, `Payout destination`, optional `Manual tier override`
- Webhook approval payload from Daniel/Airtable

## Outputs

- Airtable PayoutQueue rows (Pending → Approved → Paid)
- Airtable Payouts rows (Sent)
- Wise / Stripe Connect transfers
- Email + Slack notifications

## Dependencies

- W01–W04 must populate `Source campaign` correctly on Orders
- Partners table seeded with active affiliates + payout destinations
- Wise + Stripe Connect accounts funded
- SMTP creds (id `8`) configured for Daniel's email

## Edge cases

| Case | Handling |
|---|---|
| No affiliate orders in prior month | Aggregate node returns empty; email still sent ("0 affiliates") |
| Affiliate ID with no Partner row | Flagged `unknown_affiliate`, total_commission=0, requires manual reconciliation before approval |
| Order refunded after commission queued | Filter excludes `Refund status = 'full'`; partials handled by re-running cycle next month with adjustment |
| Partial refund mid-month | Net amount field accounts; manual claw-back if needed |
| Wise API outage | onError → error envelope; PayoutQueue stays Approved for retry |
| Daniel forgets to approve | PayoutQueue rows stay Pending; rerun webhook anytime safely (idempotent via customerTransactionId) |
| Duplicate webhook fires | Idempotency: PayoutQueue row already Paid → fetch returns 0, no-op |
| Tier override conflicts | Manual override always wins |

## Test cases

1. **Happy path single affiliate:** seed 5 prior-month affiliate orders for `aff-jane`, run cron → 1 PayoutQueue row, tier=active, rate=0.40. Approve → Wise transfer issued, Payouts row, queue Paid, Slack post.
2. **Top tier:** seed 12 orders → tier=top, rate=0.50.
3. **Unknown affiliate:** order with `affiliate:ghost` and no Partner row → PayoutQueue row with `Flag=unknown_affiliate`, $0 commission, email summary calls it out.
4. **Stripe Connect path:** Partner with `Payout method=stripe` → Stripe transfer instead of Wise.
5. **Refunded order excluded:** order with `Refund status=full` → not counted.
6. **Re-approval idempotency:** fire approval webhook twice → second run finds 0 still-Approved (already Paid), no double payout.
7. **Wise 500:** mock failure → error envelope logs, queue stays Approved, no Payouts row, Slack alert.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Cycle runs | 1/month | 0 = cron failed |
| Approval lag (queued → approved) | < 5 days | > 14 days = Daniel reminder |
| Failed transfers | 0 | > 0 = manual intervention |
| Total commission paid | tracked in Metrics | n/a |

## Deployment

1. Import `W20-affiliate-commission-cycle.json` into n8n.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_ORDERS`, `TABLE_ID_PARTNERS`, `TABLE_ID_PAYOUT_QUEUE`, `TABLE_ID_PAYOUTS`, `TABLE_ID_ERRORS`.
3. Configure credentials `1` (Airtable), `3` (Slack), `6` (Stripe), `8` (SMTP), `16` (Wise).
4. Set env: `AIRTABLE_PAYOUT_QUEUE_VIEW_URL`, `N8N_BASE_URL`.
5. Build Airtable PayoutQueue automation: Approve button → set `Status=Approved` → call `https://n8n.thestrledger.com/webhook/payout-approved` with `{ period }`.
6. Activate workflow.
7. Dry run with $0.01 test payout to verify Wise + Stripe paths.

## Iteration log

- `2026-04-27` — Initial spec + JSON. Phase 2; unimplemented in production.
