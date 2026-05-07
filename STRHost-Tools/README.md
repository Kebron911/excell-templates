# STR Host Tools — strhost.tools

Free calculators for short-term rental hosts. Astro 4 static site with React islands for the calculators. Sister property of [The STR Ledger](https://thestrledger.com); deployed to Hostinger Business with Cloudflare CDN.

## Dev

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## Build

```bash
pnpm build        # astro build + scripts/build-og.mjs (Satori OG generator)
```

Outputs static site to `dist/`. The build also writes 62 OG images (1200x630 PNGs) to `dist/og/` and `public/og/`.

## Test

```bash
pnpm typecheck    # astro check + tsc --noEmit
pnpm test         # vitest unit tests for calculator logic + libraries
pnpm e2e:install  # one-time: install Playwright chromium
pnpm e2e          # Playwright smoke tests for all 7 calculators
```

## Deploy

Pushing to `main` triggers two workflows:

1. **CI** ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) — typecheck + vitest + Playwright + build. Required to pass.
2. **Deploy** ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) — builds with production env vars, FTPs `dist/` to Hostinger `/public_html/`, runs the post-deploy smoke against the live URL.

### Required GitHub repo secrets

| Secret | Purpose |
|---|---|
| `HOSTINGER_FTP_HOST` | Hostinger FTP hostname (e.g., `ftp.strhost.tools`) |
| `HOSTINGER_FTP_USERNAME` | Hostinger FTP user |
| `HOSTINGER_FTP_PASSWORD` | Hostinger FTP password |

### Required GitHub repo variables

| Variable | When set | Effect |
|---|---|---|
| `PUBLIC_GA4_ID` | Post-launch | Enables GA4 cross-domain tracking |
| `PUBLIC_ADSENSE_ENABLED` | Post-AdSense approval | Flips ad placeholders to live `<ins class="adsbygoogle">` |
| `PUBLIC_ADSENSE_CLIENT` | With `PUBLIC_ADSENSE_ENABLED` | AdSense publisher ID |
| `PUBLIC_ESP_WEBHOOK` | Post-ESP decision | Email-capture form POST target |

All four are read at **build time** (not runtime). Bumping a variable's value requires a redeploy.

## Pre-launch checklist

1. Verify all GitHub repo secrets and variables (see tables above).
2. Confirm domain DNS points to Hostinger.
3. Push to `main`. Watch CI go green.
4. Watch Deploy run; verify post-deploy smoke shows all 19 probes green.
5. Visit https://strhost.tools/ manually. Walk through 1 calculator, confirm URL state + share link + print preview work.
6. Tag v0.1.0:
   ```bash
   git tag -a v0.1.0 -m "strhost.tools v0.1.0 — initial launch"
   git push origin v0.1.0
   ```

## Local smoke against deployed URL

```bash
SMOKE_BASE_URL=https://strhost.tools node scripts/post-deploy-smoke.mjs
```

Hits 19 routes (landing + 7 calculators + 5 sample lodging-tax states + 3 site pages + sitemap + robots + 3 OG images). Exits 0 on all-200, exits 1 with failure count otherwise.

## Project structure

```
src/
├── components/
│   ├── chrome/         Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, Layout, Wordmark
│   ├── ads/            AdSlot
│   ├── funnel/         EmailCaptureCard, STRLedgerCTA
│   └── calculators/    7 React islands + shared ui.tsx
├── lib/
│   ├── calc/           Pure-function logic per calculator (all unit-tested)
│   ├── format.ts       Currency / percent / number / abbreviated helpers
│   ├── url-state.ts    serialize / parse / debounced replaceState
│   └── seo.ts          Schema.org JSON-LD builders
├── content/
│   ├── tools/          Per-tool MDX (How it works / How to use / FAQ)
│   ├── states/         Per-state MDX narratives (5 launch states + README)
│   └── config.ts       Astro content-collection schemas
├── data/
│   ├── tools.json      7-tool registry
│   └── lodging-tax-by-state.json   51 entries (50 states + DC)
├── pages/              Astro routes (landing + 7 calc pages + lodging-tax + about/contact/get-the-pdf)
└── styles/             tokens.css + global.css + print.css

scripts/
├── build-og.mjs        Satori OG-image generator (62 PNGs)
└── post-deploy-smoke.mjs   19-probe launch smoke

tests/
├── calc/               Vitest unit tests per calculator
├── format.test.ts
├── url-state.test.ts
└── e2e/                Playwright smoke per calculator + lodging-tax index/state
```

## Cluster

This site is one of four in the STR cluster, designed to share brand patterns and cross-link. See [`.planning/CLUSTER-STYLE-GUIDE.md`](./.planning/CLUSTER-STYLE-GUIDE.md) for the locked UX patterns that all four sister sites follow.
