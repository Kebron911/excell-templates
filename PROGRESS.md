# The STR Ledger — Master Progress Tracker

> **Read first.** This is the single performance list for the entire empire — templates, storefronts, marketing, infrastructure, products. Mark items `[x]` as you complete them. Sections are ordered **first-payment first**, then expanding outward.
>
> **Last reviewed:** 2026-05-05 (Phase 6 fully closed — 65/65 SKUs + Etsy copy + product-page copy. Manifest 327/327 green. **Lifecycle email layer complete** — all 5 sequences drafted: post-purchase-etsy-buyer, review-request, refund-recovery, win-back, abandoned-cart + 5 bundle cross-sell sequences. Pending: IS-import shape conversion + load to Influencersoft.)
> **Source-of-truth audits:** SKU completeness (see "Catalog audit" §P4), workspace audit (Sections P0–P3 below).
> **Companion docs:**
> - Master strategy → [docs/superpowers/specs/2026-04-22-str-tax-platform-design.md](docs/superpowers/specs/2026-04-22-str-tax-platform-design.md)
> - Launch design → [docs/superpowers/specs/2026-04-22-first-5-etsy-products-design.md](docs/superpowers/specs/2026-04-22-first-5-etsy-products-design.md)
> - Daniel's manual queue → [ops/user-manual-todo.md](ops/user-manual-todo.md)
> - Claude's automation queue → [ops/automation-queue.md](ops/automation-queue.md)

---

## Legend

- `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked
- 🚦 = gate (don't pass without sign-off)
- 🔥 = first-payment critical path
- 💰 = revenue-impacting

---

## P0 — FIRST PAYMENT (Launch Wave 1) 🔥

> **Goal:** First Etsy sale within 7 days of P0 kickoff. Three Wave-1 SKUs live: GST-001, OPS-001, TAX-001. Master spec §12 milestone: "Week 2: Etsy revenue > $0."

### P0.0 — Deployment foundation 🔥

> **Goal:** Wave 1 ships into a working funnel, not a leaky one. Email actually delivers, the post-purchase sequence actually fires, the legal pack is live, and there's a kill switch + alert wired before order #1. **Everything in this section blocks G4.**

**Email plumbing** — so `hello@thestrledger.com` actually delivers

- [ ] DNS records written via Hostinger DNS (manual): MX (Google Workspace), SPF, DKIM (Workspace key), DMARC (`p=quarantine; rua=mailto:postmaster@thestrledger.com`), A/CNAME for root + `www`
- [ ] Mail-tester.com score ≥ 9/10 from `hello@thestrledger.com`
- [ ] Test send lands in Gmail / Outlook / iCloud inboxes (not spam)
- [ ] 🚦 "email plumbing green"

**Influencersoft staged before Wave 1** — without this, post-purchase (W23) fires into a void from order #1

- [ ] Influencersoft instance live (pulled forward from P3.1)
- [ ] Tag dictionary, products.yaml, forms.yaml imported (P2.0 deliverables)
- [ ] Welcome-book magnet + post-purchase Etsy buyer + refund-recovery sequences loaded
- [ ] End-to-end test: secondary-account purchase → W01 writes tags → IS Day 0 email arrives
- [ ] Fallback if IS isn't ready by G4: documented manual-send checklist for first 14 days → `ops/manual-post-purchase-fallback.md`
- [ ] 🚦 "post-purchase funnel live OR manual fallback signed off"

**Payment + tax plumbing**

- [ ] Stripe Tax enabled, statement descriptor "STR LEDGER" set
- [ ] Home-state sales-tax registration confirmed, OR "no nexus yet, monitor threshold" decision logged → `ops/sales-tax-posture.md`
- [ ] Etsy tax handling reviewed — confirm marketplace-facilitator coverage by state, document gaps
- [ ] Restricted Stripe keys generated for IS + n8n (separate keys per integration)
- [ ] 🚦 "tax posture documented"

**Legal pack** — live before any capture or purchase

- [ ] Terms of Service drafted + published at `thestrledger.com/terms` (placeholder static page acceptable pre-P3)
- [ ] Privacy Policy at `/privacy` — covers IS, Stripe, Etsy, analytics, email list (GDPR/CCPA basics)
- [ ] Refund Policy at `/refunds` — matches Etsy shop policy + own-site stance
- [ ] Cookie/consent notice on any page that fires Plausible/GA (Plausible is cookieless — confirm)
- [ ] All three docs linked from Etsy shop About + IS form footers
- [ ] 🚦 "legal pack live"

**Analytics + attribution**

- [ ] Plausible (or GA4) installed on `thestrledger.com` and lead-magnet pages — pulled forward from P3.1
- [ ] UTM convention documented → `ops/utm-conventions.md` (Etsy, A13 PDF, Pinterest, FB, email)
- [ ] A13 buyer-PDF upgrade links carry `?utm_source=etsy&utm_medium=companion-pdf&utm_campaign=<sku>`
- [ ] First-touch + last-touch attribution captured to Airtable via W01
- [ ] 🚦 "analytics green"

**Secrets + env-var inventory**

- [ ] Master inventory written → `infrastructure/secrets-inventory.md` — every required secret, owner, rotation policy, Vaultwarden item ID, consuming workflow
- [ ] Required at minimum: `STRIPE_KEY`, `STRIPE_WEBHOOK_SECRET`, `IS_API_KEY`, `IS_BASE_URL`, `ETSY_OAUTH_CLIENT_ID`, `ETSY_OAUTH_SECRET`, `ETSY_REFRESH_TOKEN`, `CF_API_TOKEN`, `GUMROAD_TOKEN`, `AIRTABLE_PAT`, `GHOST_ADMIN_KEY`, `WORKSPACE_SMTP_*`
- [ ] Quarterly rotation reminder on calendar
- [ ] 🚦 "secrets inventory complete"

**Backup before any customer data exists**

- [ ] Daily IS contact + sequence-state export → encrypted Google Drive bucket
- [ ] Daily Airtable base export → encrypted Google Drive bucket
- [ ] Weekly Vaultwarden export ritual on calendar (Sunday)
- [ ] Restore drill: pick one IS export + one Airtable export, verify they restore on a scratch instance
- [ ] 🚦 "backups verified" — must clear before P2 captures any email

**Monitoring + alerting wired before G4**

- [ ] Refund-rate alert (Stripe + Etsy) — fires on any single SKU > 5% rolling 7-day → email `hello@` + ops channel
- [ ] n8n error channel — every workflow's Error Trigger posts to a single ops channel
- [ ] IS webhook failure alert — any non-2xx response logged + alerted
- [ ] Daily 5-min ops check pre-loaded as recurring calendar event for first 28 days
- [ ] Synthetic health check: "purchase test SKU → email arrives in 60s" runs hourly via n8n
- [ ] 🚦 "monitoring + alerts green"

**Customer-support readiness**

- [ ] `hello@thestrledger.com` autoresponder live: "We respond within 1 business day. For order issues include your Etsy order #."
- [ ] Gmail triage rules: filter `[Etsy]` → label "etsy-orders"; `[Stripe]` → "stripe-orders"; subject "refund" → "refunds-priority"
- [ ] Canned replies drafted: file-not-opening (Excel/Sheets), refund request, license question, update request → `copy/support/canned-replies.md`
- [ ] Refund SLA: respond within 24h, refund within 48h, log refund reason to Airtable
- [ ] 🚦 "support inbox ready"

**P0.0 gate**

- [ ] 🚦 **Gate G0 — Deployment foundation green** ⇒ unlocks P0.6 publish (G4)

### P0.1 — Manual account / regulatory unlocks (Daniel only)

These block everything downstream. Order doesn't matter inside this group, but all must clear before the shop can publish.

- [ ] **Etsy seller account opened** — `hello@thestrledger.com`, bank+tax submitted, 2FA on, dev API app registered (client ID + OAuth secret in Vaultwarden) — [user-manual-todo.md §1.1](ops/user-manual-todo.md)
- [ ] **Stripe account confirmed** — bank, tax ID, 2FA on authenticator, restricted CLI key generated → Vaultwarden — [§1.2](ops/user-manual-todo.md)
- [ ] **Domain `thestrledger.com` confirmed** at Hostinger; DNS managed via hPanel; hPanel login → Vaultwarden — [§1.5](ops/user-manual-todo.md)
- [ ] **Google Workspace** signed up; `hello@thestrledger.com` primary inbox; 2FA on — [§1.5](ops/user-manual-todo.md)
- [ ] **Gumroad account opened** — bank+tax+2FA, API token → Vaultwarden — [§1.3](ops/user-manual-todo.md)
- [ ] 🚦 **Signal "Etsy account open + API app registered"** — unlocks Etsy listing API publish

### P0.2 — Brand asset pack (A4) 🔥

Most of the pack now renders programmatically from canonical SVGs in `design-system/assets/` via [brand/_render_assets.py](brand/_render_assets.py) (Playwright headless Chromium). Re-run any time the SVGs change.

- [x] Logo square — PNG ([transparent](brand/assets/logo-square-transparent.png), [navy bg](brand/assets/logo-square-navy-bg.png), [outline](brand/assets/logo-square-outline.png))
- [x] Logo horizontal — PNG ([parchment](brand/assets/logo-horizontal-parchment-bg.png), [navy](brand/assets/logo-horizontal-navy-bg.png))
- [x] [Etsy banner 1600×213 PNG](brand/assets/etsy-banner-1600x213.png)
- [x] [Etsy shop icon 500×500 PNG](brand/assets/etsy-shop-icon-500.png)
- [x] [Excel cover header 1000×400 PNG](brand/assets/excel-cover-1000x400.png)
- [x] Favicons 16/32/48/64/180/192/512 PNG + multi-size ICO
- [x] **[Thumbnail master 2000×2000](brand/assets/thumbnail-master-2000x2000.png)** — full 6-zone composition per [canva-specs.md §Asset 3](brand/canva-specs.md). Parametric — per-SKU thumbnails generated by the same script via [brand/thumbnail_configs.py](brand/thumbnail_configs.py).
- [x] **Hero thumbnail (#1) for all 22 catalog SKUs** — rendered to `templates/_delivery/<sku>/thumb-1.png` from `LAUNCH_WAVE` + `PHASE_2` + `TAX_BLOCK` configs.
- [x] **Includes-card thumbnail (#5) for all 22 catalog SKUs** (2026-05-04) — rendered to `templates/_delivery/<sku>/thumb-5.png`. Reuses the same renderer with an `includes` parameter that swaps Zone 3 from ledger mockup → Clay Rose card with 6 checkmark bullets per SKU. Per-SKU bullet copy in `INCLUDES_CARDS` dict in [thumbnail_configs.py](brand/thumbnail_configs.py).
- [x] **Pre-commit hook + manifest check** — [.git/hooks/pre-commit](#) runs [templates/_build/manifest_check.py](templates/_build/manifest_check.py) on any commit touching `templates/_masters/`, `templates/_delivery/`, `templates/_build/`, or `brand/`. Verifies DEMO + BLANK xlsx open cleanly, license PDFs carry the correct SKU code (pypdf text extract), howto PDFs are valid, hero thumbnails are valid PNGs. **Latest run: 112/112 checks pass.**
- [ ] Daniel visual sign-off on rendered assets ⇒ 🚦 **"brand assets approved"**
- [ ] (Optional polish) Daniel re-renders logo + banner in Vista Create if Cormorant Garamond rendering on Windows (Georgia fallback) needs upgrading

> Programmatic path used Playwright/Chromium with system fonts. If Cormorant Garamond is not installed locally the SVGs fall back to Georgia. The rendered samples look on-brand at typical Etsy display sizes; for print/web hi-fi use Vista Create later.

### P0.3 — Wave 1 SKU finishing (3 SKUs, Day 7 target)

Each SKU needs all 5 launch artifacts present and QA'd. Status reflects the 2026-05-03 audit.

**Build-time gate (applies to every SKU before publish):**

- [ ] xlsx integrity smoke test added to `templates/_build/` — opens each DEMO + BLANK, validates expected sheet names, runs full recalc, fails build on any `#REF!` / `#NAME?` / `#VALUE!` / `#DIV/0!` in non-input cells
- [ ] All 3 Wave-1 SKUs pass the smoke test on a clean rebuild
- [ ] 🚦 "xlsx integrity green: GST-001, OPS-001, TAX-001"

#### GST-001 — Welcome Book ($17 Etsy) 💰
Brief ✓ · DEMO ✓ · BLANK ✓ · howto ✓ · license ✓ · thumbnails-spec ✓ · sample-output PDF ✓ · etsy-copy ✓ · product-page ✓
- [x] [Hero thumbnail PNG](templates/_delivery/GST-001-welcome-book/thumb-1.png) — generated programmatically
- [ ] ⚠️ Replace generic ledger mockup with Welcome Book Sheet 1 preview (Daniel via Vista Create) — current mockup is on-brand but content-mismatched
- [x] Includes-card thumbnail (#5) rendered programmatically — `templates/_delivery/GST-001-welcome-book/thumb-5.png`. Thumbs 2/3/4 remain Vista Create work per [thumbnails.md spec](templates/_delivery/GST-001-welcome-book/thumbnails.md) — optional for first publish, recommended before launch
- [x] [Product-page copy drafted](copy/product-pages/GST-001-welcome-book.md) — H1 "Stop emailing guests Google Docs.", bundle cross-sell to First-Year Host
- [ ] Daniel hands-on QA in Excel 2016+ Win + Excel 365 Mac + Google Sheets import
- [ ] 🚦 Signal "QA passed: GST-001"
- [ ] 🚦 Signal "thumbnails approved: GST-001"

#### OPS-001 — Cleaner Turnover Checklist ($12 Etsy) 💰
Brief ✓ · DEMO ✓ · BLANK ✓ · howto ✓ · license ✓ · thumbnails-spec ✓ · etsy-copy ✓ · product-page ✓
- [x] [Hero thumbnail PNG](templates/_delivery/OPS-001-turnover-checklist/thumb-1.png) — publishable as-is
- [x] Includes-card thumbnail (#5) rendered programmatically — `thumb-5.png` in delivery folder. Thumbs 2/3/4 remain Vista Create work (Daniel; optional for first publish)
- [x] [Product-page copy drafted](copy/product-pages/OPS-001-turnover-checklist.md) — H1 "Turnover chaos has a spreadsheet.", Operator Bundle + First-Year Host cross-sells
- [ ] Daniel hands-on QA × 3 platforms
- [ ] 🚦 "QA passed: OPS-001" · "thumbnails approved: OPS-001"

#### TAX-001 — STR Mileage Log ($17 Etsy) 💰
Brief ✓ · DEMO ✓ · BLANK ✓ · howto ✓ · license ✓ · thumbnails-spec ✓ · etsy-copy ✓ · product-page ✓
- [x] [Hero thumbnail PNG](templates/_delivery/TAX-001-mileage-log/thumb-1.png) — publishable as-is
- [x] Includes-card thumbnail (#5) rendered programmatically — `thumb-5.png` in delivery folder. Thumbs 2/3/4 remain Vista Create work (Daniel; optional for first publish)
- [x] [Product-page copy drafted](copy/product-pages/TAX-001-mileage-log.md) — H1 "The deduction your CPA wishes you'd tracked.", Tax Season + First-Year Host cross-sells
- [ ] Verify IRS standard mileage rate cited matches current year
- [ ] Daniel hands-on QA × 3 platforms
- [ ] 🚦 "QA passed: TAX-001" · "thumbnails approved: TAX-001"

### P0.4 — Shared launch artifacts

- [x] [**A13 buyer companion PDF**](templates/_delivery/_shared/etsy-upgrade-insert.pdf) — Letter-size single-page, navy CTA block + scannable QR to `thestrledger.com/47`, secondary upgrade-ladder paragraph, gold accents on-brand. Re-runnable via [_build_etsy_companion.py](templates/_delivery/_shared/_build_etsy_companion.py). Attach as file #2 on every Etsy listing once the shop is live.
- [x] [**Shared license PDF**](templates/_delivery/_shared/license.pdf) — generic version. **Per-SKU branded license PDFs** rendered for all 22 catalog SKUs (launch + Phase-2 + TAX block) at `templates/_delivery/<sku>/<sku>-license.pdf`. Single-page Letter, navy/parchment/gold, parameterized by SKU code + name. Renderer: [_build_delivery_pdfs.py](templates/_delivery/_shared/_build_delivery_pdfs.py).
- [x] **Howto PDFs** — branded howto rendered for **all 22 catalog SKUs** (launch 5 + Phase-2 + TAX block, including the 10 howto.md files written 2026-05-04: ACQ-001/002/003, FIN-001, MKT-001, REV-001, STR-001, TAX-011/012/013). Brand strip header, navy serif headings, gold accent, refund callout. Renderer: [_build_delivery_pdfs.py](templates/_delivery/_shared/_build_delivery_pdfs.py).
- [ ] **Etsy shop About + Policies pasted live** ([copy/etsy-listings/shop-about.md](copy/etsy-listings/shop-about.md), [shop-policies.md](copy/etsy-listings/shop-policies.md) already drafted)
- [ ] **Shop announcement banner text** pasted in Etsy
- [x] [**File-delivery manifest check script**](templates/_build/manifest_check.py) — verifies every catalog SKU has DEMO + BLANK xlsx, license PDF (with correct SKU code embedded), howto PDF, and hero thumbnail; verifies shared A13 + generic license. Each PDF text-extracted via pypdf to catch the "wrong-SKU file copied to wrong folder" trap. Exit 0 on green, 1 on any failure (CI/pre-commit ready). **Latest run 2026-05-04: 112/112 checks pass across 22 SKUs.**
- [x] 🚦 "manifest check green: GST-001, OPS-001, TAX-001" — full catalog green
- [ ] **Test purchase** from secondary Etsy account on GST-001 — confirm 5 files download, open in Excel, upgrade CTA visible, email arrives
- [ ] 🚦 "test purchase pass"

### P0.5 — Marketing readiness for first payment 💰

> **Goal:** Wave 1 publishes into seeded demand, not into the void. Etsy weights review velocity in the first 30 days — without seed reviews and a launch-day broadcast, the listings sink under cheaper competitors. Pixels go in BEFORE first traffic so retargeting audiences populate from order #1.
>
> **G3 is a SOFT gate (strongly recommended).** Only two items in P0.5 are hard prerequisites for G4: (a) **"retargeting pixels live"** — otherwise pre-launch traffic is permanently lost as a retargeting audience, (b) **"launch broadcast queued"** — otherwise Day 0 happens in silence. Everything else in P0.5 is high-leverage but ships best-effort and can land in the days after G4 if it would otherwise block launch.

**Pricing + positioning**

- [ ] Competitor scan run (eRank or manual) → `ops/etsy-competitor-scan.md` — 5 closest competitors per Wave-1 SKU with price, review count, thumbnail style, top tags
- [ ] Price-ladder decision logged → `copy/positioning/price-ladder.md` — where each SKU sits ($12 / $17 / $17), why this beats the cheap end of Etsy, differentiation one-liner used in title + thumbnail
- [ ] 🚦 "pricing + positioning locked"

**Brand-level positioning + persona messaging** — anchors every headline, ad, email opening line; without it, copy is per-SKU but never per-buyer

- [ ] Brand wedge doc → `copy/positioning/brand-wedge.md` — one paragraph: who we serve, what we believe, why we exist (the thing that's not per-SKU; drives every brand-level surface)
- [ ] Persona messaging matrix → `copy/positioning/persona-matrix.md` — for each of Sam (new host) / Sarah (multi-prop host) / Pam (property manager): top fear, top desire, primary objection, headline tone, proof-point preference, price sensitivity
- [ ] Per-SKU copy persona-tagged so future variants (Etsy listing tests, ad creative, email subject lines) can be A/B'd by persona
- [ ] 🚦 "brand + persona positioning locked"

**Founding-buyer + review seeding** — Etsy ranks brand-new shops by review velocity

- [ ] ⚠️ **Etsy ToS check BEFORE any founding-buyer DM goes out.** Etsy can detect and penalize incentivized reviews. Intended flow: free copy via private Gumroad link (NOT a free Etsy purchase) + ask for an *honest* review only — never "in exchange for a 5-star review." Confirm current rules at [etsy.com/legal/sellers/](https://www.etsy.com/legal/sellers/) and document the verified stance → `ops/etsy-review-tos-check.md`. If ToS now prohibits any form of seeded-review tactic, drop it and rely on Promoted Listings + organic launch broadcast instead.
- [ ] Founding-buyer list assembled — 10–20 hosts from Daniel's network who get free GST-001 in exchange for honest Etsy review + 1-paragraph testimonial
- [ ] Outreach DM template → `copy/outreach/founding-buyer-dm.md`
- [ ] Distribution mechanism: private Gumroad link (NOT free Etsy listing — preserves Etsy review credibility)
- [ ] Goal: 5 reviews on GST-001 within 14 days of publish
- [ ] 🚦 "5 founding-buyer reviews queued or live"

**Review-request automation**

- [ ] W-review workflow drafted — fires Day 7 post-purchase, asks for Etsy review (no incentive — within ToS), routes any < 4-star reply to `hello@` instead of Etsy
- [ ] Etsy Convo template for manual review request until W-review ships
- [ ] Negative-feedback intercept tag (`at-risk:<sku>`) wired to ops alert

**Retargeting pixels — install BEFORE first paid dollar**

- [ ] Meta Pixel + Pinterest Tag installed on `thestrledger.com`, lead-magnet pages, Stripe success page
- [ ] Custom Audiences created: `visited-no-optin` · `visited-product-no-purchase` · `purchased-wave-1`
- [ ] Verify audiences populating after 48h
- [ ] 🚦 "retargeting pixels live"

**Conversion benchmarks** — without targets, you can't see underperformance

- [ ] Targets logged → `ops/conversion-benchmarks.md`: Etsy CTR ≥ 1% · Etsy CVR ≥ 2.5% by D30 · lead-magnet opt-in ≥ 25% · email open ≥ 40% (welcome) / ≥ 25% (nurture) · refund ≤ 5% (already in P0.0)
- [ ] D7 / D30 / D90 review cadence on calendar

**Conversion assets — shared across product pages**

- [ ] Comparison table → `copy/product-pages/_shared/comparison-table.md` — "STR Ledger vs. free template vs. QuickBooks vs. paying CPA"; embed on every product page
- [ ] FAQ block (top 5 objections) → `copy/product-pages/_shared/faq.md`; per-SKU overrides where needed
- [ ] Money-back guarantee badge above the fold on every product page + Etsy listing first paragraph
- [ ] Trust row: Stripe-secured · instant-download · Excel + Sheets compatible
- [ ] Etsy listing video script template → `copy/etsy-listings/_shared/video-script-template.md` (30s walkthrough; 1 per Wave-1 SKU within 30 days of launch — soft-required for G4, hard-required by D30)

**Launch-day broadcast queued**

- [ ] Daniel's existing-audience list compiled — FB friends, LinkedIn 1st-degree, personal email, prior-business contacts
- [ ] Day-zero copy drafted (FB / LinkedIn / email versions) → `copy/launch/day-zero-broadcast.md`
- [ ] Founding-buyer DMs scheduled to send within 24h of G4
- [ ] Soft-launch post drafted for STR Facebook groups (where self-promo allowed; own group from P5.2 + 1 with mod permission)
- [ ] 🚦 "launch broadcast queued"

**Etsy Promoted Listings — starter budget**

- [ ] Promoted Listings drafted: $5/day starting budget on all 3 Wave-1 SKUs
- [ ] Activate within 24h of G4 (Etsy boosts paid placement for new shops)
- [ ] Day-7 review: pause SKUs with CVR < 1.5% or CPC > $0.50
- [ ] 🚦 "promoted listings ready to activate at G4"

**Etsy Star Seller path operationalized**

- [ ] Star Seller SLAs on calendar: respond < 24h · dispatch < 24h (verify digital instant-dispatch counts) · ≥ 4.8 rating · ≥ 95% on-time
- [ ] Etsy shop dashboard pinned in daily ops view
- [ ] Target: Star Seller within 90 days of launch

**P0.5 gate**

- [ ] 🚦 **Gate G3 — Marketing readiness green (SOFT / recommended).** Hard prerequisites for G4 from this section are only "retargeting pixels live" + "launch broadcast queued"; the remainder of P0.5 ships best-effort and may land within 7 days post-G4 without blocking launch.

### P0.6 — Wave 1 publish + Day-0 launch motion (Gate G4)

> The first 24h of an Etsy listing's life sets its 30-day algorithmic ranking — front-load activity. Items below G4 are publish-prep; items after G4 execute within 24h of going live.

- [ ] **Rollback runbook written** → `ops/runbooks/rollback-etsy-listing.md` — covers (a) deactivate listing via Etsy API, (b) pause IS sequence for affected SKU, (c) replace file via Etsy API, (d) email-buyers-of-broken-version flow. One page.
- [ ] Dry-run the rollback on a draft listing before G4
- [ ] Upload GST-001 listing via Etsy API: 5 thumbs + 13 tags + 5 attached files (master xlsx, A13 PDF, license PDF, how-to PDF, preview PDF)
- [ ] Upload OPS-001 listing (same format)
- [ ] Upload TAX-001 listing (same format)
- [ ] First-hour post-launch verification: synthetic health check green, error channel quiet, autoresponder firing on test inbound — per `agent-skills:shipping-and-launch` post-launch checklist
- [ ] 🚦 **Gate G4 — Wave 1 LIVE on Etsy** ⇒ first-payment unlocked

**Day-0 motion (within 24h of G4) — executes the queued P0.5 prep**

- [ ] Send launch broadcast (FB / LinkedIn / personal email)
- [ ] Send founding-buyer DMs with private Gumroad link + Etsy review request
- [ ] Activate Etsy Promoted Listings on all 3 Wave-1 SKUs
- [ ] Soft-launch post in 1–2 STR Facebook groups
- [ ] Day-1 vital signs check: Etsy view counts > 0, Promoted CPC sane, no error-channel pings, autoresponder firing on inbounds
- [ ] 🚦 "Day 0 motion complete"

---

## P1 — WAVE 2 (Day 14, 2 more SKUs)

### P1.1 — TAX-003 — 1099-NEC Tracker ($17 Etsy)
Brief ✓ · DEMO ✓ · BLANK ✓ · howto ✓ · license ✓ · etsy-copy ✓ · product-page ✓
- [x] [Hero thumbnail PNG](templates/_delivery/TAX-003-1099-nec-tracker/thumb-1.png)
- [x] Includes-card thumbnail (#5) rendered programmatically. Thumbs 2/3/4 remain Vista Create
- [x] [Product-page copy drafted](copy/product-pages/TAX-003-1099-nec-tracker.md) — H1 "The $600 threshold, tracked automatically.", Pub 1220 penalty math, Tax Season + First-Year Host cross-sells
- [ ] Verify $600 threshold flag + YTD totals + data validation
- [ ] 🚦 "QA passed: TAX-003" · "thumbnails approved: TAX-003"

### P1.2 — TAX-002 — Single-Property P&L Tracker ($27 Etsy / $47 Gumroad) 💰
Brief ✓ · DEMO ✓ · BLANK ✓ · howto ✓ · license ✓ · etsy-copy ✓ · product-page ✓

> **2026-05-03 — Scope revision.** Dropped the "Lite" framing — "Lite" + tax product = refund magnet. Renamed to "Single-Property P&L Tracker" (no qualifier). Added a built-in **Depreciation tab** (straight-line 27.5-yr residential rental, mid-month convention) so Schedule E Line 20 auto-fills. One canonical workbook, served by both storefronts at different price points; no separate Lite file. See [updated brief](templates/_briefs/TAX-002-pl-single-property.md) §"Single-property scope".

- [x] **Depreciation tab built** — 8th tab in the workbook, auto-fills Schedule E Line 20 ([build_pl_single_property.py](templates/_build/build_pl_single_property.py))
- [x] **DEMO + BLANK rebuilt** with Depreciation tab + revised welcome banner copy
- [x] [Etsy listing copy drafted](copy/etsy-listings/TAX-002-pl-single-property.md) — title 109/140, 13 tags, Schedule E + depreciation as dual anchors, no "Lite" framing
- [x] [Thumbnail spec updated](templates/_delivery/TAX-002-pl-single-property/thumbnails.md) — dropped Lite labels, added Depreciation-built-in image #4, 8-tab includes card
- [x] [Hero thumbnail PNG](templates/_delivery/TAX-002-pl-single-property/thumb-1.png)
- [x] Includes-card thumbnail (#5) rendered programmatically. Thumbs 2/3/4 remain Vista Create (per revised spec)
- [x] [Product-page copy drafted](copy/product-pages/TAX-002-pl-single-property.md) — H1 "Close your year before April does.", $11.8K/yr depreciation math, dual-pricing rationale, Tax Season + Portfolio Master upgrade cross-sells
- [ ] Daniel hands-on QA × 3 platforms — verify depreciation math: in-service-year proration, full-year subsequent years, prior-accumulated override behavior
- [ ] 🚦 "QA passed: TAX-002" · "thumbnails approved: TAX-002" · "copy approved: TAX-002"

### P1.3 — Wave 2 publish + storefront finishing

- [ ] **A12 — SEO pass on all 5 listings** (title ≤140 chars, 13 tags harvested from Etsy search-suggest)
- [ ] Upload TAX-002 + TAX-003 to Etsy
- [ ] **A14 — Gumroad mirror all 5** (same files as Etsy, different price points where applicable)
- [ ] 🚦 **Gate G7 — Wave 2 LIVE + A13 bundled + Gumroad mirror live**

---

## P2 — LEAD CAPTURE + EMAIL (Week 2-3)

> Drafted content is heavy here — execution is the gap.

### P2.0 — Influencersoft prep pack (no creds required) 💰

> Local-file scaffolding so that when Daniel hands over IS credentials, populating IS is a copy-paste / API-import job — not a fresh design exercise. Also defines the contract n8n workflows W01–W08 + W18 + W22 + W23 must honor. Build target: `infrastructure/influencersoft/`.

- [ ] **Tag dictionary** → `infrastructure/influencersoft/tag-dictionary.md` — single source of truth for every IS tag (`product:<sku>`, `persona:<sam|sarah|pam>`, `acquired:<date>`, `customer:course`, `course:<tier>`, `magnet:<x>`, `source:<x>`, `refunded:<date>`, `update-available:<sku>`, `FB Group member`). Audits all 12 IS-touching workflows so nothing fires on a tag no one writes. **Load-bearing — do this first.**
- [ ] **Product spec** → `infrastructure/influencersoft/products.yaml` — IS checkout-product definition for the 5 Wave-1 SKUs (name, price, file URL, success page, tags-on-purchase). Mirrors Airtable Products → trivial W05 import later.
- [ ] **Forms spec** → `infrastructure/influencersoft/forms.yaml` — 4 opt-in forms (welcome-book magnet, 47-deductions, entity-flowchart, etsy-buyer companion) with fields, success URL, tags-on-submit, sequence-to-trigger.
- [ ] **Sequences — convert 3 drafted to IS-import shape** → `infrastructure/influencersoft/sequences/` — split each `.md` draft into per-email rows of `subject / preview / body / send-trigger / send-delay / next-step tag`:
  - [ ] welcome-book-magnet (Day 0–21)
  - [ ] nurture-hero-magnet (47-deductions)
  - [ ] launch-12-templates
- [x] **Sequences — draft 2 missing** (referenced by workflows but no copy):
  - [x] [post-purchase Etsy buyer 10-email sequence](copy/email-sequences/post-purchase-etsy-buyer.md) (W23 fires this; master spec §5.x) — Day 0/2/5/9/14/21/30/40/50/60 with Liquid-style branching by purchased_sku
  - [x] [refund-recovery sequence](copy/email-sequences/refund-recovery.md) (W28 reply intake) — 2 emails Day 1 + Day 7, no discount, learning-oriented
- [ ] **n8n IS-contract audit** — pass over W01, W02, W03, W04, W05, W06, W07, W08, W18, W22, W23 JSON: confirm IS API endpoints stubbed, replace any hardcoded tag literals with references to the tag dictionary, document required env vars (`IS_API_KEY`, `IS_BASE_URL`).
- [ ] 🚦 "IS prep pack ready" — unlocks Daniel to provision IS credentials with confidence the contract is locked.

### P2.1 — Hero magnet: 47 Airbnb tax deductions list

- [x] [**Starter draft of all 47 entries**](templates/_briefs/hero-magnet.md) (Claude-drafted, awaiting Daniel's tax-accuracy verification) — categorized into Operating / Marketing-platform / Professional services / Travel & vehicle / Depreciation / Advanced moves; each with Schedule E line, IRS reference, typical $ range, and "frequently missed because" framing. **20 items have `⚠ verify` flags** that Daniel must resolve before publish (bonus depreciation %, §179 cap, mileage rate, Augusta rule structure, QBI safe harbor, etc.)
- [x] [**Canonical data file**](templates/_delivery/_shared/deductions_47_data.py) — single source-of-truth for both PDF + Excel. 47 entries × 8 fields. Daniel edits here once, both renderers re-run.
- [x] [**Branded PDF rendered**](templates/_delivery/_shared/47-airbnb-tax-deductions.pdf) — multi-page Letter, navy cover + intro + 6 section pages + closing CTA. Renderer: [_build_47_deductions_pdf.py](templates/_delivery/_shared/_build_47_deductions_pdf.py)
- [x] [**Companion Excel checklist built**](templates/_delivery/_shared/47-airbnb-tax-deductions-checklist.xlsx) — About + Checklist tabs, 47 entry rows, "Captured? Y/N" dropdown, YTD $ roll-up, verify-flag count, green conditional formatting on Yes. Renderer: [_build_47_deductions_xlsx.py](templates/_delivery/_shared/_build_47_deductions_xlsx.py)
- [ ] **Daniel tax-accuracy review** — verify every IRS code citation against current-year publications (Pub 527, 463, 535, 946, 587), resolve all `⚠ verify` flags, update bonus-depreciation % for current tax year, confirm §195 startup-cost handling, sign off. After review, re-run both renderers.
- [ ] Host PDF + Excel on `thestrledger.com/47-deductions` opt-in landing
- [ ] 🚦 "47 deductions ready"

### P2.2 — Email sequences deploy (requires IS credentials)

Drafted: [copy/email-sequences/welcome-book-magnet.md](copy/email-sequences/welcome-book-magnet.md), [nurture-hero-magnet.md](copy/email-sequences/nurture-hero-magnet.md), [launch-12-templates.md](copy/email-sequences/launch-12-templates.md). Import-shaped versions land via P2.0.

- [ ] Influencersoft account live + API path surveyed → `signal "IS integration path = <api|zapier|playwright|manual>"`
- [ ] IS credentials in Vaultwarden (`IS_API_KEY`, admin login, base URL)
- [ ] Tag dictionary (P2.0) imported as IS tag library
- [ ] 5 Wave-1 products imported from `products.yaml` into IS catalog
- [ ] 4 opt-in forms imported from `forms.yaml`
- [ ] Welcome-book magnet sequence (Day 0–21) loaded into IS
- [ ] Hero-magnet (47 deductions) nurture loaded
- [ ] Launch-12-templates broadcast scheduled
- [ ] Post-purchase Etsy buyer sequence loaded (10 emails, fires on `customer:etsy` tag)
- [ ] Refund-recovery sequence loaded (fires on `refunded:<date>` tag)
- [ ] Test sequence end-to-end: opt-in → Day 0 lands in inbox → Day 21 closer fires
- [ ] Test purchase → tag write from W01 → IS sequence triggers correctly
- [ ] 🚦 "email sequence approved"

### P2.3 — Lead magnets — secondary

- [ ] Entity-decision-flowchart magnet → render PDF from [copy/lead-magnets/entity-decision-flowchart.md](copy/lead-magnets/entity-decision-flowchart.md)

---

## P3 — OWN-SITE LAUNCH (Week 3-4)

### P3.1 — Site infrastructure

> Email plumbing, IS instance, and analytics already moved to P0.0 — by the time P3 starts they are already running. This section is the rest of the own-site stack.

- [ ] **VPS provisioned** (Hetzner CX22 / DO Basic, Ubuntu 24.04) → [user-manual-todo §1.6](ops/user-manual-todo.md)
- [ ] Ansible hardening + Docker + Caddy reverse proxy on VPS applied (automation queue C1–C4)
- [ ] Vaultwarden running, credentials imported via `bw` CLI
- [ ] Migrate Influencersoft instance from staging into production own-site (if it landed elsewhere in P0.0)
- [ ] **Ghost(Pro)** blog at `blog.thestrledger.com`, Admin API key → Vaultwarden

### P3.2 — Site content (already drafted)

Web UI kit at [design-system/ui_kits/web/](design-system/ui_kits/web/) has 11 HTML templates (landing, 9 product pages, tax-bundle landing, blog).

- [ ] Home page deployed (hero + 5 SKUs grid + lead-magnet CTA)
- [ ] 12 product pages deployed (the ones with copy already drafted)
- [ ] Tax-bundle landing live
- [ ] Lead-magnet opt-in pages live (47 deductions, entity flowchart, etsy-buyer)

### P3.3 — Blog launch (3 posts ready)

- [ ] [01-airbnb-tax-deductions](copy/blog-posts/) live on Ghost
- [ ] [02-schedule-e](copy/blog-posts/) live
- [ ] [03-depreciation](copy/blog-posts/) live
- [ ] Tax-accuracy review + disclaimer added to each ("not tax advice, consult CPA")
- [ ] 🚦 "blog post N approved" × 3
- [ ] Blog → IS opt-in form embedded

### P3.4 — Own-site checkout optimization 💰

> Once Stripe checkout is live on `thestrledger.com`, the highest-ROI marketing moves happen at the checkout page itself. Order bumps and abandoned-cart recovery routinely add 10–20% to AOV and 5–10% to CVR. Etsy doesn't permit any of this — own-site is where it lives.

- [ ] **Order bump** on Stripe checkout — when buyer adds a Wave-1 SKU, offer the most-attached add-on at 30–50% off as a one-click checkbox before pay (e.g., GST-001 buyer sees Mileage Log for $7; TAX-001 buyer sees Cleaning Checklist for $5)
- [ ] **Post-purchase one-time offer (OTO)** — Stripe success page presents bundle upgrade ("add 4 more SKUs and save 40%") with a 15-minute countdown; declines cannot return
- [x] **Abandoned-cart sequence drafted** → [copy/email-sequences/abandoned-cart.md](copy/email-sequences/abandoned-cart.md) — Stripe webhook on `checkout.session.expired` / `incomplete` → 3-email IS sequence: 1h friction-finder · 24h use-case-branched pitch (Liquid by SKU prefix) · 72h last-note. **No discount** — own-site discounting trains abandon-then-rebuy behavior. Daniel can override with coupon ladder later if recovery rate < 10%.
- [ ] **Cart capture on email** — collect email at first checkout step (before payment) so abandoned-cart sequence has a recipient even when the card isn't entered
- [ ] **Express checkout** enabled in Stripe (Apple Pay / Google Pay / Link) — typically +3–5% CVR on mobile; one config toggle
- [ ] **Trust badges + money-back guarantee** above the pay button — verify P0.5 assets render on the actual Stripe checkout page (or its hosted alternative)
- [ ] 🚦 "checkout optimization live"

---

## P4 — CATALOG EXPANSION — remaining 60 SKUs

> Ordered by phase per master strategy. After first-payment proves the funnel, work the catalog out from highest-conversion tiers. **At the 100-order checkpoint, re-rank P4.1 priority using NPS open-text + cross-sell signal from P5.5** — the catalog should follow demand, not the original plan.

### P4.1 — Phase 2 priority SKUs (next 7, Month 2)

These already have briefs + DEMO + BLANK. **Hero thumbnails landed 2026-05-04** ([thumbnail_configs.py](brand/thumbnail_configs.py) `PHASE_2`). Each still needs: Etsy copy (where missing), product-page copy (where missing), listing HTML wired, thumbnails 2-5, delivery folder, Gumroad mirror.

| SKU | Status | Hero thumb | Gap |
|---|---|---|---|
| ACQ-001 STR Deal Analyzer | brief+xlsx+etsy✓ | [✓](templates/_delivery/ACQ-001-str-deal-analyzer/thumb-1.png) | + product-page, thumbs 2-5, delivery, mirror |
| ACQ-002 Cost-to-launch | brief+xlsx+etsy✓ | [✓](templates/_delivery/ACQ-002-cost-to-launch/thumb-1.png) | + product-page, thumbs 2-5, delivery, mirror |
| ACQ-003 Rental Arbitrage Analyzer | brief+xlsx+etsy+pp✓ | [✓](templates/_delivery/ACQ-003-rental-arbitrage-analyzer/thumb-1.png) | + thumbs 2-5, delivery, mirror |
| FIN-001 RevPAR Dashboard | brief+xlsx+pp✓ (own-site only — N/A on Etsy per brief) | [✓](templates/_delivery/FIN-001-revpar-dashboard/thumb-1.png) | + thumbs 2-5, delivery, own-site publish |
| MKT-001 Listing SEO Audit | brief+xlsx+etsy+pp✓ | [✓](templates/_delivery/MKT-001-listing-seo-audit/thumb-1.png) | + thumbs 2-5, delivery, mirror |
| OPS-001 Turnover Checklist | (Wave 1) | — | — |
| REV-001 Cleaning Fee Optimizer | brief+xlsx+etsy+pp✓ | [✓](templates/_delivery/REV-001-cleaning-fee-optimizer/thumb-1.png) | + thumbs 2-5, delivery, mirror |
| STR-001 Escape-the-W2 Planner | brief+xlsx+etsy+pp✓ | [✓](templates/_delivery/STR-001-escape-the-w2-planner/thumb-1.png) | + thumbs 2-5, delivery, mirror |

For each: tick when shipped:
- [ ] ACQ-001 published Etsy + Gumroad
- [ ] ACQ-002 published Etsy + Gumroad
- [ ] ACQ-003 published Etsy + Gumroad
- [ ] FIN-001 published Etsy + Gumroad
- [ ] MKT-001 published Etsy + Gumroad
- [ ] REV-001 published Etsy + Gumroad
- [ ] STR-001 published Etsy + Gumroad

### P4.2 — TAX block expansion (TAX-004 → TAX-013, Month 2-3)

All 10 have brief + DEMO + BLANK + delivery folder + listing HTML. **Hero thumbnails + Etsy listing copy + product-page copy landed 2026-05-04** for the 9 Etsy-eligible SKUs (TAX-011 is own-site only). License PDFs rendered for all 10. Howto PDFs rendered for TAX-004..010 (TAX-011/012/013 still need source howto.md). Gap: thumbs 2-5, Etsy/Gumroad publish.

> **Lite framing flagged on TAX-004 + TAX-010** — same refund-magnet concern as TAX-002. Both Etsy listings + product pages written *without* "Lite" framing; positioned as complete year-end tools with the own-site upgrade as scope expansion. Daniel sign-off needed.

- [ ] TAX-004 Schedule E Tax Prep — [hero ✓](templates/_delivery/TAX-004-schedule-e-tax-prep/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-004-schedule-e-tax-prep.md) · [pp ✓](copy/product-pages/TAX-004-schedule-e-tax-prep.md) · published
- [ ] TAX-005 Quarterly Estimated Tax — [hero ✓](templates/_delivery/TAX-005-quarterly-estimated-tax/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-005-quarterly-estimated-tax.md) · [pp ✓](copy/product-pages/TAX-005-quarterly-estimated-tax.md) · published
- [ ] TAX-006 Home Office Allocator — [hero ✓](templates/_delivery/TAX-006-home-office-allocator/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-006-home-office-allocator.md) · [pp ✓](copy/product-pages/TAX-006-home-office-allocator.md) · published
- [ ] TAX-007 Per Diem Meal Tracker — [hero ✓](templates/_delivery/TAX-007-per-diem-meal-tracker/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-007-per-diem-meal-tracker.md) · [pp ✓](copy/product-pages/TAX-007-per-diem-meal-tracker.md) · published
- [ ] TAX-008 Self-Employment Tax — [hero ✓](templates/_delivery/TAX-008-self-employment-tax/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-008-self-employment-tax.md) · [pp ✓](copy/product-pages/TAX-008-self-employment-tax.md) · published
- [ ] TAX-009 Section 179 Planner — [hero ✓](templates/_delivery/TAX-009-section-179-planner/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-009-section-179-planner.md) · [pp ✓](copy/product-pages/TAX-009-section-179-planner.md) · published
- [ ] TAX-010 Cost Segregation DIY — [hero ✓](templates/_delivery/TAX-010-cost-segregation-diy/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-010-cost-segregation-diy.md) · [pp ✓](copy/product-pages/TAX-010-cost-segregation-diy.md) · published
- [ ] TAX-011 Multi-Property Master P&L — [hero ✓](templates/_delivery/TAX-011-multi-property-master-pl/thumb-1.png) · own-site only (no Etsy listing, premium tier per brief)
- [ ] TAX-012 Schedule C Tax Prep — [hero ✓](templates/_delivery/TAX-012-schedule-c-tax-prep/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-012-schedule-c-tax-prep.md) · [pp ✓](copy/product-pages/TAX-012-schedule-c-tax-prep.md) · published
- [ ] TAX-013 Depreciation Tracker — [hero ✓](templates/_delivery/TAX-013-depreciation-tracker/thumb-1.png) · [etsy ✓](copy/etsy-listings/TAX-013-depreciation-tracker.md) · [pp ✓](copy/product-pages/TAX-013-depreciation-tracker.md) · published

### P4.2.5 — Phase 3 catalog expansion (10 SKUs, 2026-05-04)

Extended the publishable footprint from 22 → **32 SKUs**. Each SKU has hero thumbnail (#1) + includes-card thumbnail (#5) + license PDF + howto PDF + howto.md source. Manifest check 162/162 green.

Etsy listing copy + product-page copy still pending for these (creative lift — separate session). OPS-002 + OPS-003 are own-site only per their briefs (premium tier where stripped versions would be dangerous).

- [ ] ACQ-004 3-Property Side-by-Side — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/ACQ-004-3-property-side-by-side.md) · [pp ✓](copy/product-pages/ACQ-004-3-property-side-by-side.md) · published
- [ ] ACQ-005 AirDNA Data Integrator — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/ACQ-005-airdna-data-integrator.md) · [pp ✓](copy/product-pages/ACQ-005-airdna-data-integrator.md) · published
- [ ] ACQ-006 Rehab Budget + ROI — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/ACQ-006-rehab-budget-roi.md) · [pp ✓](copy/product-pages/ACQ-006-rehab-budget-roi.md) · published
- [ ] ACQ-007 Furniture Setup Budget — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/ACQ-007-furniture-setup-budget.md) · [pp ✓](copy/product-pages/ACQ-007-furniture-setup-budget.md) · published
- [ ] ACQ-008 5-Year Pro Forma — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/ACQ-008-5-year-pro-forma.md) · [pp ✓](copy/product-pages/ACQ-008-5-year-pro-forma.md) · published
- [ ] OPS-002 Damage Claim + AirCover Log — hero ✓ · includes ✓ · howto ✓ · own-site only · [pp ✓](copy/product-pages/OPS-002-damage-claim-aircover-log.md) · published
- [ ] OPS-003 License/Permit Tracker — hero ✓ · includes ✓ · howto ✓ · own-site only · [pp ✓](copy/product-pages/OPS-003-license-permit-tracker.md) · published
- [ ] OPS-004 Cleaning Cost per Turnover — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/OPS-004-cleaning-cost-per-turnover.md) · [pp ✓](copy/product-pages/OPS-004-cleaning-cost-per-turnover.md) · published
- [ ] OPS-005 Supply Inventory + Par-Level — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/OPS-005-supply-inventory-par-level.md) · [pp ✓](copy/product-pages/OPS-005-supply-inventory-par-level.md) · published
- [ ] LGL-001 STR License Renewal Calendar — hero ✓ · includes ✓ · howto ✓ · [etsy ✓](copy/etsy-listings/LGL-001-str-license-renewal-calendar.md) · [pp ✓](copy/product-pages/LGL-001-str-license-renewal-calendar.md) · published

### P4.2.6 — Phase 4 catalog expansion (10 SKUs, 2026-05-04)

Catalog now **42 SKUs at full Claude-shippable artifact level** (briefs + xlsx + hero thumbnail + includes-card thumbnail + license PDF + howto PDF + howto.md). Manifest 212/212 green.

Etsy listing copy + product-page copy still pending for these (creative lift — separate session).

- [ ] FIN-003 12-Month Cash Flow Forecaster — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] FIN-004 DSCR Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] FIN-005 YoY P&L Comparison — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] GST-002 House Rules Builder — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] GST-003 Pet Policy Document — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] REV-002 Dynamic Pricing Calculator — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] REV-003 Competitor Rate Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] REV-004 Min-Night-Stay Optimizer — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] MKT-002 Review Response Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] MKT-003 Referral + Repeat Guest CRM — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published

### P4.2.7 — Phase 5 catalog expansion (10 SKUs, 2026-05-05)

Catalog now **52 SKUs at full Claude-shippable artifact level** (briefs + xlsx + hero thumbnail + includes-card thumbnail + license PDF + howto PDF + howto.md). Manifest **262/262 green**.

Etsy listing copy + product-page copy still pending for these (creative lift — separate session). PAM-001 is own-site only per its brief.

- [ ] ACQ-009 BRRRR-to-STR Refi Math — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] ACQ-010 Seller-Finance Offer Calculator — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] ACQ-011 1031 Exchange Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] LGL-002 TOT Filing Calendar — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] OPS-006 Maintenance Log + Vendor CRM — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] PAM-001 Owner Reporting Dashboard — hero ✓ · includes ✓ · howto ✓ · own-site only · pp ✓ · published
- [ ] PAM-002 Cleaner CRM + Payroll — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] REV-005 Holiday + Event Pricing Calendar — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] STR-002 Portfolio Valuation Model — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] STR-003 Refi-or-Sell Decision Matrix — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published

### P4.2.8 — Phase 6 catalog expansion — FULL CATALOG CLOSED (13 SKUs, 2026-05-05) 🎉

**Catalog now 65/65 SKUs at full Claude-shippable artifact level.** Manifest **327/327 green**.

Etsy listing copy + product-page copy still pending for these 13 SKUs (separate session).

**Notable: FIN-002 build-script refactor.** Original `build_break_even_occupancy.py` shipped a single `.xlsx`. Refactored to the DEMO+BLANK pattern matching the rest of the catalog — `_val(variant, value)` helper plumbed through all 21 input cells, `main()` now loops both variants. Legacy single file removed.

- [ ] ACQ-012 STR vs LTR Yield Comparison — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] FIN-002 Break-Even Occupancy — hero ✓ · includes ✓ · howto ✓ · DEMO+BLANK ✓ · etsy ✓ · pp ✓ · published
- [ ] FIN-006 Multi-Entity Consolidated P&L — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] FIN-007 Partnership Distribution Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] LGL-003 Guest Screening + Ban List — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] LGL-004 Insurance Claim Log — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] OPS-007 Utility Usage + Trend Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] OPS-008 Insurance Policy Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] PAM-003 Commission / Split Calculator — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] PAM-004 Multi-Owner Consolidated Reporting — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] REV-006 Pricing Tool ROI Comparison — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] SPC-001 Glamping / Unique-Stay P&L — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published
- [ ] SPC-002 Corporate Housing / Travel-Nurse Tracker — hero ✓ · includes ✓ · howto ✓ · etsy ✓ · pp ✓ · published

### P4.3 — Full catalog state (closed 2026-05-05)

**65/65 SKUs at thumbnail + license + howto + brief + xlsx level.** Manifest 327/327 green. Pre-commit hook gates any future regressions.

Per-SKU remaining work for the 13 Phase-6 SKUs: Etsy copy ▢ · product-page copy ▢ · thumbs 2/3/4 ▢ · Etsy publish ▢ · Gumroad mirror ▢.

**Earlier waves' Etsy copy + product-page status:** all 52 SKUs from Waves 1-5 have Etsy listing copy (where Etsy-eligible) + product-page copy. Phase 6 is the last bucket needing this.

- [ ] **One-off P0 fix:** FIN-002 Break-Even Occupancy — only `break-even-occupancy.xlsx` exists; produce DEMO + BLANK pair to match the rest of the catalog
- [ ] **`_lite/` decision pending** — 4 lite xlsx files (ACQ-001, MKT-001, REV-001, STR-001) are referenced as file #1 in their current Etsy listings, with explicit Lite vs Full positioning in description bodies (~30-50 lines/listing). **Recommendation: keep**. The TAX-002 Lite-rename was tax-specific (refund-magnet because filing wrong taxes is high-stakes). Non-tax SKUs — deal analyzer, SEO audit, cleaning fee, life planner — don't carry the same refund risk; existing listings already honest-disclose "~70% of the value." Daniel's call.
- [ ] (P4.3 detail expanded into per-SKU rows once P4.1/P4.2 ship)

### P4.4 — Bundles (2026-05-05)

[copy/bundle-strategy.md](copy/bundle-strategy.md) defines 5 bundles; pricing locked. **Etsy listings + landing pages drafted 2026-05-05.**

| Bundle | Price | À la carte | Save | Etsy listing | Landing page |
|---|---:|---:|---|---|---|
| **First-Year Host** (4 SKUs: ACQ-001/002, OPS-003, FIN-002) | $97 | $138 | 30% | [✓](copy/etsy-listings/bundles/BUNDLE-01-first-year-host.md) | [✓](copy/product-pages/bundles/BUNDLE-01-first-year-host.md) |
| **Aspiring Host** (4 SKUs: STR-001, ACQ-001/002/003) | $97 | $168 | 42% | [✓](copy/etsy-listings/bundles/BUNDLE-02-aspiring-host.md) | [✓](copy/product-pages/bundles/BUNDLE-02-aspiring-host.md) |
| **Year-2 Operator** (4 SKUs: FIN-001, REV-001, MKT-001, OPS-002) | $147 | $188 | 22% | [✓](copy/etsy-listings/bundles/BUNDLE-03-year-2-operator.md) | [✓](copy/product-pages/bundles/BUNDLE-03-year-2-operator.md) |
| **Portfolio** (14 SKUs incl. TAX-011 + 4 prior catalog) | $397 | ~$610 | 35% | own-site only | [✓](copy/product-pages/bundles/BUNDLE-04-portfolio.md) |
| **Pro Manager** (7 SKUs incl. PAM-001 B2B) | $497 launch / $797 future | $529 | 6% (rises to ~5% at $797) | own-site only | [✓](copy/product-pages/bundles/BUNDLE-05-pro-manager.md) |

- [x] All 5 bundle landing pages drafted (own-site)
- [x] 3 bundle Etsy listings drafted (First-Year, Aspiring, Year-2 Operator — Portfolio + Pro Manager are own-site only by tier)
- [x] **Bundle delivery automation built** — [_build_bundles.py](templates/_delivery/_bundles/_build_bundles.py) + [bundles_config.py](templates/_delivery/_bundles/bundles_config.py). Per bundle: BLANK ZIP + DEMO ZIP + merged howto PDF (concatenated per-SKU howtos via pypdf) + branded README PDF (Playwright pipeline). All 5 bundles built; manifest check extended to verify bundle artifacts. **Manifest check now 347/347 green** (65 SKUs + 5 bundles + shared).
- [ ] Bundle SKU creation in Etsy / Gumroad (Daniel — needs accounts)
- [ ] Bundle landing pages deployed to thestrledger.com
- [x] **Bundle cross-sell email sequences drafted** — 5 sequences in [copy/email-sequences/bundles/](copy/email-sequences/bundles/), one per bundle. Each triggers post-purchase of an individual SKU in that bundle, runs 3-4 emails over 10-14 days, applies the customer's prior-purchase $ as credit toward the bundle. Tag-suppression rules prevent overlap with higher-tier bundles. Target conversions: 8-25% depending on bundle.
- [ ] Bundle email sequences imported to Influencersoft (Daniel — needs IS account)
- [ ] Bundle cross-sell links wired into individual SKU listings + welcome book content

---

## P5 — TRAFFIC + COMMUNITY (Week 3 onward)

### P5.0 — Etsy growth levers

> Etsy-native moves that compound from Day 0. Most are zero-cost; Promoted Listings is the only paid lever and is bounded by P0.5.

- [ ] Etsy SEO research → `ops/etsy-seo-research.md` (eRank or manual: keyword volume + competition for each Wave-1 SKU; informs A12 SEO pass in P1.3)
- [ ] Shop promo calendar → `ops/etsy-promo-calendar.md` — launch-week 15% off; weekly Sunday flash sale; tax-season push (Jan–Apr); summer-host push (May–Aug)
- [ ] Coupon ladder: first-time buyer 10% · email-list-only 15% · bundle-buyer 25%
- [ ] Reviews target curve: 5 by D14 · 20 by D60 · 50 by D90 (drives shop trust + ranking)
- [ ] Etsy Convo abandoned-cart nudge — verify ToS allows, otherwise drop
- [ ] 🚦 "Etsy growth levers configured"

### P5.1 — Pinterest

- [ ] Pinterest Business account + 2FA + OAuth to Creasquare
- [ ] Domain claim TXT record live (Hostinger DNS (manual))
- [ ] First 30 pins rendered from [pin-catalog-first-30.md](copy/pinterest/pin-catalog-first-30.md) + 12 SKU catalogs in [design-system/visual-briefs/pinterest/](design-system/visual-briefs/pinterest/)
- [ ] 🚦 "pins 1–10 approved" / "pins 11–20" / "pins 21–30"
- [ ] Pins scheduled via Creasquare
- [ ] A/B test running per [ops/pinterest-ab-test.md](ops/pinterest-ab-test.md)

### P5.2 — FB group

- [ ] FB Page created + 2FA
- [ ] FB Group created with entry questions per [copy/fb-group/launch-plan.md](copy/fb-group/launch-plan.md)
- [ ] Pinned welcome post live
- [ ] Weekly cadence posts pre-drafted in Creasquare
- [ ] First 90 days: human live presence (comments/replies)

### P5.3 — Other social (lower priority)

- [ ] Instagram Business linked to FB Page
- [ ] LinkedIn Company Page
- [ ] YouTube channel
- [ ] TikTok business

### P5.4 — Content engine activation

- [ ] First Source Topic chosen → master deck built per [_atomization/](copy/_atomization/) templates
- [ ] 11-platform atomization run (deck → blog → Pinterest → email → FB → IG → LI → YT short → TikTok → Twitter → newsletter)
- [ ] Weekly cadence locked per [docs/runbooks/weekly-content-atomization.md](docs/runbooks/weekly-content-atomization.md)

### P5.5 — Retention & lifecycle

> Acquisition sequences (welcome, hero-magnet, post-purchase) ship in P2.2. This section is the rest of the lifecycle — repeat-purchase, win-back, voice-of-customer.

- [x] **Win-back sequence** → [copy/email-sequences/win-back.md](copy/email-sequences/win-back.md) — 60d no-open trigger, 3-email re-engagement over 21d, sunset at end for deliverability protection
- [ ] **Cross-sell sequence** — D14 post-purchase → "hosts who bought <X> also use <Y>" with bundle-discount coupon (uses P5.0 coupon ladder) — partially covered by 5 bundle cross-sell sequences in `copy/email-sequences/bundles/`
- [x] **Review-request sequence** → [copy/email-sequences/review-request.md](copy/email-sequences/review-request.md) — 2-email Etsy review ask (Day 7 + Day 14); ToS-compliant (no incentive, negative-feedback redirect to `hello@` first); also serves own-site testimonial ask
- [ ] **NPS / feedback survey** at D30 post-purchase — 1-question NPS + open text "what would you build next?" → answers feed P4 catalog priority
- [ ] **Cohort dashboard** in Airtable — cohort by acquisition month → repeat-purchase rate, LTV by source (Etsy / own-site / Pinterest)
- [ ] **Founding-buyer 90-day check-in** — hand-written follow-up to first 20 reviewers → builds testimonial bench for own-site
- [ ] **Testimonial collection loop** — D14 post-purchase email asks one question ("what's the one thing this saved you time on?"); replies routed to `copy/testimonials/<sku>/` with permission flag; approved testimonials syndicate to product pages + Etsy listing first paragraph + ad creative library
- [ ] **Customer interview cadence** — Daniel runs a 30-min call with 5 buyers in Month 1, 10 in Month 3, 20 in Month 6 → notes feed `copy/research/customer-interviews/` and refresh the persona-matrix (P0.5) + P4 catalog priority quarterly

### P5.6 — Paid acquisition (Month 2+)

> Don't spend on cold traffic until organic CVR is known. **Decision rule: only paid-test a SKU once organic CVR ≥ 2%.** Otherwise you're paying to discover the listing is broken.

- [ ] **Unit-economics dashboard** → `ops/unit-economics.md` — per-channel: CAC (ad spend ÷ new customers), LTV (avg revenue per customer over 90 / 180 / 365 days), payback period, gross margin (after Etsy/Stripe/Gumroad fees). **Hard rule: no sustained paid spend on a channel without LTV:CAC ≥ 3:1 over 30 days.**
- [ ] **Channel-margin doc** → `ops/channel-margin.md` — Etsy keeps ~6.5% + listing + transaction fees; Stripe ~3%; Gumroad ~10% — informs which channel to push and which products to skew toward (high-margin SKUs go on own-site first)
- [ ] Budget cap + ROAS target → `ops/paid-budget.md` (start: $200/mo cap, target ROAS 3.0)
- [ ] Meta retargeting — 7-day window for "visited product page, no purchase"; creative pulls comparison-table snippet from P0.5
- [ ] Pinterest paid amplification — boost top-3 organic pins after 30-day baseline established
- [ ] Google Search Ads on bottom-of-funnel intent ("airbnb tax deduction template", "str mileage log excel")
- [ ] Promoted Listings tuning at 100-order checkpoint (top performers up, bottom paused)
- [ ] D30 / D60 / D90 paid review on calendar

### P5.7 — Partnerships, PR, affiliates (Month 2+)

> Highest-leverage marketing for niche SaaS-style products. STR niche is dense with podcasts, newsletters, and mid-tier coaches with engaged audiences and no products of their own to plug — high willingness to promote.

- [ ] STR podcast outreach list (10 shows) → guest-pitch template + free Wave-1 template offer for the host → `copy/outreach/podcast-pitch.md`
- [ ] STR newsletter sponsorship research (BiggerPockets, Hosts on Mission, etc.) → CPM, audience size, cost ranges → `ops/newsletter-sponsorship-targets.md`
- [ ] Affiliate program design → `infrastructure/affiliate-program/spec.md` — own-site only, 30% commission, 60-day cookie, payout via Stripe Connect
- [ ] Founding affiliates list — 10 STR coaches/influencers seeded with free Vault tier in exchange for promotion
- [ ] PR / launch announcement plan → r/AirBnBHosts, r/realestateinvesting, BiggerPockets forums, niche Slack/Discord communities (where self-promo permitted)
- [ ] **Customer referral program** (distinct from affiliates) → `infrastructure/referral-program/spec.md` — existing buyers get 20% off next purchase + give friend 20% off; tracked via unique IS link/code; payout = store credit (cheaper than cash, drives repeat)
- [ ] **Press kit / media one-pager** → `copy/press/media-kit.md` + `brand/assets/press-kit.zip` — founder bio, brand assets, pre-written quotes, screenshot library; one-click for podcast/newsletter pitches and HARO replies
- [ ] **HARO / Qwoted account** signed up; daily-digest filtered for "tax", "Airbnb", "short-term rental", "small business" queries; 1 pitch/week target → free PR placements in finance/real-estate publications
- [ ] **Reddit / forum playbook** → `copy/outreach/reddit-playbook.md` — answer-first cadence (10 helpful posts before any soft mention) in r/AirBnBHosts, r/realestateinvesting, BiggerPockets — avoids ban risk and builds long-tail authority

### P5.8 — Promotional calendar (annual) 💰

> A digital tax/STR business has built-in seasonality. Tax Season alone (Jan–Apr) drives 30–50% of annual revenue in this niche. Mapping the year prevents missed windows and turns "what should we promote this month?" into a settled question.

- [ ] **Annual promo calendar** → `ops/promo-calendar.md` covering:
  - **Tax Season ramp (Jan 1 – Apr 15)** — mileage logs, Schedule E, deductions, P&L; biggest revenue window
  - **Tax Day push (Apr 14–15)** — "extension survival kit" + late-filer bundle promo
  - **Summer host ramp (May 1 – Aug 31)** — cleaning, turnover, dynamic pricing, guest screening
  - **Year-end planning (Nov 1 – Dec 31)** — depreciation, Section 179, Q4 estimated tax, entity planning
  - **Black Friday / Cyber Monday** — 25–30% off bundle promo
  - **Launch anniversary** — founder-discount throwback for existing customers
- [ ] **Customer-milestone celebrations** — 100 / 500 / 1000 buyer announcements (own-site banner + email + social) → pre-drafted templates at `copy/launch/milestones/`
- [ ] **New-SKU launch playbook SOP** → `ops/runbooks/new-sku-launch.md` — repeatable single-page checklist for every Wave 3+ SKU: Etsy publish, Gumroad mirror, segmented email blast, Pinterest pin batch, FB group post, blog backlink, Promoted Listings activation. Replaces re-inventing the playbook on each release.
- [ ] **Email-list segmentation strategy** → `infrastructure/influencersoft/segmentation.md` — beyond persona/source tags, document engaged-vs-cold, behavior-based ("clicked in last 30d"), buyer-of-X-not-Y segments → drives which segments get which seasonal push
- [ ] 🚦 "annual promo calendar approved"

---

## P6 — INFRASTRUCTURE / AUTOMATION (parallel to P3-P5)

> Specs are exhaustive. Execution = ops/automation-queue.md tasks A–E.

### P6.1 — Data SSOT

- [ ] Airtable base built per [infrastructure/airtable/schema.md](infrastructure/airtable/schema.md) (5 tables, 50+ fields, views, formulas)
- [ ] Airtable MCP connected (Claude can read/write)
- [ ] Postgres mirror live (Phase 3)

### P6.2 — n8n workflows (30 drafted)

[infrastructure/n8n/workflows-map.md](infrastructure/n8n/workflows-map.md) lists W01–W30 with JSON + MD specs.

- [ ] n8n instance live at `n8n.thestrledger.com`
- [ ] W01 Order ingestion (Stripe + Gumroad)
- [ ] W02 Course-SKU branching
- [ ] W03–W10 (revenue, alerts, refunds, subscriber sync)
- [ ] W11–W20 (content, social, email triggers)
- [ ] W21–W30 (course delivery, cohort mgmt, ops)

### P6.3 — Backups + DR

> Daily exports + Vaultwarden export ritual already wired in P0.0. This section extends to Postgres + formal DR.

- [ ] Daily Postgres snapshots → Google Drive (encrypted) once Phase-3 mirror is live
- [ ] Annual DR drill scheduled per [docs/runbooks/disaster-recovery.md](docs/runbooks/disaster-recovery.md)
- [ ] **First DR walkthrough completed BEFORE P2 captures any email** — verify Scenario 1 mentally

### P6.4 — Stripe Tax + payment plumbing

> Stripe Tax, statement descriptor, and restricted keys all wired in P0.0.3. This section is the own-site integration test.

- [ ] Test purchase end-to-end: own-site $1 product → Airtable → IS → email fires
- [ ] Stripe Radar rules tuned (block high-risk countries, velocity rules) — review after first 100 orders

---

## P7 — LONG-HAUL PRODUCTS (Month 3+)

> These are fully drafted but un-launched. Big revenue, longest tail.

### P7.1 — Book: "The $50K Deduction" (17 chapters drafted)

[copy/book-50k-deduction/](copy/book-50k-deduction/) — full content + amazon listing copy.

- [ ] Editing pass / professional review
- [ ] Cover design
- [ ] KDP / Amazon listing live
- [ ] Companion landing page on `thestrledger.com/book`
- [ ] Email sequence integration (book buyer → upsell to course)

### P7.2 — Course: "The $50K Deduction" (7 modules + bonuses + cohort playbook drafted)

[copy/course-50k-deduction/](copy/course-50k-deduction/).

- [ ] Record 7 module videos (scripts ready)
- [ ] Deliver 13 bonus assets (templates, checklists)
- [ ] Course platform decision (IS vs Teachable vs Kajabi)
- [ ] Cohort 1 launch (per cohort playbook)
- [ ] Course → bundle upsell (Vault tier)

---

## P8 — POST-LAUNCH MONITORING (always-on once Wave 1 publishes)

> Alerting + daily-check infrastructure wired in P0.0.8. This section is the human-loop ops cadence.

- [ ] Daily 5-min check (first 4 weeks): yesterday's orders, refunds, errors, CVR
- [ ] Weekly view: per-SKU views, CVR, first-sale lag
- [ ] Day 30 retro per [ops/post-launch-tracking.md](ops/post-launch-tracking.md)
- [ ] Day 30 thumbnail-rewrite trigger if CTR < 1% on any SKU

### P8.1 — Product version + update shipping

> First bug-fix release will be ad-hoc unless we wire this. Cheap to set up before there are buyers; expensive to retrofit after.

- [ ] Version field convention added to `_delivery/<sku>/` (`VERSION` file or `<sku>-v1.0.xlsx` filename)
- [ ] Airtable Products table has `current_version` + `last_release_notes` fields
- [ ] **W-update workflow** drafted: when a SKU's version bumps, (a) update Etsy listing files via API, (b) email all prior buyers of that SKU with release notes + updated download link, (c) write `update-shipped:<sku>:<version>` tag in IS
- [ ] Release-notes template → `copy/release-notes/_template.md`
- [ ] Test the full update flow on GST-001 with a dummy v1.0.1 bump before any real version change ships

---

## P9 — OPERATIONS (always-on, post-Wave-1)

> Once Wave 1 ships, the work shifts from "build it" to "run it." This section is the day-to-day discipline — what Daniel does each week to keep the lights on, what triggers a VA hire, what happens when something breaks, and how a 5-SKU catalog stays healthy as it grows toward 65.

### P9.1 — Ops cadence + weekly scoreboard

- [ ] Daily dashboard → `ops/daily-dashboard.md` (or Airtable view): yesterday's orders, refunds, error pings, IS bounces, Etsy convo count, Promoted Listings spend
- [ ] Weekly scoreboard (Mondays) — 7-day revenue per channel, refund rate, CVR per SKU, email open/click, top pin, top SKU
- [ ] Monthly review (1st of month) — P&L, cohort LTV (from P5.5 dashboard), catalog audit re-run, stale-runbook check
- [ ] Quarterly review — strategic re-rank of P4 catalog, paid-channel ROAS check, vendor cost audit
- [ ] Mapped to Daniel's Mon=Money domain rhythm (per CLAUDE.md)

### P9.2 — Financial ops (bookkeeping + tax filing) 💰

> Tax filings come due whether or not the books are in order. Set this up in Month 1 — retrofitting a year of unreconciled payouts is brutal.

- [ ] Business bank account + business credit card opened (separate from personal) → `ops/business-banking.md`
- [ ] Bookkeeping tool decision (Wave Apps free vs. QuickBooks) → live by end of Month 1
- [ ] Monthly close routine: reconcile Stripe + Etsy + Gumroad payouts → bookkeeping → P&L
- [ ] Quarterly estimated tax (Apr 15 / Jun 15 / Sep 15 / Jan 15) — recurring calendar
- [ ] Sales-tax monthly/quarterly remittance in nexus states (per P0.0 sales-tax-posture doc)
- [ ] 1099-K reconciliation from Etsy + Stripe + Gumroad each January
- [ ] Year-end CPA handoff package: trial balance, P&L, balance sheet, 1099s, depreciation schedule
- [ ] CPA relationship established — OR explicit "DIY for Year 1" decision logged

### P9.3 — Vendor + tool inventory

- [ ] Master vendor inventory → `ops/vendor-inventory.md` with columns: vendor, account email, plan, billing date, cost/mo, annual cost, replaceability (1–5), contract end
- [ ] Covers at minimum: Etsy / Stripe / Gumroad fees (variable), Influencersoft, Hostinger, Hetzner-or-DO, Ghost(Pro), n8n hosting, Google Workspace, Plausible, Creasquare, eRank, Vaultwarden host
- [ ] Annual roll-up + monthly burn computed (single number Daniel knows by heart)
- [ ] Quarterly cost audit on calendar — kill anything not earning its keep
- [ ] Renewal-date Airtable view with 30-day-out alert

### P9.4 — Incident response + upstream status

- [ ] Severity definitions → `ops/incident-severity.md` — Sev1 (revenue down / data loss), Sev2 (degraded), Sev3 (cosmetic)
- [ ] Sev1 runbook: 5-min triage → comms template (`hello@` autoresponder banner + FB group post + email broadcast if widespread) → fix → postmortem within 48h
- [ ] Postmortem template → `ops/runbooks/postmortem-template.md` (what / impact / timeline / root cause / fix / prevention)
- [ ] Incident log (append-only) → `ops/incident-log.md`
- [ ] Upstream status monitors: Etsy / Stripe / Hostinger / IS status feeds → n8n → ops alert channel (so Daniel knows before customers do)
- [ ] Public Statuspage.io page deferred until subscriber base > 1k — decision logged

### P9.5 — SOP / runbook index

- [ ] Central runbook index → `ops/runbooks/README.md` listing every SOP with owner, last reviewed, review cadence
- [ ] All scattered runbooks linked from index (rollback-etsy-listing, manual-post-purchase-fallback, sales-tax-posture, weekly-content-atomization, pinterest-ab-test, disaster-recovery, sku-sunset, postmortem-template, data-rights-request, etsy-review-tos-check, etc.)
- [ ] Quarterly stale-runbook review — anything > 6 months untouched gets a freshness check or deletion

### P9.6 — Privacy & data-rights handling

> P0.0 ships the legal pack (Privacy Policy lives at `/privacy`). This is the operational handling — what happens when an actual EU/CA buyer requests their data.

- [ ] GDPR/CCPA request SOP → `ops/runbooks/data-rights-request.md` covering identity verification, data export (IS + Airtable + Stripe), deletion (IS + Airtable + Stripe + Etsy where permitted + backups), response SLAs (30d GDPR / 45d CCPA)
- [ ] Data inventory → `infrastructure/data-inventory.md` — what PII we hold, where it lives, retention period
- [ ] `privacy@thestrledger.com` (or `hello@` with `[privacy]` filter) routed to labeled Gmail folder with autoresponder
- [ ] Mock walkthrough done once before any EU email is captured

### P9.7 — Backup verification cadence

> P0.0.7 sets up the exports. Verification is what keeps backups from silently rotting — every backup engineer's first lesson.

- [ ] Monthly restore test on calendar — pick one IS export + one Airtable export, restore to scratch instance, log result → `ops/backup-verification-log.md`
- [ ] Quarterly secrets-vault recovery drill — restore Vaultwarden from cold export, verify a critical credential opens its target system
- [ ] Annual full-DR walkthrough (extends P6.3 first walkthrough)

### P9.8 — Catalog hygiene + SKU sunset

- [ ] Kill-SKU criteria → `ops/sku-sunset-criteria.md` — default: < 3 sales by Day 90 = retire (deactivate Etsy listing, remove Gumroad mirror, redirect own-site product page to closest live SKU)
- [ ] SKU sunset SOP → `ops/runbooks/sku-sunset.md` covering buyer notification, file archive, bundle-definition update, IS sequence cleanup
- [ ] Annual catalog audit (re-validate IRS / tax-rate / formula references against current law) — recurring calendar each January
- [ ] Annual thumbnail / copy refresh on all live SKUs (combats Etsy stagnation penalty)

### P9.9 — Capacity, VA hire, and business continuity

> Solo-operator businesses fail when the operator burns out, gets sick, or is unreachable. Cheap to plan; expensive to need and not have.

- [ ] Daniel-time allocation model → `ops/time-allocation.md` — weekly hour budget across catalog / content / support / ops / strategy
- [ ] VA-hire trigger criteria — e.g., support inbox > 1h/day for 2 consecutive weeks OR weekly cadence slipping > 2 weeks in a row
- [ ] First-VA SOP pack scoped: support triage, listing maintenance, social-content scheduling, manual review-request sends
- [ ] Business continuity doc → `ops/business-continuity.md` — Vaultwarden master-password recovery, who-to-notify list, customer-comms template for "operator unreachable", payouts continuation steps
- [ ] Trusted-contact / spousal-access decision logged

---

## Catalog audit snapshot (2026-05-05)

> Refreshed after Phase 6 closeout. Manifest 327/327 green via `python templates/_build/manifest_check.py`.

- **Briefs:** 65/65 ✓
- **DEMO xlsx:** 65/65 ✓ (FIN-002 refactored to DEMO+BLANK pattern 2026-05-05)
- **BLANK xlsx:** 65/65 ✓
- **Hero thumbnail (#1):** 65/65 ✓
- **Includes-card thumbnail (#5):** 65/65 ✓
- **License PDF (per-SKU):** 65/65 ✓
- **Howto PDF (per-SKU):** 65/65 ✓
- **Howto.md source:** 65/65 ✓
- **Etsy listing copy:** 65/65 ✓ (60 with copy + 5 own-site-only by design: FIN-001, OPS-002, OPS-003, PAM-001, TAX-011)
- **Product-page copy:** 65/65 ✓
- **Etsy listing HTML (design-system):** 51/65 *(built, not deployed)*
- **`_delivery/` folders:** 65/65 ✓
- **Shared assets:** A13 buyer companion PDF ✓ + 47-deductions PDF ✓ + 47-deductions Excel checklist ✓ + shared license PDF ✓
- **Bundles (5):** all bundle delivery packages built (BLANK ZIP + DEMO ZIP + merged howto PDF + branded README PDF per bundle) — see [templates/_delivery/_bundles/](templates/_delivery/_bundles/)
- **Manifest check:** **347/347 PASS** (65 SKUs + 5 bundles + shared)

---

## Daily standup (use this section)

**Yesterday:**
**Today:**
**Blockers:**
**Signal phrases sent:**

---

## Changelog of this tracker

- **2026-05-03** — Created from SKU completeness audit + workspace audit. P0–P8 priority structure locked.
- **2026-05-03** — Added P2.0 Influencersoft prep pack (tag dictionary, products.yaml, forms.yaml, sequences in import shape, n8n IS-contract audit) so IS population is a copy-paste job once credentials exist. Expanded P2.2 to spell out per-import deploy steps + 2 missing sequences (post-purchase, refund-recovery).
- **2026-05-03** — Added **P0.0 Deployment foundation** (gate G0): pulled email plumbing + DNS, IS staging, Stripe Tax, legal pack (ToS / Privacy / Refund), analytics + UTM convention, secrets inventory, customer-data backup, monitoring/alerting, and customer-support readiness forward from P3 / P6 so Wave 1 ships into a working funnel instead of a leaky one. Added xlsx integrity smoke test (P0.3), file-delivery manifest check (P0.4), rollback runbook + first-hour verification (P0.6), and product-version / update-shipping pipeline (P8.1). Cleaned up P3.1 / P6.3 / P6.4 to remove items now owned by P0.0. Per deployment-readiness analysis using `agent-skills:shipping-and-launch`.
- **2026-05-03** — Sales/marketing-perspective audit. Added **P0.5 Marketing readiness for first payment** (gate G3): competitor scan + price-ladder, founding-buyer + review seeding, review-request automation (W-review), Meta + Pinterest retargeting pixels, conversion benchmarks (CTR / CVR / opt-in / open targets), shared conversion assets (comparison table / FAQ / guarantee badge / trust row / Etsy video script), launch-day broadcast queue, Etsy Promoted Listings starter, Star Seller path. Existing publish step renumbered to **P0.6** and extended with a Day-0 launch-motion block (broadcast send, founding-buyer DMs, promoted-listings activation) within 24h of G4. New **P5.0 Etsy growth levers** (eRank SEO research, promo calendar, coupon ladder, reviews target curve), **P5.5 Retention & lifecycle** (win-back, cross-sell, NPS, cohort dashboard, founding-buyer 90-day check-in), **P5.6 Paid acquisition (Month 2+)** with organic-CVR gate, **P5.7 Partnerships / PR / affiliates** (podcast outreach, newsletter sponsorship, 30% affiliate program, founding affiliates). P4.1 reprioritization wired to P5.5 voice-of-customer at the 100-order checkpoint.
- **2026-05-03** — Tightened P0.5 to avoid delaying launch: **G3 downgraded to a soft gate**; only "retargeting pixels live" + "launch broadcast queued" are hard prerequisites for G4. Remaining P0.5 items (founding-buyer seeding, comparison assets, Promoted Listings, Star Seller, etc.) ship best-effort and may land within 7 days post-G4. Added an explicit **Etsy ToS verification step** (`ops/etsy-review-tos-check.md`) at the top of the founding-buyer block — must clear before any seeded-review DM goes out, with a documented fallback to drop the tactic if Etsy now prohibits incentivized reviews.
- **2026-05-03** — Operations-perspective audit. Added new top-level section **P9 — OPERATIONS (always-on, post-Wave-1)** with 9 subsections covering the day-to-day discipline a solo operator needs from Month 1 onward: ops cadence + weekly scoreboard (P9.1), financial ops / bookkeeping / tax-filing calendar (P9.2), vendor + tool inventory with cost tracking and renewal alerts (P9.3), incident response + severity definitions + upstream status monitoring (P9.4), central SOP / runbook index (P9.5), GDPR/CCPA operational SOP and data inventory (P9.6), backup *verification* cadence — monthly restore tests and quarterly vault drill (P9.7), catalog hygiene + kill-SKU criteria + annual tax-law re-validation (P9.8), capacity model + VA-hire trigger + business continuity for the single operator (P9.9). Sibling to P8 monitoring; P8 stays scoped to metrics + product version, P9 is the rest of running the business.
- **2026-05-03** — Sales/marketing **second pass** — covered higher-leverage gaps the first pass missed. Added to P0.5: **brand wedge + persona messaging matrix** (Sam/Sarah/Pam) so all copy can be persona-tagged and A/B-tested. New **P3.4 Own-site checkout optimization** (order bump, post-purchase OTO, Stripe abandoned-cart sequence, cart email capture, Apple/Google Pay, trust badges on checkout) — 10–20% AOV / 5–10% CVR levers Etsy can't touch. Added to P5.5: **testimonial collection loop** (D14 ask → product-page + Etsy + ad library) and **customer interview cadence** (5 in M1, 10 in M3, 20 in M6) feeding persona-matrix and P4 priority. Added to P5.6: **unit-economics dashboard** (CAC / LTV / payback / margin) with a hard LTV:CAC ≥ 3:1 rule for sustained paid spend, plus **channel-margin doc** (Etsy/Stripe/Gumroad fee math). Added to P5.7: **customer referral program** distinct from affiliate (20% / 20%, store-credit payout), **press kit + HARO/Qwoted** (free PR channel), **Reddit/forum playbook** (answer-first, 10:1 ratio). New **P5.8 Promotional calendar** anchored to STR seasonality (Tax Season Jan–Apr, Summer host ramp, Year-end planning, BFCM, Tax Day push, anniversary), plus customer-milestone celebrations (100 / 500 / 1000 buyers), repeatable **new-SKU launch playbook** for Wave 3+ SKUs, and email-list segmentation strategy.
- **2026-05-05** — **Lifecycle email layer complete** (drafted, not yet IS-imported). Five new sequences in `copy/email-sequences/`: (1) post-purchase-etsy-buyer (10 emails, Day 0–60, Liquid-branched by purchased_sku, includes Etsy review ask + Schedule E vs C tax trap + bundle hint + newsletter funnel-out); (2) review-request (2 emails, Day 7 + 14, ToS-compliant, negative-feedback redirect to `hello@`); (3) refund-recovery (2 emails, Day 1 + 7, learning-oriented, no discount); (4) win-back (3 emails over 21d, 60d-no-open trigger, sunset at end for deliverability); (5) abandoned-cart (3 emails over 72h, friction-finder → use-case branch → last-note, no discount to avoid abandon-then-rebuy training). Combined with the 5 bundle cross-sell sequences shipped 2026-05-05, total email layer = 10 sequences. Marked `[x]` against P2.0 missing-drafts, P2.2 sequence rows, P3.4 abandoned-cart, P5.5 win-back + review-request. Pending unblock: IS-import shape conversion (P2.0) + load to Influencersoft (P2.2 — Daniel needs IS account first).
