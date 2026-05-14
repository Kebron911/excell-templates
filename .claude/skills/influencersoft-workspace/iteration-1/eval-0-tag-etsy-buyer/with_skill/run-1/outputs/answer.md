# Adding an Etsy Buyer to InfluencerSoft — Node.js Implementation

## Overview

Jane (jane@example.com) purchased the **STR Mileage Log (SKU TAX-001)** from Etsy. This code adds her as a contact in InfluencerSoft and tags her so the post-purchase sequence fires automatically.

**What gets applied:**
- `customer:etsy` — triggers the `post-purchase-etsy-buyer` sequence (wired in IS UI)
- `source:etsy` — identifies Etsy as acquisition source
- `product:tax-001-mileage-log` — product SKU (used by cross-sell automation)

---

## Quick Start: Use the Existing CLI

The project already has a battle-tested script at `scripts/is-add-contact.mjs`:

```bash
node scripts/is-add-contact.mjs \
  --email jane@example.com \
  --first-name Jane \
  --tags customer:etsy,source:etsy,product:tax-001-mileage-log \
  --custom-field sku_code=TAX-001 \
  --custom-field sku_label="STR Mileage Log" \
  --custom-field bought_on=2026-05-14 \
  --custom-field order_ref=ETSY_3148293
```

**Idempotent on email** — running twice just updates the contact.

---

## Option 1: Minimal Programmatic Approach

For webhook handlers or workflow integrations, use the library directly:

```javascript
import { addUpdateLead } from "./lib/influencersoft.mjs";

async function addEtsyBuyer(email, firstName, sku = "TAX-001") {
  const skuMap = {
    "TAX-001": "product:tax-001-mileage-log",
    "TAX-002": "product:tax-002-schedule-e",
    "TAX-003": "product:tax-003-1099",
  };

  const payload = {
    lead_email: email,
    lead_first_name: firstName,
    add_tags: `customer:etsy,source:etsy,${skuMap[sku]}`,
    sku_code: sku,
  };

  const result = await addUpdateLead(payload);
  console.log(`✓ Added ${email}, sequence will fire`);
  return result;
}

// Usage:
await addEtsyBuyer("jane@example.com", "Jane", "TAX-001");
```

---

## Option 2: Full-Featured with Order Metadata

For production integrations that need to preserve order details:

```javascript
import { addUpdateLead } from "./lib/influencersoft.mjs";

/**
 * Add an Etsy buyer to InfluencerSoft and fire post-purchase sequence.
 * @param {Object} buyer - Buyer object from Etsy API / webhook
 * @param {string} buyer.email
 * @param {string} buyer.first_name
 * @param {string} buyer.last_name - Optional
 * @param {string} sku - Product SKU (e.g., "TAX-001")
 * @param {Object} opts - Metadata
 * @param {string} opts.order_ref - Etsy order ID
 * @param {string} opts.order_date - ISO date of purchase
 * @returns {Promise<Object>} API response
 */
async function addEtsyBuyerFull(buyer, sku, opts = {}) {
  // Map SKU to product tag per tag-dictionary.md §3
  const skuToTag = {
    "TAX-001": "product:tax-001-mileage-log",
    "TAX-002": "product:tax-002-schedule-e",
    "TAX-003": "product:tax-003-1099",
    "OPS-001": "product:ops-001-cleaner-checklist",
    "OPS-003": "product:ops-003-turnover-pack",
    "GST-001": "product:gst-001-welcome-book",
    "ACQ-001": "product:acq-001-deal-analyzer",
    "ACQ-002": "product:acq-002-market-scorecard",
    "FIN-002": "product:fin-002-cashflow-model",
  };

  const productTag = skuToTag[sku.toUpperCase()];
  if (!productTag) {
    throw new Error(`Unknown SKU: ${sku}. Check tag-dictionary.md.`);
  }

  const tags = [
    "customer:etsy",        // Sequence trigger
    "source:etsy",          // Acquisition channel
    productTag,             // Product SKU
  ];

  const payload = {
    lead_email: buyer.email,
    lead_first_name: buyer.first_name,
    ...(buyer.last_name && { lead_last_name: buyer.last_name }),
    add_tags: tags.join(","),
    // Custom fields (optional metadata)
    sku_code: sku.toUpperCase(),
    sku_label: opts.sku_label || `Product ${sku}`,
    ...(opts.order_ref && { order_ref: opts.order_ref }),
    ...(opts.order_date && { bought_on: opts.order_date }),
  };

  const result = await addUpdateLead(payload);

  return {
    ok: true,
    email: buyer.email,
    tags_applied: tags,
    sequence_fired: "post-purchase-etsy-buyer",
    api_result: result,
  };
}

// Usage:
const etsyBuyer = {
  email: "jane@example.com",
  first_name: "Jane",
  last_name: "Doe",
};

const result = await addEtsyBuyerFull(etsyBuyer, "TAX-001", {
  order_ref: "ETSY_3148293",
  order_date: "2026-05-14",
  sku_label: "STR Mileage Log",
});

console.log(result);
// {
//   ok: true,
//   email: "jane@example.com",
//   tags_applied: ["customer:etsy", "source:etsy", "product:tax-001-mileage-log"],
//   sequence_fired: "post-purchase-etsy-buyer",
//   api_result: { error_code: 0, error_text: "OK", result: [...] }
// }
```

---

## Option 3: For n8n Integration

The API payload shape (use in n8n HTTP node):

```json
{
  "rpsKey": "{{ $env.INFLUENCERSOFT_API_KEY }}",
  "lead_email": "jane@example.com",
  "lead_first_name": "Jane",
  "lead_last_name": "Doe",
  "add_tags": "customer:etsy,source:etsy,product:tax-001-mileage-log",
  "sku_code": "TAX-001",
  "sku_label": "STR Mileage Log",
  "order_ref": "ETSY_3148293",
  "bought_on": "2026-05-14"
}
```

**POST to:** `https://kebron.influencersoft.com/api/AddUpdateLead`

---

## What Happens Next

1. Contact is created or updated (idempotent on email)
2. Tags are applied immediately
3. InfluencerSoft automation **fires `post-purchase-etsy-buyer` sequence** (bound to `customer:etsy` tag in IS UI)
4. Sequence sends delivery email (includes download link), check-in (day 2), value email (day 5), review request (day 9)
5. On day 5, IS auto-tags with `purchased:day5`, triggering a separate review-request sequence

See tag-dictionary.md §1 for full sequence mapping.

---

## Tag Reference

All tags follow format from `infrastructure/influencersoft/tag-dictionary.md`:

**Sequence triggers:**
| Tag | Sequence |
|-----|----------|
| `customer:etsy` | `post-purchase-etsy-buyer` |
| `purchased:day5` | `review-request` |
| `refund-filed` | `refund-recovery` |

**Product SKUs (add to every order):**
- `product:tax-001-mileage-log` (TAX-001)
- `product:tax-002-schedule-e` (TAX-002)
- `product:tax-003-1099` (TAX-003)
- `product:ops-001-cleaner-checklist`
- `product:gst-001-welcome-book`
- ... (see tag-dictionary.md for full list)

**Source tags (set once on contact creation):**
- `source:etsy` — first touch = Etsy
- `source:thestrledger` — first touch = own site
- `source:lead-magnet` — opt-in, no purchase yet

---

## Key Implementation Notes

### Idempotency
`AddUpdateLead` is idempotent on email. Running twice with same email = contact updated, no duplicate.

### Tags Auto-Create
InfluencerSoft auto-creates any tag on first use (no pre-create endpoint). Follow tag-dictionary.md strictly — typos won't error but sequences won't trigger.

### Rate Limiting
The `influencersoft.mjs` helper throttles at 1100ms between calls (~0.9 req/s). Conservative per API probe.

### API Key
Reads from `.env` at project root (not worktree):
```
INFLUENCERSOFT_API_KEY=<your-key>
IS_TENANT=kebron  # optional, defaults to kebron
```

---

## Error Handling

```javascript
try {
  const result = await addEtsyBuyerFull(buyer, "TAX-001", opts);
  console.log("Success:", result.email);
} catch (err) {
  if (err.message.includes("INFLUENCERSOFT_API_KEY")) {
    console.error("Missing or invalid API key in .env");
  } else if (err.message.includes("HTTP")) {
    console.error("Network error:", err.message);
  } else {
    console.error("InfluencerSoft API error:", err.message);
  }
  process.exit(1);
}
```

---

## Files Referenced

- **Helper library:** `scripts/lib/influencersoft.mjs` (88 lines, fetch wrapper + helpers)
- **CLI tool:** `scripts/is-add-contact.mjs` (101 lines, stdin support)
- **Tag dictionary:** `infrastructure/influencersoft/tag-dictionary.md` (121 lines, authoritative)
- **API probe:** `ops/influencersoft-api-probe.md` (251 lines, endpoint reference)
- **Module map:** `.claude/skills/influencersoft/modules.md` (129 lines, UI reference)
- **API key:** `.env` at project root → `INFLUENCERSOFT_API_KEY`
- **Tenant:** `kebron.influencersoft.com`

---

## Testing

Dry run to inspect payload:

```bash
node scripts/is-add-contact.mjs \
  --email jane@example.com \
  --first-name Jane \
  --tags customer:etsy,source:etsy,product:tax-001-mileage-log \
  --dry-run
```

Then verify in IS UI:
1. **Contacts → Leads** → search for jane@example.com
2. Confirm tags appear on contact
3. **Campaigns → Sequence** → check for "sent" count on post-purchase-etsy-buyer (should increase within seconds)
