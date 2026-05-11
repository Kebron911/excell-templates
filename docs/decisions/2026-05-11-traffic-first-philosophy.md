---
title: ADR — Traffic-first over acquisition-first for new-brand off-page strategy
status: accepted
date: 2026-05-11
deciders: Daniel Harrison
related: docs/backlink-automation-plan.md · PROGRESS.md §P5.9 · infrastructure/n8n/workflows-map.md
---

# ADR — Traffic-first over acquisition-first

## Context

The initial backlink plan (early May 2026) was modeled on a mature-brand off-page playbook: anchor-drift monitoring, inbound-404 reclaim, Featured/Qwoted journalist responses, podcast tour, PMS partner pages. Tooling spec called for Ahrefs Standard ($500/mo) plus Featured Pro ($199/mo) plus Brand24 ($69/mo). Total monthly delta: $400–700.

Three things made that plan wrong for The STR Ledger at this stage:

1. **Budget reality.** Pre-revenue. Can't sustain $400–700/mo on speculative off-page work.
2. **Reputation gating.** Journalists vet Featured/Qwoted sources via Google before quoting. Empty SERP = ignored pitch. Podcast hosts vet guests via prior placements. Without 1–2 prior wins, no first wins.
3. **No equity to reclaim.** Inbound-404 reclaim, anchor-drift monitoring, and unlinked-mention reclaim all assume an established site with existing referring domains. A brand-new site has none of those. The workflows would sit idle for 6+ months.

Daniel pushed back on the initial framing with: "I need to get some juice to my site quick and if not with base SEO I was thinking linking for traffic — is my initial thought wrong altogether?"

## Decision

Adopt a **traffic-first, free-tools-only** off-page strategy for the new-brand stage. Defer the established-brand playbook with explicit reactivation triggers.

### What this means concretely

**Active now (Phase 4 — W41–W45 + Phase 0 sprints):**
- Free profile/directory citations (Crunchbase, LinkedIn, G2, etc.) — 12–25 dofollow links from one weekend of manual work
- Pinterest volume crank (already the site's natural traffic engine for the STR-host audience)
- Reddit/Quora helpful-answer cadence (Daniel posts manually; n8n surfaces the questions)
- IndexNow + GSC URL submit (every new page indexed in hours)
- Customer-embed loop (Day-21 ask to happy reviewers; pre-built badge)

**Cost ceiling:** $10–25/mo Claude API. Zero new vendors.

**Deferred (P5.7 in PROGRESS.md):**
- Direct link outreach
- Featured.com / Qwoted / Help A B2B Writer responder
- Founder podcast tour
- PMS partner page pursuit (Hospitable, OwnerRez, Hostfully)
- STR Tax Survey original-data study

**Reactivation triggers (any one):**
- MRR > $3k/mo
- 1–2 podcast appearances landed organically
- First original data study published (e.g. STR Tax Survey)
- 50+ active customers

## Why this is correct (the framing)

Daniel's "links for traffic" framing is partially right. The base playbook's framing — "build backlinks to lift rankings" — is **wrong** for the next 6–18 months for two reasons:

1. **Link authority compounds slowly.** A link from a DR70 page lifts rankings over 6–18 months. For a brand with 0 traffic today, that's 6–18 months of zero visits.
2. **Some links DO drive visits today** — but only when the **linking page itself has traffic**. A Reddit answer that gets 500 upvotes sends 1000+ visits next week. A pin that goes mildly viral on Pinterest sends 2000+ visits in a month. An Etsy listing description link (nofollow) sends warm buyers daily.

So the right question for new brands isn't "how do I get more backlinks?" It's "how do I show up where my buyer already is?" Sometimes that's a backlink. Often it's not.

| Activity | Visits in 30 days | Ranking lift in 18 months |
|----------|-------------------|--------------------------|
| Pinterest volume crank | High | Low (nofollow) |
| Reddit/Quora answers | Medium | Low (nofollow) |
| Etsy → site link bridge | High (warm buyers) | Zero (nofollow) |
| Profile citations | Low | Medium (dofollow but low-traffic source) |
| Featured/Qwoted placement | Medium | High (dofollow + high-DR) |
| Inbound 404 reclaim | Zero | High (but only if equity exists to reclaim) |

For a new brand: the top three activities dominate. The bottom three become available later.

## Consequences

### Positive
- Cost ceiling honored. $10–25/mo vs $400–700/mo.
- No reputation prerequisite. Every Phase 4 workflow runs on Day 1 of activation.
- Compounds with existing investments. W43/W44/W45 chain off existing W13/W15/W16 triggers.
- Honest. Plan stops pretending an empty Featured pitch will land.

### Negative
- Slower ranking lift in months 6–18 vs an aggressive-outreach plan.
- Deferred work means missing some Q1 2027 tax-season Featured queries (worth ~$0–4k revenue if 8+ tier-1 placements landed perfectly).
- Customer-embed loop only ramps once W13 has been running long enough to have Day-21+ reviewers (~Day 45 from first sale).
- Trust the triggers — if MRR hits $3k or first podcast lands, the deferred work must reactivate quickly. Otherwise momentum stalls.

### Neutral
- The deferred work still has shipped specs (W31–W36 documented in `docs/backlink-automation-plan.md`) and PROGRESS rows. Activation = remove deferred badge, no new design.

## Alternatives considered

1. **Spend $400–700/mo on the established-brand playbook anyway.** Rejected: budget reality, reputation gating, no equity yet.
2. **Skip backlinks entirely, focus only on paid acquisition.** Rejected: paid CVR on a new brand without organic credibility is poor; per-channel CAC math doesn't work below $500 ad spend/wk; long-term margin pressure.
3. **Hybrid — partial outreach with limited tools.** Considered. Risk: Featured.com Free-tier responders get bottom-ranked; effort > placement rate. Better to do zero outreach than half-hearted outreach that burns sender reputation.
4. **Build something custom for AI-citation tracking.** Rejected for now: no public APIs from ChatGPT/Perplexity/AIO; programmatic checks unstable. Monthly manual log (`ops/ai-visibility-log.md`) is sufficient until tooling stabilizes.

## Verification

This decision is correct if, by 90 days post-Phase-0:
- Pinterest organic visits ≥ 500/mo (was 0)
- Reddit/Quora answer-driven visits ≥ 50/mo (was 0)
- Permanent dofollow citations ≥ 15 (was 0)
- AI-citation log shows ≥ 1 query hitting a citation across the 4 tools (was 0)
- Total monthly cost still ≤ $50/mo

If those numbers don't materialize, revisit and consider:
- Adding cheap paid SEO tooling (Semrush Pro $140/mo over Ahrefs Standard $500/mo)
- Spinning up a manual-only Featured.com pitch cadence (no Pro tier, see what lands)
- Accelerating one of the reactivation triggers (e.g. produce the STR Tax Survey out of order to unlock founder PR earlier)

## References

- `docs/backlink-automation-plan.md` — the plan this ADR justifies
- `PROGRESS.md` §P5.9 — execution tracker
- `infrastructure/n8n/workflows-map.md` — registry of W41–W45
- `ops/runbooks/phase-0-citation-sprints.md` — manual weekend execution
- `ops/runbooks/indexnow-setup.md` — one-time setup
- `infrastructure/airtable/schema.md` — Tables 7–11 for Identity, Citations, Outreach Queue, Expert Library, Mentions
- `copy/outreach-templates/` — voice guide + locked templates for W34/W41/W45

## Iteration log

- `2026-05-11` — Decision recorded. Status: accepted.
