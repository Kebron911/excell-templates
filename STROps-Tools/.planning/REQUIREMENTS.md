# strops.tools — REQUIREMENTS

Derived from [design spec](../docs/superpowers/specs/2026-05-05-strops-tools-design.md). Cluster-shared requirements (R2 page template, R3 calc UX, R5 brand, R6 monetization core, R7 SEO, R8 deploy) inherit from [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md). Local extensions are explicit per requirement.

---

## R1 — Seven tools ship

| ID | Tool | Primary keyword | Route |
|----|------|-----------------|-------|
| R1.1 | Turnover scheduler | "airbnb turnover scheduler" | `/turnover-scheduler` |
| R1.2 | Cleaner dispatch generator | "airbnb cleaner sms template" | `/cleaner-dispatch` |
| R1.3 | Smart lock code rotator | "airbnb smart lock code generator" | `/smart-lock-codes` |
| R1.4 | Linen par calculator | "airbnb linen par calculator" | `/linen-par-calculator` |
| R1.5 | Restock alert calculator | "airbnb supply restock calculator" | `/restock-calculator` |
| R1.6 | Damage cost lookup | "cost to replace [item] in airbnb" | `/damage-cost-lookup` + `/replace/[item]` |
| R1.7 | Maintenance schedule generator | "airbnb maintenance schedule" | `/maintenance-schedule` + `/maintenance/[task]` |

**Verification:** Vitest green for each tool's pure-function math/logic; Playwright smoke green for each route.

---

## R2 — Per-tool page template (extends cluster R2)

Inherits the canonical 12-element template from strhost.tools. **strops-specific extensions:**

- **`<PdfDownloadButton />`** inserted between calculator (#2) and in-content ad (#3) on PDF-producing tools (R1.2, R1.7) — net 13 elements
- **`<AffiliateCard />`** (soft placement) inserted between FAQ (#7) and footer ad (#9) — content-styled, after value
- Email capture density elevated: per-tool magnet matchup defined in `src/data/tools.json`

Word-count target 1,500–2,000 words across bolded sections.

**Verification:** DOM presence test confirms PdfDownloadButton on PDF tools and AffiliateCard on every tool page.

---

## R3 — Calculator/generator interaction model

*Inherits from strhost.tools R3 verbatim.* **Cluster-specific:**

- **Turnover scheduler** — multi-property; URL state encodes property list + bookings as compressed param
- **Cleaner dispatch generator** — outputs assignment table + SMS templates; `<PdfDownloadButton />` produces branded `pdf-lib` document
- **Smart lock code rotator** — deterministic algorithm (booking ID hash → code); reproducibility test required
- **Damage cost lookup** — searchable table backed by `items.json`; selecting item navigates to `/replace/[item]`
- **Maintenance schedule generator** — input property profile → annual schedule; `<PdfDownloadButton />` + `.ics` export

**Verification:** Playwright tests confirm URL state round-trips; smart-lock-codes generate same code for same booking ID across runs (deterministic test).

---

## R4 — Programmatic page system (maintenance + replacement)

- **Maintenance pages:** `/maintenance/[task]` (~30 tasks). Data: `src/data/tasks.json` (name, cadence, instructions, recommended vendors, lastVerified)
- **Replacement pages:** `/replace/[item]` (~50 items). Data: `src/data/items.json` (name, costRange, lifespan, brandRecs with affiliate links, how-to-replace, related items)
- Per-task / per-item narrative MDX in `src/content/maintenance/<task>.mdx` and `src/content/replace/<item>.mdx` (5 sample MDX each at launch; rest fall back to template)
- Index pages at `/maintenance/` and `/replace/`
- Annual-review script flags entries with `lastVerified` older than 12 months

**Verification:** Build produces ~30 maintenance pages + ~50 replacement pages; both indexes list everything; sort works.

---

## R5 — Brand layer (extends cluster R5)

*Inherits brand tokens, type stack, JetBrains Mono numerics from strhost.tools R5.*

**Cluster-specific:**
- **Accent color:** ops-utility green-gray (HEX TBD during Task 2)
- Wordmark: "strops.tools" in Inter Tight Semibold
- Type stack identical: Inter primary, Cormorant accent, JetBrains Mono numbers
- Generated PDFs use co-branded templates with brand header/footer

---

## R6 — Monetization layer (extends cluster R6)

*Inherits AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock contracts from strhost.tools R6.*

**Local additions:**

- **`<PdfDownloadButton tool="..." />`** — triggers `pdf-lib` generation; emits `pdf_downloaded` GA4 event with tool slug
- **`<AffiliateCard vendor="..." tool="..." />`** — soft, after value. Vendor data in `src/data/affiliates.json`. **No FTC banner site-wide** (vs strbuyers.tools' AffiliateBlock model) — disclosure inline on the card only.
- **Three lead magnets** — Cleaner SOP / Maintenance Checklist / Supply Par-Level Sheet. Tool→magnet matchup in `src/data/tools.json`.

**Vendor matchups (defaults):**
- Smart locks: August, Schlage, RemoteLock (R1.3 + lock-related replace pages)
- Noise monitors: Minut, NoiseAware
- PMS: Hostfully, Hospitable, OwnerRez
- Cleaning marketplaces: TurnoverBnB / Turno (R1.1, R1.2)
- Replacement vendors on `/replace/[item]` pages

**Verification:** PdfDownloadButton produces a downloadable PDF; AffiliateCard renders with inline FTC disclosure; magnet matchup serves correct lead magnet per tool.

---

## R7 — SEO + analytics

*Inherits from strhost.tools R7.* **Cluster-specific events:**

- `pdf_downloaded` — fires on PdfDownloadButton click
- `affiliate_card_clicked` — soft affiliate
- `magnet_email_captured` — per-magnet attribution
- `ics_exported` — maintenance schedule .ics export

**Verification:** GA4 receives events; Lighthouse SEO ≥ 95 on each tool page.

---

## R8 — Build, CI, deploy

*Inherits from strhost.tools R8.* No server component (PDFs and .ics are browser-side).

**Verification:** Push to `main` triggers green CI + automatic FTP deploy of static dist.

---

## R9 — Performance, accessibility

*Inherits from strhost.tools R9 + R10.* **Cluster-specific:**

- `pdf-lib` lazy-loaded only on PDF-producing tool pages (don't bloat global JS bundle)
- AffiliateCard does NOT block first paint
- Smart-lock-codes generation runs in <50ms for any booking ID input

---

## R10 — PDF output quality

- All PDFs use branded header (wordmark + tagline) and footer (URL + page number)
- All PDFs include "Generated on YYYY-MM-DD" timestamp
- Cleaner SOP + Maintenance Schedule + Dispatch Sheet share a base template (`src/lib/pdf/base.ts`)
- Tool-specific PDFs override only the body content, not the chrome

**Verification:** Manual visual inspection of each tool's PDF output; PDF metadata includes title and author.
