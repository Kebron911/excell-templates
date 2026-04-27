# W13 — Review Request

**Priority:** P1

**Family:** D — Customer experience / social proof flywheel

**Summary:** Daily at 10:00 ET, finds Orders dated exactly 7 days ago that haven't yet had a review request sent, asks Claude to draft a tight per-customer email body using the buyer's first name + product name, sends from `hello@thestrledger.com`, then marks the Order `Review requested = true`. Routes to platform-specific review URL (Etsy / Gumroad / Trustpilot for own-site).

---

## Trigger

Schedule trigger, cron expression `0 10 * * *` in workflow timezone `America/New_York`. n8n's `scheduleTrigger` interprets the expression in the workflow's timezone, so this fires at 10:00 ET regardless of host clock.

## Node-by-node configuration

### Node 1 — Schedule Trigger

- **Type:** `n8n-nodes-base.scheduleTrigger` v1.2
- **Rule:** cron expression `0 10 * * *`
- **Workflow timezone:** `America/New_York` (set in `settings.timezone`)

### Node 2 — Function: Compute 7-Day Window

```js
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

const y = sevenDaysAgo.getUTCFullYear();
const m = String(sevenDaysAgo.getUTCMonth() + 1).padStart(2, '0');
const d = String(sevenDaysAgo.getUTCDate()).padStart(2, '0');
const date_str = `${y}-${m}-${d}`;

return [{ json: {
  target_date: date_str,
  window_start: `${date_str}T00:00:00.000Z`,
  window_end: `${date_str}T23:59:59.999Z`,
  run_at: now.toISOString()
}}];
```

### Node 3 — Airtable: List Eligible Orders

- Table `TABLE_ID_ORDERS`, operation **search**
- `filterByFormula`: `AND(IS_SAME({Timestamp}, '<target_date>', 'day'), NOT({Review requested}), {Refund status} = 'none')`
- Limit 200 (safety cap; daily volume should be << 200 in Phase 1)

### Node 4 — Split In Batches

- Batch size **1** so each order is processed individually
- Loops back to itself; the "done" output goes to the aggregator

### Node 5 — Function: Get Customer + Product

```js
const order = $input.first().json;
const f = order.fields || order;

const email = (f['Customer email'] || f['Email'] || '').toLowerCase().trim();
const first_name = f['First name'] || f['Customer first name'] || '';
const product_name = f['Product name'] || f['Product'] || 'STR Ledger workbook';
const product_sku = f['Product SKU'] || (Array.isArray(f['Product']) ? f['Product'][0] : '') || '';
const platform = (f['Platform'] || '').toLowerCase();
const order_id = f['Order ID'] || '';
const gumroad_product_permalink = f['Gumroad product permalink'] || '';
const etsy_listing_id = f['Etsy listing ID'] || '';

if (!email || !email.includes('@')) throw new Error(`Order ${order_id} has no usable customer email`);
if (!['etsy', 'gumroad', 'is'].includes(platform)) throw new Error(`Order ${order_id} unsupported platform: ${platform}`);

let review_url;
if (platform === 'etsy') {
  review_url = etsy_listing_id ? `https://www.etsy.com/your/purchases?ref=review&listing_id=${etsy_listing_id}` : 'https://www.etsy.com/your/purchases';
} else if (platform === 'gumroad') {
  review_url = gumroad_product_permalink ? `${gumroad_product_permalink}#ratings` : 'https://gumroad.com/library';
} else {
  review_url = 'https://www.trustpilot.com/evaluate/thestrledger.com';
}

return [{ json: { order_record_id: order.id, order_id, email, first_name: first_name || 'there', product_name, product_sku, platform, review_url } }];
```

### Node 6 — Switch: Route by Platform

Three branches: `etsy`, `gumroad`, `is`.

### Nodes 7 / 8 / 9 — HTTP: Claude Draft (one per platform)

- `POST https://api.anthropic.com/v1/messages`
- Header auth cred ID `7`, headers `anthropic-version: 2023-06-01`
- Model `claude-opus-4-7`, max_tokens 600
- System: writes short plain-text emails for The STR Ledger; outputs ONLY the email body
- User prompt: gives Claude the canonical 7-days-after template with `first_name`, `product_name`, `review_url` already injected, asks for the final body text only

**Canonical template (per spec):**

```
{{ first_name }},

You picked up the {{ product_name }} a week ago — hope it's been useful.

If it has, would you drop a quick review? Takes 30 seconds and makes a
huge difference for a small shop like ours:

[Leave a review on {{ platform }} →]

If something didn't work, hit reply. I'll fix it.

— The STR Ledger
```

- Etsy branch wraps `[Leave a review on Etsy →]` with the Etsy URL
- Gumroad branch wraps with Gumroad permalink + `#ratings`
- IS branch asks for either a 1–2 sentence reply OR a Trustpilot review

### Node 10 — Function: Parse Drafted Body

```js
const claude = $input.first().json;
const order = $node['Get Customer + Product'].json;
const body = (claude?.content?.[0]?.text || '').trim();
if (!body) throw new Error('Claude returned empty email body');
const subject = `Quick favor, ${order.first_name}?`;
return [{ json: { ...order, subject, email_body: body } }];
```

### Node 11 — Email Send: Send Review Email

- From `hello@thestrledger.com`, SMTP cred ID `8`
- To `={{ $json.email }}`
- Subject: `Quick favor, <first_name>?`
- Format: `text` (plain-text — looks more personal, lands in primary tab)
- Body: `={{ $json.email_body }}`

### Node 12 — Airtable: Mark Review Requested

- Table `TABLE_ID_ORDERS`, operation **update** by record ID
- Fields: `Review requested = true`, `Review requested at = now`, `Review platform = <platform>`
- Loops back to Split Per Order to consume next item

### Node 13 — Function: Aggregate Sent Count (runs after batch loop completes)

```js
const items = $input.all();
const by_platform = { etsy: 0, gumroad: 0, is: 0 };
let total = 0;
for (const it of items) {
  const p = (it.json.platform || '').toLowerCase();
  if (by_platform[p] !== undefined) by_platform[p]++;
  total++;
}
return [{ json: { total_sent: total, by_platform, target_date: $node['Compute 7-Day Window'].json.target_date, run_at: new Date().toISOString() } }];
```

### Node 14 — Slack Daily Summary

- Channel `#str-platform-support`
- Message: `✅ W13 Review Requests sent — N emails for orders dated YYYY-MM-DD\nEtsy: x | Gumroad: y | IS: z`

### Error branch (Build Error Envelope → Log Error to Airtable → Slack Error Alert)

Standard envelope. One bad order does not abort the run — the per-order error routes to the envelope while the loop continues.

## Inputs

- Daily cron tick at 10:00 ET
- Airtable Orders rows with `Timestamp`, `Customer email`, `First name`, `Product name`, `Platform`, `Review requested` boolean
- Credentials: 1 (Airtable), 3 (Slack), 7 (Claude), 8 (SMTP)

## Outputs

- N outbound emails (one per eligible order)
- N Airtable Orders updates (`Review requested = true`)
- 1 Slack summary message

## Dependencies

- `Review requested` (Checkbox), `Review requested at` (Date), `Review platform` (Single select) fields exist on Orders
- `Customer email`, `First name`, `Product name`, `Etsy listing ID`, `Gumroad product permalink` are populated by W01 / W02 / W03
- SMTP cred warmed (DKIM + SPF + DMARC aligned for `thestrledger.com`)
- Anthropic API key with sufficient quota
- Trustpilot business profile claimed at `trustpilot.com/review/thestrledger.com`

## Edge cases

| Case | Handling |
|---|---|
| No eligible orders for the day | Loop runs 0 times, Aggregate emits `total_sent: 0`, Slack summary still posts |
| Order missing email | Per-order Error envelope, loop continues, alert in `#str-platform-alerts` |
| Order with `Refund status` ≠ `none` | Filtered out in Airtable search |
| Order already had review requested | Filtered out — `NOT({Review requested})` |
| Customer unsubscribed from broadcasts | This is transactional follow-up, not broadcast; out of scope. If unsub list maintained, add filter in Node 3 |
| Same buyer, multiple orders 7 days ago | One review email per order — risk of looking spammy. Mitigation (Phase 2): dedupe by email per day at Node 3 |
| Claude returns empty body | Per-order error → human follow-up via Slack alert; order stays unmarked so next day is not a re-send |
| SMTP transient failure | `onError: continueErrorOutput` routes to error branch; order stays unmarked, retried next day |
| DST transition day | Cron in `America/New_York` timezone handles correctly |
| Bulk import day with 1000s of orders 7 days back | Limit 200 caps the run; remaining picked up next day. Increase batch / paginate if this becomes routine. |

## Test cases

1. **Single Etsy order, 7 days old** — expect 1 email with `etsy.com/your/purchases?...` link, Order updated, Slack `Etsy: 1`.
2. **Single Gumroad order** — expect Gumroad `#ratings` link.
3. **Single own-site order** — expect Trustpilot link + reply-with-testimonial ask.
4. **Mixed batch (3 etsy + 2 gumroad + 1 is)** — Slack reports `Etsy: 3 | Gumroad: 2 | IS: 1`.
5. **Order missing `Customer email`** — error envelope fires, other 5 orders still processed.
6. **Re-run same day** — second execution finds 0 orders (all marked `Review requested`).
7. **Refunded order in window** — excluded by filter.
8. **Order timestamp 6 or 8 days ago** — excluded; only exact 7-day-old orders included.
9. **Claude API 429 rate limit** — error envelope, order stays unmarked, retries next run.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Daily run completion | 1 / day | 0 in 24h = cron broken |
| Per-order success rate | > 98% | < 90% = investigate template / SMTP / Claude |
| Reviews collected per email sent (7-day attribution) | > 8% | < 3% = revise template/timing |
| SMTP bounce rate | < 2% | > 5% = sender reputation issue |
| Claude API cost / run | < $0.50 | > $2 = check Orders volume / max_tokens |

## Deployment

1. Add fields `Review requested` (Checkbox), `Review requested at` (Date), `Review platform` (Single select: etsy / gumroad / is) to Orders table.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_ORDERS`, `TABLE_ID_ERRORS` placeholders.
3. Import `W13-review-request.json` into n8n.
4. Verify SMTP cred sends a test email from `hello@thestrledger.com`.
5. Manually trigger workflow once during business hours; confirm Airtable update + Slack summary.
6. Activate the schedule trigger.
7. Spot-check daily Slack summaries for the first week; tune Claude prompt if reply rate is low.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented.
- (future entries as the workflow evolves in production)
