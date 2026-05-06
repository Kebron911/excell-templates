# strbuyers.tools — REQUIREMENTS

Derived from [design spec](../docs/superpowers/specs/2026-05-05-strbuyers-tools-design.md). Cluster-shared requirements (R2 page template, R3 calc UX, R5 brand, R6 monetization core, R7 SEO, R8 deploy) inherit from [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md). Local extensions are explicit per requirement.

---

## R1 — Seven calculators ship

| ID | Tool | Primary keyword | Route |
|----|------|-----------------|-------|
| R1.1 | STR mortgage qualifier (DSCR) | "dscr loan calculator str" | `/dscr-calculator` |
| R1.2 | Down payment calculator (by loan type) | "airbnb down payment calculator" | `/down-payment-calculator` |
| R1.3 | Comp analyzer (paste 3 listings) | "airbnb comp analyzer" | `/comp-analyzer` |
| R1.4 | Market score tool | "is airbnb profitable in [city]" | `/market-score` + `/cities/[city]` |
| R1.5 | Cash-on-cash return calculator | "airbnb cash on cash" | `/cash-on-cash-calculator` |
| R1.6 | Year 1 cash needs calculator | "airbnb startup cost calculator" | `/year-1-cash-needs` |
| R1.7 | Furnishing budget calculator | "airbnb furnishing budget" | `/furnishing-budget` |

**Verification:** Vitest green for each calculator's pure-function math; Playwright smoke green for each route.

---

## R2 — Per-tool page template (extends cluster R2)

Inherits the canonical 12-element template from strhost.tools with **two cluster-specific additions**:

- **AffiliateBlock** inserted between "How it works" (#4) and email capture (#5). Renders 1–3 vendor cards with FTC disclosure inline.
- **DisclosureBanner** at top of any page that includes an AffiliateBlock; full `/disclosures` page linked from footer.

Net layout: 14 elements per tool page. Word-count target 1,500–2,000 words across bolded sections.

**Verification:** DOM presence test confirms AffiliateBlock + DisclosureBanner render on every calculator page.

---

## R3 — URL state + share + print

*Inherits from strhost.tools R3 verbatim.*

**Cluster-specific:**
- DSCR calculator outputs include lender-tier label (e.g., "Visio 1.0+ DSCR program") that links to matched lender's affiliate URL
- Comp analyzer URL state encodes the 3 pasted listings as compressed params (still shareable; ~140 char URL ceiling)
- Market score tool: `/cities/[city]` is pre-rendered for 200 cities; `/market-score` is a search-and-redirect UX

**Verification:** Playwright tests confirm URL state round-trips for DSCR + comp analyzer; `/market-score` redirects correctly to `/cities/[city]`.

---

## R4 — 200-city market data system

- Data source: `src/data/cities.json` (200 markets) — name, state, score, ADR, occupancy, RevPAR, regulation status, sourceUrl, lastVerified
- 200 programmatic pages via `getStaticPaths`
- Per-city narrative MDX in `src/content/cities/<city>.mdx` (5 sample MDX files at launch; rest use template fallback)
- Index page at `/cities/` is a sortable/filterable table (state filter, score sort, ADR sort)
- Annual-review script flags entries with `lastVerified` older than 12 months

**Verification:** Build produces 200 city HTML files; index lists all 200; sort/filter work without JS errors.

---

## R5 — Brand layer (extends cluster R5)

*Inherits brand tokens, type stack, JetBrains Mono numerics from strhost.tools R5.*

**Cluster-specific:**
- **Accent color:** finance-trust deeper blue (HEX TBD during Task 2 from Excel-Templates token review)
- Wordmark: "strbuyers.tools" in Inter Tight Semibold
- AffiliateBlock and DisclosureBanner styled as content cards (not banner ads); inline disclosure copy in body-text size

---

## R6 — Monetization layer (extends cluster R6)

*Inherits AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock contracts from strhost.tools R6.*

**Local additions:**

- **`<AffiliateBlock vendor="..." tool="..." />`** — renders 1–3 vendor cards with FTC disclosure inline; click tracking hits `/api/click` (Node.js endpoint, R8.1); UTM tags appended; vendor data lives in `src/data/affiliates.json` (10 vendors at launch).

  **Per-tool default vendor matchups:**
  - DSCR calculator → Visio, Kiavi
  - Down payment / cash-on-cash → DSCR lenders + STR insurance
  - Comp analyzer / market score → AirDNA, PriceLabs, Mashvisor
  - Year 1 cash needs → STR insurance + furniture
  - Furnishing budget → Stage by Hand, Minoan

- **`<DisclosureBanner />`** — visible at top of pages with AffiliateBlock; links to full `/disclosures` page

- **Lead magnet:** "STR Buyer Due-Diligence Checklist 2026" (PDF stub at launch)

**Verification:** Each component renders; UTM tags correct; click logging endpoint receives event; FTC disclosure visible without scrolling on AffiliateBlock pages.

---

## R7 — SEO + analytics

*Inherits from strhost.tools R7.* Cluster-specific events:

- `affiliate_click`, `lender_tier_link_clicked` — fired on AffiliateBlock interaction
- `comp_listings_pasted` — fires when user submits comp analyzer input

**Verification:** GA4 receives events with correct UTM payloads; Lighthouse SEO ≥ 95 on calculator pages.

---

## R8 — Build, CI, deploy (extends cluster R8)

*Inherits CI pipeline + FTP deploy from strhost.tools R8.* Cluster-specific:

- **R8.1 — Click endpoint** — Express + MySQL Node app deployed alongside static dist on Hostinger Business; receives POST `/api/click` and inserts row to MySQL
- MySQL schema: single `affiliate_clicks` table with vendor, tool, timestamp, IP hash, UTM payload
- Schema migration script in `server/db/schema.sql` runs idempotently on deploy

**Verification:** Push to `main` deploys both static dist and Node click endpoint; click endpoint receives POST with 200 response; MySQL row inserted.

---

## R9 — Performance, accessibility

*Inherits from strhost.tools R9 + R10.* Cluster-specific:

- AffiliateBlock and DisclosureBanner do NOT block first paint
- Lighthouse Performance ≥ 90 on a calculator page (mobile)
- axe-core: zero serious violations on every calculator page

---

## R10 — FTC + legal compliance

- FTC disclosure inline on every page that contains an AffiliateBlock (above the fold of the AffiliateBlock)
- `/disclosures` full page linked from footer on every page
- Affiliate links use `rel="sponsored"`
- Lender-tier labels do not present financial advice; copy is descriptive, not prescriptive

**Verification:** Manual audit pass during pre-launch smoke; HTML grep confirms `rel="sponsored"` on all affiliate URLs.
