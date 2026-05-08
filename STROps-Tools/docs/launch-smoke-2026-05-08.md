# strops.tools — pre-launch smoke (2026-05-08)

**Build:** worktree `claude/fervent-taussig-611a52` @ commit `6850f5c` (post-Phase 6 Task 34)
**Astro:** 6.3.1 · **Pages built:** 103 · **Build time:** 9.54s
**Deploy method:** `deploy/scripts/deploy-strops.ps1` (PowerShell, scp-over-SSH to Hostinger)
**Doc root:** `/home/u470667024/domains/strops.tools/public_html/`
**Run at:** 2026-05-08 ~9:32 MDT

## Build summary

```
prebuild (Satori)  : OG images built: 104 files in public/og/
astro build        : 103 page(s) built in 9.54s
sitemap-index.xml  : created at dist/
```

Build env: `PUBLIC_GA4_ID` and `PUBLIC_ESP_WEBHOOK` were not set in `hostinger.env`,
so site shipped with analytics + ESP fallbacks (console-log capture). These can
be added post-launch by setting them in `.secrets/hostinger.env` and re-running
the deploy script.

## Deploy summary

- `ssh rm -f` ran clean (Hostinger `default.php` was not present this round —
  it had been replaced earlier by the placeholder deploy)
- 21 top-level entries in `dist/` scp'd into `public_html/`:
  - 17 directories: `_assets`, `about`, `cleaner-dispatch`, `cleaner-sop`,
    `contact`, `damage-cost-lookup`, `linen-par`, `maintenance`,
    `maintenance-checklist`, `maintenance-schedule`, `og`, `pdf`, `replace`,
    `restock-calculator`, `smart-lock-codes`, `supply-par`, `turnover-scheduler`
  - 4 files: `favicon.svg`, `index.html`, `robots.txt`, `sitemap-0.xml`,
    `sitemap-index.xml`
- All transfers completed without error.

## HTTPS smoke results

**28 / 28 endpoints returned HTTP 200.**

| Route | Bytes | Title (verified UTF-8 via `curl`) |
|---|---:|---|
| `/` | 21,551 | strops.tools — free tools for active short-term rental operators |
| `/turnover-scheduler/` | 31,240 | Airbnb Turnover Scheduler — strops.tools |
| `/cleaner-dispatch/` | 32,339 | Airbnb Cleaner Dispatch Generator — strops.tools |
| `/smart-lock-codes/` | 33,984 | Airbnb Smart Lock Code Generator — strops.tools |
| `/linen-par/` | 30,942 | Airbnb Linen Par Calculator — strops.tools |
| `/restock-calculator/` | 31,118 | Airbnb Supply Restock Calculator — strops.tools |
| `/damage-cost-lookup/` | 48,018 | Airbnb Damage Cost Lookup — strops.tools |
| `/maintenance-schedule/` | 44,496 | Airbnb Maintenance Schedule Generator — strops.tools |
| `/about/` | 17,060 | About — strops.tools |
| `/contact/` | 14,741 | Contact — strops.tools |
| `/sitemap-index.xml` | 183 | (xml) |
| `/robots.txt` | 72 | (text) |
| `/og/index.png` | 13,817 | (PNG) |
| `/maintenance/` | 42,937 | STR Maintenance Tasks — strops.tools |
| `/maintenance/hvac-filter-change/` | 24,294 | HVAC filter change — How often in an STR · strops.tools |
| `/maintenance/ac-tune-up/` | 20,698 | AC tune-up (pro) — How often in an STR · strops.tools |
| `/maintenance/water-heater-flush/` | 24,024 | Water heater flush — How often in an STR · strops.tools |
| `/maintenance/dryer-vent-clean/` | 24,262 | Dryer vent cleaning — How often in an STR · strops.tools |
| `/maintenance/smoke-detector-test/` | 24,848 | Smoke + CO detector test — How often in an STR · strops.tools |
| `/replace/` | 58,045 | STR Replacement Costs — strops.tools |
| `/replace/queen-mattress/` | 25,310 | Cost to replace queen mattress in an Airbnb · strops.tools |
| `/replace/55in-tv/` | 25,573 | Cost to replace 55-inch tv in an Airbnb · strops.tools |
| `/replace/sofa/` | 26,234 | Cost to replace sofa (3-seat) in an Airbnb · strops.tools |
| `/replace/coffee-maker/` | 22,180 | Cost to replace coffee maker in an Airbnb · strops.tools |
| `/replace/towel-set/` | 25,902 | Cost to replace bath towel set (6-pc) in an Airbnb · strops.tools |
| `/cleaner-sop/` | 18,210 | STR Cleaner SOP — free printable PDF for short-term rental turnovers |
| `/maintenance-checklist/` | 18,649 | STR Maintenance Checklist — annual + seasonal recurring tasks (free PDF) |
| `/supply-par/` | 18,021 | STR Supply Par-Level Sheet — printable PDF for linens, towels, consumables |

## Notes / deferred items

- **`PUBLIC_GA4_ID` not set at launch.** Console-log GA4 fallback is in place;
  no events are firing to GA4. Add the measurement ID to `hostinger.env` and
  redeploy when ready (single env-var change).
- **`PUBLIC_ESP_WEBHOOK` not set at launch.** EmailCaptureCard logs submissions
  to console; users get the magnet PDF directly via the unblocked download
  buttons. ESP swap is a one-line config change post-launch.
- **CI workflow (`ci-strops-tools.yml`) not yet exercised on a real PR.** YAML
  is well-formed and shape-identical to the working sister-site `deploy-*.yml`
  workflows; the `ci-strops-tools.yml` will run on its first PR or push to
  `main` after merge.
- **`STR_SSH_KEY` GitHub secret already exists** (used by sister-site deploys);
  `STROPS_GA4_ID` / `STROPS_ESP_WEBHOOK` are optional and can be added later
  without breaking the deploy.
- **Mojibake in console output** during smoke (`�??` in place of `—`) is the
  bash console's UTF-8-to-cp1252 mapping; the served HTML is correct UTF-8 (verified
  via `curl` on `/` which returned the proper em-dash in `<title>`).

## Verdict

**Launch-ready.** Production landing serves the real Astro build (not the
placeholder), all 7 tools render, both programmatic indexes (`/maintenance/`,
`/replace/`) are reachable, all 5 sample maintenance MDX pages and 5 sample
replacement MDX pages return 200, all 3 lead magnets return 200, sitemap +
robots + OG image are served. Proceeding to Task 36 (v0.1.0-strops tag).
