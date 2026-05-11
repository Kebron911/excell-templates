# Launch Path

> **The only doc you need to read to make progress.** One ordered sequence. Each Daniel action has a signal phrase that triggers Claude to run a specific, pre-built implementation. No code is missing — the blocked work is blocked on credentials and sign-off, not on engineering.

**Last reviewed:** 2026-05-09 · **Maintainer:** This file replaces ad-hoc next-step messages.

---

## Where we are today

| Surface | Status | Notes |
|---|---|---|
| **strhost.tools** | ✅ LIVE — `v0.1.0-strhost` (effective; no tag yet) | CI gates aligned with cluster, deploy via SSH+rsync |
| **strguests.tools** | ✅ LIVE — `strguests-tools-v0.1.0` | Phase 3 (AI generators) deferred on `OPENAI_API_KEY` |
| **strops.tools** | ✅ LIVE — `v0.1.0-strops` | Awaiting blog content |
| **strbuyers.tools** | ✅ LIVE — `strbuyers-tools-v0.1.0` | Server (`/api/click`) gated on Hostinger MySQL |
| **thestrledger.com** | ⚠️ Storefront not yet open | Blocked on Daniel — see Sequence below |
| **Catalog (65 SKUs)** | ✅ Production-ready | 6/6 spot-checked SKUs regen byte-clean from `_build/` |

**Shipped today (2026-05-09):** Cluster CI alignment (3 PRs merged: [#24](https://github.com/Kebron911/excell-templates/pull/24) strguests, [#25](https://github.com/Kebron911/excell-templates/pull/25) strbuyers, [#26](https://github.com/Kebron911/excell-templates/pull/26) strhost). All four cluster sites now share one CI pattern: PR-gate + push-to-main deploy + post-deploy smoke. `strbuyers-tools-v0.1.0` tag pushed (was local-only). Abandoned source branch + stale worktree pruned.

**The literal next thing to do:** Daniel completes [§1.1 Etsy seller account](ops/DANIEL-FIRST-PAYMENT-CHECKLIST.md#-11--etsy-seller-account-45-min). Everything else is downstream of account openings.

**Two parallel tracks once accounts open:**
- **Track A — First-payment critical path** (Phases 1–5 below). Etsy alone gets you to first paid order.
- **Track B — Full-stack enablement** (Phases 6–10 below). Influencersoft email funnel, Pinterest, Airtable, VPS+n8n, social channels, Ghost blog, analytics. Runs in parallel; **G5 (IS) is the only Track-B item that can soft-block G4** if you don't accept the documented manual-send fallback.

---

## Launch sequence — Daniel actions × Claude follow-ups

Each row: Daniel does the action, says the **signal phrase** in the next session, Claude runs the linked **implementation**. Phases are dependency-ordered. Don't skip.

### Phase 1 — Account openings (Day 1–3, ~3 hours total)

| # | Daniel action | Time | Signal phrase | Claude runs | Implementation file |
|---|---|---|---|---|---|
| 1.1 | Etsy seller account + API app | 45 min | `Etsy account open + API app registered` | OAuth handshake, store refresh token | [`ops/automation-queue.md` Phase A.4](ops/automation-queue.md) |
| 1.2 | Stripe confirm + CLI key | 10 min | `Stripe confirmed + CLI key added` | Tax-code config, restricted-key minting, statement descriptor set | [`infrastructure/stripe/setup.md`](infrastructure/stripe/setup.md) |
| 1.3 | Cloudflare API token | 15 min | `domain + Cloudflare API token added` | Write all DNS records (MX, SPF, DKIM, DMARC, blog/app/n8n CNAMEs) | [`ops/automation-queue.md` Phase B](ops/automation-queue.md) |
| 1.4 | Google Workspace live | 15 min | `workspace live` | Email plumbing setup, mail-tester score check | [`ops/automation-queue.md` Phase B](ops/automation-queue.md) |
| 1.5 | Gumroad account + API token | 20 min | `Gumroad account open + API token added` | Gumroad API handshake | [`infrastructure/n8n/workflows/W02-order-ingestion-gumroad.md`](infrastructure/n8n/workflows/W02-order-ingestion-gumroad.md) |
| 1.6 | Master 2FA + offline backup | 1 hr | `2FA + offline backups complete` | Bulk credential import to Vaultwarden | [`ops/credentials-inventory.md`](ops/credentials-inventory.md) |

🚦 **Gate G0 — Deployment foundation green** when 1.1–1.6 done.

### Phase 2 — Brand sign-off (Day 4, ~2 hours)

| # | Daniel action | Signal phrase | Claude runs |
|---|---|---|---|
| 2.1 | Visual sign-off on `brand/assets/` | `brand assets approved` | Lock brand pack, freeze tokens |
| 2.4 | 47-deductions tax-accuracy review (20 ⚠ flags) | `47 deductions ready` | Deploy lead-magnet PDF + Excel + email-capture form ([W08](infrastructure/n8n/workflows/W08-lead-magnet-delivery.md)) |

### Phase 3 — Hands-on SKU QA (Day 5–7, ~3 hours)

5 Wave-1 SKUs need a Daniel pass with the literal xlsx open in Excel. Per-SKU signal: `QA passed: <SKU>` ⇒ Claude unblocks publish for that SKU.

| SKU | Master file | Build script |
|---|---|---|
| GST-001 (Welcome Book) | [`templates/_masters/GST-001-welcome-book-{BLANK,DEMO}.xlsx`](templates/_masters/) | [`templates/_build/build_welcome_book.py`](templates/_build/build_welcome_book.py) |
| OPS-001 (Turnover Checklist) | [`templates/_masters/OPS-001-turnover-checklist-{BLANK,DEMO}.xlsx`](templates/_masters/) | [`templates/_build/build_turnover_checklist.py`](templates/_build/build_turnover_checklist.py) |
| TAX-001 (Mileage Log) | [`templates/_masters/TAX-001-mileage-log-{BLANK,DEMO}.xlsx`](templates/_masters/) | [`templates/_build/build_mileage_log.py`](templates/_build/build_mileage_log.py) |
| TAX-002 (P&L Tracker) | [`templates/_masters/TAX-002-pl-single-property-{BLANK,DEMO}.xlsx`](templates/_masters/) | [`templates/_build/build_1099_nec_tracker.py`](templates/_build/build_1099_nec_tracker.py) |
| TAX-003 (1099-NEC Tracker) | [`templates/_masters/TAX-003-*-{BLANK,DEMO}.xlsx`](templates/_masters/) | [`templates/_build/build_1099_nec_tracker.py`](templates/_build/build_1099_nec_tracker.py) |

### Phase 4 — Test purchase (Day 8, 30 min)

| # | Daniel action | Signal phrase | Claude runs |
|---|---|---|---|
| 4.1 | Wait for Claude to publish GST-001 first | — | Etsy listing publish ([W05](infrastructure/n8n/workflows/W05-product-publisher.md)) |
| 4.2 | Buy GST-001 from a secondary Etsy account | — | Watch order ingestion ([W03](infrastructure/n8n/workflows/W03-order-ingestion-etsy.md)) + post-purchase email ([W23](infrastructure/n8n/workflows/W23-course-purchase-onboarding.md)) |
| 4.3 | Refund the test purchase | `test purchase pass` | Confirm refund flow ([W07](infrastructure/n8n/workflows/W07-refund-handler.md)) |

🚦 **Gate G4 — Wave 1 LIVE** unlocks first paid order.

### Phase 5 — Wave 1 publish (Day 9, ~30 min Claude work)

After `test purchase pass`, signal: **`publish Wave 1`**. Claude pushes OPS-001 + TAX-001 to Etsy, bundles A13 PDF on all 3 listings, kicks off Pinterest pin distribution.

---

## Full-stack enablement — runs in parallel with Phases 1–5

Phases 1–5 above are the **minimum path to first paid Etsy order**. These items are needed for the full multi-storefront stack (own site + email lifecycle + Pinterest funnel + analytics + community). They do **not** block G4 first payment except where flagged 🚦, but every day they slip is a day of post-launch attribution loss.

Source-of-truth (more detail per item): [`ops/user-manual-todo.md`](ops/user-manual-todo.md).

### Phase 6 — Additional account openings (parallel with Phase 1, ~2 hrs)

| # | Daniel action | Time | Signal phrase | Claude runs | Implementation file |
|---|---|---|---|---|---|
| 6.1 | Airtable account + MCP token | 15 min | `Airtable MCP connected` | Schema migration via Metadata API | [`infrastructure/airtable/schema.md`](infrastructure/airtable/schema.md) |
| 6.2 | VPS provision (Hetzner CX22 / DO Basic, Ubuntu 24.04) | 20 min | `VPS up at <IP> + SSH key ready` | Ansible hardening + Docker + n8n + Cloudflare Tunnel | [`ops/automation-queue.md`](ops/automation-queue.md) Phase C |
| 6.3 | **🚦 Influencersoft** — redeem LTD + 2FA + API key | 20 min | (paired with 6.4) | (waits for survey) | — |
| 6.4 | **🚦 IS API survey** — REST docs / webhooks / Zapier support | 5 min | `IS integration path = <api \| zapier \| playwright \| manual>` | Choose integration adapter accordingly | [`ops/automation-queue.md`](ops/automation-queue.md) Phase G6 |
| 6.5 | Ghost(Pro) Starter ($9/mo) + 2FA + Admin API key | 15 min | (rolled into 6.7) | Ghost theme deploy + first 3 blog posts | [`ops/automation-queue.md`](ops/automation-queue.md) Phase G |
| 6.6 | Plausible **or** GA4 (pick one) + analytics property | 15 min | (rolled into 6.7) | Snippet injection on storefront + cluster sites | [`ops/automation-queue.md`](ops/automation-queue.md) Phase D |
| 6.7 | Vista Create + Creasquare LTD redemption + 2FA | 30 min | `all SaaS paid + API keys added` | OAuth-handshake testing | [`ops/automation-queue.md`](ops/automation-queue.md) Phase A |

**🚦 IS fallback if 6.3 + 6.4 slip:** documented manual-send checklist for first 14 days post-launch — `ops/manual-post-purchase-fallback.md` (to be created when 6.4 returns `manual`).

### Phase 7 — Social accounts + OAuth consents (parallel with Phase 2, ~1 hr)

Each item is "create the account, grant Creasquare OAuth, done". Posting is then API-driven by Claude.

| # | Daniel action | Time | Signal phrase | Claude runs |
|---|---|---|---|---|
| 7.1 | **Pinterest Business account** + 2FA | 10 min | (rolled into 7.7) | Board structure + first 30 pins via Pinterest API |
| 7.2 | Facebook Page + 2FA on personal FB | 10 min | (rolled into 7.7) | Page setup + group cross-post automation |
| 7.3 | Instagram Business (linked to FB Page) | 5 min | (rolled into 7.7) | Cross-post via Creasquare |
| 7.4 | LinkedIn Company Page | 10 min | (rolled into 7.7) | Company-page automation |
| 7.5 | YouTube channel (existing Google account) | 5 min | (rolled into 7.7) | (manual posting first 90 days) |
| 7.6 | TikTok business account | 5 min | (rolled into 7.7) | (manual posting first 90 days) |
| 7.7 | OAuth all 6 above to Creasquare | 15 min | `OAuth consents done` | Cross-poster activates; pin distribution can fire | [`infrastructure/n8n/workflows/W15-pinterest-pin-performance-poll.md`](infrastructure/n8n/workflows/W15-pinterest-pin-performance-poll.md) |
| 7.8 | **Pinterest domain claim** — click "Claim" once Claude confirms TXT live | 2 min | `Pinterest domain claimed` | Resume scheduled pinning (rich pins enable) |

### Phase 8 — Creative inputs (parallel with Phase 3, ~10 hrs)

Daniel-only because no model can substitute for tax/IRS-code accuracy + voice.

| # | Daniel action | Time | Signal phrase | Claude runs |
|---|---|---|---|---|
| 8.1 | Write 5 SKU briefs (one per Wave 1 SKU) | 5 hrs | `brief ready: <sku>` (per SKU) | xlsx build via openpyxl + thumbnail render | (already done — Wave 1 briefs locked) |
| 8.2 | Write the 47 Airbnb tax-deductions list | 2–4 hrs | `47 deductions ready` | Lead-magnet PDF + Excel checklist + email-capture form | [`infrastructure/n8n/workflows/W08-lead-magnet-delivery.md`](infrastructure/n8n/workflows/W08-lead-magnet-delivery.md) |

### Phase 9 — Approval gates beyond SKU QA (parallel with Phase 3, ~3 hrs)

Each `approved` signal unblocks the next surface. Claude builds the artifact; Daniel signs off.

| Surface | Signal phrase | Unblocks | Implementation |
|---|---|---|---|
| Brand asset pack visual sign-off | `brand assets approved` | Logo/banner deploys to Etsy + cluster sites | `brand/assets/` |
| Etsy listing copy (per SKU × 5) | `copy approved: <sku>` | Per-SKU listing publish | `copy/etsy/<sku>.md` |
| Etsy thumbnails (per SKU × 5) | `thumbnails approved: <sku>` | Per-SKU thumbnail upload | `templates/_delivery/<sku>/thumb-*.png` |
| **Email sequence (hero magnet, 9 emails)** | `email sequence approved` | IS sequence load OR manual-send fallback | `copy/_atomization/email-sequences/` |
| **Blog post drafts (×3)** | `blog post N approved` (per post) | Ghost publish | (drafts produced when 8.1 SKUs approved) |
| **Pinterest pin batches (30 pins, ×3 batches of 10)** | `pins 1–10 approved`, `pins 11–20 approved`, `pins 21–30 approved` | Per-batch Pinterest scheduling | (rendered after 8.1 + 7.8) |
| **Pre-launch go/no-go (Week 7)** | `launch approved` | All systems green; G4 publish gates open | full-stack dry-run checklist in [`ops/user-manual-todo.md`](ops/user-manual-todo.md) §5.8 |

### Phase 10 — Ongoing human cadence (post-launch)

Not gated; runs forever post-G4.

- **Daily 5-min monitoring glance** (Airtable dashboard, first 4 weeks)
- **FB Group live presence** (Mon/Tue/Wed live, Thu/Fri pre-scheduled — first 90 days)
- **Monthly Vaultwarden re-export** (15 min, calendar reminder)
- **Annual DR drill** (4 hrs, per `docs/runbooks/disaster-recovery.md`)

---

## What's already built and waiting

The implementations Daniel's sequence triggers are **already in this repo**. Nothing engineering-blocked.

### n8n workflows (30 of them, ready to import)

[`infrastructure/n8n/workflows/`](infrastructure/n8n/workflows/) contains 30 fully-built `.json` files paired with `.md` design docs. Map: [`infrastructure/n8n/workflows-map.md`](infrastructure/n8n/workflows-map.md).

| Workflow | Purpose | Triggered by |
|---|---|---|
| W01 | Stripe order → Airtable | Stripe webhook (after 1.2 Stripe ready) |
| W02 | Gumroad order → Airtable | Gumroad webhook (after 1.5) |
| W03 | Etsy order → Airtable | Etsy poll (after 1.1) |
| W04–W08 | Subscriber sync, product publish/update, refund, lead-magnet | Once corresponding storefront APIs are live |
| W09–W12 | Daily/weekly rollups, alerts, support triage | Always-on once W01–W08 fire |
| W13–W18 | Review request, tax-season escalation, Pinterest poll, weekly backup, integrity check | Background |
| W19–W22 | FB group, affiliate cycle, research outreach, template-update notification | Phase 2+ |
| W23–W30 | Course purchase, drip, cohort, NPS, annual update | Long-haul (Phase 7) |

### Storefront infrastructure

| Component | Status | Location |
|---|---|---|
| Stripe setup runbook | Ready (305 lines) | [`infrastructure/stripe/setup.md`](infrastructure/stripe/setup.md) |
| Airtable schema | Ready (279 lines) | [`infrastructure/airtable/schema.md`](infrastructure/airtable/schema.md) |
| Disaster recovery runbook | Ready | [`docs/runbooks/disaster-recovery.md`](docs/runbooks/disaster-recovery.md) |
| Template production process | Ready | [`docs/runbooks/template-production-process.md`](docs/runbooks/template-production-process.md) |
| Weekly content engine | Ready | [`docs/runbooks/weekly-content-atomization.md`](docs/runbooks/weekly-content-atomization.md) |

### Catalog (65 SKUs)

| Item | Count | Location |
|---|---|---|
| Master xlsx files (BLANK + DEMO) | 130 | [`templates/_masters/`](templates/_masters/) |
| Build scripts (1:1 with SKUs) | 65 | [`templates/_build/`](templates/_build/) |
| Delivery packages (how-to, license, thumbnails) | 67 dirs | [`templates/_delivery/`](templates/_delivery/) |
| Bundles | 12 price points | [`templates/_delivery/_bundles/`](templates/_delivery/_bundles/) |
| Lead magnets | 47-deductions + A13 + welcome-book template | [`templates/_delivery/_shared/`](templates/_delivery/_shared/) |

**Verified clean:** 6/6 SKUs randomly spot-checked on 2026-05-09 regenerate byte-identical from build scripts. No drift between source and committed output.

---

## Open gates (in order)

| Gate | Status | Blocker | Unblocks |
|---|---|---|---|
| G0 — Deployment foundation green | 🟡 partial | Phase 1 (Daniel: account openings) | Phase 3 (SKU QA) — already unblockable in parallel |
| G1 — Brand assets approved | 🔴 blocked | Phase 2.1 (Daniel sign-off) | Lite folder + thumbnail batches + cluster brand sync |
| G2 — Wave 1 SKU QA | 🔴 blocked | Phase 3 (Daniel hands-on) | Per-SKU listing publish |
| G3 — Marketing readiness | 🟡 soft | Phase 0.5 (PROGRESS.md) | Best-effort; non-blocking for G4 |
| G4 — Wave 1 LIVE on Etsy | 🔴 blocked | G0 + G2 + Phase 4.3 test purchase | First paid order |
| **G5 — IS post-purchase funnel live** | 🔴 blocked | Phase 6.3 + 6.4 (IS LTD + API survey) | Automated post-purchase email; if not green by G4, manual-send fallback for 14 days |
| **G6 — Pinterest funnel live** | 🔴 blocked | Phase 7.1 + 7.7 + 7.8 + Phase 9 pin batches | Pinterest scheduled pinning; rich pins; outbound CTR data feed |
| **G3.5 — Email sequence approved** | 🔴 blocked | Phase 9 `email sequence approved` | IS sequence load OR manual-send fallback artifact |
| G7 — Wave 2 LIVE | 🔴 blocked | G4 + ~14 days revenue stability | Phase 1 wave growth |

---

## When the path branches — decision log

- **Stripe Tax vs Etsy marketplace-facilitator overlap**: documented in [`ops/sales-tax-posture.md`](ops/sales-tax-posture.md) (to be created during 1.2 follow-up).
- **Sole prop vs LLC for Stripe**: Daniel decision; either is fine for MVP per `infrastructure/stripe/setup.md` §1.1.
- **Influencersoft cutover deadline**: hard or soft? See [`ops/automation-queue.md`](ops/automation-queue.md) Phase I (cutovers).

---

## Reference

- **Detailed Daniel sequence:** [`ops/DANIEL-FIRST-PAYMENT-CHECKLIST.md`](ops/DANIEL-FIRST-PAYMENT-CHECKLIST.md) (287 lines, per-step instructions)
- **Detailed Claude queue:** [`ops/automation-queue.md`](ops/automation-queue.md) (163 lines, Phases A–I)
- **Master tracker:** [`PROGRESS.md`](PROGRESS.md) (886 lines, P0–P9 with gates)
- **Domain credentials inventory:** [`ops/credentials-inventory.md`](ops/credentials-inventory.md)
- **Strategy spec:** [`docs/superpowers/specs/2026-04-22-str-tax-platform-design.md`](docs/superpowers/specs/2026-04-22-str-tax-platform-design.md)
- **Cluster site planning:** `STR{Buyers,Guests,Host,Ops}-Tools/.planning/STATE.md`
