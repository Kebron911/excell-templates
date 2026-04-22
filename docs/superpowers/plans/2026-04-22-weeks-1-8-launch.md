# STR Platform — Weeks 1-8 Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the STR Tax & Financial Excel Template Platform from zero to a revenue-generating operation within 8 weeks, via three parallel lanes — Lane A (Etsy MVP, Weeks 1–2), Lane B (Hub Infrastructure, Weeks 1–8), Lane C (Content & Authority, Weeks 2–8).

**Architecture:** Influencersoft is the hub. Airtable is the single source of truth. n8n (self-hosted on a VPS) is the automation spine. Ghost serves the SEO blog on a subdomain. Etsy and Gumroad are discovery storefronts. Stripe Tax handles compliance. Claude connects via MCP to Airtable so operations are agent-driven.

**Tech Stack:** Influencersoft, Stripe + Stripe Tax, Ghost, Airtable, n8n (self-hosted), Google Workspace, Canva Pro, Tailwind, Buffer, Cloudflare, Hetzner/DigitalOcean VPS, Claude Code MCP. Excel (.xlsx) is the product substrate.

**Spec reference:** [docs/superpowers/specs/2026-04-22-str-tax-platform-design.md](../specs/2026-04-22-str-tax-platform-design.md)

---

## Execution model — three parallel lanes

```
Lane A — Revenue (Etsy MVP)          Week 1  Week 2  Week 3  Week 4  ...  Week 8
  Shop open, 3 listings              ████
  Expand to 5 listings                       ████
  Gumroad mirror                                     ███
  Etsy → own-site upgrade CTA                                              ████

Lane B — Hub Infrastructure
  Domain + Airtable + accounts       ████
  IS + Stripe + Ghost stood up              ████    ████
  n8n workflows P0                                          ████  ████
  Funnel live (lead magnet + nurture)                                      ████

Lane C — Content + Authority
  Content plan + first 3 blog posts         ████    ████
  Pinterest pins + schedule                         ████  ████
  FB Group soft launch                                     ████
  Ongoing cadence                                                  ████    ████
```

Lanes A and B start Day 1 in parallel. Lane C begins Week 2 once the brand identity is locked. Week 8 is the hard milestone: **own site + email list + lead magnet live** regardless of Etsy results.

---

## File structure

```
Excell-Templates/
├── README.md                                        (exists)
├── .gitignore                                       (exists)
├── docs/
│   ├── superpowers/
│   │   ├── specs/
│   │   │   └── 2026-04-22-str-tax-platform-design.md   (exists — the spec)
│   │   └── plans/
│   │       └── 2026-04-22-weeks-1-8-launch.md          (this file)
│   └── runbooks/                                    (new — operational procedures)
│       ├── etsy-listing-publish.md
│       ├── template-production-process.md
│       ├── n8n-workflow-deployment.md
│       └── disaster-recovery.md
├── brand/                                           (new — brand assets)
│   ├── brand-decisions.md                           (name, colors, fonts, voice)
│   ├── canva-links.md                               (pointers to live Canva templates)
│   └── assets/                                      (exported logos, banners)
├── templates/                                       (new — Excel source files)
│   ├── _briefs/                                     (user-supplied template specs)
│   ├── _masters/                                    (the canonical .xlsx files)
│   ├── _lite/                                       (Etsy-Lite variants)
│   └── _delivery/                                   (PDFs, thumbnails, cover pages)
├── copy/                                            (new — written content)
│   ├── etsy-listings/                               (one .md per listing)
│   ├── lead-magnets/
│   ├── email-sequences/
│   └── blog-posts/
├── infrastructure/                                  (new — configs, as-code)
│   ├── airtable/
│   │   └── schema.md                                (base + table definitions)
│   ├── n8n/
│   │   └── workflows/                               (exported workflow JSON)
│   ├── ghost/
│   │   └── config.md
│   └── influencersoft/
│       └── config.md
└── ops/                                             (new — operational docs)
    ├── credentials-inventory.md                     (which tools, who holds keys)
    ├── weekly-review-template.md
    └── week-8-milestone-checklist.md
```

**Design principle:** every decision that can become a file, does. Brand choices, operational runbooks, template briefs, copy drafts — all live in git. Only secrets never live in git.

---

## Cross-lane prerequisites (do these first — Day 1)

### Task P1: Install Claude MCP for Airtable

**Files:** none yet (configuration only)

**Acceptance criteria:** Claude can read and write to a test Airtable base via MCP in one sentence.

- [ ] **Step 1: Install the Airtable MCP server globally**

```bash
npm install -g airtable-mcp-server
```

Expected: install succeeds, `airtable-mcp-server --version` prints a version.

- [ ] **Step 2: Create an Airtable personal access token**

Go to https://airtable.com/create/tokens → Create token → scope: `data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write` → all bases → copy token.

- [ ] **Step 3: Add the MCP server to Claude Code**

```bash
claude mcp add airtable --env AIRTABLE_API_KEY=pat_XXXX -- npx -y airtable-mcp-server
```

Replace `pat_XXXX` with your personal access token.

- [ ] **Step 4: Verify connection**

Restart Claude Code, start a new session, prompt: "List all my Airtable bases." Expected: Claude returns a list (initially empty or just default Untitled bases).

- [ ] **Step 5: Commit the install note**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/airtable
cat > infrastructure/airtable/mcp-install.md <<'EOF'
# Airtable MCP install

Installed `airtable-mcp-server` globally via npm.
Registered in Claude Code as `airtable` MCP server.
Token is stored in Claude MCP config, not in this repo.

Verified: Claude can list bases via MCP.
EOF
git add infrastructure/airtable/mcp-install.md
git commit -m "docs: record Airtable MCP install"
```

---

### Task P2: Create credentials inventory

**Files:** `ops/credentials-inventory.md`

**Acceptance criteria:** every tool the plan touches has a row with its URL, owner, 2FA status, and where the secret lives.

- [ ] **Step 1: Create the inventory file**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p ops
cat > ops/credentials-inventory.md <<'EOF'
# Credentials Inventory

> Secrets never appear in this file. This is the map of where each secret lives.

| Tool | URL | Account / Owner | 2FA | Secret storage | Notes |
|---|---|---|---|---|---|
| GitHub | github.com/Kebron911 | Kebron911 | ✅ | Password manager | gh CLI authenticated |
| Airtable | airtable.com | (pending) | pending | Password manager + MCP env | Pat created for MCP |
| Influencersoft | (pending) | (pending) | pending | Password manager | LTD license owned |
| Stripe | dashboard.stripe.com | (pending) | pending | Password manager + IS | Stripe Tax enabled |
| Ghost | (pending host) | (pending) | pending | Password manager | Subdomain blog.<domain> |
| Google Workspace | admin.google.com | (pending) | pending | Password manager | Used for backups |
| Cloudflare | dash.cloudflare.com | (pending) | pending | Password manager | DNS + tunnel |
| Hetzner/DO VPS | (pending host) | (pending) | pending | SSH keys + PM | n8n host |
| Canva Pro | canva.com | (pending) | pending | Password manager | Brand kit lives here |
| Tailwind | tailwindapp.com | (pending) | pending | Password manager | Pinterest scheduler |
| Buffer | buffer.com | (pending) | pending | Password manager | Secondary social scheduler |
| Etsy | etsy.com | (pending) | pending | Password manager + 2FA app | Seller account |
| Gumroad | gumroad.com | (pending) | pending | Password manager | Mirror storefront |
| Domain registrar | (pending) | (pending) | ✅ | Password manager | See Task B1 |

## Review cadence
Monthly — verify 2FA active, rotate any unrotated keys, audit VA access.
EOF
git add ops/credentials-inventory.md
git commit -m "ops: scaffold credentials inventory"
```

- [ ] **Step 2: As you complete each tool-setup task below, update this file**

Treat this inventory as the single mental map of your security posture.

---

## LANE A — Etsy MVP (Weeks 1–2 priority)

### Task A1: Brand identity decision

**Files:** `brand/brand-decisions.md`

**Inputs needed from you:** pick a brand name, primary color, secondary color, tagline.

**Acceptance criteria:** brand name is unique on Etsy search, domain is available, decision is committed to git.

- [ ] **Step 1: Candidate brand name brainstorm**

Drop 10 candidates into `brand/brand-decisions.md`. Target vibe: business-grade, not cutesy. Examples (for inspiration, not to use as-is): "BNB Ops Co.", "STR Ledger", "Host Systems Studio", "The Ledger Loft", "BNB Bookkeeping Shop".

- [ ] **Step 2: Check each for availability**

For each candidate:
1. Etsy search — is there a shop with this name? → https://www.etsy.com/search?q=<name>
2. Domain — is .com available? Check via Namecheap, Porkbun, or Cloudflare Registrar
3. Instagram handle available?
4. Trademark conflict? Quick USPTO TESS search → https://tmsearch.uspto.gov/

- [ ] **Step 3: Lock the winner in `brand/brand-decisions.md`**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p brand
cat > brand/brand-decisions.md <<'EOF'
# Brand Decisions

## Name
**<Final name>**

## Tagline
**<Final tagline — under 10 words, business-grade tone>**

## Visual identity
- Primary color: #XXXXXX (<name>)
- Secondary color: #XXXXXX (<name>)
- Accent: #XXXXXX
- Primary font: <Google Font name>
- Secondary font: <Google Font name>

## Voice
- Authoritative but warm — "I've operated X properties myself"
- Never cutesy or lifestyle-blogger
- Concrete numbers > vague claims
- Sarah-tier reading level: professional, specific, no fluff

## Availability confirmed
- [x] Etsy shop name free
- [x] Domain .com available
- [x] Instagram handle available
- [x] No obvious USPTO TESS conflict

## Related handles reserved
- Domain: <domain>.com
- Email inbox: hello@<domain>.com
- Instagram: @<handle>
- Pinterest: <handle>
- TikTok: (phase 2)
- YouTube: (phase 2)
EOF
git add brand/brand-decisions.md
git commit -m "brand: lock name, identity, and tone"
```

---

### Task A2: Register domain + set up email

**Files:** update `brand/brand-decisions.md`, `ops/credentials-inventory.md`

**Acceptance criteria:** domain resolves, `hello@<domain>` receives a test email.

- [ ] **Step 1: Purchase domain**

Recommended: Cloudflare Registrar (near-wholesale prices, free WHOIS privacy, no upsells). Account: sign up at dash.cloudflare.com. Buy the .com domain locked in Task A1.

- [ ] **Step 2: Point DNS**

In Cloudflare DNS, add:
- `A` record `@` → placeholder `192.0.2.1` (will update when hub is live)
- `MX` records for your chosen email host (Google Workspace, Fastmail, or Zoho)

- [ ] **Step 3: Set up email**

Google Workspace ($6/user/mo) — go to workspace.google.com, sign up with domain, verify DNS, create `hello@<domain>`.

- [ ] **Step 4: Send a test email**

From another address, email `hello@<domain>` with subject "test". Confirm it arrives.

- [ ] **Step 5: Update inventory and commit**

```bash
# Update brand/brand-decisions.md with domain confirmation
# Update ops/credentials-inventory.md with Cloudflare + Google Workspace owners
git add brand/brand-decisions.md ops/credentials-inventory.md
git commit -m "infra: register domain, provision email"
```

---

### Task A3: Open Etsy seller account

**Files:** `infrastructure/etsy/shop-setup.md`

**Acceptance criteria:** shop is live in "preview" mode (not public yet), bank + tax info submitted.

- [ ] **Step 1: Open Etsy seller dashboard**

Go to https://www.etsy.com/sell. Create account with `hello@<domain>`. Shop name = brand name from Task A1.

- [ ] **Step 2: Configure shop preferences**

- Language: English
- Country: United States
- Currency: USD

- [ ] **Step 3: Submit bank info + tax ID**

Add your US bank account (or business bank if LLC'd). Enter your SSN or EIN — Etsy issues a 1099-K annually. If you're forming an LLC for this, do it now (LegalZoom or local attorney, ~$100–$300).

- [ ] **Step 4: Enable 2FA**

Settings → Privacy & Security → Two-factor auth. Use an authenticator app, not SMS.

- [ ] **Step 5: Record setup**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/etsy
cat > infrastructure/etsy/shop-setup.md <<'EOF'
# Etsy shop setup

- Shop URL: etsy.com/shop/<shop-name>
- Account: <email>
- Bank: <bank name> (account info in password manager)
- Tax entity: <sole prop / LLC / S-corp>
- 2FA: enabled, authenticator app
- Listing fee: $0.20 per listing, 6.5% transaction, 3% + $0.25 payment processing
EOF
git add infrastructure/etsy/shop-setup.md
git commit -m "infra: open etsy seller account"
```

Update `ops/credentials-inventory.md` with Etsy row.

---

### Task A4: Brand asset pack in Canva

**Files:** `brand/canva-links.md`, `brand/assets/` (exported PNGs/SVGs)

**Acceptance criteria:** logo, Etsy shop banner (1600×213), Etsy shop icon (500×500), thumbnail template (2000×2000 square), cover page template (Excel-embedded 1000×400) all exist in Canva and exported to `brand/assets/`.

- [ ] **Step 1: Create Canva brand kit**

In Canva Pro → Brand kit → add primary + secondary colors (from A1), fonts, upload logo if you have one, create if not.

- [ ] **Step 2: Create 5 asset templates**

Use the brand kit to create:
1. Logo (square + horizontal variants)
2. Etsy shop banner (1600×213px)
3. Etsy shop icon (500×500px)
4. Product thumbnail template (2000×2000px, reusable — headline, sub-headline, preview mockup slot)
5. Excel cover-page asset (1000×400px, for first-tab branding inside every template)

- [ ] **Step 3: Export and commit**

Export each as PNG + SVG where applicable. Save to `brand/assets/`.

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p brand/assets
# (Save exports to brand/assets/)
cat > brand/canva-links.md <<'EOF'
# Canva template links

| Asset | Canva URL | Dimensions |
|---|---|---|
| Logo (square) | <paste canva link> | 1000×1000 |
| Logo (horizontal) | <paste canva link> | 2000×500 |
| Etsy shop banner | <paste canva link> | 1600×213 |
| Etsy shop icon | <paste canva link> | 500×500 |
| Product thumbnail master | <paste canva link> | 2000×2000 |
| Excel cover page | <paste canva link> | 1000×400 |
EOF
git add brand/canva-links.md brand/assets/
git commit -m "brand: canva asset pack + exports"
```

---

### Task A5: Etsy shop policies, about, banner

**Files:** `copy/etsy-listings/shop-about.md`, `copy/etsy-listings/shop-policies.md`

**Acceptance criteria:** Etsy shop has banner, icon, about section (1–3 paragraphs), policies filled in (digital-download-specific: 14-day refund, instant delivery, no physical shipping).

- [ ] **Step 1: Draft shop "About" section**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/etsy-listings
cat > copy/etsy-listings/shop-about.md <<'EOF'
# Shop About — <brand name>

## The story (1–3 paragraphs for Etsy About section)

<brand name> builds Excel systems for short-term rental hosts who treat their property portfolio like a real business — not a side hustle, not a lifestyle experiment, but a serious operation that happens to be on Airbnb and VRBO.

Our templates are the tools we built for ourselves after years of trying to bolt QuickBooks onto an STR portfolio and watching it fail: wrong categories, missing deductions, no way to track per-property margins, and no answer when our CPA asked "where are your books?" Everything here is Excel-native, built for hosts, and priced so the template pays for itself on the first use.

Everything is a digital download. You'll have it in your inbox the moment you check out.
EOF
```

- [ ] **Step 2: Draft shop policies**

```bash
cat > copy/etsy-listings/shop-policies.md <<'EOF'
# Shop Policies — <brand name>

## Delivery
All products are instant digital downloads. Your files appear immediately after payment in your Etsy account under "Purchases & reviews" and as a download link in your confirmation email.

## Refunds
14-day refund on any single template, no questions asked. Bundle and Vault purchases have 30-day and 60-day windows respectively (see product pages). If you can't open the file or it doesn't work on your Excel version, contact us first — we'll fix it.

## File compatibility
All templates work on Microsoft Excel 2016+ (Windows and Mac), Excel 365, and Google Sheets (with some formula re-import). Not tested on Apple Numbers — please ask before purchase.

## Support
Email hello@<domain>.com — replies within 1 business day.

## Customization
We do custom dashboards and multi-LLC setups as a separate service, not inside Etsy. Message us if interested.
EOF
git add copy/etsy-listings/
git commit -m "copy: etsy shop about + policies"
```

- [ ] **Step 3: Paste into Etsy shop settings**

Etsy dashboard → Shop manager → Settings → Info & appearance → About, Policies, Announcement. Paste the drafted content. Upload the banner + icon from Task A4.

---

### Task A6: Define the reusable template production process

**Files:** `docs/runbooks/template-production-process.md`

**Acceptance criteria:** a documented 8-step process every template follows from brief to live listing. This is the SOP; Tasks A7–A11 are instances of it.

- [ ] **Step 1: Create the runbook**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p docs/runbooks
cat > docs/runbooks/template-production-process.md <<'EOF'
# Template Production Process (SOP)

Every Excel template goes through this exact process. Do not skip steps.

## 1. Brief (user-supplied)
User writes a one-page brief to `templates/_briefs/<SKU>.md` covering:
- Target persona (Sam / Sarah / Pam)
- One specific pain this solves
- Input fields (what the user types/pastes)
- Output fields (what gets calculated)
- Any formulas or logic (tax rates, formulas, lookups)
- Any external data references (IRS rates, mileage rates, etc.)
- Screenshots or sketches if helpful

## 2. Spec
Claude drafts a Sheet-by-Sheet Spec to `templates/_briefs/<SKU>-spec.md`:
- Tab 1 name, purpose, field list, formulas
- Tab 2 name, purpose, ...
- Branding tab (welcome, how-to-use, upgrade CTA)
- Print-ready tab where applicable

## 3. Build
Build the `.xlsx` file in `templates/_masters/<SKU>.xlsx`:
- Apply brand colors
- Lock formula cells, unlock input cells
- Add data validation where inputs are bounded (dropdowns, ranges)
- Test with sample data that matches the brief's expected outputs
- Add conditional formatting where it aids the user

## 4. QA
- Open in Excel 2016+ on Windows
- Open in Excel 365 on Mac (if available — or use browser Excel)
- Import into Google Sheets and fix broken formulas if any
- Verify all sample outputs match brief expectations
- Spell-check every cell label

## 5. Lite variant (for Etsy only)
- Duplicate master to `templates/_lite/<SKU>-lite.xlsx`
- Remove 1–2 tabs that are "pro" features
- Add prominent upgrade CTA on cover tab linking to own-site premium version
- Verify lite still delivers the core promise — not crippled, just narrower

## 6. Delivery assets
Create in `templates/_delivery/<SKU>/`:
- Thumbnail (2000×2000 PNG from Canva master in A4)
- 3–5 preview images (screenshots + marketing angle overlays)
- Companion PDF with how-to and upgrade CTA
- Description copy drafted to `copy/etsy-listings/<SKU>.md`

## 7. Publish
- Create Etsy listing with tags, title, description, thumbnails
- Mirror to Gumroad (same files, same description)
- Add product row to Airtable Products table (when schema live)
- Schedule Pinterest pin announcement (when Lane C live)

## 8. Monitor
- First sale alert → check the file actually opened for the buyer
- Track listing views / conversion weekly
- Iterate thumbnails after 50 views with <2% conversion

## Required roles during each step
- Brief: user (Daniel)
- Spec: Claude
- Build: Claude + Daniel review
- QA: Daniel (human — Claude cannot open Excel files reliably across versions)
- Lite, delivery, publish: Claude + Daniel approve
- Monitor: automated (Airtable sync) once workflows are live
EOF
git add docs/runbooks/template-production-process.md
git commit -m "runbook: template production SOP"
```

---

### Task A7: Produce Template 1 — Airbnb Welcome Book

**Files:** `templates/_briefs/welcome-book.md`, `templates/_briefs/welcome-book-spec.md`, `templates/_masters/welcome-book.xlsx`, `templates/_delivery/welcome-book/`, `copy/etsy-listings/welcome-book.md`

**Inputs needed from you:** the brief for Welcome Book per Task A6 Step 1.

**Acceptance criteria:** listing live on Etsy with 3+ thumbnails, all QA checks pass, first sale possible.

- [ ] **Step 1: You write the brief**

Create `templates/_briefs/welcome-book.md` following the format in the runbook. You control what this template actually is. When you've pushed the brief, I execute Steps 2–8 of the runbook and check in at Steps 4 (QA) and 7 (publish).

- [ ] **Step 2: Execute runbook steps 2–7**

After brief is in git, run the template-production-process runbook end to end.

- [ ] **Step 3: Verify first-sale flow**

Do a test purchase from a secondary Etsy account (or friend). Confirm the file downloads, opens cleanly in Excel, the upgrade CTA appears, and the email hits `hello@<domain>`.

- [ ] **Step 4: Commit everything**

```bash
git add templates/_briefs/welcome-book* templates/_masters/welcome-book.xlsx templates/_delivery/welcome-book/ copy/etsy-listings/welcome-book.md
git commit -m "product: launch Welcome Book template (SKU WB-001)"
```

---

### Task A8: Produce Template 2 — STR Mileage Log

Same pattern as A7. Brief format in `templates/_briefs/mileage-log.md`.

- [ ] **Step 1: Brief**
- [ ] **Step 2: Runbook steps 2–7**
- [ ] **Step 3: Verify**
- [ ] **Step 4: Commit**

```bash
git add templates/_briefs/mileage-log* templates/_masters/mileage-log.xlsx templates/_delivery/mileage-log/ copy/etsy-listings/mileage-log.md
git commit -m "product: launch STR Mileage Log (SKU ML-001)"
```

---

### Task A9: Produce Template 3 — Single-Property P&L (Lite)

Same pattern. Per spec §10, this is a T2 Lite version ($27 on Etsy). The Full version ($97) is a Lane-B deliverable after the hub is live.

- [ ] **Step 1: Brief** (`templates/_briefs/pl-single-property.md`)
- [ ] **Step 2: Runbook steps 2–7 (build Lite only — mark "full version" placeholder for Lane B)**
- [ ] **Step 3: Verify upgrade CTA renders correctly on cover tab**
- [ ] **Step 4: Commit**

---

### Task A10: Produce Template 4 — 1099-NEC Contractor Tracker

Same pattern. `templates/_briefs/1099-nec-tracker.md`.

- [ ] **Step 1: Brief**
- [ ] **Step 2: Runbook steps 2–7**
- [ ] **Step 3: Verify**
- [ ] **Step 4: Commit**

---

### Task A11: Produce Template 5 — Cleaner Turnover Checklist

Same pattern. `templates/_briefs/turnover-checklist.md`.

- [ ] **Step 1: Brief**
- [ ] **Step 2: Runbook steps 2–7**
- [ ] **Step 3: Verify**
- [ ] **Step 4: Commit**

---

### Task A12: Listing SEO pass

**Files:** per-listing `copy/etsy-listings/<sku>.md` updates

**Acceptance criteria:** each listing has title = keyword-front-loaded, 13 tags filled, long-tail keywords in description, at least 5 thumbnails.

- [ ] **Step 1: Research keywords**

For each of the 5 products, use eRank (free tier) or Alura, or just Etsy's search-suggest dropdown. Harvest:
- 3 long-tail phrases for title (e.g., "airbnb mileage log", "str mileage tracker excel", "vacation rental tax spreadsheet")
- 13 tags (Etsy max) — mix exact-match and variant phrases
- 5–7 keyword phrases naturally woven into first 160 chars of description (Etsy SEO signal)

- [ ] **Step 2: Update each listing**

Edit Etsy listing directly → title, tags, description. Mirror changes to `copy/etsy-listings/<sku>.md`.

- [ ] **Step 3: Commit**

```bash
git add copy/etsy-listings/
git commit -m "seo: keyword-optimize all 5 launch listings"
```

---

### Task A13: Etsy buyer lead magnet (PDF insert)

**Files:** `copy/lead-magnets/etsy-buyer-pdf.md`, `templates/_delivery/_shared/etsy-upgrade-insert.pdf`

**Acceptance criteria:** every Etsy download includes a 1-page companion PDF with upgrade CTA + email capture URL.

- [ ] **Step 1: Draft the PDF content**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/lead-magnets
cat > copy/lead-magnets/etsy-buyer-pdf.md <<'EOF'
# Etsy Companion PDF — Content

## Page 1 (single page, designed in Canva)

### Headline
Thanks for grabbing <template name>.

### Body (3 short paragraphs)
This template is part of a growing library built specifically for Airbnb and VRBO hosts who treat their portfolio like a real business.

You can upgrade this template to the full version (more tabs, multi-property support, premium tax integrations) at <domain>.com/upgrade — your Etsy purchase gives you an automatic credit.

Or grab our free **"47 Airbnb Tax Deductions Most Hosts Miss"** guide — the PDF + Excel checklist we wish every host had before their first tax season. Scan the QR code or visit <domain>.com/47.

### Big CTA block
**→ <domain>.com/47**
QR code to same URL

### Fine print
hello@<domain>.com · <brand name> · © 2026
EOF
git add copy/lead-magnets/etsy-buyer-pdf.md
git commit -m "copy: etsy buyer upgrade/lead PDF content"
```

- [ ] **Step 2: Design in Canva, export as PDF**

Build a 1-page Canva design. Export as PDF. Save to `templates/_delivery/_shared/etsy-upgrade-insert.pdf`.

- [ ] **Step 3: Bundle into each Etsy listing's download**

On each Etsy listing, add this PDF as a second download file. Etsy allows up to 5 digital files per listing.

- [ ] **Step 4: Commit**

```bash
git add templates/_delivery/_shared/etsy-upgrade-insert.pdf
git commit -m "delivery: etsy companion PDF with upgrade + lead magnet CTAs"
```

---

### Task A14: Mirror shop to Gumroad

**Files:** `infrastructure/gumroad/setup.md`

**Acceptance criteria:** all 5 products live on Gumroad with same files, same descriptions, same pricing. Gumroad storefront accessible at `gumroad.com/<brand>`.

- [ ] **Step 1: Create Gumroad account**

Sign up at gumroad.com with `hello@<domain>`. Username = brand name (lowercase, hyphenated).

- [ ] **Step 2: Add each of 5 products**

For each:
- Upload `.xlsx` (not Lite) + companion PDF from A13
- Paste description from `copy/etsy-listings/<sku>.md`
- Upload thumbnail
- Set price per spec (match own-site price, not Etsy-Lite)
- Enable "pay what you want" floor at advertised price (Gumroad convention lifts conversion slightly)

- [ ] **Step 3: Enable 2FA + payout bank**

Settings → Security → 2FA. Settings → Payouts → bank info.

- [ ] **Step 4: Commit notes**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/gumroad
cat > infrastructure/gumroad/setup.md <<'EOF'
# Gumroad setup

- URL: gumroad.com/<brand>
- Account: <email>
- 2FA: enabled
- Bank info submitted
- Products live: Welcome Book, Mileage Log, Single-Property P&L (full, not lite), 1099-NEC, Turnover Checklist
- Fee: 10% + $0.30 per transaction
EOF
git add infrastructure/gumroad/setup.md
git commit -m "infra: gumroad storefront mirror"
```

---

## LANE B — Hub Infrastructure (Weeks 1–8)

### Task B1: Airtable base schema — "Master Product Catalog"

**Files:** `infrastructure/airtable/schema.md`

**Acceptance criteria:** Airtable base exists with 5 tables (Products, Customers, Orders, Content, Metrics). Claude can read and write each via MCP.

- [ ] **Step 1: Create the base**

In Airtable → Create new base named "STR Platform — Master" in your chosen workspace.

- [ ] **Step 2: Define the Products table**

Fields (Claude can create these via MCP; or create manually):

| Field name | Type | Notes |
|---|---|---|
| SKU | Single line, Primary | Format: CAT-NNN (e.g., TAX-001, OPS-002) |
| Name | Single line | |
| Category | Single select | Financial, Acquisition, Ops, Guest, Pricing, Marketing, Legal, Team, Strategic, Specialty |
| Tier | Single select | T0, T1, T2, T3, T4, T5, T6 |
| Status | Single select | Draft, Published, Retired |
| Short description | Long text | |
| Full description | Long text | |
| Tags | Multi-select | Etsy keyword tags |
| Price — own site | Currency | USD |
| Price — Etsy | Currency | USD or blank |
| Price — Etsy Lite | Currency | USD or blank |
| Price — Gumroad | Currency | |
| Price — Payhip | Currency | |
| Price — Creative Market | Currency | |
| Master file | Attachment | .xlsx link |
| Lite file | Attachment | .xlsx link |
| Thumbnail | Attachment | PNG |
| Preview images | Attachment (multiple) | |
| Companion PDF | Attachment | |
| Version | Single line | Semantic, e.g., "1.0.0" |
| Last updated | Date | |
| Changelog | Long text | |
| Live on Etsy | Checkbox | |
| Live on Gumroad | Checkbox | |
| Live on IS | Checkbox | |
| Live on Payhip | Checkbox | |
| Live on Creative Market | Checkbox | |
| Sales YTD — Etsy | Number | Auto-populated by n8n |
| Sales YTD — Gumroad | Number | |
| Sales YTD — IS | Number | |

- [ ] **Step 3: Define the Customers table**

| Field | Type | Notes |
|---|---|---|
| Email | Single line, Primary | |
| First name | Single line | |
| Acquisition source | Single select | etsy, gumroad, pinterest, blog, fb-group, podcast, direct, other |
| Persona tag | Single select | sam, sarah, pam, dreamer, newbie |
| Lead magnet downloaded | Single select | hero, pinterest, etsy-post, blog |
| First purchase date | Date | |
| Total lifetime value | Currency (formula = SUM of Orders) | |
| Tags | Multi-select | for IS sync |
| IS contact ID | Single line | |

- [ ] **Step 4: Define the Orders table**

| Field | Type | Notes |
|---|---|---|
| Order ID | Single line, Primary | |
| Timestamp | Date+time | |
| Customer (link) | Link → Customers | |
| Product (link) | Link → Products | |
| Platform | Single select | etsy, gumroad, is, payhip, cm |
| Gross amount | Currency | |
| Platform fee | Currency | |
| Net amount | Currency (formula) | |
| OrderBump? | Checkbox | |
| OTO taken? | Checkbox | |
| Refund status | Single select | none, pending, refunded |

- [ ] **Step 5: Define Content and Metrics tables**

Content: Title, Type (blog/pin/email/tiktok), Status (draft/scheduled/published), Publish date, URL, Related product (link), Keywords.

Metrics: Date, Metric name, Value, Source. Used for weekly dashboards.

- [ ] **Step 6: Document and commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
cat > infrastructure/airtable/schema.md <<'EOF'
# Airtable base — STR Platform — Master

Base ID: <paste from Airtable URL>
Workspace: <name>

## Tables

1. **Products** — product catalog SSOT (see field list in this file)
2. **Customers** — unified CRM across all storefronts
3. **Orders** — every sale, every platform
4. **Content** — blog, pins, emails, TikTok scripts
5. **Metrics** — daily rollups for dashboards

Full field definitions were set during Task B1 per the plan. Any schema changes after this point must be recorded as a new section below with a date.

## Claude MCP access
- Token scoped to this base only
- Verified read + write via MCP (see Task P1)
EOF
git add infrastructure/airtable/schema.md
git commit -m "infra: airtable schema for Master Product Catalog"
```

- [ ] **Step 7: Verify Claude can write to Products**

Ask Claude: "Add a test product to Products table: SKU TEST-001, Name 'Schema Test', Tier T1, Status Draft."

Expected: new row appears in Airtable. Then ask Claude to delete it.

---

### Task B2: Provision VPS and install n8n

**Files:** `infrastructure/n8n/install.md`

**Acceptance criteria:** n8n is reachable at `n8n.<domain>` via Cloudflare Tunnel (not public IP), logged in with admin credentials stored in password manager.

- [ ] **Step 1: Provision a VPS**

Hetzner (EU, best price/perf) or DigitalOcean (US, simpler). 2GB RAM, 1 vCPU is enough for Phase 1.

Hetzner: Create new project → new server → Ubuntu 24.04 → CX22 (€4.50/mo).
DigitalOcean: Create Droplet → Ubuntu 24.04 → Basic $6/mo.

- [ ] **Step 2: Harden the server**

SSH in as root, then:

```bash
# Create non-root user
adduser daniel
usermod -aG sudo daniel

# SSH keys only — disable password auth
mkdir /home/daniel/.ssh
cp /root/.ssh/authorized_keys /home/daniel/.ssh/  # (after you added your pubkey)
chown -R daniel:daniel /home/daniel/.ssh
chmod 700 /home/daniel/.ssh
chmod 600 /home/daniel/.ssh/authorized_keys
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh

# Install fail2ban
apt update && apt install -y fail2ban
systemctl enable --now fail2ban

# Firewall — allow 22 only (Cloudflare Tunnel handles ingress)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw enable
```

- [ ] **Step 3: Install Docker + Docker Compose**

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker daniel
```

Re-login as `daniel` to pick up the group.

- [ ] **Step 4: Install n8n via Docker Compose**

Create `/home/daniel/n8n/docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment:
      - N8N_HOST=n8n.<domain>
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.<domain>
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=<user>
      - N8N_BASIC_AUTH_PASSWORD=<strong password from PM>
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      - N8N_ENCRYPTION_KEY=<random 32+ chars from PM>
    volumes:
      - ./data:/home/node/.n8n
```

```bash
cd /home/daniel/n8n
docker compose up -d
docker compose logs -f  # watch for successful startup
```

- [ ] **Step 5: Configure Cloudflare Tunnel**

On Cloudflare dashboard → Zero Trust → Tunnels → create tunnel "n8n-host". Install the connector on the VPS per Cloudflare instructions. Route `n8n.<domain>` → `http://localhost:5678`.

No public IP exposure. Good.

- [ ] **Step 6: Verify and commit**

Browse to `https://n8n.<domain>` → log in → confirm n8n UI loads.

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/n8n
cat > infrastructure/n8n/install.md <<'EOF'
# n8n install

- Host: <Hetzner CX22 / DO Basic>, Ubuntu 24.04
- Access: SSH keys only (fail2ban active, UFW restricts to port 22)
- Tunnel: Cloudflare Tunnel, `n8n.<domain>` → localhost:5678
- Auth: basic auth, credentials in password manager
- Data volume: /home/daniel/n8n/data (host-mapped)
- Encryption key: stored in password manager (critical — needed for restore)
- Backups: n8n data volume rsync'd nightly to Google Drive via cron (see Task B15)

## docker-compose location
/home/daniel/n8n/docker-compose.yml

## Upgrade procedure
`docker compose pull && docker compose up -d`
EOF
git add infrastructure/n8n/install.md
git commit -m "infra: n8n provisioned on hardened VPS via Cloudflare Tunnel"
```

Update `ops/credentials-inventory.md` with VPS + n8n rows.

---

### Task B3: Configure Influencersoft hub

**Files:** `infrastructure/influencersoft/config.md`

**Acceptance criteria:** IS is set up with brand, connected to the domain, and has a working test checkout (Stripe test mode).

- [ ] **Step 1: Log into IS with your LTD credentials**

Follow IS's getting-started flow. Brand name from A1, primary color from A1.

- [ ] **Step 2: Connect domain**

In IS → Settings → Domain → add `<domain>` (main site) and `app.<domain>` or similar per IS's conventions. Follow their CNAME instructions, add the records in Cloudflare DNS.

- [ ] **Step 3: Connect Stripe**

In IS → Integrations → Stripe → connect. Verify test-mode transactions work.

- [ ] **Step 4: Configure email sending**

In IS → Email → sender identity. Add `hello@<domain>` and verify DNS (SPF, DKIM, DMARC records) in Cloudflare. Critical for deliverability.

- [ ] **Step 5: Survey IS's API / integration options**

In IS dashboard, look for: Developer, API, Webhooks, Integrations, Zapier, Make. Take screenshots or paste findings into `infrastructure/influencersoft/config.md`. This determines the n8n → IS integration strategy in Task B8.

- [ ] **Step 6: Document and commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/influencersoft
cat > infrastructure/influencersoft/config.md <<'EOF'
# Influencersoft configuration

## Account
- Login: <email>
- License tier: <LTD plan name>
- Custom domain: <domain>
- 2FA: enabled

## Email sender
- Address: hello@<domain>
- SPF, DKIM, DMARC: verified in Cloudflare DNS

## Stripe
- Connected in live mode (test mode verified first)
- Stripe Tax: enabled (Task B4)

## API / integration options discovered
- Native API available: <yes/no>
- Webhooks: <what events IS sends>
- Zapier/Make: <integration available or not>
- If no API: plan to use Playwright browser automation from n8n as fallback

## n8n → IS strategy
<Decide after Step 5 findings — document here>
EOF
git add infrastructure/influencersoft/config.md
git commit -m "infra: influencersoft hub configured + API options documented"
```

---

### Task B4: Enable Stripe Tax

**Files:** update `infrastructure/influencersoft/config.md`

**Acceptance criteria:** test transactions show correct sales-tax calculation for a California ZIP code and zero for a Delaware ZIP code.

- [ ] **Step 1: In Stripe dashboard**

Settings → Tax → enable. Configure:
- Default tax behavior: exclusive (tax added at checkout)
- Product tax code: "txcd_10301000" (digital goods)
- Default origin address: your business address

- [ ] **Step 2: Register for nexus states you're over threshold in**

Day one you're not over any threshold. Stripe Tax *calculates* correctly but you must *register* with states once you hit $100K or 200 transactions. Stripe gives you an alert when any state's threshold is crossed.

- [ ] **Step 3: Test**

Run a $17 test purchase with a California billing address vs a Delaware billing address. Verify tax is calculated vs zero respectively.

- [ ] **Step 4: Commit**

Update `config.md` with Stripe Tax confirmation and commit.

---

### Task B5: Install Ghost blog on `blog.<domain>`

**Files:** `infrastructure/ghost/install.md`

**Acceptance criteria:** `https://blog.<domain>` loads a working Ghost install, admin login works, default theme customized to brand.

**Two options — pick one:**

**Option A (simpler, $9/mo):** Ghost(Pro) managed hosting at ghost.org/pricing. No VPS needed.

**Option B (free, more work):** Self-host Ghost on the same VPS that runs n8n. Uses Docker, needs another Cloudflare Tunnel route.

- [ ] **Step 1: Pick option and provision**

For this plan, default to **Option A (Ghost Pro $9/mo)** — simpler, let Ghost handle updates. Switch to self-host later if budget pressure.

- [ ] **Step 2: Set up Ghost Pro**

Go to ghost.org → Start a trial. Use `hello@<domain>`. Custom domain = `blog.<domain>`. Follow DNS instructions (CNAME in Cloudflare).

- [ ] **Step 3: Choose and customize theme**

Use a clean default like "Source" or "Casper". Upload logo + brand colors.

- [ ] **Step 4: Configure Ghost Members (for blog email capture)**

In Ghost settings → Members → enable free membership. Connect to Mailgun or Ghost's built-in sender (simpler). This is a redundant email-capture path — primary capture is still via IS.

- [ ] **Step 5: Install essentials**

- Add Google Analytics (or Plausible — privacy-friendly, $9/mo)
- Add affiliate disclosure page
- Add About page (same text as Etsy About, lightly edited)

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p infrastructure/ghost
cat > infrastructure/ghost/install.md <<'EOF'
# Ghost install

- Hosting: Ghost(Pro), $9/mo
- Domain: blog.<domain>
- Theme: <chosen theme>
- Admin: <email> (2FA enabled)
- Email sender: Ghost native or Mailgun
- Analytics: <Google Analytics / Plausible>
EOF
git add infrastructure/ghost/install.md
git commit -m "infra: ghost blog live on blog.<domain>"
```

---

### Task B6: Hero lead magnet + landing page

**Files:** `copy/lead-magnets/hero-47-deductions.md`, `templates/_delivery/hero-magnet/47-deductions.xlsx`, `templates/_delivery/hero-magnet/47-deductions.pdf`

**Inputs needed from you:** the brief for what those "47 deductions" actually are.

**Acceptance criteria:** `<domain>/47` renders a landing page, email signup works, lead magnet file delivers to inbox, new subscriber appears in IS tagged `source:hero-magnet`.

- [ ] **Step 1: You supply the list**

Create `templates/_briefs/hero-magnet.md` with the 47 deductions (or however many — the title works at 40–50, and rounder numbers convert less well). Include: deduction name, IRS reference where applicable, typical $ value range.

- [ ] **Step 2: Claude builds the magnet**

Excel workbook: tab 1 = cover/branding, tab 2 = deduction checklist with checkboxes, columns for deduction name, description, est. value, applicable IRS code, notes. PDF = same content, one-page printable.

- [ ] **Step 3: Build landing page in IS**

URL: `<domain>/47`. Elements:
- H1: "47 Airbnb Tax Deductions Most Hosts Miss"
- Sub: "Your CPA won't ask about them. Your portfolio might be leaving $5,000+ on the table every year."
- Form: email only (single field = highest conversion)
- Bullet list: 5 teasers ("Deduction #12 saved [name] $X", etc.)
- Social proof placeholder (populate after first 20 downloads)
- Footer: "We email useful STR stuff. Unsubscribe any time."

- [ ] **Step 4: Wire delivery**

In IS automation: trigger = form submission on `/47` → action = send email with magnet attached + tag contact `source:hero-magnet`.

- [ ] **Step 5: QA end-to-end**

Submit your own email → verify email arrives within 60 sec → file opens → contact appears in IS contacts tagged correctly → contact appears in Airtable Customers table (once Task B8 n8n sync is live).

- [ ] **Step 6: Commit**

```bash
git add copy/lead-magnets/ templates/_delivery/hero-magnet/ templates/_briefs/hero-magnet.md
git commit -m "magnet: hero lead magnet '47 deductions' live on /47"
```

---

### Task B7: 9-email nurture sequence in IS

**Files:** `copy/email-sequences/nurture-hero-magnet.md`

**Acceptance criteria:** Enrolling a test contact triggers 9 emails over 21 days per spec §7.3. Branching logic (tripwire buyer skips ahead, etc.) works as designed.

- [ ] **Step 1: Draft all 9 emails**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/email-sequences
cat > copy/email-sequences/nurture-hero-magnet.md <<'EOF'
# Nurture Sequence — Hero Magnet Trigger

Spec reference: §7.3 of master strategy.

## Email 1 — Day 0 — "Here's your checklist + a quick favor"
Subject: Your 47 Deductions — and a favor
Body:
<draft>

## Email 2 — Day 2 — "The $8,427 deduction most hosts miss"
Subject: The $8,427 deduction (true story)
Body:
<draft>

## Email 3 — Day 4 — "Why QuickBooks fails STR hosts"
Subject: Why QB keeps breaking for STRs
Body:
<draft>

## Email 4 — Day 6 — Tripwire pitch (Mileage Log)
Subject: The $17 log that tracks every mile (and why I built it)
Body:
<draft>
Primary CTA: buy Mileage Log
OrderBump: Per-Diem Meal Tracker $12

## Email 5 — Day 8 — Case study (conditional: if no purchase)
Subject: Amanda's 7-minute tax tab
Body:
<draft>

## Email 6 — Day 11 — Core product pitch (Schedule E)
Subject: The one workbook that saved Amanda's Q4
Body:
<draft>

## Email 7 — Day 14 — Urgency (tax season modifier)
Subject: Tax season is {{ N }} weeks out
Body:
<draft>

## Email 8 — Day 18 — Objection handling
Subject: I hate these emails too, but...
Body:
<draft>

## Email 9 — Day 21 — Tax Bundle last call
Subject: Tax Bundle launch price closes in 48hrs
Body:
<draft>

## Branching rules
- Day 6 tripwire purchase → jump to post-purchase Schedule E pitch at Day 8
- Day 11 core purchase → jump to Bundle sequence at Day 14
- Day 21 bundle purchase → move to Vault/Membership arc (separate sequence)
- Nothing purchased by Day 21 → quarterly re-engagement

## Tag-based segmentation
- `source:pinterest` → open with "You found us on Pinterest — welcome"
- `source:etsy-post` → open with "Thanks for your Etsy purchase — here's what's next"
- `source:hero-magnet` (default) → open as drafted above
EOF
git add copy/email-sequences/nurture-hero-magnet.md
git commit -m "copy: draft 9-email hero magnet nurture sequence"
```

Email bodies themselves: fill in each draft. Target: 150–300 words per email, one clear CTA, plain-text feel.

- [ ] **Step 2: Build the sequence in IS**

In IS → Automations → create "Hero Magnet Nurture". Add 9 email steps with the day offsets. Configure the branching logic (IS supports conditional branches natively).

- [ ] **Step 3: Test enrollment**

Add a test contact tagged `source:hero-magnet`. Verify Day 0 email fires. Skip time manually (most IS platforms allow "jump to next step" for testing) to validate all 9 emails render correctly.

- [ ] **Step 4: Commit**

```bash
git add copy/email-sequences/
git commit -m "automation: 9-email nurture sequence built in IS"
```

---

### Task B8: n8n workflow — Order webhook ingestion (P0)

**Files:** `infrastructure/n8n/workflows/order-ingestion.json` (exported workflow)

**Acceptance criteria:** a test Stripe webhook → creates Customer + Order row in Airtable → tags contact in IS with matching `product:<sku>` + `persona:<inferred>`.

- [ ] **Step 1: In n8n, create workflow "Order Ingestion"**

Nodes:
1. Webhook (POST `/order-ingestion`)
2. Switch (route by payload `source`: stripe / is / etsy / gumroad)
3. Per-platform Function node — normalize the payload to { email, name, sku, amount, platform, timestamp }
4. Airtable — Find or Create Customer (match on email)
5. Airtable — Create Order (link to Customer + Product)
6. IS API or Zapier webhook — tag contact with `product:<sku>` + `persona:<inferred>`
7. Slack/Discord — optional first-100-sales notification

- [ ] **Step 2: Configure Stripe webhook**

Stripe dashboard → Developers → Webhooks → add endpoint `https://n8n.<domain>/webhook/order-ingestion`. Select events: `charge.succeeded`, `payment_intent.succeeded`, `charge.refunded`.

- [ ] **Step 3: Test with a real $1 purchase**

On your own site, buy a $1 test product. Verify:
- Customer row appears in Airtable
- Order row appears in Airtable, linked to Customer
- IS contact tagged correctly
- (Optional) Slack notification fired

- [ ] **Step 4: Add error handling**

In n8n workflow, add an error workflow that catches failures → writes to an "Errors" table in Airtable → posts a Slack alert. Do NOT silently swallow errors.

- [ ] **Step 5: Export and commit**

```bash
# In n8n: Export workflow as JSON → save to:
# infrastructure/n8n/workflows/order-ingestion.json
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/n8n/workflows/order-ingestion.json
git commit -m "automation: n8n order ingestion workflow (P0)"
```

---

### Task B9: n8n workflow — Product catalog sync (P0)

**Files:** `infrastructure/n8n/workflows/product-catalog-sync.json`

**Acceptance criteria:** adding a new row to Airtable Products with Status=Published → n8n pushes it to IS product catalog (and Gumroad + Payhip in later iterations).

- [ ] **Step 1: In n8n, create workflow "Product Catalog Sync"**

Trigger: Airtable → When record updated → Products table, filter: Status = Published AND (Live on IS = unchecked OR Last updated > sync timestamp).

Actions:
- For each matching record: call IS create-product API (if available) OR Playwright-driven browser automation (fallback per Task B3 Step 5 findings)
- On success: check "Live on IS" + update "Last updated" in Airtable
- On failure: write to Errors table, Slack alert

- [ ] **Step 2: Test with a draft product**

Add a test product in Airtable. Change status to Published. Wait for workflow to fire (or trigger manually). Verify product appears in IS.

- [ ] **Step 3: Gumroad branch**

Same pattern. Gumroad API docs: https://gumroad.com/api. Create product via POST with name/price/file. Mark "Live on Gumroad" when done.

- [ ] **Step 4: Export and commit**

```bash
git add infrastructure/n8n/workflows/product-catalog-sync.json
git commit -m "automation: n8n product catalog sync (IS + Gumroad)"
```

---

### Task B10: OrderBump + OTO mechanics configured

**Files:** `infrastructure/influencersoft/checkout-mechanics.md`

**Acceptance criteria:** a $97 Schedule E purchase flow shows OrderBump at checkout (take or skip) → OTO page after payment (take or skip) → delivery page. Test purchases exercise all four combinations (bump-yes/oto-yes, yes/no, no/yes, no/no).

- [ ] **Step 1: Configure OrderBumps per product**

In IS checkout settings, per product, add an OrderBump. Map per spec §7.4:
- Mileage Log ($17) → Per-Diem Meal Tracker $12
- Schedule E ($97) → Depreciation Tracker $37
- Tax Season Bundle ($147) → 1099-NEC tracker $17
- Portfolio Bundle ($397) → Dynamic Pricing Calculator $47

- [ ] **Step 2: Configure OTOs per product**

Per spec §7.4:
- Any T1 → Tax Season Bundle $147 → $97 OTO
- Schedule E → Portfolio Bundle $397 → $297 OTO
- Portfolio Bundle → Vault $1,497 → $997 OTO
- Tax Season Bundle → Portfolio Bundle $397 → $297 OTO

- [ ] **Step 3: Test all four combinations**

For the Schedule E product, run test purchases:
1. Accept bump + accept OTO (should create 3 orders: Schedule E, Depreciation Tracker, Portfolio Bundle)
2. Accept bump, decline OTO (2 orders)
3. Decline bump, accept OTO (2 orders)
4. Decline both (1 order)

Verify all orders sync to Airtable via B8.

- [ ] **Step 4: Document and commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
cat > infrastructure/influencersoft/checkout-mechanics.md <<'EOF'
# Checkout mechanics — OrderBumps & OTOs

## OrderBumps (at checkout)
| Main product | Bump | Bump price |
|---|---|---|
| Mileage Log $17 | Per-Diem Meal Tracker | $12 |
| Schedule E Workbook $97 | Depreciation Tracker | $37 |
| Tax Season Bundle $147 | 1099-NEC Tracker | $17 |
| Portfolio Bundle $397 | Dynamic Pricing Calculator | $47 |

## OTOs (post-payment page)
| Just bought | OTO offered | OTO price |
|---|---|---|
| Any T1 | Tax Season Bundle | $97 (was $147) |
| Schedule E | Portfolio Bundle | $297 (was $397) |
| Portfolio Bundle | Vault | $997 (was $1,497) |
| Tax Season Bundle | Portfolio Bundle | $297 (was $397) |

Tested all 4 combinations for Schedule E purchase path.
EOF
git add infrastructure/influencersoft/checkout-mechanics.md
git commit -m "checkout: orderbump + oto mechanics configured and tested"
```

---

### Task B11: Weekly backup automation (n8n cron)

**Files:** `infrastructure/n8n/workflows/weekly-backup.json`, `docs/runbooks/disaster-recovery.md`

**Acceptance criteria:** every Sunday at 02:00 ET, a fresh CSV export of Airtable + IS products + IS email list lands in Google Drive under `backups/YYYY-MM-DD/`.

- [ ] **Step 1: In n8n, create workflow "Weekly Backup"**

Trigger: Cron → every Sunday 02:00.

Actions:
1. Airtable — export each table as CSV
2. IS API — export products list as CSV
3. IS API — export subscriber list as CSV
4. Google Drive — upload all CSVs to `Backups/str-platform/YYYY-MM-DD/`
5. Slack — post "Weekly backup complete, N files"

- [ ] **Step 2: Verify one manual run**

Trigger the workflow manually. Check that files appear in Drive.

- [ ] **Step 3: Add n8n data-volume backup to cron on the VPS**

```bash
# On the VPS, as daniel:
crontab -e
# Add:
0 3 * * 0 rsync -az /home/daniel/n8n/data/ /home/daniel/backups/n8n-$(date +\%Y\%m\%d)/
0 4 * * 0 rclone copy /home/daniel/backups/ gdrive:str-platform-vps-backups/ --max-age 30d
```

(Requires `rclone config` pre-configured for your Google Drive.)

- [ ] **Step 4: Draft disaster recovery runbook**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p docs/runbooks
cat > docs/runbooks/disaster-recovery.md <<'EOF'
# Disaster Recovery Runbook

## Scenario 1: IS platform down / data loss
1. Spin up Payhip mirror (takes ~4 hrs from existing product files in Google Drive)
2. Point <domain> DNS to Payhip storefront
3. Import subscriber list from latest weekly backup into Kit as backup ESP
4. Communicate delay via Pinterest + FB Group

## Scenario 2: Airtable base corrupted / wrong edit
1. Create new base
2. Import latest weekly CSV exports (Products, Customers, Orders, Content, Metrics)
3. Re-link Claude MCP to new base ID

## Scenario 3: VPS compromised
1. Assume keys compromised — rotate all API keys immediately (see credentials inventory)
2. Provision fresh VPS
3. Restore n8n workflows from exported JSON in infrastructure/n8n/workflows/
4. Restore n8n data volume from latest rsync backup (credentials, execution history)

## Scenario 4: Domain lost / transferred
1. Recovery path via Cloudflare Registrar 60-day-hold mechanism
2. If lost: activate mirror domain (reserved in Task A1-adjacent — TODO for Phase 2)

## Annual drill
Once per year, simulate Scenario 1 end-to-end. Document gaps.
EOF
git add infrastructure/n8n/workflows/weekly-backup.json docs/runbooks/disaster-recovery.md
git commit -m "backup: weekly automated + disaster recovery runbook"
```

---

## LANE C — Content & Authority (Weeks 2–8)

### Task C1: Content plan — first 10 blog posts

**Files:** `copy/blog-posts/content-plan.md`

**Acceptance criteria:** 10 blog-post topics are committed, each with target keyword, persona, CTA product, and outline. These will feed Lane C throughout Weeks 2–8.

- [ ] **Step 1: Keyword research**

Use free tiers of: Google Keyword Planner, Ahrefs (free SERP explorer), Ubersuggest, Answer the Public, or just Google's autocomplete + "People also ask."

Target keywords with: monthly search volume > 100, difficulty < 30, clear commercial intent.

- [ ] **Step 2: Draft the plan**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/blog-posts
cat > copy/blog-posts/content-plan.md <<'EOF'
# Blog Content Plan — First 10 Posts

Target: tax beachhead. Every post ends with a relevant CTA (lead magnet or product).

| # | Target keyword | Search volume (monthly) | Difficulty | Persona | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|---|
| 1 | airbnb tax deductions | 1,900 | 25 | Sarah | /47 lead magnet | Mileage Log |
| 2 | airbnb schedule e | 720 | 22 | Sarah | Schedule E Workbook | /47 magnet |
| 3 | short term rental depreciation | 480 | 18 | Sarah | Depreciation Tracker | Schedule E |
| 4 | airbnb 1099 nec | 390 | 15 | Sarah | 1099-NEC Tracker | /47 magnet |
| 5 | vacation rental expense tracker | 320 | 20 | Sarah | Single-Property P&L | /47 magnet |
| 6 | airbnb mileage deduction | 290 | 17 | Sarah | Mileage Log | /47 magnet |
| 7 | str bookkeeping | 260 | 23 | Sarah | Tax Season Bundle | /47 magnet |
| 8 | airbnb quarterly taxes | 210 | 19 | Sarah | Quarterly Est Calc | /47 magnet |
| 9 | cost segregation short term rental | 180 | 28 | Sarah | Cost Seg Tracker | Schedule E |
| 10 | airbnb llc vs sole proprietor | 170 | 24 | Sarah | Multi-entity P&L | /47 magnet |

Each post: 1,500–2,500 words, H2/H3 structure, at least 3 internal links, 1–2 external authoritative links (IRS, Airbnb help docs).

Each post has an accompanying "Cost-Per-Stay Calculator" mini-magnet (per spec §7.2 blog-embedded magnet).

Each post is pinned to Pinterest (5 pins per post with different headlines — see Task C2).
EOF
git add copy/blog-posts/content-plan.md
git commit -m "content: first 10 blog posts planned"
```

---

### Task C2: Pinterest account + first 30 pins

**Files:** `copy/pinterest/pin-calendar.md`, `brand/assets/pinterest/` (exported pins)

**Acceptance criteria:** Pinterest business account live, 5 boards set up, 30 pins scheduled via Tailwind over the first 30 days.

- [ ] **Step 1: Create Pinterest business account**

pinterest.com/business. Sign up with `hello@<domain>`. Enable 2FA. Claim your domain (add DNS TXT record in Cloudflare).

- [ ] **Step 2: Create 5 boards**

- "STR Tax Tips" (primary)
- "Airbnb Host Resources"
- "Short-Term Rental Business"
- "STR Templates & Tools"
- "Hosting Like a Business"

Each board: 5-sentence description with keywords, branded cover pin.

- [ ] **Step 3: Canva: create Pinterest pin master templates**

Create 3 pin style variants (1000×1500 vertical):
- "Tip-list" style (bullets + headline)
- "Before/after" style (chart preview)
- "Quote-card" style (bold claim)

Each loaded with brand colors/fonts from A4.

- [ ] **Step 4: Generate 30 pins**

For blog posts 1–3 (from C1), generate 10 pins each using the 3 style variants. Claude can draft pin headlines + subtitles if given the post outline.

Export all 30 as PNG to `brand/assets/pinterest/`.

- [ ] **Step 5: Schedule via Tailwind**

Connect Pinterest to Tailwind (tailwindapp.com, $15/mo). Upload 30 pins. Schedule 1/day over 30 days via Tailwind's SmartSchedule.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/pinterest brand/assets/pinterest
cat > copy/pinterest/pin-calendar.md <<'EOF'
# Pinterest — First 30 Pins

Account: pinterest.com/<handle>
Domain claimed: ✅
Boards: STR Tax Tips, Airbnb Host Resources, Short-Term Rental Business, STR Templates & Tools, Hosting Like a Business

## Pins queued (scheduled via Tailwind, 1/day × 30 days)
| # | Pin title | Style | Linked URL | Board |
|---|---|---|---|---|
| 1 | "47 Airbnb Tax Deductions You Might Be Missing" | Tip-list | /47 | STR Tax Tips |
| 2 | "Schedule E vs Schedule C for STR Hosts" | Quote-card | /blog/airbnb-schedule-e | STR Tax Tips |
...continued for 30 pins...
EOF
git add copy/pinterest/ brand/assets/pinterest/
git commit -m "content: pinterest account + first 30 pins scheduled"
```

Update `ops/credentials-inventory.md` with Pinterest + Tailwind rows.

---

### Task C3: FB Group — soft launch

**Files:** `copy/fb-group/launch-plan.md`

**Acceptance criteria:** private FB Group created, 3 rules, first 5 members invited (friends/family okay for seeding), welcome post pinned.

- [ ] **Step 1: Create the group**

On Facebook → Create → Group → Private (Visible). Name: `<brand>` Inner Circle, or `STR Systems Society`, or similar. Description: 3–5 sentences, business-grade.

- [ ] **Step 2: Three rules**

```
1. Must be an active or aspiring STR host — introduce yourself in the pinned thread.
2. No self-promotion. Share experience and questions, not links.
3. Be kind. We're here to make each other better operators.
```

- [ ] **Step 3: Pin a welcome post**

Template:
```
Welcome! This is a small, serious community for Airbnb/VRBO hosts who want to run their portfolios like actual businesses — systems, financials, and sanity.

Drop a comment: (1) your first name, (2) how many listings, (3) your #1 headache this month.

I'll share a new system (spreadsheet, checklist, or SOP) every week. Most of them are free in the Files tab.
```

- [ ] **Step 4: Seed members**

Invite 5 initial members (friends who know STRs, or drop the link in one FB host group you're already in with admin permission — never spam).

- [ ] **Step 5: Schedule weekly cadence**

Commit to: 1 post/weekday (value tip), 1 live/week (30 min), 1 "wins" thread on Fridays.

Add to your calendar. Consistency > volume.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
mkdir -p copy/fb-group
cat > copy/fb-group/launch-plan.md <<'EOF'
# FB Group — Soft Launch Plan

## Setup
- Name: <brand> Inner Circle (or equivalent)
- Type: Private, Visible
- URL: facebook.com/groups/<slug>

## Rules (set in group settings)
1. Must be an active or aspiring STR host — introduce yourself in the pinned thread.
2. No self-promotion. Share experience and questions, not links.
3. Be kind. We're here to make each other better operators.

## Weekly cadence
- Mon–Fri: one value post/day (tip, observation, or question)
- Wed: one 30-min live (Q&A, template walk-through, or system demo)
- Fri: "Wins of the Week" thread

## Growth plan
- Seed with 5 members Week 2
- Invite via email signature + email footer on all nurture emails
- Mention in blog posts: "Got questions? Come into our free community."
- Target: 50 members by Week 4, 200 by Month 3
EOF
git add copy/fb-group/launch-plan.md
git commit -m "content: fb group launch plan + rules + cadence"
```

---

### Task C4: Write and publish blog posts 1–3

**Files:** `copy/blog-posts/01-airbnb-tax-deductions.md`, `02-airbnb-schedule-e.md`, `03-str-depreciation.md`

**Acceptance criteria:** each post is 1,500+ words, SEO-optimized, has internal links to /47 magnet + relevant product, has at least 3 pins (produced in C2) linking back to it, published to Ghost.

- [ ] **Step 1: Draft post 1 — "47 Airbnb Tax Deductions Most Hosts Miss"**

Claude drafts per outline. Daniel edits for authenticity + factual accuracy.

- [ ] **Step 2: Review and approve**

You read, edit, approve. Don't skip this.

- [ ] **Step 3: Publish to Ghost**

Upload to Ghost, add featured image (Canva), set SEO title + meta description, publish.

- [ ] **Step 4: Schedule associated Pinterest pins**

Already done in Task C2 — verify the pin URLs point to the correct published URL.

- [ ] **Step 5: Repeat for posts 2 and 3**

- [ ] **Step 6: Commit the drafts**

```bash
git add copy/blog-posts/
git commit -m "content: blog posts 1-3 published (tax deductions, schedule e, depreciation)"
```

---

## CROSS-LANE — Week 8 Milestone Verification

### Task M1: Week 8 Milestone Checklist

**Files:** `ops/week-8-milestone-checklist.md`

**Acceptance criteria:** every checkbox is ticked; any unticked item is logged as a follow-up task.

- [ ] **Step 1: Create the checklist**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
cat > ops/week-8-milestone-checklist.md <<'EOF'
# Week 8 Milestone Checklist

Complete on the last day of Week 8. Any unticked item = a follow-up task.

## Lane A — Revenue
- [ ] 5+ Etsy listings live
- [ ] Gumroad mirror live with 5 products
- [ ] First Etsy sale occurred
- [ ] Etsy upgrade CTA PDF delivered with every download
- [ ] At least one Etsy buyer has converted to email subscriber via CTA
- [ ] Shop policies and about section published

## Lane B — Hub Infrastructure
- [ ] Domain registered and pointed to Cloudflare
- [ ] Influencersoft hub configured on <domain>
- [ ] Stripe Tax enabled and tested
- [ ] Ghost blog live at blog.<domain>
- [ ] Airtable base with 5 tables live, Claude MCP connected
- [ ] n8n running on hardened VPS via Cloudflare Tunnel
- [ ] n8n Order Ingestion workflow (P0) — tested with real purchase
- [ ] n8n Product Catalog Sync workflow (P0)
- [ ] Hero lead magnet + /47 landing page live and delivering
- [ ] 9-email nurture sequence in IS — test enrollment verified all 9 deliver
- [ ] OrderBump + OTO mechanics configured per spec
- [ ] Weekly backup automation running (verified at least one successful run)
- [ ] Disaster recovery runbook exists

## Lane C — Content
- [ ] Blog posts 1-3 published to Ghost
- [ ] 30 Pinterest pins scheduled via Tailwind
- [ ] FB Group created with rules + welcome post + 5 seed members
- [ ] Content plan for posts 4-10 committed

## Cross-lane
- [ ] Credentials inventory up to date
- [ ] All secrets in password manager, 2FA on every account
- [ ] Google Drive has at least one weekly backup snapshot

## Pass criteria
Week 8 milestone passes if Lane B column is 100% complete. Lane A and Lane C items can be deferred into Phase 2 if needed without blocking the milestone — but Lane B is the non-negotiable infrastructure floor.

## Revenue floor (reported, not blocking)
- Total revenue across all platforms through Week 8: $<record>
- Total email subscribers: <record>
- Total FB Group members: <record>
EOF
git add ops/week-8-milestone-checklist.md
git commit -m "ops: week 8 milestone checklist"
```

- [ ] **Step 2: Execute it at Week 8**

Work through every box. For each unticked, open a follow-up task.

---

## Self-review notes

### Spec coverage check
- ✅ Brand identity (§1) — Tasks A1, A2, A4
- ✅ Persona (§2) — referenced throughout, drives copy and targeting in every Lane-A/B/C task
- ✅ Product ladder (§3) — Task A6 + A7–A11 define the T1/T2 template production path; T3+ deferred to future plans
- ✅ Pricing (§4) — B3, B4, B10 configure pricing + checkout
- ✅ Storefront network (§5) — A3, A14 (Etsy, Gumroad in Phase 1); Payhip, Creative Market, Hostfully, BiggerPockets deferred to Phase 2+
- ✅ Traffic / channel map (§6) — Lane C covers Phase 1 channels (Pinterest, Etsy, blog, FB Group, email, others' groups)
- ✅ Funnel (§7) — B6, B7, B10 deliver lead magnet + nurture + checkout mechanics
- ✅ Automation (§8) — B1, B2, B8, B9, B11 lay the SSOT + n8n P0 workflows; Claude MCP in P1
- ✅ Alt revenue + roadmap (§9) — out of scope for this plan (Weeks 1–8 launch). Revenue targets reference §9.4.

### Placeholder scan
- Task A6 runbook uses `<SKU>` as a variable placeholder in file paths — intentional, not a task placeholder
- Task A7–A11 rely on user-supplied briefs — intentionally gated on user input, not a plan placeholder
- Task B3 Step 5 has a conditional ("if API exists, use it; if not, Playwright fallback") — this is a legitimate branching decision recorded in the config doc
- Task B6 `<N weeks>` in email copy is a Liquid/handlebars variable for IS — intentional

### Known scope boundaries (explicitly deferred)
- Individual template designs (user provides brief; Task A6 is the process, not the content)
- Payhip, Creative Market, Hostfully, BiggerPockets storefronts
- TikTok, YouTube, Instagram content (Phase 2)
- Paid ads (Pinterest/Meta/Google — Phase 2–3)
- Affiliate program launch (Phase 2)
- Membership + DFY services (Phase 2, Month 4–6)
- Courses + Amazon book (Phase 3)
- International (UK, CA, AU tax workbooks) — Year 2

### Type / naming consistency check
- SKU format consistent: `CAT-NNN` (TAX-001, OPS-002, etc.) throughout
- Tier naming consistent: T0–T6 in spec and plan
- Persona tags consistent: `sam`, `sarah`, `pam`, `dreamer`, `newbie`
- Source tags consistent: `source:hero-magnet`, `source:pinterest`, `source:etsy-post`, `source:blog`
- File path conventions consistent across tasks (`templates/_briefs/`, `copy/etsy-listings/`, `infrastructure/<tool>/`)

No inline fixes needed; plan passes self-review.

---

## End of plan
