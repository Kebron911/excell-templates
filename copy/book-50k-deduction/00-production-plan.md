# Production Plan — *The $50,000 Deduction*

**Status:** Living checklist · last updated 2026-04-26
**Owner:** Daniel Harrison
**Goal:** A 17-chapter paperback + Kindle book where every chapter is a paid-deduction lesson and a tracked funnel into a specific workbook, anchored by a single back-of-book CTA that drops Amazon buyers into a buyer-qualified variant of the existing nurture sequence — so book royalty is rounding error and the email list does the actual work.

**Pricing:** Kindle $2.99 (steady) · Paperback $9.99 · 5 free-promo days at launch via KDP Select
**Imprint:** The STR Ledger · Tax Series · Vol. 01

---

## Phase 0 — Foundation *(done before this plan was written)*

These items are the inputs. None should change without re-running downstream phases.

### 0.1 Brand & strategy
- [x] Brand identity locked v1.1 — see [brand/brand-decisions.md](brand/brand-decisions.md)
- [x] Pricing strategy decided — Kindle $2.99 / Paperback $9.99 / KDP Select with 5 free-promo days
- [x] Tripwire economics modeled — book royalty rounding error; email list is the asset
- [x] Persona anchor — Semi-Pro Sarah (38–55, female-skewing, 3–10 STR properties, $200K+ HHI)

### 0.2 Book architecture
- [x] 17-chapter outline (Frame · 47 Deductions · Edge Case · Systems) — in [chapter outline section, this thread]
- [x] Front-matter spec (title page, disclaimer, foreword, how-to-use)
- [x] Back-matter spec (Appendix A IRS code reference card, Appendix B workbook map, Appendix C glossary, inside back cover)
- [x] Funnel link map drafted — 17 `/cap/<n>` short links, each with destination + email tag
- [x] Master back-of-book CTA designed — `/47-book` → email-gated reader bonus → `source:book-buyer` nurture branch
- [x] Short-link mechanics specified — n8n webhook, Airtable `book_clicks` log, 90-day cookie attribution
- [x] Reader-only discount code specced — `STRBOOK30` ($30 off Tax Bundle, 90-day, single-use)

### 0.3 Already-produced deliverables
- [x] **Cover build spec** (Vista Create, paperback + spine + back + Kindle + 8-asset checklist + founder-arm variant) — [copy/book-50k-deduction/cover-spec.md](copy/book-50k-deduction/cover-spec.md)
- [x] **Amazon KDP listing copy** (title, subtitle, description HTML, 7 keywords, 2+5 categories, 5 A+ modules, editorial review, pre-launch checklist) — [copy/book-50k-deduction/amazon-listing.md](copy/book-50k-deduction/amazon-listing.md)
- [x] **Chapter 7 — Cost Segregation for the Rest of Us** (the Amanda showcase chapter) — [copy/book-50k-deduction/ch-07-cost-segregation.md](copy/book-50k-deduction/ch-07-cost-segregation.md)
- [x] **Cost Segregation DIY Workbook spec** (per Daniel — already done)
- [x] **Hero-magnet 21-day nurture sequence** (the parent the `source:book-buyer` branch will fork from) — [copy/email-sequences/nurture-hero-magnet.md](copy/email-sequences/nurture-hero-magnet.md)

### 0.4 Cross-deliverable issues to fix during Phase 1+ (already flagged)
- [x] **Listing description §168(k) line** — changed "what's left of it through 2027" to year-agnostic phrasing in amazon-listing.md line 47
- [x] **A+ Module 1 hero number** — decision: $50,000 (matches front cover and book title). Headline reframed in amazon-listing.md from Amanda's $8,427 specific recovery to portfolio-wide $30K–$60K range; Amanda kept as supporting proof point. Image direction updated to "$50,000."
- [x] **Cost Seg DIY Workbook SKU code + `/cap/07` redirect destination** — confirmed as `TAX-010` at [templates/_masters/TAX-010-cost-segregation-diy-DEMO.xlsx](templates/_masters/TAX-010-cost-segregation-diy-DEMO.xlsx); chapter and funnel references updated
- [x] **Listing copy "Depreciation Tracker" references** — Depreciation Tracker swapped for Cost Seg DIY Workbook (TAX-010) in A+ Module 5 image direction. Chapter Capture sidebars in Ch 5, 6, 8 already correctly reference TAX-004 (no edits needed; verified 2026-05-16).

---

## Phase 1 — Manuscript *(all chapters + front/back matter)*

### 1.1 Front matter
- [x] Title page (title, subtitle, byline, imprint) — DRAFT in [copy/book-50k-deduction/front-matter.md](copy/book-50k-deduction/front-matter.md) §1
- [x] Copyright + disclaimer page (general info / not tax advice / consult CPA / state-specific variations) — DRAFT in front-matter.md §2
- [x] **Foreword: "Why this book is short"** (~600 words, sets the editorial register) — DRAFT in front-matter.md §3
- [x] **How to use this book** (~400 words; the chapter→workbook map up front; permission to read out of order) — DRAFT in front-matter.md §4
- [x] **The recordkeeping pact** (1-page sidebar — "If it's not in a workbook, the IRS doesn't care that you remember it") — DRAFT in front-matter.md §5
- [ ] Table of contents (auto-generated from interior layout — Phase 2 task, not a writing task)

### 1.2 Part I — The Frame *(3 chapters · ~20 pages)*
- [x] **Ch 1 — Schedule E or Schedule C: the choice that changes everything** (deductions #1–2) — DRAFT COMPLETE [copy/book-50k-deduction/ch-01-schedule-e-or-c.md](copy/book-50k-deduction/ch-01-schedule-e-or-c.md); pending tax-pro review
- [x] **Ch 2 — What "ordinary and necessary" actually means** (deduction #3) — DRAFT COMPLETE [copy/book-50k-deduction/ch-02-ordinary-and-necessary.md](copy/book-50k-deduction/ch-02-ordinary-and-necessary.md); pending tax-pro review
- [x] **Ch 3 — The recordkeeping standard: what survives an audit** (no deduction; sets up workbook funnel) — DRAFT COMPLETE [copy/book-50k-deduction/ch-03-recordkeeping-standard.md](copy/book-50k-deduction/ch-03-recordkeeping-standard.md); pending tax-pro review

### 1.3 Part II — The 47 Deductions *(11 chapters · ~100 pages)*
- [x] **Ch 4 — Operating expenses: the recurring ten** (#4–13) — DRAFT COMPLETE [copy/book-50k-deduction/ch-04-operating-expenses.md](copy/book-50k-deduction/ch-04-operating-expenses.md); pending tax-pro review
- [x] **Ch 5 — Repairs vs. improvements: the line that changes the year** (#14–16) — DRAFT COMPLETE [copy/book-50k-deduction/ch-05-repairs-vs-improvements.md](copy/book-50k-deduction/ch-05-repairs-vs-improvements.md); pending tax-pro review
- [x] **Ch 6 — Building depreciation: MACRS 27.5 done right** (#17–18) — DRAFT COMPLETE [copy/book-50k-deduction/ch-06-building-depreciation.md](copy/book-50k-deduction/ch-06-building-depreciation.md); pending tax-pro review
- [x] **Ch 7 — Cost segregation for the rest of us *(Amanda's chapter)*** (#19–22) — DRAFT COMPLETE; pending tax-pro review
- [x] **Ch 8 — §179 + §168(k) bonus depreciation** (#23–25) — DRAFT COMPLETE [copy/book-50k-deduction/ch-08-section-179-and-bonus-depreciation.md](copy/book-50k-deduction/ch-08-section-179-and-bonus-depreciation.md); pending tax-pro review
- [x] **Ch 9 — Mileage, per-diem, lodging on property visits** (#26–30) — DRAFT COMPLETE [copy/book-50k-deduction/ch-09-mileage-per-diem-lodging.md](copy/book-50k-deduction/ch-09-mileage-per-diem-lodging.md); pending tax-pro review
- [x] **Ch 10 — Platform fees, software, banking** (#31–34) — DRAFT COMPLETE [copy/book-50k-deduction/ch-10-platform-fees-software-banking.md](copy/book-50k-deduction/ch-10-platform-fees-software-banking.md); pending tax-pro review
- [x] **Ch 11 — Professional services + 1099 contractors** (#35–38) — DRAFT COMPLETE [copy/book-50k-deduction/ch-11-professional-services-and-1099s.md](copy/book-50k-deduction/ch-11-professional-services-and-1099s.md); pending tax-pro review
- [x] **Ch 12 — Home office: exclusive use done by the book** (#39–40) — DRAFT COMPLETE [copy/book-50k-deduction/ch-12-home-office.md](copy/book-50k-deduction/ch-12-home-office.md); pending tax-pro review
- [x] **Ch 13 — Insurance, umbrella, and entity costs** (#41–43) — DRAFT COMPLETE [copy/book-50k-deduction/ch-13-insurance-umbrella-entity.md](copy/book-50k-deduction/ch-13-insurance-umbrella-entity.md); pending tax-pro review
- [x] **Ch 14 — Marketing, guest experience, education** (#44–46) — DRAFT COMPLETE [copy/book-50k-deduction/ch-14-marketing-guest-education.md](copy/book-50k-deduction/ch-14-marketing-guest-education.md); pending tax-pro review

### 1.4 Part III — The Edge Cases *(1 chapter · ~10 pages)*
- [x] **Ch 15 — The Augusta Rule + 14-day personal-use line** (#47) — DRAFT COMPLETE [copy/book-50k-deduction/ch-15-augusta-and-14-day-rule.md](copy/book-50k-deduction/ch-15-augusta-and-14-day-rule.md); pending tax-pro review

### 1.5 Part IV — The Systems *(2 chapters · ~20 pages)*
- [x] **Ch 16 — Amanda's 7-minute tax tab** (extends Email 5B story to 12-page system case study) — DRAFT COMPLETE [copy/book-50k-deduction/ch-16-amanda-seven-minute-tax-tab.md](copy/book-50k-deduction/ch-16-amanda-seven-minute-tax-tab.md); pending tax-pro review
- [x] **Ch 17 — The CPA handoff: what to send, how to send it, what to ask** — DRAFT COMPLETE [copy/book-50k-deduction/ch-17-cpa-handoff.md](copy/book-50k-deduction/ch-17-cpa-handoff.md); pending tax-pro review

### 1.6 Back matter
- [x] **Appendix A — IRS code reference card** (§162, §168(k), §179, §195, §263(a), §280A, §469, §1.263(a) and 40+ more) — DRAFT in [copy/book-50k-deduction/back-matter.md](copy/book-50k-deduction/back-matter.md) §1
- [x] **Appendix B — Workbook map** (every chapter → every product, with prices and SKU codes — this is the cross-sell page) — DRAFT in back-matter.md §2
- [x] **Appendix C — Glossary** (~45 terms, one line each) — DRAFT in back-matter.md §3
- [x] **Inside back cover insert** — printable QR + URL `thestrledger.com/47-book` + 30-word explainer (per cover-spec §3.6) — DRAFT in back-matter.md §5
- [x] About the publisher (110-word brand boilerplate from amazon-listing §7) — DRAFT in back-matter.md §4

### 1.7 Manuscript-wide standards
- [ ] *Capture* sidebar treatment standardized (Cormorant Italic, gold rule above, mono URL below) on every chapter end
- [ ] Every chapter cites at least one IRS code in body
- [ ] Every chapter contains at least one specific dollar figure (per §6.1 voice)
- [ ] Zero emojis. Zero exclamation points except in dialogue.
- [ ] Every "host" / "portfolio" usage honored; zero "side-hustler"
- [ ] Disclaimer pattern at end of every Part II chapter: "general info / not tax advice / qualified pro before filing"

### 1.8 Editorial review
- [ ] **Tax-professional review** — pay a CPA or EA to read for accuracy across all 47 deductions; budget $500–$1,500. Review brief drafted at [copy/book-50k-deduction/tax-pro-review-brief.md](copy/book-50k-deduction/tax-pro-review-brief.md) — send with the manuscript when engaging the reviewer
- [ ] **Brand voice pass** — read every chapter against [brand/brand-decisions.md](brand/brand-decisions.md) §6.1, §6.2, §6.3 and rewrite anything that fails the voice tests
- [ ] **Copy edit pass** — line-level prose, consistency, jargon-strip
- [ ] **Proofread pass** — fresh eyes, ideally not the writer or copy editor
- [ ] **Beta reader pass** — 3–5 actual STR hosts (FB Inner Circle group), feedback collected against a 5-question form

---

## Phase 2 — Design & layout *(cover + interior + companion assets)*

### 2.1 Cover artboards (per [cover-spec.md](copy/book-50k-deduction/cover-spec.md) §6 asset checklist)
- [ ] Front cover — paperback (1500 × 2400 px) — Variant A vertical hierarchy
- [ ] Spine — calculated × 2400 px (recompute from final page count)
- [ ] Back cover — paperback (1500 × 2400 px) — with finalized 95–119 word blurb
- [ ] Full wrap — assembled for KDP upload (use KDP cover calculator for exact spec)
- [ ] Kindle eBook (1600 × 2560 px)
- [ ] Inside back-cover insert (5×8" — printed on interior page 159, not the cover wrap)
- [ ] Amazon A+ header banner (970 × 600 px)
- [ ] Pinterest pin variant (1000 × 1500 px)

### 2.2 Cover detail confirmations
- [ ] "$" glyph on front cover renders Muted Gold `#C9A24B` after CMYK conversion
- [ ] Terminal periods on "Deduction." and "STR Ledger." render Muted Gold across cover, spine, back
- [ ] "47" in subtitle renders Muted Gold (matches the gold "$" — both numbers rhyme visually)
- [ ] Type converted to outlines on export
- [ ] Bleed extends 0.125" past trim on all outer edges
- [ ] No live type within 0.25" of trim or spine fold

### 2.3 Founder-arm variant *(optional, decision-gated — do or skip)*
- [ ] Decision: faceless byline only, OR faceless + founder variant
- [ ] If founder: front cover byline reflowed to "by Daniel Harrison" per cover-spec §7.1
- [ ] If founder: back cover author photo (320×320, Harbor Navy duotone, no full-color headshot)
- [ ] If founder: 30-word bio (the audit-recovery framing) per cover-spec §7.3
- [ ] If founder: spine foot label changed to `D. HARRISON`

### 2.4 Interior typography spec (must be created)
- [ ] Body face: serif companion to Cormorant for long-form readability (recommend EB Garamond or Crimson Pro at 11/15 pt — Cormorant at body sizes is too tight for 160 pages of prose)
- [ ] Display face: Cormorant Garamond (chapter openers, headings)
- [ ] Mono accent face: JetBrains Mono (URLs, SKUs, *Capture* sidebar URL line)
- [ ] Page size 5×8", margins 0.75" outer / 0.6" inner / 0.7" top / 0.75" bottom
- [ ] Running heads: even page = book title (small caps Inter 9pt), odd page = chapter title (italic Cormorant 9pt)
- [ ] Page numbers: bottom outer corner, JetBrains Mono 10pt, Graphite
- [ ] Drop caps on chapter openers (Cormorant Medium, 4-line, Muted Gold)
- [ ] Pull-quote treatment (Cormorant Italic, Graphite, indented, gold rule above and below)

### 2.5 Standardized in-chapter elements
- [ ] *Capture* sidebar template (gold rule, Cormorant Italic ask, mono URL)
- [ ] IRS code citation styling (mono inline, Muted Gold)
- [ ] Worked-example tables (Inter body, Harbor Navy header row, alt-row Parchment shading)
- [ ] Chapter-end disclaimer microcopy (italic, smaller, Graphite at 70%)

### 2.6 Production layout (the actual book)
- [ ] Choose layout software (recommend Adobe InDesign or open-source Vellum/Affinity Publisher — NOT Word/Google Docs for production)
- [ ] Build paragraph + character styles matching the typography spec
- [ ] Pour Phase 1 manuscripts into the master template
- [ ] Resolve all widow/orphan and bad-break issues
- [ ] Generate KDP-spec PDF: PDF/X-1a:2001, embedded fonts, 300 DPI image minimum
- [ ] Confirm final page count and recalculate spine width

### 2.7 Pinterest + A+ companion imagery
- [ ] Pinterest pin variant (master design + 5 angled variants per the content plan multiplier)
- [ ] A+ Module 1 hero banner (per Cross-Issue #2 above — decide $ figure)
- [ ] A+ Module 2 four-quadrant grid (4 chapter-teaser images)
- [ ] A+ Module 3 portfolio summary image
- [ ] A+ Module 4 page-spread mockup (Ch 9 sample)
- [ ] A+ Module 5 three-workbook cover row (Schedule E, Depreciation Tracker, Mileage Log) — no URLs in image text

---

## Phase 3 — Funnel infrastructure *(every link in the book must work)*

### 3.1 Short-link router (n8n)
- [ ] Single n8n webhook on `n8n.thestrledger.com` accepting `<n>` as path param
- [ ] Logs each click to Airtable `book_clicks` table (timestamp, chapter, referrer, country, cookie_id)
- [ ] 302 redirects to destination with appended UTM (`utm_source=book&utm_medium=print&utm_campaign=50k-deduction&ch=<n>`)
- [ ] Sets 90-day cookie on first hit
- [ ] If cookie matches existing email subscriber → tag contact `book:ch-<n>:clicked`
- [ ] If no match → cookie persists; next email-capture event attaches chapter history at enrollment

### 3.2 Per-chapter destinations *(17 short links)*
- [ ] `/cap/01` → Entity Decision Flowchart landing (free PDF, email gate, tag `entity-decision`)
- [ ] `/cap/02` → `/47-book` — anchor capture
- [ ] `/cap/03` → Schedule E Workbook ($97), tag `audit-prep`
- [ ] `/cap/04` → Single-Property P&L (TAX-002, $37), tag `operating-exp`
- [ ] `/cap/05` → Schedule E Workbook (TAX-004, depreciation tab), tag `capex`
- [ ] `/cap/06` → Schedule E Workbook (TAX-004, depreciation tab), tag `depreciation`
- [ ] `/cap/07` → **Cost Seg DIY Workbook (TAX-010)**, tag `cost-seg` *(workbook exists; landing page + redirect still to wire)*
- [ ] `/cap/08` → Schedule E Workbook (TAX-004, depreciation tab), tag `section-179`
- [ ] `/cap/09` → Mileage + Per-Diem combo ($25), tag `mileage-perdiem`
- [ ] `/cap/10` → Single-Property P&L (TAX-002, $37), tag `platform-fees`
- [ ] `/cap/11` → 1099-NEC Tracker (TAX-003, $17), tag `contractors`
- [ ] `/cap/12` → Home Office Allocator (TAX-006, $27), tag `home-office`
- [ ] `/cap/13` → Single-Property P&L (TAX-002, $37), tag `insurance`
- [ ] `/cap/14` → Welcome Book (GST-001, $37), tag `marketing`
- [ ] `/cap/15` → Quarterly Estimated Tax (TAX-005, $47), tag `augusta-edge-cases`
- [ ] `/cap/16` → Tax Season Bundle ($147), tag `bundle-ready`
- [ ] `/cap/17` → Tax Season Bundle ($147), tag `cpa-handoff`

### 3.3 Master funnel — `/47-book` landing page
- [ ] Clone the `/47` landing page; rename, change open headline to "Thanks for buying *The $50,000 Deduction* — here's the companion checklist"
- [ ] Copy mirrors §6.1 voice; problem-first, specific dollar figures
- [ ] Email gate (single field: email; double opt-in confirm if list policy requires)
- [ ] On submit → tag `source:book-buyer`
- [ ] Deliver: printable PDF + Excel "47-Deduction Audit Checklist (Book Reader Edition)"
- [ ] Confirm download asset includes mapping each deduction → Schedule E line + matching workbook

### 3.4 `source:book-buyer` nurture branch *(modified clone of the 21-day hero sequence)*
- [ ] Clone the 9-email hero sequence from [copy/email-sequences/nurture-hero-magnet.md](copy/email-sequences/nurture-hero-magnet.md)
- [ ] **Email 1 first paragraph** swap — acknowledge book purchase ("You already paid $2.99 to read about 47 deductions. The next move is the system that captures them.")
- [ ] **Email 4 (tripwire)** swap — Mileage Log → Schedule E Workbook ($97); book buyers skip the $17 step
- [ ] **Email 9 (bundle)** — append the `STRBOOK30` discount code; net price $117 instead of $147
- [ ] All other emails identical to hero variant
- [ ] Test the full 21-day arc with a test contact before going live

### 3.5 Reader discount code
- [ ] `STRBOOK30` provisioned in storefront (Influencersoft / Etsy / wherever Tax Bundle sells)
- [ ] Valid 90 days from email-entry timestamp
- [ ] Single-use per contact
- [ ] $30 off Tax Bundle ($147 → $117)
- [ ] Test redemption end-to-end before launch

### 3.6 Workbooks the chapters point to *(verify each exists and points to a clean checkout)*
- [x] TAX-001 Mileage Log — exists in repo
- [x] TAX-002 P&L Single Property — exists in repo
- [x] TAX-003 1099-NEC Tracker — exists in repo
- [x] TAX-004 Schedule E Tax Prep — exists in repo
- [x] TAX-005 Quarterly Estimated Tax — exists in repo
- [x] TAX-006 Home Office Allocator — exists in repo
- [x] TAX-007 Per-Diem Meal Tracker — exists in repo
- [x] GST-001 Welcome Book — exists in repo
- [x] **Cost Seg DIY Workbook (TAX-010)** — exists at [templates/_masters/TAX-010-cost-segregation-diy-DEMO.xlsx](templates/_masters/TAX-010-cost-segregation-diy-DEMO.xlsx)
- [x] **Depreciation Tracker** — confirmed: tab inside TAX-004 Schedule E Workbook, NOT a standalone SKU. Update Ch 5/6/8 *Capture* sidebars and the listing copy A+ Module 5 to reflect this
- [x] **Entity Decision Flowchart — content & design spec** ([copy/lead-magnets/entity-decision-flowchart.md](copy/lead-magnets/entity-decision-flowchart.md)) — 4-page Vista Create build, decision tree, substantial-services + material-participation reference cards, outcomes & CTA, IRS code citations verified
- [ ] **Entity Decision Flowchart — Vista Create build + PDF export** — render spec into print-quality PDF, save to `templates/_delivery/_shared/entity-decision-flowchart.pdf`
- [ ] All workbook listings have stable URLs the `/cap/` redirects can target

### 3.7 Click & conversion tracking
- [ ] Airtable base + `book_clicks` table created (5 columns: timestamp, chapter, referrer, country, cookie_id)
- [ ] Airtable `book_emails` table — log every `source:book-buyer` capture with cookie history
- [ ] Weekly review automation — n8n cron sends Daniel a summary every Monday for the first 90 days post-launch (chapter clicks, captures, code redemptions, bundle conversions)

---

## Phase 4 — Amazon KDP setup

### 4.1 Pre-publish admin
- [ ] **Author Central account** registered for "The STR Ledger" at `author.amazon.com`
- [ ] **USPTO trademark quick-search** confirmed clean for "The STR Ledger" + "STR Ledger" *(open item from brand-decisions §11)*
- [ ] **ISBN decision** — accept free KDP-issued ISBN for paperback Year 1 *(or buy a Bowker ISBN ~$125 if off-Amazon distribution is anticipated within 12 months)*
- [ ] Kindle ASIN auto-assigned at upload (no action)

### 4.2 KDP listing entry *(everything in [amazon-listing.md](copy/book-50k-deduction/amazon-listing.md))*
- [ ] Title field: `The $50,000 Deduction`
- [ ] Subtitle field: `47 Write-Offs Every STR Host Should Be Claiming`
- [ ] Author field: `The STR Ledger`
- [ ] Description field: HTML block from amazon-listing.md §3 *(after the §168(k) edit per Cross-Issue #1)*
- [ ] 7 keywords entered per amazon-listing.md §4
- [ ] 2 primary BISAC categories entered (BUS064020 + BUS064040)
- [ ] Pricing — Kindle $2.99, Paperback $9.99
- [ ] Royalty tier — 70% on Kindle (auto, since priced $2.99–$9.99)
- [ ] **KDP Select enrollment — YES** (90-day Amazon eBook exclusivity unlocks free promos + Countdown Deals + KU royalties)
- [ ] **Pre-order** — NO. Publish direct, concentrate Day-1 velocity
- [ ] A+ content modules built in KDP A+ Manager (5 modules per amazon-listing.md §6)

### 4.3 Author Central category requests *(within 48h of go-live)*
- [ ] Open KDP support ticket requesting: BUS064030, BUS103040, BUS088000, REF026000 (per amazon-listing.md §5)
- [ ] Track ticket; categories add silently — verify by checking the live listing's category list weekly

### 4.4 Free-promo schedule (KDP Select gives 5 days per 90-day cycle)
- [ ] Days 3–4 of launch week — first 2 free days (maximize "Hot New Releases" rank momentum)
- [ ] Tax-season Q1 — 1 free day per week, weeks 10–12 of cycle (3 days)
- [ ] All 5 days exhausted within first cycle; reassess at 90-day re-enrollment

---

## Phase 5 — Pre-launch QA *(do not skip — this is the layer that catches broken links in print)*

### 5.1 Print proof
- [ ] Order paperback proof copy through KDP
- [ ] Read out loud cover-to-back — find prose tics, factual errors, broken sentences
- [ ] Check spine alignment, gutter margins, bleed, page numbers, running heads
- [ ] Scan the inside-back-cover QR with three different phones (iOS native, Android native, off-brand) — confirm all three resolve to `/47-book`
- [ ] Verify all 17 *Capture* URLs are typed correctly *(typo in print is permanent — proof every URL twice)*

### 5.2 Cover review
- [ ] Front cover at 200 px wide thumbnail — confirm "$50,000" and "Deduction." both legible
- [ ] Cover meets brand-decisions §3 (Cormorant display, Harbor Navy + Parchment + Muted Gold, monogram on spine and back)
- [ ] CMYK shift on Harbor Navy didn't muddy the color
- [ ] Gold accents (period, "$" glyph, "47", rules) all rendered

### 5.3 Description + listing QA
- [ ] Description HTML preview correctly on Amazon desktop
- [ ] Description HTML preview correctly on Amazon mobile app
- [ ] `<h2>`, `<b>`, `<i>`, `<ul>`, `<li>`, `<br>` all render as expected
- [ ] Above-the-fold (first ~3 lines pre-cutoff) leads with the $8,427 hook
- [ ] Keywords spelled correctly and not duplicated across slots
- [ ] Categories accept on KDP form

### 5.4 Funnel end-to-end test
- [ ] Click each `/cap/01` through `/cap/17` from a fresh browser session — confirm 302 to right product, UTM appended, Airtable logs the row
- [ ] Submit `/47-book` form with a test email → confirm tag `source:book-buyer` applied → confirm Email 1 fires → confirm subsequent emails fire on schedule
- [ ] Test `STRBOOK30` redemption end-to-end on the Tax Bundle checkout

### 5.5 ARC (Advance Reader Copy) program
- [ ] Recruit 5–10 ARC readers from the FB Inner Circle group
- [ ] Ship Kindle .mobi/.epub files Day 0
- [ ] Ask for honest reviews on Day 7 (not 5-star reviews specifically — Amazon TOS violation)
- [ ] Provide a review-day-of email template with the link to the live listing

### 5.6 Tax & legal
- [ ] Final tax-pro review pass on the manuscript (post copy-edit, pre-print)
- [ ] Disclaimer language reviewed by anyone with state-law sensitivity (e.g., CA hosts may have additional considerations)
- [ ] Confirm no client/personal-data accidentally embedded anywhere in book or A+ imagery

---

## Phase 6 — Launch *(Day 0 onward, ~14-day window)*

### 6.1 Day 0 — Publish
- [ ] Hit Publish on Kindle (live within 24 hours)
- [ ] Hit Publish on paperback (live within 72 hours after KDP review)
- [ ] Verify both formats linked on the same Author Central detail page

### 6.2 Day 1–2 — Awareness
- [ ] Email broadcast to existing list — soft announce, no hard pitch (the book is the pitch)
- [ ] Pinterest — publish 5 pins (master design + 4 variant angles) linking to the Amazon listing
- [ ] Instagram — single post with cover, brand voice, link in bio
- [ ] Blog — publish a "behind the book" post tying to existing blog post #1 (airbnb tax deductions)
- [ ] FB Inner Circle group — drop a single post inviting members to leave honest reviews

### 6.3 Day 3–4 — Free promo days (KDP Select)
- [ ] Schedule free-day promo in KDP days 3 and 4
- [ ] Free Day 1 — email nudge: "free today, 47 deductions, the $8,427 chapter"
- [ ] Free Day 2 — Pinterest + Instagram refresh, "last day free"
- [ ] Monitor Hot New Releases rank in BUS064020 and BUS064040 categories — screenshot each day

### 6.4 Day 5–14 — Review velocity push
- [ ] ARC readers asked for reviews on Day 7
- [ ] Existing email list reminded once on Day 10 if conversion soft
- [ ] Track: paperback orders, Kindle units, KU page-reads, A+ click-through (Amazon's reporting pane)
- [ ] First Author Central category-request ticket follow-up if categories haven't appeared by Day 7

### 6.5 Tax-season Q1 push *(if launching before Jan 1)*
- [ ] Burn 3 remaining free-promo days across weeks 10–12 of KDP Select cycle
- [ ] Pinterest tax-season tagline pairs (control + challenger per the active A/B test in brand-decisions §6.4)
- [ ] Email broadcast on Jan 2 anchored on the Q1 tax-season campaign tagline

---

## Phase 7 — Post-launch *(90-day learning loop)*

### 7.1 Metrics to watch (weekly Monday review)
- [ ] Kindle units sold per week
- [ ] Paperback units sold per week
- [ ] KU page-reads (KDP Select bonus revenue)
- [ ] Reviews count + average rating
- [ ] Bestseller rank in primary categories — screenshot weekly
- [ ] `/cap/<n>` clicks per chapter (which chapters convert hardest?)
- [ ] `source:book-buyer` email captures
- [ ] `STRBOOK30` redemptions
- [ ] Tax Bundle revenue attributable to book funnel (UTM-tagged)

### 7.2 90-day decision gates
- [ ] **Re-enroll in KDP Select?** YES if Kindle Unlimited page-reads are >= meaningful-revenue threshold; NO if no KU traction (then go wide to Apple Books / Google Play / B&N Press)
- [ ] **Build Vol. 02?** Decide based on which chapters had the highest `/cap/` click rate — that's the topic surface for the next book
- [ ] **Audiobook (ACX)?** Greenlight if Kindle units > 500/mo sustained; otherwise defer
- [ ] **Founder-arm variant?** Reissue with Daniel byline if faceless reviews underperform expectations and the founder voice testing on the brand's other channels has converted

### 7.3 Living-content updates
- [ ] Annual IRS rate-table refresh in Appendix A (every January)
- [ ] Mileage rate updates — verify each January, push a free Kindle update with the corrected number
- [ ] §168(k) bonus depreciation rate — verify each January, update Ch 7 + Ch 8 if law moves
- [ ] Republish Kindle update, leave paperback alone until reprint cycle

---

## Phase summary scorecard

| Phase | Items | Done | In progress | To do |
|---|---|---|---|---|
| **0 — Foundation** | 18 | 18 | 0 | 0 |
| **0.4 — Cross-issues** | 4 | 1 | 0 | 3 |
| **1 — Manuscript** | 35 | 27 | 0 | 8 |
| **2 — Design & layout** | 28 | 0 | 0 | 28 |
| **3 — Funnel infrastructure** | 34 | 11 | 0 | 23 |
| **4 — KDP setup** | 16 | 0 | 0 | 16 |
| **5 — Pre-launch QA** | 19 | 0 | 0 | 19 |
| **6 — Launch** | 17 | 0 | 0 | 17 |
| **7 — Post-launch** | 14 | 0 | 0 | 14 |
| **TOTAL** | **185** | **57** | **0** | **128** |

**Completion: ~31%** — **The full manuscript is drafted.** Title page, copyright/disclaimer, foreword, how-to-use, recordkeeping pact, Chs 1–17, Appendix A (IRS code reference), Appendix B (workbook map), Appendix C (glossary), about the publisher, and inside-back-cover insert are all written. Only the auto-generated TOC remains. The book is pencils-down for tax-pro review and Phase 2 production. All design/strategy specs written, TAX-010 in repo, Entity Decision Flowchart spec complete. Remaining 69% is the tax-pro review pass, Vista artwork (cover + entity flowchart + A+ imagery + interior layout), n8n short-link wiring, nurture-branch fork, and KDP ship.

---

## Critical path

The shortest defensible route from here to launch:

1. **Write the remaining 16 chapters** *(Phase 1 — biggest cost in time and the only thing that gates everything)*
2. **Tax-pro review** *(blocks legal go-live, can run parallel to Phase 2)*
3. **Build artboards in Vista Create** *(Phase 2.1 — depends on final page count from interior layout)*
4. **Wire `/cap/<n>` short links and `/47-book` page** *(Phase 3 — must be done before print, because URLs are permanent in print)*
5. **Build the Cost Seg DIY Workbook** *(Phase 3.6 — Ch 7 already cites it; can't print until it exists)*
6. **Print proof + funnel QA** *(Phase 5 — the gate before Publish)*
7. **Publish + free promo days 3–4** *(Phase 6 — the launch arc)*

Everything else is parallel work or post-launch optimization. If chapters and tax review move, the launch moves with them.

---

*End of plan. Update the checkboxes as items complete; recompute the Phase summary scorecard at each weekly review.*
