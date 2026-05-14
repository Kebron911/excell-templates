# InfluencerSoft Skill — Design Spec

**Date:** 2026-05-13
**Status:** Approved (verbal, 2026-05-13)
**Author:** Claude (notebooklm + project synthesis)
**Approach:** C — hub-and-spoke skill that defers to existing canonical project docs

---

## Problem

InfluencerSoft (IS) is critical infrastructure for the STR Ledger revenue funnel:
5 operational scripts in `scripts/is-*.mjs`, 2 n8n workflows
(`STR_Etsy_Order_InfluencerSoft_Tagger`, `STR_Stripe_InfluencerSoft_Tagger`),
11 lifecycle/bundle sequences in flight, and a growing tag dictionary. IS knowledge
is currently scattered across:

- 4 canonical project docs (api-probe, manual-setup-guide, tag-dictionary, client lib)
- 27 NotebookLM sources (official docs, founder YouTube, AppSumo reviews)
- 18+ prior memory observations
- Tribal knowledge from 5 prior sessions on IS work

Every IS-touching session re-discovers this. The cost: wasted context, duplicate
questions to the user, and recurring near-miss decisions (wrong API version, wrong
tag string, wrong UI path) — especially around the 11-sequence paste that's
actively in flight.

## Goal

A discoverable Claude skill at `.claude/skills/influencersoft/` that:

1. **Triggers automatically** on IS-related tasks (skill auto-discovery)
2. **Encodes the decision tree** for "API vs UI vs n8n vs Zapier" routing
3. **Points to existing project docs** as the authoritative source — does not duplicate
4. **Adds the UI knowledge layer** (modules, screens, widgets, reports, deliverability tips, gotchas) that the existing docs lack
5. **Documents the NotebookLM escape hatch** for questions that fall outside the static content

## Non-goals

- Replacing or duplicating `ops/influencersoft-api-probe.md`, `infrastructure/influencersoft/tag-dictionary.md`, `ops/manual work/influencersoft-manual-setup-guide.md`, or `scripts/lib/influencersoft.mjs`
- Encoding tenant secrets (rpsKey, FBL mailbox creds) — those stay in `.env` + `CREDENTIALS.md`
- Building new IS automation scripts (that's separate work)
- Making the skill cross-workspace — this is project-local to Excel-Templates

## Architecture

Hub-and-spoke at `.claude/skills/influencersoft/`:

```
.claude/skills/influencersoft/
├── SKILL.md              # Entry — frontmatter, decision tree, pointers, escape hatch
├── modules.md            # 11-module map + every UI menu path
├── ui-walkthrough.md     # Page Builder widgets + funnel canvas blocks + template catalog
├── reports-analytics.md  # 9 report types + Campaigns analytics views
├── deliverability.md     # DKIM/SPF/DMARC/FBL + corporate-email requirement + auto-clean
├── gotchas.md            # 30+ tips/tricks/mistakes from founder interviews + 6mo review
├── plans-and-support.md  # AppSumo T1/T2/T3 spec table + Tech Tuesday + escalation paths
└── api-quickref.md       # API 2.0 cheat sheet + API 1.0 hash algorithm (links to api-probe.md)
```

Files NOT created (remain authoritative in their existing locations):

| Content | Lives at |
|---|---|
| API endpoint matrix + auth detail | `ops/influencersoft-api-probe.md` |
| Tag namespace + naming rules | `infrastructure/influencersoft/tag-dictionary.md` |
| Manual setup checklist + sequence paste order | `ops/manual work/influencersoft-manual-setup-guide.md` |
| Node.js API 2.0 client | `scripts/lib/influencersoft.mjs` |
| Hash-signed AddGood pusher | `infrastructure/influencersoft/push_products.js` |
| Operational scripts (add contact, tag events, e2e test, paste helper, probe) | `scripts/is-*.mjs` |
| Credentials | `CREDENTIALS.md` + `.env` |

## SKILL.md frontmatter

```yaml
---
name: influencersoft
description: Use when working with InfluencerSoft (kebron tenant) — adding or tagging contacts, pasting email sequences, configuring funnels, debugging email deliverability, integrating Etsy/Stripe orders, or making any IS API call. Covers API 1.0 + 2.0, all 11 modules, sequence trigger tags, and the full UI walkthrough. Triggers on: InfluencerSoft, IS sequence, addupdatelead, addtagtolead, rpsKey, kebron tenant, trigger tag, paste sequence, Click.js, evergreen webinar, FBL, sender domain, AppSumo LTD, post-purchase-etsy-buyer, bundle-cross.
---
```

## SKILL.md structure

1. **What InfluencerSoft is** (one paragraph, links to tenant + LTD context)
2. **Decision tree** — API vs UI vs n8n vs Zapier with concrete examples
3. **Canonical docs index** — table mapping topic → file (api-probe, tag-dictionary, manual-setup-guide, client lib)
4. **Module quick map** — 11-module table with menu paths (link to `modules.md` for detail)
5. **Common task recipes** — "Add an Etsy buyer", "Paste a sequence", "Probe lists/goods", "Run end-to-end test"
6. **Critical gotchas to surface immediately** — top 5 from `gotchas.md` (slug-collision, lesson-copy trap, FBL mailbox warning, sender confirmation, trigger-tag rename = silent break)
7. **Project-specific conventions** — tenant `kebron`, tag namespace rules, sequence paste order, custom field shortening
8. **When this skill applies** — explicit trigger list
9. **Deep research escape hatch** — NotebookLM notebook ID + `notebooklm ask` command for edge cases

## Supporting file contents (summary)

### `modules.md`
Table of all 11 modules with exact UI menu paths. Each module gets a one-paragraph "what you do here" + a link to the deeper section in `ui-walkthrough.md` if applicable.

Modules: Dashboard, Funnels, Contacts, Campaigns/Sequences, Process/Automation, Mailing Settings, Courses/LMS, Affiliates, Store/E-commerce, Webinars, Integrations/API. Plus secondary surfaces: Surveys, Reports, Website/Domain settings.

### `ui-walkthrough.md`
- Funnel canvas: block types (Pages, Forms, Actions, Traffic) with what each does
- Page Builder: widgets (Text, Video, Image, Button, Countdown, Opt-in/Order forms, Sections, Code, Interactive)
- Funnel template catalog: Simple Webinar, Free Book, Product Launch, Calendar Booking, Digital Summit, Evergreen Webinar, SLO
- A/B testing: 3 levels (funnel, page, email)
- Specific variables: `#upsell_yes`, `#upsell_no`, `#nextpage`
- Mobile editing pattern (copy sections, set Desktop/Mobile, reformat)
- Analytics toggle ("magic button"), Note action blocks, pencil shortcut

### `reports-analytics.md`
9 report types with menu paths and KPIs:
- Sales Funnel Analytics, Sales Statistics, Subscription Statistics
- Advertising Efficiency, Email/Sequence Analytics (Campaigns → Analytics)
- Affiliate Management, Course/Student Progress
- Sales Department Statistics, Expenses Import

### `deliverability.md`
- Corporate-email requirement (DMARC will reject Gmail/Yahoo senders)
- DKIM/SPF/DMARC setup pointer (high-level — IS support helps configure)
- FBL setup: brand-new mailbox required (existing mail gets wiped), Google Postmaster verification at `postmaster.google.com`, IMAP creds shared with IS support
- Sender confirmation: new sender emails are dead until link clicked
- Auto-clean: 15 emails / 45 days threshold
- vCard footer setting, spam-button setting
- IS multi-sender support (sales@ + support@ in one account)

### `gotchas.md`
Organized as a table. Each row: gotcha → why → how to apply.

Top items:
- Trigger-tag rename = silent break (sequences bind by string in UI)
- Custom-field slug collision + stale UI error state — refresh between adds
- Lesson "copy" is linked, not duplicated — edits propagate
- FBL mailbox must be new (or IS auto-deletes mail)
- PayPal integration is "wacky" — Stripe-first platform
- No "add to cart" — single-product funnels with upsells only
- GDPR delete = "zombie unknown" placeholder, not full purge
- Mobile editing requires copy-section trick (no toggle)
- Click.js script missing = silent affiliate tracking failure
- API 1.0 hash auth: `MD5(buildQuery(params)::username::apikey)` — PHP-compatible URL encoding required
- API 1.0 AddGood endpoint may return `error_code 2` (disabled per-account) — contact support to enable
- PascalCase endpoint names (lowercase 307-redirects)
- Tags case-sensitive, auto-create on first use
- Rate limit unknown — throttle to <1 req/sec (already in `scripts/lib/influencersoft.mjs`)

### `plans-and-support.md`
- AppSumo LTD tier comparison table (T1/T2/T3 specs)
- Daniel's current tier — to be confirmed during implementation by asking the user (`CREDENTIALS.md` doesn't track tier; only credentials)
- Tech Tuesday weekly call (Sharice-Marie, can screen-share)
- "Influencer Business First Class" — strategy mentoring (bonus tier)
- Startup Checklist on Dashboard
- 15-min discovery consult call
- Support email: support@influencersoft.com
- Help portal: help.influencersoft.com (separate API 1.0 and API 2.0 sections)

### `api-quickref.md`
- API 2.0 cheat sheet: rpsKey in POST body, PascalCase methods, `https://kebron.influencersoft.com/api/<Method>`, primary endpoints (AddUpdateLead, AddTagToLead, RemoveTagFromLead, GetAllGroups, GetGoods, GetCoupons, CreateOrder)
- API 1.0 hash algorithm: `MD5(buildQuery(params)::username::apikey)` with PHP `http_build_query()` compatible URL encoding
- Zapier triggers (Added to List, New Lead, New Order, New Purchase) + actions (Add/Update Lead, Add Tag, Create Order, Remove Lead From List, Remove Tag, Unsubscribe)
- Webhook payload field list (email, name, phone, UTM, billing, order metadata)
- Link to `ops/influencersoft-api-probe.md` for full endpoint matrix and gotchas

## Decision tree (in SKILL.md)

```
IS task arrives
│
├── Need to add/update/tag a contact?
│   ├── Already in n8n? → Use existing workflow, point at scripts/is-add-contact.mjs
│   ├── New programmatic call? → scripts/lib/influencersoft.mjs (API 2.0)
│   └── One-off manual? → IS UI: Contacts → Leads
│
├── Need to create/edit a sequence?
│   └── ALWAYS UI (no API). Use ops/manual work/influencersoft-manual-setup-guide.md paste order
│
├── Need to create/edit a funnel?
│   └── ALWAYS UI. See ui-walkthrough.md for canvas + page builder
│
├── Need to create a product?
│   ├── < 5 products → IS UI: Store → Products
│   └── Bulk (≥5) → infrastructure/influencersoft/push_products.js (API 1.0 hash auth)
│
├── Email deliverability issue?
│   └── See deliverability.md + Tech Tuesday escalation
│
├── Configure tracking/analytics?
│   └── HEAD code via Websites → Set up → More → Add HEAD code (see ui-walkthrough.md)
│
├── Webhook/external integration?
│   ├── Outbound → Zapier (see api-quickref.md for trigger list)
│   └── Inbound → POST to https://kebron.influencersoft.com/api/AddUpdateLead
│
└── Unknown edge case?
    └── Notebook escape hatch (see SKILL.md §9)
```

## Project-specific conventions encoded

1. **Tenant:** always `kebron.influencersoft.com` (set in `IS_TENANT` env var with default fallback)
2. **API version preference:** API 2.0 unless verb unavailable (only AddGood, AddLeadToGroup, DeleteSubscribe, DeleteOrder require 1.0)
3. **Tag namespace rules:** lowercase, colon for namespace, hyphen for words, never rename (per `tag-dictionary.md` §6)
4. **11-sequence paste order:** per `manual-setup-guide.md` Part 3 — Etsy post-purchase first
5. **Custom field shortening:** `sku_code/sku_label/bought_on/order_ref/xsell_name/xsell_url/pack_name` — never revert without full rename across copy + scripts
6. **Trigger tags are source of truth:** every tag a script writes MUST come from `tag-dictionary.md`
7. **Never log full POST bodies:** key leakage risk (already encoded in client lib)
8. **Rate limit:** 1100ms between calls (~0.9 req/s, already in client lib)

## NotebookLM escape hatch

Notebook ID: `2625477b-aa78-45b0-9ca6-6712d0d2d194`
Title: "InfluencerSoft: Complete Setup, Usage, Tips & Tricks"
27 sources, owner: Daniel.

Usage in SKILL.md:

```bash
notebooklm ask "your question" --notebook 2625477b-aa78-45b0-9ca6-6712d0d2d194
```

When to invoke:
- Skill files don't answer the question
- User mentions an IS feature not in this skill
- Need verbatim source quote (founder interview, official docs)
- Suspected IS UI change since 2026-04-28 snapshot date

## Success criteria

The skill is complete when:

1. A future Claude session matching any IS trigger phrase auto-discovers and invokes this skill
2. The skill answers "where do I tag a lead", "what's the trigger tag for X sequence", "how do I paste a sequence", "what's the API for Y", "why isn't my email landing" without re-querying memory or notebook
3. The skill correctly routes API vs UI vs n8n decisions for the most common 10 tasks
4. Existing canonical docs are referenced by relative path, not duplicated
5. The NotebookLM escape hatch works (notebook ID resolves, sample command runs)
6. A skim of SKILL.md by Daniel gives him an accurate mental model of what Claude knows about IS

## Out of scope (deferred)

- Auto-syncing skill content from notebook (would need a regen workflow — not worth it yet)
- Pre-built skill macros for "add Etsy buyer", "tag refund" (these are scripts already in `scripts/is-*.mjs`)
- Multi-tenant support (we have one tenant: kebron)
- Skill versioning / changelog (single-file edits via git suffice)
- Encoding all 30+ tips from `gotchas.md` into separate decision-tree branches (keep them as a reference list)

## Risks

- **Skill triggers too aggressively** — solved by specific phrase list in description
- **Skill drift from canonical docs** — mitigated by pointer-not-duplicate architecture
- **Notebook escape hatch fails** (auth expiry, notebook deleted) — fallback: skill files cover 95% standalone
- **IS ships UI changes** post-snapshot date — mitigated by NotebookLM update + Tech Tuesday escalation

## Implementation order

1. SKILL.md (entry + frontmatter + decision tree + escape hatch)
2. `modules.md` (foundation other files reference)
3. `api-quickref.md` (most-used reference)
4. `gotchas.md` (highest-value content)
5. `ui-walkthrough.md`
6. `deliverability.md`
7. `reports-analytics.md`
8. `plans-and-support.md`

Test by:
- Reading SKILL.md cold to verify decision tree clarity
- Running `notebooklm ask` from the escape hatch section
- Cross-checking every link to an existing project doc resolves
- Re-reading next session to verify auto-discovery works
