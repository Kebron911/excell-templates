# Phase 4 — Programmatic Template Pages — PLAN

**Status:** active · **Started:** 2026-05-06

## Goal
~100 message-template scenario pages live, each ranking for a specific long-tail "Airbnb [message-type] template for [scenario]" query. Sortable + filterable index page.

## Tasks

### Task 22 — `templates.json` data file
**Output:** `src/data/templates.json` — 100 entries, each:
```ts
{
  slug: string,             // url-friendly id, e.g. "late-checkout-request"
  category: 'booking' | 'pre-arrival' | 'mid-stay' | 'post-checkout' | 'issues',
  scenario: string,          // headline for the page
  audience: 'host' | 'guest',// who sends the message
  shortDescription: string,  // 1-line summary for index card
  primaryKeyword: string,    // SEO target
  template: string,          // the actual message template, with {{variables}}
  variables: string[],       // list of {{var}} names used in the template
  tone: 'warm' | 'firm' | 'neutral',
  whenToUse: string,         // 1–2 sentences of context
}
```
Generate ≥100 entries across 5 categories — bias to "issues" (refunds, complaints, broken items, late arrivals) and "pre-arrival" (highest search volume).

### Task 23 — `/templates/[scenario]` programmatic pages + 5 sample MDX
**Output:** Astro dynamic route at `src/pages/templates/[scenario].astro` that renders each entry from templates.json with:
- H1 = scenario
- Copy block: when to use, how to customize
- Code-styled template box (copy button)
- Variables list
- Related templates (3 from same category)
- JSON-LD WebPage + FAQPage
- Layout chrome + STRLedgerCTA

5 sample long-form MDX overlays at `src/content/templates/<slug>.mdx` for the highest-volume scenarios (late checkout, noise complaint, broken item, refund request, early arrival) — these augment the programmatic content with a 200-word personalized intro.

### Task 24 — `/templates/` index with sort + filter
**Output:** `src/pages/templates/index.astro` with:
- Filter chips by category + audience + tone
- Sort: alphabetical, by category, by recently added
- Card grid of all 100 entries (server-rendered, JS enhances filtering)
- Layout + AdSlot + STRLedgerCTA + EmailCaptureCard

## Acceptance criteria
- `pnpm typecheck` clean.
- Build produces 100+ static `/templates/<slug>` HTML files.
- Index page filters work without JS (server-rendered chips → query param links) AND with JS (instant filter).
- Each scenario page has unique title, meta description, JSON-LD.

## Out of scope
- Programmatic Pinterest pins per template (Phase 5).
- AI auto-customization of templates (Phase 3 — separate generator).
