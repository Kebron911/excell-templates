# Daniel's Manual Action Manual — The STR Ledger

> **Scope:** only the things that literally cannot be automated — regulatory/KYC actions, device-bound 2FA, creative inputs, OAuth consent clicks, and review gates. Everything else (DNS, listings, Excel builds, workflows, pin images, etc.) is in [automation-queue.md](automation-queue.md) for Claude to build.
>
> **How to use:** work top-to-bottom. Each numbered item tells you what to do and what signal phrase unblocks the next wave of Claude work. If you notice something listed here that Claude *could* automate, say so — we move it to the automation queue.

---

## Phase 0 — Decisions ✅ DONE

- **Brand locked 2026-04-22:** The STR Ledger / `thestrledger.com` / `hello@thestrledger.com` — see [brand/brand-decisions.md](../brand/brand-decisions.md).
- **Credential vault:** Vaultwarden, already self-hosted and running. Claude will import STR-Ledger credentials via `bw` CLI — you just need the vault URL + an API access token entered into `ops/credentials-inventory.md`.

---

## Phase 1 — Regulatory / KYC account actions (cannot be API'd)

Banks, tax IDs, and government-ID uploads require a human to submit them. Do these in any order.

### [ ] 1.1 — Open Etsy seller account (45 min)

Only the legal onboarding is manual. Shop appearance + listings happen via Etsy API later.

1. https://www.etsy.com/sell with `hello@thestrledger.com`.
2. Shop name: `The STR Ledger` (first verify availability — Etsy search).
3. US / English / USD.
4. Bank info. Tax ID (SSN sole prop or EIN LLC).
5. Enable 2FA (authenticator app, not SMS) — see Phase 2.
6. Save shop as **"On vacation"** until Claude publishes first listing.
7. Accept Etsy's developer API terms — this is needed so Claude can publish via API. https://www.etsy.com/developers → register app → note client ID + OAuth secret → add to Vaultwarden.

**Tell Claude "Etsy account open + API app registered."**

### [ ] 1.2 — Confirm Stripe account configuration (10 min)

Stripe account already exists. Only the regulatory fields need human confirmation.

1. Confirm bank account on file is the one you want Etsy / Gumroad / IS payouts routed to.
2. Confirm tax ID on file is correct for this business.
3. Confirm 2FA is on an authenticator app (not SMS). If SMS, switch.
4. Generate a Stripe CLI API key: Stripe dashboard → Developers → API keys → create restricted key with `stripe_cli` scope. Add to Vaultwarden.

Claude handles the rest (statement descriptor update, Stripe Tax enable, restricted keys for IS + n8n) via the Stripe API in automation queue A3.

**Tell Claude "Stripe confirmed + CLI key added."**

### [ ] 1.3 — Open Gumroad account (20 min)

1. https://gumroad.com with `hello@thestrledger.com`.
2. Username: `thestrledger` (lowercase).
3. Enable 2FA.
4. Submit bank info. Tax ID.
5. Generate Gumroad API token: Settings → Advanced → Applications → create application → note access token. Add to Vaultwarden.

Claude handles product creation (5 SKUs) via Gumroad API later.

**Tell Claude "Gumroad account open + API token added."**

### [ ] 1.4 — Open Airtable + generate MCP token (15 min)

1. https://airtable.com → sign up. Free tier is fine; upgrade to Team ($20/mo) before 5.x automation-queue tasks if Metadata API schema creation is needed.
2. Enable 2FA.
3. Create personal access token: `data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write` — all current and future bases. Add to Vaultwarden.
4. In a terminal:
   ```
   npm install -g airtable-mcp-server
   claude mcp add airtable --env AIRTABLE_API_KEY=pat_XXXX -- npx -y airtable-mcp-server
   ```
5. Restart Claude Code.
6. In a new session, ask Claude to list bases. Confirm response.

**Tell Claude "Airtable MCP connected."**

### [ ] 1.5 — Buy domain + Google Workspace (20 min human time)

Registrar signup and Workspace billing need you; DNS configuration is API-able.

1. Cloudflare dashboard → Domain Registration → buy `thestrledger.com` if not already owned. Add to Vaultwarden.
2. Generate a Cloudflare API token scoped to `thestrledger.com` zone (Zone:DNS:Edit). Add to Vaultwarden — Claude writes all DNS records via API (automation queue B1).
3. Sign up for Google Workspace ($6/user/mo) with domain `thestrledger.com`.
4. Create `hello@thestrledger.com` as primary inbox.
5. Enable 2FA on Google Workspace.

Claude writes the MX, TXT verification, SPF, DKIM, DMARC records via Cloudflare API — you do not click in Cloudflare's UI.

**Tell Claude "domain + workspace live + Cloudflare API token added."**

### [ ] 1.6 — Provision VPS (20 min human time)

Provider signup + billing = you. OS config = Ansible.

1. Pick Hetzner CX22 or DigitalOcean Basic. Ubuntu 24.04.
2. Create project / add payment method.
3. Generate SSH ed25519 keypair locally (`ssh-keygen -t ed25519`); upload public key to provider.
4. Spin up one server. Note the IP.
5. Add provider API token to Vaultwarden (for future scaling/backups). Add VPS IP + SSH private key location to `ops/credentials-inventory.md`.

Claude runs the Ansible hardening + Docker + n8n + Cloudflare Tunnel + Vaultwarden-import scripts (automation queue C1–C4).

**Tell Claude "VPS up at <IP> + SSH key ready."**

### [ ] 1.7 — Pay for remaining SaaS (30 min human time, mostly async)

Account creation with your payment method. All configuration is API-able after.

- [ ] **Ghost(Pro)** Starter ~$9/mo — https://ghost.org/pricing with `hello@thestrledger.com`. Enable 2FA. Generate Admin API key → Vaultwarden.
- [ ] **Plausible / Google Analytics** — pick one. Plausible $9/mo, privacy-friendly. GA free.
- [ ] **Vista Create** — redeem AppSumo/LTD if not done. Not strictly needed if Claude generates all images programmatically (see automation queue F1), but handy as an escape hatch for any brand asset that's easier by hand.
- [ ] **Creasquare** — redeem LTD. Enable 2FA.
- [ ] **Influencersoft** — redeem LTD. Enable 2FA. Generate API key if IS has one (survey in 4.2).

**Tell Claude "all SaaS paid + API keys added."**

---

## Phase 2 — 2FA + offline backups (one pass, ~1 hr total)

### [ ] 2.1 — Enable 2FA on every account (authenticator app, not SMS)

Checklist — confirm each:

- [ ] Cloudflare
- [ ] Google Workspace
- [ ] Stripe
- [ ] Etsy
- [ ] Gumroad
- [ ] Airtable
- [ ] Ghost
- [ ] VPS provider
- [ ] Vista Create
- [ ] Creasquare
- [ ] Influencersoft
- [ ] Pinterest (set up later in 4.1)
- [ ] Meta (FB / IG) (later in 4.1)
- [ ] LinkedIn (later in 4.1)
- [ ] GitHub (if not already)
- [ ] Vaultwarden itself

### [ ] 2.2 — Offline 2FA recovery-code backup

1. For every account with 2FA, download/copy the 10-digit recovery codes.
2. Save to Vaultwarden **and** print a single master sheet.
3. Store printed sheet in a safe deposit box or offline USB. Not in a desk drawer.
4. Update `ops/credentials-inventory.md` — note location generically (e.g., "safe deposit at X bank") not combinations or addresses.

### [ ] 2.3 — Master Vaultwarden password — offline

Master password is only in your head + one printed offline copy in safe deposit. Never digital.

**Tell Claude "2FA + offline backups complete."**

---

## Phase 3 — Creative inputs (your domain expertise, ~10 hrs)

Claude cannot write these. Do in parallel with Phase 1/2.

### [ ] 3.1 — Write 5 template briefs (~1 hr each, ~5 hrs)

One per SKU in `templates/_briefs/<sku>.md` using the template in `docs/runbooks/template-production-process.md` §1:

- [ ] `GST-001` Welcome Book — T1, $17 Etsy
- [ ] `OPS-001` Cleaner Turnover Checklist — T1, $12
- [ ] `TAX-001` STR Mileage Log — T1, $17
- [ ] `TAX-002` Single-Property P&L — T2, $27 Lite / $97 Full
- [ ] `TAX-003` 1099-NEC Tracker — T1, $17

For each: SKU, persona, pain, inputs, outputs, tabs, external data, success criteria, edge cases.

**Tell Claude "brief ready: <sku>"** per SKU — Claude then builds the .xlsx via openpyxl (automation queue F3).

### [ ] 3.2 — Write the 47 Airbnb Tax Deductions list (2–4 hrs)

`templates/_briefs/hero-magnet.md`. 47 entries — name, IRS code where applicable, brief description, typical $ range. Mix obvious + non-obvious (bonus depreciation under STR active-participation, cost segregation, service fees, etc.).

**Tell Claude "47 deductions ready."**

---

## Phase 4 — First-time OAuth consent (clicks that grant Claude access to your accounts)

Each takes 2–5 minutes. After this, Claude publishes/reads via API.

### [ ] 4.1 — Social accounts + OAuth to Creasquare

Only account creation + OAuth consent is manual. Posting is then automated.

- [ ] Create Pinterest Business account with `hello@thestrledger.com` — https://business.pinterest.com. 2FA on.
- [ ] Create/confirm Facebook Page for STR Ledger. 2FA on personal FB.
- [ ] Create Instagram Business account — link to FB Page.
- [ ] Create LinkedIn Company Page.
- [ ] Create YouTube channel (Google account you already control).
- [ ] Create TikTok business account.
- [ ] In Creasquare, connect each of the above via OAuth. Accept the permission dialogs.

### [ ] 4.2 — Survey Influencersoft's API

In IS → Settings → Integrations → Webhooks / API panel. Screenshot or write down:
- Native REST API: yes/no, docs URL
- Webhook events list
- Zapier/Make support

If IS has a public API: Claude configures email sequences via API (automation queue G6).
If not: Claude falls back to Playwright browser automation or, worst case, a copy-paste SOP.

**Tell Claude "IS integration path = <api | zapier | playwright | manual>."**

### [ ] 4.3 — Claim Pinterest domain

Pinterest requires a domain-verification TXT record. Claude writes it via Cloudflare API; you only need to click "Claim" once Claude confirms the record is live.

**Tell Claude "OAuth consents done."**

---

## Phase 5 — Review + approval gates (only you can say "ship it")

Claude builds all of these. Your job is QA + approve. Each has a "ship it" signal phrase.

### [ ] 5.1 — Brand asset pack review

Claude generates logo variants, Etsy banner, icon, Excel cover header programmatically (Pillow/SVG). You check voice + aesthetic.
**Signal:** "brand assets approved."

### [ ] 5.2 — Excel template build QA (per SKU × 5)

Claude generates each .xlsx via openpyxl. You open in:
- Excel 2016+ Windows ✓
- Excel 365 Mac ✓
- Google Sheets (import) ✓

Verify formulas, formatting, data validation, protection, brand colors, spell-check labels, test extreme values + blanks.
**Signal:** "QA passed: <sku>" per SKU.

### [ ] 5.3 — Etsy listing copy review (per SKU × 5)

Read the listing copy for voice, accuracy, no placeholders.
**Signal:** "copy approved: <sku>."

### [ ] 5.4 — Etsy thumbnail review (per SKU × 5)

Claude renders 5 thumbnails per product via HTML+Puppeteer. You eyeball them against brand standards.
**Signal:** "thumbnails approved: <sku>."

### [ ] 5.5 — Email sequence review (hero magnet)

Claude drafts 9 emails. You read for tone, factual accuracy, link correctness, CTA alignment.
**Signal:** "email sequence approved."

### [ ] 5.6 — Blog post review + tax-accuracy sign-off (per post × 3)

Claude drafts. You add personal anecdotes, verify IRS code citations, add disclaimer ("general info, not tax advice, consult your CPA").
**Signal:** "blog post N approved."

### [ ] 5.7 — Pinterest pin catalog review (30 pins, batched)

Claude renders 30 pin images via HTML+Puppeteer. You skim for voice/aesthetic. Approve in batches of 10.
**Signal:** "pins 1–10 approved," etc.

### [ ] 5.8 — Pre-launch go/no-go (Week 7)

Full-stack dry run:
- [ ] Test purchase on own site ($1 product) — Airtable + IS + email fires correctly
- [ ] Test purchase on Etsy (friend) — same data flow
- [ ] Backup verification — Google Drive has last Sunday's CSVs
- [ ] Vault export verification — encrypted `.json` in Google Drive from this month
- [ ] DR walkthrough — read `docs/runbooks/disaster-recovery.md`, walk through Scenario 1 mentally

**Signal:** "launch approved."

---

## Phase 6 — Ongoing human cadence (post-launch)

### [ ] 6.1 — Daily 5-min monitoring check (first 4 weeks)

Open Airtable dashboard Claude builds → review yesterday's orders, refunds, errors, conversion rate. Slack alerts cover emergencies.

### [ ] 6.2 — FB Group engagement (Mon/Tue/Wed live / Thu/Fri)

Claude drafts all posts. You hit "post" at the scheduled time OR pre-schedule via Creasquare. Live presence (comments, replies) remains human for the first 90 days.

### [ ] 6.3 — Monthly Vaultwarden re-export (15 min)

Calendar reminder. Vaultwarden → Tools → Export Vault → encrypted JSON → upload to Google Drive `backups/vaultwarden/`. Keep the export password offline.

### [ ] 6.4 — Annual DR drill (4 hrs/yr)

Per `docs/runbooks/disaster-recovery.md` — simulate each scenario end-to-end.

---

## Quick reference — who owns what

| Thing | You | Claude |
|---|---|---|
| Regulatory fields (bank, tax ID, gov ID) | ✅ | — |
| Signing up for SaaS + paying | ✅ | — |
| 2FA enrollment + recovery codes | ✅ | — |
| Offline password/code backups | ✅ | — |
| Brand/tagline/voice decisions | ✅ | drafts options |
| Template briefs + tax-deduction list | ✅ | — |
| OAuth consent clicks (first time) | ✅ | — |
| Review + approval gates | ✅ | — |
| FB Group live presence | ✅ | drafts posts |
| Daily monitoring glance | ✅ | automated alerts |
| DNS records | — | ✅ Cloudflare API |
| VPS hardening + Docker | — | ✅ Ansible |
| n8n workflow builds | — | ✅ REST import of JSON |
| Airtable schema | — | ✅ Metadata API |
| Excel .xlsx files (all 5 SKUs) | — | ✅ openpyxl |
| Etsy shop setup + listings | — | ✅ Etsy API |
| Gumroad products | — | ✅ Gumroad API |
| Ghost posts + theme | — | ✅ Admin API |
| Pinterest boards + pins | — | ✅ Pinterest API |
| Thumbnails (25) + pins (30) | — | ✅ HTML + Puppeteer |
| Companion PDF | — | ✅ WeasyPrint |
| Email sequences in IS | — | ✅ IS API or Playwright |
| Credential import to Vaultwarden | — | ✅ `bw` CLI |
| Monitoring dashboard | — | ✅ scripted |

## Signal phrases

Phase 1: "Etsy account open + API app registered" · "Stripe confirmed + CLI key added" · "Gumroad account open + API token added" · "Airtable MCP connected" · "domain + workspace live + Cloudflare API token added" · "VPS up at <IP> + SSH key ready" · "all SaaS paid + API keys added"
Phase 2: "2FA + offline backups complete"
Phase 3: "brief ready: <sku>" · "47 deductions ready"
Phase 4: "IS integration path = <path>" · "OAuth consents done"
Phase 5: "brand assets approved" · "QA passed: <sku>" · "copy approved: <sku>" · "thumbnails approved: <sku>" · "email sequence approved" · "blog post N approved" · "pins 1–10 approved" · "launch approved"

## When something breaks

Commit notes to `docs/runbooks/issues/YYYY-MM-DD-<issue>.md`. Ask Claude to fix the plan + manual + automation queue.
