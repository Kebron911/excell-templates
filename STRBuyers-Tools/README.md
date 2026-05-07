# strbuyers.tools

Free pre-purchase tools for short-term rental property buyers. Sister site to
strhost.tools, strops.tools, strguests.tools, and Excel-Templates (The STR Ledger).

## Stack

- Astro (static, no SSR)
- Tailwind + custom design tokens (finance-trust accent)
- Vitest + Playwright

## Dev

```bash
pnpm install --legacy-peer-deps
pnpm dev
pnpm typecheck
pnpm test
```

## Architecture

7 calculators + 200 city pages. Static-only — no auth, no DB, no server. Affiliate-first
monetization (DSCR lenders, STR data software, insurance, furniture).
