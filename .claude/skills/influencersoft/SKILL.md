---
name: influencersoft
description: Use when working with InfluencerSoft (kebron tenant) — adding or tagging contacts, pasting email sequences, configuring funnels, debugging email deliverability, integrating Etsy/Stripe orders, or making any IS API call. Covers API 1.0 + 2.0, all 11 modules, sequence trigger tags, and the full UI walkthrough. Triggers on: InfluencerSoft, IS sequence, addupdatelead, addtagtolead, rpsKey, kebron tenant, trigger tag, paste sequence, Click.js, evergreen webinar, FBL, sender domain, AppSumo LTD, post-purchase-etsy-buyer, bundle-cross.
---

# InfluencerSoft Skill

Project-specific guide for working with InfluencerSoft (IS) — Daniel's all-in-one
funnel + email + CRM + LMS + affiliate + storefront platform. Tenant:
**`kebron.influencersoft.com`**. LTD redeemed. API key live in `./.env` as
`INFLUENCERSOFT_API_KEY` (32 chars).

IS is critical infrastructure for the STR Ledger revenue funnel: it owns the
email lifecycle (10 sequences), tags every buyer from Etsy and Stripe, hosts the
affiliate program, and serves the lead-magnet welcome funnels.

## 1. Canonical docs index (read these first)

When a task touches one of these areas, the project doc below is the source of
truth — **do not** restate or reinterpret its contents.

| Topic | Canonical doc |
|---|---|
| API endpoint matrix, auth scheme, response shapes, gotchas | [ops/influencersoft-api-probe.md](../../../ops/influencersoft-api-probe.md) |
| Manual setup checklist, 11-sequence paste order, custom-field rename rules | [ops/manual work/influencersoft-manual-setup-guide.md](../../../ops/manual%20work/influencersoft-manual-setup-guide.md) |
| Tag namespace + naming rules + trigger-tag map | [infrastructure/influencersoft/tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) |
| API 2.0 Node.js client (rate-limited, never-logs-body) | [scripts/lib/influencersoft.mjs](../../../scripts/lib/influencersoft.mjs) |
| Operational scripts (probe, add contact, tag events, paste helper, e2e test) | `scripts/is-*.mjs` (5 files) |

This skill's other files cover what those docs DON'T: UI walkthrough, reports,
deliverability, plan tiers, and gotchas synthesized from 27 sources in the
project's NotebookLM notebook.

## 2. Decision tree — which path do I use?

```
IS task arrives
│
├── Add / update / tag a contact?
│   ├── Inside n8n workflow → use existing workflow (STR_Etsy_*, STR_Stripe_*)
│   ├── New programmatic call → scripts/lib/influencersoft.mjs (API 2.0)
│   └── One-off manual → IS UI: Contacts → Leads
│
├── Create / edit an email sequence?
│   └── ALWAYS UI. No API exists. Follow paste order in
│       ops/manual work/influencersoft-manual-setup-guide.md (Part 3).
│
├── Create / edit a funnel?
│   └── ALWAYS UI. See ui-walkthrough.md for canvas + page builder tour.
│
├── Create a product?
│   ├── < 5 products → IS UI: Store → Products
│   └── Bulk (≥5) → infrastructure/influencersoft/push_products.js
│       (API 1.0 hash auth — see api-quickref.md §3)
│
├── Email landing in spam / not arriving?
│   └── See deliverability.md → check FBL, DKIM/SPF/DMARC, sender confirmation
│
├── Add tracking pixel (GA, Meta, TikTok)?
│   └── See ui-walkthrough.md → HEAD code placement (Websites → Set up → More)
│
├── Webhook / external integration?
│   ├── Outbound → Zapier (see api-quickref.md §4 for trigger list)
│   └── Inbound → POST https://kebron.influencersoft.com/api/AddUpdateLead
│
├── Question about a report or analytics?
│   └── See reports-analytics.md (9 report types mapped to menu paths)
│
├── Plan limit, support, mentoring call?
│   └── See plans-and-support.md
│
└── Anything else not covered?
    └── See §9 — NotebookLM escape hatch
```

## 3. Module quick map

11 top-level modules. Full menu paths and one-line "what you do here" in
[modules.md](modules.md).

| Module | Path | One-line job |
|---|---|---|
| Dashboard | login landing | Startup Checklist, Tech Tuesday timer |
| Funnels | `Funnels → My Funnels` | Visual flowchart canvas (THE hub) |
| Contacts | `Contacts → Leads` | CRM, lists, tags, custom fields |
| Sequences | `Campaigns → Sequence` | Linear email autoresponders |
| Process | `Automation → Process` | Advanced branching automation |
| Mailing Settings | `Campaigns → Settings` | Senders, DKIM/SPF/DMARC, FBL |
| Courses | `Courses → Add a Course` | LMS — modules, lessons, drip, gating |
| Affiliates | `Affiliates → Offers` | 2-tier program, Click.js tracking |
| Store | `Store → Products` | Products, pricing, bumps, coupons |
| Webinars | `Website → Webinar` | Live external or evergreen rooms |
| Integrations/API | account footer → `Integration and API` | rpsKey, Zapier, webhooks |

Secondary surfaces: Surveys (`Website → Surveys`), Reports (top-level), Website
settings (`Websites → Set up`).

## 4. Common task recipes

### Add an Etsy buyer with order tags (via API)

```js
import { addUpdateLead } from "./scripts/lib/influencersoft.mjs";

await addUpdateLead({
  lead_email: buyer.email,
  lead_first_name: buyer.first_name,
  add_tags: "customer:etsy,product:tax-001-mileage-log,source:etsy",
});
```

Trigger tag `customer:etsy` fires the `post-purchase-etsy-buyer` sequence.
See `tag-dictionary.md` §1 for the complete trigger-tag map.

### Paste a new sequence into IS UI

1. Read `ops/manual work/influencersoft-manual-setup-guide.md` Parts 3 and 4
2. Confirm custom fields from Part 2 exist (sku_code, bought_on, etc.)
3. IS UI → Campaigns → Sequence → Add sequence
4. Name = filename without `.md` (e.g. `post-purchase-etsy-buyer`)
5. Set Trigger = "When tag added" with tag from `tag-dictionary.md` §1
6. Paste each email body between ` ``` ` fences from the source `.md`
7. Set delay per email header ("Day 0 — within 5 minutes" → 0m; "Day 5" → 5d)
8. Save and activate

### Probe lists and products

```bash
node scripts/is-probe.mjs
```
Outputs `infrastructure/influencersoft/lists.yaml` and `products.yaml`.
Re-run after Daniel creates new groups/products in UI.

### Run end-to-end test

```bash
node scripts/is-end-to-end-test.mjs
```
Pushes a canary contact through `AddUpdateLead` + `AddTagToLead`; verifies
sequence Day-0 email arrives in test Gmail within 5 minutes.

## 5. Top gotchas you'll hit (full list in gotchas.md)

1. **Renaming a trigger tag silently breaks the sequence.** Sequences bind by
   exact string in the IS UI. Add new tags, never rename. Always pull the
   string from `tag-dictionary.md`.
2. **Custom-field slug collision.** IS rejects names sharing prefix with an
   existing field; the UI shows STALE error for the LAST collision. Refresh
   the page between adds.
3. **Lesson "copy" is linked, not duplicated.** Editing a lesson in the copy
   mutates the original. Use "Create lesson from scratch" if you want
   independent copies.
4. **FBL mailbox must be brand new.** IS auto-deletes incoming mail after
   processing. Reusing a live mailbox wipes its history.
5. **PascalCase API endpoints.** `getalllists` 307-redirects to
   `GetAllGroups`. The client lib already handles this — just use the helpers.

## 6. Project-specific conventions

1. **Tenant:** `kebron.influencersoft.com` (override via `IS_TENANT` env, default in client lib)
2. **API version:** prefer 2.0; fall back to 1.0 only for `AddGood`, `AddLeadToGroup`, `DeleteSubscribe`, `DeleteOrder`
3. **Tag namespace rules** (per `tag-dictionary.md` §6):
   - Lowercase only
   - Colon for namespace, hyphen for words (`bundle-cross:first-year-host`, NOT `bundle_cross:firstYearHost`)
   - No spaces
   - Add new tags rather than renaming
4. **11-sequence paste order:** Etsy post-purchase first (revenue gate), then review/refund, then magnet/cart/winback, then bundle cross-sells. Per `manual-setup-guide.md` Part 3.
5. **Custom-field naming:** `sku_code`, `sku_label`, `bought_on`, `order_ref`, `xsell_name`, `xsell_url`, `pack_name`. Never revert to longer names without renaming across `copy/email-sequences/*.md` AND every `scripts/is-*.mjs`.
6. **Never log full POST bodies** — key leakage risk. Client lib enforces this.
7. **Rate limit:** ≤0.9 req/sec (1100ms between calls). Client lib enforces this.
8. **Tags are source of truth:** scripts MUST pull strings from `tag-dictionary.md`. Hardcoding a tag inline = future drift.

## 7. Files in this skill

| File | When to read it |
|---|---|
| [modules.md](modules.md) | Need to find a feature in the UI by name |
| [api-quickref.md](api-quickref.md) | Need API endpoint, hash algo, Zapier trigger, webhook payload |
| [ui-walkthrough.md](ui-walkthrough.md) | Building a funnel or page — what blocks/widgets exist |
| [deliverability.md](deliverability.md) | Emails not landing or planning sender domain setup |
| [reports-analytics.md](reports-analytics.md) | "How many people opened email 3 in sequence X?" |
| [gotchas.md](gotchas.md) | Before any non-trivial change — scan for traps |
| [plans-and-support.md](plans-and-support.md) | Hit a plan limit, need support escalation, want Tech Tuesday |

## 8. When this skill applies

Triggers (also in frontmatter description):
InfluencerSoft, IS sequence, addupdatelead, addtagtolead, rpsKey, kebron tenant,
trigger tag, paste sequence, Click.js, evergreen webinar, FBL, sender domain,
AppSumo LTD, post-purchase-etsy-buyer, bundle-cross, customer:etsy,
refund-recovery, welcome-book-magnet, abandoned-cart, win-back, is-add-contact,
is-tag-events, is-probe, is-paste-helper, AddGood, GetAllGroups, GetGoods.

## 9. Deep research escape hatch — NotebookLM

For questions not covered in this skill (new IS features, edge cases, verbatim
source quotes, suspected IS UI changes since 2026-04-28), query the project's
NotebookLM notebook directly.

- **Notebook ID:** `2625477b-aa78-45b0-9ca6-6712d0d2d194`
- **Title:** InfluencerSoft: Complete Setup, Usage, Tips & Tricks
- **Sources:** 27 (official docs, founder YouTube interviews, AppSumo reviews,
  blog reviews) — snapshotted 2026-04-28
- **Owner:** Daniel

Command:
```bash
notebooklm ask "your question" --notebook 2625477b-aa78-45b0-9ca6-6712d0d2d194
```

When to use:
- The skill files don't answer the question
- User mentions an IS feature you don't recognize
- You need a verbatim source quote (founder interview, official doc)
- Suspected IS UI change since 2026-04-28

If auth fails: clear lock files at `~/.notebooklm/browser_profile/Singleton*`
then `notebooklm login`. If still failing, fall back to web search of
`help.influencersoft.com`.

Updating the notebook: Daniel adds sources via the NotebookLM web UI; this skill
does not regenerate. If you query something that proves outdated, mention it
to Daniel so he can add fresh sources.
