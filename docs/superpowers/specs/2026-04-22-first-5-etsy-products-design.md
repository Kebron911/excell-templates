# First 5 Etsy Products — Build & Launch Plan (Design)

**Status:** Draft v1 — awaiting user review
**Date:** 2026-04-22
**Author:** Daniel Harrison (via brainstorming skill)
**Parent spec:** [2026-04-22-str-tax-platform-design.md](./2026-04-22-str-tax-platform-design.md)
**Supersedes (partially):** Lane A tasks A7–A14 in [2026-04-22-weeks-1-8-launch.md](../plans/2026-04-22-weeks-1-8-launch.md) for the first-5 product rollout. A1/A5/A6 remain referenced as complete. A2/A3/A4/A12/A13/A14 are re-specified here under the updated Claude-drafts-all role split.

---

## 0. Executive summary

End-to-end design for building and launching the first five Etsy products for The STR Ledger. The master strategy locks the 5 SKUs, their tier, and their Etsy prices. This design locks the *how*: role split, wave structure, per-product deliverable stack, shop-level one-time tasks, and the go/no-go gate schedule that gets all 5 live on Etsy and mirrored to Gumroad by Day 14.

**The 5 products (master spec §10):**

| # | SKU | Product | Tier | Etsy price | Wave |
|---|---|---|---|---|---|
| 1 | GST-001 | Airbnb Welcome Book | T1 | $17 | Wave 1 |
| 2 | OPS-001 | Cleaner Turnover Checklist + Scorecard | T1 | $12 | Wave 1 |
| 3 | TAX-001 | STR Mileage Log | T1 | $17 | Wave 1 |
| 4 | TAX-003 | 1099-NEC Contractor Tracker | T1 | $17 | Wave 2 |
| 5 | TAX-002 | Single-Property P&L Tracker (Lite) | T2 | $27 | Wave 2 |

**Targets:** Wave 1 live Day 7. Wave 2 live Day 14. All 5 on Gumroad Day 14. First Etsy sale possible Day 7 (meets master spec §12 hard milestone "Week 2: Etsy revenue > $0").

**Role model:** Claude drafts every artifact (briefs, Excel files, thumbnail specs, PDFs, listing copy, upload checklists). Daniel reviews at gates, executes Etsy/Gumroad UI actions, does hands-on QA in Excel, and builds final PNGs/PDFs in Vista Create from specs. Daniel total hands-on: **~15–18 hrs over 2 weeks** (~1.5 hrs/day average).

---

## 1. Scope

### 1.1 — In scope

**Per product (×5):**
- Template brief
- Sheet-by-sheet Excel spec
- `.xlsx` master build (Python/openpyxl)
- Lite variant (P&L only)
- 5-image thumbnail design specs
- Preview image specs (where applicable)
- Companion how-to PDF
- License PDF
- Listing copy finalization (4 existing drafts refreshed, 1 new for Turnover Checklist)
- Etsy upload checklist with exact form-field values

**Shop-level one-time:**
- A2: domain + email setup checklist
- A3: Etsy seller account setup checklist
- A4: Vista Create asset pack specs (logo ×2, banner, icon, thumbnail master, Excel cover)
- A5: paste existing shop-about + shop-policies into Etsy
- A13: Etsy buyer companion PDF (shared, bundled into all 5 listings)
- A14: Gumroad mirror for all 5

**Post-publish:**
- A12: SEO pass on all 5 listings (title + 13 tags + description keywords)
- Post-launch monitoring: views, CVR, first sale, refund rate

### 1.2 — Assumed done

- **A1:** brand identity locked — "The STR Ledger" / thestrledger.com, palette, voice, fonts (`brand/brand-decisions.md`)
- **A5 drafts:** shop-about + shop-policies copy drafted and brand-substituted (`copy/etsy-listings/shop-about.md`, `shop-policies.md`)
- **A6:** template production SOP (`docs/runbooks/template-production-process.md`)
- Brand token substitution across all drafted docs

### 1.3 — Out of scope (deferred)

- Lane B: hub/IS, Stripe, Airtable schema, n8n workflows, email nurture, OrderBumps/OTOs
- Lane C: blog, Pinterest, FB group, SEO content, lead magnets beyond A13
- Phase 2+ storefronts: Payhip, Creative Market, Hostfully, BiggerPockets
- "Full" versions of P&L and Schedule E (built against own-site post-Week 8)
- Tax Season Bundle, Portfolio Bundle, Vault (Month 3+)
- Affiliate program, membership, DFY services

---

## 2. Wave structure & timeline

### 2.1 — Two-week sprint shape

| Phase | Days | Work |
|---|---|---|
| Prereqs | 1–2 | A2 domain + email, A3 Etsy seller account, A4 Vista Create asset pack. Parallel to Wave 1 briefs. |
| **Wave 1** | 3–7 | 3 simple T1s built, listings finalized, thumbnails built, published Day 7. |
| **Wave 2** | 8–14 | 2 formula-heavier SKUs built, QA'd, published Day 14. |
| Closeout | 14 | A12 SEO pass, A13 PDF bundled into all 5, A14 Gumroad mirror live. |

### 2.2 — Wave 1 (Days 3–7) — "content-first" SKUs

| SKU | Product | Why Wave 1 | Complexity |
|---|---|---|---|
| GST-001 | Welcome Book | Gateway product, Etsy traffic magnet, no tax formulas | Content + layout |
| OPS-001 | Turnover Checklist | Low-price tripwire ($12), no formulas, shared skeleton with Welcome Book | Content + checklist layout |
| TAX-001 | Mileage Log | First tax-adjacent product, formulas are simple (miles × IRS rate) | Light formulas |

Wave 1 rationale: establish shop presence with low-risk SKUs where listing quality (thumbnails, copy) matters more than formula correctness. Early reviews on these are less likely to surface formula bugs.

### 2.3 — Wave 2 (Days 8–14) — "formula-first" SKUs

| SKU | Product | Why Wave 2 | Complexity |
|---|---|---|---|
| TAX-003 | 1099-NEC Tracker | Formula-medium (threshold $600 flag, YTD totals), moderate data validation | Medium formulas |
| TAX-002 | P&L Lite | T2 ($27), formula-heavy, Lite/Full split required, highest QA risk | Heavy formulas |

Wave 2 rationale: benefit from Wave 1 learnings (thumbnail CTR, listing view patterns); book extra QA time for formula correctness since refunds on these would bruise shop rating.

### 2.4 — Why not P1 (serial) or P3 (full batch)

- **P1 serial** forces context-thrash between brief-writing, Excel building, thumbnail speccing, listing finalization 5× over; we lose batching efficiency.
- **P3 full batch** delays first sale to Day 14, which violates master spec §12 "Week 2: Etsy revenue > $0" and forgoes Wave 1 → Wave 2 learning loop.

---

## 3. Per-product deliverable stack

Every product produces 10 deliverables. Claude drafts all; Daniel reviews + executes final human-only steps.

| # | Deliverable | Path | Owner (draft → finalize) |
|---|---|---|---|
| 1 | Brief | `templates/_briefs/<sku>.md` | Claude → Daniel approves |
| 2 | Sheet-by-sheet spec | `templates/_briefs/<sku>-spec.md` | Claude → Daniel approves |
| 3 | Excel master | `templates/_masters/<sku>.xlsx` | Claude (openpyxl) → Daniel QA in Excel |
| 4 | Lite variant | `templates/_lite/<sku>-lite.xlsx` | Claude (P&L only) → Daniel QA |
| 5 | Thumbnail specs (5 images) | `templates/_delivery/<sku>/thumbnails.md` | Claude spec → Daniel builds in Vista Create |
| 6 | Preview image specs | inline in thumbnails.md | Claude spec → Daniel builds in Vista Create |
| 7 | Companion how-to PDF | `templates/_delivery/<sku>/<sku>-howto.pdf` | Claude (markdown → PDF) → Daniel approves |
| 8 | License PDF | `templates/_delivery/<sku>/<sku>-license.pdf` | Claude (shared template) → auto |
| 9 | Listing copy | `copy/etsy-listings/<sku>.md` | Claude drafts/refreshes → Daniel approves |
| 10 | Etsy upload checklist | inline in `<sku>.md` | Claude produces exact values → Daniel pastes into Etsy |

### 3.1 — Per-product time budget

| Product type | Claude work | Daniel hands-on per product |
|---|---|---|
| Content (Welcome Book, Turnover Checklist) | ~3 hrs | ~2 hrs (brief review, Excel QA, 5 Vista Create thumbnails, Etsy upload) |
| Formula (Mileage, 1099-NEC, P&L Lite) | ~5 hrs | ~2.75 hrs (adds extra QA cycle for formulas) |
| **5-product subtotal** | **~21 hrs** | **~12.25 hrs** |
| Shop-level (A2/A3/A4/A5/A13/A14) | included in plan | **~5.5 hrs** (A4 brand assets ~2.5 hrs dominates) |
| Test purchase + launch monitoring | — | **~0.5 hr** |
| **Daniel total** | — | **~15–18 hrs** |

Thumbnail math (key input to estimate): 25 product thumbnails × ~12 min each = ~5 hrs steady-state (the A4 master is reusable, so per-product thumbs are text/mockup swaps, not fresh designs).

**Tool note:** Brand asset pack + all thumbnails build in **Vista Create Pro** (lifetime deal owned). If Daniel hasn't used Vista Create before, budget ~20–30 min extra on Day 1 for first-run familiarization (brand kit setup, font library check, template navigation). Re-evaluate thumbnail throughput after Wave 1 Day 7 closes — if still slow, the ~12 min target may drift up ~2–3 min/each (total slip: ~50 min across all 25).

### 3.2 — Lite variant rule (master spec §4.2)

Only `TAX-002 P&L` ships a Lite variant for Etsy. The other 4 ship the same file on Etsy and Gumroad. Rationale: Welcome Book, Turnover Checklist, Mileage Log, and 1099-NEC are single-purpose tools where a "Lite" would feel crippled rather than narrower.

The P&L Lite is single-property only; the Full version (multi-property, depreciation, multi-LLC) lives on the own-site at $97 when Lane B ships (out of scope here).

---

## 4. Shop-level tasks

| # | Task | Day | Claude deliverable | Daniel action |
|---|---|---|---|---|
| A2 | Domain + email | 1 | DNS record values; Hostinger purchase checklist; Google Workspace setup steps; test-email verification checklist | Buy thestrledger.com via Hostinger; add A + MX records; sign up for Workspace ($6/mo); verify `hello@thestrledger.com` |
| A3 | Etsy seller account | 1–2 | Pre-filled preferences; tax-entity note (sole prop OK for MVP); bank/tax submission checklist; 2FA steps | Create Etsy account with business email; submit bank + SSN/EIN; enable 2FA authenticator; record shop URL + listing ID format |
| A4 | Vista Create asset pack | 2–4 | Precise Vista Create specs: logo sq + horiz, banner (1600×213), icon (500×500), thumbnail master (2000×2000), Excel cover (1000×400) — exact hex, fonts, headline copy, layout, negative space | Build 5 assets in Vista Create Pro; export PNG + SVG where applicable to `brand/assets/`; commit |
| A5 | Shop copy live | 5 | (No new Claude work — copy already drafted) | Paste `shop-about.md` into Etsy → About; paste `shop-policies.md` into Etsy → Policies; paste announcement banner text |
| A13 | Buyer companion PDF | 6 | Final 1-page copy with brand tokens resolved; Vista Create layout spec; generated reference PDF | Build branded Vista Create version; export PDF; save to `templates/_delivery/_shared/etsy-upgrade-insert.pdf`; attach as file #2 on all 5 listings |
| A14 | Gumroad mirror | 14 | Per-product Gumroad upload checklist; full-version pricing map; description transposition | Create Gumroad account with `hello@thestrledger.com`; upload 5 products (Full versions, not Lite); 2FA + bank; publish |

---

## 5. Role split (the A1 choice)

### 5.1 — Claude does

- Every template brief (contradicts existing Weeks 1-8 plan A6-Step-1; that's the supersede)
- Every sheet-by-sheet Excel spec
- Every `.xlsx` build via Python/openpyxl
- Every Lite variant (P&L only)
- Every thumbnail design spec + preview image spec (text specs — Daniel builds PNGs in Vista Create)
- Every companion PDF + license PDF (markdown source + rendered reference; Daniel builds branded final in Vista Create for PDFs that need brand identity; Claude's rendered PDF is acceptable for utility docs)
- Every listing copy finalization + 13-tag set + SEO keyword research
- Every Etsy/Gumroad upload checklist with exact form-field values
- Git commits for all code/content artifacts (Daniel reviews diffs)

### 5.2 — Daniel does

- Review gate on every brief before Claude builds the Excel
- Review gate on every Excel file — actual Excel 2016+ hands-on QA on Windows (Claude cannot reliably validate xlsx across versions)
- Domain purchase (manual, payment)
- Etsy seller account creation + bank/tax/2FA (requires SSN/EIN)
- Vista Create asset builds from Claude specs (5 brand assets + 25 product thumbnails over 2 weeks)
- Etsy listing uploads (Etsy UI, one at a time; can't be scripted for new shops)
- ≥1 test purchase from secondary Etsy account on Welcome Book before Wave 1 publishes
- Gumroad account creation + uploads
- Post-launch daily view/CVR monitoring Weeks 1–4

### 5.3 — Neither (explicitly)

- No Airtable schema work in this plan (Lane B)
- No n8n automation in this plan (Lane B)
- No blog/Pinterest content (Lane C)

---

## 6. Go/No-go gate schedule

| Gate | Day | Pass condition | Failure response |
|---|---|---|---|
| G1 | 2 | A2 domain resolves, MX live; A3 Etsy account approved; A4 Vista Create specs delivered (Daniel still exporting is fine) | Slip Wave 1 by # days domain/account took to unblock |
| G2 | 4 | Wave 1 briefs approved; 3 Excel masters built; initial Windows QA pass | Stop-the-line — no thumbnail/listing work until build is clean |
| G3 | 6 | Wave 1 listing copy finalized post-brief; 3 thumbnail sets in Vista Create; companion + license PDFs placed; test purchase succeeded on Welcome Book | Fix + retest before publish |
| **G4** | **7** | **Wave 1 goes live on Etsy** — 3 listings with 5+ thumbnails, 13 tags, 5 attached files | Slip = missed master spec §12 milestone |
| G5 | 11 | Wave 2 briefs approved; 2 Excel masters built; P&L Lite built; sample-data outputs match brief expectations cell-for-cell | Stop-the-line; schedule focused QA session |
| G6 | 13 | Wave 2 listing copy finalized; 2 thumbnail sets built; A12 SEO pass complete on all 5; Airtable Products rows stubbed (if schema exists — else deferred to Lane B) | Delay publish 24 hrs rather than ship weak SEO |
| **G7** | **14** | **Wave 2 goes live on Etsy + A13 PDF bundled into all 5 + A14 Gumroad mirror live with all 5** | 48-hr grace; flag risks to user |

### 6.1 — Definition of Done (plan-level acceptance)

- [ ] 5 listings live on Etsy — each with 5+ thumbnails, 13 tags, SEO-optimized title ≤140 chars keyword-front-loaded, 5 downloadable files attached (master .xlsx or Lite .xlsx; A13 PDF; license PDF; how-to PDF; preview PDF)
- [ ] Shop has banner, icon, announcement, about, policies — not just drafted, actually live in Etsy settings
- [ ] A13 buyer companion PDF is file #2 in every Etsy listing
- [ ] All 5 mirrored on Gumroad (Full versions, not Lite)
- [ ] `templates/_masters/` has 5 `.xlsx` files committed
- [ ] `templates/_briefs/` has 10 files (5 briefs + 5 specs) committed
- [ ] `templates/_delivery/<sku>/` has thumbnail specs + companion PDF + license PDF for each of 5
- [ ] `templates/_lite/` has 1 file (P&L Lite)
- [ ] `copy/etsy-listings/` has 5 finalized listing files, brand name and domain verified, no "speculative" warnings
- [ ] `infrastructure/etsy/shop-setup.md` and `infrastructure/gumroad/setup.md` exist and committed
- [ ] ≥1 test purchase completed successfully (file downloads, opens in Excel, upgrade CTA visible, email arrives at `hello@thestrledger.com`)

### 6.2 — Reported, not blocking (first 30 days post-launch)

- Refund rate ≤5% (master spec §7.8 alert threshold)
- ≥20 total views across 5 listings
- ≥1 conversion signal (view → sale)

---

## 7. Risk register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Etsy account approval delayed (1–3 days) | Medium | High | A3 starts Day 1 parallel to briefs; worst case slips G4 by 1–2 days |
| Excel build bug missed until buyer opens file | Low-Medium | High | Test purchase gate G3; Windows QA at G2/G5; openpyxl generates deterministic output |
| Thumbnail CTR <1% post-launch | High | Medium | Rewrite trigger at Day 30 (already in Welcome Book listing draft line 214); thumbnail is biggest conversion lever per master spec |
| Domain purchase friction (card decline, region mismatch) | Low | Medium | Hostinger known-fast; fallback: Porkbun or Namecheap |
| Daniel review bottleneck on briefs | Medium | Medium | Budget 15 min/brief; Claude queues briefs one at a time; Daniel reviews same-day |
| Vista Create thumbnail build slower than estimated | Medium | Low | Thumbnail master from A4 is reusable; each product thumb is text-swap only |
| P&L Lite formula bug discovered post-launch | Medium | Medium | Hardest SKU gets longest QA window (Days 8–13); test purchase from secondary account before G7 |
| Etsy listing rejected for policy violation | Low | Medium | Digital-download format is well-trodden; shop-policies drafted conservative; keep brand tone business-grade not cutesy |

---

## 8. Dependencies

### 8.1 — Sequential (must-complete-before)

- A2 domain → A3 Etsy account (uses business email)
- A3 Etsy account → G4 Wave 1 publish (can't publish without live account)
- A4 thumbnail master → per-product thumbnails (all 25 product thumbs inherit the master)
- Per-product brief → spec → Excel build → QA → listing copy → publish (within each SKU, serial)
- A13 buyer PDF → attached to listings (must exist before G4 or retroactive attach is fine)

### 8.2 — Parallel (can run simultaneously)

- A2/A3/A4 run parallel to Wave 1 briefs
- Wave 1 briefs, specs, Excel builds, thumbnail specs — Claude produces in batch
- Daniel's Vista Create thumbnail builds run parallel to Claude's Wave 2 briefs

### 8.3 — External (human-only, can't be parallelized away)

- Domain registration
- Etsy bank/tax submission + 2FA
- Vista Create Pro asset builds
- Etsy listing UI uploads
- Test purchase from secondary account

---

## 9. Existing-artifact inventory (what's already drafted)

| Artifact | Path | Status | Plan treatment |
|---|---|---|---|
| Brand decisions | `brand/brand-decisions.md` | Complete | Referenced, not re-done |
| Shop about copy | `copy/etsy-listings/shop-about.md` | Complete, brand-substituted | Paste into Etsy at A5 |
| Shop policies copy | `copy/etsy-listings/shop-policies.md` | Complete, brand-substituted | Paste into Etsy at A5 |
| Template SOP | `docs/runbooks/template-production-process.md` | Complete | Referenced; plan's per-product flow is an instance of the SOP |
| GST-001 Welcome Book listing | `copy/etsy-listings/GST-001-welcome-book.md` | Speculative — flagged "awaiting Task A7 brief" | Refresh after brief delivered Day 3 |
| TAX-001 Mileage Log listing | `copy/etsy-listings/TAX-001-mileage-log.md` | Speculative | Refresh after brief delivered Day 3 |
| TAX-002 P&L Lite listing | `copy/etsy-listings/TAX-002-single-property-pl-lite.md` | Speculative | Refresh after brief delivered Day 8 |
| TAX-003 1099-NEC listing | `copy/etsy-listings/TAX-003-1099-nec-tracker.md` | Speculative | Refresh after brief delivered Day 8 |
| OPS-001 Turnover Checklist listing | *(does not exist)* | — | Draft fresh at Day 3 alongside brief |

---

## 10. Transition to implementation

After this design is approved, the next step is to invoke the writing-plans skill to produce the actual step-by-step implementation plan:

- `docs/superpowers/plans/2026-04-22-first-5-etsy-products-plan.md`

That plan will contain, for each of the 14 sprint days:
- Exact task list (Claude + Daniel)
- Per-task acceptance criteria
- Exact Python/openpyxl build sketches for each Excel file (enough to ground the real implementation)
- Full template briefs for all 5 products (Claude-authored, Daniel-reviewed at gates)
- Thumbnail shot lists for all 25 product images
- Full Etsy upload checklists with exact form-field values
- Git commit milestones

This design locks the *structure*; the plan locks the *content*.

---

## Appendix A — Open items for the implementation plan

These are explicitly deferred to the implementation plan, not decided here:

1. Exact brief content for each of the 5 products (persona emphasis, specific fields, formulas)
2. Exact sheet-by-sheet layout for each of the 5 Excel files
3. Exact thumbnail headlines + color pairings for all 25 images
4. Exact SEO keywords (harvested from Etsy search-suggest during A12, Day 13)
5. Tax-entity decision for Etsy account (sole prop vs LLC)
6. Email host final choice (Google Workspace recommended; Fastmail / Zoho alternatives noted)
7. Gumroad pricing exact values (Full versions priced per master spec §4.1 own-site column)

---

**End of design. Awaiting user review before invoking writing-plans skill.**
