# Daniel — First Payment Checklist

> **Goal of this doc:** the single, sequenced list of every action Daniel must take to land first Etsy sale. Pulled from PROGRESS.md + ops/user-manual-todo.md + per-SKU briefs. Everything below is Daniel-only — Claude has already produced every artifact that doesn't require Daniel's signature, hands-on machine, or external account.
>
> **Definition of done:** first paid Etsy order arrives in the inbox at `hello@thestrledger.com` for one of the 5 Wave-1 launch SKUs (GST-001 / OPS-001 / TAX-001 / TAX-002 / TAX-003).
>
> **Last reviewed:** 2026-05-09
>
> **Single high-level entry point:** [`../LAUNCH.md`](../LAUNCH.md) summarizes this checklist and links each Daniel action to the pre-built implementation Claude will run.
>
> **How to use:** work top-to-bottom. Each step has a "tell Claude" signal phrase — say it in the next session and Claude resumes the corresponding downstream work. Phases below are dependency-ordered; don't skip ahead.

---

## Phase 1 — Account openings (Day 1-3, ~3 hours total)

These block everything else. Order doesn't matter inside this group, but ALL must clear before Etsy can publish a listing.

### [ ] 1.1 — Etsy seller account (45 min)

1. https://www.etsy.com/sell with `hello@thestrledger.com`
2. Shop name: **The STR Ledger** (verify availability via Etsy search first)
3. US / English / USD
4. Submit bank info + tax ID (SSN sole prop OR EIN LLC — your call; sole prop is fine for MVP)
5. Enable 2FA (authenticator app — NOT SMS)
6. Save shop as **"On vacation"** until Claude publishes the first listing
7. Accept Etsy's developer API terms — needed for Claude to publish via API:
   - https://www.etsy.com/developers → register app → note **client ID** + **OAuth secret**
   - Store both in Vaultwarden

→ **Tell Claude:** *"Etsy account open + API app registered."*

### [ ] 1.2 — Stripe account confirmation (10 min)

Stripe account already exists. Just verify regulatory fields:

1. Confirm bank account on file matches the destination for Etsy / Gumroad / IS payouts
2. Confirm tax ID on file is correct for this business
3. Confirm 2FA is on authenticator (NOT SMS — switch if it is)
4. Generate Stripe CLI restricted API key:
   - Stripe dashboard → Developers → API keys → create restricted key with `stripe_cli` scope
   - Add to Vaultwarden

→ **Tell Claude:** *"Stripe confirmed + CLI key added."*

### [ ] 1.3 — Domain + Cloudflare API token (15 min)

1. Cloudflare dashboard → Domain Registration → buy `thestrledger.com` (if not already owned)
2. Add to Vaultwarden
3. Generate Cloudflare API token scoped to `thestrledger.com` zone with `Zone:DNS:Edit` permission
4. Add token to Vaultwarden — Claude writes all DNS records via API after this

→ **Tell Claude:** *"domain + Cloudflare API token added."*

### [ ] 1.4 — Google Workspace ($6/user/mo, 15 min)

1. Sign up for Google Workspace with domain `thestrledger.com`
2. Create `hello@thestrledger.com` as primary inbox
3. Enable 2FA on Google Workspace

→ **Tell Claude:** *"workspace live."*

### [ ] 1.5 — Gumroad account (20 min)

1. https://gumroad.com with `hello@thestrledger.com`
2. Username: `thestrledger` (lowercase)
3. Enable 2FA
4. Submit bank info + tax ID
5. Generate Gumroad API token: Settings → Advanced → Applications → create application → note access token. Add to Vaultwarden.

→ **Tell Claude:** *"Gumroad account open + API token added."*

### [ ] 1.6 — Master 2FA + offline backup (1 hour)

1. For every account opened above + Vaultwarden itself: download/copy the 10-digit recovery codes
2. Save to Vaultwarden AND print a single master sheet
3. Store printed sheet in safe deposit box OR offline USB (NOT in a desk drawer)
4. Master Vaultwarden password — only in your head + ONE printed offline copy in safe deposit. Never digital.

→ **Tell Claude:** *"2FA + offline backups complete."*

---

## Phase 2 — Brand + creative sign-off (Day 4, ~2 hours)

Claude has already produced every brand asset, every listing copy, and every marketing decision document. Phase 2 is review + approve, not produce.

### [ ] 2.1 — Brand asset pack review (30 min)

Open and review every file in [brand/assets/](../brand/assets/):
- 3 logo squares (transparent / navy bg / outline)
- 2 logo horizontals (parchment bg / navy bg)
- Etsy banner (1600×213)
- Etsy shop icon (500×500)
- Excel cover header (1000×400)
- Thumbnail master (2000×2000)
- 7 favicons + 1 ICO

If any asset feels off-brand, re-render in Vista Create using `brand/canva-specs.md` as the spec. Otherwise: approve.

→ **Tell Claude:** *"brand assets approved."*

### [ ] 2.2 — `_lite/` folder decision (10 min)

4 lite xlsx files exist for non-tax SKUs (ACQ-001, MKT-001, REV-001, STR-001). The TAX-002 Lite-rename was tax-specific. Non-tax Lite framing is defensible. Decide:

- **Keep** (Claude's recommendation) — the listings already honest-disclose "~70% of the value"
- **Prune** — rename Etsy SKU to drop "Lite" framing, sell the master file at $27 / $47 instead

→ **Tell Claude:** *"keep lite framing"* OR *"prune lite — drop the framing on ACQ-001/MKT-001/REV-001/STR-001."*

### [ ] 2.3 — TAX-004 + TAX-010 Lite-framing sign-off (10 min)

Etsy listings + product pages for TAX-004 (Schedule E Tax Prep) + TAX-010 (Cost Seg DIY) were drafted *without* "Lite" framing — same refund-magnet concern as TAX-002. Confirm position.

→ **Tell Claude:** *"TAX-004/010 positioned correctly"* OR *"revert to Lite/Full framing on TAX-004/010."*

### [ ] 2.4 — 47 deductions tax-accuracy review (~2 hours, can split across days)

Open [templates/_briefs/hero-magnet.md](../templates/_briefs/hero-magnet.md). 47 entries with **20 marked `⚠ verify`**. Resolve each verify flag against current-year IRS publications:

- IRS Pub 527 (Residential Rental Property)
- IRS Pub 463 (Travel/Gift/Car Expenses)
- IRS Pub 535 (Business Expenses)
- IRS Pub 946 (Depreciation)
- IRS Pub 587 (Home Office)

Most-volatile items: bonus depreciation %, §179 cap, IRS standard mileage rate, Augusta rule structure, QBI safe-harbor specifics.

Edit [templates/_delivery/_shared/deductions_47_data.py](../templates/_delivery/_shared/deductions_47_data.py) directly. Set `verify=False` on resolved items. Then re-run:

```
python templates/_delivery/_shared/_build_47_deductions_pdf.py
python templates/_delivery/_shared/_build_47_deductions_xlsx.py
```

→ **Tell Claude:** *"47 deductions ready."*

---

## Phase 3 — Hands-on QA (Day 5-7, ~3 hours)

The 5 launch SKUs each need to open cleanly on three platforms. Claude can't validate this — you have the actual machines.

### [ ] 3.1 — GST-001 Welcome Book

Open `templates/_masters/GST-001-welcome-book-DEMO.xlsx` on:
- [ ] Excel 2016+ Windows ✓
- [ ] Excel 365 Mac ✓
- [ ] Google Sheets (File → Import → upload) ✓

Verify: formulas evaluate, formatting holds, dropdowns work, brand colors render, spell-check passes labels, extreme values + blanks don't break anything.

→ **Tell Claude:** *"QA passed: GST-001."*

### [ ] 3.2 — OPS-001 Turnover Checklist
Same as 3.1 for OPS-001 DEMO + BLANK.

→ **Tell Claude:** *"QA passed: OPS-001."*

### [ ] 3.3 — TAX-001 Mileage Log
Same as 3.1. **Special:** verify the IRS standard mileage rate cited matches current year (workbook says 70¢/mile for 2026 — re-verify).

→ **Tell Claude:** *"QA passed: TAX-001."*

### [ ] 3.4 — TAX-002 Single-Property P&L Tracker
Same as 3.1. **Special:** verify the new Depreciation tab math:
- In-service-year proration (mid-month convention)
- Full-year depreciation in subsequent years
- Prior-accumulated override behavior

→ **Tell Claude:** *"QA passed: TAX-002."*

### [ ] 3.5 — TAX-003 1099-NEC Tracker
Same as 3.1. **Special:** verify $600 threshold flag fires correctly + YTD totals + dropdown data validation.

→ **Tell Claude:** *"QA passed: TAX-003."*

---

## Phase 4 — Test purchase (Day 8, 30 min)

Before publishing all 5 listings, prove the funnel works on one.

### [ ] 4.1 — Publish GST-001 first (Claude does this via Etsy API)

After 3.1 passes, tell Claude *"publish GST-001."* Claude pushes the listing live with all 5 attached files (DEMO + BLANK xlsx + A13 buyer companion PDF + howto PDF + license PDF) and 13 SEO-targeted tags.

### [ ] 4.2 — Buy GST-001 from a secondary Etsy account

1. Use a friend's account or a separate personal account (not the seller account)
2. Pay $17 ($14 net to you after Etsy fees)
3. Verify on the secondary account:
   - All 5 files download cleanly
   - DEMO + BLANK xlsx open in Excel
   - A13 buyer companion PDF has a working QR code → `thestrledger.com/47`
   - Email arrives at `hello@thestrledger.com` notifying you of the order

### [ ] 4.3 — Refund the test purchase via Etsy

Then refund the secondary account's purchase via Etsy seller dashboard. The Etsy order, file delivery, and email plumbing have been validated.

→ **Tell Claude:** *"test purchase pass."*

---

## Phase 5 — Wave 1 publish (Day 9, ~30 min Claude work)

Once 4.3 passes, tell Claude *"publish Wave 1."* Claude pushes the remaining 2 Wave-1 listings (OPS-001 + TAX-001) to Etsy via API and bundles the A13 PDF on all 3.

🚦 **Gate G4 — Wave 1 LIVE** ⇒ first-payment unlocked

Wave 2 (TAX-002 + TAX-003) ships ~Day 14 after the Wave 1 listings have settled.

---

## Phase 6 — Optional polish (anytime, doesn't block first payment)

These improve conversion but aren't required for first sale.

### [ ] 6.1 — Vista Create thumbnails 2/3/4 per launch SKU (~3 hrs total)

Each launch SKU's `_delivery/<sku>/thumbnails.md` has the spec. Claude has produced thumb-1 (hero) + thumb-5 (includes-card) for every SKU programmatically. Vista Create work fills out the remaining 3 images per listing using the thumbnail master at `brand/assets/thumbnail-master-2000x2000.png` as the template.

→ **Tell Claude:** *"thumbnails 2-4 ready for <sku>."*

### [ ] 6.2 — GST-001 hero thumbnail mockup swap

GST-001's programmatic hero shows a generic financial workbook mockup. The Welcome Book is content-heavy, not financial. Re-render in Vista Create with a Welcome Book Sheet 1 preview as the mockup. Optional but recommended before publish.

### [ ] 6.3 — Cormorant Garamond font polish

Programmatic brand assets fall back to Georgia where Cormorant Garamond isn't available. If you have Cormorant Garamond installed locally OR a Vista Create license, re-render the wordmark + logo PNGs from the SVG sources for higher fidelity. Optional.

---

## Phase 7 — After first payment (Week 2-4)

Once first payment lands, the post-launch motion kicks in. These are tracked in PROGRESS.md sections P0.5 + P5.x:

- Founding-buyer outreach (10-20 hosts from your network) for early Etsy reviews
- Hero-magnet (47 deductions) opt-in landing page deploy
- Pinterest + FB group launch
- Email sequence deploy in Influencersoft

Don't worry about these until first payment lands — focus is the gate above.

---

## Reference: Signal phrases (for Claude session continuity)

When you complete a phase milestone, tell Claude the signal phrase. Claude immediately resumes the corresponding downstream work without needing context re-load.

| Phase | Signal phrase | Unlocks |
|---|---|---|
| 1.1 | "Etsy account open + API app registered" | Listing API publish |
| 1.2 | "Stripe confirmed + CLI key added" | Stripe Tax + payment plumbing |
| 1.3 | "domain + Cloudflare API token added" | DNS automation |
| 1.4 | "workspace live" | Email plumbing setup |
| 1.5 | "Gumroad account open + API token added" | Gumroad mirror |
| 1.6 | "2FA + offline backups complete" | Phase 2 |
| 2.1 | "brand assets approved" | Phase 3 |
| 2.4 | "47 deductions ready" | Lead-magnet deploy |
| 3.1–3.5 | "QA passed: <SKU>" per SKU | Listing publish per SKU |
| 4.3 | "test purchase pass" | Wave 1 publish (Gate G4) |
| 6.1 | "thumbnails 2-4 ready for <SKU>" | Per-SKU thumbnail upload |

---

## What Claude has already done (for context)

If anyone else picks up this checklist, here's what's been produced and is sitting in this repo waiting:

### Catalog
- **65 STR templates** at full publish-ready level (briefs + xlsx + thumbnails + PDFs + Etsy copy + product pages) — `templates/_masters/`, `templates/_delivery/`
- **65 build scripts** (1:1 with SKUs, regen byte-clean) — `templates/_build/build_*.py`
- **12 bundles** at price points $17–$797 — `templates/_delivery/_bundles/`
- **3 hero-magnet artifacts**: 47-deductions PDF + Excel checklist + A13 buyer companion — `templates/_delivery/_shared/`
- **Manifest check** (327 SKU + 20 bundle = 347 verification points; pre-commit hook live)
- **Spot-audit (2026-05-09):** 6/6 SKUs across 4 categories regen byte-identical; no drift

### Brand + copy
- **Full brand asset pack** (logos, banner, icons, favicons, Excel cover, thumbnail master) — `brand/assets/`
- **Etsy copy + product-page copy** for all 65 SKUs — `copy/`
- **5 lifecycle email sequences** drafted (post-purchase, review-request, refund-recovery, win-back, abandoned-cart) — `copy/_atomization/`

### Storefront infrastructure (built, blocked on Daniel credentials)
- **Stripe Tax + Connect runbook** (305 lines) — `infrastructure/stripe/setup.md`
- **Airtable schema** (279 lines) — `infrastructure/airtable/schema.md`
- **30 n8n workflows** ready to import (W01–W30) — `infrastructure/n8n/workflows/*.json` paired with `*.md` design doc each
  - W01–W03: order ingestion (Stripe / Gumroad / Etsy)
  - W04: subscriber sync
  - W05–W06: product publish + update
  - W07: refund handler
  - W08: lead-magnet delivery
  - W09–W12: rollups, alerts, support triage
  - W13–W18: review request, tax escalation, Pinterest poll, weekly backup, integrity check
  - W19–W22: FB group, affiliate cycle, research, template-update notification
  - W23–W30: long-haul (course onboarding, drip, cohort, NPS, annual update)
- **Map of all 30 workflows** — `infrastructure/n8n/workflows-map.md`

### Cluster funnel (4/4 LIVE)
- **strhost.tools** — calculator suite, blog, lodging-tax-by-state programmatic pages
- **strguests.tools** — 4 PDF generators + 26 Airbnb message templates + email gate (`strguests-tools-v0.1.0`)
- **strops.tools** — operations tools + maintenance scheduler (`v0.1.0-strops`)
- **strbuyers.tools** — 7 calculators + 219 city pages + affiliate-disclosure compliance (`strbuyers-tools-v0.1.0`)
- All four share one CI pattern (PR-gate → push deploy → smoke) aligned 2026-05-09.

### Runbooks
- **Disaster recovery** — `docs/runbooks/disaster-recovery.md`
- **Template production process** — `docs/runbooks/template-production-process.md`
- **Weekly content engine** — `docs/runbooks/weekly-content-atomization.md`

The artifacts ARE here. **The only thing standing between this repo and first payment is the Daniel-only items above** — accounts, sign-offs, hands-on QA. Every Daniel signal phrase is wired to a specific implementation file Claude will run on the next session.

---

## When something breaks during launch

Commit a note to `docs/runbooks/issues/YYYY-MM-DD-<issue>.md`. Tell Claude to fix the affected artifacts, plan, or queue. Refund any affected buyer within 48 hours per the Etsy shop policy.
