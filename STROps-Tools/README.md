# strops.tools

Free operational tools for active short-term rental hosts. Sister site to
strhost.tools, strbuyers.tools, strguests.tools, and Excel-Templates (The STR Ledger).

## Stack

- Astro (static, no SSR)
- Tailwind + custom design tokens (ops-utility green-gray accent)
- pdf-lib (browser-side PDF generation for cleaner SOPs, maintenance schedules)
- Vitest + Playwright

## Dev

```bash
pnpm install --legacy-peer-deps
pnpm dev
pnpm typecheck
pnpm test
```
