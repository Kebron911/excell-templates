# Gap Analysis — Planned but NOT Created
**Date:** 2026-05-16
**TL;DR:** Excel SKUs are 100% done. Everything else (publishing, PDFs, deploys, video, n8n imports, state coverage) is the gap. The bottleneck is **finishing/publishing, not creating**.

---

## Headline Numbers (plan vs. actual)

| Asset | Planned | Built | Published/Live |
|---|---|---|---|
| Excel SKUs | 65 | **65** ✅ | 0 (Etsy/Gumroad/Stripe not turned on) |
| "Lite" derivative xlsx | 65 | 4 | 0 |
| STRManuals — drafted manuscripts | 6 | 6 (MD) | **0 PDFs** deployed |
| Book "$50K Deduction" — chapters | 17 | 17 (MD) | 0 (no final manuscript, cover, KDP) |
| Course modules — scripts | 7 | 8 (MD) | **0 videos recorded** |
| Course bonus assets | 13 | 13 (MD) | 0 produced |
| Blog posts | 10 | 3 drafted | 0 published |
| Mini-magnets (PDFs/xlsx) | 6 | 0 | 0 |
| Lead-magnet PDFs in router | 9 | 0 PDFs | 0 deployed |
| Email sequences | 11+ | 11 (MD) | **0 loaded into IS** |
| n8n workflows | 36 JSON | 36 ✅ | **0 imported/activated** |
| STRLaws state pages | 50 | **0** | 0 |
| STRLaws city pages | ~500 | 0 | 0 |
| Pinterest pin images | 30 | 0 (12 briefs) | 0 |

---

## 1. Excel SKUs — DONE ✅
65/65 built. Manifest 112/112 green. Only "lite" derivatives are missing (61 of 65).

## 2. PDFs / written deliverables — drafted, not finalized
- **Hero magnet "47 Airbnb Tax Deductions"** — draft in `templates/_briefs/hero-magnet.md`. No final PDF/xlsx. No `/47-deductions` page.
- **Book "$50K Deduction"** — `copy/book-50k-deduction/` has all 17 chapters + front/back matter + amazon-listing + cover-spec. **Missing:** edited manuscript, cover art, KDP listing, `/book` page.
- **STRManuals 5 paid + 1 free** — MDX product pages exist; **zero PDFs in `STRManuals/site/public/dl/`**. `BuyButton.isPlaceholder=true`, `/dl/` returns 404 in prod.
- **6 mini-magnets per blog plan** — Schedule E cheat-sheet (1pg), Depreciation Asset Quick-Lookup, 1099 Trigger Calculator, Cost-Per-Stay Calculator, Chart of Accounts Starter, Estimated Tax Calendar. All listed in `copy/blog-posts/content-plan.md`. **None produced.**

## 3. Course content — drafted, never produced
- 7 module scripts in MD. **Zero videos recorded** (no mp4/mov anywhere in repo).
- 13 bonus assets all MD-only: self-audit checklist, wall poster, "what changed" video, Augusta documentation pack, categorization rule library, CPA directory, CPA interview scorecard, decision-tree pack, Notion/Airtable mirrors, receipt-OCR workflow, tabletop drill, worked-example library, year-end health check.
- Platform undecided (IS vs Teachable vs Kajabi).

## 4. Blog / SEO content
**Drafted (3):** `01-airbnb-tax-deductions.md`, `02-airbnb-schedule-e.md`, `03-str-depreciation.md`.
**Not drafted (7) — from `content-plan.md`:** airbnb 1099-NEC, vacation rental expense tracker, airbnb mileage deduction, STR bookkeeping, airbnb quarterly taxes, cost segregation STR, airbnb LLC vs sole proprietor.
**Not published anywhere.** STRLedger blog has only `welcome.mdx`. STRLaws programmatic `/blog/` has the pipeline, zero content.

## 5. Email sequences — drafted, never loaded
11 sequences in `copy/email-sequences/`: welcome-book-magnet, nurture-hero-magnet, launch-12-new-templates, post-purchase-etsy-buyer, refund-recovery, review-request, abandoned-cart, win-back, strmanuals-free-magnet, strmanuals-order-confirmation, plus 5 bundle sequences (BUNDLE-01..05).
**None converted to IS-import shape.** P2.0 prep pack missing: `tag-dictionary.md`, `products.yaml`, `forms.yaml` not built.

## 6. n8n workflows — all exported, NONE imported
- 36 JSON files on disk (W01–W31 + W41–W45).
- **0 imported/activated** in the live n8n instance.
- `STR_StrManuals_LeadMagnet_Tax.json` and `STR_Cluster_Lead_Router.json` still have `__SET_ME__` placeholders.

## 7. Site features / pages not built
- **STRLedger (Astro):** entire site DRAFT-gated, un-deployed. Legacy PHP still serves the domain. `/free/47-deductions/` page exists but uses mailto fallback. `/book` page missing. `showStripeBuy=false`.
- **STRManuals:** `/free/` form has `FORM_ACTION=''` placeholder. `/dl/<HASH>/...` returns 404.
- **STROps:** 3 lead-magnet pages stuck in Coming-Soon stub mode (`get-the-cleaner-sop`, `get-the-maintenance-checklist`, `get-the-supply-par`).
- Shared `EmailCaptureCard`, `EmailGate`, `PdfDownloadButton` paused across cluster.
- Legal pages (`/terms`, `/privacy`, `/refunds`) — not built on any storefront.

## 8. STRLaws — zero coverage
- `STRLaws/src/content/states/` directory **does not exist**.
- `STRLaws/data/snapshots/` is a `.gitkeep` only.
- `scripts/seed-cities.ts` defines all 50 states + 50 top cities. **`pnpm db:seed` never run.**
- Templated routes exist but render nothing: 0/50 states, 0/500 cities.

## 9. Lead magnets — listed in router, no PDFs exist
None of these PDFs exist on the live sites:
| Magnet | Expected path |
|---|---|
| Lodging tax report | `strhost.tools/pdfs/strhost-lodging-tax-quickstart.pdf` |
| Cleaner SOP | `strops.tools/pdfs/...` |
| Maintenance checklist | `strops.tools/pdfs/...` |
| Supply par level | `strops.tools/pdfs/...` |
| Guest template pack | `strguests.tools/pdfs/guest-template-pack.zip` |
| Disclosures checklist | `strbuyers.tools/pdfs/...` |
| Buyer playbook | `strbuyers.tools/pdfs/...` |
| 47 deductions | `thestrledger.com/pdfs/47-deductions.pdf` |
| Free sample chapter | `strmanuals.com/pdfs/free-sample-chapter.pdf` |

Only 2 lead-magnet briefs exist (`copy/lead-magnets/entity-decision-flowchart.md`, `etsy-buyer-pdf.md`); neither rendered to PDF.

## 10. Everything else planned-not-created

**Pinterest / atomization:**
- 12/30 pin briefs drafted; **0 pin PNGs rendered** (1000×1500).
- `atomization-map.md` defines YouTube long-form, Shorts, IG carousel/Reel, LinkedIn, X thread, FB group, newsletter outputs per slide deck — **no decks, no exports**.

**Partnerships / PR / affiliate (P5.7) — none produced:**
- 10-show podcast outreach list
- Newsletter sponsorship list
- 30% affiliate program assets
- Founding-affiliates pack
- Customer referral program (20/20)
- Press kit
- HARO/Qwoted profiles
- Reddit/forum playbook
- `copy/outreach-templates/` has only 4 files (customer-embed-ask, social-question-answer, unlinked-mention-reclaim, voice-guide).

**InfluencerSoft prep pack (P2.0):**
- `infrastructure/influencersoft/tag-dictionary.md` — missing
- `products.yaml` — missing
- `forms.yaml` — missing
- `sequences/*` IS-import shapes — missing

**Ops runbooks (P9) — referenced, not authored:**
- `ops/daily-dashboard.md`, weekly scoreboard
- `ops/incident-severity.md`, `runbooks/postmortem-template.md`
- `ops/time-allocation.md`, VA-hire SOP pack
- `ops/sales-tax-posture.md`, `ops/utm-conventions.md`
- `infrastructure/secrets-inventory.md`, `ops/paid-budget.md`
- `ops/manual-post-purchase-fallback.md`

**Email infrastructure:**
- Google Workspace DNS (MX/SPF/DKIM/DMARC) not configured
- mail-tester score gate unmet

**Bundles:**
- 12 bundle delivery folders exist
- 5 bundle product MDX on STRLedger
- 5 bundle email sequences drafted
- **Etsy/Gumroad bundle listings not published**

**Course automation:**
- `receipt-ocr-workflow.json` exists in `course-50k-deduction/deliverables/automation/` — **not imported to n8n**.

**Annual "What Changed" video** (W30 trigger) — bonus script drafted, no video.

---

## What this means in priority order

**The only "create from scratch" work left is:**
1. STRLaws state + city seed data (or scrape it once and let n8n maintain forever).
2. 7 blog post drafts.
3. Course videos (or skip video → ship text+template course).
4. Pinterest pin images (auto-renderable from briefs).
5. ~6 mini-magnet PDFs.

**Everything else is "finish and publish" work:**
- Render manuscripts → PDFs (pandoc/typst, ~1 day).
- Render briefs → lead-magnet PDFs (~1 day).
- Import 36 n8n workflows → live instance (~half day).
- Load 11 email sequences into IS (~half day once IS is provisioned).
- Open Etsy/Gumroad/KDP/Pinterest/Stripe live accounts (~1 day).
- Deploy STRLedger Astro + flip STRManuals BuyButton (~few hours).
- Write 3 legal pages × 6 sites (template → done in ~half day).
- Author ~10 ops runbooks (template + AI assist, ~1 day).

**Net effort to go from "all this drafted" to "all this earning":** roughly 2–3 focused weeks, the majority of which is account onboarding and deploy plumbing, not actual creation.
