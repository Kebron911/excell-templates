# Airtable Base Schema — STR Platform — Master

Single source of truth for the entire business. Every other system reads from or writes to this base via n8n.

**Base name:** `STR Platform — Master`

**Base ID:** `<paste from Airtable URL after creation — format appXXXXXXXXXXXXXX>`

**Workspace:** `<your workspace name>`

**Claude MCP connected:** `<true / false — verify after Task P1 completes>`

---

## Table 1: Products

Primary source of truth for every template in the catalog.

| Field name | Type | Options / Notes |
|---|---|---|
| `SKU` | Single line text (Primary) | Format: `CAT-NNN`. E.g., `TAX-001`, `OPS-002`, `GST-001`. See SKU conventions in template-production-process.md |
| `Name` | Single line text | Customer-facing product name |
| `Category` | Single select | Financial, Acquisition, Ops, Guest, Pricing, Marketing, Legal, Team, Strategic, Specialty |
| `Tier` | Single select | T0, T1, T2, T3, T4, T5, T6 |
| `Status` | Single select | Draft, Ready, Published, Retired |
| `Short description` | Long text | 1-2 sentences, used in listing meta |
| `Full description` | Long text | 150–300 words, used as primary listing body |
| `Tags` | Multiple select | Etsy keyword tags — allow free tagging; common values: airbnb, vrbo, str, tax, accounting, excel, template, spreadsheet, mileage, deductions, 1099, schedule-e, p&l, expense-tracker, welcome-book, cleaning, turnover, inventory, insurance, etc. |
| `Price — own site` | Currency (USD) | Primary price, always highest |
| `Price — Etsy` | Currency (USD) | Blank if not sold on Etsy |
| `Price — Etsy Lite` | Currency (USD) | Blank if no Lite variant exists |
| `Price — Gumroad` | Currency (USD) | Usually matches own site |
| `Price — Payhip` | Currency (USD) | Phase 2 |
| `Price — Creative Market` | Currency (USD) | Own-site price × 1.3 (markup offsets CM's ~50% fee) |
| `Master file` | Attachment | The canonical `.xlsx` |
| `Lite file` | Attachment | Etsy-Lite variant, if applicable |
| `Thumbnail` | Attachment | 2000×2000 PNG |
| `Preview images` | Attachment (multiple) | 3–5 screenshots with marketing overlays |
| `Companion PDF` | Attachment | How-to + upgrade CTA, per template |
| `Version` | Single line text | Semver, e.g., `1.0.0` |
| `Last updated` | Date | Auto-update via n8n on any content change |
| `Changelog` | Long text | Plain text, dated entries. "2026-04-22 — v1.0.0 — Initial release" |
| `Live on Etsy` | Checkbox | |
| `Live on Gumroad` | Checkbox | |
| `Live on IS` | Checkbox | |
| `Live on Payhip` | Checkbox | Phase 2 |
| `Live on Creative Market` | Checkbox | Phase 2 |
| `Etsy listing ID` | Single line text | Harvested from Etsy URL after publish |
| `Gumroad product ID` | Single line text | From Gumroad URL/API |
| `IS product ID` | Single line text | |
| `Sales YTD — Etsy` | Number (integer) | Auto-populated by n8n daily |
| `Sales YTD — Gumroad` | Number (integer) | |
| `Sales YTD — IS` | Number (integer) | |
| `Revenue YTD` | Currency (formula) | `{Sales YTD — Etsy} * {Price — Etsy} + {Sales YTD — Gumroad} * {Price — Gumroad} + {Sales YTD — IS} * {Price — own site}` — approximate, precise totals live in Orders table |
| `Persona` | Multiple select | sam, sarah, pam — which persona(s) this product serves |
| `Bundle memberships` | Link → Bundles | Which bundles include this product (Phase 1 = populate manually, Phase 2 = auto-sync) |
| `Notes` | Long text | Internal notes, refinement ideas, buyer-feedback themes |

### Views

- **All products** (default, grid)
- **Live** (filter: any `Live on *` checkbox = true)
- **Draft** (filter: Status = Draft)
- **By tier** (grouped by Tier)
- **By category** (grouped by Category)
- **Sarah's products** (filter: Persona contains "sarah")
- **Tax beachhead** (filter: Category = Financial)

---

## Table 2: Customers

Unified CRM across every storefront. Email is the primary key — merges duplicates across platforms.

| Field name | Type | Options / Notes |
|---|---|---|
| `Email` | Email (Primary) | Lowercased, normalized via n8n |
| `First name` | Single line text | |
| `Last name` | Single line text | Optional |
| `Acquisition source` | Single select | etsy, gumroad, pinterest, blog, fb-group, podcast, tiktok, youtube, reddit, direct, affiliate, other |
| `Acquisition campaign` | Single line text | UTM campaign from entry URL, if available |
| `Persona tag` | Single select | sam, sarah, pam, dreamer, newbie, unknown |
| `Lead magnet downloaded` | Multiple select | hero-47, pinterest-cashflow, etsy-post-purchase, blog-embedded, none |
| `FB Group member` | Checkbox | Manual or via Zapier from FB Group new-member automation |
| `First contact date` | Date | When they first appeared in the system |
| `First purchase date` | Date | First paid transaction |
| `Last purchase date` | Date | Auto-updated from Orders |
| `Total orders count` | Count (from Orders) | Auto — formula on linked records |
| `Total lifetime value` | Rollup (from Orders) | Sum of Net amount column in linked Orders |
| `Highest tier purchased` | Rollup (from Orders) | Max of Product tier, lets us identify "ready for next tier" |
| `Tags` | Multiple select | Arbitrary — used for email segmentation. E.g., `owns-5-props`, `material-participation`, `prefers-excel-not-google`, etc. |
| `IS contact ID` | Single line text | For n8n → IS sync |
| `Etsy buyer?` | Checkbox | True if any order with platform=etsy |
| `Gumroad buyer?` | Checkbox | |
| `Own-site buyer?` | Checkbox | |
| `Refund count` | Count | Number of refunded orders |
| `Net LTV` | Formula | `{Total lifetime value} - (refunded amount)` |
| `Notes` | Long text | Any interactions with support, feedback, etc. |
| `Orders` | Link → Orders | Reverse-link auto-populated |

### Views

- **All customers** (default)
- **Whales** (filter: Total lifetime value > $500)
- **Sarah-shaped** (filter: Persona = sarah OR (Highest tier purchased ≥ T2 AND Total orders ≥ 2))
- **Ready for Bundle pitch** (filter: orders ≥ 2 AND highest tier ≤ T2 AND no bundle purchase)
- **Dormant 60+ days** (filter: last purchase > 60 days ago, total orders ≥ 1)
- **Refund risk** (filter: refund count ≥ 1)

---

## Table 3: Orders

Every individual transaction across every platform. The factual source for all revenue attribution.

| Field name | Type | Options / Notes |
|---|---|---|
| `Order ID` | Single line text (Primary) | Format: `<platform>-<original_order_id>`. E.g., `etsy-2845739843`, `stripe-pi_1234abc` |
| `Timestamp` | Date & time (with time) | |
| `Customer` | Link → Customers | |
| `Product` | Link → Products | |
| `Platform` | Single select | etsy, gumroad, is, payhip, cm, affiliate |
| `Gross amount` | Currency (USD) | What the customer paid |
| `Platform fee` | Currency (USD) | Etsy 6.5% + payment processing, Gumroad 10%, Stripe 2.9%+30¢, etc. |
| `Refund amount` | Currency (USD) | Zero if not refunded |
| `Net amount` | Formula | `{Gross amount} - {Platform fee} - {Refund amount}` |
| `OrderBump taken?` | Checkbox | |
| `OrderBump product` | Link → Products | Only if bump taken |
| `OTO taken?` | Checkbox | |
| `OTO product` | Link → Products | Only if OTO taken |
| `Refund status` | Single select | none, pending, refunded |
| `Refund reason` | Long text | For learning patterns |
| `Tax collected` | Currency | Stripe Tax or platform tax remittance |
| `Discount code applied` | Single line text | |
| `Discount amount` | Currency | |
| `Source campaign (UTM)` | Single line text | For attribution |
| `Raw webhook payload` | Long text | Full JSON for debugging — populated by n8n |

### Views

- **All orders** (default, sorted by timestamp desc)
- **Today** (filter: timestamp = today)
- **This week**
- **This month**
- **By platform** (grouped by Platform)
- **Refunds** (filter: refund status ≠ none)
- **OrderBumps taken** (filter: OrderBump taken = true)

---

## Table 4: Content

Editorial calendar for blog, pins, emails, TikTok, etc.

| Field name | Type | Options / Notes |
|---|---|---|
| `Title` | Single line text (Primary) | Working title or final published title |
| `Type` | Single select | blog-post, pinterest-pin, email-broadcast, email-sequence, tiktok, youtube-short, youtube-long, instagram, podcast, other |
| `Status` | Single select | Idea, Draft, Scheduled, Published, Archived |
| `Target keyword` | Single line text | For blog posts primarily |
| `Related product` | Link → Products | What this content promotes |
| `Primary CTA` | Single line text | What you want the reader to do — "Download /47", "Buy Schedule E Workbook", etc. |
| `Publish date` | Date | |
| `Author` | Single line text | "Claude draft", "Daniel final", "Daniel original" |
| `URL` | URL | Published link |
| `Word count` | Number | For blog posts |
| `View count` | Number | Populated from GA / Pinterest analytics |
| `Conversion count` | Number | Email signups or product purchases attributed |
| `Conversion rate` | Formula | `{Conversion count} / {View count}` |
| `Pins linking to this` | Link → Content (self-reference) | For blog posts: which pins point here |
| `Notes` | Long text | Revision notes, performance hypotheses |

### Views

- **Editorial calendar** (calendar view, by Publish date)
- **All blog posts** (filter: Type = blog-post)
- **Pinterest queue** (filter: Type = pinterest-pin AND Status = Scheduled)
- **Email queue** (filter: Type contains email AND Status = Scheduled)
- **Top performers** (sort: Conversion rate desc)

---

## Table 5: Metrics

Daily rollups for the weekly dashboard. Populated by n8n F1 workflow.

| Field name | Type | Options / Notes |
|---|---|---|
| `Date` | Date (Primary format: `YYYY-MM-DD`) | |
| `Metric name` | Single select | revenue-total, revenue-etsy, revenue-gumroad, revenue-is, new-subscribers, new-members, new-fb-group-members, emails-sent, email-open-rate, email-click-rate, orderbump-rate, oto-rate, refund-rate, visitors-blog, visitors-etsy, visitors-pinterest |
| `Value` | Number or Currency | Depending on metric |
| `Source` | Single select | Stripe, Etsy, Gumroad, IS, Pinterest, FB, GA, manual |
| `Notes` | Long text | Anomaly notes |

### Views

- **Last 7 days** (filter: date within 7 days)
- **Last 30 days**
- **Revenue trend** (line chart, Value over Date, grouped by metric)
- **Weekly rollup** (custom grouping)

---

## Table 6: Errors

Automation failure log — every broken n8n workflow run posts here.

| Field name | Type | Options / Notes |
|---|---|---|
| `Timestamp` | Date & time (Primary) | |
| `Workflow` | Single line text | n8n workflow name |
| `Node` | Single line text | Which n8n node failed |
| `Error message` | Long text | |
| `Payload` | Long text | The input that triggered the error |
| `Status` | Single select | Open, Investigating, Fixed, Ignored |
| `Fix notes` | Long text | What was changed to resolve |
| `Related order` | Link → Orders | If the error related to a specific order |

---

## Table 7: Identity (Daniel + The STR Ledger)

Single-row table. Source of truth for everything that goes on profile pages, schema markup, HARO/Featured pitches, embed badges. W42 reads this and re-publishes whenever a field changes.

| Field name | Type | Options / Notes |
|---|---|---|
| `id` | Single line text (Primary) | Always `"primary"` — enforce single-row via Airtable formula |
| `version` | Autonumber | Increments on every change; W42 uses this as the cache-key |
| `name_legal` | Single line text | "Daniel Harrison" |
| `name_brand` | Single line text | "The STR Ledger" |
| `bio_short` | Long text | ≤160 chars — Crunchbase, Trustpilot one-liner |
| `bio_long` | Long text | ≤500 chars — LinkedIn, About.me, About page |
| `tagline` | Single line text | "Business-grade Excel financial systems for STR hosts" |
| `headshot_url` | URL | 1000×1000 minimum, hosted on Hostinger or Vista |
| `logo_url_square` | URL | 1024×1024 |
| `logo_url_wide` | URL | 1200×630 OG-card size |
| `product_count` | Number | Current SKU count — auto-rolled from Products table count |
| `sameAs` | Long text | One URL per line — LinkedIn, X, GitHub, YouTube, Pinterest, Substack, Medium, Crunchbase — feeds JSON-LD `sameAs` array |
| `expert_topics` | Multiple select | STR taxation, Schedule E vs C, material participation, 14-day rule, cost-seg, Airbnb bookkeeping, multi-property STR finance, STR market trends, tax-season survival, cleaning automation, dynamic pricing |
| `domain_primary` | URL | "https://thestrledger.com" |
| `domain_blog` | URL | "https://blog.thestrledger.com" |
| `last_reviewed` | Date | Updated when Daniel manually verifies the record is current |
| `notes` | Long text | Anything not covered above |

**Single-row enforcement:** Airtable formula field `Validate` = `IF({id} = "primary", "✓", "❌ id must be 'primary'")`. Visible in row, blocks accidental duplicates.

---

## Table 8: Citations

Profile + directory backlinks earned in Phase 0 sprints. Source of truth for `ops/citations.yaml` (n8n syncs both directions). W42 reads `state=live` rows on Identity-change events.

| Field name | Type | Options / Notes |
|---|---|---|
| `Platform` | Single line text (Primary) | "Crunchbase", "LinkedIn Company Page", etc. |
| `Tier` | Single select | T1 (Universal trust), T2 (STR-niche), T3 (Founder brand) |
| `URL` | URL | Live profile URL |
| `State` | Single select | pending, live, stale, broken |
| `Last_refresh` | Date | Last successful sync or manual update |
| `Bio_version` | Number | Matches Identity.version at last sync — n8n diffs to detect needed refresh |
| `Has_write_api` | Checkbox | Whether n8n can PATCH it; false routes to manual Slack queue |
| `Notes` | Long text | "API integration unlocks deeper listing", "submit free template", etc. |

---

## Table 9: Outreach Queue

Used by W21 + W34 (unlinked-mention reclaim). State machine: New → Drafted → AwaitingApproval → Approved → Sent → Replied | Declined | Skip.

| Field name | Type | Options / Notes |
|---|---|---|
| `Email` | Email (Primary) | Lowercased; unique |
| `Name` | Single line text | |
| `Website` | URL | Source page or publisher domain |
| `Context` | Long text | Why this prospect — for W21 it's ScrapeBox enrichment; for W34 it's the unlinked-mention paragraph |
| `Source` | Single select | scrapebox-csv, unlinked-mention-reclaim, broken-link-prospect, founder-podcast, other |
| `Source_file` | Single line text | CSV file ID (W21) or mention URL (W34) |
| `Mention_url` | URL | Where the unlinked mention lives (W34 only) |
| `Mention_paragraph` | Long text | Excerpt that mentions us (W34 only) |
| `Draft_subject` | Single line text | Claude-drafted; Daniel edits |
| `Draft_body` | Long text | Claude-drafted; Daniel edits |
| `Draft_reasoning` | Long text | Why Claude chose this angle — not sent, just for review |
| `Status` | Single select | New, Drafted, AwaitingApproval, Approved, Sent, Replied, Declined, Skip |
| `Imported_at` | Date & time | |
| `Drafted_at` | Date & time | |
| `Sent_at` | Date & time | |
| `Replied_at` | Date & time | |
| `Reply_payload` | Long text | Truncated reply body for context |
| `Instantly_response` | Long text | Truncated send response |
| `Owner` | Single line text | Default "Daniel" |

---

## Table 10: Expert Library

Quotable case studies, data points, anonymized client outcomes. Loaded into Claude system prompts for W35 (Featured/Qwoted responder, when activated). Each entry is a self-contained 50–80 word block.

| Field name | Type | Options / Notes |
|---|---|---|
| `Title` | Single line text (Primary) | "Schedule E vs C decision tree" |
| `Topic` | Multiple select | (same options as Identity.expert_topics) |
| `Quote_body` | Long text | The 50–80 word quotable block — must stand alone |
| `Numbers_cited` | Single line text | "Saved $4,800 on cost-seg", "27% of hosts misclassify" — concrete numbers anchor the quote |
| `Source` | Single line text | "Anonymized client X", "2024 client engagement", "Industry data — AirDNA Q3 2025" |
| `Permission` | Single select | named, anonymized, embargoed, public-data-only |
| `Times_cited` | Number | Auto-increment on each successful Featured placement that used this block |
| `Last_cited` | Date | |
| `Notes` | Long text | Caveats, regulatory carve-outs, audience-fit notes |

**Pre-flight for tax season** (per `ops/runbooks/phase-0-citation-sprints.md` and `docs/backlink-automation-plan.md`):
- Jan 12 each year: 8+ Expert Library blocks loaded
- Each must cite a specific dollar outcome or counterintuitive statistic
- Each must hold up under journalist fact-checking
- Anonymized > Named (named requires written customer permission)

---

## Table 11: Mentions

Detected brand mentions across the web. Written by W34 (unlinked-mention watcher) and W6/placement tracker. Used to compute reclaim conversion rate and identify amplification candidates.

| Field name | Type | Options / Notes |
|---|---|---|
| `Mention_url` | URL (Primary) | The page mentioning us |
| `Outlet` | Single line text | Domain or publication name |
| `Mention_paragraph` | Long text | Excerpt — first 800 chars of context |
| `Detected_at` | Date & time | When W34 found it |
| `Source` | Single select | google-alerts, brand24, serpapi, reddit, hn, manual |
| `Has_link` | Checkbox | Whether mention is already linked to thestrledger.com |
| `Outreach_record_id` | Link → Outreach Queue | Set after W34 drafts reclaim ask |
| `Link_added_at` | Date | Set when the publisher adds the link |
| `Tier` | Single select | T1 (Forbes/Inc/WSJ/NYT/Skift), T2 (BiggerPockets/RentalScaleUp), T3 (niche blog), T4 (forum/social) |
| `Notes` | Long text | |

---

## Populate on Day 1

As soon as Claude MCP is connected, Claude populates:

### Products table with initial 5 launch templates (draft status)

1. `GST-001` — Airbnb Welcome Book — T1 — $17 Etsy / $17 own-site
2. `TAX-001` — STR Mileage Log — T1 — $17 Etsy / $17 own-site
3. `TAX-002` — Single-Property P&L — T2 — $27 Etsy Lite / $97 own-site Full
4. `TAX-003` — 1099-NEC Contractor Tracker — T1 — $17 Etsy / $17 own-site
5. `OPS-001` — Cleaner Turnover Checklist — T1 — $12 Etsy / $12 own-site

(Status = Draft until briefs are complete and Excel files exist.)

### Content table with 10 initial blog-post ideas + 30 pin ideas

Seeded from `copy/blog-posts/content-plan.md` and upcoming pin catalog.

---

## Access control

### Claude MCP
- Token scoped to this base only
- Read + write on all tables
- Schema changes require human in Airtable UI (token scope is intentional)

### Future VA access
- Separate Airtable user, added as editor on workspace
- Restricted to specific tables (no Errors, no pricing fields if financial access is concerning)

### Backup
- Weekly full-base CSV export to Google Drive via n8n (Task B11)
- Retain 30 rolling days + monthly snapshots for 12 months

---

## Schema change log

When anyone modifies schema, record it here with date and reason. This is the audit log.

- `2026-04-22` — Schema drafted (this document)
- `2026-05-11` — Added Tables 7–11 for Traffic Engines (W41–W45): Identity (single-row, source of truth for profile pushes), Citations (mirrors `ops/citations.yaml`), Outreach Queue (shared by W21 + W34), Expert Library (W35 quotable blocks for Featured/Qwoted), Mentions (W34 detection log). See `docs/backlink-automation-plan.md` + `docs/decisions/2026-05-11-traffic-first-philosophy.md`.
- (future entries as schema evolves)

---

## After creation — Claude verification checklist

Once the base is created and the MCP is connected, Claude runs:

- [ ] Can read all 6 table names
- [ ] Can read Products schema
- [ ] Can create a test record in Products (SKU: `TEST-001`) — then delete it
- [ ] Can create a linked record (test Customer → test Order → test Product)
- [ ] Can update a field
- [ ] Can execute a formula field (Revenue YTD on Products)
- [ ] Reports any schema mismatches between this doc and actual base

If all checks pass, `ops/credentials-inventory.md` Airtable row is marked "verified".
