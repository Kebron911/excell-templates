# W01 — Order Ingestion (Stripe + IS)

**Priority:** P0

**Family:** B — Customer data unification

**Summary:** Receives every own-site purchase via Stripe webhook, normalizes, writes to Airtable Customers + Orders, tags IS contact.

---

## Trigger

HTTP POST webhook: `https://n8n.<domain>/webhook/order-stripe`

Configured in **Stripe Dashboard → Developers → Webhooks → Add endpoint**.

**Events subscribed:**
- `checkout.session.completed` — primary signal for IS-routed purchases
- `payment_intent.succeeded` — fallback for direct Stripe Checkout flows
- `charge.refunded` — routes to W07 Refund Handler
- `invoice.paid` — for membership recurring billing (Phase 2)

## Node-by-node configuration

### Node 1 — Webhook (POST)

- **Path:** `/webhook/order-stripe`
- **Method:** POST
- **Authentication:** None at webhook level; signature verified at next node
- **Response mode:** "Respond immediately" with 200 — Stripe expects <5s response
- **Response:** `{"received": true}`

### Node 2 — Function: Verify Stripe Signature

```js
const crypto = require('crypto');

const signatureHeader = $input.headers['stripe-signature'];
const payload = $input.body; // raw body needed — may require webhook node configured to pass raw
const secret = $env.STRIPE_WEBHOOK_SECRET;

// Stripe signature format: t=<ts>,v1=<sig>
const elements = signatureHeader.split(',');
const timestamp = elements.find(e => e.startsWith('t=')).split('=')[1];
const signature = elements.find(e => e.startsWith('v1=')).split('=')[1];

const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
const expectedSig = crypto
  .createHmac('sha256', secret)
  .update(signedPayload)
  .digest('hex');

if (expectedSig !== signature) {
  throw new Error('Invalid Stripe signature');
}

// Check timestamp is within 5 min tolerance to prevent replay
const now = Math.floor(Date.now() / 1000);
if (Math.abs(now - parseInt(timestamp)) > 300) {
  throw new Error('Stripe timestamp outside tolerance');
}

return $input.body;
```

### Node 3 — Switch by `event.type`

- Route 1: `checkout.session.completed`, `payment_intent.succeeded` → continue to Node 4
- Route 2: `charge.refunded` → call W07 Refund Handler via HTTP Request node → exit
- Route 3: `invoice.paid` → continue to Node 4 with `type=subscription` flag
- Default: write to Errors table "Unhandled event type", return 200

### Node 4 — Function: Normalize Payload

```js
const event = $input.all()[0].json;
const obj = event.data.object;

let normalized;

if (event.type === 'checkout.session.completed') {
  normalized = {
    order_id: `stripe-${obj.id}`,
    stripe_payment_intent: obj.payment_intent,
    timestamp: new Date(event.created * 1000).toISOString(),
    email: (obj.customer_details?.email || obj.customer_email || '').toLowerCase(),
    first_name: obj.customer_details?.name?.split(' ')[0] || '',
    gross_amount: obj.amount_total / 100,
    currency: obj.currency,
    platform: 'is',
    products: obj.metadata?.products ? obj.metadata.products.split(',') : [],
    orderbump_taken: obj.metadata?.orderbump === 'true',
    orderbump_product: obj.metadata?.orderbump_sku || null,
    oto_taken: obj.metadata?.oto === 'true',
    oto_product: obj.metadata?.oto_sku || null,
    discount_code: obj.metadata?.discount_code || null,
    discount_amount: obj.total_details?.amount_discount / 100 || 0,
    tax_collected: obj.total_details?.amount_tax / 100 || 0,
    raw_payload: JSON.stringify(event).slice(0, 5000)
  };
} else if (event.type === 'payment_intent.succeeded') {
  // fallback path
  normalized = {
    order_id: `stripe-${obj.id}`,
    timestamp: new Date(event.created * 1000).toISOString(),
    email: (obj.receipt_email || '').toLowerCase(),
    gross_amount: obj.amount_received / 100,
    platform: 'is',
    products: obj.metadata?.products ? obj.metadata.products.split(',') : [],
    raw_payload: JSON.stringify(event).slice(0, 5000)
  };
}

return normalized;
```

### Node 5 — Airtable: Find or Create Customer

- **Table:** Customers
- **Operation:** Upsert
- **Match on:** `Email` field (lowercase)
- **Fields to set on create:**
  - `Email`: `{{ $json.email }}`
  - `First name`: `{{ $json.first_name }}`
  - `Acquisition source`: `direct` *(default; source attribution updated by W04 if subscriber first)*
  - `First contact date`: `{{ $json.timestamp }}`
  - `First purchase date`: `{{ $json.timestamp }}`
- **Fields to update on existing:**
  - `First name`: only if currently blank
  - `Last purchase date`: `{{ $json.timestamp }}`

### Node 6 — Function: Expand line items

If `products` array has multiple items (main + OrderBump + OTO), iterate and prepare one Order row per product:

```js
const normalized = $input.all()[0].json;
const orders = [];

// Main product
if (normalized.products[0]) {
  orders.push({
    order_id: normalized.order_id,
    product_sku: normalized.products[0],
    gross_amount: normalized.gross_amount - (normalized.orderbump_taken ? orderbumpPrice : 0) - (normalized.oto_taken ? otoPrice : 0),
    is_bump: false,
    is_oto: false
  });
}

// OrderBump
if (normalized.orderbump_taken && normalized.orderbump_product) {
  orders.push({
    order_id: `${normalized.order_id}-bump`,
    product_sku: normalized.orderbump_product,
    gross_amount: normalized.orderbump_amount || 0,
    is_bump: true,
    is_oto: false
  });
}

// OTO
if (normalized.oto_taken && normalized.oto_product) {
  orders.push({
    order_id: `${normalized.order_id}-oto`,
    product_sku: normalized.oto_product,
    gross_amount: normalized.oto_amount || 0,
    is_bump: false,
    is_oto: true
  });
}

return orders.map(o => ({ ...o, base: normalized }));
```

### Node 7 — Airtable: Create Order (iterate per line item)

- **Table:** Orders
- **Operation:** Create
- **Fields:**
  - `Order ID`: `{{ $json.order_id }}`
  - `Timestamp`: `{{ $json.base.timestamp }}`
  - `Customer`: link to Customer from Node 5
  - `Product`: lookup Product in Products table by `SKU = $json.product_sku`, link
  - `Platform`: `is`
  - `Gross amount`: `{{ $json.gross_amount }}`
  - `Platform fee`: calculate from Stripe fees (gross × 0.029 + 0.30 + Stripe Tax 0.005 × gross)
  - `OrderBump taken?`: `{{ $json.is_bump || $json.base.orderbump_taken }}`
  - `OTO taken?`: `{{ $json.is_oto || $json.base.oto_taken }}`
  - `Tax collected`: `{{ $json.base.tax_collected }}`
  - `Discount code applied`: `{{ $json.base.discount_code }}`
  - `Discount amount`: `{{ $json.base.discount_amount }}`
  - `Raw webhook payload`: `{{ $json.base.raw_payload }}`

### Node 8 — IS API: Tag Contact

- **Operation:** Update contact tags
- **Contact match:** email from Node 4
- **Tags to add:**
  - `product:<sku>` for every product in the order
  - `bought:<YYYY-MM-DD>`
  - `persona:<inferred>` — inference logic:
    - If purchased T3+ product OR bundle → `persona:sarah`
    - If purchased T1 only → `persona:sam` (unless already tagged sarah)
    - If purchased Pro Manager Bundle → `persona:pam`

### Node 9 — Slack notification (conditional)

- Only fires if total sales count < 100 (check Airtable Metrics)
- Channel: `#str-platform-wins`
- Message: `🎉 Sale #<N>: <product name> × <quantity> = $<amount> from <first name> (<email domain>). Platform: IS.`

### Node 10 — Success response

- Set HTTP 200 with `{"status": "processed", "order_id": "..."}`

### Error branch (wraps Nodes 2–9)

If any node fails:
1. Write to Airtable Errors table:
   - `Timestamp`: now
   - `Workflow`: `W01-order-ingestion-stripe`
   - `Node`: failing node name
   - `Error message`: exception text
   - `Payload`: first 500 chars of `$input.body`
   - `Status`: Open
2. Slack alert to `#str-platform-alerts`
3. If retry count < 3, queue retry with exponential backoff (2s, 8s, 32s)
4. Respond HTTP 500 to Stripe — Stripe will retry automatically per its retry policy

## Inputs

- Stripe webhook payload (validated)
- Environment: `STRIPE_WEBHOOK_SECRET`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `IS_API_KEY`, `SLACK_WEBHOOK_URL`

## Outputs

- Airtable Customers row (upserted)
- Airtable Orders rows (1 per line item)
- IS contact tagged
- (Conditional) Slack notification

## Dependencies

- Airtable base created with Customers, Orders, Products, Errors tables (Task B1)
- IS API accessible with credentials configured in n8n (Task B3)
- Stripe webhook configured with matching signing secret (Task B4)
- Products table has rows for every SKU that could appear in order metadata

## Edge cases

| Case | Handling |
|---|---|
| Duplicate webhook (Stripe retry) | `Order ID` upsert on Orders table dedupes |
| Guest checkout (no email) | Reject with 400; Stripe metadata should always include email |
| Email with different casing | Normalize to lowercase at Node 4 |
| Product SKU in metadata doesn't match Airtable Products | Create Errors row, create Order with empty Product link, alert |
| Negative or zero amount | Log in Errors, still create row for audit trail |
| Stripe Tax line item | Separate field on Order row, not included in Gross |
| Currency other than USD | Store currency field; conversion handled downstream (not at ingestion) |
| Webhook replay older than 5 min | Reject at Node 2 signature verification |

## Test cases

1. **Single-product purchase** — standard flow
   - Trigger: test checkout for $47 product
   - Expected: 1 Customer (new or updated), 1 Order with platform=is, gross=47.00, bump=false, oto=false
2. **Repeat buyer** — existing Customer, new Order
   - Expected: Customer row's `Last purchase date` updates; `First purchase date` unchanged; LTV recalculates
3. **Purchase with OrderBump**
   - Expected: 2 Order rows — main product + bump. OrderBump taken?=true on both.
4. **Purchase with OTO**
   - Expected: main Order + OTO Order; OTO row tied to same Customer via Link.
5. **Refund event**
   - Expected: Event routed to W07, W01 does not create duplicate Order
6. **Invalid signature**
   - Expected: HTTP 401, no Airtable writes, Errors row logged
7. **Rate-limited Airtable**
   - Expected: Retry with backoff, eventual success; no duplicate Orders

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Execution success rate | > 99% | < 95% = investigate |
| Webhook-to-Airtable latency | < 10s p95 | > 30s p95 = investigate |
| Signature verification failure rate | < 0.1% | > 1% = possible attack or config drift |
| Orphan Orders (no Customer linked) | 0 | > 0 = investigate Node 5 |

## Deployment

1. Create workflow in n8n → name "W01-order-ingestion-stripe"
2. Configure all credentials in n8n Credentials manager (Stripe, Airtable, IS, Slack)
3. Set environment variables in `docker-compose.yml` or n8n admin UI
4. Activate workflow
5. In Stripe: create webhook endpoint → copy signing secret → paste into n8n env → activate webhook endpoint
6. Test: use Stripe CLI `stripe listen --forward-to https://n8n.<domain>/webhook/order-stripe` + `stripe trigger checkout.session.completed`
7. Verify Airtable writes occurred correctly
8. Export workflow as JSON → save to `infrastructure/n8n/workflows/W01-order-ingestion-stripe.json` → commit

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
- (future entries as the workflow evolves in production)
