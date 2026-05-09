# strops.tools

Free tools for active short-term rental operators. Sister site to
`strbuyers.tools`, `strhost.tools`, `strguests.tools`, and The STR Ledger.

Astro 4 static build, deployed to Hostinger via SSH + rsync, with the
shared cluster CI/CD pipeline.

## Local development

```bash
pnpm install
pnpm dev          # astro dev server
pnpm build        # static build to dist/  (also generates OG PNGs via prebuild)
pnpm test         # vitest unit tests
pnpm test:e2e     # playwright end-to-end
pnpm typecheck    # astro check + tsc --noEmit
```

Node 22, pnpm 10.

## Deploy

`main` -> `.github/workflows/deploy.yml` builds and deploys to
`~/domains/strops.tools/public_html/` on the shared Hostinger account
via SSH+rsync, then runs `scripts/smoke.mjs` against
`https://strops.tools` as a post-deploy gate.

CI for every push and PR runs `.github/workflows/ci.yml` (typecheck,
unit tests, build, e2e). Playwright browser install is soft-failed so
transient apt failures on the runner don't block the pipeline.

## Required GitHub Secrets

Configure these in **Settings -> Secrets and variables -> Actions**
on the repository before the deploy workflow can succeed.

### Cluster-shared (already configured for sister sites)

| Secret           | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `STR_SSH_KEY`    | Private key for the shared Hostinger SSH master user |
| `STR_SSH_HOST`   | Hostinger server hostname or IP                      |
| `STR_SSH_USER`   | Hostinger SSH user (e.g. `u470667024`)               |
| `STR_SSH_PORT`   | Hostinger SSH port (e.g. `65002`)                    |

### Project-specific (set when each integration goes live)

| Secret                  | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `PUBLIC_GA4_ID`         | GA4 measurement ID (e.g. `G-XXXXXXXXXX`)               |
| `PUBLIC_ESP_ENDPOINT`   | Email-service-provider form-submission endpoint URL    |

### Optional repository variables

| Variable                  | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `PUBLIC_ADSENSE_ENABLED`  | `true` to render AdSense slots in production     |
| `PUBLIC_ADSENSE_CLIENT`   | AdSense publisher ID (e.g. `ca-pub-XXXXXXXX`)    |

## Project layout

```
.github/workflows/    # CI + deploy pipelines
docs/                 # planning, ADRs, plans
public/               # static assets served as-is
scripts/              # build-og, build-stub-magnets, smoke
src/                  # Astro pages, components, data, lib
tests/                # vitest unit + playwright e2e
```

## Smoke check

Run locally against any environment:

```bash
SMOKE_BASE_URL=https://strops.tools node scripts/smoke.mjs
```

Hits the landing page, a representative tool page, a maintenance and a
replace programmatic page, a magnet capture page, and an OG image
endpoint. Exits non-zero on any 200/Content-Type/body-substring failure.
