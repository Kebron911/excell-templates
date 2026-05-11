# Architecture Decision Records (ADRs)

One markdown file per non-trivial decision. Captures **why** something was chosen, not just what.

## Format

```
docs/decisions/YYYY-MM-DD-short-slug.md
```

Frontmatter:

```yaml
---
title: ADR — <short title>
status: proposed | accepted | superseded | deprecated
date: YYYY-MM-DD
deciders: <names>
related: <comma-separated paths>
---
```

Body covers: **Context** (what forced the decision) · **Decision** (what we chose) · **Why this is correct** (reasoning) · **Consequences** (positive/negative/neutral) · **Alternatives considered** · **Verification** (how we'll know it was right).

## Index

- [2026-05-11 — Traffic-first over acquisition-first](./2026-05-11-traffic-first-philosophy.md) — accepted

## When to write one

- A choice between architectures, vendors, or strategies
- A reversal of a prior decision
- A "this looks weird, why is it this way" answer for a future engineer or future-Daniel
- Anything you'd otherwise re-litigate every 6 months

## When NOT to write one

- Small CSS choices
- Routine implementation details
- Anything covered by an existing runbook or spec
