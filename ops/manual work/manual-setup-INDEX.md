# Manual Setup — Master Index

> **Purpose:** the single ordered walkthrough of every external account / dashboard click Daniel must do by hand to bring the STR Ledger empire fully live. All per-tool guides live next to this file in `ops/manual work/`.
>
> **Last reviewed:** 2026-05-12
>
> **How to use:** work top-to-bottom. Each row links to the per-tool guide. When a guide is finished, mark its checkbox and tell Claude the signal phrase shown at the bottom of that guide — Claude resumes the matching automation in the next session.
>
> **What this is NOT:** infrastructure docs (those live in `infrastructure/<tool>/`). For the granular per-SKU launch checklist see [DANIEL-FIRST-PAYMENT-CHECKLIST.md](DANIEL-FIRST-PAYMENT-CHECKLIST.md). For the complete legacy manual-task list see [user-manual-todo.md](user-manual-todo.md). This index is the *account-level setup* layer only.
>
> **Also in this folder (not setup guides — operational checklists & trackers):**
> - [DANIEL-FIRST-PAYMENT-CHECKLIST.md](DANIEL-FIRST-PAYMENT-CHECKLIST.md) — Daniel's per-step first-payment sequence
> - [user-manual-todo.md](user-manual-todo.md) — full historical manual-action manual (some items superseded by the per-tool guides below; treat this index + per-tool guides as source of truth)
> - [post-launch-tracking.md](post-launch-tracking.md) — daily/weekly Etsy listing tracking (first 30 days)
> - [pinterest-ab-test.md](pinterest-ab-test.md) — Pinterest voice A/B test tracking log (manual weekly pulls)

---

## State snapshot (verified 2026-05-11 from CREDENTIALS.md + credentials-inventory.md)

| Tool | Account | Manual setup status |
|---|---|---|
| InfluencerSoft | ✅ live (`kebron.influencersoft.com`, API key set 2026-05-11) | ⚠️ 2FA verify + 7 custom fields + 11 sequence paste pending — see [influencersoft-manual-setup-guide.md](influencersoft-manual-setup-guide.md) |
| n8n | ✅ running (`n8ncde.cdeprosperity.com`) | ⚠️ Telegram + env vars + flow imports + creds pending — see [n8n-manual-setup-guide.md](n8n-manual-setup-guide.md) |
| Stripe | ✅ live (66 STR Ledger products imported 2026-05-11) | ⚠️ restricted keys + Stripe Tax verify pending — see [stripe-manual-setup-guide.md](stripe-manual-setup-guide.md) |
| Hostinger | ✅ domain + SSH deploy live | ⚠️ `dashboard.thestrledger.com` subdomain + htpasswd pending — see [hostinger-manual-setup-guide.md](hostinger-manual-setup-guide.md) |
| Etsy | ❌ shop not opened | full guide — see [etsy-manual-setup-guide.md](etsy-manual-setup-guide.md) |
| Telegram | ❌ no bot, no channels | full guide — see [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md) |
| Gumroad | ❌ pending | full guide — see [gumroad-manual-setup-guide.md](gumroad-manual-setup-guide.md) |
| Google Workspace + Search Console | ❌ pending | full guide — see [google-workspace-manual-setup-guide.md](google-workspace-manual-setup-guide.md) |
| Plausible | ❌ pending | full guide — see [plausible-manual-setup-guide.md](plausible-manual-setup-guide.md) |
| Pinterest Business | ❌ pending | full guide — see [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) |

---

## Dependency-ordered walkthrough

Each row blocks one or more later rows. Don't skip ahead — if you do, Claude will be missing the env var / token / OAuth click downstream and the wired automations won't fire.

### Wave 0 — Foundations (Day 1, ~2 hrs)

These have no upstream deps. Do them first; everything else depends on at least one of them.

| # | Tool | Why first | Guide | Est. |
|---|------|-----------|-------|------|
| 1 | **Google Workspace** | `hello@thestrledger.com` is the login email for every other account below — block first | [google-workspace-manual-setup-guide.md](google-workspace-manual-setup-guide.md) | 15 min |
| 2 | **Hostinger** | DNS for `thestrledger.com` + subdomain for the dashboard + SSL — blocks every public surface | [hostinger-manual-setup-guide.md](hostinger-manual-setup-guide.md) | 30 min |
| 3 | **Telegram** | Bot + 3 channels — blocks every n8n flow's alert sink | [telegram-manual-setup-guide.md](telegram-manual-setup-guide.md) | 15 min |

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
| 9 | **Google Search Console** | OAuth client for nightly indexing + GSC digest (covered in Workspace guide §3) | [google-workspace-manual-setup-guide.md](google-workspace-manual-setup-guide.md) §3 | 15 min |
| 10 | **Pinterest Business** | Domain claim + OAuth to Creasquare — blocks pin scheduling | [pinterest-manual-setup-guide.md](pinterest-manual-setup-guide.md) | 15 min |

→ Signal phrase: ***"Wave 3 done — analytics + traffic surfaces live."***

### Wave 4 — InfluencerSoft sequences (~3 hrs focused work)

InfluencerSoft sequences must be hand-pasted into the IS UI (no `AddSequence` endpoint). Account + API key already live (2026-05-11) — what remains is 2FA enrollment verification, 7 custom fields, and 11 sequence pastes.

| # | Tool | Why now | Guide | Est. |
|---|------|---------|-------|------|
| 11 | **InfluencerSoft** | 11 sequences must exist in IS before n8n's `AddTagToLead` calls have anything to fire into | [influencersoft-manual-setup-guide.md](influencersoft-manual-setup-guide.md) | 3 hrs |

→ Signal phrase: ***"sequences pasted."***

---

## Total wall-clock estimate

- Wave 0: 2 hrs
- Wave 1: 2 hrs
- Wave 2: 90 min
- Wave 3: 45 min
- Wave 4: 3 hrs
- **Total: ~9 hrs spread across 3–4 days** (most of which is async — Stripe verification, Google Workspace propagation, DNS provisioning are wait-loops, not active work).

---

## After everything is green

1. Open `ops/setup-checklist.yaml` and confirm every `status: pending` row has been flipped to `done` or `skipped`. (This file stays in `ops/` — read by the empire console `/maintain/setup` route + n8n.)
2. Run `pnpm validate` from the repo root — the validator now expects every credential row in `credentials-inventory.md` marked `pending` to be either `✅` or explicitly `skipped`.
3. Tell Claude: ***"empire manual setup complete — proceed to first-payment checklist."*** Claude then resumes [DANIEL-FIRST-PAYMENT-CHECKLIST.md](DANIEL-FIRST-PAYMENT-CHECKLIST.md) from the SKU-publish phase.

---

## Notes on what's NOT in this index (deferred / replaced)

These appeared in older planning docs but are out of scope for current setup:

- **Stripe Connect** — deferred to Phase 2 (affiliate program). See `infrastructure/stripe/setup.md` §Part 3 when ready.
- **Tailwind (Pinterest scheduler)** — deferred. Creasquare covers Pinterest for Months 1–3. Re-evaluate Month 3.
- **Buffer** — replaced by Creasquare (lifetime deal).
- **Instantly (cold outreach)** — Phase 2+, not part of Wave 0–4.
- **Airtable** — only needed if/when you formally adopt it as SSOT. n8n flows currently read from `ops/*.yaml` and `ops/cache/*.json`, not Airtable.
- **Vista Create** — brand pack already produced. No further setup needed unless re-rendering an asset.
- **Ghost blog** — host TBD; defer until blog content schedule starts.
- **Creasquare** — OAuth-connect step is covered under each social account's flow (see Pinterest guide §3 for the Pinterest connect; FB/IG/LinkedIn/YouTube/TikTok connects are noted in `ops/user-manual-todo.md` §4.1).
