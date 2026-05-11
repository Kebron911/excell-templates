# STRManuals — Project Charter

**Domain:** strmanuals.com
**Created:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster:** STR Tools Ecosystem (5th site)

---

## 1. Mission
Be the place an STR owner buys *the one PDF* that answers the specific question keeping them up at night — and walks away with templates, checklists, and a clear next action, not more research.

## 2. The wedge
Most STR education is shaped wrong:
- 4-hour YouTube videos that bury the answer
- $1,500–$5,000 coaching programs
- Forum threads with 87 conflicting replies
- "Ultimate guides" that try to cover everything

**STR Manuals does the opposite:** one problem → one PDF → 25–50 pages → read in an afternoon → act tomorrow.

## 3. Audience
Active STR owners (1–10 properties), pre-loophole DIYers, owners hitting a specific wall (tax season, occupancy drop, regulation threat, OTA dependence). Tax-bracketed enough to drop $25–$99 without thinking.

## 4. Product format
Each manual:
- **25–50 pages** PDF, designed (not Word-export)
- **Plain English**, no jargon without definitions
- **Decision tools** — checklists, decision trees, fillable templates
- **One companion asset** — a workbook, log, or worksheet (often pulled from existing Excel-Templates suite)
- **CPA/legal disclaimer footer** where applicable
- **Versioned** — buyers get free updates within the same major version

## 5. Launch catalog (5 manuals + 1 bundle)

| ID | Title | Price | Pages | Companion | Anchor search intent |
|----|-------|-------|-------|-----------|---------------------|
| MAN-TAX-01 | The STR Tax Loophole Playbook | $29 | ~48 | TAX-002 P&L workbook | "STR tax loophole how it works" |
| MAN-TAX-02 | Material Participation Survival Kit | $29 | ~36 | Hours log template | "material participation 100 hours STR" |
| MAN-REV-01 | Why Are My Bookings Down? Diagnostic | $19 | ~28 | Break-even occupancy workbook | "airbnb bookings down 2026" |
| MAN-REV-02 | Direct Bookings Starter | $25 | ~32 | Email sequence pack | "how to get direct bookings airbnb" |
| MAN-LGL-01 | STR Permit & Regulation Survival Guide | $25 | ~30 | Permit research worksheet | "is airbnb legal in my city" |
| MAN-BUNDLE-01 | All Five Manuals | $99 | ~174 | All companions | — |

> **SKU namespace note (2026-05-11):** strmanuals SKUs use the `MAN-` prefix to avoid collision with the Excel-Templates / Ledger Stripe catalog (e.g. existing `BUNDLE-01` is the First-Year Host Bundle at $97). Cluster automation routes by **slug** (`str-tax-loophole-playbook`, `str-manuals-bundle`, etc.) not SKU, so this rename is cosmetic + Stripe `metadata.sku` only — does not affect tag dictionary or W01/W08 routing.

## 6. Monetization model
- **Primary:** Direct PDF sale via Stripe Checkout (no Gumroad/Etsy fees on manuals)
- **Secondary:** Bundle upsell at checkout (one-click)
- **Tertiary:** Workbook upsell inside each PDF (links to thestrledger.com / Etsy)
- **List-building:** Free 8-page "Tax Loophole Explainer" → biweekly manual previews → launches new SKU promos to warm list

**Target unit economics:**
- Avg order value: $35 (with bundle skew)
- Stripe fees: ~3% — keep ~97% margin (no platform cut)
- Email list 12-month LTV target: $80+

## 7. Cluster integration
- Each manual ends with a 1-page "Where to go next" linking to the relevant cluster site (e.g., LGL-01 → strops.tools permit calendar; TAX-01 → Excel TAX-002 workbook)
- Cross-promo footer on every cluster site links to strmanuals.com
- Shared email list (segmented by acquisition source)
- Shared design tokens (Cormorant Garamond + Inter, ledger palette)

## 8. Tech stack
- **Frontend:** Astro (static + islands), deployed to Hostinger Business
- **Payments:** Stripe Checkout (no custom checkout)
- **PDF storage:** Hostinger filesystem under `/private/manuals/` (outside web root) — served via Node `/api/download` endpoint with HMAC-signed tokens (24h expiry) + per-buyer watermarking via `pdf-lib` at stream time
- **Email + sequences:** **InfluencerSoft** (cluster-wide), orchestrated through n8n. Single contact pool with tag-based segmentation per the cluster tag dictionary
- **Analytics:** Plausible (privacy-friendly, lightweight)
- **One platform, one email vendor:** Matches the unified Hostinger Business + InfluencerSoft cluster decision — no third-party edge/CDN, no Postmark/ConvertKit
- **CMS:** MDX content files in repo (no headless CMS overhead)

## 9. Build order
1. **Phase 0** (week 1): Domain, design system, page templates, Stripe + R2 plumbing
2. **Phase 1** (weeks 2–4): Write + design TAX-01 (flagship). Launch site with one product. Validate.
3. **Phase 2** (weeks 5–7): TAX-02 + REV-01. Add bundle once 3 SKUs live.
4. **Phase 3** (weeks 8–10): REV-02 + LGL-01. Full launch + bundle promotion.
5. **Phase 4** (week 11+): Lead magnet, biweekly cadence, SEO content.

## 10. Success metrics
**90 days post-launch:**
- 5 manuals + bundle live
- 1,000 email subscribers
- $5K cumulative revenue
- 3+ organic search rankings on page 1 for target queries

**12 months:**
- 12 manuals live
- 10K email subs
- $60K annual revenue run-rate
- Bundle = 30%+ of revenue

## 11. Risks & mitigations
| Risk | Mitigation |
|------|-----------|
| Tax/legal liability from TAX-01/TAX-02/LGL-01 | Disclaimer page + "explainer not advice" framing + CPA review pre-launch |
| Refund abuse (digital goods) | 14-day "didn't help" refund, manual review, watermarked PDFs |
| PDF piracy | Per-buyer watermarking (email + order ID in footer), signed URLs, accept some leakage as cost of doing business |
| Cannibalizing Etsy workbook sales | Manuals upsell *to* workbooks, not away — PDF is the why, workbook is the how |
| Content goes stale (tax law changes) | Versioning + free-update promise inside same major version |

## 12. Out of scope
- City-specific regulation manuals (50 versions = nightmare; future programmatic play)
- Video courses (different business model, different unit economics)
- Coaching / 1:1 (not the wedge)
- Hardcover/print versions (until $200K ARR)
- Mobile app (PDFs read fine on phones)

## 13. Open decisions
- ConvertKit vs Beehiiv for list
- ~~Watermarking library~~ → `pdf-lib` (Node, in-process at download time)
- Refund SLA — 14 days seems right but verify against Stripe dispute rate after first 30 sales
- Whether to list on Gumroad as secondary channel after direct site validates
