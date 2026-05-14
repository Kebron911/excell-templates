# InfluencerSoft Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a discoverable Claude skill at `.claude/skills/influencersoft/` that auto-triggers on IS-related tasks, routes API-vs-UI-vs-n8n decisions, and contains the complete InfluencerSoft knowledge base (UI walkthrough, reports, deliverability, gotchas, plans, API quickref) while deferring to existing canonical project docs.

**Architecture:** Hub-and-spoke. SKILL.md is the entry point with decision tree + canonical-doc pointers + NotebookLM escape hatch. 7 supporting domain files cover what existing project docs don't (UI tour, reports, gotchas, etc.). No content duplicated from `ops/influencersoft-api-probe.md`, `infrastructure/influencersoft/tag-dictionary.md`, `ops/manual work/influencersoft-manual-setup-guide.md`, or `scripts/lib/influencersoft.mjs`.

**Tech Stack:** Markdown only. Claude Code skill auto-discovery via frontmatter description. NotebookLM CLI for the escape hatch.

**Spec:** [docs/superpowers/specs/2026-05-13-influencersoft-skill-design.md](../specs/2026-05-13-influencersoft-skill-design.md)

---

## File Structure

| File | Responsibility | Approx lines |
|---|---|---|
| `.claude/skills/influencersoft/SKILL.md` | Entry: frontmatter + decision tree + canonical-doc index + escape hatch | ~180 |
| `.claude/skills/influencersoft/modules.md` | 11-module map with menu paths | ~90 |
| `.claude/skills/influencersoft/api-quickref.md` | API 2.0 cheat sheet + API 1.0 hash + Zapier triggers/actions + webhook payload | ~140 |
| `.claude/skills/influencersoft/gotchas.md` | 30+ tips/mistakes table | ~110 |
| `.claude/skills/influencersoft/ui-walkthrough.md` | Funnel canvas + Page Builder widgets + template catalog + A/B testing | ~150 |
| `.claude/skills/influencersoft/deliverability.md` | DKIM/SPF/DMARC/FBL + corporate-email + auto-clean | ~80 |
| `.claude/skills/influencersoft/reports-analytics.md` | 9 report types + Campaigns analytics views | ~80 |
| `.claude/skills/influencersoft/plans-and-support.md` | T1/T2/T3 spec table + Tech Tuesday + escalation | ~70 |

Each file has one clear responsibility. SKILL.md is the only file Claude auto-loads on discovery; the others are pulled in on-demand as the conversation needs them (Claude is instructed to read them inside SKILL.md's decision tree).

---

## Verification approach

Each task ends with two checks:

1. **Link check:** Every relative path mentioned in the new file resolves to an existing file in the worktree.
2. **No placeholders:** No `TBD`, `TODO`, `FIXME`, or empty section bodies.

Both verified with `grep` after the file is written. Then commit.

Final task (Task 10) does an end-to-end skill-discovery dry run.

---

## Task 1: Create skill directory and verify worktree state

**Files:**
- Create: `.claude/skills/influencersoft/` (directory)

- [ ] **Step 1: Verify current branch and clean state**

Run:
```bash
git status --short
git rev-parse --abbrev-ref HEAD
```
Expected:
- Branch: `claude/zen-margulis-e3ff87`
- Working tree clean (or only the spec from prior step)

- [ ] **Step 2: Create skill directory**

Run:
```bash
mkdir -p .claude/skills/influencersoft
ls -la .claude/skills/influencersoft/
```
Expected: empty directory exists.

- [ ] **Step 3: Verify canonical docs the skill will link to all exist**

Run:
```bash
for f in \
  "ops/influencersoft-api-probe.md" \
  "ops/manual work/influencersoft-manual-setup-guide.md" \
  "infrastructure/influencersoft/tag-dictionary.md" \
  "scripts/lib/influencersoft.mjs" \
  "scripts/is-add-contact.mjs" \
  "scripts/is-end-to-end-test.mjs" \
  "scripts/is-paste-helper.mjs" \
  "scripts/is-probe.mjs" \
  "scripts/is-tag-events.mjs" \
  "infrastructure/influencersoft/verify-tag-and-sequence-methods.sh"; do
  [ -e "$f" ] && echo "OK $f" || echo "MISS $f"
done
```
Expected: every line starts with `OK`. If any `MISS`, halt and investigate before proceeding — the skill's links would break.

- [ ] **Step 4: No commit yet** (directory creation alone isn't committable; next task creates the first file).

---

## Task 2: Write SKILL.md (entry point)

**Files:**
- Create: `.claude/skills/influencersoft/SKILL.md`

- [ ] **Step 1: Write SKILL.md with this exact content**

```markdown
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
```

- [ ] **Step 2: Verify file structure**

Run:
```bash
wc -l .claude/skills/influencersoft/SKILL.md
head -3 .claude/skills/influencersoft/SKILL.md
```
Expected: ~180 lines, starts with `---` and the frontmatter block.

- [ ] **Step 3: Verify all relative links resolve**

Run:
```bash
grep -oE '\(\.\./\.\./\.\.[^)]+\)' .claude/skills/influencersoft/SKILL.md | \
  sed 's|[()]||g; s|%20| |g' | \
  while read p; do
    actual=".claude/skills/influencersoft/$p"
    [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
  done
```
Expected: every linked canonical doc shows `OK`. If any `MISS`, the link path is wrong — fix before committing.

- [ ] **Step 4: Check for placeholders**

Run:
```bash
grep -nE 'TBD|TODO|FIXME|XXX' .claude/skills/influencersoft/SKILL.md || echo "clean"
```
Expected: `clean`. Any hit means a placeholder slipped in — fix.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/influencersoft/SKILL.md
git commit -m "$(cat <<'EOF'
feat(skills): add InfluencerSoft skill entry point (SKILL.md)

Hub for Claude IS-skill auto-discovery. Decision tree routing API vs UI vs
n8n, canonical-doc index pointing to existing project docs (no duplication),
top gotchas surfaced inline, NotebookLM escape hatch documented.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Write modules.md

**Files:**
- Create: `.claude/skills/influencersoft/modules.md`

- [ ] **Step 1: Write modules.md with this exact content**

```markdown
# InfluencerSoft Module Map

The 11 top-level modules plus secondary surfaces. Each entry lists the exact UI
menu path and the primary thing you do there. Tenant: `kebron.influencersoft.com`.

## 1. Dashboard
- **Path:** Login landing screen
- **What:** Startup Checklist, welcome/fast-start videos, **InfluencerSoft
  Academy**, weekly mentoring (Tech Tuesday) timer + join link.
- **Related:** Gateway to every other module's training.

## 2. Funnels — the visual hub
- **Path:** `Funnels → My Funnels` (then `Catalog` for templates)
- **What:** Drag-drop flowchart canvas. Pages, Forms, Actions, Traffic blocks.
  Link blocks with arrows. Pencil icon on any block opens the page editor.
- **Related:** Courses, sequences, store products can all be created from
  inside the funnel canvas by dragging the matching block.
- **Deeper:** see [ui-walkthrough.md](ui-walkthrough.md).

## 3. Contacts (CRM)
- **Path:** `Contacts → Leads`
- **What:** Lists/groups (terms used interchangeably in UI), tags, custom
  fields, subscription forms, individual lead activity history.
- **Add contact:** API (`AddUpdateLead`) or manual via this screen.
- **Custom fields:** `Contacts → Custom Fields` — IS rejects prefix-colliding
  names (refresh page between adds; see [gotchas.md](gotchas.md)).
- **Naming rules:** see [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) §6.

## 4. Email Sequences (Campaigns)
- **Path:** `Campaigns → Sequence`
- **What:** Linear, scheduled email autoresponders. Purple "+" adds first
  email, green "+" adds subsequent. Delays are time-based (e.g. 2d after prev)
  or date-based. "Add option" inside an email = A/B test (auto 50/50 split).
- **Sequences cannot be created via API** — paste from `.md` drafts. See
  paste order in [manual-setup-guide.md](../../../ops/manual%20work/influencersoft-manual-setup-guide.md) Part 3.

## 5. Process (Automation)
- **Path:** `Automation → Process` or canvas Action block
- **What:** Advanced visual automation — branching, multi-fire, filters,
  A/B test blocks, action blocks (send email, add tag, move between lists).
  Use this when a linear sequence can't express the logic.
- **Warning:** Don't build massive Process flows if a linear sequence works —
  harder to troubleshoot (founder's own advice).

## 6. Mailing Settings (deliverability)
- **Path:** `Campaigns → Settings`
- **What:** Add/confirm sender emails (must be corporate domain — DMARC
  rejects Gmail/Yahoo), configure DKIM/SPF/DMARC DNS records, FBL setup.
- **Email templates** sub-tab: project logo, author photo, social links
  auto-appended to all mailings.
- **Language** sub-tab: account-wide default language.
- **Deeper:** see [deliverability.md](deliverability.md).

## 7. Courses (LMS)
- **Path:** `Courses → Add a Course`
- **What:** Modules → Lessons (with optional drip — "Instantly" / "X days
  after start" / "X days after previous" / "calendar date"). Bulk-add or
  drag-reorder lessons. Mark obligatory (blue exclamation mark).
- **Access:** `Access` tab → "Allowed to leads in lists" → check lists.
  Override with "Not allowed" lists. Per-module gating also supported.
- **Reports:** `Courses → Reports` — Lesson opened vs completed counts,
  homework status (New/Accepted/Rejected).
- **Members area:** drag Members Area block in any Funnel to link a course.

## 8. Affiliates
- **Path:** `Affiliates → Offers`
- **What:** 2-tier affiliate program. Fixed sum OR % commission. Payout via
  PayPal or bank. MoneyBack auto-subtracts commission on refund.
- **Tracking:** `Click.js` script (paste into HEAD of external pages) parses
  UTM tags + sets browser cookie tying clicks to partners.
- **Fee Period:** 1–365 days or "forever" (cookie window).
- **Reports:** `Affiliates → Affiliate Management and Reporting`.

## 9. Store (E-commerce)
- **Path:** `Store → Products`, `Store → Order forms`, `Store → Coupons`
- **What:** Digital + physical products, single-price or recurring plans,
  multi-currency, order bumps (Payment Page → Actions → "Adding a Bump
  Offer"), upsell/downsell pages with `#upsell_yes` / `#upsell_no` variables
  for one-click charging.
- **Gateways:** Stripe (on-page card), PayPal (off-page redirect).
- **Limitation:** no "add-to-cart" — single-product funnels only.

## 10. Webinars
- **Path:** `Website → Webinar`
- **What:** Configure webinar rooms — title, date, time (East Coast military),
  countdown timer toggle, chat toggle, embed YouTube/private video.
  Behavioral routing in funnels (watched-to-end vs skipped → different paths).
- **Live webinars:** recommended to use external (Zoom/Sessions) via "Any
  Page by URL" block and let IS handle traffic tracking.
- **Evergreen:** native Replay Room block — the same funnel with a different
  arrow makes a live webinar evergreen.

## 11. Integrations & API
- **Path:** Account footer → `Integration and API` or
  `username.influencersoft.com/shops/setts/apisettings/`
- **What:** Retrieve **rpsKey** (API key). Connect Zapier (4 triggers + 6
  actions). Generate `Click.js` snippet for external page tracking.
  Configure webhook fields.
- **Deeper:** see [api-quickref.md](api-quickref.md).

---

## Secondary surfaces

### Surveys
- **Path:** `Website → Surveys`
- **What:** Standalone survey builder (Pages + Questions). Multi-language
  field requirements. Trigger actions on completion (add to list, redirect).
- **Founder advice:** if you need anything beyond basic, embed Google Forms
  via the Code widget — native builder is "very simple".

### Reports
- **Path:** `Reports` (top-level)
- **What:** Sales Funnel Analytics, Sales Statistics, Subscription
  Statistics, Advertising Efficiency, Sales Department Statistics,
  Expenses Import. Plus sequence analytics under `Campaigns → Analytics`.
- **Deeper:** see [reports-analytics.md](reports-analytics.md).

### Website / Domain
- **Path:** `Websites → Set up`
- **What:** Link custom domain via CNAME, get free SSL, manage subdomains,
  paste HEAD code (Google Analytics, Facebook Pixel, custom scripts) under
  the `More` tab → `Add HEAD code`.

### Personal Managers / Team
- **Path:** `Integration and API` (account footer) — also `getpersonalmanagers` API
- **What:** Additional users (Sales Manager, Personal Manager roles for
  homework review). User count depends on tier (5 / 15 / 25+).
```

- [ ] **Step 2: Verify file**

Run:
```bash
wc -l .claude/skills/influencersoft/modules.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/modules.md || echo "clean"
```
Expected: ~90 lines, "clean".

- [ ] **Step 3: Verify cross-links resolve**

Run:
```bash
for p in "ui-walkthrough.md" "deliverability.md" "api-quickref.md" "gotchas.md" "reports-analytics.md"; do
  # These are sibling files in the skill folder — not all created yet.
  echo "PENDING $p"
done
# Verify canonical-doc backlinks
for p in "../../../infrastructure/influencersoft/tag-dictionary.md" \
         "../../../ops/manual work/influencersoft-manual-setup-guide.md"; do
  actual=".claude/skills/influencersoft/$p"
  [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
done
```
Expected: backlinks `OK`; sibling links pending (will be created in later tasks).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/influencersoft/modules.md
git commit -m "feat(skills/is): add modules.md — 11 modules + secondary surfaces

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Write api-quickref.md

**Files:**
- Create: `.claude/skills/influencersoft/api-quickref.md`

- [ ] **Step 1: Write api-quickref.md with this exact content**

```markdown
# InfluencerSoft API Quick Reference

Cheat sheet for the most-used API surfaces. Full endpoint matrix with parameter
lists, response shapes, and rate-limit notes lives in
[ops/influencersoft-api-probe.md](../../../ops/influencersoft-api-probe.md).
The rate-limited Node.js client is at
[scripts/lib/influencersoft.mjs](../../../scripts/lib/influencersoft.mjs).

## 1. API 2.0 (current — use this by default)

- **Base URL:** `https://kebron.influencersoft.com/api/<Method>`
- **Method names:** PascalCase (lowercase 307-redirects)
- **Auth:** POST body field `rpsKey=<INFLUENCERSOFT_API_KEY>`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Response:** JSON — `{error_code:0, error_text:"OK", result:[...], hash:"..."}`
- **Rate limit:** undocumented; client throttles to 1100ms (~0.9 req/s)

### Primary endpoints (already wrapped in client lib)

| Endpoint | Helper | Purpose |
|---|---|---|
| `AddUpdateLead` | `addUpdateLead(fields)` | Create or update contact (idempotent on email). Can set tags + lists in one call. Primary tool. |
| `AddTagToLead` | `addTagToLead(email, tags)` | Add tag(s) to existing contact. Tags auto-create on first use. |
| `RemoveTagFromLead` | `removeTagFromLead(email, tags)` | Remove tag(s). |
| `GetAllGroups` | `getAllGroups()` | List all groups/lists with IDs (IDs are opaque numerics — resolve via this). |
| `GetGoods` | `getGoods()` | List all products. |
| `GetCoupons` | `getCoupons()` | List all coupons. |
| `CreateOrder` | not yet wrapped | Create order/invoice for a contact. **Irreversible.** |

### Sample call

```js
import { addUpdateLead, addTagToLead } from "../../scripts/lib/influencersoft.mjs";

await addUpdateLead({
  lead_email: "buyer@example.com",
  lead_first_name: "Jane",
  add_tags: "customer:etsy,product:tax-001-mileage-log",
  add_to_lists: "<group_id_from_GetAllGroups>",
});

await addTagToLead("buyer@example.com", ["engaged:opened-e1"]);
```

## 2. Trigger tags → sequences

When you set one of these via `AddUpdateLead` or `AddTagToLead`, the matching
sequence fires. Bound by exact string in IS UI — renaming breaks silently.
**Source of truth:** [tag-dictionary.md §1](../../../infrastructure/influencersoft/tag-dictionary.md).

| Tag | Fires sequence |
|---|---|
| `customer:etsy` | `post-purchase-etsy-buyer` |
| `purchased:day5` | `review-request` |
| `refund-filed` | `refund-recovery` |
| `lead-magnet:welcome-book` | `welcome-book-magnet` |
| `checkout-abandoned` | `abandoned-cart` |
| `inactive-30d` | `win-back` |
| `bundle-cross:first-year-host` | `BUNDLE-01-first-year-host` |
| `bundle-cross:aspiring-host` | `BUNDLE-02-aspiring-host` |
| `bundle-cross:year-2-operator` | `BUNDLE-03-year-2-operator` |
| `bundle-cross:portfolio` | `BUNDLE-04-portfolio` |
| `bundle-cross:pro-manager` | `BUNDLE-05-pro-manager` |

## 3. API 1.0 (legacy — hash auth)

Only use for verbs API 2.0 lacks: `AddGood` (product create), `AddLeadToGroup`
(with UTM + activation-email control), `DeleteSubscribe`, `DeleteOrder`,
`GetCountSubscribers`, `UpdateSubscriberData`.

### Hash algorithm

```
hash = MD5(buildQuery(params) + "::" + username + "::" + apikey)
```

- `buildQuery(params)` = PHP `http_build_query()` style URL-encoded form body
  (sort params, then encode — implementation in
  `infrastructure/influencersoft/push_products.js`)
- `username` = tenant subdomain (`kebron`)
- `apikey` = `INFLUENCERSOFT_API_KEY`

The full hash impl is in `push_products.js` lines that handle PHP-compatible
encoding (spaces → `+`, special chars escaped). Reuse it; don't re-derive.

### Known issue — AddGood "error_code 2 endpoint disabled"

`AddGood` is gated per-account by IS support. If you get `error_code 2`, the
endpoint is disabled for this tenant. Resolution: email
`support@influencersoft.com` or raise it in Tech Tuesday. As of 2026-05-08
this was the state for `kebron` tenant — verify before retry.

Bulk product upload script exists at
[infrastructure/influencersoft/push_products.js](../../../infrastructure/influencersoft/push_products.js)
with idempotent state tracking — ready to run once endpoint is enabled.

## 4. Zapier

InfluencerSoft exposes a native Zapier app. Use Zapier as fallback if direct
API gets brittle (or rate-limited beyond comfort).

### Triggers (Zapier fires when…)

| Trigger | Fires on |
|---|---|
| Added to List | Lead added to any list |
| New Lead | Brand-new contact record created |
| New Order | New order generated (before payment) |
| New Purchase | Payment completed |

### Actions (Zapier writes to IS)

| Action | Notes |
|---|---|
| Add/Update Lead | List membership, add/remove tags, full profile incl. social handles + billing/shipping/UTM |
| Add Tag to Lead | Fails if lead doesn't exist yet |
| Create Order | Product, price, coupon, VAT, payment method, affiliate, customer info |
| Remove Lead From List | |
| Remove Tag From Lead | |
| Unsubscribe Lead | Global unsubscribe across account |

## 5. Inbound webhook URLs (external → IS)

External systems POST directly to:

- `https://kebron.influencersoft.com/api/AddUpdateLead`
- `https://kebron.influencersoft.com/api/AddTagToLead`
- `https://kebron.influencersoft.com/api/CreateOrder`

Required form fields: `rpsKey=<key>`, plus endpoint-specific (e.g.
`lead_email` for lead methods).

## 6. Outbound webhook payload (IS → external)

When Zapier or a custom webhook fires on a New Lead / New Order event, the
payload contains:

- **Contact:** email, first/middle/last name, phone
- **Tracking:** utm_source, utm_medium, utm_campaign, utm_content, utm_term
- **Location:** IP, full billing + shipping address (city/state/zip/country)
- **Order:** product name, price, coupon, order ID, status, payment method,
  affiliate name, sales manager, order tags

## 7. Security notes

- Never log full POST bodies — `rpsKey` leakage risk (client lib enforces)
- Don't echo `INFLUENCERSOFT_API_KEY` even in dev shells
- API key lives in `.env` (root, not worktree) — see
  [CREDENTIALS.md](../../../CREDENTIALS.md)
- HTTPS only (no HTTP fallback)
```

- [ ] **Step 2: Verify file + placeholders**

```bash
wc -l .claude/skills/influencersoft/api-quickref.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/api-quickref.md || echo "clean"
```
Expected: ~140 lines, "clean".

- [ ] **Step 3: Verify canonical-doc links resolve**

```bash
for p in \
  "../../../ops/influencersoft-api-probe.md" \
  "../../../scripts/lib/influencersoft.mjs" \
  "../../../infrastructure/influencersoft/tag-dictionary.md" \
  "../../../infrastructure/influencersoft/push_products.js" \
  "../../../CREDENTIALS.md"; do
  actual=".claude/skills/influencersoft/$p"
  [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
done
```
Note: `push_products.js` and `CREDENTIALS.md` may not exist in worktree (live in main repo). If MISS, verify against main branch path; if still missing, replace links with the main-repo location or remove the link.

- [ ] **Step 4: If push_products.js or CREDENTIALS.md MISS, fix the links**

If MISS, run from main branch root to confirm canonical location, then update paths in `api-quickref.md` accordingly. Most likely they exist at `../../../infrastructure/influencersoft/push_products.js` and `../../../CREDENTIALS.md` once the worktree merges; if absolute path needed for now, use `../../../../CREDENTIALS.md` (one up from worktree root). Test:

```bash
ls -la ../../../infrastructure/influencersoft/push_products.js 2>&1
ls -la ../../../CREDENTIALS.md 2>&1
```

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/influencersoft/api-quickref.md
git commit -m "feat(skills/is): add api-quickref.md — API 2.0 + 1.0 hash + Zapier + webhooks

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: Write gotchas.md

**Files:**
- Create: `.claude/skills/influencersoft/gotchas.md`

- [ ] **Step 1: Write gotchas.md with this exact content**

```markdown
# InfluencerSoft Gotchas, Tips, and Common Mistakes

Synthesized from 27 sources in the project NotebookLM notebook: founder live
session (SAAS Saturdays), "6 months later" user review, AppSumo reviews, blog
reviews, and official IS help docs. Cross-check with
[ops/influencersoft-api-probe.md §5](../../../ops/influencersoft-api-probe.md)
for API-level risks already documented.

Each row: **gotcha → why → how to apply.**

## Critical — surface immediately

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 1 | Renaming a trigger tag silently breaks the sequence | Sequences bind by exact string in IS UI; IS just mirrors whatever strings you send | Pull every tag string from [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md). Add new tags rather than renaming. |
| 2 | Custom-field slug collision + stale UI error | IS rejects names sharing prefix with existing fields; the form holds STALE error from prior attempt and reports the LAST already-existing field as the collision | Refresh the Custom Fields page between each add. Use the short distinct stems in [manual-setup-guide.md Part 2](../../../ops/manual%20work/influencersoft-manual-setup-guide.md). |
| 3 | Lesson "copy" is linked, not duplicated | Copying a course doesn't duplicate the lessons — they remain pointers to the original | If you want an independent copy, create the lesson from scratch. Edits to a copied lesson mutate the original course. |
| 4 | FBL mailbox must be brand new | IS auto-deletes all incoming mail after processing — reusing a live mailbox WIPES it | Provision a fresh mailbox (e.g. `fbl@kebron-domain.com`) before configuring FBL. See [deliverability.md](deliverability.md) §FBL. |
| 5 | PascalCase endpoint names | `getalllists` 307-redirects to `GetAllGroups`; lowercase fails on some methods | Use [client lib](../../../scripts/lib/influencersoft.mjs) helpers — they're already PascalCase. If writing raw fetch, use PascalCase. |

## Email deliverability

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 6 | DMARC will reject Gmail/Yahoo "From" addresses | IS checks DMARC compliance; free-domain senders bounce | Always use a corporate domain (`@thestrledger.com`, `@kebron-domain.com`). |
| 7 | New sender emails are dead until confirmed | IS sends a confirmation link to the new sender mailbox; ignored = sequence silently fails to send | After adding a sender, immediately log into that mailbox and click the link. |
| 8 | Auto-clean removes unengaged subscribers | IS optional setting deletes subscribers who haven't opened 15 emails in 45 days | Enable for sender-reputation hygiene (per founder advice). Re-engage with `win-back` sequence before they hit the threshold. |
| 9 | DKIM/SPF/DMARC must be in DNS | Without these, deliverability tanks regardless of how good your content is | Configure DNS records in your domain registrar's panel; IS docs at `help.influencersoft.com` walk through it. |

## Funnel and page building

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 10 | No "mobile editing toggle" | The page builder can't simply switch views and edit per-device | Copy a section; set one to Desktop-only and the other to Mobile-only; reformat each independently. |
| 11 | `Click.js` script missing → silent affiliate tracking failure | The script is what parses UTM tags + sets cookies tying clicks to partners | Paste the snippet from `Affiliates → Offers` into the `<HEAD>` tag of every external landing page (WordPress, Calendly, etc.). |
| 12 | Upsell variables are special | One-click charging requires exact button variable names | Use `#upsell_yes` (charge + advance) and `#upsell_no` (refuse + downsell). `#nextpage` for normal navigation. |
| 13 | Note blocks for documentation | Don't put inline comments in JSON — the canvas has a Note action block | Drag a Note block onto the canvas to leave context for yourself or teammates. |
| 14 | Internal screenshots as block icons | IS auto-captures your page screenshots to show as flowchart icons | Re-edit a page → the icon updates. Useful for visually distinguishing similar pages. |

## E-commerce

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 15 | No "add-to-cart" | IS is single-product-funnel-first | Use bumps + upsells + downsells. For true cart, integrate external (Shopify) or accept the limitation. |
| 16 | PayPal integration is "wacky" | Routes to external page, not on-page | Stripe is the smoother path. If you need PayPal, expect a separate checkout step. |
| 17 | `CreateOrder` is irreversible | Real invoice generated on call — affects accounting | NEVER call during integration tests without `order_status=Cancel` or a test contact. |
| 18 | `AddGood` may be disabled | Per-account gating; returns `error_code 2` | Contact `support@influencersoft.com` or Tech Tuesday. Bulk script ready to run once enabled. |

## Tagging and segmentation

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 19 | Tags case-sensitive (assumed) and auto-create | No pre-create endpoint; whatever string you send creates the tag | Stick strictly to [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) — typos create orphan tags. |
| 20 | Tags don't trigger sequences retroactively for sequences that aren't bound to that tag | Sequence trigger is configured in UI; API can't "fire" a sequence directly | The trigger is set in UI, FIRED by API tagging — bind first, tag second. |
| 21 | List IDs are opaque numerics | E.g. `1594725950.5982672784` — you can't guess them | Call `GetAllGroups` once after creating lists in UI; cache in `infrastructure/influencersoft/lists.yaml` via `scripts/is-probe.mjs`. |
| 22 | Behavioral segmenting pattern | Marketing automation tip from founder | When a purchase succeeds, in a Process block: ADD buyer tag AND REMOVE from retargeting list in one move. |

## Courses / LMS

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 23 | "Star" a course → 2-cell prominence | Hidden UI feature in student dashboard | Click star icon to make a course occupy 2 cells instead of 1 — for new releases. |
| 24 | Double-click a tag deselects all | Hidden UI feature | In the student dashboard, double-click a tag to show all courses again. |
| 25 | Homework auto-vs-manual | Lessons can require "learner completed assignment" — gates next lesson | Set in lesson settings → "Lesson completed if" → "the learner completed the assignment". Auto-accept available in global LMS settings. |

## GDPR + data

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 26 | "Delete contact" leaves a zombie | GDPR-compliant anonymization — replaces identity with `delete123@example.com` placeholder | Don't expect the count to drop. Use `do-not-email` tag to suppress instead, or accept the zombie state. |

## Process module / automation

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 27 | Don't over-engineer Process flows | Founder explicitly warns: massive Process = harder to debug | Prefer linear Sequences when possible. Reach for Process only when branching is essential. |

## API + integrations

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 28 | Rate limit unknown — be conservative | IS docs don't publish a rate limit | Throttle ≤0.9 req/sec (client lib enforces 1100ms). Batch where possible (one `AddUpdateLead` with CSV tags/lists = one call, not N). |
| 29 | API 1.0 hash auth needs PHP-compatible encoding | `http_build_query()` style — spaces become `+`, not `%20` | Reuse the impl in `infrastructure/influencersoft/push_products.js`. Don't re-derive. |
| 30 | "Add Tag to Lead" in Zapier fails if lead doesn't exist | API quirk — sequencing matters | Always `Add/Update Lead` BEFORE `Add Tag to Lead` in a Zap chain. |

## Platform quirks

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 31 | UI feels "dated" / "2004 SCADA" | IS was built for EU/Russian market 8+ years ago | Don't expect modern UX. Stick to documented paths — improvisation often hits translation quirks. |
| 32 | Supports Latin + Cyrillic characters in tags | Multi-language origin | Stick to lowercase Latin per tag-dictionary rules — Cyrillic technically works but breaks naming conventions. |
| 33 | "Funnel templates" catalog has named templates | Not just blank canvas | Use `Funnels → My Funnels → Catalog` → pick Simple Webinar / Free Book / Product Launch / Calendar Booking / Digital Summit / Evergreen Webinar / SLO. See [ui-walkthrough.md](ui-walkthrough.md). |

## What to never do

- Never log full POST bodies (`rpsKey` leaks via request logs)
- Never call `CreateOrder` during integration tests without `Cancel` status
- Never use free-domain senders (Gmail/Yahoo) — bounces guaranteed
- Never bulk-fire tagged contacts faster than 0.9 req/sec
- Never rename a trigger tag without re-binding the sequence in IS UI
- Never assume a list ID — always resolve via `GetAllGroups`
- Never use `git add -A` near `.env` (key leakage)
```

- [ ] **Step 2: Verify file + placeholders**

```bash
wc -l .claude/skills/influencersoft/gotchas.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/gotchas.md || echo "clean"
```
Expected: ~110 lines, "clean".

- [ ] **Step 3: Verify canonical-doc links**

```bash
for p in \
  "../../../infrastructure/influencersoft/tag-dictionary.md" \
  "../../../ops/manual work/influencersoft-manual-setup-guide.md" \
  "../../../ops/influencersoft-api-probe.md" \
  "../../../scripts/lib/influencersoft.mjs"; do
  actual=".claude/skills/influencersoft/$p"
  [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
done
```
Expected: all `OK`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/influencersoft/gotchas.md
git commit -m "feat(skills/is): add gotchas.md — 33 tips/mistakes from notebook synthesis

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: Write ui-walkthrough.md

**Files:**
- Create: `.claude/skills/influencersoft/ui-walkthrough.md`

- [ ] **Step 1: Write ui-walkthrough.md with this exact content**

```markdown
# InfluencerSoft UI Walkthrough

Detailed tour of the Funnel canvas, Page Builder, template catalog, and the
A/B testing surfaces. For module-level menu paths see [modules.md](modules.md).

## 1. Funnels — the visual canvas

**Path:** `Funnels → My Funnels` (or `Catalog` for templates)

Drag blocks from the left panel onto the canvas. Link blocks by clicking and
dragging an **arrow** from one to the next. Click the **pencil icon** on any
block to open its settings or page editor.

### Block categories

**Pages** (visual website steps):
- **Opt-in** / **Double Opt-in** — lead capture
- **Sales / Content** — generic landing/content
- **Order** — checkout
- **Payment** — payment page (separate from Order; supports Bump Offers)
- **Upsell** — one-click upsell page (uses `#upsell_yes` / `#upsell_no`)
- **Downsell** — fallback after upsell refusal
- **Webinar** — webinar room
- **Members Area** — course access gate
- **Any Page by URL** — track external pages with `Click.js` snippet
- **Thank You / Confirmation** — post-conversion

**Forms** (standalone form blocks, embeddable elsewhere):
- Opt-in form
- Order form
- Payment form

**Actions** (logic on the canvas):
- **Email** — send a one-off email at this point
- **Timer** — delay
- **Filter** — split traffic by condition (e.g. "invoice paid")
- **A/B test** — split traffic between two paths
- **Process** — embed an advanced automation flow
- **Note** — leave inline documentation

**Traffic** (UTM tracking sources):
- **Facebook**, **YouTube**, **AdWords**, generic — each generates a unique URL
  tail with auto-tagged UTMs

### Hidden UI features

- **Analytics overlay:** top-right "magic button" (statistics icon) toggles
  real-time conversion overlay on every block — page views, opt-ins, paid
- **Block icons = page screenshots:** IS auto-captures your edited pages and
  shows them as the block icon. Re-edit → icon updates.
- **Pencil shortcut:** hover any block → click pencil to open editor

## 2. Page Builder (inside a page block)

Click pencil on any Page block. Drag widgets from the left tray.

### Widgets / elements

| Widget | What it does |
|---|---|
| Text | Headings + body copy with formatting |
| Video | YouTube-based player; can hide YouTube branding and controls |
| Image | Insert from internal media library |
| Button | Configurable target: `#nextpage`, `#upsell_yes`, `#upsell_no`, external URL |
| Countdown / Timer | Urgency timer (preinstalled in "Countdown" templates) |
| Opt-in form fields | Name / email / phone capture |
| Order / Payment form | Checkout fields, Stripe/PayPal, Bump Offer toggle |
| Sections | Pre-designed layout groups (drop as a unit) |
| Code | Embed custom HTML (e.g. Google Forms) |
| Interactive | Specialized live-broadcast / webinar elements |

### Top toolbar

- **Device toggle:** phone / tablet / desktop icons → preview mode (note:
  editing requires copy-section workaround — see [gotchas.md #10](gotchas.md))
- **Add a variant:** create a second page version for split-testing
- **More tab → Add HEAD code:** paste tracking pixels, Google Analytics,
  custom scripts — applies site-wide if at the Websites level

## 3. Wiring opt-in → list + tag

In a Funnel: pencil on an Opt-in block → **Actions** tab.

- **Lists:** under "Selecting a list", check the target group. To create a
  new list, click the `+` button next to the list-name field.
- **Tags:** in the "Add tag" field, type the tag (e.g. `lead-magnet:welcome-book`)
  and press **Enter**. Multiple tags = multiple Enter-presses.

The tag must match exactly with what's in
[tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md).

## 4. Order forms, bumps, and upsells

### Order Bumps

Pencil on a **Payment Page** block → Actions tab → check **"Adding a Bump
Offer"**. Configure:
- Bump product
- Button text
- Design (padding, background color, border)

### Upsells / Downsells

Drag an **Upsell** block. In the page editor, place buttons with these exact
variables:
- `#upsell_yes` — one-click charges the customer and advances
- `#upsell_no` — refuses, advances to Downsell or Thank You

Without these variables, the one-click flow fails silently.

## 5. Template catalog

`Funnels → My Funnels → Catalog`. Pre-built flows you can edit instead of
starting blank:

| Template | Use case | Default page sequence |
|---|---|---|
| Simple Webinar Funnel | Register leads for a masterclass | Opt-in → Thank You → Webinar Room |
| Free Book Funnel | Lead gen or low-ticket front-end | Opt-in/Order → Upsell(s) → Thank You |
| Product Launch Funnel | Multi-day video anticipation build | Multiple Content/Video pages → Order |
| Calendar Booking Funnel | High-ticket coaching/agency | Opt-in (Free Gift) → Video Bridge → Calendar |
| Digital Summit Funnel | Multi-speaker online events | Registration → Schedule → Access/Offer |
| Evergreen Webinar Funnel | 24/7 automated webinar | Invite → Opt-in → Countdown → Replay → Offer |
| Self-Liquidating Offer (SLO) | Cover ad cost on first transaction | Opt-in → OTO → Downsell → Checkout |

## 6. A/B testing — 3 levels

**Funnel level:** drag the **A/B test** Action block. Connect two outgoing
paths to different pages. Configure split ratio.

**Page level:** in the Page Builder for any landing page, click **"Add a
variant"** at the top. Creates a second version of that page for internal split.

**Email level:** inside a sequence email editor, click **"Add option"** to
create multiple subject lines or content versions. IS auto-splits (default
50/50) and reports the winner.

## 7. HEAD code placement

Three placement paths depending on scope:

1. **Site-wide:** `Websites → Set up → <your site> → More → Add HEAD code`
2. **External page tracking:** Funnel Builder → drag **"Any Page by URL"**
   block → copy "Click reference code" → paste in external page's `<HEAD>`
3. **Affiliate tracking on a specific page:** `Affiliates → Offers` → copy
   the generated `Click.js` script → paste in target page's `<HEAD>`

Native pixel integrations:
- **Google Analytics** (Universal Analytics) — paste script in Add HEAD code;
  e-commerce auto-tracked
- **Facebook Pixel** — same mechanism
- **TikTok / others** — paste their script via Add HEAD code; no native
  integration

## 8. Calendar / booking

IS **does not** have a native calendar booking system (announced for "v2.0").
Workflow today:

1. `Funnels → My Funnels → Catalog → Calendar Booking Funnel`
2. The final page uses the **Code widget** to embed an external scheduler
   (Calendly, TidyCal, SavvyCal). Paste their embed snippet.

## 9. Surveys

`Website → Surveys`. Standalone builder, distinct from opt-in forms.

- Multi-page surveys with named "Pages" and "Questions"
- Multi-language: dedicated **"Languages"** button for field requirements +
  success messages
- Trigger actions on completion: add to list, redirect, etc.

**Limitation:** native builder is "very simple". For anything advanced,
founder recommends Google Forms via Code widget.
```

- [ ] **Step 2: Verify file + placeholders**

```bash
wc -l .claude/skills/influencersoft/ui-walkthrough.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/ui-walkthrough.md || echo "clean"
```
Expected: ~150 lines, "clean".

- [ ] **Step 3: Verify cross-links**

```bash
for p in \
  "modules.md" \
  "gotchas.md" \
  "../../../infrastructure/influencersoft/tag-dictionary.md"; do
  actual=".claude/skills/influencersoft/$p"
  [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
done
```
Expected: all `OK` (modules.md was created in Task 3, gotchas.md in Task 5).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/influencersoft/ui-walkthrough.md
git commit -m "feat(skills/is): add ui-walkthrough.md — canvas + page builder + templates

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: Write deliverability.md

**Files:**
- Create: `.claude/skills/influencersoft/deliverability.md`

- [ ] **Step 1: Write deliverability.md with this exact content**

```markdown
# InfluencerSoft Email Deliverability

Configuring sender domains, DKIM/SPF/DMARC, and FBL so emails land in the
inbox instead of spam (or worse — rejection). Most paths live under
`Campaigns → Settings`.

Cross-reference: deliverability gotchas in [gotchas.md](gotchas.md) §6–9.

## 1. Senders

**Path:** `Campaigns → Settings → Senders`

- Add the sender email address (e.g. `daniel@thestrledger.com`,
  `support@thestrledger.com`)
- **MUST be a corporate domain** — Gmail/Yahoo "From" addresses are
  DMARC-rejected by most receivers
- IS sends a **confirmation link** to the new sender mailbox. Until you
  click it, the sender is DEAD — sequences using it silently fail.
- Multiple senders per account supported (sales@, support@, etc.)

## 2. DKIM / SPF / DMARC

Three DNS records required for inbox placement. Configure at your domain
registrar's DNS panel.

| Record | Purpose |
|---|---|
| **SPF** (TXT record) | Lists which servers are allowed to send for your domain — must include IS sending servers |
| **DKIM** (TXT record, IS provides the value) | Cryptographic signature proving emails were sent through IS, not spoofed |
| **DMARC** (TXT record at `_dmarc.<domain>`) | Tells receivers what to do when SPF/DKIM fail (reject / quarantine / report) |

Walkthrough at `help.influencersoft.com`. If stuck, Tech Tuesday call with
Sharice-Marie can configure live via screen-share.

## 3. Feedback Loop (FBL)

FBL = auto-unsubscribe contacts who mark your emails as spam. Critical for
sender reputation.

**Path:** `Campaigns → Settings → FBL` (or filed under Mailing Settings)

### Setup steps

1. **Provision a brand-new mailbox** dedicated to FBL — e.g.
   `fbl@thestrledger.com`.
   - **CRITICAL:** IS auto-deletes all incoming mail in this box after
     processing. Do NOT reuse an existing mailbox or you'll wipe its history.
2. **Verify domain at Google Postmaster Tools** if using Gmail —
   `postmaster.google.com`. Add domain, verify via DNS TXT or CNAME.
3. **Provide IMAP credentials to IS support:**
   - IMAP server (e.g. `imap.gmail.com`)
   - Login (the FBL mailbox)
   - Password (app password if 2FA on)
4. Wait for IS to confirm FBL is active.

After setup, when a recipient hits "Mark as Spam" in Gmail/Outlook, the
provider sends a complaint to your FBL mailbox → IS reads it → unsubscribes
that recipient automatically.

## 4. Auto-clean (sender reputation hygiene)

**Path:** `Campaigns → Settings → Auto-clean` (toggle)

When enabled, IS deletes subscribers who haven't opened **15 emails in 45
days**. Prunes unengaged contacts before they hurt your sender reputation.

Strategic pattern (founder advice):
1. Win-back sequence fires on `inactive-30d` tag (set by IS daily automation)
2. If they re-engage → tag clears, they stay
3. If they don't → auto-clean removes them at the 45-day mark

## 5. vCard + spam-button footer

**Path:** `Campaigns → Settings → Email templates`

- **"Automatically add a vCard"** toggle: appends a contact card to outgoing
  emails so recipients can save you in their address book → improves inboxing
- **Spam-report / unsubscribe footer:** required by law (CAN-SPAM, GDPR); IS
  includes it automatically but you can customize copy

## 6. List hygiene during sequence migration

When pasting new sequences (per [manual-setup-guide.md Part 3](../../../ops/manual%20work/influencersoft-manual-setup-guide.md)):

- Send first emails to a **canary test list** (just yourself + one or two
  testers)
- Monitor `Campaigns → Analytics of Automatic Email` for the first 24h —
  check opens, clicks, bounces
- If hard-bounce rate > 5% or spam complaints > 0.1% — **PAUSE** and
  investigate before exposing full list

## 7. Common deliverability failures

| Symptom | Likely cause | Fix |
|---|---|---|
| All emails to spam | Missing DKIM/SPF/DMARC | Configure DNS records |
| Some inboxes, some spam | Sender reputation low | Enable auto-clean, FBL; reduce frequency |
| Bounce rate spiking | List hygiene problem | Run `is-probe.mjs`, identify hard-bounce list, suppress |
| No emails sending at all | Sender not confirmed | Click confirmation link in sender's mailbox |
| Gmail rejects | DMARC policy + free-domain sender | Switch to corporate-domain sender |

## 8. Escalation

If deliverability problems persist:
1. Check `Campaigns → Analytics → Broadcasts Message Analytics` for patterns
2. Check sender reputation at `postmaster.google.com` (Gmail) or
   `senders.microsoft.com` (Outlook)
3. **Tech Tuesday** live call (see [plans-and-support.md](plans-and-support.md))
4. `support@influencersoft.com` ticket if persistent
```

- [ ] **Step 2: Verify file + placeholders**

```bash
wc -l .claude/skills/influencersoft/deliverability.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/deliverability.md || echo "clean"
```
Expected: ~80 lines, "clean".

- [ ] **Step 3: Verify cross-links**

```bash
for p in \
  "gotchas.md" \
  "../../../ops/manual work/influencersoft-manual-setup-guide.md" \
  "plans-and-support.md"; do
  actual=".claude/skills/influencersoft/$p"
  [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
done
```
Expected: `gotchas.md` OK, `plans-and-support.md` MISS (will create in Task 9), manual-setup-guide OK.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/influencersoft/deliverability.md
git commit -m "feat(skills/is): add deliverability.md — DKIM/SPF/DMARC + FBL + auto-clean

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: Write reports-analytics.md

**Files:**
- Create: `.claude/skills/influencersoft/reports-analytics.md`

- [ ] **Step 1: Write reports-analytics.md with this exact content**

```markdown
# InfluencerSoft Reports & Analytics

Where to find every metric in the platform. Beyond the funnel canvas overlay
(magic button → top-right of any canvas), IS has a dedicated **Reports**
top-level menu plus per-module analytics under **Campaigns**, **Affiliates**,
and **Courses**.

## 1. Funnel canvas overlay (the fastest view)

**Path:** Open any funnel → click the **statistics icon (magic button)** at
top-right of the canvas.

- Overlays real-time numbers on every block: page views, opt-ins, orders,
  conversion %
- Best for "what's working" at-a-glance
- Per-block stats also visible by clicking a block

## 2. Reports module (dedicated)

**Path:** `Reports` (top-level menu)

| Report | Menu path | KPIs |
|---|---|---|
| **Sales Funnel Analytics** | `Reports → Sales Funnel Analytics` | Subscription activation rate, email open/click within sequence, bill processed → bill paid conversion |
| **Sales Statistics (Sales Report)** | `Reports → Sales Statistics` | Total revenue, order count, product-level sales, per-funnel profitability |
| **Subscription Statistics** | `Reports → Subscription Statistics` | List growth, total subscriber count, segmentation breakdown |
| **Advertising Efficiency** | `Reports → Advertising (The Efficiency of the Advertising Campaign)` | ROI per channel (FB / YouTube / AdWords) by UTM; most profitable traffic source |
| **Sales Department Statistics** | `Reports → Sales Department Statistics` | Sales manager assignments and productivity |
| **Expenses Import** | `Reports → How to Import Expenses into your Reports` | Upload external costs (ad spend) to compute true net profit |

## 3. Email + sequence analytics

**Path:** `Campaigns → Analytics of Automatic Email` or `Campaigns → Broadcasts Message Analytics`

- Real-time per-email metrics: opens, clicks, unsubscribes, spam complaints
- Granular: sequence-level + per-step
- Use for diagnosing slow openers, finding the email in a sequence where
  drop-off happens

## 4. Affiliate analytics

**Path:** `Affiliates → Affiliate Management and Reporting`

- Per-partner: clicks generated, earnings, payout history
- Identifies most/least productive affiliates
- Leaderboard view

## 5. Course / student analytics

**Path:** `Courses → Reports`

- "Lesson opened" vs "Lesson completed" counts
- Homework status (New / Accepted / Rejected) — click status to jump to
  student card
- Per-course completion rates
- Per-student progress

## 6. External analytics integrations

In addition to native reports, push event data out via the HEAD code field:

- **Google Analytics (Universal Analytics):** paste GA script in
  `Websites → Set up → More → Add HEAD code`. Auto-tracks e-commerce
  transactions, quantities, time-to-purchase.
- **Facebook Pixel:** same HEAD code mechanism per-funnel or site-wide
- **External tracking ("Any Page by URL" block):** for WordPress, Calendly,
  ThriveCart — pulls those visitors into IS funnel analytics via `Click.js`

## 7. Which report answers which question

| Question | Where |
|---|---|
| "Why are my opt-ins low?" | Funnel canvas overlay — see drop-off block |
| "Which ad source converts best?" | Reports → Advertising Efficiency |
| "Which email in my sequence is killing engagement?" | Campaigns → Analytics of Automatic Email |
| "Did my latest broadcast hit the inbox?" | Campaigns → Broadcasts Message Analytics |
| "Who are my top 3 affiliates this month?" | Affiliates → Management and Reporting |
| "What % of students finish my course?" | Courses → Reports |
| "What's my net profit on this funnel?" | Reports → Sales Statistics + Expenses Import |
| "Is my list growing or shrinking?" | Reports → Subscription Statistics |

## 8. Limitations

- No native real-time dashboard combining all KPIs (you assemble from above)
- No export of canvas overlay numbers (must screenshot or use raw report)
- Funnel-level cohort analysis is limited — for cohort breakdowns, push
  data to GA or BigQuery
```

- [ ] **Step 2: Verify file + placeholders**

```bash
wc -l .claude/skills/influencersoft/reports-analytics.md
grep -nE 'TBD|TODO|FIXME' .claude/skills/influencersoft/reports-analytics.md || echo "clean"
```
Expected: ~80 lines, "clean".

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/influencersoft/reports-analytics.md
git commit -m "feat(skills/is): add reports-analytics.md — 6 report types + per-module analytics

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9: Confirm AppSumo tier with user, then write plans-and-support.md

**Files:**
- Create: `.claude/skills/influencersoft/plans-and-support.md`

- [ ] **Step 1: Ask Daniel which AppSumo tier he redeemed**

Use AskUserQuestion tool:

```
Question: "Which AppSumo InfluencerSoft tier did you redeem? This affects the
contact / email / funnel limits I encode in the skill's plans-and-support.md."

Options:
- "Tier 1 (Starter — ~10K contacts, ~10K emails/mo, 50 funnels)"
- "Tier 2 (Professional — ~25K contacts, ~250K emails/mo, more funnels)"
- "Tier 3 (Influencer — 100K contacts, 1M emails/mo, unlimited funnels/users) (Recommended — most LTD buyers)"
- "Not sure / need to check"
```

If "Not sure", point Daniel to `Settings → Account → Plan` in IS UI and pause this task.

- [ ] **Step 2: Write plans-and-support.md using the confirmed tier**

Replace `<DANIEL_TIER>` placeholder with the actual tier name, and adjust the
"Current tier" callout accordingly.

```markdown
# InfluencerSoft Plans, Limits, and Support

Daniel's current tier: **<DANIEL_TIER>** (LTD redeemed via AppSumo;
tenant `kebron.influencersoft.com`).

## 1. AppSumo LTD tier comparison

| Feature | Tier 1 (Starter) | Tier 2 (Professional) | Tier 3 (Influencer) |
|---|---|---|---|
| Contacts | 10,000 – 25,000 | 100,000 | 100,000+ |
| Emails / month | 10,000 – 250,000 | 1,000,000 | 1,000,000 |
| Funnels | 50 | 1,000 | **Unlimited** |
| Websites | 3 | 1,000 | **Unlimited** |
| Custom domains | 1 | 3 | **Unlimited** |
| Team users | 5 | 15 | 25 – **Unlimited** |
| Courses | Basic | 50 course funnels | **Unlimited** |
| Tracked visitors / month | 1 million | 1 million | 1 million |
| Affiliate program | Not included | Included | Included |
| Whitelabel | No | Yes ($97/mo equiv) | Yes ($177/mo equiv) |
| 1:1 strategic counseling | No | No | Yes (Enterprise tier) |

**T3 is most LTD buyers' "smart move"** — unlimited funnels/websites/users
for the same one-time price.

## 2. What "tracked visitors" means

The 1M cap applies to anonymous traffic counted by `Click.js` on landing
pages and the "Any Page by URL" external tracker. Authenticated CRM
contacts are separately counted in the contacts limit.

## 3. Per-feature plan gates

- **Affiliate program** = T2+
- **Whitelabel** (remove IS branding from email templates) = T2+
- **Unlimited funnels** = T3
- **Unlimited team users** = T3 (top variant)
- **Enterprise 1:1 counseling** = paid custom tier above T3

## 4. Hitting a limit — what to do

| Limit hit | Symptom | Action |
|---|---|---|
| Contacts | Can't add new lead, API returns `error_code` | Run auto-clean (deliverability.md §4); enable `do-not-email` suppression on dormant tags; upgrade if needed |
| Emails/month | Sequence stalls mid-month | Audit volume in `Reports → Subscription Statistics`; reduce broadcast frequency or upgrade |
| Funnels | Can't create new funnel | Archive unused funnels (move to "Inactive" state); upgrade if you legitimately need more |
| Team users | Can't add new manager | Reuse existing manager assignment via `getpersonalmanagers` |

## 5. Support channels

### Tech Tuesday (weekly mentoring live call)
- **Host:** Sharice-Marie
- **Format:** can take over your screen via remote-share to fix technical
  setup issues directly
- **When:** Weekly (timer on Dashboard countdown to next call)
- **Use for:** DKIM/SPF/DMARC + FBL configuration, API key generation,
  custom-field collision debugging, sequence-trigger binding, anything UI

### Influencer Business First Class (strategy)
- Bonus tier mentoring (offered with higher LTD purchases)
- Format: 1-hour strategy call
- Use for: business model + funnel design + offer creation (not technical
  troubleshooting)

### Startup Checklist
- **Path:** Dashboard (main landing)
- 4-step mandatory walkthrough — prevents getting overwhelmed by 11 modules
- Re-runnable anytime — useful to verify setup is complete

### 15-minute Discovery Consult
- Offered to new users in first few weeks
- Format: introductory call
- Skip if you're past onboarding (Daniel is)

### Email support
- `support@influencersoft.com`
- Use for: API endpoint enablement (e.g. `AddGood` gating), billing,
  account issues
- Response time: business hours; not real-time

### Help portal
- `help.influencersoft.com`
- Separate sections for API 1.0 and API 2.0
- Use for: written reference; some articles are placeholders (skim before
  relying)

## 6. Escalation order (when to use what)

1. **Skill files first** — answer 95% of routine questions
2. **NotebookLM escape hatch** ([SKILL.md §9](SKILL.md)) — for edge cases
3. **help.influencersoft.com** — official written reference
4. **Tech Tuesday** — technical configuration issues
5. **support@influencersoft.com** — account / billing / endpoint gating
6. **Daniel asks Sharice-Marie directly** — relationship-based path for
   anything urgent

## 7. Renewal / upgrade

- LTD = lifetime; no recurring payment for the redeemed tier
- Upgrades available at AppSumo (if they re-list deal) or directly from IS
- "All upgrades at cost" benefit on Enterprise tier (rare)
```

- [ ] **Step 3: Verify file**

```bash
wc -l .claude/skills/influencersoft/plans-and-support.md
grep -nE 'TBD|TODO|FIXME|<DANIEL_TIER>' .claude/skills/influencersoft/plans-and-support.md || echo "clean"
```
Expected: ~70 lines, "clean". If `<DANIEL_TIER>` shows, the tier substitution was missed — fix.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/influencersoft/plans-and-support.md
git commit -m "feat(skills/is): add plans-and-support.md — tier spec + Tech Tuesday + escalation

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: Final integration check + skill-discovery dry run

**Files:**
- Read (verify only): all 8 files in `.claude/skills/influencersoft/`

- [ ] **Step 1: List all skill files**

```bash
ls -la .claude/skills/influencersoft/
```
Expected: 8 markdown files (SKILL.md, modules.md, api-quickref.md, gotchas.md,
ui-walkthrough.md, deliverability.md, reports-analytics.md, plans-and-support.md).

- [ ] **Step 2: Run integrated link check across all files**

```bash
echo "=== Sibling links (within skill folder) ==="
grep -rhoE '\([a-z-]+\.md\)' .claude/skills/influencersoft/*.md | \
  sort -u | sed 's|[()]||g' | \
  while read f; do
    [ -e ".claude/skills/influencersoft/$f" ] && echo "OK $f" || echo "MISS $f"
  done

echo ""
echo "=== Canonical-doc backlinks ==="
grep -rhoE '\(\.\./\.\./\.\.[^)]+\)' .claude/skills/influencersoft/*.md | \
  sort -u | sed 's|[()]||g; s|%20| |g' | \
  while read p; do
    actual=".claude/skills/influencersoft/$p"
    [ -e "$actual" ] && echo "OK $p" || echo "MISS $p"
  done
```
Expected: every line `OK`. If any `MISS`, fix the path in the offending file before final commit.

- [ ] **Step 3: Scan all files for residual placeholders**

```bash
grep -rnE 'TBD|TODO|FIXME|XXX|<DANIEL|<PLACEHOLDER' .claude/skills/influencersoft/ || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Verify SKILL.md frontmatter validity**

```bash
head -5 .claude/skills/influencersoft/SKILL.md
```
Expected output (exactly this shape):
```
---
name: influencersoft
description: Use when working with InfluencerSoft (kebron tenant) — ...
---

```

The frontmatter MUST be the first 3 lines, fenced by `---`, with `name` and
`description` fields. If different, Claude Code skill auto-discovery may fail.

- [ ] **Step 5: Skill-discovery dry run**

Run a smoke test by checking if the skill description matches expected
trigger phrases:

```bash
echo "=== Skill description ==="
sed -n '/^description:/,/^---/p' .claude/skills/influencersoft/SKILL.md | head -5

echo ""
echo "=== Expected trigger phrases ==="
for phrase in "InfluencerSoft" "IS sequence" "addupdatelead" "rpsKey" "kebron tenant" "Click.js" "FBL" "AppSumo LTD" "post-purchase-etsy-buyer"; do
  grep -i "$phrase" .claude/skills/influencersoft/SKILL.md > /dev/null && echo "  ✓ $phrase" || echo "  ✗ $phrase"
done
```
Expected: every phrase has a checkmark. If any miss, add to the description in SKILL.md.

- [ ] **Step 6: Word count sanity check**

```bash
wc -w .claude/skills/influencersoft/*.md
```
Expected ranges (rough):
- SKILL.md: 800–1500 words
- modules.md: 400–700 words
- api-quickref.md: 700–1100 words
- gotchas.md: 1000–1500 words
- ui-walkthrough.md: 800–1200 words
- deliverability.md: 500–800 words
- reports-analytics.md: 400–700 words
- plans-and-support.md: 500–800 words
- **Total:** 5000–8500 words

Significantly outside these = a file was truncated; investigate.

- [ ] **Step 7: Commit any final fixes (if Steps 2/3/4/5 surfaced issues)**

```bash
git status --short
# If there are changes:
git add .claude/skills/influencersoft/
git commit -m "fix(skills/is): final integration fixes from skill-discovery dry run

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
# If no changes: skip commit.
```

- [ ] **Step 8: Update todos**

Mark the implementation task complete via TodoWrite.

---

## Task 11: Manual end-to-end verification

This task requires Daniel to verify the skill works as designed. It's not
strictly required before merge, but recommended.

- [ ] **Step 1: Show Daniel the skill listing**

```bash
ls -la .claude/skills/influencersoft/
echo ""
echo "Lines per file:"
wc -l .claude/skills/influencersoft/*.md
```

- [ ] **Step 2: Daniel reads SKILL.md cold**

Ask Daniel to open `.claude/skills/influencersoft/SKILL.md` fresh and answer:

1. Is the decision tree (§2) clear about when to use API vs UI?
2. Are the canonical doc pointers (§1) the docs you'd reach for?
3. Are the top 5 gotchas (§5) the right ones to surface immediately?
4. Are the trigger phrases in the description (§8) ones a future-Claude would
   naturally hit?
5. Do the 7 supporting files (§7) cover everything you'd want documented?

- [ ] **Step 3: Optional — fire a test query in a new Claude session**

In a fresh Claude session, ask:
> "Can you tag a contact in InfluencerSoft as `customer:etsy`?"

Expected: Claude auto-discovers the `influencersoft` skill and answers using
the API quickref + tag-dictionary path — without re-querying memory or
notebook.

- [ ] **Step 4: Address feedback**

If Daniel surfaces gaps, edit the affected file(s) and commit:

```bash
git add .claude/skills/influencersoft/<file>.md
git commit -m "fix(skills/is): address Daniel's feedback on <topic>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

- [ ] **Step 5: Final summary to Daniel**

Report:
- Skill files committed: 8
- Total lines / words written
- Existing canonical docs referenced (no duplication)
- NotebookLM escape hatch documented
- Next: skill will auto-trigger on IS-related sessions

---

## Self-review notes (run before considering plan complete)

After writing the plan, the spec coverage check confirms:

- ✓ Hub-and-spoke architecture → Tasks 2–9 create exactly 8 files
- ✓ SKILL.md decision tree → Task 2 §2
- ✓ Canonical-doc index → Task 2 §1
- ✓ 11-module map → Task 3
- ✓ Funnel/page/template UI → Task 6
- ✓ API 2.0 + API 1.0 hash + Zapier → Task 4
- ✓ Webhook payload + Click.js → Task 4 §5–6
- ✓ Deliverability (DKIM/SPF/DMARC/FBL) → Task 7
- ✓ 30+ gotchas → Task 5 (33 total)
- ✓ 9 report types → Task 8
- ✓ AppSumo tier table → Task 9
- ✓ NotebookLM escape hatch → Task 2 §9
- ✓ Project conventions (tenant, tag rules, sequence order, custom fields) → Task 2 §6
- ✓ Verification at every step → embedded in each task
- ✓ Final integration check → Task 10

No placeholders detected. Type/path consistency verified across tasks.
Spec requirement "verify Daniel's tier" addressed in Task 9 Step 1.
