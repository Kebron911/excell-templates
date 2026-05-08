# Deploy — strhost.tools

**Target:** Hostinger shared hosting via SSH + rsync.
**Trigger:** every push to `main` that touches `STRHost-Tools/**` or the workflow file.
**Workflow:** [.github/workflows/deploy-strhost-tools.yml](../../.github/workflows/deploy-strhost-tools.yml)

## One-time GitHub repo setup

The deploy uses a **single shared cluster secret**, `STR_SSH_KEY`, set once at the repo level. Same key works for strhost / strguests / strbuyers / strops.

| Secret name | Source | Notes |
|---|---|---|
| `STR_SSH_KEY` | `~/.ssh/hostinger_ed25519` private key | Already set as of 2026-05-08. One key for the whole cluster. |
| `STRHOST_GA4_ID` | (optional) | `G-XXXXXXXXXX`. Omit and the GA4 script tag is skipped at build time. |

Set the SSH key (one time):

```powershell
gh secret set STR_SSH_KEY --repo Kebron911/excell-templates < "$env:USERPROFILE\.ssh\hostinger_ed25519"
```

The corresponding public key (`hostinger_ed25519.pub`) must be in `~u470667024/.ssh/authorized_keys` on the Hostinger server. Already configured.

## Manual trigger

Repo → **Actions** tab → **Deploy strhost.tools** → **Run workflow** → branch `main` → **Run**.

## What the workflow does

1. Checks out the repo
2. Installs pnpm + Node 22
3. `pnpm install --frozen-lockfile` inside `STRHost-Tools/`
4. `pnpm build` — produces `STRHost-Tools/dist/` (static site + sitemap + 69 OG PNGs)
5. Sanity-checks the build output (fails the run if `dist/blog/index.html` is missing)
6. Writes `STR_SSH_KEY` to the runner's `~/.ssh/id_ed25519`, validates with `ssh-keygen -y`, pins the Hostinger host key via `ssh-keyscan`
7. `rsync -av --delete` from `STRHost-Tools/dist/` → `u470667024@195.35.15.247:/home/u470667024/domains/strhost.tools/public_html/` over SSH port 65002
8. POSTs the live sitemap URL list to IndexNow → Bing/Yandex/Seznam/Naver

## Verifying a deploy worked

After the workflow finishes:

- `https://strhost.tools/` — landing should still load
- `https://strhost.tools/blog` — should return 200 with the post grid
- `https://strhost.tools/blog/how-to-calculate-airbnb-profitability` — should return 200
- `https://strhost.tools/sitemap-index.xml` — should include the blog post URLs
- `https://strhost.tools/feed.xml` — RSS feed

If `/blog` is still 404 after a successful run, two things to check:

1. **LiteSpeed cache.** Hostinger caches static files aggressively. If `/blog` was a 404 before the deploy and is still 404 after, hPanel → LiteSpeed Cache → **Purge All**.
2. **File-system check via SSH:**

```bash
ssh -i ~/.ssh/hostinger_ed25519 -p 65002 u470667024@195.35.15.247
ls -la /home/u470667024/domains/strhost.tools/public_html/blog/
# Should show 6 post directories + index.html.
```

## Migration history

This workflow originally used FTPS via the per-domain sub-FTP account `u470667024.strhost.tools`. The first deploy hit a chroot bug — the sub-FTP-user is chrooted to the domain root, so an absolute `/home/.../domains/strhost.tools/public_html/` path created a deeply nested mirror inside the chroot. Recovered via SSH `rsync` from the wrong-path → real path.

The strguests.tools deploy then hit a different FTP failure mode: Hostinger never provisioned the `u470667024.strguests.tools` sub-FTP-user, so all FTPS auth attempts returned `530 Login incorrect`. SSH+rsync via the master account always works because the master account exists from day one.

So the cluster moved to a single shared-key SSH model. The five per-site `*_FTP_*` secrets are no longer used and can be deleted from GitHub when convenient.

## Rollback

The deploy doesn't keep history server-side. To roll back:

1. `git revert <commit-sha>` on `main`, or
2. Re-run the workflow against an older commit via Actions → Run workflow → choose ref

`rsync --delete` will remove server files that no longer exist in the older `dist/`, so rollback is clean.

## Cost notes

- GitHub Actions: free tier covers this (~2 min per run on `ubuntu-latest`).
- SSH bandwidth: counts against Hostinger's account allowance — single-digit MB per deploy after the first full sync.
- No third-party deploy service required.

## Related

- [docs/CLUSTER-BLOG-STANDARD.md](../../docs/CLUSTER-BLOG-STANDARD.md) — cluster-wide blog conventions every sister site follows.
- [astro.config.mjs](../astro.config.mjs) — `output: 'static'` is what makes rsync deploy possible. Switching to SSR would need a different deploy path (Hostinger Node.js Web App).
