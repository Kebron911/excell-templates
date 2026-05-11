# Stripe Bulk Import — The STR Ledger

`scripts/stripe-bulk-import.mjs` mirrors the entire STR Ledger catalog
(61 launch SKUs + 5 bundles) into Stripe as Products + Prices + Payment Links.

**Dry-run by default. No live API calls unless `--live` is passed.**

---

## Data sources

| Source | What it provides |
|---|---|
| `copy/etsy-listings/*.md` | Per-SKU name, description, `**Pricing:**` line |
| `copy/etsy-listings/bundles/*.md` | Bundle copy for BUNDLE-01/02/03 |
| `templates/_delivery/_bundles/bundles_config.py` | Backfills BUNDLE-04 + BUNDLE-05 (no markdown copy) |
| `STRManuals/site/.env` | `STRIPE_SECRET` (only read in `--live`) |

**Excluded:**
- `copy/etsy-listings/_not-at-launch/*` — held back (4 SKUs: FIN-001, OPS-002, PAM-001, TAX-011)
- `seo-research.md`, `shop-about.md`, `shop-policies.md`, `hero-magnet.md` — non-product copy
- `TAX-002-pl-single-property-lite.md` — duplicate SKU code; non-lite variant wins

**Price parsed:** The own-site price (NOT Etsy). Falls back to `Gumroad` price if no
`own-site` token (TAX-002 case). Stripe lives behind `thestrledger.com` — own-site channel.

---

## Usage

### 1. Dry run (default — safe, no API calls)

```
node scripts/stripe-bulk-import.mjs
```

Output:
- Console: summary + first 20 planned actions
- File: `ops/stripe-import-preview.csv` (full catalog, every row)

### 2. Filter to a subset (testing)

```
node scripts/stripe-bulk-import.mjs --filter GST
node scripts/stripe-bulk-import.mjs --filter BUNDLE
node scripts/stripe-bulk-import.mjs --filter TAX-002
```

`--filter` matches SKU prefix. Combine with default dry-run to validate, then add `--live`.

### 3. Live import (creates Products + Prices + Payment Links)

Prerequisites:
1. `STRIPE_SECRET=sk_live_...` in `STRManuals/site/.env` (or exported in shell)
2. `stripe` npm package available. From repo root:
   ```
   npm i stripe
   ```
   (Or run the script from `STRManuals/site/` where `stripe@^22.1.0` is already a dep — Node resolves `node_modules` upward.)

Exact live command:

```
node scripts/stripe-bulk-import.mjs --live
```

Recommended: dry-run a small filter first, then go live on that filter, verify in
Stripe dashboard, then live on the full set:

```
node scripts/stripe-bulk-import.mjs --filter GST --live    # 3 SKUs, ~$51 total
# verify in dashboard
node scripts/stripe-bulk-import.mjs --live                 # full 66-item catalog
```

---

## What the live mode creates (per SKU)

For each catalog item, three Stripe objects are created in this order:

1. **Product** — `name`, `description`, metadata `{sku, kind, source: "bulk-import-v1"}`
2. **Price** — `unit_amount` (cents), `currency: "usd"`, same metadata
3. **PaymentLink** — links the Price, with:
   - `payment_method_types: ["card"]`
   - `allow_promotion_codes: true`
   - `payment_intent_data.statement_descriptor: "STR LEDGER"`
   - `after_completion.redirect.url: https://thestrledger.com/thank-you?sku=<SKU>`

Every API call uses an idempotency key derived from the SKU code
(`bulk-import-v1:product:ACQ-001`, etc.), so re-running on the same SKU
returns the existing object instead of creating a duplicate.

Live results are written to `ops/stripe-import-live-results.csv` with the
`product_id`, `price_id`, and `payment_url` for each SKU.

### Payment Link URL format

Stripe returns URLs of the form:

```
https://buy.stripe.com/<random-token>
```

These are the URLs you embed in `thestrledger.com` "Buy Now" buttons and pass
to InfluencerSoft post-purchase hooks. Save them from `ops/stripe-import-live-results.csv`.

---

## Failure behavior

`--live` fails fast: on the first SKU that errors, the script:

1. Prints the SKU code, name, and Stripe error message
2. Prints how many SKUs were created before the failure
3. Exits with code 2

You can re-run after fixing the issue — idempotency keys mean successful SKUs are skipped.

---

## How to undo

Stripe doesn't allow programmatic deletion of Products that have ever been used.
You have two options:

### Option A — Manual via dashboard (preferred for partial cleanup)

1. Stripe Dashboard → Products → filter `metadata['source'] = "bulk-import-v1"`
2. Archive each Product (this also archives associated Prices)
3. Payment Links → filter by metadata, deactivate each one

### Option B — Bulk archive via follow-up script

Not implemented yet. If you need it, write `scripts/stripe-bulk-archive.mjs` that:
- Lists Products where `metadata.source = "bulk-import-v1"`
- Calls `stripe.products.update(id, { active: false })`
- Calls `stripe.paymentLinks.update(id, { active: false })`

(Hold off until you actually need it — archiving is one click per row in the dashboard.)

---

## Safety properties

- **Dry-run by default.** Anything destructive requires `--live`.
- **Never echoes the Stripe key.** Loaded via dotenv-style parser from `STRManuals/site/.env`.
- **API version pinned:** `2024-12-18.acacia` (matches existing `STRManuals/site/src/pages/api/checkout.ts`).
- **Idempotent.** SKU-derived idempotency keys on every API call.
- **Fail-fast.** First error halts; no half-imports without a clear stop point.
