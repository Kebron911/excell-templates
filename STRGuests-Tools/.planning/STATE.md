# STATE

**Current phase:** 1 — Foundation
**Current task:** Not yet started (Task 1: Bootstrap dual-target repo)
**Last update:** 2026-05-05

---

## Phase 1 progress

- [ ] Task 1 — Bootstrap dual-target repo (Astro static + Express)
- [ ] Task 2 — Brand tokens with hospitality-warm accent
- [ ] Task 3 — Print stylesheet
- [ ] Task 4 — Layout primitives
- [ ] Task 5 — Monetization primitives (incl. PdfDownloadButton, PinterestPinButton, AiRateLimitNotice)
- [ ] Task 6 — URL-state library (TDD)
- [ ] Task 7 — Format library (TDD)
- [ ] Task 8 — SEO library
- [ ] Task 9 — PDF library base (brand header/footer)
- [ ] Task 10 — Express server skeleton + MySQL pool + schema migration

---

## Decisions log (this run)

_None yet._

## Deviations log

_None yet._

## Open questions blocking current work

Some Phase 1 work can proceed without these answers, but they will block before Phase 1 completion or Phase 3 start:

- **OpenAI API key** — needed to test Task 16 against the real API. Stub-only OK for development; must resolve before Phase 3.
- **MySQL on Hostinger Business** — Task 10 schema migration needs a real DB or local stub. Must confirm Hostinger Business supports MySQL with sufficient connection pool before Phase 3 server deploy.

## Cluster sequencing

Per the strategic build order: strhost.tools first, **strguests.tools second** (fastest to ship, social distribution, low competition), strops.tools third, strbuyers.tools fourth.
