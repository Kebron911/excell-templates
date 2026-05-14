# Add Etsy Buyer to InfluencerSoft with Post-Purchase Sequence Trigger

## Summary

Here's Node.js code to add Jane (jane@example.com) as a contact in InfluencerSoft and tag her so the post-purchase sequence fires. The code uses the existing `addUpdateLead` helper from `scripts/lib/influencersoft.mjs`.

---

## Code

**File: `add-etsy-buyer.mjs`**

```javascript
import { addUpdateLead } from "./scripts/lib/influencersoft.mjs";

/**
 * Add an Etsy buyer to InfluencerSoft and tag for post-purchase sequence.
 *
 * @param {Object} buyer - Buyer details from Etsy order
 * @param {string} buyer.email - Buyer's email
 * @param {string} buyer.first_name - Buyer's first name
 * @param {string} sku - Product SKU (e.g., "TAX-001")
 * @returns {Promise<Object>} API response from AddUpdateLead
 */
async function addEtsyBuyer(buyer, sku) {
  // Map SKU to product tag slug (per tag-dictionary.md §3)
  const skuMap = {
    "TAX-001": "tax-001-mileage-log",
    "TAX-002": "tax-002-schedule-e",
    "TAX-003": "tax-003-1099",
    "OPS-001": "ops-001-cleaner-checklist",
    "OPS-003": "ops-003-turnover-pack",
    "GST-001": "gst-001-welcome-book",
    "ACQ-001": "acq-001-deal-analyzer",
    "ACQ-002": "acq-002-market-scorecard",
    "FIN-002": "fin-002-cashflow-model",
  };

  const productSlug = skuMap[sku];
  if (!productSlug) {
    throw new Error(`Unknown SKU: ${sku}. Add mapping to skuMap.`);
  }

  // Tags: customer:etsy fires the post-purchase-etsy-buyer sequence.
  // product:* identifies which bundle cross-sell to trigger later.
  // source:etsy tracks acquisition channel.
  const tags = [
    "customer:etsy",                    // Trigger tag — fires post-purchase-etsy-buyer sequence
    `product:${productSlug}`,           // Product tag for bundle cross-sell mapper
    "source:etsy",                      // Acquisition source
  ];

  const payload = {
    lead_email: buyer.email,
    lead_first_name: buyer.first_name,
    add_tags: tags.join(","),
  };

  console.log("Sending to InfluencerSoft:", JSON.stringify(payload, null, 2));

  const result = await addUpdateLead(payload);

  console.log("Success:", JSON.stringify(result, null, 2));
  return result;
}

// Example usage
const buyer = {
  email: "jane@example.com",
  first_name: "Jane",
};

const sku = "TAX-001"; // STR Mileage Log

await addEtsyBuyer(buyer, sku);
```

---

## How It Works

1. **`addUpdateLead()` helper** — Idempotent on email. Creates or updates the contact in a single API call.
2. **Tags trigger the sequence:**
   - `customer:etsy` → fires the **post-purchase-etsy-buyer** sequence (bound in IS UI)
   - `product:tax-001-mileage-log` → identifies SKU for bundle cross-sell mapper
   - `source:etsy` → tracks where the buyer came from

3. **Tag strings come from `tag-dictionary.md`** — This ensures sequences don't fire to the wrong tag.

---

## Integration Points

- **From n8n:** Use the existing `STR_Etsy_*` workflow — it already calls `is-add-contact.mjs` with the right tags.
- **Standalone script:** Run directly via `node add-etsy-buyer.mjs` or wrap in CLI using the `is-add-contact.mjs` pattern.
- **Environment setup:** Requires `INFLUENCERSOFT_API_KEY` in `.env` (32-char key from kebron tenant).

---

## Tags Reference (from tag-dictionary.md)

| Tag | Purpose |
|-----|---------|
| `customer:etsy` | Trigger tag — fires post-purchase-etsy-buyer sequence |
| `product:tax-001-mileage-log` | SKU identifier for bundle cross-sell mapper |
| `source:etsy` | Acquisition source (first touch = Etsy) |

See `infrastructure/influencersoft/tag-dictionary.md` §3 for complete product slug list.
