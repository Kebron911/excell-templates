# Env setup — one file, every project

## TL;DR

```bash
# First time on a fresh clone:
cp .env.example .env          # in the REPO ROOT, not a subproject
# fill in values
pnpm install                  # runs sync:env automatically
```

Then every subproject works. Done.

## How it works

```
        ┌────────────────────────────┐
        │ <repo-root>/.env           │   ← you edit ONLY this
        │   (gitignored)             │
        └────────────┬───────────────┘
                     │
                     │ pnpm sync:env  (auto on `pnpm install`)
                     ▼
        ┌────────────────────────────┐
        │ env.config.json            │   ← declares which keys
        │   (committed)              │     each project receives
        └────────────┬───────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ STRLaws/.env.local                      │
   │ STRGuests-Tools/.env.local              │   ← generated, gitignored
   │ STRBuyers-Tools/.env.local              │     DO NOT EDIT
   │ STRListingAudit-Tools/.env.local        │
   │ STRManuals/site/.env.local              │
   │ STROps-Tools/.env.local                 │
   │ tools/empire-console/.env.local         │
   └─────────────────────────────────────────┘
```

Each per-project `.env.local` is what Astro/Vite reads at build time and
what Node/Express scripts pick up via `dotenv/config`. The contents are
deterministic from root `.env` + `env.config.json`, so a `--check` flag is
available for CI:

```bash
pnpm sync:env:check   # exits 1 if any per-project file is out of date
```

## Key naming convention

- **Shared keys (one value reused across projects)** — no prefix.
  - `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `MYSQL_HOST`, `MYSQL_USER`,
    `MYSQL_PASSWORD`, `IP_HASH_SALT`, `RESEND_API_KEY`, etc.
- **Per-project keys (different value per project)** — prefixed with the project name.
  - `STRLAWS_MYSQL_DATABASE`, `STRLAWS_STRIPE_PRICE_ID_MONTHLY`,
    `STRGUESTS_PUBLIC_GA4_ID`, `STRLISTINGAUDIT_ADMIN_TOKEN`, etc.

`env.config.json` strips the project prefix when writing to each
per-project file, so application code can keep using simple names like
`process.env.MYSQL_DATABASE` and `import.meta.env.PUBLIC_GA4_ID`.

## Migrating from the old scattered setup

```bash
pnpm migrate:env:dry      # preview — no files changed
pnpm migrate:env          # actually merge existing per-project .env files
                          # into root .env (with prefix renaming).
                          # Originals get backed up to .env.backup-YYYYMMDD.
pnpm sync:env             # regenerate per-project .env.local files
                          # from the consolidated root .env
```

Verify each subproject still runs (`pnpm -F <project> dev`), then delete
the `.env.backup-*` files at your leisure.

## Adding a new key

1. Add it to **`.env.example`** at repo root with an empty value.
2. Add the value to your local **`.env`** (gitignored).
3. Add the appropriate entry to **`env.config.json`**:
   - `"include": ["MY_KEY"]` for a shared key
   - `"include": [{"from": "PROJECT_MY_KEY", "to": "MY_KEY"}]` if it's per-project
4. Run `pnpm sync:env`.

## Adding a new subproject

1. Add the directory to `pnpm-workspace.yaml`.
2. Add a `projects.<dir>` block to `env.config.json` listing the keys it needs.
3. In the subproject's entry point(s), add `import 'dotenv/config';`
   so Node/Express scripts pick up the generated `.env.local`. Astro reads
   `.env.local` automatically — no code change needed.
4. Run `pnpm sync:env`.

## Pre-commit safety

`scripts/check-env-leak.mjs` runs in pre-commit (installed by `pnpm install`
via `core.hooksPath=.githooks`). It blocks any commit that stages a real
`.env` / `.env.local` file. Templates ending in `.env.example` are allowed.

If you ever need to bypass it for a legitimate reason (e.g. you renamed
`foo.env` to `bar.env`), use `git commit --no-verify` — but check the diff
twice; the failure mode is leaking secrets to GitHub.

## Where each piece lives

| File | Purpose | Committed? |
|---|---|---|
| `.env` | Real secrets, one source of truth | **No** |
| `.env.example` | Documentation of every key | Yes |
| `env.config.json` | Maps root keys → per-project files | Yes |
| `scripts/sync-env.mjs` | Fan-out tool | Yes |
| `scripts/migrate-env-to-root.mjs` | One-time merger | Yes |
| `scripts/check-env-leak.mjs` | Pre-commit guard | Yes |
| `scripts/install-hooks.mjs` | Wires `core.hooksPath` to `.githooks` | Yes |
| `<project>/.env.local` | Generated per-project file | **No** |
| `<project>/.env.local.backup-*` | Migration leftovers | **No** |

## Disaster recovery

Root `.env` is the single point of failure. **Back it up to Vaultwarden** —
one entry, all keys. CREDENTIALS.md documents which Vaultwarden entry holds
what.

If a key leaks: rotate it at the provider, update root `.env`, run
`pnpm sync:env`, restart any running servers. No multi-file scavenger hunt.
