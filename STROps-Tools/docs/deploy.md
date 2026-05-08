# Deploy — strops.tools

Production target: `https://strops.tools/`
Hostinger doc root: `/home/u470667024/domains/strops.tools/public_html/`
Deploy method: static `dist/` over SSH (rsync from CI, scp from local script).

## Two deploy paths

### 1. Manual / launch deploy (PowerShell)

The launch deploy and any ad-hoc redeploy is driven from
**`Claude OS\deploy\scripts\deploy-strops.ps1`** (kept outside the repo
alongside the other STR cluster deploy scripts).

```powershell
# Full build + deploy + HTTPS verify
.\deploy-strops.ps1

# Dry-run — print intended SSH/SCP commands without executing
.\deploy-strops.ps1 -WhatIf

# Re-deploy current dist/ without rebuilding
.\deploy-strops.ps1 -SkipBuild

# Just hit the live URLs
.\deploy-strops.ps1 -VerifyOnly

# Deploy from a worktree instead of the default project path
.\deploy-strops.ps1 -ProjectRoot 'C:\path\to\worktree\STROps-Tools'
```

What it does, in order:

1. Reads creds from `Claude OS\.secrets\hostinger.env` (`STROPS_*` vars, plus
   the shared `*_SSH_KEY_PATH` for the cluster Hostinger key).
2. Runs `pnpm install --frozen-lockfile && pnpm build` in `STROps-Tools/`,
   injecting `PUBLIC_GA4_ID` and `PUBLIC_ESP_WEBHOOK` from the env file when
   set (build still works with empty defaults).
3. SSHs in and `rm -f`s `default.php` from the webroot (Hostinger ships one
   in fresh static webroots — would otherwise win over `index.html`).
4. `scp -r`s every entry in `dist/` into `public_html/`.
5. Hits a fixed list of HTTPS endpoints (landing, all 7 tools, about,
   contact, sitemap, robots, OG image) and asserts 200.

### 2. CI deploy (GitHub Actions)

`.github/workflows/deploy-strops-tools.yml` (at monorepo root) auto-deploys
on every push to `main` that touches `STROps-Tools/**`. Mirrors the sister
sites' rsync-over-SSH pattern using the shared cluster `STR_SSH_KEY` secret.

Required GitHub secrets (configure under repo Settings → Secrets and variables → Actions):

| Secret | Purpose | Required? |
|---|---|---|
| `STR_SSH_KEY` | Shared Hostinger cluster SSH private key (ed25519). Used by all `deploy-str*-tools.yml` workflows. | yes |
| `STROPS_GA4_ID` | GA4 measurement ID, injected as `PUBLIC_GA4_ID` at build time. | optional — site builds with no analytics if unset |
| `STROPS_ESP_WEBHOOK` | ESP webhook URL for the email-capture form. | optional — falls back to console-log capture if unset |

CI deploy runs `pnpm build`, removes `default.php`, rsyncs `dist/`, then
curls the landing URL with retries.

### CI checks (separate workflow)

`.github/workflows/ci-strops-tools.yml` runs on every PR + push to `main`
that touches `STROps-Tools/**`. Steps: typecheck, vitest, build, Playwright
e2e (chromium only). Artifacts: `playwright-report-strops-tools` on
failure.

## Hostinger quirks

- **`default.php`** — Hostinger drops one in fresh static webroots. Both
  deploy paths `rm` it before uploading.
- **`DO_NOT_UPLOAD_HERE`** — marker file at `domains/strops.tools/`. Leave
  it; deploy targets the nested `public_html/` only.
- **SSH port `65002`** — Hostinger's non-standard SSH port. Already in the
  env file and both workflows.
- **Public key** — already registered in hPanel → SSH Access. One key,
  whole cluster.

## Rollback

No formal rollback story yet — the previous `dist/` is overwritten by both
paths. If launch goes sideways:

1. `git revert` the bad commit on `main` and let CI redeploy, **or**
2. Re-run `deploy-strops.ps1` from a checkout of the last known-good tag.

For deeper rollback, the `dist/` directory is a flat tree of static HTML —
worst case, scp a backup back into `public_html/`.

## First-launch checklist

- [ ] DNS for `strops.tools` resolves to `195.35.15.247` (Hostinger shared IP)
- [ ] Hostinger SSL issued for `strops.tools` (auto on first request)
- [ ] `STROPS_SSH_KEY_PATH` in `hostinger.env` points at a key file that
      exists locally
- [ ] `pnpm build` runs clean locally
- [ ] `.\deploy-strops.ps1 -WhatIf` prints expected SSH/SCP without errors
- [ ] `.\deploy-strops.ps1` runs to completion with all verify endpoints 200
