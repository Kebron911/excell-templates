# strguests.tools

Free tools for short-term rental hosts to delight guests — 4 PDF generators (house rules, welcome book, wifi sign, check-in instructions) + 3 AI generators (listing descriptions, review responses, guest messages) + ~100 programmatic message-template scenario pages.

Sister site to [strhost.tools](../STRHost-Tools), [strops.tools](../STROps-Tools), [strbuyers.tools](../STRBuyers-Tools), and [The STR Ledger](../) (Excel-Templates).

## Architecture

Dual-target:

- **Astro 4.x static site** — tools 1–4 (PDF), content collections, programmatic scenario pages, brand chrome. Deployed to Hostinger via FTP.
- **Express + MySQL server** — tools 5–7 (AI generators) wrapping OpenAI GPT-4o-mini behind rate limits + email verification. Deployed to Hostinger Apps via SSH/rsync.

Brand identity: hospitality-warm terracotta accent. Cormorant Garamond gets more screen time on this site than siblings (guidebooks suit serif).

## Dev workflow

```bash
pnpm install
pnpm dev          # Astro static site on :4321
pnpm server:dev   # Express API on :3001 (in a second terminal)
pnpm test         # Vitest (format, url-state, pdf base, server/db)
pnpm typecheck    # astro check + tsc on root + server tsconfigs
pnpm e2e          # Playwright (Chromium)
```

## Folder structure

```
src/                        # Astro static site
  components/
    chrome/                 # Header, Footer, Sidebar, Wordmark, FunnelBand, ClusterFunnelBlock, Layout
    ads/                    # AdSlot
    funnel/                 # EmailCaptureCard, STRLedgerCTA
    generator/              # PdfDownloadButton, PinterestPinButton, AiRateLimitNotice
  lib/
    format.ts               # currency, percent, phone formatters (TDD)
    url-state.ts            # debounced replaceState (TDD)
    seo.ts                  # Schema.org JSON-LD builders incl. Article
    pdf/                    # PDF library base (header/footer/types)
  styles/
    tokens.css              # design tokens (hospitality-warm accent)
    global.css
server/                     # Express API for AI tools
  index.ts                  # Express skeleton + /api/health
  lib/db.ts                 # MySQL pool wrapper
  db/
    schema.sql              # rate_limits, email_verifications, generation_logs
    migrate.ts
tests/                      # Vitest + Playwright (e2e/)
public/                     # static assets, og/ output
```

## Brand

Position: "Free tools for hosts to delight guests."
Lifecycle stage: Guest XP (optimizing) — fourth stop in the host lifecycle.
Accent: hospitality-warm terracotta.
Wordmark: `STR Guests`·*tools* — terracotta brand name + neutral tld trailing per [Cluster Style Guide §1](../STRHost-Tools/.planning/CLUSTER-STYLE-GUIDE.md#1-wordmark).

## Phase 1 status

See [.planning/STATE.md](.planning/STATE.md). Tasks 1–10 ship the bootable dual-target foundation.
