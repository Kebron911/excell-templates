---
title: AI search visibility manual log
owner: Daniel
last_reviewed: 2026-05-11
cadence: monthly
---

# AI Search Visibility — Monthly Spot-Check Log

Referenced from `tools/empire-console/src/pages/check/seo.astro`. Programmatic checks against ChatGPT Search / Perplexity / Google AI Overviews are unstable and rate-limited, so we run a 15-minute manual sweep on the **first Monday of each month** to track where The STR Ledger appears in AI-generated answers.

## Why this matters

Per the off-page playbook in [docs/backlink-automation-plan.md](../docs/backlink-automation-plan.md), AI search has become a parallel ranking surface. A site that's cited by ChatGPT/Perplexity/AIO for STR-tax queries earns:
- Direct referral visits (small but compounding)
- Branded-search lift (people see "The STR Ledger" in an AIO and Google us next)
- Entity recognition for Google's knowledge graph

This is the only way to track that surface today.

## Cadence

- **First Monday of every month** — run the full sweep
- **After every Featured/Qwoted placement** — re-query the 3 queries closest to the article topic; check if our placement bumped citation likelihood
- **After a major Google algorithm update** — re-run all queries; trends shift

## Query bank

Use these exact queries each month (consistency > coverage for trend tracking):

### Tax cluster
- [ ] "best Excel templates for Airbnb tax"
- [ ] "Schedule E vs C Airbnb"
- [ ] "14-day rule short term rental tax"
- [ ] "STR cost segregation"
- [ ] "Airbnb bookkeeping spreadsheet"

### Operations cluster
- [ ] "Airbnb cleaning checklist template"
- [ ] "STR turnover spreadsheet"
- [ ] "Airbnb welcome book template"

### Comparison / branded
- [ ] "STR Ledger vs Hospitable"
- [ ] "best STR financial tools 2026"
- [ ] "The STR Ledger" (branded — should hit our site)

## How to run

For each tool, paste the query, screenshot the answer, record:

| Tool | Cite us by name? | Link to thestrledger.com? | Position in answer | Snippet (3–5 words) |
|------|-----------------|-------------------------|-------------------|--------------------|
| **ChatGPT** (chat.openai.com, ChatGPT-5 with search) | y/n | y/n | 1 / 2 / 3 / "in list" / not | "..." |
| **Perplexity** (perplexity.ai, free tier) | y/n | y/n | 1 / 2 / 3 / "in list" / not | "..." |
| **Google AI Overview** (search query → AIO block) | y/n | y/n | 1 / 2 / 3 / "in list" / not | "..." |
| **Claude.ai** (with web search) | y/n | y/n | 1 / 2 / 3 / "in list" / not | "..." |

## Log

### 2026-05-XX (template — replace XX with first Monday)

| Query | ChatGPT | Perplexity | AIO | Claude |
|-------|---------|------------|-----|--------|
| best Excel templates for Airbnb tax | n | n | n | n |
| Schedule E vs C Airbnb | n | n | n | n |
| 14-day rule short term rental tax | n | n | n | n |
| STR cost segregation | n | n | n | n |
| Airbnb bookkeeping spreadsheet | n | n | n | n |
| Airbnb cleaning checklist template | n | n | n | n |
| STR turnover spreadsheet | n | n | n | n |
| Airbnb welcome book template | n | n | n | n |
| STR Ledger vs Hospitable | n | n | n | n |
| best STR financial tools 2026 | n | n | n | n |
| The STR Ledger (branded) | n | n | n | n |

**Observations:** (write 1–3 sentences)
- _Brand isn't established enough yet for AI-citation; expected per the new-brand-stage plan._
- _Will start seeing hits 3–6 months after first content cluster publishes + first 5–10 podcast / Featured placements land._
- _Track the trend, not the absolute level._

**Actions:**
- _none this month — Phase 0 + Phase 4 workflows still ramping._

---

### Trend log (one row per month)

| Month | Total cite-hits across 11 queries × 4 tools (max 44) | YoY change | Notes |
|-------|----|----|----|
| 2026-05 | 0 / 44 | — | baseline |
| (future entries) | | | |

## Anti-patterns

- ❌ Querying mid-week and acting on the result — these tools' answers shift across days; only the first-Monday timestamp is comparable
- ❌ Skipping a month "because nothing's changed" — trend visibility only works with consistent data
- ❌ Adding more queries over time — locks the comparison broken. To add a query, start a new "v2" log block.
- ❌ Trying to game it — adversarial prompting to force a citation is detected by all 4 tools and may hurt trust signals long-term

## Iteration log

- `2026-05-11` — Initial log template. 11-query bank locked for trend comparison.
