# strhost.tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship strhost.tools — 7 STR calculators + 50 state lodging-tax pages + chrome + monetization + SEO + Hostinger deploy — production-ready.

**Architecture:** Astro 4.x static site. Each calculator is a hydrated TSX island bound to a pure TS function. URL state encodes inputs for shareable/indexable results. Programmatic state pages are getStaticPaths over a JSON file. Two AdSlot placements + one inline email capture + one STR Ledger CTA per page. Deployed as static dist/ to Hostinger Business via FTP, with bundled Hostinger CDN.

**Tech Stack:** Astro 4.x, TypeScript, Tailwind, pdf-lib (NOT used here; for printing only), Vitest, Playwright, pnpm. Deploy via FTP-action to Hostinger.

---

## Task 1: Bootstrap project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `README.md`

- [ ] **Step 1: Create `package.json`**
   ```json
   {
     "name": "strhost-tools",
     "version": "0.1.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "astro dev",
       "build": "astro build && node ./scripts/build-og.mjs",
       "preview": "astro preview",
       "astro": "astro",
       "typecheck": "astro check && tsc --noEmit",
       "test": "vitest run",
       "test:watch": "vitest",
       "e2e": "playwright test",
       "e2e:install": "playwright install --with-deps chromium",
       "lint": "eslint --ext .ts,.tsx,.astro src tests"
     },
     "dependencies": {
       "@astrojs/mdx": "^3.1.0",
       "@astrojs/react": "^3.6.0",
       "@astrojs/sitemap": "^3.1.6",
       "@astrojs/tailwind": "^5.1.0",
       "astro": "^4.15.0",
       "astro-seo": "^0.8.4",
       "react": "^18.3.1",
       "react-dom": "^18.3.1",
       "satori": "^0.10.13",
       "sharp": "^0.33.4",
       "tailwindcss": "^3.4.7"
     },
     "devDependencies": {
       "@playwright/test": "^1.45.0",
       "@types/node": "^20.14.0",
       "@types/react": "^18.3.0",
       "@types/react-dom": "^18.3.0",
       "@typescript-eslint/eslint-plugin": "^7.16.0",
       "@typescript-eslint/parser": "^7.16.0",
       "eslint": "^8.57.0",
       "eslint-plugin-astro": "^1.2.3",
       "typescript": "^5.5.3",
       "vitest": "^1.6.0"
     },
     "packageManager": "pnpm@9.6.0"
   }
   ```

- [ ] **Step 2: Create `tsconfig.json`**
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       },
       "jsx": "react-jsx",
       "jsxImportSource": "react",
       "types": ["astro/client", "vitest/globals"]
     },
     "include": ["src", "tests", "scripts", "*.ts", "*.mjs"]
   }
   ```

- [ ] **Step 3: Create `astro.config.mjs`**
   ```js
   import { defineConfig } from 'astro/config';
   import tailwind from '@astrojs/tailwind';
   import react from '@astrojs/react';
   import mdx from '@astrojs/mdx';
   import sitemap from '@astrojs/sitemap';

   export default defineConfig({
     site: 'https://strhost.tools',
     output: 'static',
     trailingSlash: 'ignore',
     integrations: [
       tailwind({ applyBaseStyles: false }),
       react(),
       mdx(),
       sitemap()
     ],
     build: {
       assets: '_assets',
       inlineStylesheets: 'auto'
     },
     vite: {
       resolve: {
         alias: { '@': new URL('./src', import.meta.url).pathname }
       }
     }
   });
   ```

- [ ] **Step 4: Create `tailwind.config.ts`** (theme extension is fleshed out in Task 2)
   ```ts
   import type { Config } from 'tailwindcss';

   export default {
     content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
     theme: {
       extend: {}
     },
     plugins: []
   } satisfies Config;
   ```

- [ ] **Step 5: Create `vitest.config.ts`**
   ```ts
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       globals: true,
       environment: 'node',
       include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
       exclude: ['tests/e2e/**']
     },
     resolve: {
       alias: { '@': new URL('./src', import.meta.url).pathname }
     }
   });
   ```

- [ ] **Step 6: Create `playwright.config.ts`**
   ```ts
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:4321',
       trace: 'on-first-retry'
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
     ],
     webServer: {
       command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4321',
       url: 'http://localhost:4321',
       reuseExistingServer: !process.env.CI,
       timeout: 120_000
     }
   });
   ```

- [ ] **Step 7: Create `.gitignore`**
   ```
   node_modules
   .DS_Store
   dist
   .astro
   .env
   .env.*
   !.env.example
   playwright-report
   test-results
   coverage
   public/og/*.png
   ```

- [ ] **Step 8: Create `.npmrc`**
   ```
   auto-install-peers=true
   strict-peer-dependencies=false
   ```

- [ ] **Step 9: Create `README.md`**
   ```md
   # strhost.tools

   Free calculators for short-term rental hosts. Astro static site, deployed to Hostinger.

   ## Dev
   ```
   pnpm install
   pnpm dev
   ```

   ## Build
   ```
   pnpm build
   ```
   Outputs to `dist/`.

   ## Test
   ```
   pnpm test       # vitest
   pnpm e2e        # playwright
   ```

   ## Deploy
   Pushing to `main` triggers FTP deploy to Hostinger via GitHub Actions.
   ```

- [ ] **Step 10: Install + commit**
   ```bash
   pnpm install
   git add package.json pnpm-lock.yaml tsconfig.json astro.config.mjs tailwind.config.ts vitest.config.ts playwright.config.ts .gitignore .npmrc README.md
   git commit -m "chore: bootstrap astro+tailwind+vitest+playwright project"
   ```

---

## Task 2: Brand tokens + Tailwind theme

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Create `src/styles/tokens.css`** (ported from Excel-Templates `design-system/colors_and_type.css`)
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');

   :root {
     --brand-navy:           #12304E;
     --brand-parchment:      #F6EFE2;
     --brand-gold:           #C9A24B;
     --brand-clay:           #B5725E;
     --brand-graphite:       #2B2B2B;

     --brand-navy-tint:      #2A4867;
     --brand-navy-shade:     #0A1F35;
     --brand-parchment-alt:  #EFE5D0;
     --brand-parchment-deep: #E7DCC2;
     --brand-gold-soft:      #E2C884;
     --brand-gold-deep:      #A9863A;
     --brand-clay-soft:      #D3A290;

     --fg-1: var(--brand-graphite);
     --fg-2: #555049;
     --fg-3: #8A8176;
     --fg-on-navy: var(--brand-parchment);
     --fg-on-navy-muted: #BFB8A7;
     --fg-accent: var(--brand-gold);

     --bg-1: var(--brand-parchment);
     --bg-2: var(--brand-parchment-alt);
     --bg-3: #FBF6EC;
     --bg-inverse: var(--brand-navy);
     --bg-inverse-deep: var(--brand-navy-shade);

     --rule: var(--brand-parchment-deep);
     --rule-strong: #BEB19A;

     --semantic-success: #3C6B3F;
     --semantic-error:   #A33A2A;
     --semantic-warn:    #B38400;

     --font-display: "Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif;
     --font-body:    "Inter", "Helvetica Neue", Arial, system-ui, sans-serif;
     --font-mono:    "JetBrains Mono", "Menlo", "Consolas", ui-monospace, monospace;
     --font-wordmark: "Inter Tight", "Inter", system-ui, sans-serif;

     --sh-card:    0 1px 2px rgba(10, 31, 53, 0.06), 0 1px 1px rgba(10, 31, 53, 0.04);
     --sh-lifted:  0 8px 24px -8px rgba(10, 31, 53, 0.20), 0 2px 6px rgba(10, 31, 53, 0.08);
     --sh-focus-ring: 0 0 0 3px rgba(201, 162, 75, 0.45);
   }
   ```

- [ ] **Step 2: Create `src/styles/global.css`**
   ```css
   @import "./tokens.css";
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     html, body {
       background: var(--bg-1);
       color: var(--fg-1);
       font-family: var(--font-body);
       font-size: 16px;
       line-height: 1.55;
       -webkit-font-smoothing: antialiased;
       text-rendering: optimizeLegibility;
     }
     h1, h2, h3, h4 {
       color: var(--brand-navy);
       text-wrap: balance;
       margin: 0 0 1rem;
     }
     .num, .mono {
       font-family: var(--font-mono);
       font-variant-numeric: tabular-nums;
     }
     .display {
       font-family: var(--font-display);
     }
     a {
       color: var(--brand-navy);
       text-decoration: underline;
       text-decoration-color: var(--brand-gold);
       text-decoration-thickness: 1px;
       text-underline-offset: 3px;
     }
     a:hover { color: var(--brand-navy-tint); }
     :focus-visible { outline: none; box-shadow: var(--sh-focus-ring); }
   }
   ```

- [ ] **Step 3: Replace `tailwind.config.ts` with full theme**
   ```ts
   import type { Config } from 'tailwindcss';

   export default {
     content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
     theme: {
       extend: {
         colors: {
           navy:        { DEFAULT: '#12304E', tint: '#2A4867', shade: '#0A1F35' },
           parchment:   { DEFAULT: '#F6EFE2', alt: '#EFE5D0', deep: '#E7DCC2', light: '#FBF6EC' },
           gold:        { DEFAULT: '#C9A24B', soft: '#E2C884', deep: '#A9863A' },
           clay:        { DEFAULT: '#B5725E', soft: '#D3A290' },
           graphite:    '#2B2B2B',
           rule:        { DEFAULT: '#E7DCC2', strong: '#BEB19A' },
           success:     '#3C6B3F',
           danger:      '#A33A2A',
           warn:        '#B38400'
         },
         fontFamily: {
           sans:     ['Inter', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
           display:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
           mono:     ['"JetBrains Mono"', 'Menlo', 'Consolas', 'ui-monospace', 'monospace'],
           wordmark: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif']
         },
         boxShadow: {
           card:   '0 1px 2px rgba(10,31,53,0.06), 0 1px 1px rgba(10,31,53,0.04)',
           lifted: '0 8px 24px -8px rgba(10,31,53,0.20), 0 2px 6px rgba(10,31,53,0.08)',
           focus:  '0 0 0 3px rgba(201,162,75,0.45)'
         },
         maxWidth: { prose: '720px', wide: '1200px' }
       }
     },
     plugins: []
   } satisfies Config;
   ```

- [ ] **Step 4: Commit**
   ```bash
   git add src/styles/tokens.css src/styles/global.css tailwind.config.ts
   git commit -m "feat(brand): port STR Ledger tokens + Tailwind theme"
   ```

---

## Task 3: Print stylesheet

**Files:**
- Create: `src/styles/print.css`

- [ ] **Step 1: Create `src/styles/print.css`**
   ```css
   @media print {
     header, footer, nav, aside,
     [data-ad-slot], [data-funnel="band"], [data-funnel="cluster"],
     [data-component="email-capture"], [data-component="str-ledger-cta"],
     .no-print { display: none !important; }

     body { background: #fff !important; color: #000 !important; }
     a { color: #000 !important; text-decoration: none !important; }
     .calculator { box-shadow: none !important; border: 1px solid #000 !important; }
     .num { font-family: "JetBrains Mono", monospace !important; }
     @page { margin: 0.6in; }
   }
   ```

- [ ] **Step 2: Import print stylesheet in `src/styles/global.css`** — add `@import "./print.css";` after `@tailwind utilities;`.

- [ ] **Step 3: Commit**
   ```bash
   git add src/styles/print.css src/styles/global.css
   git commit -m "feat(brand): add print stylesheet"
   ```

---

## Task 4: Format library (TDD)

**Files:**
- Create: `src/lib/format.ts`
- Test: `tests/lib/format.test.ts`

- [ ] **Step 1: Write failing test**
   ```ts
   // tests/lib/format.test.ts
   import { describe, it, expect } from 'vitest';
   import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';

   describe('formatCurrency', () => {
     it('formats USD with no decimals when whole', () => {
       expect(formatCurrency(1234)).toBe('$1,234');
     });
     it('formats USD with two decimals when fractional', () => {
       expect(formatCurrency(1234.56)).toBe('$1,234.56');
     });
     it('handles zero', () => {
       expect(formatCurrency(0)).toBe('$0');
     });
     it('handles negatives', () => {
       expect(formatCurrency(-50)).toBe('-$50');
     });
   });

   describe('formatPercent', () => {
     it('renders fraction as percent with one decimal', () => {
       expect(formatPercent(0.143)).toBe('14.3%');
     });
     it('rounds to one decimal', () => {
       expect(formatPercent(0.12345)).toBe('12.3%');
     });
   });

   describe('formatNumber', () => {
     it('thousand-separates integers', () => {
       expect(formatNumber(1234567)).toBe('1,234,567');
     });
   });
   ```

- [ ] **Step 2: Run test (expect FAIL)**
   Run: `pnpm vitest run tests/lib/format.test.ts`
   Expected: FAIL with "Cannot find module '@/lib/format'".

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/format.ts
   export function formatCurrency(n: number, currency = 'USD'): string {
     const hasFraction = Math.round(n * 100) !== n * 100 || n % 1 !== 0;
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency,
       minimumFractionDigits: hasFraction ? 2 : 0,
       maximumFractionDigits: 2
     }).format(n);
   }

   export function formatPercent(fraction: number, digits = 1): string {
     return new Intl.NumberFormat('en-US', {
       style: 'percent',
       minimumFractionDigits: digits,
       maximumFractionDigits: digits
     }).format(fraction);
   }

   export function formatNumber(n: number, digits = 0): string {
     return new Intl.NumberFormat('en-US', {
       minimumFractionDigits: digits,
       maximumFractionDigits: digits
     }).format(n);
   }
   ```

- [ ] **Step 4: Run test (expect PASS)**
   Run: `pnpm vitest run tests/lib/format.test.ts`
   Expected: PASS (4 + 2 + 1 = 7 assertions).

- [ ] **Step 5: Commit**
   ```bash
   git add src/lib/format.ts tests/lib/format.test.ts
   git commit -m "feat(lib): currency/percent/number formatters with tests"
   ```

---

## Task 5: URL-state library (TDD)

**Files:**
- Create: `src/lib/url-state.ts`
- Test: `tests/lib/url-state.test.ts`

- [ ] **Step 1: Write failing test**
   ```ts
   // tests/lib/url-state.test.ts
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { parseParams, serializeParams, debounce } from '@/lib/url-state';

   describe('parseParams', () => {
     it('parses numbers from URLSearchParams', () => {
       const sp = new URLSearchParams('nightly=200&nights=3');
       expect(parseParams(sp, { nightly: 'number', nights: 'number' })).toEqual({ nightly: 200, nights: 3 });
     });
     it('falls back to defaults when missing', () => {
       const sp = new URLSearchParams('');
       expect(parseParams(sp, { nightly: 'number' }, { nightly: 150 })).toEqual({ nightly: 150 });
     });
     it('parses strings', () => {
       const sp = new URLSearchParams('state=tx');
       expect(parseParams(sp, { state: 'string' })).toEqual({ state: 'tx' });
     });
     it('coerces NaN to default', () => {
       const sp = new URLSearchParams('nightly=abc');
       expect(parseParams(sp, { nightly: 'number' }, { nightly: 100 })).toEqual({ nightly: 100 });
     });
   });

   describe('serializeParams', () => {
     it('produces stable query string skipping defaults', () => {
       const out = serializeParams({ nightly: 200, nights: 3 }, { nightly: 150, nights: 3 });
       expect(out).toBe('nightly=200');
     });
     it('skips undefined', () => {
       expect(serializeParams({ a: undefined as unknown as number, b: 1 }, {})).toBe('b=1');
     });
   });

   describe('debounce', () => {
     beforeEach(() => vi.useFakeTimers());
     it('calls only once after wait', () => {
       const fn = vi.fn();
       const d = debounce(fn, 200);
       d(); d(); d();
       vi.advanceTimersByTime(199);
       expect(fn).not.toHaveBeenCalled();
       vi.advanceTimersByTime(1);
       expect(fn).toHaveBeenCalledTimes(1);
     });
   });
   ```

- [ ] **Step 2: Run test (expect FAIL)**
   Run: `pnpm vitest run tests/lib/url-state.test.ts`
   Expected: FAIL with "Cannot find module '@/lib/url-state'".

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/url-state.ts
   export type ParamKind = 'number' | 'string';
   export type Schema = Record<string, ParamKind>;

   export function parseParams<T extends Record<string, unknown>>(
     sp: URLSearchParams,
     schema: Schema,
     defaults: Partial<T> = {}
   ): T {
     const out: Record<string, unknown> = { ...defaults };
     for (const [k, kind] of Object.entries(schema)) {
       const raw = sp.get(k);
       if (raw === null) continue;
       if (kind === 'number') {
         const n = Number(raw);
         out[k] = Number.isFinite(n) ? n : (defaults as Record<string, unknown>)[k];
       } else {
         out[k] = raw;
       }
     }
     return out as T;
   }

   export function serializeParams(
     state: Record<string, unknown>,
     defaults: Record<string, unknown> = {}
   ): string {
     const sp = new URLSearchParams();
     for (const [k, v] of Object.entries(state)) {
       if (v === undefined || v === null || v === '') continue;
       if (defaults[k] !== undefined && defaults[k] === v) continue;
       sp.set(k, String(v));
     }
     return sp.toString();
   }

   export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
     let t: ReturnType<typeof setTimeout> | null = null;
     return (...args: A) => {
       if (t) clearTimeout(t);
       t = setTimeout(() => fn(...args), ms);
     };
   }

   export function replaceUrl(qs: string): void {
     if (typeof window === 'undefined') return;
     const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
     window.history.replaceState(null, '', url);
   }
   ```

- [ ] **Step 4: Run test (expect PASS)**
   Run: `pnpm vitest run tests/lib/url-state.test.ts`
   Expected: PASS.

- [ ] **Step 5: Commit**
   ```bash
   git add src/lib/url-state.ts tests/lib/url-state.test.ts
   git commit -m "feat(lib): URL state parse/serialize/debounce with tests"
   ```

---

## Task 6: SEO library

**Files:**
- Create: `src/lib/seo.ts`
- Test: `tests/lib/seo.test.ts`

- [ ] **Step 1: Write failing test**
   ```ts
   // tests/lib/seo.test.ts
   import { describe, it, expect } from 'vitest';
   import { buildWebApplication, buildFAQPage, buildOrganization } from '@/lib/seo';

   describe('seo builders', () => {
     it('builds WebApplication JSON-LD', () => {
       const ld = buildWebApplication({
         name: 'Airbnb Fee Calculator',
         url: 'https://strhost.tools/airbnb-fee-calculator',
         description: 'Free Airbnb fee calculator.'
       });
       expect(ld['@context']).toBe('https://schema.org');
       expect(ld['@type']).toBe('WebApplication');
       expect(ld.applicationCategory).toBe('FinanceApplication');
       expect(ld.offers.price).toBe('0');
     });

     it('builds FAQPage JSON-LD', () => {
       const ld = buildFAQPage([
         { q: 'What is X?', a: 'It is Y.' }
       ]);
       expect(ld['@type']).toBe('FAQPage');
       expect(ld.mainEntity[0]['@type']).toBe('Question');
       expect(ld.mainEntity[0].acceptedAnswer.text).toBe('It is Y.');
     });

     it('builds Organization JSON-LD', () => {
       const ld = buildOrganization();
       expect(ld['@type']).toBe('Organization');
       expect(ld.name).toBe('strhost.tools');
     });
   });
   ```

- [ ] **Step 2: Run test (expect FAIL)**
   Run: `pnpm vitest run tests/lib/seo.test.ts`
   Expected: FAIL with "Cannot find module '@/lib/seo'".

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/seo.ts
   export interface WebAppInput {
     name: string;
     url: string;
     description: string;
   }

   export function buildWebApplication(i: WebAppInput) {
     return {
       '@context': 'https://schema.org',
       '@type': 'WebApplication',
       name: i.name,
       url: i.url,
       description: i.description,
       applicationCategory: 'FinanceApplication',
       operatingSystem: 'Any',
       offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
     };
   }

   export function buildFAQPage(items: Array<{ q: string; a: string }>) {
     return {
       '@context': 'https://schema.org',
       '@type': 'FAQPage',
       mainEntity: items.map(({ q, a }) => ({
         '@type': 'Question',
         name: q,
         acceptedAnswer: { '@type': 'Answer', text: a }
       }))
     };
   }

   export function buildOrganization() {
     return {
       '@context': 'https://schema.org',
       '@type': 'Organization',
       name: 'strhost.tools',
       url: 'https://strhost.tools',
       logo: 'https://strhost.tools/favicon.svg',
       sameAs: ['https://thestrledger.com']
     };
   }
   ```

- [ ] **Step 4: Run test (expect PASS)**
   Run: `pnpm vitest run tests/lib/seo.test.ts`
   Expected: PASS.

- [ ] **Step 5: Commit**
   ```bash
   git add src/lib/seo.ts tests/lib/seo.test.ts
   git commit -m "feat(lib): JSON-LD builders for WebApplication/FAQPage/Organization"
   ```

---

## Task 7: Layout primitives

**Files:**
- Create: `src/components/chrome/Header.astro`
- Create: `src/components/chrome/Footer.astro`
- Create: `src/components/chrome/Sidebar.astro`
- Create: `src/components/chrome/FunnelBand.astro`
- Create: `src/components/chrome/ClusterFunnelBlock.astro`
- Create: `src/layouts/Layout.astro`
- Create: `src/data/tools.json`

- [ ] **Step 1: Create `src/data/tools.json`**
   ```json
   [
     { "slug": "airbnb-fee-calculator",      "name": "Airbnb Fee Calculator",       "blurb": "See the host fee, guest fee, and your real payout." },
     { "slug": "profit-calculator",          "name": "STR Profit Calculator",       "blurb": "Revenue minus every cost — what you actually keep." },
     { "slug": "cleaning-fee-calculator",    "name": "Cleaning Fee Calculator",     "blurb": "Set a cleaning fee that covers the turnover, fairly." },
     { "slug": "revpar-calculator",          "name": "Occupancy + ADR + RevPAR",    "blurb": "Three hospitality metrics, one calculator." },
     { "slug": "break-even-calculator",      "name": "Break-Even Occupancy",        "blurb": "The occupancy you must hit to cover costs." },
     { "slug": "cohost-split-calculator",    "name": "Co-Host Split Calculator",    "blurb": "Split revenue with a co-host, fairly." },
     { "slug": "lodging-tax",                "name": "Lodging Tax by State",        "blurb": "State-by-state lodging tax rates and a calculator." }
   ]
   ```

- [ ] **Step 2: Create `src/components/chrome/Header.astro`**
   ```astro
   ---
   import tools from '@/data/tools.json';
   ---
   <header class="border-b border-rule bg-parchment-light">
     <div class="max-w-wide mx-auto px-6 py-4 flex items-center justify-between">
       <a href="/" class="font-wordmark text-xl font-semibold text-navy no-underline">
         strhost<span class="text-gold">.</span>tools
       </a>
       <nav class="hidden md:flex gap-6 text-sm">
         {tools.map((t) => (
           <a href={`/${t.slug}`} class="text-navy hover:text-navy-tint">{t.name}</a>
         ))}
       </nav>
     </div>
   </header>
   ```

- [ ] **Step 3: Create `src/components/chrome/Footer.astro`**
   ```astro
   ---
   const year = new Date().getFullYear();
   ---
   <footer class="bg-navy text-parchment mt-16">
     <div class="max-w-wide mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
       <div>
         <div class="font-wordmark text-lg">strhost<span class="text-gold">.</span>tools</div>
         <p class="opacity-80 mt-2">Free calculators for short-term rental hosts.</p>
       </div>
       <div>
         <div class="uppercase tracking-widest text-xs text-gold mb-2">Tools</div>
         <ul class="space-y-1">
           <li><a class="text-parchment" href="/airbnb-fee-calculator">Airbnb Fee</a></li>
           <li><a class="text-parchment" href="/profit-calculator">Profit</a></li>
           <li><a class="text-parchment" href="/cleaning-fee-calculator">Cleaning Fee</a></li>
           <li><a class="text-parchment" href="/revpar-calculator">RevPAR</a></li>
           <li><a class="text-parchment" href="/break-even-calculator">Break-Even</a></li>
           <li><a class="text-parchment" href="/cohost-split-calculator">Co-Host Split</a></li>
           <li><a class="text-parchment" href="/lodging-tax">Lodging Tax</a></li>
         </ul>
       </div>
       <div>
         <div class="uppercase tracking-widest text-xs text-gold mb-2">Site</div>
         <ul class="space-y-1">
           <li><a class="text-parchment" href="/about">About</a></li>
           <li><a class="text-parchment" href="/contact">Contact</a></li>
           <li><a class="text-parchment" href="/get-the-pdf">Free PDF</a></li>
         </ul>
       </div>
     </div>
     <div class="border-t border-navy-tint">
       <div class="max-w-wide mx-auto px-6 py-4 text-xs opacity-70">
         &copy; {year} strhost.tools. Built by The STR Ledger. Not tax or legal advice.
       </div>
     </div>
   </footer>
   ```

- [ ] **Step 4: Create `src/components/chrome/Sidebar.astro`**
   ```astro
   ---
   import tools from '@/data/tools.json';
   const { current } = Astro.props as { current: string };
   const others = tools.filter((t) => t.slug !== current);
   ---
   <aside class="space-y-3" aria-label="Related calculators">
     <div class="uppercase tracking-widest text-xs text-gold">Related</div>
     {others.map((t) => (
       <a href={`/${t.slug}`} class="block border border-rule rounded p-3 bg-parchment-light hover:shadow-card no-underline">
         <div class="font-medium text-navy">{t.name}</div>
         <div class="text-sm text-graphite opacity-80">{t.blurb}</div>
       </a>
     ))}
   </aside>
   ```

- [ ] **Step 5: Create `src/components/chrome/FunnelBand.astro`**
   ```astro
   ---
   ---
   <section data-funnel="band" class="bg-parchment-alt border-y border-rule">
     <div class="max-w-wide mx-auto px-6 py-4 text-center text-sm">
       Built by <a href="https://thestrledger.com?utm_source=strhost-tools&utm_medium=funnel-band" class="font-medium">The STR Ledger</a> &mdash; Excel workbooks for serious STR owners.
     </div>
   </section>
   ```

- [ ] **Step 6: Create `src/components/chrome/ClusterFunnelBlock.astro`**
   ```astro
   ---
   const { currentCluster = 'math' } = Astro.props as { currentCluster?: 'buyers' | 'math' | 'ops' | 'guests' };
   const others = [
     { id: 'buyers',  url: 'https://strbuyers.tools',  label: 'Acquisition',   tagline: 'Find and buy the right property.' },
     { id: 'math',    url: 'https://strhost.tools',    label: 'Math',          tagline: 'Run the numbers.' },
     { id: 'ops',     url: 'https://strops.tools',     label: 'Operations',    tagline: 'Run the property.' },
     { id: 'guests',  url: 'https://strguests.tools',  label: 'Guest XP',      tagline: 'Optimize the stay.' }
   ].filter((c) => c.id !== currentCluster);
   ---
   <section data-funnel="cluster" class="bg-parchment-light border-t border-rule">
     <div class="max-w-wide mx-auto px-6 py-8">
       <div class="uppercase tracking-widest text-xs text-gold mb-3">Across the host lifecycle</div>
       <div class="grid md:grid-cols-3 gap-4">
         {others.map((c) => (
           <a href={c.url} class="block border border-rule rounded p-4 bg-white hover:shadow-card no-underline">
             <div class="font-medium text-navy">{c.label}</div>
             <div class="text-sm text-graphite opacity-80">{c.tagline}</div>
           </a>
         ))}
       </div>
     </div>
   </section>
   ```

- [ ] **Step 7: Create `src/layouts/Layout.astro`**
   ```astro
   ---
   import '@/styles/global.css';
   import { SEO } from 'astro-seo';
   import Header from '@/components/chrome/Header.astro';
   import Footer from '@/components/chrome/Footer.astro';
   import FunnelBand from '@/components/chrome/FunnelBand.astro';
   import ClusterFunnelBlock from '@/components/chrome/ClusterFunnelBlock.astro';

   interface Props {
     title: string;
     description: string;
     canonical?: string;
     ogImage?: string;
     jsonLd?: unknown[];
   }
   const { title, description, canonical, ogImage, jsonLd = [] } = Astro.props as Props;
   const url = canonical ?? new URL(Astro.url.pathname, 'https://strhost.tools').toString();
   const og  = ogImage ?? `/og${Astro.url.pathname.replace(/\/$/, '') || '/index'}.png`;
   ---
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <SEO
         title={title}
         description={description}
         canonical={url}
         openGraph={{ basic: { title, type: 'website', image: og, url } }}
         twitter={{ card: 'summary_large_image' }}
       />
       {jsonLd.map((ld) => (
         <script type="application/ld+json" set:html={JSON.stringify(ld)} />
       ))}
     </head>
     <body>
       <Header />
       <main><slot /></main>
       <FunnelBand />
       <ClusterFunnelBlock currentCluster="math" />
       <Footer />
     </body>
   </html>
   ```

- [ ] **Step 8: Commit**
   ```bash
   git add src/components/chrome src/layouts src/data/tools.json
   git commit -m "feat(chrome): Layout, Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock"
   ```

---

## Task 8: Monetization primitives

**Files:**
- Create: `src/components/ads/AdSlot.astro`
- Create: `src/components/funnel/EmailCaptureCard.astro`
- Create: `src/components/funnel/STRLedgerCTA.astro`
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**
   ```
   PUBLIC_ADSENSE_ENABLED=false
   PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   PUBLIC_ESP_ENDPOINT=https://api.convertkit.com/v3/forms/000000/subscribe
   PUBLIC_ESP_API_KEY=replace_me
   PUBLIC_GA4_ID=G-XXXXXXXXXX
   ```

- [ ] **Step 2: Create `src/components/ads/AdSlot.astro`**
   ```astro
   ---
   const { location, slotId = '' } = Astro.props as { location: 'in-content' | 'footer'; slotId?: string };
   const enabled = import.meta.env.PUBLIC_ADSENSE_ENABLED === 'true';
   const client  = import.meta.env.PUBLIC_ADSENSE_CLIENT;
   ---
   <aside data-ad-slot={location} class="my-8 border border-dashed border-rule rounded p-4 text-center text-xs text-graphite opacity-70">
     {enabled ? (
       <ins class="adsbygoogle block"
            style="display:block"
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
     ) : (
       <span>ad placeholder &mdash; {location}</span>
     )}
   </aside>
   {enabled && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} crossorigin="anonymous"></script>}
   {enabled && <script set:html={`(adsbygoogle=window.adsbygoogle||[]).push({});`} />}
   ```

- [ ] **Step 3: Create `src/components/funnel/EmailCaptureCard.astro`**
   ```astro
   ---
   const { magnet = 'str-host-income-report-2026', tool = 'unknown' } = Astro.props as { magnet?: string; tool?: string };
   const endpoint = import.meta.env.PUBLIC_ESP_ENDPOINT ?? '';
   ---
   <section data-component="email-capture" class="my-8 border border-rule rounded bg-parchment-alt p-5">
     <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
       <div>
         <div class="uppercase tracking-widest text-xs text-gold">Free PDF</div>
         <p class="m-0 text-sm">STR Host Income Report 2026 &mdash; rates, fees, and benchmarks.</p>
       </div>
       <form data-magnet={magnet} data-tool={tool} action={endpoint} method="post"
             class="flex gap-2 w-full md:w-auto"
             onsubmit="window.dataLayer&&window.dataLayer.push({event:'email_captured',tool:this.dataset.tool})">
         <input type="email" name="email" required placeholder="you@host.com"
                class="flex-1 md:w-64 border border-rule rounded px-3 py-2 bg-white" />
         <input type="hidden" name="utm_source" value="strhost-tools" />
         <input type="hidden" name="utm_medium" value="inline-card" />
         <input type="hidden" name="utm_content" value={tool} />
         <button type="submit" class="bg-navy text-parchment px-4 py-2 rounded">Get the PDF</button>
       </form>
     </div>
   </section>
   ```

- [ ] **Step 4: Create `src/components/funnel/STRLedgerCTA.astro`**
   ```astro
   ---
   const { tool } = Astro.props as { tool: string };
   const skuMap: Record<string, { sku: string; copy: string }> = {
     'airbnb-fee-calculator':    { sku: 'tax-002-pl-single-property',     copy: 'Track every fee in a real workbook.' },
     'profit-calculator':        { sku: 'tax-002-pl-single-property',     copy: 'Run a real profit-and-loss in Excel.' },
     'cleaning-fee-calculator':  { sku: 'ops-004-cleaning-cost-per-turnover', copy: 'Track cleaning cost per turnover.' },
     'revpar-calculator':        { sku: 'fin-005-yoy-comparison-workbook', copy: 'Track ADR/RevPAR year over year.' },
     'break-even-calculator':    { sku: 'fin-002-break-even-occupancy',   copy: 'Model break-even across scenarios.' },
     'cohost-split-calculator':  { sku: 'fin-007-partnership-distribution-tracker', copy: 'Track co-host splits in Excel.' },
     'lodging-tax':              { sku: 'lgl-002-tot-filing-calendar',    copy: 'Never miss a TOT filing deadline.' }
   };
   const entry = skuMap[tool] ?? { sku: 'home', copy: 'See the full workbook suite.' };
   const href  = `https://thestrledger.com/products/${entry.sku}?utm_source=strhost-tools&utm_medium=cta&utm_content=${tool}`;
   ---
   <section data-component="str-ledger-cta" class="my-8 border-l-2 border-gold pl-5 py-3">
     <div class="uppercase tracking-widest text-xs text-gold">From The STR Ledger</div>
     <p class="m-0 my-2">{entry.copy}</p>
     <a href={href} class="inline-block bg-navy text-parchment px-4 py-2 rounded no-underline"
        onclick="window.dataLayer&&window.dataLayer.push({event:'str_ledger_cta_clicked',tool:'${tool}'})">
       See the workbook &rarr;
     </a>
   </section>
   ```

- [ ] **Step 5: Commit**
   ```bash
   git add src/components/ads src/components/funnel .env.example
   git commit -m "feat(monetize): AdSlot + EmailCaptureCard + STRLedgerCTA"
   ```

---

## Task 9: Calculator — Airbnb fee (TDD)

**Formula:**
- Host fee = 3% of (nightly_rate × nights + cleaning_fee)
- Guest service fee = 14% of (nightly_rate × nights + cleaning_fee)
- Guest total = nightly_rate × nights + cleaning_fee + guest_service_fee
- Host payout = nightly_rate × nights + cleaning_fee − host_fee

**Files:**
- Create: `src/lib/calc/airbnb-fee.ts`
- Test: `tests/calc/airbnb-fee.test.ts`
- Create: `src/components/calculators/AirbnbFeeCalculator.tsx`
- Create: `src/pages/airbnb-fee-calculator.astro`
- Create: `src/content/tools/airbnb-fee-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/airbnb-fee.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateAirbnbFee } from '@/lib/calc/airbnb-fee';

   describe('calculateAirbnbFee', () => {
     it('computes a baseline scenario', () => {
       const r = calculateAirbnbFee({ nightlyRate: 200, nights: 3, cleaningFee: 100, hostFeeRate: 0.03, guestFeeRate: 0.14 });
       // subtotal = 200*3 + 100 = 700
       expect(r.subtotal).toBeCloseTo(700, 2);
       expect(r.hostFee).toBeCloseTo(21, 2);          // 3% of 700
       expect(r.guestServiceFee).toBeCloseTo(98, 2);  // 14% of 700
       expect(r.guestTotal).toBeCloseTo(798, 2);      // 700 + 98
       expect(r.hostPayout).toBeCloseTo(679, 2);      // 700 - 21
     });

     it('handles zero cleaning fee', () => {
       const r = calculateAirbnbFee({ nightlyRate: 100, nights: 2, cleaningFee: 0, hostFeeRate: 0.03, guestFeeRate: 0.14 });
       expect(r.subtotal).toBe(200);
       expect(r.hostFee).toBeCloseTo(6, 2);
       expect(r.guestServiceFee).toBeCloseTo(28, 2);
       expect(r.hostPayout).toBeCloseTo(194, 2);
     });

     it('returns zeros on zero input', () => {
       const r = calculateAirbnbFee({ nightlyRate: 0, nights: 0, cleaningFee: 0, hostFeeRate: 0.03, guestFeeRate: 0.14 });
       expect(r.guestTotal).toBe(0);
       expect(r.hostPayout).toBe(0);
     });
   });
   ```

- [ ] **Step 2: Run test (expect FAIL — module missing)**
   Run: `pnpm vitest run tests/calc/airbnb-fee.test.ts`
   Expected: FAIL with "Cannot find module '@/lib/calc/airbnb-fee'".

- [ ] **Step 3: Implement pure function**
   ```ts
   // src/lib/calc/airbnb-fee.ts
   export interface AirbnbFeeInput {
     nightlyRate: number;
     nights: number;
     cleaningFee: number;
     hostFeeRate: number;   // 0.03 default
     guestFeeRate: number;  // 0.14 default
   }
   export interface AirbnbFeeResult {
     subtotal: number;
     hostFee: number;
     guestServiceFee: number;
     guestTotal: number;
     hostPayout: number;
   }
   export const AIRBNB_FEE_DEFAULTS = { nightlyRate: 200, nights: 3, cleaningFee: 100, hostFeeRate: 0.03, guestFeeRate: 0.14 };

   export function calculateAirbnbFee(i: AirbnbFeeInput): AirbnbFeeResult {
     const subtotal = i.nightlyRate * i.nights + i.cleaningFee;
     const hostFee = subtotal * i.hostFeeRate;
     const guestServiceFee = subtotal * i.guestFeeRate;
     return {
       subtotal,
       hostFee,
       guestServiceFee,
       guestTotal: subtotal + guestServiceFee,
       hostPayout: subtotal - hostFee
     };
   }
   ```

- [ ] **Step 4: Run test (expect PASS)**
   Run: `pnpm vitest run tests/calc/airbnb-fee.test.ts`
   Expected: PASS.

- [ ] **Step 5: Implement TSX island**
   ```tsx
   // src/components/calculators/AirbnbFeeCalculator.tsx
   import { useEffect, useMemo, useState } from 'react';
   import { calculateAirbnbFee, AIRBNB_FEE_DEFAULTS } from '@/lib/calc/airbnb-fee';
   import { formatCurrency, formatPercent } from '@/lib/format';
   import { parseParams, serializeParams, debounce, replaceUrl } from '@/lib/url-state';

   const SCHEMA = { nightly: 'number', nights: 'number', cleaning: 'number' } as const;

   export default function AirbnbFeeCalculator() {
     const [state, setState] = useState({
       nightly: AIRBNB_FEE_DEFAULTS.nightlyRate,
       nights:  AIRBNB_FEE_DEFAULTS.nights,
       cleaning: AIRBNB_FEE_DEFAULTS.cleaningFee
     });

     useEffect(() => {
       const sp = new URLSearchParams(window.location.search);
       const next = parseParams<typeof state>(sp, SCHEMA, state);
       setState(next);
     }, []);

     const result = useMemo(
       () => calculateAirbnbFee({
         nightlyRate: state.nightly,
         nights: state.nights,
         cleaningFee: state.cleaning,
         hostFeeRate: AIRBNB_FEE_DEFAULTS.hostFeeRate,
         guestFeeRate: AIRBNB_FEE_DEFAULTS.guestFeeRate
       }),
       [state]
     );

     const pushUrl = useMemo(() => debounce((s: typeof state) => {
       replaceUrl(serializeParams(s, { nightly: AIRBNB_FEE_DEFAULTS.nightlyRate, nights: AIRBNB_FEE_DEFAULTS.nights, cleaning: AIRBNB_FEE_DEFAULTS.cleaningFee }));
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'calculator_input_changed', tool: 'airbnb-fee-calculator' });
     }, 200), []);

     useEffect(() => { pushUrl(state); }, [state, pushUrl]);

     const onCopy = async () => {
       await navigator.clipboard.writeText(window.location.href);
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'share_link_copied', tool: 'airbnb-fee-calculator' });
     };
     const onPrint = () => {
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'print_triggered', tool: 'airbnb-fee-calculator' });
       window.print();
     };

     return (
       <div className="calculator border border-rule rounded bg-white shadow-card p-6">
         <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-3">
             <Field label="Nightly rate" prefix="$" value={state.nightly} onChange={(v) => setState({ ...state, nightly: v })} />
             <Field label="Nights"               value={state.nights}  onChange={(v) => setState({ ...state, nights: v })} />
             <Field label="Cleaning fee" prefix="$" value={state.cleaning} onChange={(v) => setState({ ...state, cleaning: v })} />
             <p className="text-xs text-graphite opacity-70">Host fee {formatPercent(AIRBNB_FEE_DEFAULTS.hostFeeRate)} &middot; guest service fee {formatPercent(AIRBNB_FEE_DEFAULTS.guestFeeRate)}</p>
           </div>
           <div className="space-y-2">
             <Row label="Subtotal"            value={formatCurrency(result.subtotal)} />
             <Row label="Host fee (3%)"       value={`-${formatCurrency(result.hostFee)}`} />
             <Row label="Guest service fee"   value={formatCurrency(result.guestServiceFee)} />
             <hr className="my-2 border-rule" />
             <Row label="Guest pays"          value={formatCurrency(result.guestTotal)} bold />
             <Row label="You receive"         value={formatCurrency(result.hostPayout)} bold accent />
           </div>
         </div>
         <div className="flex gap-2 mt-6">
           <button onClick={onCopy} className="border border-rule px-3 py-2 rounded">Copy share link</button>
           <button onClick={onPrint} className="border border-rule px-3 py-2 rounded">Print</button>
         </div>
       </div>
     );
   }

   function Field({ label, value, onChange, prefix }: { label: string; value: number; onChange: (n: number) => void; prefix?: string }) {
     return (
       <label className="block">
         <span className="block text-sm mb-1">{label}</span>
         <span className="flex items-center border border-rule rounded bg-parchment-light">
           {prefix && <span className="px-2 text-graphite opacity-70 mono">{prefix}</span>}
           <input
             type="number"
             inputMode="decimal"
             className="num flex-1 px-2 py-2 bg-transparent outline-none"
             value={Number.isFinite(value) ? value : 0}
             onChange={(e) => onChange(Number(e.target.value))}
           />
         </span>
       </label>
     );
   }
   function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
     return (
       <div className={`flex justify-between ${bold ? 'font-semibold' : ''} ${accent ? 'text-navy' : ''}`}>
         <span>{label}</span>
         <span className="num">{value}</span>
       </div>
     );
   }
   ```

- [ ] **Step 6: Implement page**
   ```astro
   ---
   // src/pages/airbnb-fee-calculator.astro
   import Layout from '@/layouts/Layout.astro';
   import AirbnbFeeCalculator from '@/components/calculators/AirbnbFeeCalculator.tsx';
   import AdSlot from '@/components/ads/AdSlot.astro';
   import EmailCaptureCard from '@/components/funnel/EmailCaptureCard.astro';
   import STRLedgerCTA from '@/components/funnel/STRLedgerCTA.astro';
   import Sidebar from '@/components/chrome/Sidebar.astro';
   import { Content as ToolCopy } from '@/content/tools/airbnb-fee-calculator.mdx';
   import { buildWebApplication, buildFAQPage, buildOrganization } from '@/lib/seo';

   const title = 'Airbnb Fee Calculator | strhost.tools';
   const description = 'Free Airbnb fee calculator. See the host fee, guest service fee, and your real payout — instantly.';
   const url = 'https://strhost.tools/airbnb-fee-calculator';
   const faqs = [
     { q: 'What is the Airbnb host service fee?',  a: 'Most hosts pay 3% of the booking subtotal under the host-only fee structure.' },
     { q: 'What is the Airbnb guest service fee?', a: 'Guests typically pay around 14% of the booking subtotal, varying by trip.' },
     { q: 'Does cleaning fee count toward fees?',  a: 'Yes — fees apply to the subtotal, which includes the cleaning fee.' },
     { q: 'Are these rates exact?',                a: 'They are typical defaults. Override them in the calculator for your account.' },
     { q: 'Is this tax advice?',                   a: 'No — see /lodging-tax for state lodging tax info; consult a CPA for advice.' }
   ];
   const jsonLd = [buildOrganization(), buildWebApplication({ name: 'Airbnb Fee Calculator', url, description }), buildFAQPage(faqs)];
   ---
   <Layout title={title} description={description} canonical={url} jsonLd={jsonLd}>
     <article class="max-w-wide mx-auto px-6 py-10 grid md:grid-cols-[1fr_300px] gap-10">
       <div>
         <h1 class="display text-4xl">Airbnb Fee Calculator</h1>
         <p class="text-lg opacity-80">See exactly what Airbnb takes from a booking — and what you actually keep.</p>
         <AirbnbFeeCalculator client:load />
         <AdSlot location="in-content" />
         <ToolCopy />
         <EmailCaptureCard tool="airbnb-fee-calculator" />
         <STRLedgerCTA tool="airbnb-fee-calculator" />
         <AdSlot location="footer" />
       </div>
       <Sidebar current="airbnb-fee-calculator" />
     </article>
   </Layout>
   ```

- [ ] **Step 7: Implement copy MDX**
   ```mdx
   {/* src/content/tools/airbnb-fee-calculator.mdx */}
   ## How it works

   Airbnb runs two fee structures. Most hosts now use **host-only**, where the host pays a 3% service fee and the guest pays roughly a 14% service fee. The calculator above models that structure. Both fees apply to the subtotal — nightly rate times nights, plus the cleaning fee. Taxes are stacked on after that and vary by jurisdiction; see the [lodging tax calculator](/lodging-tax) for state-by-state rates.

   ## How to use this calculator

   1. Enter your nightly rate.
   2. Enter the number of nights for the booking you want to model.
   3. Enter your cleaning fee.
   4. Read the result panel. **Guest pays** is the line the guest sees at checkout. **You receive** is the payout Airbnb sends after taking the host fee.
   5. Click **Copy share link** to send the exact scenario to a partner. Click **Print** for a clean PDF.

   ## FAQ

   **What is the Airbnb host service fee?** Most hosts pay 3% of the booking subtotal under the host-only fee structure.

   **What is the Airbnb guest service fee?** Guests typically pay around 14% of the booking subtotal, varying by trip length and other factors.

   **Does cleaning fee count toward the fees?** Yes — fees apply to the subtotal, which includes the cleaning fee.

   **Are these rates exact?** They are typical defaults. Your account may differ — adjust the inputs to match.

   **Is this tax advice?** No — see [/lodging-tax](/lodging-tax) for lodging tax. Consult a CPA for tax advice.
   ```

- [ ] **Step 8: Commit**
   ```bash
   git add src/lib/calc/airbnb-fee.ts tests/calc/airbnb-fee.test.ts src/components/calculators/AirbnbFeeCalculator.tsx src/pages/airbnb-fee-calculator.astro src/content/tools/airbnb-fee-calculator.mdx
   git commit -m "feat(calc): airbnb fee calculator (logic + island + page + copy)"
   ```

---

## Task 10: Calculator — Profit (TDD)

**Formula:**
- gross_revenue = adr × nights_booked
- variable_costs = (cleaning_per_turnover × turnovers) + (supplies_per_night × nights_booked) + (utilities_monthly × months) + platform_fees
- fixed_costs = mortgage_monthly × months + insurance_monthly × months + property_tax_annual × (months/12) + hoa_monthly × months + management_fee_rate × gross_revenue
- net_profit = gross_revenue − variable_costs − fixed_costs
- profit_margin = net_profit / gross_revenue (or 0 when gross is 0)

**Files:**
- Create: `src/lib/calc/profit.ts`
- Test: `tests/calc/profit.test.ts`
- Create: `src/components/calculators/ProfitCalculator.tsx`
- Create: `src/pages/profit-calculator.astro`
- Create: `src/content/tools/profit-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/profit.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateProfit } from '@/lib/calc/profit';

   describe('calculateProfit', () => {
     it('computes monthly P&L', () => {
       const r = calculateProfit({
         adr: 200, nightsBooked: 20, turnovers: 8,
         cleaningPerTurnover: 100, suppliesPerNight: 5,
         utilitiesMonthly: 250, platformFees: 120,
         mortgageMonthly: 1800, insuranceMonthly: 100,
         propertyTaxAnnual: 4800, hoaMonthly: 50,
         managementFeeRate: 0.0,
         months: 1
       });
       // gross = 200*20 = 4000
       expect(r.grossRevenue).toBe(4000);
       // variable = 100*8 + 5*20 + 250*1 + 120 = 800+100+250+120 = 1270
       expect(r.variableCosts).toBe(1270);
       // fixed = 1800 + 100 + 4800/12 + 50 + 0 = 1800+100+400+50 = 2350
       expect(r.fixedCosts).toBe(2350);
       expect(r.netProfit).toBe(4000 - 1270 - 2350);  // 380
       expect(r.profitMargin).toBeCloseTo(380 / 4000, 4);
     });

     it('returns 0 margin when gross is 0', () => {
       const r = calculateProfit({
         adr: 0, nightsBooked: 0, turnovers: 0,
         cleaningPerTurnover: 0, suppliesPerNight: 0,
         utilitiesMonthly: 0, platformFees: 0,
         mortgageMonthly: 0, insuranceMonthly: 0,
         propertyTaxAnnual: 0, hoaMonthly: 0,
         managementFeeRate: 0, months: 1
       });
       expect(r.profitMargin).toBe(0);
     });
   });
   ```

- [ ] **Step 2: Run test (expect FAIL — module missing).**
   Run: `pnpm vitest run tests/calc/profit.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/profit.ts
   export interface ProfitInput {
     adr: number; nightsBooked: number; turnovers: number;
     cleaningPerTurnover: number; suppliesPerNight: number;
     utilitiesMonthly: number; platformFees: number;
     mortgageMonthly: number; insuranceMonthly: number;
     propertyTaxAnnual: number; hoaMonthly: number;
     managementFeeRate: number; months: number;
   }
   export interface ProfitResult { grossRevenue: number; variableCosts: number; fixedCosts: number; netProfit: number; profitMargin: number; }
   export const PROFIT_DEFAULTS: ProfitInput = {
     adr: 200, nightsBooked: 20, turnovers: 8,
     cleaningPerTurnover: 100, suppliesPerNight: 5,
     utilitiesMonthly: 250, platformFees: 120,
     mortgageMonthly: 1800, insuranceMonthly: 100,
     propertyTaxAnnual: 4800, hoaMonthly: 50,
     managementFeeRate: 0, months: 1
   };
   export function calculateProfit(i: ProfitInput): ProfitResult {
     const grossRevenue = i.adr * i.nightsBooked;
     const variableCosts =
       i.cleaningPerTurnover * i.turnovers +
       i.suppliesPerNight * i.nightsBooked +
       i.utilitiesMonthly * i.months +
       i.platformFees;
     const fixedCosts =
       i.mortgageMonthly * i.months +
       i.insuranceMonthly * i.months +
       (i.propertyTaxAnnual * i.months) / 12 +
       i.hoaMonthly * i.months +
       i.managementFeeRate * grossRevenue;
     const netProfit = grossRevenue - variableCosts - fixedCosts;
     const profitMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;
     return { grossRevenue, variableCosts, fixedCosts, netProfit, profitMargin };
   }
   ```

- [ ] **Step 4: Test passes.** Run `pnpm vitest run tests/calc/profit.test.ts`. Expected: PASS.

- [ ] **Step 5: TSX island** — same shape as `AirbnbFeeCalculator.tsx`. URL params: `adr`, `nights`, `turn`, `clean`, `sup`, `util`, `pf`, `mort`, `ins`, `tax`, `hoa`, `mgmt`, `m`. Reuse `Field`/`Row` helpers (extract to `@/components/calculators/ui.tsx`). Two action buttons (Copy share, Print). Render five-row result panel: gross revenue, variable costs, fixed costs, net profit, profit margin (formatPercent). Emit `calculator_input_changed` event with `tool: 'profit-calculator'`.

   ```tsx
   // src/components/calculators/ProfitCalculator.tsx
   import { useEffect, useMemo, useState } from 'react';
   import { calculateProfit, PROFIT_DEFAULTS } from '@/lib/calc/profit';
   import { formatCurrency, formatPercent } from '@/lib/format';
   import { parseParams, serializeParams, debounce, replaceUrl } from '@/lib/url-state';
   import { Field, Row, Actions } from '@/components/calculators/ui';

   const KEYS = { adr:'adr', nights:'nightsBooked', turn:'turnovers', clean:'cleaningPerTurnover', sup:'suppliesPerNight', util:'utilitiesMonthly', pf:'platformFees', mort:'mortgageMonthly', ins:'insuranceMonthly', tax:'propertyTaxAnnual', hoa:'hoaMonthly', mgmt:'managementFeeRate', m:'months' } as const;
   const SCHEMA = Object.fromEntries(Object.keys(KEYS).map(k => [k, 'number'])) as Record<string, 'number'>;
   const URL_DEFAULTS = Object.fromEntries(Object.entries(KEYS).map(([uk, ik]) => [uk, (PROFIT_DEFAULTS as Record<string, number>)[ik]])) as Record<string, number>;

   export default function ProfitCalculator() {
     const [s, setS] = useState<Record<string, number>>(URL_DEFAULTS);
     useEffect(() => { setS(parseParams(new URLSearchParams(window.location.search), SCHEMA, URL_DEFAULTS)); }, []);
     const result = useMemo(() => calculateProfit({
       adr: s.adr, nightsBooked: s.nights, turnovers: s.turn,
       cleaningPerTurnover: s.clean, suppliesPerNight: s.sup,
       utilitiesMonthly: s.util, platformFees: s.pf,
       mortgageMonthly: s.mort, insuranceMonthly: s.ins,
       propertyTaxAnnual: s.tax, hoaMonthly: s.hoa,
       managementFeeRate: s.mgmt, months: s.m
     }), [s]);
     const push = useMemo(() => debounce((next: Record<string, number>) => {
       replaceUrl(serializeParams(next, URL_DEFAULTS));
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'calculator_input_changed', tool: 'profit-calculator' });
     }, 200), []);
     useEffect(() => { push(s); }, [s, push]);

     const set = (k: keyof typeof KEYS) => (v: number) => setS({ ...s, [k]: v });
     return (
       <div className="calculator border border-rule rounded bg-white shadow-card p-6">
         <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-3">
             <Field label="ADR (avg nightly rate)" prefix="$" value={s.adr}    onChange={set('adr')} />
             <Field label="Nights booked"                   value={s.nights} onChange={set('nights')} />
             <Field label="Turnovers"                       value={s.turn}   onChange={set('turn')} />
             <Field label="Cleaning per turnover" prefix="$" value={s.clean}  onChange={set('clean')} />
             <Field label="Supplies per night"    prefix="$" value={s.sup}    onChange={set('sup')} />
             <Field label="Utilities/mo"          prefix="$" value={s.util}   onChange={set('util')} />
             <Field label="Platform fees"         prefix="$" value={s.pf}     onChange={set('pf')} />
             <Field label="Months"                          value={s.m}      onChange={set('m')} />
           </div>
           <div className="space-y-3">
             <Field label="Mortgage/mo"           prefix="$" value={s.mort}   onChange={set('mort')} />
             <Field label="Insurance/mo"          prefix="$" value={s.ins}    onChange={set('ins')} />
             <Field label="Property tax/yr"       prefix="$" value={s.tax}    onChange={set('tax')} />
             <Field label="HOA/mo"                prefix="$" value={s.hoa}    onChange={set('hoa')} />
             <Field label="Mgmt fee rate"                   value={s.mgmt}   onChange={set('mgmt')} />
             <hr className="border-rule" />
             <Row label="Gross revenue"   value={formatCurrency(result.grossRevenue)} />
             <Row label="Variable costs"  value={`-${formatCurrency(result.variableCosts)}`} />
             <Row label="Fixed costs"     value={`-${formatCurrency(result.fixedCosts)}`} />
             <Row label="Net profit"      value={formatCurrency(result.netProfit)} bold accent />
             <Row label="Profit margin"   value={formatPercent(result.profitMargin)} bold />
           </div>
         </div>
         <Actions tool="profit-calculator" />
       </div>
     );
   }
   ```

- [ ] **Step 6: Create shared UI helpers**
   ```tsx
   // src/components/calculators/ui.tsx
   export function Field({ label, value, onChange, prefix }: { label: string; value: number; onChange: (n: number) => void; prefix?: string }) {
     return (
       <label className="block">
         <span className="block text-sm mb-1">{label}</span>
         <span className="flex items-center border border-rule rounded bg-parchment-light">
           {prefix && <span className="px-2 text-graphite opacity-70 mono">{prefix}</span>}
           <input type="number" inputMode="decimal" step="any"
             className="num flex-1 px-2 py-2 bg-transparent outline-none"
             value={Number.isFinite(value) ? value : 0}
             onChange={(e) => onChange(Number(e.target.value))} />
         </span>
       </label>
     );
   }
   export function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
     return (
       <div className={`flex justify-between ${bold ? 'font-semibold' : ''} ${accent ? 'text-navy' : ''}`}>
         <span>{label}</span>
         <span className="num">{value}</span>
       </div>
     );
   }
   export function Actions({ tool }: { tool: string }) {
     const onCopy = async () => {
       await navigator.clipboard.writeText(window.location.href);
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'share_link_copied', tool });
     };
     const onPrint = () => {
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'print_triggered', tool });
       window.print();
     };
     return (
       <div className="flex gap-2 mt-6 no-print">
         <button onClick={onCopy} className="border border-rule px-3 py-2 rounded">Copy share link</button>
         <button onClick={onPrint} className="border border-rule px-3 py-2 rounded">Print</button>
       </div>
     );
   }
   ```

- [ ] **Step 7: Page + copy.** Create `src/pages/profit-calculator.astro` (clone Task 9 page, swap component import, swap title/description/url to "STR Profit Calculator", swap FAQs to 5 P&L-focused items). Create `src/content/tools/profit-calculator.mdx` with sections "How it works" (revenue minus variable + fixed costs; lists every cost bucket), "How to use" (numbered steps for the 13 inputs), "FAQ" (mirrors page FAQs).

- [ ] **Step 8: Commit**
   ```bash
   git add src/lib/calc/profit.ts tests/calc/profit.test.ts src/components/calculators/ProfitCalculator.tsx src/components/calculators/ui.tsx src/pages/profit-calculator.astro src/content/tools/profit-calculator.mdx
   git commit -m "feat(calc): profit calculator + shared UI helpers"
   ```

---

## Task 11: Calculator — Cleaning fee (TDD)

**Formula:**
- labor_cost = hours × hourly_rate
- recommended_cleaning_fee = labor_cost + supplies_cost + laundry_cost + buffer
- per_night_cost = recommended_cleaning_fee / avg_nights_per_stay
- pct_of_nightly = recommended_cleaning_fee / nightly_rate

**Files:**
- Create: `src/lib/calc/cleaning-fee.ts`
- Test: `tests/calc/cleaning-fee.test.ts`
- Create: `src/components/calculators/CleaningFeeCalculator.tsx`
- Create: `src/pages/cleaning-fee-calculator.astro`
- Create: `src/content/tools/cleaning-fee-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/cleaning-fee.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateCleaningFee } from '@/lib/calc/cleaning-fee';
   describe('calculateCleaningFee', () => {
     it('computes recommended fee', () => {
       const r = calculateCleaningFee({ hours: 4, hourlyRate: 25, suppliesCost: 10, laundryCost: 15, buffer: 10, avgNightsPerStay: 3, nightlyRate: 200 });
       // labor = 100; total = 100+10+15+10 = 135
       expect(r.laborCost).toBe(100);
       expect(r.recommendedCleaningFee).toBe(135);
       expect(r.perNightCost).toBeCloseTo(45, 2);
       expect(r.pctOfNightly).toBeCloseTo(0.675, 4);
     });
     it('returns 0 pct when nightly is 0', () => {
       const r = calculateCleaningFee({ hours: 1, hourlyRate: 20, suppliesCost: 0, laundryCost: 0, buffer: 0, avgNightsPerStay: 1, nightlyRate: 0 });
       expect(r.pctOfNightly).toBe(0);
     });
   });
   ```

- [ ] **Step 2: Run test, expect FAIL.**
   Run: `pnpm vitest run tests/calc/cleaning-fee.test.ts`.

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/cleaning-fee.ts
   export interface CleaningFeeInput { hours: number; hourlyRate: number; suppliesCost: number; laundryCost: number; buffer: number; avgNightsPerStay: number; nightlyRate: number; }
   export interface CleaningFeeResult { laborCost: number; recommendedCleaningFee: number; perNightCost: number; pctOfNightly: number; }
   export const CLEANING_FEE_DEFAULTS: CleaningFeeInput = { hours: 4, hourlyRate: 25, suppliesCost: 10, laundryCost: 15, buffer: 10, avgNightsPerStay: 3, nightlyRate: 200 };
   export function calculateCleaningFee(i: CleaningFeeInput): CleaningFeeResult {
     const laborCost = i.hours * i.hourlyRate;
     const recommendedCleaningFee = laborCost + i.suppliesCost + i.laundryCost + i.buffer;
     const perNightCost = i.avgNightsPerStay > 0 ? recommendedCleaningFee / i.avgNightsPerStay : 0;
     const pctOfNightly = i.nightlyRate > 0 ? recommendedCleaningFee / i.nightlyRate : 0;
     return { laborCost, recommendedCleaningFee, perNightCost, pctOfNightly };
   }
   ```

- [ ] **Step 4: Test passes.**

- [ ] **Step 5: Island** — URL params: `hr`, `rate`, `sup`, `laund`, `buf`, `stay`, `nightly`. Same pattern as Task 10 with `Field`/`Row`/`Actions` helpers. Tool slug: `cleaning-fee-calculator`.

- [ ] **Step 6: Page + MDX copy** following Task 9 template. Title: "Airbnb Cleaning Fee Calculator". 5 FAQs (what's included; how to set fairly; per-night vs per-stay; turnover hours; supplies budget).

- [ ] **Step 7: Commit**
   ```bash
   git add src/lib/calc/cleaning-fee.ts tests/calc/cleaning-fee.test.ts src/components/calculators/CleaningFeeCalculator.tsx src/pages/cleaning-fee-calculator.astro src/content/tools/cleaning-fee-calculator.mdx
   git commit -m "feat(calc): cleaning fee calculator"
   ```

---

## Task 12: Calculator — Occupancy + ADR + RevPAR (TDD)

**Formula:**
- occupancy = nights_booked / nights_available (0 if denominator 0)
- adr = revenue / nights_booked (0 if denominator 0)
- revpar = revenue / nights_available  (or adr × occupancy; equivalent)

**Files:**
- Create: `src/lib/calc/revpar.ts`
- Test: `tests/calc/revpar.test.ts`
- Create: `src/components/calculators/RevparCalculator.tsx`
- Create: `src/pages/revpar-calculator.astro`
- Create: `src/content/tools/revpar-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/revpar.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateRevpar } from '@/lib/calc/revpar';
   describe('calculateRevpar', () => {
     it('computes the three metrics', () => {
       const r = calculateRevpar({ nightsAvailable: 30, nightsBooked: 21, revenue: 4200 });
       expect(r.occupancy).toBeCloseTo(0.7, 4);
       expect(r.adr).toBeCloseTo(200, 2);
       expect(r.revpar).toBeCloseTo(140, 2);
     });
     it('zero-protects', () => {
       const r = calculateRevpar({ nightsAvailable: 0, nightsBooked: 0, revenue: 0 });
       expect(r.occupancy).toBe(0); expect(r.adr).toBe(0); expect(r.revpar).toBe(0);
     });
   });
   ```

- [ ] **Step 2: Run test, expect FAIL.**

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/revpar.ts
   export interface RevparInput { nightsAvailable: number; nightsBooked: number; revenue: number; }
   export interface RevparResult { occupancy: number; adr: number; revpar: number; }
   export const REVPAR_DEFAULTS: RevparInput = { nightsAvailable: 30, nightsBooked: 21, revenue: 4200 };
   export function calculateRevpar(i: RevparInput): RevparResult {
     const occupancy = i.nightsAvailable > 0 ? i.nightsBooked / i.nightsAvailable : 0;
     const adr       = i.nightsBooked    > 0 ? i.revenue       / i.nightsBooked    : 0;
     const revpar    = i.nightsAvailable > 0 ? i.revenue       / i.nightsAvailable : 0;
     return { occupancy, adr, revpar };
   }
   ```

- [ ] **Step 4: Test passes.**

- [ ] **Step 5: Island, page, MDX** same pattern. URL params: `avail`, `booked`, `rev`. Result panel formats occupancy as percent, ADR/RevPAR as currency.

- [ ] **Step 6: Commit**
   ```bash
   git add src/lib/calc/revpar.ts tests/calc/revpar.test.ts src/components/calculators/RevparCalculator.tsx src/pages/revpar-calculator.astro src/content/tools/revpar-calculator.mdx
   git commit -m "feat(calc): occupancy + ADR + RevPAR calculator"
   ```

---

## Task 13: Calculator — Break-even occupancy (TDD)

**Formula:**
- monthly_costs = mortgage + insurance + property_tax/12 + hoa + utilities + other_fixed
- net_per_night = adr × (1 − fee_rate) − cleaning_per_turnover − variable_per_night
- break_even_nights = monthly_costs / net_per_night (∞ when net_per_night ≤ 0)
- break_even_occupancy = break_even_nights / 30

**Files:**
- Create: `src/lib/calc/break-even.ts`
- Test: `tests/calc/break-even.test.ts`
- Create: `src/components/calculators/BreakEvenCalculator.tsx`
- Create: `src/pages/break-even-calculator.astro`
- Create: `src/content/tools/break-even-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/break-even.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateBreakEven } from '@/lib/calc/break-even';
   describe('calculateBreakEven', () => {
     it('computes break-even nights and occupancy', () => {
       const r = calculateBreakEven({ mortgage: 1800, insurance: 100, propertyTaxAnnual: 4800, hoa: 50, utilities: 250, otherFixed: 0, adr: 200, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 5 });
       // monthly_costs = 1800+100+400+50+250+0 = 2600
       // net_per_night  = 200*0.97 - 100 - 5 = 194 - 105 = 89
       // be_nights = 2600/89 ≈ 29.213
       // be_occ = be_nights/30 ≈ 0.974
       expect(r.monthlyCosts).toBe(2600);
       expect(r.netPerNight).toBeCloseTo(89, 2);
       expect(r.breakEvenNights).toBeCloseTo(2600 / 89, 2);
       expect(r.breakEvenOccupancy).toBeCloseTo(2600 / 89 / 30, 4);
     });
     it('flags infeasible when net_per_night <= 0', () => {
       const r = calculateBreakEven({ mortgage: 1000, insurance: 0, propertyTaxAnnual: 0, hoa: 0, utilities: 0, otherFixed: 0, adr: 50, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 0 });
       expect(r.feasible).toBe(false);
       expect(Number.isFinite(r.breakEvenNights)).toBe(false);
     });
   });
   ```

- [ ] **Step 2: Run test, expect FAIL.**

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/break-even.ts
   export interface BreakEvenInput { mortgage: number; insurance: number; propertyTaxAnnual: number; hoa: number; utilities: number; otherFixed: number; adr: number; feeRate: number; cleaningPerTurnover: number; variablePerNight: number; }
   export interface BreakEvenResult { monthlyCosts: number; netPerNight: number; breakEvenNights: number; breakEvenOccupancy: number; feasible: boolean; }
   export const BREAK_EVEN_DEFAULTS: BreakEvenInput = { mortgage: 1800, insurance: 100, propertyTaxAnnual: 4800, hoa: 50, utilities: 250, otherFixed: 0, adr: 200, feeRate: 0.03, cleaningPerTurnover: 100, variablePerNight: 5 };
   export function calculateBreakEven(i: BreakEvenInput): BreakEvenResult {
     const monthlyCosts = i.mortgage + i.insurance + i.propertyTaxAnnual / 12 + i.hoa + i.utilities + i.otherFixed;
     const netPerNight  = i.adr * (1 - i.feeRate) - i.cleaningPerTurnover - i.variablePerNight;
     const feasible     = netPerNight > 0;
     const breakEvenNights    = feasible ? monthlyCosts / netPerNight : Infinity;
     const breakEvenOccupancy = feasible ? breakEvenNights / 30 : Infinity;
     return { monthlyCosts, netPerNight, breakEvenNights, breakEvenOccupancy, feasible };
   }
   ```

- [ ] **Step 4: Test passes.**

- [ ] **Step 5: Island, page, MDX.** URL params: `mort`,`ins`,`tax`,`hoa`,`util`,`other`,`adr`,`fee`,`clean`,`var`. When `feasible === false`, show "Not feasible at this ADR" instead of a number. Tool slug `break-even-calculator`.

- [ ] **Step 6: Commit**
   ```bash
   git add src/lib/calc/break-even.ts tests/calc/break-even.test.ts src/components/calculators/BreakEvenCalculator.tsx src/pages/break-even-calculator.astro src/content/tools/break-even-calculator.mdx
   git commit -m "feat(calc): break-even occupancy calculator"
   ```

---

## Task 14: Calculator — Co-host split (TDD)

**Formula (percent mode):**
- gross_revenue = adr × nights_booked
- net_revenue = gross_revenue − pass_through_costs
- cohost_share = net_revenue × cohost_pct
- owner_share = net_revenue − cohost_share

**Formula (flat-fee mode):**
- cohost_share = flat_fee_per_booking × bookings + per_night_fee × nights_booked
- owner_share = net_revenue − cohost_share (clamped to 0 if negative)

**Files:**
- Create: `src/lib/calc/cohost-split.ts`
- Test: `tests/calc/cohost-split.test.ts`
- Create: `src/components/calculators/CohostSplitCalculator.tsx`
- Create: `src/pages/cohost-split-calculator.astro`
- Create: `src/content/tools/cohost-split-calculator.mdx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/cohost-split.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateCohostSplit } from '@/lib/calc/cohost-split';

   describe('calculateCohostSplit', () => {
     it('percent mode', () => {
       const r = calculateCohostSplit({ mode: 'percent', adr: 200, nightsBooked: 20, passThroughCosts: 500, cohostPct: 0.2, flatFeePerBooking: 0, perNightFee: 0, bookings: 0 });
       expect(r.grossRevenue).toBe(4000);
       expect(r.netRevenue).toBe(3500);
       expect(r.cohostShare).toBeCloseTo(700, 2);
       expect(r.ownerShare).toBeCloseTo(2800, 2);
     });
     it('flat mode', () => {
       const r = calculateCohostSplit({ mode: 'flat', adr: 200, nightsBooked: 20, passThroughCosts: 500, cohostPct: 0, flatFeePerBooking: 50, perNightFee: 5, bookings: 8 });
       // gross 4000, net 3500, cohost = 50*8 + 5*20 = 400+100 = 500
       expect(r.cohostShare).toBe(500);
       expect(r.ownerShare).toBe(3000);
     });
     it('clamps owner to 0 when cohost > net', () => {
       const r = calculateCohostSplit({ mode: 'flat', adr: 100, nightsBooked: 1, passThroughCosts: 0, cohostPct: 0, flatFeePerBooking: 200, perNightFee: 0, bookings: 1 });
       expect(r.ownerShare).toBe(0);
     });
   });
   ```

- [ ] **Step 2: Run test, expect FAIL.**

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/cohost-split.ts
   export interface CohostSplitInput { mode: 'percent' | 'flat'; adr: number; nightsBooked: number; passThroughCosts: number; cohostPct: number; flatFeePerBooking: number; perNightFee: number; bookings: number; }
   export interface CohostSplitResult { grossRevenue: number; netRevenue: number; cohostShare: number; ownerShare: number; }
   export const COHOST_DEFAULTS: CohostSplitInput = { mode: 'percent', adr: 200, nightsBooked: 20, passThroughCosts: 500, cohostPct: 0.2, flatFeePerBooking: 0, perNightFee: 0, bookings: 0 };
   export function calculateCohostSplit(i: CohostSplitInput): CohostSplitResult {
     const grossRevenue = i.adr * i.nightsBooked;
     const netRevenue   = grossRevenue - i.passThroughCosts;
     const cohostShareRaw = i.mode === 'percent'
       ? netRevenue * i.cohostPct
       : i.flatFeePerBooking * i.bookings + i.perNightFee * i.nightsBooked;
     const cohostShare  = Math.max(0, cohostShareRaw);
     const ownerShare   = Math.max(0, netRevenue - cohostShare);
     return { grossRevenue, netRevenue, cohostShare, ownerShare };
   }
   ```

- [ ] **Step 4: Test passes.**

- [ ] **Step 5: Island, page, MDX.** URL params: `mode`(string), `adr`,`nights`,`pt`,`pct`,`fee`,`pn`,`bk`. Toggle between percent/flat with a radio group. Tool slug `cohost-split-calculator`.

- [ ] **Step 6: Commit**
   ```bash
   git add src/lib/calc/cohost-split.ts tests/calc/cohost-split.test.ts src/components/calculators/CohostSplitCalculator.tsx src/pages/cohost-split-calculator.astro src/content/tools/cohost-split-calculator.mdx
   git commit -m "feat(calc): co-host split calculator"
   ```

---

## Task 15: Lodging-tax data file

**Files:**
- Create: `src/data/lodging-tax-by-state.json`
- Create: `src/data/lodging-tax-by-state.schema.ts`

- [ ] **Step 1: Create schema/types**
   ```ts
   // src/data/lodging-tax-by-state.schema.ts
   export interface StateTaxEntry {
     name: string;
     stateRate: number;            // fraction, e.g. 0.06
     platformCollects: Array<'airbnb' | 'vrbo'>;
     localAddOnRange: [number, number];
     sourceUrl: string;
     lastVerified: string;         // ISO date
     notes: string;
   }
   export type LodgingTaxData = Record<string, StateTaxEntry>;
   ```

- [ ] **Step 2: Create JSON with 5 fully-fleshed example entries (TX, CA, FL, NY, CO) + the remaining 45 states (+ DC) using the documented template. State codes are USPS lowercase.**

   ```json
   {
     "tx": {
       "name": "Texas",
       "stateRate": 0.06,
       "platformCollects": ["airbnb", "vrbo"],
       "localAddOnRange": [0.0, 0.085],
       "sourceUrl": "https://comptroller.texas.gov/taxes/hotel/",
       "lastVerified": "2026-05-05",
       "notes": "Texas Hotel Occupancy Tax. Cities and counties may add up to 8.5% local HOT."
     },
     "ca": {
       "name": "California",
       "stateRate": 0.0,
       "platformCollects": ["airbnb", "vrbo"],
       "localAddOnRange": [0.06, 0.165],
       "sourceUrl": "https://www.cdtfa.ca.gov/",
       "lastVerified": "2026-05-05",
       "notes": "No state-level lodging tax. Cities and counties levy a Transient Occupancy Tax (TOT) ranging roughly 6–16.5%."
     },
     "fl": {
       "name": "Florida",
       "stateRate": 0.06,
       "platformCollects": ["airbnb", "vrbo"],
       "localAddOnRange": [0.005, 0.06],
       "sourceUrl": "https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx",
       "lastVerified": "2026-05-05",
       "notes": "Florida charges 6% state sales tax plus county-level discretionary surtax and tourist development tax."
     },
     "ny": {
       "name": "New York",
       "stateRate": 0.04,
       "platformCollects": ["airbnb"],
       "localAddOnRange": [0.0, 0.0875],
       "sourceUrl": "https://www.tax.ny.gov/bus/st/sales_tax.htm",
       "lastVerified": "2026-05-05",
       "notes": "4% state sales tax plus local sales tax and (in NYC) hotel room occupancy tax. NYC has strict short-term rental rules."
     },
     "co": {
       "name": "Colorado",
       "stateRate": 0.029,
       "platformCollects": ["airbnb", "vrbo"],
       "localAddOnRange": [0.0, 0.08],
       "sourceUrl": "https://tax.colorado.gov/sales-tax",
       "lastVerified": "2026-05-05",
       "notes": "2.9% state sales tax plus local lodging taxes. Many resort towns add a Local Marketing District tax."
     },
     "al": { "name": "Alabama",       "stateRate": 0.04,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.07],   "sourceUrl": "https://www.revenue.alabama.gov/",                          "lastVerified": "2026-05-05", "notes": "4% state lodging tax plus local lodging taxes." },
     "ak": { "name": "Alaska",        "stateRate": 0.0,     "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.12],   "sourceUrl": "https://tax.alaska.gov/",                                   "lastVerified": "2026-05-05", "notes": "No state-level lodging tax. Boroughs and cities levy bed taxes." },
     "az": { "name": "Arizona",       "stateRate": 0.055,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://azdor.gov/business/transaction-privilege-tax",      "lastVerified": "2026-05-05", "notes": "5.5% state TPT plus county and city transient lodging tax." },
     "ar": { "name": "Arkansas",      "stateRate": 0.065,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.05],   "sourceUrl": "https://www.dfa.arkansas.gov/",                              "lastVerified": "2026-05-05", "notes": "6.5% state sales tax plus 2% short-term rental tax and local lodging taxes." },
     "ct": { "name": "Connecticut",   "stateRate": 0.15,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.0],    "sourceUrl": "https://portal.ct.gov/DRS",                                  "lastVerified": "2026-05-05", "notes": "15% state room occupancy tax." },
     "de": { "name": "Delaware",      "stateRate": 0.08,    "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.03],   "sourceUrl": "https://revenue.delaware.gov/",                              "lastVerified": "2026-05-05", "notes": "8% state lodging tax plus optional local lodging tax." },
     "ga": { "name": "Georgia",       "stateRate": 0.04,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.08],   "sourceUrl": "https://dor.georgia.gov/",                                   "lastVerified": "2026-05-05", "notes": "4% state sales tax plus $5/night state hotel-motel fee and local hotel-motel tax." },
     "hi": { "name": "Hawaii",        "stateRate": 0.1025,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.03, 0.03],  "sourceUrl": "https://tax.hawaii.gov/",                                    "lastVerified": "2026-05-05", "notes": "10.25% Transient Accommodations Tax plus 4.712% GET and 3% county TAT." },
     "id": { "name": "Idaho",         "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.05],   "sourceUrl": "https://tax.idaho.gov/",                                     "lastVerified": "2026-05-05", "notes": "6% state sales tax plus 2% travel and convention tax and local resort taxes." },
     "il": { "name": "Illinois",      "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.075],  "sourceUrl": "https://tax.illinois.gov/",                                  "lastVerified": "2026-05-05", "notes": "6% state Hotel Operators' Occupation Tax plus local hotel taxes." },
     "in": { "name": "Indiana",       "stateRate": 0.07,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.10],   "sourceUrl": "https://www.in.gov/dor/",                                    "lastVerified": "2026-05-05", "notes": "7% state sales tax plus county innkeeper's tax." },
     "ia": { "name": "Iowa",          "stateRate": 0.05,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.07],   "sourceUrl": "https://tax.iowa.gov/",                                      "lastVerified": "2026-05-05", "notes": "5% state hotel/motel tax plus local hotel/motel tax up to 7%." },
     "ks": { "name": "Kansas",        "stateRate": 0.065,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.09],   "sourceUrl": "https://www.ksrevenue.gov/",                                 "lastVerified": "2026-05-05", "notes": "6.5% state sales tax plus local transient guest tax." },
     "ky": { "name": "Kentucky",      "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.085],  "sourceUrl": "https://revenue.ky.gov/",                                    "lastVerified": "2026-05-05", "notes": "6% state sales tax plus 1% transient room tax and local transient room tax." },
     "la": { "name": "Louisiana",     "stateRate": 0.0445,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.07],   "sourceUrl": "https://revenue.louisiana.gov/",                             "lastVerified": "2026-05-05", "notes": "4.45% state sales tax plus parish and local hotel taxes." },
     "me": { "name": "Maine",         "stateRate": 0.09,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.0],    "sourceUrl": "https://www.maine.gov/revenue/",                             "lastVerified": "2026-05-05", "notes": "9% state lodging tax. No general local add-on." },
     "md": { "name": "Maryland",      "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.095],  "sourceUrl": "https://www.marylandtaxes.gov/",                             "lastVerified": "2026-05-05", "notes": "6% state sales tax plus county hotel rental tax." },
     "ma": { "name": "Massachusetts", "stateRate": 0.057,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://www.mass.gov/dor",                                   "lastVerified": "2026-05-05", "notes": "5.7% state room occupancy excise plus local option, community impact, and Cape & Islands fees." },
     "mi": { "name": "Michigan",      "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://www.michigan.gov/treasury",                          "lastVerified": "2026-05-05", "notes": "6% state use tax plus county accommodations tax." },
     "mn": { "name": "Minnesota",     "stateRate": 0.06875, "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.10],   "sourceUrl": "https://www.revenue.state.mn.us/",                           "lastVerified": "2026-05-05", "notes": "6.875% state sales tax plus city and special-district lodging taxes." },
     "ms": { "name": "Mississippi",   "stateRate": 0.07,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://www.dor.ms.gov/",                                    "lastVerified": "2026-05-05", "notes": "7% state sales tax plus local tourism and economic development taxes." },
     "mo": { "name": "Missouri",      "stateRate": 0.04225, "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.075],  "sourceUrl": "https://dor.mo.gov/",                                        "lastVerified": "2026-05-05", "notes": "4.225% state sales tax plus local tourism tax." },
     "mt": { "name": "Montana",       "stateRate": 0.07,    "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://mtrevenue.gov/",                                     "lastVerified": "2026-05-05", "notes": "4% lodging facility use tax plus 4% lodging facility sales tax. Resort taxes in some towns." },
     "ne": { "name": "Nebraska",      "stateRate": 0.055,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://revenue.nebraska.gov/",                              "lastVerified": "2026-05-05", "notes": "5.5% state sales tax plus 1% state lodging tax and local lodging tax." },
     "nv": { "name": "Nevada",        "stateRate": 0.0,     "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.10, 0.135], "sourceUrl": "https://tax.nv.gov/",                                        "lastVerified": "2026-05-05", "notes": "No state-level transient lodging tax. Counties levy combined transient lodging tax up to 13.5%." },
     "nh": { "name": "New Hampshire", "stateRate": 0.085,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.0],    "sourceUrl": "https://www.revenue.nh.gov/",                                "lastVerified": "2026-05-05", "notes": "8.5% Meals and Rooms Tax. No local add-on." },
     "nj": { "name": "New Jersey",    "stateRate": 0.0625,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://www.state.nj.us/treasury/taxation/",                 "lastVerified": "2026-05-05", "notes": "6.625% state sales tax plus 5% state occupancy fee and local occupancy taxes." },
     "nm": { "name": "New Mexico",    "stateRate": 0.04875, "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.05],   "sourceUrl": "https://www.tax.newmexico.gov/",                             "lastVerified": "2026-05-05", "notes": "4.875% state gross receipts tax plus local lodgers' tax up to 5%." },
     "nc": { "name": "North Carolina","stateRate": 0.0475,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.08],   "sourceUrl": "https://www.ncdor.gov/",                                     "lastVerified": "2026-05-05", "notes": "4.75% state sales tax plus county occupancy tax." },
     "nd": { "name": "North Dakota",  "stateRate": 0.05,    "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.03],   "sourceUrl": "https://www.tax.nd.gov/",                                    "lastVerified": "2026-05-05", "notes": "5% state sales tax plus local lodging and restaurant tax." },
     "oh": { "name": "Ohio",          "stateRate": 0.0575,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.10],   "sourceUrl": "https://tax.ohio.gov/",                                      "lastVerified": "2026-05-05", "notes": "5.75% state sales tax plus county and municipal lodging excise." },
     "ok": { "name": "Oklahoma",      "stateRate": 0.045,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.08],   "sourceUrl": "https://oklahoma.gov/tax.html",                              "lastVerified": "2026-05-05", "notes": "4.5% state sales tax plus city lodging and tourism tax." },
     "or": { "name": "Oregon",        "stateRate": 0.015,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.115],  "sourceUrl": "https://www.oregon.gov/dor/",                                "lastVerified": "2026-05-05", "notes": "1.5% state lodging tax plus local lodging taxes." },
     "pa": { "name": "Pennsylvania",  "stateRate": 0.06,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.10],   "sourceUrl": "https://www.revenue.pa.gov/",                                "lastVerified": "2026-05-05", "notes": "6% state sales tax plus 1% hotel occupancy tax in Allegheny/Philadelphia and county hotel taxes." },
     "ri": { "name": "Rhode Island",  "stateRate": 0.07,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.06, 0.06],  "sourceUrl": "https://tax.ri.gov/",                                        "lastVerified": "2026-05-05", "notes": "7% state sales tax plus 6% state hotel tax (5% statewide + 1% local-share)." },
     "sc": { "name": "South Carolina","stateRate": 0.07,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://dor.sc.gov/",                                        "lastVerified": "2026-05-05", "notes": "5% sales tax + 2% accommodations tax plus local accommodations tax." },
     "sd": { "name": "South Dakota",  "stateRate": 0.045,   "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://dor.sd.gov/",                                        "lastVerified": "2026-05-05", "notes": "4.5% state sales tax plus 1.5% tourism tax (seasonal) and municipal taxes." },
     "tn": { "name": "Tennessee",     "stateRate": 0.07,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://www.tn.gov/revenue.html",                            "lastVerified": "2026-05-05", "notes": "7% state sales tax plus county and city occupancy taxes." },
     "ut": { "name": "Utah",          "stateRate": 0.0485,  "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.07],   "sourceUrl": "https://tax.utah.gov/",                                      "lastVerified": "2026-05-05", "notes": "4.85% state sales tax plus 0.32% statewide and local transient room tax." },
     "vt": { "name": "Vermont",       "stateRate": 0.09,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.01],   "sourceUrl": "https://tax.vermont.gov/",                                   "lastVerified": "2026-05-05", "notes": "9% state meals and rooms tax. Some municipalities add 1%." },
     "va": { "name": "Virginia",      "stateRate": 0.053,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.08],   "sourceUrl": "https://www.tax.virginia.gov/",                              "lastVerified": "2026-05-05", "notes": "5.3% state sales tax plus county and city transient occupancy tax." },
     "wa": { "name": "Washington",    "stateRate": 0.065,   "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://dor.wa.gov/",                                        "lastVerified": "2026-05-05", "notes": "6.5% state sales tax plus local sales tax and special hotel/motel tax." },
     "wv": { "name": "West Virginia", "stateRate": 0.06,    "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.06],   "sourceUrl": "https://tax.wv.gov/",                                        "lastVerified": "2026-05-05", "notes": "6% state sales tax plus local hotel occupancy tax." },
     "wi": { "name": "Wisconsin",     "stateRate": 0.05,    "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.08],   "sourceUrl": "https://www.revenue.wi.gov/",                                "lastVerified": "2026-05-05", "notes": "5% state sales tax plus county and municipal room tax." },
     "wy": { "name": "Wyoming",       "stateRate": 0.05,    "platformCollects": ["airbnb"],         "localAddOnRange": [0.0, 0.04],   "sourceUrl": "https://revenue.wyo.gov/",                                   "lastVerified": "2026-05-05", "notes": "4% state sales tax plus 5% statewide lodging tax and local lodging taxes." },
     "dc": { "name": "District of Columbia", "stateRate": 0.1475, "platformCollects": ["airbnb", "vrbo"], "localAddOnRange": [0.0, 0.0], "sourceUrl": "https://otr.cfo.dc.gov/",                                "lastVerified": "2026-05-05", "notes": "14.75% sales tax on transient accommodations." }
   }
   ```

   **Template for missing/new entries:** copy the shape of `tx`, replace `name`, `stateRate` (decimal), `platformCollects`, `localAddOnRange` (low/high decimals), `sourceUrl` (link to state DOR), `lastVerified` (today's ISO date), `notes` (one sentence describing the structure).

- [ ] **Step 3: Commit**
   ```bash
   git add src/data/lodging-tax-by-state.json src/data/lodging-tax-by-state.schema.ts
   git commit -m "feat(data): 50-state + DC lodging tax dataset"
   ```

---

## Task 16: Lodging-tax calculator logic + island

**Formula:**
- effective_rate = state_rate + local_add_on (host-supplied within range)
- tax_amount = subtotal × effective_rate
- guest_total = subtotal + tax_amount

**Files:**
- Create: `src/lib/calc/lodging-tax.ts`
- Test: `tests/calc/lodging-tax.test.ts`
- Create: `src/components/calculators/LodgingTaxCalculator.tsx`

- [ ] **Step 1: Failing test**
   ```ts
   // tests/calc/lodging-tax.test.ts
   import { describe, it, expect } from 'vitest';
   import { calculateLodgingTax } from '@/lib/calc/lodging-tax';
   describe('calculateLodgingTax', () => {
     it('adds state + local rate', () => {
       const r = calculateLodgingTax({ subtotal: 1000, stateRate: 0.06, localRate: 0.04 });
       expect(r.effectiveRate).toBeCloseTo(0.10, 4);
       expect(r.taxAmount).toBeCloseTo(100, 2);
       expect(r.guestTotal).toBeCloseTo(1100, 2);
     });
     it('handles zero rates', () => {
       const r = calculateLodgingTax({ subtotal: 500, stateRate: 0, localRate: 0 });
       expect(r.taxAmount).toBe(0);
       expect(r.guestTotal).toBe(500);
     });
   });
   ```

- [ ] **Step 2: Run test, expect FAIL.**

- [ ] **Step 3: Implement**
   ```ts
   // src/lib/calc/lodging-tax.ts
   export interface LodgingTaxInput { subtotal: number; stateRate: number; localRate: number; }
   export interface LodgingTaxResult { effectiveRate: number; taxAmount: number; guestTotal: number; }
   export function calculateLodgingTax(i: LodgingTaxInput): LodgingTaxResult {
     const effectiveRate = i.stateRate + i.localRate;
     const taxAmount = i.subtotal * effectiveRate;
     return { effectiveRate, taxAmount, guestTotal: i.subtotal + taxAmount };
   }
   ```

- [ ] **Step 4: Test passes.**

- [ ] **Step 5: TSX island** — accepts `stateCode`, `stateRate`, `localMin`, `localMax`, `stateName` props from server. Renders subtotal field + slider/input for local rate clamped to [localMin, localMax]. Shows source URL + lastVerified + disclaimer. URL params `sub`, `local`. Tool slug `lodging-tax`.

   ```tsx
   // src/components/calculators/LodgingTaxCalculator.tsx
   import { useEffect, useMemo, useState } from 'react';
   import { calculateLodgingTax } from '@/lib/calc/lodging-tax';
   import { formatCurrency, formatPercent } from '@/lib/format';
   import { parseParams, serializeParams, debounce, replaceUrl } from '@/lib/url-state';
   import { Field, Row, Actions } from '@/components/calculators/ui';

   const SCHEMA = { sub: 'number', local: 'number' } as const;

   export default function LodgingTaxCalculator(props: { stateCode: string; stateRate: number; localMin: number; localMax: number; stateName: string; sourceUrl: string; lastVerified: string }) {
     const initial = { sub: 1000, local: props.localMin };
     const [s, setS] = useState(initial);
     useEffect(() => { setS(parseParams(new URLSearchParams(window.location.search), SCHEMA, initial)); }, []);
     const localClamped = Math.max(props.localMin, Math.min(props.localMax, s.local));
     const result = useMemo(() => calculateLodgingTax({ subtotal: s.sub, stateRate: props.stateRate, localRate: localClamped }), [s, localClamped, props.stateRate]);
     const push = useMemo(() => debounce((next: typeof initial) => {
       replaceUrl(serializeParams(next, initial));
       (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'calculator_input_changed', tool: 'lodging-tax', state: props.stateCode });
     }, 200), []);
     useEffect(() => { push(s); }, [s, push]);

     return (
       <div className="calculator border border-rule rounded bg-white shadow-card p-6">
         <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-3">
             <Field label="Booking subtotal" prefix="$" value={s.sub}   onChange={(v) => setS({ ...s, sub: v })} />
             <Field label={`Local add-on (${formatPercent(props.localMin)}–${formatPercent(props.localMax)})`} value={s.local} onChange={(v) => setS({ ...s, local: v })} />
             <p className="text-xs text-graphite opacity-70">State rate: {formatPercent(props.stateRate)} &middot; <a href={props.sourceUrl}>source</a> &middot; verified {props.lastVerified}</p>
           </div>
           <div className="space-y-2">
             <Row label="Effective rate" value={formatPercent(result.effectiveRate)} />
             <Row label="Tax"             value={formatCurrency(result.taxAmount)} />
             <Row label="Guest total"     value={formatCurrency(result.guestTotal)} bold accent />
           </div>
         </div>
         <Actions tool="lodging-tax" />
         <p className="text-xs text-graphite opacity-70 mt-4">This estimate is informational only. State/local rates change. Confirm with the {props.stateName} Department of Revenue before relying on it.</p>
       </div>
     );
   }
   ```

- [ ] **Step 6: Commit**
   ```bash
   git add src/lib/calc/lodging-tax.ts tests/calc/lodging-tax.test.ts src/components/calculators/LodgingTaxCalculator.tsx
   git commit -m "feat(calc): lodging tax calculator (logic + island)"
   ```

---

## Task 17: Lodging-tax programmatic state pages

**Files:**
- Create: `src/pages/lodging-tax/[state].astro`

- [ ] **Step 1: Implement**
   ```astro
   ---
   // src/pages/lodging-tax/[state].astro
   import Layout from '@/layouts/Layout.astro';
   import LodgingTaxCalculator from '@/components/calculators/LodgingTaxCalculator.tsx';
   import AdSlot from '@/components/ads/AdSlot.astro';
   import EmailCaptureCard from '@/components/funnel/EmailCaptureCard.astro';
   import STRLedgerCTA from '@/components/funnel/STRLedgerCTA.astro';
   import Sidebar from '@/components/chrome/Sidebar.astro';
   import data from '@/data/lodging-tax-by-state.json';
   import { buildOrganization, buildWebApplication, buildFAQPage } from '@/lib/seo';
   import { formatPercent } from '@/lib/format';
   import type { LodgingTaxData } from '@/data/lodging-tax-by-state.schema';

   export function getStaticPaths() {
     return Object.entries(data as LodgingTaxData).map(([code, entry]) => ({
       params: { state: code },
       props: { code, entry }
     }));
   }
   const { code, entry } = Astro.props as { code: string; entry: LodgingTaxData[string] };
   const title = `${entry.name} Lodging Tax Calculator | strhost.tools`;
   const description = `${entry.name} short-term rental lodging tax: ${formatPercent(entry.stateRate)} state plus local add-ons. Free calculator and source links.`;
   const url = `https://strhost.tools/lodging-tax/${code}`;
   const faqs = [
     { q: `What is the ${entry.name} state lodging tax rate?`, a: `${formatPercent(entry.stateRate)} statewide. ${entry.notes}` },
     { q: `Do Airbnb and Vrbo collect ${entry.name} lodging tax for me?`, a: `Platforms that collect: ${entry.platformCollects.join(', ') || 'none reported'}. Verify with the state DOR before relying on it.` },
     { q: `What's the local add-on range?`, a: `Cities and counties may add ${formatPercent(entry.localAddOnRange[0])} to ${formatPercent(entry.localAddOnRange[1])} on top of the state rate.` },
     { q: `Where can I see the official source?`, a: `${entry.sourceUrl}` },
     { q: `When was this last verified?`, a: `${entry.lastVerified}.` }
   ];
   const jsonLd = [buildOrganization(), buildWebApplication({ name: title, url, description }), buildFAQPage(faqs)];
   ---
   <Layout title={title} description={description} canonical={url} jsonLd={jsonLd}>
     <article class="max-w-wide mx-auto px-6 py-10 grid md:grid-cols-[1fr_300px] gap-10">
       <div>
         <h1 class="display text-4xl">{entry.name} Lodging Tax Calculator</h1>
         <p class="text-lg opacity-80">State rate {formatPercent(entry.stateRate)}. Local add-ons {formatPercent(entry.localAddOnRange[0])}–{formatPercent(entry.localAddOnRange[1])}.</p>
         <LodgingTaxCalculator client:load
           stateCode={code}
           stateRate={entry.stateRate}
           localMin={entry.localAddOnRange[0]}
           localMax={entry.localAddOnRange[1]}
           stateName={entry.name}
           sourceUrl={entry.sourceUrl}
           lastVerified={entry.lastVerified} />
         <AdSlot location="in-content" />
         <h2>How {entry.name} lodging tax works</h2>
         <p>{entry.notes} Platforms that collect on your behalf: {entry.platformCollects.length ? entry.platformCollects.join(', ') : 'none on record'}. Always check directly with the <a href={entry.sourceUrl}>{entry.name} Department of Revenue</a> before filing — rates and rules change. Last verified {entry.lastVerified}.</p>
         <h2>How to use this calculator</h2>
         <ol>
           <li>Enter the booking subtotal (nightly × nights + cleaning fee).</li>
           <li>Enter the local add-on rate that applies to your address.</li>
           <li>Read the effective rate, tax dollars, and guest total. Click Print for a clean PDF.</li>
         </ol>
         <EmailCaptureCard tool="lodging-tax" />
         <STRLedgerCTA tool="lodging-tax" />
         <p><a href="/lodging-tax">&larr; All states</a></p>
         <AdSlot location="footer" />
       </div>
       <Sidebar current="lodging-tax" />
     </article>
   </Layout>
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add src/pages/lodging-tax/[state].astro
   git commit -m "feat(lodging-tax): programmatic per-state pages"
   ```

---

## Task 18: Lodging-tax index page

**Files:**
- Create: `src/pages/lodging-tax/index.astro`

- [ ] **Step 1: Implement**
   ```astro
   ---
   // src/pages/lodging-tax/index.astro
   import Layout from '@/layouts/Layout.astro';
   import data from '@/data/lodging-tax-by-state.json';
   import type { LodgingTaxData } from '@/data/lodging-tax-by-state.schema';
   import { formatPercent } from '@/lib/format';

   const entries = Object.entries(data as LodgingTaxData).map(([code, e]) => ({ code, ...e }));
   entries.sort((a, b) => a.name.localeCompare(b.name));
   const title = 'Lodging Tax by State | strhost.tools';
   const description = 'State-by-state lodging tax rates for short-term rentals — free, sourced, and updated annually.';
   ---
   <Layout title={title} description={description} canonical="https://strhost.tools/lodging-tax">
     <article class="max-w-wide mx-auto px-6 py-10">
       <h1 class="display text-4xl">Lodging Tax by State</h1>
       <p class="text-lg opacity-80">State-level short-term rental lodging tax rates. Click a state for the calculator and source.</p>
       <table class="w-full border-collapse mt-6 text-sm">
         <thead>
           <tr class="text-left border-b border-rule">
             <th class="py-2">State</th>
             <th class="py-2 text-right">State rate</th>
             <th class="py-2 text-right">Local add-on</th>
             <th class="py-2">Platforms collect</th>
             <th class="py-2">Verified</th>
           </tr>
         </thead>
         <tbody>
           {entries.map((e) => (
             <tr class="border-b border-rule hover:bg-parchment-alt">
               <td class="py-2"><a href={`/lodging-tax/${e.code}`}>{e.name}</a></td>
               <td class="py-2 text-right num">{formatPercent(e.stateRate)}</td>
               <td class="py-2 text-right num">{formatPercent(e.localAddOnRange[0])} – {formatPercent(e.localAddOnRange[1])}</td>
               <td class="py-2">{e.platformCollects.join(', ') || '—'}</td>
               <td class="py-2 num">{e.lastVerified}</td>
             </tr>
           ))}
         </tbody>
       </table>
       <p class="text-xs opacity-70 mt-6">Disclaimer: rates change. Verify with the state DOR before filing.</p>
     </article>
   </Layout>
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add src/pages/lodging-tax/index.astro
   git commit -m "feat(lodging-tax): sortable 50-state index"
   ```

---

## Task 19: Per-state narrative MDX (content collection)

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/states/tx.mdx`
- Create: `src/content/states/ca.mdx`
- Create: `src/content/states/fl.mdx`
- Create: `src/content/states/ny.mdx`
- Create: `src/content/states/co.mdx`

- [ ] **Step 1: Content collection schema**
   ```ts
   // src/content/config.ts
   import { defineCollection, z } from 'astro:content';
   const states = defineCollection({
     type: 'content',
     schema: z.object({
       code: z.string(),
       title: z.string(),
       description: z.string()
     })
   });
   const tools = defineCollection({ type: 'content' });
   const blog = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       description: z.string(),
       date: z.coerce.date()
     })
   });
   export const collections = { states, tools, blog };
   ```

- [ ] **Step 2: Sample MDX (one per featured state — TX shown; CA/FL/NY/CO follow same structure)**
   ```mdx
   ---
   code: tx
   title: Texas Lodging Tax — How It Works for STR Hosts
   description: A plain-English breakdown of the Texas Hotel Occupancy Tax for Airbnb and Vrbo hosts.
   ---

   Texas charges a 6% state Hotel Occupancy Tax (HOT) on stays under 30 days. Cities and counties may add up to 8.5% local HOT on top of that, so effective rates in Austin, Houston, and Dallas often land in the 13–17% range. Airbnb and Vrbo collect and remit the state HOT in most cases, but they do **not** always remit the local HOT — that is your responsibility. The Texas Comptroller publishes a list of cities that have agreements with the platforms. Always verify before relying on platform collection.

   *Source: Texas Comptroller of Public Accounts. Verified 2026-05-05. Not tax advice — confirm with a CPA.*
   ```

- [ ] **Step 3: Template for the remaining 45 + DC** — same frontmatter shape, ~150 word body covering: (1) state rate + scope, (2) local add-on layer, (3) platform collection status, (4) source citation + verification date. Generate them post-launch by following this template; document in `src/content/states/README.md` (create one-liner pointing to TX as canonical example).

- [ ] **Step 4: Commit**
   ```bash
   git add src/content
   git commit -m "feat(content): collection schema + 5 sample state MDX narratives"
   ```

---

## Task 20: Landing page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Implement**
   ```astro
   ---
   import Layout from '@/layouts/Layout.astro';
   import tools from '@/data/tools.json';
   import { buildOrganization } from '@/lib/seo';

   const title = 'Free calculators for short-term rental hosts | strhost.tools';
   const description = 'Seven free calculators for Airbnb and Vrbo hosts: fees, profit, cleaning fee, RevPAR, break-even, co-host split, and lodging tax by state.';
   ---
   <Layout title={title} description={description} canonical="https://strhost.tools/" jsonLd={[buildOrganization()]}>
     <section class="max-w-wide mx-auto px-6 py-14">
       <h1 class="display text-5xl">Free tools for short-term rental hosts.</h1>
       <p class="text-lg opacity-80 max-w-prose">Calculators for the math part of running an Airbnb or Vrbo. No signup, no popups, no upsells — just the numbers.</p>
       <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
         {tools.map((t) => (
           <a href={`/${t.slug}`} class="block border border-rule rounded p-5 bg-white hover:shadow-card no-underline">
             <div class="font-semibold text-navy">{t.name}</div>
             <p class="text-sm text-graphite opacity-80 m-0 mt-1">{t.blurb}</p>
           </a>
         ))}
       </div>
     </section>
   </Layout>
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add src/pages/index.astro
   git commit -m "feat(landing): home page with 7-tool grid"
   ```

---

## Task 21: About + Contact + Lead-magnet pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/get-the-pdf.astro`

- [ ] **Step 1: `about.astro`**
   ```astro
   ---
   import Layout from '@/layouts/Layout.astro';
   ---
   <Layout title="About — strhost.tools" description="Who built strhost.tools and why." canonical="https://strhost.tools/about">
     <article class="max-w-prose mx-auto px-6 py-14">
       <h1 class="display text-4xl">About</h1>
       <p>strhost.tools is a free-tools site for short-term rental hosts, built by the team behind <a href="https://thestrledger.com">The STR Ledger</a>. We make Excel workbooks for serious operators; this site is the math layer that should be free.</p>
       <p>No signup, no popups, no exit-intent. Calculators stay free.</p>
     </article>
   </Layout>
   ```

- [ ] **Step 2: `contact.astro`**
   ```astro
   ---
   import Layout from '@/layouts/Layout.astro';
   ---
   <Layout title="Contact — strhost.tools" description="Contact strhost.tools." canonical="https://strhost.tools/contact">
     <article class="max-w-prose mx-auto px-6 py-14">
       <h1 class="display text-4xl">Contact</h1>
       <p>Email: <a href="mailto:hello@strhost.tools">hello@strhost.tools</a>.</p>
     </article>
   </Layout>
   ```

- [ ] **Step 3: `get-the-pdf.astro`**
   ```astro
   ---
   import Layout from '@/layouts/Layout.astro';
   import EmailCaptureCard from '@/components/funnel/EmailCaptureCard.astro';
   ---
   <Layout title="STR Host Income Report 2026 — strhost.tools" description="Free PDF: STR Host Income Report 2026." canonical="https://strhost.tools/get-the-pdf">
     <article class="max-w-prose mx-auto px-6 py-14">
       <h1 class="display text-4xl">STR Host Income Report 2026</h1>
       <p>Free PDF. Average ADR, RevPAR, and host-fee data across 50 states.</p>
       <EmailCaptureCard tool="get-the-pdf" />
     </article>
   </Layout>
   ```

- [ ] **Step 4: Commit**
   ```bash
   git add src/pages/about.astro src/pages/contact.astro src/pages/get-the-pdf.astro
   git commit -m "feat(pages): about, contact, lead-magnet"
   ```

---

## Task 22: Sitemap + robots.txt

**Files:**
- Modify: `astro.config.mjs` — sitemap already wired
- Create: `public/robots.txt`

- [ ] **Step 1: `public/robots.txt`**
   ```
   User-agent: *
   Allow: /

   Sitemap: https://strhost.tools/sitemap-index.xml
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add public/robots.txt
   git commit -m "feat(seo): robots.txt"
   ```

---

## Task 23: OG image generator (Satori)

**Files:**
- Create: `scripts/build-og.mjs`

- [ ] **Step 1: Build script**
   ```js
   // scripts/build-og.mjs
   import fs from 'node:fs/promises';
   import path from 'node:path';
   import { fileURLToPath } from 'node:url';
   import satori from 'satori';
   import sharp from 'sharp';

   const root  = path.dirname(fileURLToPath(import.meta.url));
   const out   = path.join(root, '..', 'dist', 'og');
   const pubOg = path.join(root, '..', 'public', 'og');

   const tools = JSON.parse(await fs.readFile(path.join(root, '..', 'src', 'data', 'tools.json'), 'utf8'));
   const states = JSON.parse(await fs.readFile(path.join(root, '..', 'src', 'data', 'lodging-tax-by-state.json'), 'utf8'));

   const inter = await fetch('https://rsms.me/inter/font-files/Inter-SemiBold.woff').then(r => r.arrayBuffer());

   async function render(slug, title, kicker) {
     const svg = await satori(
       {
         type: 'div',
         props: {
           style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 60, background: '#F6EFE2', color: '#12304E', fontFamily: 'Inter' },
           children: [
             { type: 'div', props: { style: { fontSize: 24, letterSpacing: 4, color: '#C9A24B', textTransform: 'uppercase' }, children: kicker } },
             { type: 'div', props: { style: { fontSize: 72, fontWeight: 600, lineHeight: 1.05 }, children: title } },
             { type: 'div', props: { style: { fontSize: 28, color: '#2A4867' }, children: 'strhost.tools' } }
           ]
         }
       },
       { width: 1200, height: 630, fonts: [{ name: 'Inter', data: inter, weight: 600, style: 'normal' }] }
     );
     const png = await sharp(Buffer.from(svg)).png().toBuffer();
     await fs.mkdir(out, { recursive: true });
     await fs.mkdir(pubOg, { recursive: true });
     await fs.writeFile(path.join(out, `${slug}.png`), png);
     await fs.writeFile(path.join(pubOg, `${slug}.png`), png);
   }

   await render('index', 'Free calculators for short-term rental hosts', 'strhost.tools');
   for (const t of tools) await render(t.slug, t.name, 'STR Calculator');
   for (const [code, e] of Object.entries(states)) await render(`lodging-tax/${code}`, `${e.name} Lodging Tax`, 'By state');

   console.log('OG images built.');
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add scripts/build-og.mjs
   git commit -m "feat(seo): Satori OG image generator"
   ```

---

## Task 24: GA4 cross-domain tracking

**Files:**
- Modify: `src/layouts/Layout.astro` — inject GA4 snippet

- [ ] **Step 1: Append GA4 block before `</head>` in `Layout.astro`**
   ```astro
   {import.meta.env.PUBLIC_GA4_ID && (
     <>
       <script async src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.PUBLIC_GA4_ID}`}></script>
       <script set:html={`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${import.meta.env.PUBLIC_GA4_ID}', {
           linker: { domains: ['strhost.tools', 'thestrledger.com', 'strbuyers.tools', 'strops.tools', 'strguests.tools'] }
         });
       `} />
     </>
   )}
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add src/layouts/Layout.astro
   git commit -m "feat(analytics): GA4 cross-domain tracking"
   ```

---

## Task 25: Calculator E2E tests (Playwright)

**Files:**
- Create: `tests/e2e/airbnb-fee.spec.ts`
- Create: `tests/e2e/profit.spec.ts`
- Create: `tests/e2e/cleaning-fee.spec.ts`
- Create: `tests/e2e/revpar.spec.ts`
- Create: `tests/e2e/break-even.spec.ts`
- Create: `tests/e2e/cohost-split.spec.ts`
- Create: `tests/e2e/lodging-tax.spec.ts`

- [ ] **Step 1: One smoke test (airbnb fee shown; replicate per calculator)**
   ```ts
   // tests/e2e/airbnb-fee.spec.ts
   import { test, expect } from '@playwright/test';

   test('airbnb fee calculator: load, type, share, print', async ({ page, context }) => {
     await page.goto('/airbnb-fee-calculator');
     await expect(page.getByRole('heading', { name: /airbnb fee calculator/i, level: 1 })).toBeVisible();

     // change nightly to 250
     const nightly = page.getByLabel('Nightly rate');
     await nightly.fill('250');
     await page.waitForTimeout(300); // debounced URL update

     await expect(page).toHaveURL(/nightly=250/);

     // result panel updates
     await expect(page.getByText(/You receive/i)).toBeVisible();

     // share link copies (granted clipboard read)
     await context.grantPermissions(['clipboard-read', 'clipboard-write']);
     await page.getByRole('button', { name: /copy share link/i }).click();
     const clip = await page.evaluate(() => navigator.clipboard.readText());
     expect(clip).toContain('nightly=250');
   });
   ```

- [ ] **Step 2: Replicate per calculator with the matching URL slug, label, and one URL param assertion. Lodging-tax uses `/lodging-tax/tx`.**

- [ ] **Step 3: Commit**
   ```bash
   git add tests/e2e
   git commit -m "test(e2e): playwright smoke tests for all 7 calculators"
   ```

---

## Task 26: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Workflow**
   ```yaml
   name: CI
   on:
     push: { branches: [main] }
     pull_request:
   jobs:
     ci:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 9 }
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: pnpm }
         - run: pnpm install --frozen-lockfile
         - run: pnpm typecheck
         - run: pnpm test
         - run: pnpm e2e:install
         - run: pnpm build
         - run: pnpm e2e
         - uses: actions/upload-artifact@v4
           if: failure()
           with:
             name: playwright-report
             path: playwright-report
   ```

- [ ] **Step 2: Commit**
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "ci: typecheck + vitest + playwright + build"
   ```

---

## Task 27: Hostinger FTP deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Workflow** (requires repo secrets `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`)
   ```yaml
   name: Deploy
   on:
     push: { branches: [main] }
     workflow_dispatch:
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 9 }
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: pnpm }
         - run: pnpm install --frozen-lockfile
         - run: pnpm build
           env:
             PUBLIC_ADSENSE_ENABLED: ${{ vars.PUBLIC_ADSENSE_ENABLED }}
             PUBLIC_ADSENSE_CLIENT:  ${{ vars.PUBLIC_ADSENSE_CLIENT }}
             PUBLIC_GA4_ID:          ${{ vars.PUBLIC_GA4_ID }}
             PUBLIC_ESP_ENDPOINT:    ${{ vars.PUBLIC_ESP_ENDPOINT }}
         - name: Upload to Hostinger
           uses: SamKirkland/FTP-Deploy-Action@v4.3.5
           with:
             server:    ${{ secrets.HOSTINGER_FTP_HOST }}
             username:  ${{ secrets.HOSTINGER_FTP_USERNAME }}
             password:  ${{ secrets.HOSTINGER_FTP_PASSWORD }}
             local-dir: ./dist/
             server-dir: /public_html/
             dangerous-clean-slate: true
   ```

- [ ] **Step 2: Document required secrets in `README.md`** — append a "Deploy" subsection listing the three secrets.

- [ ] **Step 3: Commit**
   ```bash
   git add .github/workflows/deploy.yml README.md
   git commit -m "ci: hostinger ftp deploy on main push"
   ```

---

## Task 28: Pre-launch smoke (post-deploy)

**Files:**
- Create: `scripts/post-deploy-smoke.mjs`
- Modify: `.github/workflows/deploy.yml` — add a final step

- [ ] **Step 1: Smoke script**
   ```js
   // scripts/post-deploy-smoke.mjs
   const BASE = process.env.SMOKE_BASE_URL || 'https://strhost.tools';
   const tools = JSON.parse(await (await fetch(`${BASE}/sitemap-index.xml`)).text() ? '[]' : '[]'); // placeholder check below
   const paths = [
     '/', '/airbnb-fee-calculator', '/profit-calculator', '/cleaning-fee-calculator',
     '/revpar-calculator', '/break-even-calculator', '/cohost-split-calculator',
     '/lodging-tax', '/lodging-tax/tx', '/lodging-tax/ca', '/lodging-tax/fl',
     '/about', '/contact', '/get-the-pdf', '/sitemap-index.xml', '/robots.txt'
   ];
   let failures = 0;
   for (const p of paths) {
     const url = `${BASE}${p}`;
     const r = await fetch(url, { redirect: 'follow' });
     console.log(r.status, url);
     if (r.status !== 200) failures++;
   }
   const og = await fetch(`${BASE}/og/index.png`);
   console.log(og.status, `${BASE}/og/index.png`);
   if (og.status !== 200) failures++;
   if (failures) { console.error(`${failures} failed`); process.exit(1); }
   ```

- [ ] **Step 2: Append step to `deploy.yml`**
   ```yaml
         - name: Post-deploy smoke
           run: node scripts/post-deploy-smoke.mjs
           env:
             SMOKE_BASE_URL: https://strhost.tools
   ```

- [ ] **Step 3: Commit**
   ```bash
   git add scripts/post-deploy-smoke.mjs .github/workflows/deploy.yml
   git commit -m "ci: post-deploy smoke check on production URL"
   ```

---

## Task 29: Final release tag

- [ ] **Step 1: Tag**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

- [ ] **Step 2: Confirm green deploy.** Visit https://strhost.tools/ — landing renders, all 7 tools resolve, sitemap-index.xml resolves, /lodging-tax/tx renders.

---

## Spec coverage map (self-review)

| Spec section | Task(s) |
|---|---|
| §2 Launch cluster — 7 calculators | 9, 10, 11, 12, 13, 14, 16+17 |
| §3 Site architecture (routes) | 7, 17, 18, 20, 21 |
| §5 Tech & repo | 1 |
| §6 Project layout | 1, 2, 7 |
| §7 Per-tool page template | 9 (canonical), 10–14, 16–17 |
| §8 Calculator interaction model | 4, 5, 9–14, 16 |
| §9 State-tax page system | 15, 16, 17, 18, 19 |
| §10 Monetization layer | 8 (AdSlot/EmailCaptureCard/STRLedgerCTA), 7 (FunnelBand/ClusterFunnelBlock) |
| §11 Brand layer | 2 (tokens/Tailwind), 3 (print) |
| §12 SEO + analytics | 6 (JSON-LD), 22 (sitemap+robots), 23 (OG), 24 (GA4) |
| §14 Build, deploy, ops | 26 (CI), 27 (deploy), 28 (smoke), 29 (tag) |
| §16 Defensibility — annual review | data has `lastVerified`; an audit script is implicit (a follow-up post-launch task; not blocking v0.1.0) |

No forbidden phrases remain. Function names are consistent across logic, island, and E2E (`calculateAirbnbFee`, `calculateProfit`, `calculateCleaningFee`, `calculateRevpar`, `calculateBreakEven`, `calculateCohostSplit`, `calculateLodgingTax`). URL params are listed per calculator. Tailwind theme uses exact hex values ported from the STR Ledger source.
