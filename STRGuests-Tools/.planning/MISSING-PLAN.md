# MISSING — Implementation plan

**Status:** Blocking Phase 1 execution
**Detected:** 2026-05-05 during cluster `.planning/` scaffold

---

## What's missing

Unlike the other three sites in the STR cluster, strguests.tools has **no implementation plan**:

```
STRHost-Tools/docs/superpowers/plans/2026-05-05-strhost-tools.md       ✓ (29 tasks)
STRBuyers-Tools/docs/superpowers/plans/2026-05-05-strbuyers-tools.md   ✓ (36 tasks)
STROps-Tools/docs/superpowers/plans/2026-05-05-strops-tools.md         ✓ (36 tasks)
STRGuests-Tools/docs/superpowers/plans/2026-05-05-strguests-tools.md   ✗ MISSING
```

The design spec exists ([`docs/superpowers/specs/2026-05-05-strguests-tools-design.md`](../docs/superpowers/specs/2026-05-05-strguests-tools-design.md), 18 sections), but the task-by-task breakdown does not.

---

## Why this matters

Phase 1 requires a `phases/01-foundation/PLAN.md` that lists atomic tasks with file lists, code snippets, acceptance criteria, and TDD steps. The pattern is established in:

- [STRHost-Tools Phase 1 PLAN](../../STRHost-Tools/.planning/phases/01-foundation/PLAN.md)
- [STRBuyers-Tools Phase 1 PLAN](../../STRBuyers-Tools/.planning/phases/01-foundation/PLAN.md)
- [STROps-Tools Phase 1 PLAN](../../STROps-Tools/.planning/phases/01-foundation/PLAN.md)

Each of those Phase 1 PLANs cites verbatim sections of its source plan. Without a strguests plan, there's no source to cite — the executing agent has nothing concrete to follow for code, commit messages, or acceptance criteria.

---

## What needs to happen

Author `docs/superpowers/plans/2026-05-05-strguests-tools.md` following the same structure as the sibling plans. It should contain ~36–40 atomic tasks covering:

**Foundation (Phase 1, 9–10 tasks):**
1. Bootstrap pnpm workspace + Astro static + Express server (dual-target)
2. Brand tokens with hospitality-warm accent
3. Print stylesheet
4. Layout primitives (Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Layout)
5. Monetization primitives (AdSlot, EmailCaptureCard, STRLedgerCTA, **PdfDownloadButton, PinterestPinButton, AiRateLimitNotice**)
6. URL-state library (TDD)
7. Format library (TDD)
8. SEO library
9. PDF library base (brand header/footer)
10. Express server skeleton + MySQL pool + rate-limit table schema

**PDF generators (Phase 2, ~6 tasks):** house rules, welcome book, wifi sign, check-in, plus shared utilities

**AI generators + server (Phase 3, ~9 tasks):** OpenAI client, prompts, three endpoints, email verification flow, rate-limit middleware, three generator UIs

**Programmatic templates (Phase 4, ~5 tasks):** templates.json, [scenario].astro, /templates index, 5 sample MDX, sort/filter UI

**Pinterest + lead magnet + site pages (Phase 5, ~6 tasks):** pin generator, PinterestPinButton wiring, lead magnet, landing, about/contact, sitemap, OG images

**Analytics + E2E + CI/CD + deploy (Phase 6, ~6 tasks):** GA4 events, Playwright smokes, GitHub Actions CI, Hostinger deploys (static + Express), pre-launch smoke, v0.1.0 tag

---

## Recommended approach

1. **Read** [STRHost-Tools plan](../../STRHost-Tools/docs/superpowers/plans/2026-05-05-strhost-tools.md) and [STRBuyers-Tools plan](../../STRBuyers-Tools/docs/superpowers/plans/2026-05-05-strbuyers-tools.md) (the latter is closest in shape — also a dual-target deploy with both static and Express).
2. **Read** [strguests design spec §6](../docs/superpowers/specs/2026-05-05-strguests-tools-design.md) (project layout deltas) for file path specifics — `server/` directory, `lib/pdf/`, `lib/ai/prompts/`, etc.
3. **Author** the plan task-by-task with verbatim file paths, dependency lists, and inline code blocks (matching the sibling plan format).
4. **Resolve** before starting:
   - OpenAI API key allocation
   - MySQL availability on Hostinger Business (rate-limit + email-verification tables)
   - PDF co-branding default (open question 5)
5. **Update** [ROADMAP.md](ROADMAP.md) phase status from `blocked-on-plan` to `not-started`, fill in source-plan line numbers in [phases/01-foundation/PLAN.md](phases/01-foundation/PLAN.md) (which doesn't exist yet — author it after the source plan exists).

---

## Why this happened

Per session memory, the cluster's four design specs were authored in a single session (memory entries 286–290). The implementation plans were authored in a follow-up sweep (memory entries 309, 313, 345). strguests' plan was apparently skipped or deferred. The spec is comprehensive — the gap is purely the task breakdown layer.
