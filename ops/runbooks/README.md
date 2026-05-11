---
title: Runbook index
owner: Daniel
last_reviewed: 2026-05-10
cadence: quarterly
---

# Runbook index

Central index of every operational runbook in the empire. The empire console
(Maintain → Runbooks) reads this folder + `docs/runbooks/` and walks the
frontmatter `last_reviewed` to flag anything stale (>180 days).

## How to add a runbook

Drop a `.md` file in either `ops/runbooks/` or `docs/runbooks/` with this frontmatter:

```yaml
---
title: <human title>
owner: Daniel | <name> | TBD
last_reviewed: YYYY-MM-DD
cadence: monthly | quarterly | biannual | annual
---
```

Update `last_reviewed` whenever you actually review the doc. The n8n
`runbook-staleness` flow (weekly Mon 08:00) sends a P1 Telegram digest of
anything past 180d.

## Runbooks (existing)

- [Disaster recovery](../../docs/runbooks/disaster-recovery.md)
- [Template production process](../../docs/runbooks/template-production-process.md)
- [Weekly content atomization](../../docs/runbooks/weekly-content-atomization.md)
- [Cluster blog standard](../../docs/CLUSTER-BLOG-STANDARD.md)
- [Phase 0 Citation Sprints](./phase-0-citation-sprints.md) — weekend execution: 12–25 free dofollow citations
- [IndexNow Setup](./indexnow-setup.md) — one-time wiring of Bing/Yandex URL submission for W43

## Runbooks (planned per PROGRESS §P9.5)

- rollback-etsy-listing
- manual-post-purchase-fallback
- sales-tax-posture
- pinterest-ab-test
- sku-sunset
- postmortem-template
- data-rights-request
- etsy-review-tos-check
