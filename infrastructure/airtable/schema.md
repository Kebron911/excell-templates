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
