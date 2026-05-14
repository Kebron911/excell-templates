# InfluencerSoft Etsy Buyer Integration — Node.js Code

## Task
Add Jane (jane@example.com) as a contact in InfluencerSoft with tags that trigger the post-purchase sequence.

## Solution

Use the existing helper library at `scripts/lib/influencersoft.mjs` + the CLI wrapper at `scripts/is-add-contact.mjs`. Here's a Node.js snippet:

```javascript
// Direct programmatic usage (e.g., in an n8n HTTP node or standalone script)
import { addUpdateLead } from "./scripts/lib/influencersoft.mjs";

async function addEtsyBuyer() {
  const payload = {
    lead_email: "jane@example.com",
    lead_first_name: "Jane",
    add_tags: "customer:etsy,source:etsy,product:tax-001-mileage-log",
  };

  const res = await addUpdateLead(payload);
  console.log("Contact added:", res.result);
}

addEtsyBuyer().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
```

## Tags Applied
Per `infrastructure/influencersoft/tag-dictionary.md`:

1. **`customer:etsy`** — Triggers the `post-purchase-etsy-buyer` sequence (§1 of tag-dictionary)
2. **`source:etsy`** — Records Etsy as first-touch acquisition source (§2)
3. **`product:tax-001-mileage-log`** — SKU tag for TAX-001 (§3), used by bundle cross-sell mapper

## CLI Alternative

If you prefer to run via command line (e.g., from n8n webhook):

```bash
node scripts/is-add-contact.mjs \
  --email jane@example.com \
  --first-name Jane \
  --tags customer:etsy,source:etsy,product:tax-001-mileage-log \
  --custom-field sku_code=TAX-001 \
  --custom-field sku_label="STR Mileage Log"
```

## Requirements

- **API Key:** Must be in `Excel-Templates/.env` as `INFLUENCERSOFT_API_KEY` (root folder, NOT worktree)
- **Tenant:** Defaults to `kebron` (read from `IS_TENANT` env var if different)
- **Rate limit:** Built-in throttle at ~0.9 req/s (conservative per API probe doc)

## Why This Works

- **Idempotent on email:** Re-running with the same email updates (doesn't duplicate)
- **Tags auto-create:** No pre-creation needed; tags are created on first use
- **Single call:** `AddUpdateLead` adds the contact, tags, and applies them in one HTTP POST
- **Sequence fires:** The `customer:etsy` tag is bound to the `post-purchase-etsy-buyer` sequence in the InfluencerSoft UI (manual setup via `ops/manual work/influencersoft-manual-setup-guide.md` Part 5)

## Files Referenced

- **Helpers:** `C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\scripts\lib\influencersoft.mjs`
- **CLI wrapper:** `C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\scripts\is-add-contact.mjs`
- **Tag dictionary:** `C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\infrastructure\influencersoft\tag-dictionary.md`
- **API reference:** `C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates\ops\influencersoft-api-probe.md`
