# strguests.tools — PROJECT

**Status:** Active (planning incomplete — see [MISSING-PLAN.md](MISSING-PLAN.md))
**Started:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster position:** Guest XP (optimizing) — fourth stop in customer journey, **second** in build order

---

## Mission

Free generators for short-term rental hosts to produce guest-facing assets — house rules, welcome books, wifi signs, check-in instructions, listing descriptions (AI), review responses (AI), guest message templates (AI). Email capture is the primary conversion event; Pinterest is the primary distribution channel.

**Position:** "Free generators for short-term rental hosts."

**What this is not:** Not a SaaS. Not a guest-app / messaging platform. Not a competitor to Touch Stay or Hostfully — soft affiliate.

---

## Locked decisions

ADR-equivalent. Source: [design spec §4](../docs/superpowers/specs/2026-05-05-strguests-tools-design.md).

<decisions>

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x static + Node.js Express on Hostinger** | Static for tools 1–4 + content; Node.js handles AI tools 5–7 only. Both run on Hostinger Business |
| 2 | AI provider | **OpenAI GPT-4o-mini** | $0.15/$0.60 per 1M tokens; SDK: `openai` |
| 3 | PDF library | **`pdf-lib`** | Better layout control than jsPDF; multi-page support; client-side |
| 4 | Brand relationship | **Sister sub-brand, hospitality-warm palette** | Warmer accent (vs finance-trust blue, ops-utility green, editorial neutral) |
| 5 | Programmatic data | **`templates.json` (~100 message-template scenarios)** | Mirrors state/city/task pattern from sibling sites |
| 6 | Lead magnet model | **The PDF generator IS the lead magnet** | Soft email gate — PDF downloads anyway, email captures opportunistically |
| 7 | AI rate limit | **5/hr/IP without email; 50/day with verified email** | Prevents API cost runaway; converts free → email |
| 8 | Generator UX | **Live preview pane + download/copy actions** | Replaces "calculator UX" pattern from sibling sites |
| 9 | Pinterest infrastructure | **Per-output pin generation** | Reuse Excel-Templates' Pinterest UI kit; Pinterest is primary distribution channel |
| 10 | Deploy target | **Hostinger Business shared hosting** — *inherits from cluster* | Same as cluster |
| 11 | CSS / type / test stack | **Tailwind + tokens + Vitest + Playwright + pnpm** — *inherits from cluster* | Cluster parity |

</decisions>

---

## Cluster-shared contracts (inherited from strhost.tools)

These contracts are defined once in [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md) and inherited verbatim:

- **Per-tool page template** — canonical 12-element layout (R2). strguests extends with **Action buttons row** (Download PDF / Copy text / Generate Pinterest pin) immediately after the generator (#3 in spec) — net 13 elements.
- **Brand tokens** (R5) — palette, type stack, JetBrains Mono numerics. strguests swaps the accent to hospitality-warm; Cormorant Garamond gets more screen time (guidebooks suit serif).
- **Generator interaction model** — equivalent of strhost's calculator UX, but with **live preview pane** instead of inline result. URL state still encodes inputs.
- **Monetization primitives** (R6) — AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock. **strguests adds:** `<PdfDownloadButton />`, `<PinterestPinButton />`, `<AiRateLimitNotice />`.
- **SEO + analytics** (R7) — astro-seo, Satori OG, sitemap, JSON-LD builders, GA4 cross-domain.
- **Build, CI, deploy** (R8) — extended to deploy a Node.js Express app on Hostinger Apps for the AI endpoints (Phase 4).

---

## Open questions (non-blocking for foundation)

| # | Question | Blocks |
|---|----------|--------|
| 1 | Domain — confirmed `strguests.tools`? | deploy phase |
| 2 | ESP — same as strhost.tools? | lead-magnet wiring |
| 3 | OpenAI API key allocation — single key for cluster or per-site? | AI tools (5–7) |
| 4 | MySQL for rate-limit + email verification — Hostinger-bundled? | AI tools (5–7) |
| 5 | Co-branding default on PDFs — "Powered by strguests.tools" footer on by default? | PDF tools (1–4) |
| 6 | Pinterest — single account or per-site? | distribution |

---

## Out of scope (Phase 2+)

- Native mobile app
- Guest-side accounts (this site is host-side only)
- Real-time AI streaming (single-shot generations only at launch)
- Translation (English only at launch)
- Voice / video generation

---

## Bridge to The STR Ledger

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)              [you are here]
thestrledger.com → Financial backbone (every stage)
```

Guest-XP cluster CTAs lean toward "Welcome Book" SKU + guest-comms templates in The STR Ledger.

---

## Source documents

- **Design spec:** [`docs/superpowers/specs/2026-05-05-strguests-tools-design.md`](../docs/superpowers/specs/2026-05-05-strguests-tools-design.md) (18 sections)
- **Implementation plan:** **MISSING** — see [MISSING-PLAN.md](MISSING-PLAN.md). Plan must be authored before Phase 1 execution begins.
- **Cluster reference:** [`STRHost-Tools/.planning/`](../../STRHost-Tools/.planning/) for shared contracts; [`STROps-Tools/.planning/`](../../STROps-Tools/.planning/) for PDF-library precedent
