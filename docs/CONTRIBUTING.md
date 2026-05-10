# Contributing — STR Cluster

This monorepo holds five projects that share branding, audience, and operational backbone:

| Folder | Site | Lifecycle stage |
|---|---|---|
| [STRBuyers-Tools/](../STRBuyers-Tools/) | strbuyers.tools | Acquisition (pre-buy) |
| [STRHost-Tools/](../STRHost-Tools/) | strhost.tools | Analysis (math) |
| [STROps-Tools/](../STROps-Tools/) | strops.tools | Operations (running) |
| [STRGuests-Tools/](../STRGuests-Tools/) | strguests.tools | Guest XP (optimizing) |
| (root + `templates/`) | thestrledger.com | Financial backbone (every stage) |

Each STR tool is an independent Astro project today; the monorepo declarations at the root ([package.json](../package.json), [pnpm-workspace.yaml](../pnpm-workspace.yaml)) are stubs for future consolidation.

---

## Prerequisites

- **Node** ≥ 20
- **pnpm** ≥ 9.6 (STROps-Tools currently pins pnpm@10.0.0 — this skew is tracked and will be unified before workspace mode is enabled)
- **Git** with OpenSSH (for Hostinger SFTP deploys; see [infrastructure/secrets-inventory.md](../infrastructure/secrets-inventory.md))

---

## Working on a single tool

```bash
cd STRGuests-Tools          # or STRBuyers-Tools, STRHost-Tools, STROps-Tools
cp .env.example .env        # then fill in values from Vaultwarden
pnpm install
pnpm dev                    # http://localhost:4321
```

Every tool exposes the same script surface:

| Script | Purpose |
|---|---|
| `pnpm dev` | Astro dev server |
| `pnpm build` | Production build to `dist/` (plus OG/pin/magnet scripts where applicable) |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm test` | Vitest unit tests |
| `pnpm typecheck` | `astro check` + `tsc --noEmit` |
| `pnpm e2e` | Playwright smoke tests |
| `pnpm lint` | ESLint (placeholder in STROps-Tools — see [Known issues](#known-issues)) |

Server-side tools (currently STRGuests + STRBuyers) also expose `pnpm server:dev` / `pnpm server:build` / `pnpm server:start` and a `pnpm migrate` / `pnpm db:migrate` script.

---

## Working across multiple tools

Root-level convenience scripts (run from repo root):

```bash
pnpm all:install            # install deps in every tool
pnpm all:typecheck          # typecheck every tool
pnpm all:test               # vitest run in every tool
pnpm all:build              # production build of every tool

pnpm buyers:dev             # ergonomic shortcut to `pnpm --dir STRBuyers-Tools dev`
pnpm guests:build           # ...etc per tool
```

**Do not run `pnpm install` from the repo root** until the workspace stub in [pnpm-workspace.yaml](../pnpm-workspace.yaml) is uncommented. The four per-tool lockfiles are intentionally separate while Astro versions diverge.

---

## How to add a new tool

The fastest path is to copy the most-similar existing tool. Pick by similarity:

- **Static calculator site, no server, no PDFs** → copy STRHost-Tools
- **Static site with PDF generators + email gate** → copy STRGuests-Tools (or STROps-Tools)
- **Static frontend + Express/MySQL backend** → copy STRBuyers-Tools (or STRGuests-Tools)

Steps:

1. Copy the folder: `cp -R STRHost-Tools STRYourNew-Tools` (or PowerShell equivalent).
2. Update `package.json` `name` field and `astro.config.mjs` `site:` URL.
3. Rename branded files: `src/lib/seo.ts` (SITE_URL, organization name), `public/robots.txt`, OG/pin generator inputs.
4. Update [README.md](#) and [CLAUDE.md](#) for the new tool.
5. Add `.env.example` (mirror the closest sibling).
6. Add a row to [infrastructure/secrets-inventory.md](../infrastructure/secrets-inventory.md) for every new secret.
7. Add a `<tool>:dev/build/test/typecheck` script block to root [package.json](../package.json).
8. Add the folder to `pnpm-workspace.yaml` (still commented out; uncomment when ready).
9. Add a deploy workflow under `.github/workflows/deploy-<tool>.yml` (copy from a sibling).
10. Open a tracking entry in [PROGRESS.md](../PROGRESS.md).

When the shared `@str/common` package lands (see [Architectural roadmap](#architectural-roadmap)), new tools should import shared utilities from there instead of copying `format.ts` / `seo.ts` / `url-state.ts`.

---

## Commit & branch conventions

- Conventional commits, scoped by tool: `feat(strops-tools): …`, `ci(strguests-tools): …`, `fix(strbuyers-tools): …`, `chore(repo): …` for cross-tool changes.
- Branch from `main`. Worktrees are encouraged for parallel work (the `.claude/worktrees/` convention is in use today).
- Squash-merge PRs; the per-tool tag pattern is `v<X.Y.Z>-<tool-slug>` (e.g. `v0.1.0-strbuyers`).

---

## Secrets

Never commit a real `.env`. The root `.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`. Every secret used anywhere in the cluster must be listed in [infrastructure/secrets-inventory.md](../infrastructure/secrets-inventory.md) with owner and rotation cadence.

---

## Architectural roadmap

These are tracked but **not yet started** — see the project audit for full context.

1. **Hoist shared utilities** → `packages/common` exposing `format`, `seo`, `url-state` modules. Replaces ~1,200 lines of duplicated code across the four tools.
2. **Shared Astro/Tailwind preset** → `packages/astro-config`. Reduces per-tool config from ~200 lines to ~20.
3. **Astro version convergence** — STROps-Tools is on `astro@4.16.0`; the other three are on `astro@6.2.2`. STROps must upgrade to 6.x before shared packages can be introduced.
4. **Reusable CI workflows** via GitHub `workflow_call`. The four `deploy-*.yml` files are 95% identical.
5. **Resolve `design-system/`** — top-level folder has brand tokens but no tool imports from it today. Decide: promote to a real component library or relocate to `docs/`.

---

## Known issues

- **STROps-Tools lint placeholder.** Its `pnpm lint` script is `echo "lint placeholder"`. Wire up real ESLint when convenient (mirror the other three tools).
- **Astro 4 / 6 skew** (see roadmap above) — blocks workspace-mode `pnpm install` from root.
- **pnpm version skew** — STROps-Tools pins `pnpm@10.0.0`, others pin `pnpm@9.6.0`. Pick one before enabling workspace mode.
- **`design-system/` may be dead code.** Verify before relying on it for new work.

---

## Where to look next

- [PROGRESS.md](../PROGRESS.md) — milestone-level status across the cluster
- [README.md](../README.md) — high-level strategy
- Each tool's `CLAUDE.md` — tool-specific operating instructions and lifecycle context
- [docs/superpowers/specs/](../docs/superpowers/specs/) — master strategy & design specs
