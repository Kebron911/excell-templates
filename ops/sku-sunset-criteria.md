# SKU Sunset Criteria

**Purpose:** When do we kill a SKU? Catalog hygiene — the catalog will accumulate dead SKUs over years unless we have explicit retirement rules.
**Owner:** Daniel
**Last reviewed:** 2026-05-16

> A SKU that hasn't sold a copy in 12 months but still appears in nurture emails, bundle math, affiliate assets, and the catalog page is *worse* than no SKU at all — it makes the catalog look bloated and hurts conversion on the SKUs that do work.

---

## Sunset triggers (ANY ONE = SKU enters sunset review)

1. **Zero sales in trailing 12 months** AND the SKU has been live > 6 months.
2. **Conversion rate < 0.5%** (visitors → buyers on the product page) for 90 consecutive days, despite being indexed on Google.
3. **Refund rate > 25%** in trailing 6 months (something is fundamentally broken — fix or kill).
4. **Underlying data is stale** and cannot be refreshed without a major rebuild (e.g., a tax form changed and the workbook can't be patched in <8 hours).
5. **A newer SKU replaces it** (cannibalization — e.g., bundle update made the standalone obsolete).
6. **Reviews trend ≤ 3.5 stars** in trailing 90 days.

---

## Sunset review (60-day window)

When a SKU triggers any criterion above, it enters a 60-day review window. Run these checks before deciding kill vs save:

### Check 1: Is the SKU still findable?
- Search Google Search Console for the SKU's primary keyword.
- If the SKU page has dropped out of top-50 ranking → traffic problem, not product problem. Consider SEO refresh.

### Check 2: Is the price wrong?
- Compare to similar Etsy listings — if our $27 SKU competes against $17 alternatives, price-test before killing.

### Check 3: Is the listing the problem?
- Re-shoot hero images, re-write the product description, replace the demo screenshots. A/B for 30 days.

### Check 4: Is the funnel broken?
- Check that the SKU appears in the right bundle, the right email sequences, the right cross-sell mapper rules.

### Check 5: Is the SKU actually loved by the customers who bought it?
- Pull NPS / review data. If 5/5 from existing buyers but no traffic, it's a discoverability fix.
- If 3/5 with complaints about a specific tab/feature, fix or sunset.

---

## Kill decision (after 60-day review)

**Kill the SKU if:**
- Two or more sunset triggers fired AND
- The check pass identified no fixable root cause AND
- Estimated rebuild effort > $X (= 8 hours of build time given current operator hour-rate)

**Save the SKU if:**
- One or more checks identified a fix worth attempting AND
- The fix can be made in < 4 hours of build time AND
- The SKU has historical revenue evidence that justifies the rebuild

---

## Kill execution (the 7-day playbook)

When killing a SKU:

### Day 0 — Soft sunset
- [ ] Mark `discontinued: true` in `infrastructure/influencersoft/products.yaml` (don't delete — preserves order history)
- [ ] Remove from active bundle rules in `infrastructure/influencersoft/products.yaml` (`bundle_eligible_for: []`)
- [ ] Remove from upcoming email broadcasts in `copy/email-sequences/`
- [ ] Add a 301 redirect from the SKU page → the replacement SKU (or category page if no replacement)

### Day 1–3 — Channel cleanup
- [ ] Unpublish from Etsy (mark as inactive — don't delete to preserve review history)
- [ ] Unpublish from Gumroad (move to draft)
- [ ] Remove Stripe Price → set Product.active = false (keep Product to preserve order history)
- [ ] Update affiliate asset pack — remove banners + swipe copy for this SKU
- [ ] Update nurture sequences if any pitch this SKU (search-and-replace in `copy/email-sequences/`)

### Day 4–7 — Existing customer handling
- [ ] Continue serving existing customer downloads for **5 years** from purchase date (digital-products obligation; don't break old URLs)
- [ ] Move the asset files from `templates/_delivery/<SKU>/` to `templates/_delivery/_archive/<SKU>/` so they're still served but clearly archived
- [ ] If the SKU was in a bundle, ensure bundle download still works (rebuild the bundle zip without this SKU; old bundle buyers keep getting old zip via their old URL)

### Day 7+ — Post-mortem
- [ ] Write a short retrospective in `ops/sku-retrospectives/<SKU>.md` — what failed, what we'd do differently
- [ ] Tag the failure in `ops/decisions.ndjson` for future SKU-launch reference

---

## Resurrection rule

A killed SKU can be resurrected only if:
1. The original failure mode has changed (e.g., tax form updated, audience grew, new platform launched), AND
2. A specific reason exists to believe demand has returned, AND
3. The rebuild is treated as a new SKU (= new SKU code in the next available slot, not the old code) to avoid confusion in old order data.

---

## Catalog-level kill caps (the "burn down" rule)

To prevent overzealous pruning:
- **Maximum 5 SKUs killed per quarter**, OR
- **Maximum 10% of active catalog killed in any 12-month rolling window**, whichever is lower.

If you're pruning more than that, the issue isn't the SKUs — it's the launch criteria. Tighten new-SKU gates instead.

---

## Annual catalog audit (every January 15)

Each January:
1. Run the trailing-12-month sales report for every SKU.
2. Apply the sunset triggers above.
3. Schedule the 60-day review window for any triggered SKU.
4. Update this document with any criteria that need adjustment based on the year's data.

---

## Related files

- `infrastructure/influencersoft/products.yaml` — the product registry (mark `discontinued: true` here)
- `ops/sku-retrospectives/` — TO-CREATE: post-mortem folder for killed SKUs
- `ops/decisions.ndjson` — append a row when a SKU is killed (so we don't forget the reasoning)
- `templates/_delivery/_archive/` — TO-CREATE: archived assets folder
