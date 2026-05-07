# Per-state narrative MDX

Each `<state-code>.mdx` file provides hand-written narrative for a state's
lodging-tax rules. The dynamic page at `src/pages/lodging-tax/[state].astro`
uses the MDX content when present; otherwise it falls back to the auto-generated
template driven by `src/data/lodging-tax-by-state.json`.

## Frontmatter shape

```yaml
---
code: tx                                 # USPS lowercase code, must match filename
title: Texas Lodging Tax — How It Works for STR Hosts
description: Plain-English breakdown for hosts (~140 char)
---
```

## Body structure

The TX file is the canonical example. Pattern is:

1. **How {state} lodging tax works** — state rate, layers, common stacks (3–5 markets)
2. **Platform collection** — what Airbnb/Vrbo handle, what they don't
3. **What this means in practice** — actionable guidance, exceptions, edge cases
4. **How to use the calculator above** — 3 steps mapped to local add-on rates
5. *Source citation + verification date + "not tax advice" disclaimer*

Target ~400–500 words. Use specific city/county tax stacks where the markets
matter (top 5 STR cities in the state). Cite the state DOR.

## Adding a new state

1. Copy `tx.mdx` as `<code>.mdx`.
2. Update frontmatter (`code`, `title`, `description`).
3. Replace body with state-specific tax structure, common stacks, platform notes.
4. Update the source URL and verification date.
5. The `[state].astro` page automatically picks it up — no other wiring needed.

## Currently authored

- `tx.mdx` — Texas (canonical example)
- `ca.mdx` — California (no state tax, all local)
- `fl.mdx` — Florida (state + surtax + TDT stack)
- `ny.mdx` — New York (NYC special case + Local Law 18 warning)
- `co.mdx` — Colorado (resort town LMD complexity)

The remaining 45 states + DC fall back to the auto-generated template until
manually authored. Priority order for filling in: highest STR-volume states
(GA, NC, AZ, TN, NV, OR, WA, MA) → resort markets (UT, ID, ME, VT) → rest.
