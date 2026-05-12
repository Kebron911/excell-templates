# Manual Setup — Master Index

> **Purpose:** registry of **every manual task** still required for 100% project completion of The STR Ledger empire. Account openings, sign-off gates, hands-on QA, OAuth clicks, creative reviews, launch validation, and recurring post-launch cadence — all linked from here.
>
> **Last reviewed:** 2026-05-12
>
> **How to use:** §A is the complete registry — scan it to see what remains. §B is the ordered walkthrough for account setup (Waves 0–4). §C lists non-account manual work (sign-offs, QA, launch gates, post-launch cadence). Each row links to the source-of-truth doc — don't duplicate content; update statuses in the source doc.
>
> **What this is NOT:** infrastructure docs (those live in `infrastructure/<tool>/`). What Claude builds without Daniel is in [`ops/automation-queue.md`](../automation-queue.md).
>
> **Companion docs in this folder:**
> - [DANIEL-FIRST-PAYMENT-CHECKLIST.md](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Daniel's per-step first-payment sequence
> - [user-manual-todo.md](user-manual-todo.md) — full historical manual-action manual (legacy; per-tool guides supersede §1 account openings, but §2–6 remain authoritative)
> - [post-launch-tracking.md](post-launch-tracking.md) — daily/weekly Etsy listing tracking (first 30 days)
> - [pinterest-ab-test.md](pinterest-ab-test.md) — Pinterest voice A/B test tracking log

---

## §A — Complete registry of remaining manual tasks

Single source of truth for "what's left." Every row is something **only Daniel can do** — automatable items live in `ops/automation-queue.md` and are not in this index. Statuses verified 2026-05-12 against PROGRESS.md + credentials-inventory.md + setup-checklist.yaml.

### A.1 — Account openings + integrations (Wave 0–4 below has the per-tool guides)

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 1 | Hostinger Business `hello@thestrledger.com` mailbox + MX/SPF/DKIM/DMARC (replaces Google Workspace) | [hostinger-manual-setup-guide.md §Part 2](hostinger-manual-setup-guide.md) | ❌ pending |
| 2 | Hostinger `dashboard.thestrledger.com` subdomain + .htpasswd + .htaccess + `PUBLIC_N8N_WEBHOOK_BASE` GitHub secret | [hostinger-manual-setup-guide.md](hostinger-manual-setup-guide.md) | ⚠️ partial (domain ✅, dashboard subdomain ❌) |
| 3 | Telegram bot via @BotFather + 3 channels (P0/P1/P2) | [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md) | ❌ pending |
| 4 | Etsy seller account onboarding + developer API app | [etsy-manual-setup-guide.md](etsy-manual-setup-guide.md) | ⚠️ blank account created, onboarding + dev app ❌ |
| 5 | Stripe restricted keys + Stripe Tax verify + 2FA confirm | [stripe-manual-setup-guide.md](stripe-manual-setup-guide.md) | ⚠️ account + 66 products ✅, restricted keys ❌ |
| 6 | Gumroad account + API token | [gumroad-manual-setup-guide.md](gumroad-manual-setup-guide.md) | ❌ pending |
| 7 | n8n PAT + 11 env vars + 8 creds + 19 flow imports | [n8n-manual-setup-guide.md](n8n-manual-setup-guide.md) | ⚠️ instance ✅ live at n8ncde.cdeprosperity.com, flows ❌ |
| 8 | Plausible account + 4 sites + Stats API token | [plausible-manual-setup-guide.md](plausible-manual-setup-guide.md) | ❌ pending |
| 9 | Google Search Console + GA4 + OAuth client (free Google account, NOT Workspace) | [google-services-manual-setup-guide.md](google-services-manual-setup-guide.md) | ❌ pending |
| 10 | Pinterest Business + domain claim + Creasquare OAuth + 5 boards | [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) | ❌ pending |
| 11 | InfluencerSoft 2FA + 7 custom fields + 11 sequence paste | [influencersoft-manual-setup-guide.md](influencersoft-manual-setup-guide.md) | ⚠️ account ✅, sequences ❌ |
| 12 | UptimeRobot / healthchecks.io heartbeat URL | inline in [n8n-manual-setup-guide.md prereqs](n8n-manual-setup-guide.md) | ❌ pending |
| 13 | Vista Create Pro account access entry in Vaultwarden | [user-manual-todo.md §1.7](user-manual-todo.md) | ✅ in active use; just record creds in Vaultwarden |
| 14 | Creasquare LTD account access (lifetime deal already owned) | [user-manual-todo.md §1.7](user-manual-todo.md) | ⚠️ LTD ✅, OAuth + Vaultwarden entry ❌ |
| 15 | VPS (n8n host) credentials in Vaultwarden | inline in [n8n guide](n8n-manual-setup-guide.md) | ⚠️ live ✅, vault entry ❌ |

### A.2 — Security hygiene (one-time, then recurring)

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 16 | 2FA via authenticator app on EVERY account (no SMS) | [user-manual-todo.md §2.1](user-manual-todo.md) | ❌ per-account; rolled into each setup guide |
| 17 | Offline 2FA recovery-code master sheet (printed, safe deposit / offline USB) | [user-manual-todo.md §2.2](user-manual-todo.md) | ❌ pending |
| 18 | Master Vaultwarden password — head-only + ONE offline printed copy | [user-manual-todo.md §2.3](user-manual-todo.md) | ❌ pending |
| 19 | Monthly Vaultwarden re-export to Google Drive `backups/vaultwarden/` | [user-manual-todo.md §6.3](user-manual-todo.md) | 🔁 monthly, recurring |
| 20 | Annual Disaster Recovery drill (4 hrs) | [docs/runbooks/disaster-recovery.md](../../docs/runbooks/disaster-recovery.md) + [user-manual-todo.md §6.4](user-manual-todo.md) | 🔁 annual |

### A.3 — Creative input + review gates (before publish)

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 21 | Brand asset pack visual sign-off ⇒ 🚦 "brand assets approved" | [user-manual-todo.md §5.1](user-manual-todo.md) + PROGRESS §P0.0 L151 | ❌ pending |
| 22 | `_lite/` folder framing decision (ACQ-001 / MKT-001 / REV-001 / STR-001) | [DANIEL-FIRST-PAYMENT-CHECKLIST.md §2.2](DANIEL-FIRST-PAYMENT-CHECKLIST.md) + PROGRESS L567 | ❌ pending |
| 23 | TAX-004 + TAX-010 Lite-framing sign-off (refund-magnet review) | [DANIEL §2.3](DANIEL-FIRST-PAYMENT-CHECKLIST.md) + PROGRESS L472 | ❌ pending |
| 24 | 47 deductions tax-accuracy review (resolve 20 `⚠ verify` flags vs current-year IRS pubs 527/463/535/946/587) | [DANIEL §2.4](DANIEL-FIRST-PAYMENT-CHECKLIST.md) + `templates/_briefs/hero-magnet.md` | ❌ pending, ~2–4 hrs |
| 25 | Welcome Book Sheet 1 preview mockup swap (Vista Create) | PROGRESS L169 | ❌ pending |
| 26 | Cormorant Garamond font polish (optional, Vista Create re-render) | PROGRESS L152 | ⏸ optional |
| 27 | Vista Create thumbnails 2/3/4 per launch SKU × 5 (optional polish) | [DANIEL §6.1](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ⏸ optional, ~3 hrs |
| 28 | Etsy listing copy review × 5 Wave-1 SKUs | [user-manual-todo.md §5.3](user-manual-todo.md) | ❌ pending |
| 29 | Etsy thumbnail review × 5 Wave-1 SKUs | [user-manual-todo.md §5.4](user-manual-todo.md) | ❌ pending |
| 30 | Email sequence review (hero magnet) | [user-manual-todo.md §5.5](user-manual-todo.md) | ❌ pending |
| 31 | Blog post tax-accuracy sign-off × 3 first posts | [user-manual-todo.md §5.6](user-manual-todo.md) | ❌ pending |
| 32 | Pinterest pin catalog review (30 pins, batched) | [user-manual-todo.md §5.7](user-manual-todo.md) + `copy/pinterest/pin-catalog-first-30.md` | ❌ pending |
| 33 | Template briefs × 5 (~1 hr each, Daniel's domain expertise) | [user-manual-todo.md §3.1](user-manual-todo.md) | ⚠️ check status — may be done |
| 34 | 47 Airbnb Tax Deductions list authored (2–4 hrs Daniel writing) | [user-manual-todo.md §3.2](user-manual-todo.md) | ⚠️ check status — may be done |

### A.4 — Hands-on Excel QA (5 SKUs × 3 platforms = 15 checks)

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 35 | GST-001 Welcome Book — Excel 2016+ Win + Excel 365 Mac + Google Sheets import | [DANIEL §3.1](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending ⇒ 🚦 "QA passed: GST-001" |
| 36 | OPS-001 Turnover Checklist — same 3 platforms | [DANIEL §3.2](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending ⇒ 🚦 "QA passed: OPS-001" |
| 37 | TAX-001 Mileage Log — same 3 platforms | [DANIEL §3.3](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending ⇒ 🚦 "QA passed: TAX-001" |
| 38 | TAX-002 Single-Property P&L Tracker — same 3 platforms | [DANIEL §3.4](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending ⇒ 🚦 "QA passed: TAX-002" |
| 39 | TAX-003 1099-NEC Tracker — same 3 platforms | [DANIEL §3.5](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending ⇒ 🚦 "QA passed: TAX-003" |

### A.5 — Test purchase + launch validation gates

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 40 | Etsy ToS check (review-incentive policy) → write to `ops/etsy-review-tos-check.md` | PROGRESS L226 | ❌ pending, blocks founding-buyer outreach |
| 41 | Founding-buyer list assembled — 10–20 hosts from Daniel's network for honest reviews | PROGRESS L227 ⇒ 🚦 "5 founding-buyer reviews queued or live" | ❌ pending |
| 42 | Daniel's existing-audience list compiled (FB friends, LinkedIn 1st-degree, personal email, prior-business) | PROGRESS L261 | ❌ pending |
| 43 | Competitor scan (eRank or manual) → `ops/etsy-competitor-scan.md` — 5 closest per Wave-1 SKU | PROGRESS L213 | ❌ pending |
| 44 | Etsy Convo template for manual review request (until W-review ships) | PROGRESS L236 | ❌ pending |
| 45 | Test-purchase GST-001 from secondary Etsy account → verify post-purchase IS sequence Day-0 email arrives <5 min (P0.0 hard gate) | [DANIEL §4.2](DANIEL-FIRST-PAYMENT-CHECKLIST.md) + PROGRESS P0.0 | ❌ pending |
| 46 | Refund the test purchase → verify refund-recovery sequence fires | [DANIEL §4.3](DANIEL-FIRST-PAYMENT-CHECKLIST.md) | ❌ pending |
| 47 | Pre-launch go/no-go (Week 7) — full-stack dry-run, all systems green | [user-manual-todo.md §5.8](user-manual-todo.md) ⇒ 🚦 "launch approved" | ❌ pending |
| 48 | Etsy listing tax handling review — confirm marketplace-facilitator coverage by state, document gaps | PROGRESS L69 | ❌ pending |
| 49 | Manual-send fallback for post-purchase emails (Days 1–14 if IS not ready) | PROGRESS L62 ⇒ 🚦 "post-purchase funnel live OR manual fallback signed off" | ⏸ contingency only |

### A.6 — One-time setup runbooks (outside `ops/manual work/` for autoload reasons)

These are one-time setup procedures kept in `ops/runbooks/` because the n8n `runbook-staleness` flow reads that folder. Don't move them — link only.

| # | Task | Doc | Status |
|---|---|---|---|
| 50 | IndexNow setup (one-time wiring of Bing/Yandex URL submission) | [ops/runbooks/indexnow-setup.md](../runbooks/indexnow-setup.md) | ❌ pending, 15 min |
| 51 | Phase 0 Citation Sprints (weekend sprint: 12–25 dofollow citations) | [ops/runbooks/phase-0-citation-sprints.md](../runbooks/phase-0-citation-sprints.md) | ❌ pending, ~7 hrs weekend |

### A.7 — OAuth consent clicks (after social accounts exist)

| # | Task | Source-of-truth doc | Status |
|---|---|---|---|
| 52 | Facebook account + OAuth to Creasquare | [user-manual-todo.md §4.1](user-manual-todo.md) | ❌ pending |
| 53 | Instagram account + OAuth to Creasquare | [user-manual-todo.md §4.1](user-manual-todo.md) | ❌ pending |
| 54 | LinkedIn account + OAuth to Creasquare | [user-manual-todo.md §4.1](user-manual-todo.md) | ❌ pending |
| 55 | YouTube account + OAuth to Creasquare | [user-manual-todo.md §4.1](user-manual-todo.md) | ❌ pending |
| 56 | TikTok account + OAuth to Creasquare | [user-manual-todo.md §4.1](user-manual-todo.md) | ❌ pending |

### A.8 — Post-launch ongoing cadence (recurring after Wave-1 publish)

| # | Task | Source-of-truth doc | Cadence |
|---|---|---|---|
| 57 | Daily 5-min Etsy monitoring (views/favorites/sales/messages) | [post-launch-tracking.md](post-launch-tracking.md) + [user-manual-todo.md §6.1](user-manual-todo.md) | 🔁 daily, Days 1–14 |
| 58 | Weekly check (aggregate views, CTR/CVR, refund rate, reviews) | [post-launch-tracking.md](post-launch-tracking.md) | 🔁 weekly, Days 15–30 |
| 59 | FB Group engagement (Mon/Tue/Wed live; Thu/Fri scheduled) | [user-manual-todo.md §6.2](user-manual-todo.md) | 🔁 weekly |
| 60 | Pinterest A/B test weekly pull (impressions/CTR/saves) — 60-day window through 2026-06-23 | [pinterest-ab-test.md](pinterest-ab-test.md) | 🔁 weekly, ends 2026-06-23 |
| 61 | Day 7 review: pause SKUs with CVR < 1.5% or CPC > $0.50 | PROGRESS L271 | 🚦 Day 7 post-launch |
| 62 | D7 / D30 / D90 listing-performance review cadence on calendar | PROGRESS L249 | 🚦 milestone |
| 63 | Customer interview cadence — 30-min calls: 5 in M1, 10 in M3, 20 in M6 | PROGRESS L647 → `copy/research/customer-interviews/` | 🔁 monthly |
| 64 | Respond to every Etsy review (positive or negative) within 1 business day | [post-launch-tracking.md](post-launch-tracking.md) | 🔁 daily |
| 65 | Respond to Etsy Convo messages within 1 business day | [post-launch-tracking.md](post-launch-tracking.md) | 🔁 daily |
| 66 | Day 30 retrospective | PROGRESS L805 + [post-launch-tracking.md](post-launch-tracking.md) | 🚦 Day 30 |

### A.9 — Deferred / out of current scope (re-evaluate at trigger)

These appear in older docs but are NOT required for 100% Phase-1 completion. Don't do them now.

| # | Deferred task | Re-evaluate when | Doc |
|---|---|---|---|
| D1 | Airtable setup + MCP token | Only if formally adopted as SSOT (currently n8n reads `ops/*.yaml`) | [user-manual-todo.md §1.4](user-manual-todo.md) |
| D2 | Ghost blog host signup | Phase 2 (blog content schedule kickoff) | `credentials-inventory.md` |
| D3 | Instantly (cold outreach) | Phase 2+ | `credentials-inventory.md` |
| D4 | Tailwind (Pinterest scheduler) | Month 3, if Pinterest driving ≥100 clicks/mo OR ≥5 signups/mo | `credentials-inventory.md` |
| D5 | Stripe Connect (affiliate payouts) | Affiliate program launch (Month 3–6) | `infrastructure/stripe/setup.md` §Part 3 |
| D6 | Buffer (replaced by Creasquare) | Only if Creasquare drops a critical platform | `credentials-inventory.md` |

---

## §B — Account-setup walkthrough (Waves 0–4)

This is the dependency-ordered version of registry rows 1–11. Pick this up when starting account setup.

---

## State snapshot (verified 2026-05-11 from CREDENTIALS.md + credentials-inventory.md)

| Tool | Account | Manual setup status |
|---|---|---|
| InfluencerSoft | ✅ live (`kebron.influencersoft.com`, API key set 2026-05-11) | ⚠️ 2FA verify + 7 custom fields + 11 sequence paste pending — see [influencersoft-manual-setup-guide.md](influencersoft-manual-setup-guide.md) |
| n8n | ✅ running (`n8ncde.cdeprosperity.com`) | ⚠️ Telegram + env vars + flow imports + creds pending — see [n8n-manual-setup-guide.md](n8n-manual-setup-guide.md) |
| Stripe | ✅ live (66 STR Ledger products imported 2026-05-11) | ⚠️ restricted keys + Stripe Tax verify pending — see [stripe-manual-setup-guide.md](stripe-manual-setup-guide.md) |
| Hostinger | ✅ Business plan live (domain + DNS + SSH deploy + email hosting) | ⚠️ `hello@` mailbox + `dashboard.thestrledger.com` subdomain + htpasswd pending — see [hostinger-manual-setup-guide.md](hostinger-manual-setup-guide.md) |
| Etsy | ⚠️ blank seller account created, no onboarding/listings/dev app yet | finish onboarding + register dev app — see [etsy-manual-setup-guide.md](etsy-manual-setup-guide.md) |
| Telegram | ❌ no bot, no channels | full guide — see [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md) |
| Gumroad | ❌ pending | full guide — see [gumroad-manual-setup-guide.md](gumroad-manual-setup-guide.md) |
| Google Search Console + GA4 | ❌ pending (uses free Google account, no Workspace) | full guide — see [google-services-manual-setup-guide.md](google-services-manual-setup-guide.md) |
| Plausible | ❌ pending | full guide — see [plausible-manual-setup-guide.md](plausible-manual-setup-guide.md) |
| Pinterest Business | ❌ pending | full guide — see [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) |
| Vista Create | ✅ in active use | record creds in Vaultwarden (no other setup) |
| Email (Hostinger Business) | ❌ `hello@thestrledger.com` mailbox not yet created | see [hostinger-manual-setup-guide.md §Part 2](hostinger-manual-setup-guide.md) |

---

## Dependency-ordered walkthrough

Each row blocks one or more later rows. Don't skip ahead — if you do, Claude will be missing the env var / token / OAuth click downstream and the wired automations won't fire.

### Wave 0 — Foundations (Day 1, ~1 hr)

These have no upstream deps. Do them first; everything else depends on at least one of them. (Google Workspace removed — email lives on Hostinger Business; GSC + GA4 moved to Wave 3.)

| # | Tool | Why first | Guide | Est. |
|---|------|-----------|-------|------|
| 1 | **Hostinger (email + dashboard subdomain)** | Creates `hello@thestrledger.com` mailbox via Hostinger Business (login email for every other account below) + sets up `dashboard.thestrledger.com` subdomain + SSL — blocks every public surface | [hostinger-manual-setup-guide.md](hostinger-manual-setup-guide.md) | 45 min |
| 2 | **Telegram** | Bot + 3 channels — blocks every n8n flow's alert sink | [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md) | 15 min |

→ When all three signal phrases are sent, tell Claude: ***"Wave 0 done."***

### Wave 1 — Revenue surfaces (Day 1–2, ~2 hrs)

These are the payment + storefront accounts. Stripe is *mostly* set up already (live key + 66 products live), so it's the shortest. Etsy and Gumroad are full account openings.

| # | Tool | Why now | Guide | Est. |
|---|------|---------|-------|------|
| 4 | **Etsy** | Open shop + register API app — blocks Wave-1 SKU publish + post-purchase webhook | [etsy-manual-setup-guide.md](etsy-manual-setup-guide.md) | 60 min |
| 5 | **Stripe** | Verify config + scoped keys for IS / n8n — blocks post-purchase tagging + Tax exposure tracking | [stripe-manual-setup-guide.md](stripe-manual-setup-guide.md) | 25 min |
| 6 | **Gumroad** | Mirror storefront + API token — non-blocking for first revenue but ships in parallel | [gumroad-manual-setup-guide.md](gumroad-manual-setup-guide.md) | 25 min |

→ When all three signal phrases are sent, tell Claude: ***"Wave 1 done."***

### Wave 2 — Automation backbone (Day 2, ~90 min)

Now n8n has every credential it needs to ingest. This is where the empire wakes up.

| # | Tool | Why now | Guide | Est. |
|---|------|---------|-------|------|
| 7 | **n8n** | Telegram creds (Wave 0) + Stripe/Etsy/Gumroad keys (Wave 1) + Plausible/GSC (Wave 3) all feed into the flows — paste them into the n8n credentials store, then import the 19 flow JSONs | [n8n-manual-setup-guide.md](n8n-manual-setup-guide.md) | 90 min |

→ Signal phrase: ***"n8n live."*** (After this, automations run on their own.)

### Wave 3 — Traffic + analytics (Day 3, ~45 min)

These don't block the first sale, but they're needed before any marketing dollars / pin schedule starts running.

| # | Tool | Why now | Guide | Est. |
|---|------|---------|-------|------|
| 8 | **Plausible** | Stats-API token feeds nightly-refresh + funnel-dropout watcher | [plausible-manual-setup-guide.md](plausible-manual-setup-guide.md) | 15 min |
| 9 | **Google Search Console + GA4** | Free Google account (NOT Workspace) → GSC property + OAuth client for n8n nightly indexing. Optional GA4. | [google-services-manual-setup-guide.md](google-services-manual-setup-guide.md) | 20 min |
| 10 | **Pinterest Business** | Domain claim + OAuth to Creasquare — blocks pin scheduling | [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) | 15 min |

→ Signal phrase: ***"Wave 3 done — analytics + traffic surfaces live."***

### Wave 4 — InfluencerSoft sequences (~3 hrs focused work)

InfluencerSoft sequences must be hand-pasted into the IS UI (no `AddSequence` endpoint). Account + API key already live (2026-05-11) — what remains is 2FA enrollment verification, 7 custom fields, and 11 sequence pastes.

| # | Tool | Why now | Guide | Est. |
|---|------|---------|-------|------|
| 11 | **InfluencerSoft** | 11 sequences must exist in IS before n8n's `AddTagToLead` calls have anything to fire into | [influencersoft-manual-setup-guide.md](influencersoft-manual-setup-guide.md) | 3 hrs |

→ Signal phrase: ***"sequences pasted."***

---

## §C — Non-account manual work (referenced from registry §A.2–A.8)

Account setup (Waves 0–4 above) is necessary but **not sufficient** for 100% completion. The following blocks of manual work happen alongside or after account setup. Each row is a pointer — the source-of-truth doc has step-by-step detail.

### C.1 — Security hygiene (registry §A.2)

Spread across every account-setup guide (2FA enrollment is in each), then:
- **One-time master:** [user-manual-todo.md §2.2 + §2.3](user-manual-todo.md) — offline 2FA recovery + master Vaultwarden password offline
- **Recurring:** Monthly Vaultwarden re-export + Annual DR drill (see [docs/runbooks/disaster-recovery.md](../../docs/runbooks/disaster-recovery.md))

### C.2 — Creative + review gates (registry §A.3)

Must complete before Wave-1 SKU publish. Detailed step-by-step in:
- [DANIEL-FIRST-PAYMENT-CHECKLIST.md §2](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Brand + creative sign-off (Day 4, ~2 hrs)
- [user-manual-todo.md §5](user-manual-todo.md) — Review + approval gates (Phase 5)

### C.3 — Hands-on Excel QA (registry §A.4)

5 SKUs × 3 platforms = 15 verifications. Detailed in:
- [DANIEL-FIRST-PAYMENT-CHECKLIST.md §3](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Phase 3 hands-on QA (Day 5–7, ~3 hrs)

### C.4 — Test purchase + launch validation (registry §A.5)

The P0.0 hard gate — without these, you don't know if the empire actually works end-to-end.
- [DANIEL-FIRST-PAYMENT-CHECKLIST.md §4](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Phase 4 test purchase (Day 8, 30 min)
- [DANIEL-FIRST-PAYMENT-CHECKLIST.md §5](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Phase 5 Wave-1 publish
- [user-manual-todo.md §5.8](user-manual-todo.md) — Week 7 pre-launch go/no-go

### C.5 — One-time setup runbooks (registry §A.6)

Live outside `ops/manual work/` because the n8n `runbook-staleness` flow reads `ops/runbooks/`:
- [ops/runbooks/indexnow-setup.md](../runbooks/indexnow-setup.md) — IndexNow protocol (15 min)
- [ops/runbooks/phase-0-citation-sprints.md](../runbooks/phase-0-citation-sprints.md) — 24-citation weekend sprint (7 hrs)

### C.6 — OAuth consent clicks for socials (registry §A.7)

Each social account opens, then connect to Creasquare via the same OAuth pattern:
- [user-manual-todo.md §4.1](user-manual-todo.md) — Facebook, Instagram, LinkedIn, YouTube, TikTok
- Pinterest already covered in [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) Part 3

### C.7 — Post-launch ongoing cadence (registry §A.8)

After Wave-1 publish, recurring manual work:
- [post-launch-tracking.md](post-launch-tracking.md) — daily/weekly Etsy listing tracking (first 30 days)
- [pinterest-ab-test.md](pinterest-ab-test.md) — Pinterest voice A/B test (60-day window through 2026-06-23)
- [user-manual-todo.md §6](user-manual-todo.md) — Phase 6 ongoing human cadence (daily monitoring, FB Group, monthly/annual hygiene)

---

## Total wall-clock estimate

**Account setup only (Waves 0–4):**
- Wave 0: 1 hr (Hostinger email + dashboard subdomain + Telegram)
- Wave 1: 2 hrs (Etsy onboarding-finish + Stripe restricted keys + Gumroad)
- Wave 2: 90 min
- Wave 3: 45 min
- Wave 4: 3 hrs
- **Account-setup subtotal: ~9 hrs spread across 3–4 days** (most async — Stripe verification, DNS propagation + Hostinger SSL provisioning).

**Non-account manual work (registry §A.2–A.8):**
- Security hygiene (one-time): ~1 hr
- Creative + review gates: ~5 hrs (47-deductions review is the big one)
- Hands-on Excel QA (5 SKUs × 3 platforms): ~3 hrs
- Test purchase + launch validation: ~1 hr (+ async waits for emails to arrive)
- Pre-launch go/no-go: ~1 hr
- IndexNow setup: 15 min
- Phase 0 Citation Sprints (weekend): ~7 hrs (defer if traffic-rank not a Wave-1 priority)
- OAuth consent for 5 socials: ~1 hr (each is 5–10 min)
- **Non-account subtotal: ~12–19 hrs** (Citation Sprints accounts for the spread; without it, ~12 hrs)

**Recurring (post-launch, ongoing):**
- Daily 5-min Etsy + Convo + review monitoring (first 30 days)
- Weekly Pinterest A/B pull through 2026-06-23
- Weekly FB Group engagement
- Monthly Vaultwarden re-export
- Quarterly customer-interview cadence
- Annual DR drill

**Grand total to reach 100% Phase-1 launch: ~21–28 hrs Daniel time across ~2 weeks (most async wait, not active work).**

---

## After everything is green

1. Open `ops/setup-checklist.yaml` and confirm every `status: pending` row has been flipped to `done` or `skipped`. (This file stays in `ops/` — read by the empire console `/maintain/setup` route + n8n.)
2. Walk every row in §A above and confirm status is `✅` or `⏸ optional` or `🔁 recurring` (no remaining `❌ pending`).
3. Run `pnpm validate` from the repo root — the validator now expects every credential row in `credentials-inventory.md` marked `pending` to be either `✅` or explicitly `skipped`.
4. Tell Claude: ***"empire manual setup complete — proceed to first-payment checklist."*** Claude then resumes [DANIEL-FIRST-PAYMENT-CHECKLIST.md](DANIEL-FIRST-PAYMENT-CHECKLIST.md) from the SKU-publish phase.
5. After first payment lands: Day 7 / Day 30 / Day 90 review cadence kicks in from §A.8.

---

## Notes on what's NOT in this index (deferred / replaced) — see §A.9 for the registry version

- **Stripe Connect** — deferred to Phase 2 (affiliate program). See `infrastructure/stripe/setup.md` §Part 3 when ready.
- **Tailwind (Pinterest scheduler)** — deferred. Creasquare covers Pinterest for Months 1–3. Re-evaluate Month 3.
- **Buffer** — replaced by Creasquare (lifetime deal).
- **Instantly (cold outreach)** — Phase 2+, not part of Wave 0–4.
- **Airtable** — only needed if/when you formally adopt it as SSOT. n8n flows currently read from `ops/*.yaml` and `ops/cache/*.json`, not Airtable.
- **Vista Create** — already in active use; just record Vaultwarden entry. No further setup needed unless re-rendering an asset.
- **Google Workspace** — replaced by Hostinger Business email (the `hello@thestrledger.com` mailbox lives at Hostinger; GSC/GA4 use a free Google account, no Workspace subscription).
- **Ghost blog** — host TBD; defer until blog content schedule starts.
- **Creasquare** — OAuth-connect step is covered under each social account's flow (see Pinterest guide §3 for the Pinterest connect; FB/IG/LinkedIn/YouTube/TikTok connects are noted in `ops/user-manual-todo.md` §4.1).
