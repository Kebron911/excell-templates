# strhost.tools — PROJECT

**Status:** Active
**Started:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster position:** Math (analyzing) — second stop in the four-site STR cluster

---

## Mission

Free-tools website for short-term rental hosts. SEO traffic → ad revenue (AdSense, finance-adjacent CPM) + soft funnel into The STR Ledger (Excel-Templates SKUs).

**Position:** "Free tools for short-term rental hosts."

**What this is not:** Not a SaaS. Not a blog-first property. Not a competitor to The STR Ledger.

---

## Locked decisions

These are ADR-equivalent and must not be re-litigated mid-execution. Source: [design spec §4](../docs/superpowers/specs/2026-05-05-strhost-tools-design.md).

<decisions>

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** | Programmatic routes for 50 state pages, Satori OG images, embed-widget portability later |
| 2 | Brand relationship | **Sister sub-brand of The STR Ledger** | Shared palette, Inter primary, Cormorant accent, JetBrains Mono numbers, co-branded footer |
| 3 | State tax data | **Hand-compiled JSON, state-level only, with disclaimer** | Honest, defensible, annual-review cadence; city/county deferred to Phase 2 |
| 4 | Embed widgets | **Defer to Phase 2** | Architect calculators as standalone islands so widget extraction is mechanical |
| 5 | Calculator UX | **Live updates + URL state + print** | Shareable, bookmarkable, indexable; SSR defaults so first paint is useful pre-JS |
| 6 | Monetization density | **Balanced** | One in-content ad, one footer ad, one inline email capture, one STR Ledger CTA. Zero popups, zero exit-intent, zero sticky ads |
| 7 | Deploy target | **Hostinger Business shared hosting** | Already provisioned. Cloudflare CDN bundled. FTP deploy via GitHub Actions |
| 8 | CSS approach | **Tailwind + tokens.css ported from Excel-Templates** | Token continuity with The STR Ledger; rapid component build |
| 9 | Test stack | **Vitest (unit) + Playwright (smoke)** | Calculator math is 100% pure-function unit-testable; one E2E per calculator |
| 10 | Package manager | **pnpm** | Workspace-friendly, fast, deterministic |

</decisions>

---

## Open questions (non-blocking for foundation)

| # | Question | Blocks |
|---|----------|--------|
| 1 | Domain — confirmed `strhost.tools`? | Phase 6 (deploy) |
| 2 | ESP — ConvertKit / Beehiiv / MailerLite / Mailchimp? | Phase 4 (lead-magnet wiring) |
| 3 | Analytics — GA4 only, or GA4 + Plausible? | Phase 5 (analytics) |

---

## Out of scope

- Mobile app
- User accounts, saved calculations, dashboards, charts
- Embed widgets (Phase 2 — post-launch)
- City/county-level tax overrides (Phase 2)
- Blog content beyond ~3 launch posts
- Real PDF lead magnet (stub at launch)
- Competing on head term "airbnb calculator" early

---

## Bridge to The STR Ledger

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)              [you are here]
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone
```

Mechanics: soft footer mention, contextual STR Ledger CTA per tool, email capture as the bridge, GA4 cross-domain, ClusterFunnelBlock on every page.

---

## Source documents

- **Design spec:** [`docs/superpowers/specs/2026-05-05-strhost-tools-design.md`](../docs/superpowers/specs/2026-05-05-strhost-tools-design.md) (16KB, 18 sections)
- **Implementation plan:** [`docs/superpowers/plans/2026-05-05-strhost-tools.md`](../docs/superpowers/plans/2026-05-05-strhost-tools.md) (120KB, 29 atomic tasks)

GSD `.planning/` is the execution layer; the source documents above are the design layer.
