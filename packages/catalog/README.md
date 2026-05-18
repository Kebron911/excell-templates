# @str/catalog

**Single source of truth for every tool, page, and lead magnet across the STR empire.**

Part of the Tier S platform foundation (see `TIER-S-PLATFORM-PLAN.md` at the repo root).
Consumed by Astro sites, Pinforge, the catalog API, sitemaps, schema generators, and the upsell engine.

---

## What's in the box

- `src/schema.ts` — Zod schemas for `Site`, `Tool`, `Catalog`
- `src/events.ts` — locked `Ga4Event` enum (single source of truth for analytics event names)
- `src/loader.ts` — reads `data/`, validates everything, returns a `Catalog` object
- `src/cli/validate.ts` — `pnpm -F @str/catalog validate` — fails CI on schema violations
- `src/cli/emit.ts` — `pnpm -F @str/catalog emit` — writes `dist/emitted/{catalog,catalog.min,tools-by-site/*}.json`

## Data layout

```
data/
  sites.json                       # array of 8 sites
  tools/
    <site>/<slug>.json             # one file per tool
```

Tool id is always `<site>.<slug>` (e.g. `guests.house-rules-pdf`). The loader enforces this and refuses to start the build on collisions or unknown sites.

## Schema highlights

- `paidTier` — `free` | `lead-magnet` | `paid` | `pro`
- `status` — `shipped` | `beta` | `planned` | `deprecated`
- `ga4Event` — must come from the locked enum in `events.ts`. No drift across sites.
- `related[]` / `upsells[]` — references to other tool ids. Dead references log warnings (not errors) so planned tools can be authored before they're shipped.

## Usage from an Astro site

```ts
// astro.config.mjs or anywhere
import { loadCatalog, filterBySite } from '@str/catalog';

const { catalog } = loadCatalog();
const myTools = filterBySite(catalog, 'guests');
```

Or consume the emitted JSON at build time:

```ts
import full from '@str/catalog/../dist/emitted/catalog.json' assert { type: 'json' };
```

## Validation

```bash
pnpm -F @str/catalog build      # compile + emit
pnpm -F @str/catalog validate   # CI gate
pnpm -F @str/catalog test       # vitest
```

`validate` exits non-zero if:
- any tool fails schema validation
- duplicate tool ids exist
- duplicate slugs exist within the same site
- a tool's id doesn't equal `<site>.<slug>`
- a tool references an unknown site

It exits zero with warnings if a `related[]` or `upsells[]` reference points at a non-existent tool — useful while you're authoring planned-but-not-shipped tools.
