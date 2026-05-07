# Phase 5 — Pinterest + site pages + SEO surface — PLAN

**Status:** active · **Started:** 2026-05-06

## Goal
Public-facing site complete. Landing, about, contact, lead-magnet pages ship. Sitemap + robots in place. OG images generated for all routes via Satori. Pinterest pin generator produces per-output PNG; PinterestPinButton wired across all 4 generators.

## Foundation already in place
- 4 PDF generator pages (`house-rules-pdf`, `welcome-book`, `wifi-sign`, `check-in-instructions`)
- 109 programmatic template pages + index
- Layout chrome with `astro-seo` + JSON-LD support
- `PinterestPinButton.astro` component (Phase 1 — script wiring stubbed)
- `@astrojs/sitemap` integration in astro.config.mjs
- `satori` + `sharp` already in dependencies (used by OG generator + Pinterest pin)

## Tasks

### Task 31 — OG images (Satori)
- `scripts/build-og.mjs` — port from STRHost-Tools, swap brand to terracotta + property name 'STR Guests'
- Routes: landing, 4 PDF generators, 3 AI generator slugs (placeholder for Phase 3), templates index, about, contact, get-the-pdf, plus per-template (109)
- Wired in `package.json`'s `build` script (already references `node ./scripts/build-og.mjs`)

### Task 28 — Landing page (`/`)
- Hero: "Free tools to delight your guests."
- Tool grid: 4 PDF generators highlighted, 3 AI generators "coming soon"
- Templates teaser: "+109 message templates"
- Trust band: "What hosts ship with this"
- Cluster funnel block

### Task 29 — About + Contact
- `/about.astro` — who we are (The STR Ledger), why guest-XP cluster, what's free
- `/contact.astro` — email + form-free contact (mailto), bug-report ask

### Task 27 — Lead-magnet page (`/get-the-templates`)
- Pitches the **Welcome Book master template** PDF as the lead magnet
- Email capture posts to ESP (PUBLIC_ESP_WEBHOOK)
- Confirms with "check your inbox" state

### Task 30 — Sitemap + robots
- `@astrojs/sitemap` already configured; verify it picks up programmatic routes
- `public/robots.txt` — Disallow none, point at sitemap

### Task 25 — Pinterest pin generator (Satori)
- `src/lib/pin.ts` — `buildPinPng(opts): Promise<Blob>` returns 1000×1500 PNG of a branded pin
- Per generator: tool name + tagline + branded panel
- Uses Satori + sharp browser-friendly path (or canvas-driven for runtime); for dev, server endpoint is fine

### Task 26 — Wire PinterestPinButton on all 4 generator pages
- Each form registers `window.__strguests.generatePinPng[<slug>]`
- Pinterest share intent URL contains image upload (placeholder webhook) + tool URL + description

## Acceptance criteria
- `pnpm build` produces 200+ static pages including OG images for each
- Landing, about, contact, lead-magnet routes return 200 with full chrome
- robots.txt + sitemap.xml served
- PinterestPinButton click triggers a CustomEvent + opens share intent on each of the 4 generator pages

## Out of scope
- AI generator pages (Phase 3 — needs OpenAI key)
- Real ESP integration (left as a deploy-time env var)
- Pinterest image hosting endpoint (stub — wired in Phase 6 with serverless function)
- Analytics events (Phase 6)
