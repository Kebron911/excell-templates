# Adding an Etsy Buyer to InfluencerSoft and Triggering Post-Purchase Sequence

## Overview

You have a new Etsy order from Jane (jane@example.com) for the STR Mileage Log (SKU: TAX-001). This code adds her as a contact in InfluencerSoft and tags her to trigger an automated post-purchase email sequence.

InfluencerSoft provides **API 2.0** endpoints for contact management:
- **addupdatelead** — creates/updates a contact with email, first name, and tags
- **addtagtolead** — adds tags to an existing contact (alternative approach)

The approach below uses `addupdatelead` in a single call, which is simpler and more idiomatic.

---

## Node.js Implementation

```typescript
import { config } from 'dotenv';

// Load environment variables from .env
config();

const INFLUENCERSOFT_API_KEY = process.env.INFLUENCERSOFT_API_KEY;
const INFLUENCERSOFT_SUBDOMAIN = 'kebron'; // From CREDENTIALS.md: kebron.influencersoft.com

interface InfluencersoftResponse {
  error_code: number;
  error_text: string;
  result: unknown[];
  hash: string;
}

interface AddEtsyBuyerOptions {
  email: string;
  firstName: string;
  productSku: string;
  tags?: string[];
}

/**
 * Add an Etsy buyer as a contact in InfluencerSoft and apply post-purchase tags.
 * Tags trigger automation sequences (e.g., email confirmations, upsells, onboarding).
 */
async function addEtsyBuyerToInfluencerSoft(
  options: AddEtsyBuyerOptions,
): Promise<InfluencersoftResponse> {
  if (!INFLUENCERSOFT_API_KEY) {
    throw new Error('INFLUENCERSOFT_API_KEY not set in .env');
  }

  const { email, firstName, productSku, tags = [] } = options;

  // InfluencerSoft expects URLencoded POST body for API 2.0
  const params = new URLSearchParams();
  params.append('rpsKey', INFLUENCERSOFT_API_KEY);
  params.append('lead_email', email);
  params.append('lead_first_name', firstName);

  // Add post-purchase sequence tags. These trigger automations in InfluencerSoft.
  // Common patterns: "etsy-buyer", "sku-{SKU}", "post-purchase-sequence"
  const allTags = [
    'etsy-buyer', // Generic buyer tag
    `sku-${productSku.replace(/[^a-z0-9-]/gi, '').toLowerCase()}`, // Product-specific
    'post-purchase-sequence', // Triggers post-purchase automation
    ...tags, // Any additional tags passed in
  ];
  params.append('add_tags', allTags.join(','));

  const url = `https://${INFLUENCERSOFT_SUBDOMAIN}.influencersoft.com/api/addupdatelead`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data: InfluencersoftResponse = await response.json();

    // Check API-level success (error_code 0 = success)
    if (data.error_code !== 0) {
      throw new Error(
        `InfluencerSoft API error: ${data.error_text} (code: ${data.error_code})`,
      );
    }

    console.log(`✓ Contact created/updated: ${email}`);
    console.log(`  Tags applied: ${allTags.join(', ')}`);
    return data;
  } catch (error) {
    console.error(
      `Failed to add buyer ${email} to InfluencerSoft:`,
      error,
    );
    throw error;
  }
}

/**
 * Alternative approach: Add tags to an existing contact separately.
 * Use this if the contact already exists and you only want to update tags.
 */
async function addTagsToEtsyBuyer(
  email: string,
  tags: string[],
): Promise<InfluencersoftResponse> {
  if (!INFLUENCERSOFT_API_KEY) {
    throw new Error('INFLUENCERSOFT_API_KEY not set in .env');
  }

  const params = new URLSearchParams();
  params.append('rpsKey', INFLUENCERSOFT_API_KEY);
  params.append('lead_email', email);
  params.append('add_tags', tags.join(','));

  const url = `https://${INFLUENCERSOFT_SUBDOMAIN}.influencersoft.com/api/addtagtolead`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data: InfluencersoftResponse = await response.json();

    if (data.error_code !== 0) {
      throw new Error(
        `InfluencerSoft API error: ${data.error_text} (code: ${data.error_code})`,
      );
    }

    console.log(`✓ Tags added to ${email}: ${tags.join(', ')}`);
    return data;
  } catch (error) {
    console.error(`Failed to add tags to ${email}:`, error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

async function main() {
  try {
    // Add Jane as a contact with post-purchase sequence tags
    const result = await addEtsyBuyerToInfluencerSoft({
      email: 'jane@example.com',
      firstName: 'Jane',
      productSku: 'TAX-001',
      // Optional: add custom tags beyond the defaults
      tags: ['mileage-log-buyer'], // Specific product interest tag
    });

    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
```

---

## Key Design Decisions

1. **`addupdatelead` endpoint** — Creates or updates a contact and applies tags in one call. Simpler than separate create + tag steps.

2. **Tag naming convention:**
   - `etsy-buyer` — Identifies source (Etsy platform)
   - `sku-{productSku}` — Product-specific tracking (e.g., `sku-tax-001`)
   - `post-purchase-sequence` — Triggers the automation rule that sends confirmation emails, upsells, etc.
   - Custom tags — Optional per-product tags (e.g., `mileage-log-buyer`)

3. **URLencoded body** — InfluencerSoft API 2.0 expects `application/x-www-form-urlencoded`, not JSON.

4. **Error handling** — Checks both HTTP status and the API-level `error_code` field. InfluencerSoft returns 200 OK even on logical errors (see `error_text` and `error_code`).

5. **Environment variable** — Reads `INFLUENCERSOFT_API_KEY` from `.env`. Subdomain is hardcoded as `kebron` from CREDENTIALS.md; adjust if different.

---

## Integration with Etsy Order Flow

Typical integration points:

1. **n8n workflow** — Trigger via Etsy webhook → call this function → log result
2. **Backend API** — POST `/api/etsy/order-received` → call this function
3. **Scheduled task** — Poll Etsy orders hourly → add any new buyers

For your setup (n8n + Etsy), create a workflow:
- **Trigger:** Etsy order webhook
- **Extract:** buyer email, first name, order SKUs
- **Execute:** Node.js script or HTTP POST to your server calling this function
- **Tag:** Use the buyer's order product SKU for per-product automation

---

## InfluencerSoft API References

- **addupdatelead docs:** https://help.influencersoft.com/hc/en-us/articles/360057803232
- **addtagtolead docs:** https://help.influencersoft.com/hc/en-us/articles/360058445991
- **API response codes:** https://help.influencersoft.com/hc/en-us/articles/360050392312

---

## Testing

```typescript
// Test the function (requires .env with INFLUENCERSOFT_API_KEY set)
const result = await addEtsyBuyerToInfluencerSoft({
  email: 'jane@example.com',
  firstName: 'Jane',
  productSku: 'TAX-001',
});

// Check logs and response hash for confirmation
console.assert(result.error_code === 0, 'API call failed');
console.log('Contact created with hash:', result.hash);
```
