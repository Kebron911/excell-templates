# Deploy — strhost.tools

**Target:** Hostinger shared hosting via FTPS.
**Trigger:** every push to `main` that touches `STRHost-Tools/**` or the workflow file.
**Workflow:** [.github/workflows/deploy-strhost-tools.yml](../../.github/workflows/deploy-strhost-tools.yml)

## One-time GitHub repo setup

Go to **GitHub → repo → Settings → Secrets and variables → Actions → New repository secret** and add the following six. Values come from `~/Desktop/Claude OS/.secrets/hostinger.env` — copy from there, paste into GitHub.

| Secret name | Source line in `hostinger.env` | Notes |
|---|---|---|
| `STRHOST_FTP_HOST` | `STRHOST_FTP_HOST=` | usually `ftp.strhost.tools` or the shared IP |
| `STRHOST_FTP_USER` | `STRHOST_FTP_USER=` | full hPanel FTP username |
| `STRHOST_FTP_PASS` | `STRHOST_FTP_PASS=` | the FTP password (not your hPanel password) |
| `STRHOST_FTP_PORT` | `STRHOST_FTP_PORT=` | typically `21` (FTPS explicit) |
| `STRHOST_DOC_ROOT` | `STRHOST_DOC_ROOT=` | e.g. `/public_html/` or `/domains/strhost.tools/public_html/` — must end with `/` |
| `STRHOST_GA4_ID` | (optional) | `G-XXXXXXXXXX`. Omit and the script tag is skipped at build time. |

After adding all six, the next push to `main` will trigger a deploy automatically.

## Manual trigger

Repo → **Actions** tab → **Deploy strhost.tools** → **Run workflow** → branch `main` → **Run**.

## What the workflow does

1. Checks out the repo
2. Installs pnpm + Node 20 (with cache)
3. `pnpm install --frozen-lockfile` inside `STRHost-Tools/`
4. `pnpm build` — produces `STRHost-Tools/dist/`, including `dist/blog/`
5. Sanity-checks the build output (fails the run if `dist/blog/index.html` is missing)
6. FTPS-uploads `dist/` → `STRHOST_DOC_ROOT` using `SamKirkland/FTP-Deploy-Action`
7. Skips files matching `.git*`, `node_modules/`, `.htaccess` (don't overwrite Hostinger's redirect rules)
8. Persists a sync state file (`.ftp-deploy-sync-state.json`) on the server so the next run only uploads changed files

## Verifying a deploy worked

After the workflow finishes:

- `https://strhost.tools/` — landing should still load
- `https://strhost.tools/blog` — should now return 200 with the post grid
- `https://strhost.tools/blog/how-to-calculate-airbnb-profitability` — should return 200
- `https://strhost.tools/sitemap-index.xml` — should now include the 6 blog post URLs

If `/blog` is still 404 after a successful run, the most likely cause is `STRHOST_DOC_ROOT` pointing to the wrong directory. Verify with:

```bash
# Connect via SFTP or hPanel File Manager and confirm
# strhost.tools is being served from this exact path:
ls -la /public_html/blog/
```

## Rollback

The FTP deploy doesn't keep history. To roll back:

1. `git revert <commit-sha>` on `main`, or
2. Re-run the workflow against an older commit via Actions → Run workflow → choose ref

The state file (`.ftp-deploy-sync-state.json`) on the server will detect the regression as a forward-change and re-upload the older files.

## Cost notes

- GitHub Actions: free tier covers this comfortably (~2 min per run on `ubuntu-latest`).
- FTPS bandwidth: counts against Hostinger's account allowance — small (single-digit MB per deploy after first).
- No third-party deploy service required.

## Related

- [docs/STATE.md](./STATE.md) — Phase 6 was originally blocked on Hostinger creds; this workflow closes the blocker for the static-site portion of Phase 6.
- [astro.config.mjs](../astro.config.mjs) — `output: 'static'` is what makes FTP deploy possible. Don't switch to SSR without first wiring Node app deploy (would need a different workflow).
