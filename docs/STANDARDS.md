# STR Ledger — code & content standards

Living reference for the conventions the empire-console drift detector
enforces. When you (or an AI agent) standardize code, point at this file:
following these rules means the dashboard stays in sync automatically.

The watchdog: `pnpm validate:drift` (run from `tools/empire-console/`) and
the `/maintain/drift` page. Both share `src/lib/data/drift.ts` — the rules
live in one place; update there to evolve the contract.

---

## 1. Atlas — every registry entry resolves

`ops/atlas.yaml` and `ops/atlas/sites/*.yaml` are the single source of
truth for "where everything lives." The dashboard renders them; CI fails
when they lie.

### Rules

- **`kind: yaml | doc | code | runbook`** entries must point at a file or
  directory that exists on disk, relative to the repo root. CI **fails**
  on miss.
- **`kind: internal`** entries must resolve to an Astro route under
  `tools/empire-console/src/pages/`. Enforced by `validate-atlas`.
- **`kind: external`** entries — URL not validated (we can't ping), but
  the field must be non-empty.
- **Aspirational entries** (file not yet built, link not yet live) must
  carry `status: placeholder`. The drift detector skips them and the UI
  greys them out.

### Per-site atlas yamls (`ops/atlas/sites/<site>.yaml`)

Required fields on `site:`:

| Field | Why |
|---|---|
| `id` | Stable identifier — Cmd+K palette, URLs, cross-refs |
| `name` | Human label everywhere |
| `role` | Place in the cluster (hub / sister / manuals) |
| `repo_path` | Where the code lives, trailing slash. Drift detector resolves it. |
| `domain` | For SSL + registrar cross-reference from `ops/infrastructure.yaml` |

Sections may use either shape:

```yaml
# Flat shorthand
- id: code
  label: Code
  items:
    - { name: src/, url: STRGuests-Tools/src/, kind: code }

# Grouped (matches root atlas.yaml)
- id: code
  label: Code
  groups:
    - label: Source
      items:
        - { name: src/, url: STRGuests-Tools/src/, kind: code }
```

The site-atlas reader normalizes both into the grouped shape at render
time. Use shorthand for short sections, grouped when sub-headings help.

---

## 2. SKUs — canonical metadata on every brief

`templates/_briefs/<SKU>-<slug>.md` is the source of truth for every
product. The catalog, kill-SKU, releases, and Etsy/own-site copy
generators all read these.

### Required frontmatter (markdown body, not YAML)

```markdown
# Brief — <SKU> · <title>

**Etsy price:** $27 (Lite — single workbook)
**Own-site price:** $47 (Full — workbook + howto.pdf + 6mo updates)
**Wave:** 3
**Tier:** T2
**Campaign tagline:** "Stop guessing on offers"
```

The drift detector flags any brief missing one or more of:
**Etsy price · Own-site price · Wave · Tier**. Missing all four → `bad`.
Missing some → `warn`.

These four fields are not optional: the catalog page renders them, and
the kill-SKU watch uses Wave + Tier to decide which underperformers to
flag faster. Drop them and downstream surfaces break silently.

### SKU naming

- ID format: `<CATEGORY>-<NNN>` where category ∈ `ACQ TAX FIN OPS PAM
  GST SAL REV LGL`, NNN is zero-padded.
- Brief filename: `<SKU>-<kebab-slug>.md` in `templates/_briefs/`.
- Delivery folder: `templates/_delivery/<SKU>-<kebab-slug>/` (matching slug).
- Listing copy: `copy/etsy-listings/<SKU>-<kebab-slug>.md` and
  `copy/product-pages/<SKU>-<kebab-slug>.md` — same filename as the brief.

Mismatched slugs between brief and delivery folder will leave the SKU
showing as `draft` in the catalog (because the manifest check can't pair
them).

---

## 3. SKU delivery — VERSION + release-notes

Every **live** SKU must have, in its `templates/_delivery/<SKU>-<slug>/`:

- `VERSION` — single-line file, e.g. `v1.0.0`. Drives the
  `/maintain/releases` page + the `release-shipped` n8n flow.
- `release-notes.md` — required before the **Ship update** button works.
  The release-shipped flow refuses to fire without it (avoids buyers
  getting an email update with no actual notes).

Plus the manifest-check requirements (enforced by
`templates/_build/manifest_check.py`):

- `<sku>-<slug>-blank.xlsx` — empty template
- `<sku>-<slug>-demo.xlsx` — example with data
- `<sku>-<slug>-howto.pdf` — instructions
- `<sku>-<slug>-license.pdf` — license terms
- `thumb-1.png` … `thumb-9.png` — Etsy gallery (at least 1)

The catalog page surfaces missing files per SKU; the drift detector
flags missing VERSION and missing release-notes separately.

---

## 4. n8n flows

Every flow JSON lives in `infrastructure/n8n/flows/` and is registered
in two places:

- `infrastructure/n8n/flows/README.md` — phase table
- `ops/atlas.yaml` → `n8n-flows` section

### Required flow shape

- `name` field matches the filename (without `.json`)
- `active: false` in the committed copy (Daniel flips active after import)
- `tags` includes `empire-console` plus the phase tag (`phase-1`, `phase-2`, etc.)
- Every cron + webhook flow ends in `→ telegram-router` for priority
  routing — direct `httpRequest` calls to Telegram bypass the priority
  band logic and break the alert log.
- Use `$('Node Name').first()` to pull from named upstream nodes, **not**
  positional `$input.all()[N]`. The latter is order-dependent and breaks
  on slow API branches.

### Webhook flow conventions

- Path matches flow name: `/webhook/<flow-name>`
- CORS header echoes `EMPIRE_CONSOLE_BASE_URL`
- Validate payload first → 400 on bad shape, before any side effect
- Implement `dryRun: true` where the action is irreversible. Console
  buttons hit dry-run first (a "Preview" UI), then prompt for confirm
  before firing the real action.

---

## 5. Ops sources of truth

YAML and NDJSON files under `ops/` are read by the dashboard. Convention:

- One topic per file (e.g. `ops/risks.yaml`, `ops/calendar.yaml`).
- Append-only logs use NDJSON (`ops/inbox.ndjson`, `ops/decisions.ndjson`,
  `ops/console-actions.ndjson`, `ops/release-tags.ndjson`, etc.).
- Cached external data goes to `ops/cache/<entity>.json` — git-ignored,
  n8n-written, Zod-validated by readers, zeroed when missing. Document
  the contract in `ops/cache/README.md` when adding a new cache file.

Every reader in `tools/empire-console/src/lib/data/<entity>.ts`:

- Uses Zod at the file boundary
- Tolerates the file being absent (returns empty/zeroed shape)
- Tolerates a malformed file (logs, returns empty)
- Has an entry in `scripts/validate-ops.ts`

Pages then assume readers always return a parseable result — no defensive
null-checks per render. If a reader crashes, the validator catches it in
CI before the page ships.

---

## 6. Standardization workflow

When refactoring or renaming:

1. Make the code change.
2. Run `pnpm validate` from `tools/empire-console/` (the full chain:
   typecheck → ops → atlas → drift).
3. The drift detector lists every atlas entry that no longer resolves.
4. Either restore the path, update the atlas, or mark
   `status: placeholder` if intentionally aspirational.
5. Re-run `pnpm validate` until clean.
6. Commit.

CI runs the same chain on every PR. A bad finding fails the build.

For broader sweeps:

- Use `pnpm validate:drift --strict` to fail on warnings too. Useful
  when "standardize all briefs" is a goal: strict mode surfaces every
  brief missing canonical fields in one shot.
- Review `/maintain/drift` periodically — the process bucket lists
  files touched recently that the registry points at, even when nothing
  is broken yet.

---

## 7. Adding a new standard

To codify a new rule the validator should enforce:

1. Add the check to `tools/empire-console/src/lib/data/drift.ts`
   (one of `checkStructural / checkConventions / checkProcess`).
2. Pick severity — `bad` for definite drift, `warn` for nags, `info` for
   "FYI, no action."
3. Document the rule in this file.
4. Run `pnpm validate:drift` — confirm the new rule catches what you
   meant, and doesn't cascade false-positives.
5. Commit both files together (rule + doc in lockstep).

The drift page surfaces every rule. There is no separate "lint config"
— the validator code IS the configuration. Keep `drift.ts` and this
file in sync; the drift detector itself doesn't yet check whether new
rules are documented here.
