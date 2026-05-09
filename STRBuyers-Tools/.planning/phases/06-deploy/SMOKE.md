# Phase 6 — Pre-launch Smoke Results (v0.1.0)

**Deploy timestamp:** 2026-05-08 18:08-18:14 UTC
**Deploy method:** SFTP via SSH key (scp.exe + ssh.exe, OpenSSH client)
**Remote:** `u470667024@195.35.15.247:65002` -> `/home/u470667024/domains/strbuyers.tools/public_html/`
**Backup:** `/home/u470667024/domains/strbuyers.tools/public_html.backup-20260508-120619`
**Build artifact:** `dist/` — 232 pages, 482 files

---

## Smoke Results — 7/7 PASS

| URL                                                | Status | Needle           | Hit | Snippet (first ~100 chars)                                                                          |
|----------------------------------------------------|--------|------------------|-----|-----------------------------------------------------------------------------------------------------|
| https://strbuyers.tools/                           | 200    | "STR Buyers"     | yes | `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width` |
| https://strbuyers.tools/dscr-loan-calculator/      | 200    | "DSCR"           | yes | `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width` |
| https://strbuyers.tools/cities/austin-tx/          | 200    | "Austin"         | yes | `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width` |
| https://strbuyers.tools/cities/                    | 200    | "Cities"         | yes | `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width` |
| https://strbuyers.tools/disclosures/               | 200    | "Disclosure"     | yes | `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width` |
| https://strbuyers.tools/sitemap-index.xml          | 200    | "<sitemapindex"  | yes | `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitem`  |
| https://strbuyers.tools/robots.txt                 | 200    | "Sitemap:"       | yes | `User-agent: * Allow: / Sitemap: https://strbuyers.tools/sitemap-index.xml`                         |

**Summary:** All 7 launch-blocking URLs return HTTP 200 with expected content. Site is LIVE.

---

## Deploy Notes

- FTP sub-account `u470667024.strbuyers.tools` was never provisioned by Hostinger
  (530 Login incorrect on every attempt). Pivoted to SFTP via the shared
  cluster SSH key (`~/.ssh/hostinger_ed25519`) authorized on the main
  `u470667024` account — same approach as `deploy-strops.ps1` for
  strops.tools.
- WinSCP .NET assembly was rejected because it cannot parse OpenSSH-format
  ed25519 private keys (it wants PuTTY `.ppk`). The script auto-detects
  this and falls through to `scp.exe` (Windows OpenSSH client).
- `scp -r` from Windows preserves the source umask, so subdirectories
  initially landed on the server as `0700`, which Apache (different uid)
  could not traverse. Result: every nested route returned 403. Fix:
  post-upload `chmod` pass that forces docroot to `755` dirs and `644`
  files. This is now baked into `scripts/deploy.ps1` so the next run
  is fully self-healing.
- Pre-deploy backup landed at
  `/home/u470667024/domains/strbuyers.tools/public_html.backup-20260508-120619`
  via atomic `ssh mv`. Backup is preserved for rollback; user can delete
  once confident in the live site.

## Affiliate / Click endpoint status

- Task 34 (Express `/api/click` deploy) deferred to v0.2.0. Affiliate
  click POSTs from the live site will return 404 silently (already
  wrapped in try/catch in `AffiliateBlock.tsx` per Phase 6 Path A
  decision). Vendor outbound CTAs still work — only the click-tracking
  log is missing.
