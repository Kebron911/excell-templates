# STRManuals — Cluster Integration Patches

**Purpose:** All cluster-side changes required to wire strmanuals.com into the existing infrastructure. This file is a checklist for whoever owns each target file — no new workflows needed; everything plugs into existing W01 (Stripe ingestion) and W08 (lead magnet delivery).

**Last updated:** 2026-05-05

---

## Patch 1 — Tag Dictionary

**Target:** `infrastructure/influencersoft/tag-dictionary.md` (currently un-bootstrapped per PROGRESS.md P2.0)

**Add to the `product:` namespace:**

```yaml
# strmanuals.com SKUs (added 2026-05-05)
product:str-tax-loophole-playbook        # MAN-TAX-01 — $29
product:material-participation-survival-kit  # MAN-TAX-02 — $29
product:why-bookings-down                 # MAN-REV-01 — $19
product:direct-bookings-starter           # MAN-REV-02 — $25
product:permit-regulation-survival        # MAN-LGL-01 — $25
product:str-manuals-bundle                # MAN-BUNDLE-01 — $99
```

**Add to the `magnet:` namespace:**

```yaml
magnet:str-tax-loophole-explainer  # 8-page primer, lead magnet for /free
```

**Add to the `source:` namespace:**

```yaml
source:strmanuals  # Acquired via strmanuals.com (any entry point)
```

**Add to the `customer:` namespace:**

```yaml
customer:strmanuals  # Has at least one strmanuals.com purchase (any SKU)
```

**Add a new `audience:` tag for broadcast targeting:**

```yaml
audience:strmanuals-list  # On the strmanuals biweekly broadcast list (post-magnet-sequence)
```

**Add sequence-state tags** (auto-managed by IS, listed for completeness):

```yaml
seq:strmanuals-order-confirmation:e1-sent
seq:strmanuals-order-confirmation:e2-sent
seq:strmanuals-order-confirmation:complete
seq:strmanuals-free-magnet:e1-sent
seq:strmanuals-free-magnet:e2-sent
seq:strmanuals-free-magnet:e3-sent
seq:strmanuals-free-magnet:e4-sent
seq:strmanuals-free-magnet:complete
```

---

## Patch 2 — W01 (Order Ingestion · Stripe)

**Target:** `infrastructure/n8n/workflows/W01-order-ingestion-stripe.md`

**What changes:** Stripe webhook needs to recognize strmanuals.com purchases (separate Stripe account or shared account with new Price IDs) and route to the strmanuals tag set + sequence.

### Add to "SKU detection" Switch node

After the existing course-tier branch, add a new branch:

```js
// strmanuals.com SKU detection
const STRMANUALS_PRICE_IDS = {
  'price_strmanuals_tax01_v1': 'str-tax-loophole-playbook',
  'price_strmanuals_tax02_v1': 'material-participation-survival-kit',
  'price_strmanuals_rev01_v1': 'why-bookings-down',
  'price_strmanuals_rev02_v1': 'direct-bookings-starter',
  'price_strmanuals_lgl01_v1': 'permit-regulation-survival',
  'price_strmanuals_bundle01_v1': 'str-manuals-bundle',
};

const lineItem = order.line_items[0]; // strmanuals checkouts are single-item or single-bundle
const sku = STRMANUALS_PRICE_IDS[lineItem.price.id];

if (sku) {
  return [{ json: { ...order, normalized_sku: sku, route: 'strmanuals' } }];
}
```

(Replace `price_strmanuals_*_v1` placeholders with real Price IDs from Stripe Dashboard once created.)

### Add new node: "Generate strmanuals download token"

After SKU normalization, before IS tagging:

```js
const crypto = require('crypto');

const order = $input.first().json;
const expiry = Math.floor(Date.now() / 1000) + 86400; // 24h

const tokenPayload = `${order.email}|${order.order_id}|${order.normalized_sku}|${expiry}`;
const signature = crypto
  .createHmac('sha256', $env.DOWNLOAD_HMAC_SECRET)
  .update(tokenPayload)
  .digest('hex');

const downloadUrl = `https://strmanuals.com/api/download` +
  `?email=${encodeURIComponent(order.email)}` +
  `&order=${order.order_id}` +
  `&sku=${order.normalized_sku}` +
  `&exp=${expiry}` +
  `&sig=${signature}`;

const COMPANIONS = {
  'str-tax-loophole-playbook':       { name: 'TAX-002 P&L Workbook',           url: 'https://thestrledger.com/templates/pl-single-property' },
  'material-participation-survival-kit': { name: 'Hours Log Template',          url: 'https://thestrledger.com/templates/material-participation-log' },
  'why-bookings-down':               { name: 'Break-Even Occupancy Workbook',  url: 'https://thestrledger.com/templates/break-even-occupancy' },
  'direct-bookings-starter':         { name: 'Direct-Booking Email Pack',      url: 'https://thestrledger.com/templates/direct-booking-emails' },
  'permit-regulation-survival':      { name: 'Permit Research Worksheet',      url: 'https://thestrledger.com/templates/permit-research' },
  'str-manuals-bundle':              { name: 'All five companion workbooks',   url: 'https://thestrledger.com/templates/strmanuals-bundle' },
};

const companion = COMPANIONS[order.normalized_sku];

return [{ json: {
  ...order,
  download_url: downloadUrl,
  download_expiry: new Date(expiry * 1000).toISOString(),
  companion_name: companion.name,
  companion_url: companion.url,
} }];
```

### Add to IS "Tag contact" node

Add tags for strmanuals route:

```yaml
tags_to_add:
  - product:{{ normalized_sku }}
  - customer:strmanuals
  - source:strmanuals
  - acquired:{{ timestamp_date }}
```

### Add IS sequence trigger

Trigger sequence `strmanuals-order-confirmation` with merge vars:

```yaml
merge_vars:
  first_name:       "{{ first_name }}"
  manual_sku:       "{{ normalized_sku_uppercase }}"   # e.g. TAX-01
  manual_title:     "{{ sku_title_lookup }}"           # IS-side lookup table or pass from n8n
  download_url:     "{{ download_url }}"
  companion_name:   "{{ companion_name }}"
  companion_url:    "{{ companion_url }}"
  order_id:         "{{ order_id }}"
  next_manual_title: "{{ next_manual_title }}"   # see Patch 2b
  next_manual_url:  "{{ next_manual_url }}"
```

### Patch 2b — Cross-sell branching

n8n Function node before sequence trigger, resolves the cross-sell target by purchased SKU:

```js
const NEXT_MANUAL = {
  'str-tax-loophole-playbook':       { title: 'Material Participation Survival Kit', url: 'https://strmanuals.com/manuals/tax-02' },
  'material-participation-survival-kit': { title: 'The STR Tax Loophole Playbook',    url: 'https://strmanuals.com/manuals/tax-01' },
  'why-bookings-down':               { title: 'Direct Bookings Starter',              url: 'https://strmanuals.com/manuals/rev-02' },
  'direct-bookings-starter':         { title: 'Why Are My Bookings Down?',            url: 'https://strmanuals.com/manuals/rev-01' },
  'permit-regulation-survival':      { title: 'The STR Tax Loophole Playbook',        url: 'https://strmanuals.com/manuals/tax-01' },
  // bundle buyers don't need a cross-sell — Email 3 of the sequence is gated on NOT product:str-manuals-bundle
};

const next = NEXT_MANUAL[$json.normalized_sku] || { title: '', url: '' };
return [{ json: { ...$json, next_manual_title: next.title, next_manual_url: next.url } }];
```

---

## Patch 3 — W08 (Lead Magnet Delivery)

**Target:** `infrastructure/n8n/workflows/W08-lead-magnet-delivery.md`

**What changes:** Add a new magnet branch in the existing Switch-by-magnet-ID node.

### Add to webhook list

Register a new IS form webhook:

```
POST https://n8n.thestrledger.com/webhook/lead-magnet-strmanuals-tax-explainer
```

(Or, if W08 is the single-workflow-with-Switch model, route by `form_slug === 'strmanuals-tax-explainer'`.)

### Add Switch branch

```js
case 'strmanuals-tax-explainer':
  return {
    magnet_id: 'str-tax-loophole-explainer',
    file_url: 'https://strmanuals.com/api/download?free=tax-loophole-explainer&email={{email}}',  // separate /api/download mode for free PDFs — no token needed; rate-limited by IP + email
    is_tags: [
      'magnet:str-tax-loophole-explainer',
      'source:strmanuals',
      `acquired:${new Date().toISOString().slice(0,10)}`,
    ],
    is_sequence_trigger: 'strmanuals-free-magnet',
  };
```

### Airtable Customers row

Same pattern as the existing `/47` magnet — add a row with:

```yaml
email: <submission.email>
first_name: <submission.first_name>
acquired_via: strmanuals-free-magnet
acquired_at: <timestamp>
utm_source / medium / campaign / content: <captured>
landing_page: strmanuals.com/free   # or homepage if captured there
```

---

## Patch 4 — products.yaml (when bootstrapped)

**Target:** `infrastructure/influencersoft/products.yaml` (un-bootstrapped per PROGRESS.md P2.0)

Add 6 product entries:

```yaml
- sku: str-tax-loophole-playbook
  is_product_id: TBD              # populate after IS product creation
  stripe_price_id: TBD            # populate after Stripe Price creation
  name: "The STR Tax Loophole Playbook"
  price_cents: 2900
  file_url: "/private/manuals/str-tax-loophole-playbook/v1.pdf"
  success_page: "https://strmanuals.com/thank-you"
  tags_on_purchase:
    - product:str-tax-loophole-playbook
    - customer:strmanuals
    - source:strmanuals

- sku: material-participation-survival-kit
  is_product_id: TBD
  stripe_price_id: TBD
  name: "Material Participation Survival Kit"
  price_cents: 2900
  file_url: "/private/manuals/material-participation-survival-kit/v1.pdf"
  success_page: "https://strmanuals.com/thank-you"
  tags_on_purchase:
    - product:material-participation-survival-kit
    - customer:strmanuals
    - source:strmanuals

- sku: why-bookings-down
  is_product_id: TBD
  stripe_price_id: TBD
  name: "Why Are My Bookings Down?"
  price_cents: 1900
  file_url: "/private/manuals/why-bookings-down/v1.pdf"
  success_page: "https://strmanuals.com/thank-you"
  tags_on_purchase:
    - product:why-bookings-down
    - customer:strmanuals
    - source:strmanuals

- sku: direct-bookings-starter
  is_product_id: TBD
  stripe_price_id: TBD
  name: "Direct Bookings Starter"
  price_cents: 2500
  file_url: "/private/manuals/direct-bookings-starter/v1.pdf"
  success_page: "https://strmanuals.com/thank-you"
  tags_on_purchase:
    - product:direct-bookings-starter
    - customer:strmanuals
    - source:strmanuals

- sku: permit-regulation-survival
  is_product_id: TBD
  stripe_price_id: TBD
  name: "STR Permit & Regulation Survival Guide"
  price_cents: 2500
  file_url: "/private/manuals/permit-regulation-survival/v1.pdf"
  success_page: "https://strmanuals.com/thank-you"
  tags_on_purchase:
    - product:permit-regulation-survival
    - customer:strmanuals
    - source:strmanuals

- sku: str-manuals-bundle
  is_product_id: TBD
  stripe_price_id: TBD
  name: "All Five Manuals (Bundle)"
  price_cents: 9900
  file_url: "/private/manuals/str-manuals-bundle/v1.zip"   # zip of all 5 watermarked PDFs at delivery time
  success_page: "https://strmanuals.com/thank-you?bundle=1"
  tags_on_purchase:
    - product:str-manuals-bundle
    - product:str-tax-loophole-playbook
    - product:material-participation-survival-kit
    - product:why-bookings-down
    - product:direct-bookings-starter
    - product:permit-regulation-survival
    - customer:strmanuals
    - source:strmanuals
```

---

## Patch 5 — forms.yaml (when bootstrapped)

**Target:** `infrastructure/influencersoft/forms.yaml`

Add 1 form:

```yaml
- slug: strmanuals-tax-explainer
  name: "Free: The STR Tax Loophole Explainer"
  fields:
    - email (required)
    - first_name (optional)
  capture_pages:
    - https://strmanuals.com/free
    - https://strmanuals.com/  # homepage block
  success_url: "https://strmanuals.com/free?confirmed=1"
  tags_on_submit:
    - magnet:str-tax-loophole-explainer
    - source:strmanuals
  sequence_to_trigger: strmanuals-free-magnet
  webhook_target: "https://n8n.thestrledger.com/webhook/lead-magnet-strmanuals-tax-explainer"
```

---

## Patch 6 — Refund handler (W07)

**Target:** `infrastructure/n8n/workflows/W07-refund-handler.md`

**What changes:** When a strmanuals SKU is refunded, revoke download access in addition to standard refund tagging.

### Add to refund processing

```js
if (refund.normalized_sku && refund.route === 'strmanuals') {
  // Revoke download access — write a row to /private/db/orders.db revocations table via Hostinger API
  await axios.post('https://strmanuals.com/api/internal/revoke-order', {
    order_id: refund.original_order_id,
    auth: $env.STRMANUALS_INTERNAL_AUTH,
  });

  // Tag contact for refund-recovery sequence (cluster-wide, already exists)
  // — no strmanuals-specific refund sequence needed; the existing one applies
}
```

---

## Implementation order

When P2.0 (Influencersoft prep pack) is being executed:

1. Tag dictionary — add the strmanuals tags (Patch 1) **first**, because everything else references them
2. products.yaml — add the 6 SKU entries (Patch 4)
3. forms.yaml — add the lead-magnet form (Patch 5)
4. Sequences — convert the two `.md` files (already drafted) into IS-import shape:
   - `copy/email-sequences/strmanuals-order-confirmation.md`
   - `copy/email-sequences/strmanuals-free-magnet.md`
5. W01 — add SKU detection + download token + cross-sell branching (Patches 2 + 2b)
6. W08 — add the new magnet branch (Patch 3)
7. W07 — add refund revocation hook (Patch 6)

---

## What this site needs *from* the cluster

For strmanuals.com to ship, the following cluster pieces must already exist:

- ☐ `https://n8n.thestrledger.com/webhook/order-stripe` (W01) — receives strmanuals Stripe webhooks
- ☐ `https://n8n.thestrledger.com/webhook/lead-magnet-strmanuals-tax-explainer` (W08 branch) — receives free-magnet IS form submissions
- ☐ `STRMANUALS_INTERNAL_AUTH` env var on n8n side, mirrored on Hostinger as inbound auth
- ☐ Tag dictionary entries above so IS doesn't reject unknown tags
- ☐ Two sequences (`strmanuals-order-confirmation`, `strmanuals-free-magnet`) loaded into IS
- ☐ 6 IS products + 1 IS form created (per Patches 4 + 5)
- ☐ 6 Stripe Price objects created (Phase 0 → Phase 3 of build order)

If any of these are missing at strmanuals.com launch, the corresponding flow degrades gracefully (Stripe webhook still records the order in Airtable; downloads still work via direct `/api/download`; only the IS sequencing breaks). But all six should land before public launch.
