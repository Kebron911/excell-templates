# Memory

_Last updated: 2026-05-08_

## Memory
<!-- Things the user has asked to remember. Persistent — only remove or change if the user asks. -->

## Launch state (auto-recorded on launch)

- **Launched:** 2026-05-08 (v0.1.0-strops)
- **Live URL:** https://strops.tools/
- **Last deploy:** 2026-05-08 ~9:32 MDT — 28/28 HTTPS smoke endpoints returned 200
- **Hosting:** Hostinger (shared cluster account `u470667024`, `195.35.15.247`, port 65002)
- **Doc root:** `/home/u470667024/domains/strops.tools/public_html/`
- **Deploy script:** `Claude OS\deploy\scripts\deploy-strops.ps1`
- **Auto-deploy on push:** `.github/workflows/deploy-strops-tools.yml` (uses shared `STR_SSH_KEY` GitHub secret)
- **CI:** `.github/workflows/ci-strops-tools.yml`

## Open post-launch items

- ESP not selected (`PUBLIC_ESP_WEBHOOK` unset). EmailCaptureCard logs to console; magnet PDFs download directly so users still get value.
- GA4 not wired (`PUBLIC_GA4_ID` unset). Cross-domain analytics module is ready; just needs the measurement ID.
- Affiliate IDs not provisioned yet (smart locks, noise monitors, PMS, cleaning marketplaces).
- Sitemap not yet submitted to Google Search Console / Bing Webmaster Tools.
