# InfluencerSoft Setup — WIP State

**Last updated:** 2026-05-15
**Owner:** Daniel
**Where things stand:** Mid-build. Foundation in place; sequence content paste blocked on deliverability + module verification.

---

## ✅ Completed

- LTD account live (`kebron.influencersoft.com`), API key in `./.env`
- 7 custom fields created in IS UI (sku_code, sku_label, bought_on, order_ref, xsell_name, xsell_url, pack_name)
- Field index map captured in [`infrastructure/influencersoft/custom-fields.yaml`](../../infrastructure/influencersoft/custom-fields.yaml)
- Master list created: `STR Ledger — Contacts`
- Tag namespace seeded (one tag-seed contact in IS UI created with 17 tag strings — see tag-dictionary.md)
- 6 IS scripts shipped under `scripts/`:
  - `lib/influencersoft.mjs` — API 2.0 client (rate-limited, never-logs-body)
  - `is-paste-helper.mjs` — generates IS-token-formatted paste sheets
  - `is-probe.mjs` — `GetAllGroups` + `GetGoods` → yaml caches
  - `is-add-contact.mjs` — `AddUpdateLead` wrapper
  - `is-tag-events.mjs` — Stripe webhook → IS tag
  - `is-end-to-end-test.mjs` — P0.0 canary (caveat: needs emailable canary, see §Blockers)
- 11 paste sheets generated in [`ops/manual work/influencersoft-paste-sheets/`](influencersoft-paste-sheets/) with IS-correct `{$leadExfield[N]}` token format + per-email IS delay setting
- Trigger node config understood: entry filter for `do-not-email`/`refund-filed`/`unsubscribed` + "Perform only once for an object" ON

## ⏳ In Progress

- Building post-purchase-etsy-buyer Sequence on the IS canvas
  - ⚠️ Need to verify module: should be `Campaigns → Sequences`, NOT `Tasks → Processes`
  - Trigger node placed
  - Need to set entry filter (exclude `do-not-email`, `refund-filed`, `unsubscribed`)
  - 10 Send email nodes still to place + configure delays
  - Per-email content pending paste

## 🚨 Blockers (do these BEFORE pasting any email content)

### 1. Confirm right IS module

URL check: should contain `/sequences/`, not `/processes/`. If wrong module, rebuild canvas under `Campaigns → Sequences`. Skill founder explicitly warns against Process for trigger-based email drips (gotcha #27).

### 2. Deliverability setup (DNS + sender)

Open [`influencersoft-deliverability-prereqs.md`](influencersoft-deliverability-prereqs.md). 7 steps. The DNS work (DKIM/SPF/DMARC) takes 5min–24hrs to propagate so START NOW.

Without these: every email lands in spam. Open rates <5%. Sender reputation tanks.

### 3. Replace legacy sender

`Campaigns → Settings → Senders` — `Reliable Income Master <admin@mentalversatility.com>` (previous LTD owner) is still the default. Add + confirm STR Ledger sender, set as default, then optionally remove legacy.

### 4. Canary path for E2E test

The current canary plan (`is-end-to-end-test.mjs` pushes a contact via API) is broken — skill gotcha #6 says manually-added contacts CANNOT receive email. Need either:
- A real opt-in form on `thestrledger.com` (preferred)
- API 1.0 `AddLeadToGroup` with activation flag (more complex)
- Manual subscription via IS UI form

## 📋 Open Work (in order)

1. **Deliverability prereqs** (Step 1 from Blockers — start the DNS propagation timer)
2. **Module verification + canvas rebuild if needed**
3. **Rewrite Emails 2 + 6** of post-purchase to remove Liquid conditionals (`{% if sku_code contains "TAX-001" %}` — IS doesn't support these). Either single-version copy OR per-SKU branches via Filter Condition nodes on the canvas.
4. **Hardcode link tokens** in Emails 3, 4, 5, 8, 9:
   - `{{ link_thestrledger }}` → `https://thestrledger.com?utm_source=email&utm_campaign=post-purchase&utm_content=email{N}`
   - `{{ link_etsy_review }}` → temporary `https://www.etsy.com/your/purchases` (n8n will inject per-buyer link later)
5. **Place all 10 Send email nodes** on the post-purchase canvas with correct delays
6. **Paste email content** from [paste sheets](influencersoft-paste-sheets/post-purchase-etsy-buyer.md) (E1 is paste-ready; E2-E10 after step 3+4 above)
7. **Build kill-switch Sequence**: `Tag applied = refund-filed` → Add tag `do-not-email` → Add tag `do-not-email` → End (per skill gotcha #6.5 in tag-dictionary)
8. **Build Automatic Rules** for event→tag wiring:
   - `Refund on order` → tag `refund-filed` + `do-not-email`
   - `Paid order` → POST to n8n webhook (future)
9. **Build a real opt-in form** on `thestrledger.com` (for emailable canary path)
10. **Run E2E canary** via subscribed canary contact → confirm Email 1 lands in Primary within 5 min
11. **Paste remaining 10 sequences** in order: review-request, refund-recovery, welcome-book-magnet, abandoned-cart, win-back, BUNDLE-01..05
12. **Cleanup legacy lists** (9 leftover groups from previous LTD owner — quarantined, don't attach STR sequences to them)

## 📁 Canonical docs

| Doc | Purpose |
|---|---|
| [`ops/manual work/influencersoft-manual-setup-guide.md`](influencersoft-manual-setup-guide.md) | Human walkthrough — 6 parts |
| [`ops/manual work/influencersoft-deliverability-prereqs.md`](influencersoft-deliverability-prereqs.md) | 7-step DNS + sender checklist |
| [`ops/manual work/influencersoft-paste-sheets/__ALL-SEQUENCES.md`](influencersoft-paste-sheets/__ALL-SEQUENCES.md) | Combined paste sheet (42 emails) |
| [`infrastructure/influencersoft/custom-fields.yaml`](../../infrastructure/influencersoft/custom-fields.yaml) | Field index SoT (DO NOT REORDER) |
| [`infrastructure/influencersoft/tag-dictionary.md`](../../infrastructure/influencersoft/tag-dictionary.md) | Tag namespace SoT |
| [`ops/influencersoft-api-probe.md`](../influencersoft-api-probe.md) | API surface reference |
| `~/.claude/skills/influencersoft/` | Authoritative IS knowledge (skill) — `Skill influencersoft` to load |

## Resume protocol for next session

1. Open this file first
2. Re-load skill: `Skill influencersoft`
3. Check `ops/manual work/influencersoft-paste-sheets/__ALL-SEQUENCES.md` for current "to-paste" checkboxes
4. Identify the next blocker (above) or open work item
5. Confirm with Daniel before proceeding on anything risky

## Last commits in main

- `2eac6e3` — Merge: InfluencerSoft token conversion + skill-audit doc fixes (this session)
- `f26f4d0` — docs(is): audit fixes from influencersoft skill cross-check
- `12a9b76` — feat(is): IS-correct token conversion in paste sheets ({$leadExfield[N]})
- `c4f9585` — Merge: InfluencerSoft sequence paste infrastructure + custom-field rename
- `8a599de` — feat(is): IS sequence paste infrastructure + custom-field rename
