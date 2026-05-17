# Residual Income Playbook — Excel-Templates / STR Cluster

**Date:** 2026-05-16
**Premise:** Engineering is ~90% done. Almost every idea below is gated on **account opens + final wiring**, not net-new builds. Ranked by `(residual potential × leverage of existing assets) ÷ setup effort`.

---

## TIER 1 — Flip a switch, money starts (this week)

### 1. Unblock STRManuals fulfillment (one-time PDFs, evergreen sales)
- 6 manuscripts drafted, site live, Stripe wired — but `BuyButton.isPlaceholder = true`.
- **Action:** Flip placeholder → false. Add real Stripe price IDs. Push.
- **Residual:** Pure evergreen — PDFs sell while you sleep. SEO already indexed.
- **Effort:** ~2 hours. **ETA to $1:** same day.

### 2. Launch STRLedger Astro storefront (12 SKUs ready, gated on draft mode)
- Astro scaffold DRAFT-gated, 12 product SKUs sitting idle, legacy PHP in Coming-Soon.
- **Action:** Flip draft → published, point DNS, push deploy workflow.
- **Residual:** 12 SKU catalog × Stripe = compound evergreen.
- **Effort:** half a day.

### 3. Activate Etsy + Gumroad dual-channel for the 65-SKU catalog
- 130 master xlsx files (BLANK+DEMO pairs), 12 bundles, hero thumbnails rendered.
- Wave-1 (TAX-001/002/003) already publish-ready with Etsy copy + Gumroad copy + thumbs.
- **Action:** Open Etsy seller acct + Gumroad acct. Bulk-upload Wave-1 → Wave-2 (10 SKUs) → rest.
- **Residual:** Etsy SEO compounds for years. Gumroad gets affiliate traffic.
- **Effort:** 1 day for Wave-1 listing. **Automatable refresh via existing build scripts.**

---

## TIER 2 — High-leverage subscriptions (the real money)

### 4. STRLaws → Paid State Compliance Alerts (subscription SaaS)
**This is your single biggest unbuilt residual play.**
- Skeleton site exists: `[state]/`, `legal/`, `alerts/`, `data/snapshots/`.
- Hosts mandate compliance: STR laws change quarterly per city/state. Pain is real and recurring.
- **Product:** $9–$19/mo per state, or $49/mo all-50 — daily scrape + diff + email alert.
- **Automation:** n8n scrapes city/state STR ordinance pages → snapshot diff → if changed, emails subscribers + posts to blog (programmatic SEO compounds).
- **Residual:** Pure subscription. State-page SEO funnels free signups → paid alert tier.
- **Effort:** 2–3 weeks. Recurring revenue afterward with ~zero touch.

### 5. STRGuests-Tools AI generators → Freemium SaaS
- Already-built generators: welcome book, listing description, review response, guest messages, house rules, check-in instructions, Wi-Fi sign.
- Only blocked on `OPENAI_API_KEY` wiring.
- **Product:** Free tier = 3 generations/mo. Paid = $19/mo unlimited OR $7 one-time per doc.
- **Residual:** OpenAI cost ~$0.02/generation; margin >95%.
- **Effort:** ~3 days (Stripe metered billing + Clerk auth + usage counter).

### 6. STRListingAudit → Recurring monthly Airbnb audit ($29/mo)
- Skeleton + `/audit/` route exists. MKT-001 audit xlsx already shipped.
- **Product:** User pastes listing URL → AI audit (photos, title, description, pricing vs. comps). Re-runs monthly automatically with email diff.
- **Residual:** Subscription. n8n schedules the re-runs.
- **Effort:** 1–2 weeks.

### 7. Affiliate program (30% commission) — pre-designed in P5.7
- Workflow W21 already drafted, never imported into n8n.
- Let other STR creators drive your traffic forever for a cut.
- **Action:** Wire affiliate links through Rewardful or LemonSqueezy. Recruit 20 creators.
- **Residual:** Compounds without your involvement. Each affiliate = perpetual top-of-funnel.
- **Effort:** 2–3 days setup, then zero ongoing.

---

## TIER 3 — Big-asset launches (drafts done, never shipped)

### 8. Self-publish "The $50K Deduction" book → Amazon KDP
- 17 chapters drafted in `copy/book-50k-deduction/`.
- **Action:** Edit pass → KDP paperback + Kindle.
- **Residual:** Royalties forever. Discoverable via Amazon search (parallel SEO surface).
- **Effort:** 1–2 weeks editing + cover.

### 9. Launch the "$50K Deduction" course (7 modules drafted)
- `copy/course-50k-deduction/` has full curriculum.
- **Product:** $297 one-time or $497 with templates bundle. Drip via Teachable/Podia (or Gumroad's course feature).
- **Residual:** Cohort-free, self-paced = passive. Bundle with templates lifts AOV.
- **Effort:** 1 week recording (or skip video, sell text+template course at $97).

### 10. Order bumps + post-purchase OTOs on Stripe checkout
- Already designed, never implemented (Etsy doesn't allow them — own-site only).
- **Action:** Add 1-click upsell ($17 cleaning template after $47 tax kit purchase, etc.).
- **Residual:** Lifts AOV 20–40% on every order. Permanent margin lift.
- **Effort:** 1 day per site once Stripe is live.

---

## TIER 4 — Free-traffic engines (compound forever)

### 11. Activate the 10-channel content atomization runbook
- `weekly-content-atomization` runbook is written: 1 blog → Pinterest pins + email + FB + IG + LI + YT short + TikTok + Twitter + newsletter.
- W13/W15 (Pinterest) + W19 (FB) workflows exist, not imported.
- **Action:** Open Pinterest Business + FB Group + Buffer/Creasquare. Import workflows.
- **Residual:** Pinterest drives evergreen traffic for years per pin. Blog posts compound.
- **Effort:** 1 week setup, then 1 blog post/wk = 10 distribution touches automatically.

### 12. Programmatic SEO at scale
- STRLaws: `airbnb-laws-[city]` for top 200 STR markets (data already structured in `data/snapshots/`).
- STRBuyers-Tools: `airbnb-roi-[city]` calculator pages.
- STRHost-Tools: `airbnb-tax-[state]` pages.
- **Residual:** Hundreds of long-tail pages, each capturing trickle traffic → email gate → funnel.
- **Effort:** 1 week of template generation. Compounds for years.

### 13. Paid newsletter — "STR Tax & Compliance Weekly"
- Beehiiv/Substack paid tier @ $9/mo.
- **Automation:** n8n digests new STRLaws alerts + blog posts + STR market data → AI-drafts → you approve → sends.
- **Residual:** Subscription revenue + Beehiiv ad network.
- **Effort:** ~1 week + 15 min/wk approval.

---

## TIER 5 — B2B residual (highest ceiling, longer ramp)

### 14. White-label STRGuests-Tools generators to property managers
- PMs (Hospitable, Hostfully customers, individual co-hosts) pay $99–$299/mo for branded versions.
- Multi-tenant: their logo, their colors, their domain.
- **Residual:** High-ticket monthly with low churn (workflow-embedded).
- **Effort:** 3–4 weeks to add tenancy + custom-branding to existing generators.

### 15. Embed partnerships with PM software (revenue share)
- Hospitable, Hostfully, Guesty have plugin/marketplace surfaces.
- Pitch your generators as an embedded integration; 30/70 rev share.
- **Residual:** Their sales team sells your tools forever.
- **Effort:** Partner outreach (1–2 weeks of emails). Once live, hands-off.

---

## Recommended sequence (residual income ramp)

| Week | Action | Revenue type |
|------|--------|--------------|
| 1 | Tier 1 — unblock STRManuals, launch STRLedger, list Wave-1 on Etsy/Gumroad | One-time, evergreen |
| 2–3 | Tier 2.5 — wire OpenAI key, paywall STRGuests generators | Subscription |
| 3–4 | Tier 2.4 — STRLaws compliance-alerts MVP (start with CA + FL + TX) | Subscription |
| 4 | Tier 3.10 — order bumps + OTOs on Stripe | AOV lift, evergreen |
| 5 | Tier 2.7 — affiliate program live | Perpetual top-of-funnel |
| 6 | Tier 4.11 — content atomization n8n flows imported, Pinterest live | Evergreen traffic |
| 7–8 | Tier 3.8 — book to KDP | Royalties forever |
| 9–10 | Tier 2.6 — STRListingAudit recurring | Subscription |
| 11–14 | Tier 5 — white-label tier + PM partnerships | High-ticket B2B |

**Honest read:** You will likely make more from #4 (STRLaws alerts) + #5 (STRGuests AI freemium) + #7 (affiliates) than from the entire 65-SKU Excel catalog combined, because subscriptions compound and templates don't. Templates are your top-of-funnel; SaaS is your residual engine.

**Biggest risk:** All 15 ideas are gated on **account openings** (Stripe live mode, Etsy seller, Gumroad, OpenAI billing, Pinterest Business, KDP, Beehiiv, Rewardful). Block out one full day to open every account at once — that's the actual bottleneck, not engineering.
