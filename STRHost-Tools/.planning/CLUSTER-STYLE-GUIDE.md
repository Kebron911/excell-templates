# STR Cluster — Style + Layout Guide

**Status:** Locked. Established by strhost.tools Phase 1 build (2026-05-06).
**Scope:** strhost.tools, strbuyers.tools, strops.tools, strguests.tools.
**Source of truth for UX patterns across the four-site cluster.**

When you build a sibling site (or any new page in this cluster), follow this guide verbatim except for the per-site accent color. Anything not specified here defers to [STRHost-Tools/.planning/REQUIREMENTS.md](REQUIREMENTS.md).

---

## 1. Wordmark

Pattern: **{Brand Name}**·*{tld}*

- **Brand name** is the main weight: Cormorant Garamond medium, sized 28px at md / 40px at lg / 20px at sm. Color: **gold** (read-first; gold-deep on parchment, gold on navy).
- **`.tld`** is the small trailing descriptor: 12px uppercase letterspaced (0.28em) sans-serif, gold period followed by lowercase tld word in muted ink/parchment.
- Trailing period in gold preserves the brand period-as-accent pattern.

Per-site:
| Site | Brand | Tld | Render |
|---|---|---|---|
| strhost.tools | STR Host | tools | **STR Host**·*tools* |
| strbuyers.tools | STR Buyers | tools | **STR Buyers**·*tools* |
| strops.tools | STR Ops | tools | **STR Ops**·*tools* |
| strguests.tools | STR Guests | tools | **STR Guests**·*tools* |

**Implementation:** copy [`STRHost-Tools/src/components/chrome/Wordmark.astro`](../src/components/chrome/Wordmark.astro) verbatim. Change only the brand name string. Same `size` / `theme` / `asLink` props.

**Rejected variants** (don't reintroduce):
- "STR" tiny eyebrow + "Host Tools" main → inverts brand identity. Brand is the persona name, not the descriptor.
- Plain `strhost.tools` text → reads as a domain string, not a wordmark. Looks unfinished.

---

## 2. Brand colors per site

Tokens are shared verbatim. Only the **accent palette** swaps. Editorial-neutral lives in strhost; siblings override `--brand-gold` / `--brand-clay` / `--accent-*` tokens but inherit everything else (parchment surfaces, navy ink, type stack, spacing, radii, shadows).

| Site | Accent character | Suggested HEX (refine in Task 2) |
|---|---|---|
| strhost.tools | Editorial gold (no override) | gold #C9A24B / clay #B5725E |
| strbuyers.tools | Finance-trust deeper blue | accent-500 ~ #2A5587 |
| strops.tools | Ops-utility green-gray | accent-500 ~ #5A7359 |
| strguests.tools | Hospitality-warm terracotta | accent-500 ~ #C97D5C |

The wordmark always uses the site's accent for "{Brand Name}" — so STR Buyers reads in finance-trust blue, STR Ops in ops-utility green, STR Guests in hospitality-warm terracotta, STR Host in editorial gold. This is the single most important brand differentiator across the cluster.

---

## 3. Header — primary cross-tool nav

Pattern: **all tools visible inline at lg+; hamburger menu below lg.**

Reasons:
- Once a visitor is on a tool page, the header is their cross-nav back to the other tools. Hiding tools behind a "Calculators ▾" disclosure adds a click for no gain.
- 7 tools + Blog fits on a 1024px+ display when nav labels are compact (4–10 chars).

Implementation rules:
- **Compact nav labels.** Don't reuse `tools.json` `shortName` if it's longer than ~10 chars. Use a `navLabels` map in Header.astro keyed by tool id (see [strhost Header.astro](../src/components/chrome/Header.astro)).
- **Breakpoint is `lg:` (1024px).** Below that, the disclosure menu shows full `shortName` for each tool.
- **Order matches `tools.json` file order.** Don't sort or feature-promote in nav — visual stability across pages matters.
- **Wordmark is `shrink-0`** so the nav reflows without truncating the brand.

**Rejected variants:**
- "Calculators ▾" hover dropdown → adds friction, hides discoverability.
- Showing only 3-4 "featured" tools + "More" → user feedback explicitly called this out as broken UX. *(Why we know: this was the first build of the strhost header and got immediate negative feedback.)*

---

## 4. Landing page — friction-reduced tool picker

Pattern: **hero → tool grid → cluster funnel → footer.** No sidebar. No duplicates.

Layout:
1. **Hero (one screen, short).** Cormorant H1 with gold period, single Inter lede paragraph (~2 sentences), one implicit CTA: "Pick one below." No sample-numerics decoration. No secondary buttons. The hero exists to confirm "you're in the right place," nothing more.
2. **Tool picker grid.** 3 columns at lg, 2 at sm, 1 below sm. Cards show: serif headline (shortName), small ink-2 tagline (one sentence), gold-deep "Open →" affordance with hover micro-translate. Whole card is the link. Border shifts to gold on hover. All N tools visible; the page IS the menu.
3. **ClusterFunnelBlock** (cross-cluster) immediately follows. Hides self-link.
4. **Footer + FunnelBand.**

**Rejected variants:**
- Sidebar of "related calculators" duplicating the tool grid → user feedback called this out as duplicate. The sidebar is for *tool pages* (where its job is cross-nav back to siblings), not for the landing where the grid IS the nav.
- Multi-section landing with case studies / testimonials / featured calculator → friction. Goal is "land → click → use → leave," not "scroll → discover → maybe click."
- Hero with multiple CTAs → choice paralysis. The hero has zero buttons; the grid below has the click affordance.

---

## 5. Sidebar — tool pages only

The Sidebar component (related-calculators rail) is ONLY rendered on individual calculator/tool pages, never on the landing or content pages.

On a tool page:
- Renders to the right of the calculator on lg+, collapses below lg.
- Filters out the current tool from the list (`current` prop).
- 6 cards. Hover: gold border + card shadow.

On the landing page:
- Do not render. The landing's tool grid is the navigation. Adding a sidebar duplicates content.

---

## 6. Phase 1 verification preview

The throwaway landing renders chrome + monetization primitives so the dev can spot-check Phase 1 work. To keep this from polluting visual review:

- **Collapse the verification preview into a `<details>` element** at the bottom of the landing.
- Label its summary: `<span class="label text-gold-deep">Phase 1 preview</span> Show monetization primitives (...)`.
- Contains: AdSlot (in-content) + EmailCaptureCard + STRLedgerCTA + AdSlot (footer).
- Removed entirely when Phase 4 ships the real landing page.

---

## 7. Type rhythm

Universal across all four cluster sites:
- **Cormorant Garamond medium** for H1, H2, H3, tool card headlines, calculator-result labels.
- **Inter** for body, lede, nav, button labels, ui copy.
- **Inter Tight Semibold** is the wordmark fallback if Cormorant fails to load — though Cormorant is the default per spec §11.
- **JetBrains Mono with `font-variant-numeric: tabular-nums`** for every number on every page: calculator inputs, calculator outputs, currency, percent, last-updated dates.

Letter-spacing pattern:
- Wordmark `.tld` part: 0.28em
- Eyebrow labels (`.label`, `.eyebrow`): 0.20em
- SKU codes (when shown): 0.22em

Headings have `text-wrap: balance`. Body has `text-wrap: pretty`. Numbers have `tabular-nums`.

---

## 8. Hover and focus states

- **Cards** (tool grid, sidebar, cluster funnel): border-color shifts from `rule` to `gold`. `shadow-card` appears. 200ms `cubic-bezier(0.2, 0.6, 0.2, 1)` ease.
- **Affordance arrows** (`Open →`, `Visit →`): translate-x by 0.5 on group-hover. Color shifts gold-deep → gold.
- **Nav links** (Header, Footer): color shifts ink-2 → navy (or parchment-soft → gold on inverse surfaces). 200ms.
- **Focus rings:** `shadow-focus` (0 0 0 3px rgba(201, 162, 75, 0.45)). Applied via `focus:outline-none focus:shadow-focus` on every interactive element.
- **No transforms larger than translate-x 0.5.** No scale-up hover. No bouncy spring eases. Editorial brand = restrained motion.

---

## 9. Print discipline

`@media print` hides all chrome and monetization, keeps inputs + results. See [strhost print.css](../src/styles/print.css). Replicate verbatim per sibling site (Task 3 in each phase plan). Mono numerics stay tabular for printed alignment. URL annotations on external links so paper-printed pages remain navigable.

---

## 10. Cross-platform Vite/Astro path alias

**Bug bait, learned the hard way.** When configuring the `@/*` path alias in `vitest.config.ts` and `astro.config.mjs`:

```ts
// WRONG — produces /C:/Users/... on Windows, breaks module resolution
alias: { '@': new URL('./src', import.meta.url).pathname }

// RIGHT — fileURLToPath converts to native OS path
import { fileURLToPath } from 'node:url';
alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
```

Apply both fixes when scaffolding any sibling site. (Reference: strhost.tools commit `af20c20`.)

---

## 11. Astro lint quietude

- Any `<script type="application/ld+json">` should be `is:inline` (it's already JSON, no processing needed).
- Any external script with `async`/`src` attribute (e.g., AdSense bootstrap) should be `is:inline`.
- Unused destructured keys → use `_key` prefix to silence `ts(6133)`.

---

## 12. Friction discipline (the meta-rule)

> **"Land → click → use → leave."** That's the visitor flow.

Anything that adds a step between landing and using a tool is suspect:
- Hunt-for-tool nav patterns (dropdowns hiding the menu)
- Duplicate navigation surfaces (sidebar + grid)
- Hero CTAs that aren't the tool grid itself
- Email gates before the tool works
- Modal interrupts on first paint
- "Featured tools" sections that hide the rest

The visitor came from Google searching for a specific calculator. They want THAT calculator. Show them all the calculators if they landed on the home page; show them THE calculator if they landed deep. Either way, no friction.

This rule supersedes any conflicting design instinct. If you find yourself adding a step "to make it feel more polished," delete the step. The polish is in restraint.

---

## Source: where these decisions came from

This guide is the codification of strhost.tools Phase 1 build feedback.

- Initial header showed only 4 tools; user feedback called it broken (✓ fixed: all 7 inline at lg)
- Initial landing duplicated the tool grid in a sidebar; user feedback called it duplicate (✓ fixed: sidebar removed from landing, kept on tool pages)
- Initial wordmark was plain "strhost.tools" text; user feedback called it ugly (✓ fixed: stylized "STR Host"·*tools* with gold lead)
- Initial wordmark put "Host Tools" as the main weight with "STR" as eyebrow; user feedback called the hierarchy backward (✓ fixed: "STR Host" main, ".tools" trailing)
- "STR Host" rendered in navy; user feedback asked for gold (✓ fixed: gold-deep on parchment, gold on navy)

Each fix is in the strhost.tools git history. Don't re-litigate these in the sibling builds.
