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
| G1 — Brand assets approved | 🔴 blocked | Phase 2.1 (Daniel sign-off) | Lite folder + thumbnail batches |
| G2 — Wave 1 SKU QA | 🔴 blocked | Phase 3 (Daniel hands-on) | Per-SKU listing publish |
| G3 — Marketing readiness | 🟡 soft | Phase 0.5 (PROGRESS.md) | Best-effort; non-blocking for G4 |
| G4 — Wave 1 LIVE on Etsy | 🔴 blocked | G0 + G2 + Phase 4.3 test purchase | First paid order |
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
