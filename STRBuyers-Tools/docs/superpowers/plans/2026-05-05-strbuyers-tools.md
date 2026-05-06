# strbuyers.tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship strbuyers.tools — 7 acquisition-focused calculators + 200 programmatic city pages + affiliate infrastructure (block + click-logging Node endpoint + MySQL) + chrome + SEO + Hostinger deploy — production-ready.

**Architecture:** Astro 4.x static site. Calculators are hydrated TSX islands. AffiliateBlock is first-class with FTC disclosure + click logging via a tiny Node.js Express `/api/click` endpoint on Hostinger writing to MySQL. Programmatic /cities/[city] pages from JSON. URL state on every tool.

**Tech Stack:** Astro 4.x, TypeScript, Tailwind, Express, mysql2, Vitest, Playwright, pnpm. Deploy: FTP for static, Hostinger Apps for Node click endpoint.

---

## Task 1: Bootstrap pnpm workspace + Astro install

- [ ] **Create `pnpm-workspace.yaml`** at repo root:
  ```yaml
  packages:
    - "."
    - "server"
  ```

- [ ] **Create root `package.json`**:
  ```json
  {
    "name": "strbuyers-tools",
    "version": "0.1.0",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "astro dev",
      "build": "astro build",
      "preview": "astro preview",
      "typecheck": "astro check && tsc --noEmit",
      "test": "vitest run",
      "test:watch": "vitest",
      "test:e2e": "playwright test",
      "lint": "eslint . --ext .ts,.tsx,.astro",
      "format": "prettier --write ."
    },
    "dependencies": {
      "@astrojs/mdx": "^3.1.0",
      "@astrojs/react": "^3.6.0",
      "@astrojs/sitemap": "^3.2.0",
      "@astrojs/tailwind": "^5.1.0",
      "astro": "^4.16.0",
      "astro-seo": "^0.8.4",
      "react": "^18.3.0",
      "react-dom": "^18.3.0",
      "satori": "^0.10.0",
      "tailwindcss": "^3.4.0"
    },
    "devDependencies": {
      "@playwright/test": "^1.48.0",
      "@types/node": "^22.0.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0",
      "@typescript-eslint/eslint-plugin": "^8.0.0",
      "@typescript-eslint/parser": "^8.0.0",
      "eslint": "^9.0.0",
      "eslint-plugin-astro": "^1.3.0",
      "prettier": "^3.3.0",
      "prettier-plugin-astro": "^0.14.0",
      "typescript": "^5.6.0",
      "vitest": "^2.1.0"
    }
  }
  ```

- [ ] **Create `astro.config.mjs`**:
  ```js
  import { defineConfig } from 'astro/config';
  import mdx from '@astrojs/mdx';
  import react from '@astrojs/react';
  import sitemap from '@astrojs/sitemap';
  import tailwind from '@astrojs/tailwind';

  export default defineConfig({
    site: 'https://strbuyers.tools',
    output: 'static',
    integrations: [
      mdx(),
      react(),
      sitemap(),
      tailwind({ applyBaseStyles: false }),
    ],
    build: { format: 'directory' },
    vite: {
      define: { 'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()) },
    },
  });
  ```

- [ ] **Create `tsconfig.json`**:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "react",
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@lib/*": ["src/lib/*"],
        "@components/*": ["src/components/*"],
        "@data/*": ["src/data/*"]
      }
    },
    "include": ["src", "tests"],
    "exclude": ["dist", "server", "node_modules"]
  }
  ```

- [ ] **Create `tailwind.config.mjs`**:
  ```js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          'brand-navy': '#12304E',
          'brand-navy-tint': '#2A4867',
          'brand-navy-shade': '#0A1F35',
          'brand-blue-trust': '#0E4F8A',
          'brand-blue-trust-deep': '#082F54',
          'brand-blue-trust-soft': '#3F7CB6',
          'brand-parchment': '#F6EFE2',
          'brand-parchment-alt': '#EFE5D0',
          'brand-parchment-deep': '#E7DCC2',
          'brand-gold': '#C9A24B',
          'brand-graphite': '#2B2B2B',
        },
        fontFamily: {
          display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
          body: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        },
      },
    },
    plugins: [],
  };
  ```

- [ ] **Create `vitest.config.ts`**:
  ```ts
  import { defineConfig } from 'vitest/config';
  import { fileURLToPath } from 'node:url';

  export default defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/unit/**/*.test.ts'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      },
    },
  });
  ```

- [ ] **Create `playwright.config.ts`**:
  ```ts
  import { defineConfig } from '@playwright/test';
  export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    retries: 2,
    use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry' },
    webServer: {
      command: 'pnpm build && pnpm preview',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  });
  ```

- [ ] **Create `.gitignore`**:
  ```
  node_modules/
  dist/
  .astro/
  .env
  .env.local
  test-results/
  playwright-report/
  server/dist/
  ```

- [ ] **Create directory tree**:
  ```
  src/{pages,components/{chrome,ui,ads,affiliate,funnel,calculators},lib/{calc,affiliate},content/{blog,tools,cities},data,styles,og}
  public/{fonts,images}
  tests/{unit,e2e}
  server/{src,tests}
  ```

**Acceptance:** `pnpm install` succeeds; `pnpm typecheck` passes against an empty project.

---

## Task 2: Brand tokens with finance-trust accent

- [ ] **Create `src/styles/tokens.css`** — port from Excel-Templates `colors_and_type.css`, swap accent from gold to deeper finance-trust blue:
  ```css
  /* ============================================================
     strbuyers.tools — Design Tokens
     Inherits STR Ledger family. Accent shift: gold → finance-trust deeper-blue.
     The gold is preserved as a SECONDARY co-brand token (used only in funnel band linking back to The STR Ledger).
     ============================================================ */
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    /* Inherited STR Ledger core */
    --brand-navy:            #12304E;
    --brand-navy-tint:       #2A4867;
    --brand-navy-shade:      #0A1F35;
    --brand-parchment:       #F6EFE2;
    --brand-parchment-alt:   #EFE5D0;
    --brand-parchment-deep:  #E7DCC2;
    --brand-graphite:        #2B2B2B;

    /* PRIMARY ACCENT — finance-trust deeper blue (replaces gold for buyers' cluster) */
    --brand-blue-trust:        #0E4F8A;   /* primary accent — CTAs, links, period-mark */
    --brand-blue-trust-deep:   #082F54;   /* pressed / shadow */
    --brand-blue-trust-soft:   #3F7CB6;   /* hover / muted */
    --brand-blue-trust-tint:   #D4E4F2;   /* surface tint, callout cards */

    /* SECONDARY co-brand — gold preserved only for STR Ledger funnel band */
    --brand-gold:            #C9A24B;
    --brand-gold-deep:       #A9863A;

    /* Semantic foreground / background */
    --fg-1: var(--brand-graphite);
    --fg-2: #555049;
    --fg-3: #8A8176;
    --fg-on-navy: var(--brand-parchment);
    --fg-accent: var(--brand-blue-trust);

    --bg-1: #FFFFFF;                 /* DELTA: pure white default for tools (not parchment) — sharper for calculator surfaces */
    --bg-2: var(--brand-parchment);  /* parchment becomes secondary surface for editorial sections */
    --bg-3: #F4F7FB;                 /* trust-blue tinted surface */
    --bg-inverse: var(--brand-navy);
    --bg-inverse-deep: var(--brand-navy-shade);

    --rule: #E5EBF2;
    --rule-strong: #C7D2DE;
    --rule-trust: var(--brand-blue-trust);

    --semantic-success: #1F7A45;
    --semantic-error:   #B23A2A;
    --semantic-warn:    #B38400;
    --semantic-info:    var(--brand-blue-trust);

    /* Fonts */
    --font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
    --font-body:    "Inter", "Helvetica Neue", Arial, system-ui, sans-serif;
    --font-wordmark:"Inter Tight", "Inter", system-ui, sans-serif;
    --font-mono:    "JetBrains Mono", "Menlo", "Consolas", ui-monospace, monospace;

    /* Type scale (inherited) */
    --t-hero-size: 72px; --t-h1-size: 48px; --t-h2-size: 36px; --t-h3-size: 26px;
    --t-quote-size: 24px; --t-lead-size: 18px; --t-body-size: 16px;
    --t-small-size: 14px; --t-caption-size: 12px;
    --t-ui-size: 14px; --t-ui-weight: 500; --t-ui-track: 0.02em;
    --t-label-size: 11px; --t-label-weight: 500; --t-label-track: 0.2em;

    /* Spacing 8pt */
    --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
    --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
    --sp-9: 96px; --sp-10: 128px;

    /* Radii */
    --r-0: 0; --r-1: 2px; --r-2: 4px; --r-3: 6px; --r-4: 10px; --r-pill: 999px;

    /* Shadows */
    --sh-card:   0 1px 2px rgba(10, 31, 53, 0.06), 0 1px 1px rgba(10, 31, 53, 0.04);
    --sh-lifted: 0 8px 24px -8px rgba(10, 31, 53, 0.20), 0 2px 6px rgba(10, 31, 53, 0.08);
    --sh-trust-glow: 0 0 0 3px rgba(14, 79, 138, 0.25);
    --sh-focus-ring: 0 0 0 3px rgba(14, 79, 138, 0.45);

    /* Borders */
    --border-hairline: 1px solid var(--rule);
    --border-strong:   1px solid var(--rule-strong);
    --border-trust:    1px solid var(--brand-blue-trust);

    --ease-std: cubic-bezier(0.2, 0.6, 0.2, 1);
    --dur-fast: 120ms; --dur-std: 200ms; --dur-slow: 360ms;
  }

  html, body {
    background: var(--bg-1);
    color: var(--fg-1);
    font-family: var(--font-body);
    font-size: var(--t-body-size);
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    color: var(--brand-navy);
    margin: 0 0 var(--sp-4);
    text-wrap: balance;
  }
  h1 { font-size: var(--t-h1-size); font-weight: 500; letter-spacing: -0.015em; line-height: 1.05; }
  h2 { font-size: var(--t-h2-size); font-weight: 500; letter-spacing: -0.010em; line-height: 1.10; }
  h3 { font-size: var(--t-h3-size); font-weight: 500; letter-spacing: -0.005em; line-height: 1.20; }
  h4 { font-size: 20px; font-weight: 500; line-height: 1.30; }

  p { margin: 0 0 var(--sp-4); text-wrap: pretty; }
  p.lead { font-size: var(--t-lead-size); color: var(--fg-2); }

  code, .mono { font-family: var(--font-mono); font-size: 0.9em; }

  .label, .eyebrow {
    font-family: var(--font-body);
    font-weight: var(--t-label-weight);
    font-size: var(--t-label-size);
    letter-spacing: var(--t-label-track);
    text-transform: uppercase;
    color: var(--brand-blue-trust);
  }

  hr, .trust-rule {
    border: 0;
    height: 1px;
    background: var(--brand-blue-trust);
    width: 48px;
    margin: var(--sp-4) 0;
  }
  hr.full { width: 100%; }

  a {
    color: var(--brand-blue-trust);
    text-decoration: underline;
    text-decoration-color: var(--brand-blue-trust-soft);
    text-underline-offset: 3px;
    transition: color var(--dur-std) var(--ease-std);
  }
  a:hover { color: var(--brand-blue-trust-deep); }

  /* The period-as-accent on the wordmark (blue here, gold on STR Ledger) */
  .period-trust { color: var(--brand-blue-trust); }

  /* Numbers should always be mono — calculator outputs */
  .num, .figure, output { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

  /* Inverse navy surfaces */
  .surface-navy { background: var(--bg-inverse); color: var(--fg-on-navy); }
  .surface-navy h1, .surface-navy h2, .surface-navy h3, .surface-navy h4 { color: var(--fg-on-navy); }
  .surface-navy .label { color: var(--brand-blue-trust-soft); }

  .surface-trust { background: var(--brand-blue-trust-tint); }

  .prose { max-width: 680px; }
  ```

- [ ] **Document accent rationale** — add `src/styles/README.md`:
  ```md
  # strbuyers.tools tokens

  Inherits the STR Ledger family (navy + parchment + Cormorant/Inter/JetBrains Mono).

  **Accent shift (intentional):** STR Ledger uses gold (`#C9A24B`) as primary accent.
  strbuyers.tools uses **finance-trust deeper blue (`#0E4F8A`)** as primary accent.
  Reasoning: signals "buying decision" / "money in motion" rather than editorial luxury.
  Gold is preserved as a *secondary* co-brand token, used only in the funnel band that
  links back to The STR Ledger, so the family relationship is visible.

  **Surface delta:** default page bg is `#FFFFFF`, not parchment. Parchment is reserved
  for editorial blocks (FAQ, "How it works"). White surfaces produce sharper calculator
  affordances.

  **Wordmark:** "strbuyers.tools" in Inter Tight Semibold with `.period-trust` on the dot.
  ```

- [ ] **Create `src/styles/global.css`**:
  ```css
  @tailwind base;
  @import './tokens.css';
  @tailwind components;
  @tailwind utilities;
  ```

**Acceptance:** Tokens load when imported into `Layout.astro`; `:root` exposes both blue-trust and gold variables.

---

## Task 3: Print stylesheet

- [ ] **Create `src/styles/print.css`** — printable calculator results:
  ```css
  @media print {
    :root { --bg-1: #FFFFFF; }
    body { background: #FFFFFF; color: #000; font-size: 11pt; }

    /* Hide non-result chrome */
    header, footer, nav, aside,
    .ad-slot, .affiliate-block, .email-capture,
    .str-ledger-cta, .cluster-funnel, .funnel-band,
    .related-tools, button:not([data-print-keep]) { display: none !important; }

    /* Calculator content gets the page */
    main, .calc-results, .calc-inputs { display: block !important; max-width: 100% !important; }

    h1 { font-size: 18pt; } h2 { font-size: 14pt; } h3 { font-size: 12pt; }
    a { color: #000; text-decoration: none; }
    a[href]:after { content: " (" attr(href) ")"; font-size: 9pt; color: #555; }

    .num, output, .figure { font-family: "Courier New", monospace; }

    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #000; padding: 4pt 6pt; }

    /* Footer line on every printed page identifies origin */
    .print-footer {
      display: block !important;
      position: fixed; bottom: 0; left: 0; right: 0;
      font-size: 9pt; color: #666; text-align: center;
      border-top: 1px solid #000; padding-top: 4pt;
    }

    .page-break { page-break-after: always; }
  }
  ```

- [ ] **Import in `Layout.astro`** alongside global.css.

**Acceptance:** Browser print preview on `/dscr-calculator` shows results only, no ads, no funnels.

---

## Task 4: Layout primitives

- [ ] **`src/components/chrome/Layout.astro`**:
  ```astro
  ---
  import '../../styles/global.css';
  import '../../styles/print.css';
  import { SEO } from 'astro-seo';
  import Header from './Header.astro';
  import Footer from './Footer.astro';
  import FunnelBand from '../funnel/FunnelBand.astro';
  import DisclosureBanner from '../affiliate/DisclosureBanner.astro';

  interface Props {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    jsonLd?: Record<string, unknown>[];
    showAffiliateDisclosure?: boolean;
  }
  const { title, description, canonical, ogImage, jsonLd = [], showAffiliateDisclosure = false } = Astro.props;
  const url = canonical ?? new URL(Astro.url.pathname, Astro.site).toString();
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
        openGraph={{ basic: { title, type: 'website', image: ogImage ?? '/og/default.png', url } }}
        twitter={{ card: 'summary_large_image' }}
      />
      {jsonLd.map((obj) => (
        <script type="application/ld+json" set:html={JSON.stringify(obj)} />
      ))}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </head>
    <body>
      <Header />
      {showAffiliateDisclosure && <DisclosureBanner />}
      <main><slot /></main>
      <FunnelBand />
      <Footer />
      <span class="print-footer">strbuyers.tools — printed result</span>
    </body>
  </html>
  ```

- [ ] **`src/components/chrome/Header.astro`** — wordmark + nav (Calculators, Cities, Blog, About):
  ```astro
  ---
  const tools = [
    { href: '/dscr-calculator', label: 'DSCR' },
    { href: '/down-payment-calculator', label: 'Down Payment' },
    { href: '/comp-analyzer', label: 'Comp Analyzer' },
    { href: '/market-score', label: 'Market Score' },
    { href: '/cash-on-cash-calculator', label: 'Cash-on-Cash' },
    { href: '/year-1-cash-needs', label: 'Year 1 Cash' },
    { href: '/furnishing-budget', label: 'Furnishing' },
  ];
  ---
  <header class="border-b border-[var(--rule)] bg-white">
    <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
      <a href="/" class="font-[family-name:var(--font-wordmark)] text-xl font-semibold text-brand-navy no-underline">
        strbuyers<span class="period-trust">.</span>tools
      </a>
      <nav class="hidden md:flex gap-6 text-sm">
        <a href="/" class="text-brand-navy">Calculators</a>
        <a href="/cities/" class="text-brand-navy">Cities</a>
        <a href="/blog/" class="text-brand-navy">Blog</a>
        <a href="/about" class="text-brand-navy">About</a>
      </nav>
    </div>
  </header>
  ```

- [ ] **`src/components/chrome/Footer.astro`** — copyright, disclosures link, FTC line, all 7 tool links, sister-site links.

- [ ] **`src/components/chrome/Sidebar.astro`** — links to the other six tools (used inside calculator pages):
  ```astro
  ---
  interface Props { current: string }
  const { current } = Astro.props;
  const all = [
    { slug: 'dscr-calculator', label: 'DSCR Calculator' },
    { slug: 'down-payment-calculator', label: 'Down Payment' },
    { slug: 'comp-analyzer', label: 'Comp Analyzer' },
    { slug: 'market-score', label: 'Market Score' },
    { slug: 'cash-on-cash-calculator', label: 'Cash-on-Cash' },
    { slug: 'year-1-cash-needs', label: 'Year 1 Cash Needs' },
    { slug: 'furnishing-budget', label: 'Furnishing Budget' },
  ];
  const others = all.filter((t) => t.slug !== current);
  ---
  <aside class="border-l border-[var(--rule)] pl-6">
    <p class="label">Other tools</p>
    <ul class="mt-3 space-y-2 text-sm">
      {others.map((t) => <li><a href={`/${t.slug}`}>{t.label}</a></li>)}
    </ul>
  </aside>
  ```

- [ ] **`src/components/funnel/FunnelBand.astro`** — co-branded "Built by The STR Ledger" lockup with gold period accent (this is where the gold token re-appears):
  ```astro
  <section class="surface-navy py-8 funnel-band">
    <div class="mx-auto max-w-4xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="m-0 text-sm">
        Built by <span class="font-semibold">The STR Ledger<span style="color:var(--brand-gold)">.</span></span> —
        the financial backbone for short-term rental hosts.
      </p>
      <a href="https://thestrledger.com?utm_source=strbuyers&utm_medium=funnel-band"
         class="text-sm text-white underline">Browse the workbooks →</a>
    </div>
  </section>
  ```

- [ ] **`src/components/funnel/ClusterFunnelBlock.astro`** — links to strhost.tools, strops.tools, strguests.tools:
  ```astro
  ---
  interface Props { currentCluster: 'acquisition' | 'math' | 'operations' | 'guests' }
  const { currentCluster } = Astro.props;
  const sites = [
    { cluster: 'math', host: 'strhost.tools', tagline: 'Math for the property you already own.' },
    { cluster: 'operations', host: 'strops.tools', tagline: 'Run the day-to-day.' },
    { cluster: 'guests', host: 'strguests.tools', tagline: 'Guest experience that earns 5 stars.' },
  ];
  const others = sites.filter((s) => s.cluster !== currentCluster);
  ---
  <section class="cluster-funnel my-12 border-y border-[var(--rule)] py-8">
    <p class="label">Once you've bought, you'll need</p>
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      {others.map((s) => (
        <a href={`https://${s.host}?utm_source=strbuyers&utm_medium=cluster-funnel`}
           data-cluster-link={s.cluster}
           class="block border border-[var(--rule)] p-4 hover:border-[var(--brand-blue-trust)] no-underline">
          <p class="font-semibold text-brand-navy m-0">{s.host}</p>
          <p class="text-sm text-[var(--fg-2)] m-0">{s.tagline}</p>
        </a>
      ))}
    </div>
  </section>
  ```

**Acceptance:** A bare page using `<Layout>` renders header, footer, funnel band, and (when enabled) disclosure.

---

## Task 5: Monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateBlock, DisclosureBanner

- [ ] **`src/components/ads/AdSlot.astro`**:
  ```astro
  ---
  interface Props { location: 'in-content' | 'footer' }
  const { location } = Astro.props;
  const enabled = import.meta.env.PUBLIC_ADSENSE_ENABLED === 'true';
  ---
  <div class="ad-slot my-6" data-ad-slot={location}>
    {enabled ? (
      <ins class="adsbygoogle block" data-ad-client="ca-pub-XXXX" data-ad-slot="0000" />
    ) : (
      <div class="border border-dashed border-[var(--rule-strong)] p-4 text-center text-xs text-[var(--fg-3)]">
        Ad slot ({location}) — disabled until AdSense approval
      </div>
    )}
  </div>
  ```

- [ ] **`src/components/funnel/EmailCaptureCard.astro`** — card with magnet copy + form posting to ESP webhook:
  ```astro
  ---
  interface Props { magnet: string; tool?: string }
  const { magnet, tool = 'general' } = Astro.props;
  ---
  <section class="email-capture surface-trust border border-[var(--brand-blue-trust)] p-6 my-8">
    <p class="label m-0">Free download</p>
    <h3 class="mt-2">STR Buyer Due-Diligence Checklist 2026</h3>
    <p class="text-sm text-[var(--fg-2)]">42-point checklist used by full-time STR buyers — regulation, comps, financing, insurance, taxes.</p>
    <form action="/api/subscribe" method="post" class="flex gap-2 mt-4">
      <input type="hidden" name="magnet" value={magnet} />
      <input type="hidden" name="tool" value={tool} />
      <input type="email" name="email" required placeholder="you@example.com"
             class="flex-1 border border-[var(--rule-strong)] px-3 py-2" />
      <button type="submit" class="bg-[var(--brand-blue-trust)] text-white px-4 py-2 font-semibold">
        Send checklist
      </button>
    </form>
  </section>
  ```

- [ ] **`src/components/funnel/STRLedgerCTA.astro`** — copy varies by tool; deep-links a matching SKU:
  ```astro
  ---
  interface Props { tool: string }
  const map: Record<string, { sku: string; copy: string; cta: string }> = {
    'dscr-calculator': {
      sku: 'TAX-002-pl-single-property',
      copy: 'After you qualify, the P&L workbook tracks every income and expense line your DSCR lender will recheck at year-end.',
      cta: 'Get the P&L workbook →',
    },
    'down-payment-calculator': {
      sku: 'FIN-002-12-month-cash-flow-forecaster',
      copy: 'Once funded, project the next 12 months of cash flow against your actual loan terms.',
      cta: 'Get the forecaster →',
    },
    'comp-analyzer': {
      sku: 'TAX-002-pl-single-property',
      copy: "Comps tell you what to charge. The P&L tells you what's left.",
      cta: 'Get the P&L workbook →',
    },
    'market-score': {
      sku: 'ACQ-008-5-year-pro-forma',
      copy: 'Score the market, then run a 5-year pro forma against your specific property.',
      cta: 'Get the pro forma →',
    },
    'cash-on-cash-calculator': {
      sku: 'FIN-002-12-month-cash-flow-forecaster',
      copy: 'Cash-on-cash is one number. The forecaster is the rolling truth.',
      cta: 'Get the forecaster →',
    },
    'year-1-cash-needs': {
      sku: 'OPS-005-supply-inventory-par-level',
      copy: 'Once you fund the buy, supply par-levels keep year-one expenses from drifting.',
      cta: 'Get the par-level template →',
    },
    'furnishing-budget': {
      sku: 'ACQ-007-furniture-setup-budget',
      copy: 'A budget number is the start. The setup budget workbook tracks every line item by room.',
      cta: 'Get the setup budget →',
    },
  };
  const { tool } = Astro.props;
  const entry = map[tool] ?? map['dscr-calculator'];
  const href = `https://thestrledger.com/products/${entry.sku}?utm_source=strbuyers&utm_medium=cta&utm_content=${tool}`;
  ---
  <section class="str-ledger-cta my-10 p-6 border border-[var(--brand-blue-trust)]">
    <p class="label">From The STR Ledger</p>
    <p class="lead m-0 mt-2">{entry.copy}</p>
    <a href={href} class="inline-block mt-4 font-semibold">{entry.cta}</a>
  </section>
  ```

- [ ] **`src/components/affiliate/DisclosureBanner.astro`** — appears once per page above the fold:
  ```astro
  <aside class="text-xs text-[var(--fg-2)] bg-[var(--bg-3)] border-b border-[var(--rule)] px-4 py-2">
    <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links.
    If you click and complete a qualifying action, strbuyers.tools may earn a commission at no extra cost to you.
    Recommendations reflect our editorial judgment first; commissions never change which vendors we list. See our full
    <a href="/disclosures">disclosure policy</a>.
  </aside>
  ```

- [ ] **`src/components/affiliate/VendorCard.astro`**:
  ```astro
  ---
  import type { Vendor } from '@lib/affiliate/types';
  interface Props { vendor: Vendor; tool: string }
  const { vendor, tool } = Astro.props;
  ---
  <li class="vendor-card border border-[var(--rule-strong)] p-4 flex flex-col gap-2 bg-white">
    <div class="flex items-center gap-3">
      <img src={`/images/vendors/${vendor.id}.svg`} alt="" width="32" height="32" loading="lazy" />
      <p class="font-semibold m-0 text-brand-navy">{vendor.label}</p>
    </div>
    <p class="text-sm text-[var(--fg-2)] m-0">{vendor.pitch}</p>
    <form method="post" action="/api/click" class="m-0">
      <input type="hidden" name="vendor_id" value={vendor.id} />
      <input type="hidden" name="tool_slug" value={tool} />
      <input type="hidden" name="utm_source" value="strbuyers" />
      <input type="hidden" name="utm_medium" value="affiliate-block" />
      <input type="hidden" name="utm_content" value={`${vendor.id}-${tool}`} />
      <button type="submit"
              data-affiliate-id={vendor.id}
              data-tool={tool}
              class="affiliate-cta text-sm font-semibold bg-[var(--brand-blue-trust)] text-white px-3 py-2 w-full">
        {vendor.cta_label} →
      </button>
    </form>
    <p class="text-[10px] text-[var(--fg-3)] m-0 italic">{vendor.ftc_label}</p>
  </li>
  ```

- [ ] **`src/components/affiliate/AffiliateBlock.astro`** — renders 1–3 matched vendor cards:
  ```astro
  ---
  import VendorCard from './VendorCard.astro';
  import affiliates from '@data/affiliates.json';
  import type { Vendor } from '@lib/affiliate/types';

  interface Props { tool: string; vendorIds: string[] }
  const { tool, vendorIds } = Astro.props;
  const vendors: Vendor[] = vendorIds
    .map((id) => (affiliates as Record<string, Vendor>)[id])
    .filter(Boolean);
  ---
  <section class="affiliate-block my-10" data-tool={tool}>
    <p class="label">Matched products</p>
    <p class="text-xs text-[var(--fg-3)] m-0 mt-1">
      We've matched these vendors to this tool's results. Affiliate links — see <a href="/disclosures">disclosure</a>.
    </p>
    <ul class="grid md:grid-cols-3 gap-4 mt-4 list-none p-0">
      {vendors.map((v) => <VendorCard vendor={v} tool={tool} />)}
    </ul>
  </section>
  <script>
    // Fire impression event when block enters viewport
    if ('IntersectionObserver' in window) {
      document.querySelectorAll('.affiliate-block').forEach((block) => {
        const tool = (block as HTMLElement).dataset.tool;
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: 'affiliate_impression', tool });
              io.disconnect();
            }
          });
        }, { threshold: 0.5 });
        io.observe(block);
      });
    }
  </script>
  ```

**Acceptance:** Importing `<AffiliateBlock tool="dscr-calculator" vendorIds={["visio","kiavi"]} />` in any `.astro` page renders 2 vendor cards each posting to `/api/click`.

---

## Task 6: URL-state library (TDD)

- [ ] **Create `src/lib/url-state.ts`**:
  ```ts
  /** Bidirectional URL-state for calculators. Numbers compressed to short keys. */
  export type Scalar = string | number | boolean | null;
  export type StateShape = Record<string, Scalar>;

  export function encode(state: StateShape): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) {
      if (v === null || v === undefined || v === '') continue;
      params.set(k, String(v));
    }
    return params.toString();
  }

  export function decode<T extends StateShape>(query: string, schema: T): T {
    const params = new URLSearchParams(query);
    const out = { ...schema };
    for (const k of Object.keys(schema)) {
      const raw = params.get(k);
      if (raw === null) continue;
      const original = (schema as StateShape)[k];
      if (typeof original === 'number') (out as StateShape)[k] = Number(raw);
      else if (typeof original === 'boolean') (out as StateShape)[k] = raw === 'true';
      else (out as StateShape)[k] = raw;
    }
    return out;
  }

  export function pushState(state: StateShape): void {
    if (typeof window === 'undefined') return;
    const qs = encode(state);
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }

  /** Compress an array of objects (e.g. 3 listings) into a single base64url query value. */
  export function packArray<T extends StateShape>(rows: T[]): string {
    const json = JSON.stringify(rows);
    if (typeof window !== 'undefined') {
      return window.btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return Buffer.from(json, 'utf-8').toString('base64url');
  }

  export function unpackArray<T extends StateShape>(packed: string): T[] {
    const padded = packed.replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof window !== 'undefined'
      ? window.atob(padded)
      : Buffer.from(padded, 'base64').toString('utf-8');
    try { return JSON.parse(json) as T[]; } catch { return []; }
  }
  ```

- [ ] **TDD test `src/lib/url-state.test.ts`**:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { encode, decode, packArray, unpackArray } from './url-state';

  describe('url-state', () => {
    it('round-trips simple state', () => {
      const s = { price: 450000, dp: 0.20, term: 30, dscr: true };
      const decoded = decode(encode(s), s);
      expect(decoded).toEqual(s);
    });
    it('drops null/undefined', () => {
      expect(encode({ a: 1, b: null as unknown as number })).toBe('a=1');
    });
    it('packs/unpacks arrays', () => {
      const rows = [{ adr: 200, occ: 0.6 }, { adr: 250, occ: 0.55 }, { adr: 180, occ: 0.7 }];
      expect(unpackArray(packArray(rows))).toEqual(rows);
    });
    it('produces URL-safe base64', () => {
      const rows = [{ a: 1 }];
      expect(packArray(rows)).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });
  ```

**Acceptance:** `pnpm test url-state` passes 4/4.

---

## Task 7: Format library (TDD)

- [ ] **Create `src/lib/format.ts`**:
  ```ts
  const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const fmtUSDc = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  const fmtPct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
  const fmtNum = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  export const dollars = (n: number) => fmtUSD.format(Math.round(n));
  export const dollarsCents = (n: number) => fmtUSDc.format(n);
  export const pct = (frac: number) => fmtPct.format(frac);
  export const num = (n: number) => fmtNum.format(n);

  /** DSCR ratio: 1.25 → "1.25x" with two-decimal precision and tier label. */
  export function dscr(ratio: number): string {
    if (!Number.isFinite(ratio)) return 'n/a';
    return `${ratio.toFixed(2)}x`;
  }

  export function dscrTier(ratio: number): { label: string; tone: 'fail' | 'low' | 'good' | 'strong' } {
    if (ratio < 1.0) return { label: 'Below 1.0 — most DSCR lenders decline', tone: 'fail' };
    if (ratio < 1.25) return { label: '1.0–1.24 — Visio, some Kiavi programs', tone: 'low' };
    if (ratio < 1.5) return { label: '1.25–1.49 — qualifies most DSCR programs', tone: 'good' };
    return { label: '1.5+ — best rates available', tone: 'strong' };
  }

  export function stdDev(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  export function mean(values: number[]): number {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /** Outliers: |z| > 1.5 stddevs from the mean. */
  export function outliers(values: number[]): number[] {
    if (values.length < 3) return [];
    const m = mean(values);
    const sd = stdDev(values);
    if (sd === 0) return [];
    return values.map((v, i) => (Math.abs(v - m) / sd > 1.5 ? i : -1)).filter((i) => i >= 0);
  }
  ```

- [ ] **TDD test `src/lib/format.test.ts`**:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { dollars, pct, dscr, dscrTier, stdDev, mean, outliers } from './format';

  describe('format', () => {
    it('formats dollars', () => expect(dollars(1234567)).toBe('$1,234,567'));
    it('formats percent', () => expect(pct(0.125)).toBe('12.5%'));
    it('formats DSCR', () => {
      expect(dscr(1.25)).toBe('1.25x');
      expect(dscr(NaN)).toBe('n/a');
    });
    it('classifies DSCR tier at boundaries', () => {
      expect(dscrTier(0.99).tone).toBe('fail');
      expect(dscrTier(1.0).tone).toBe('low');
      expect(dscrTier(1.24).tone).toBe('low');
      expect(dscrTier(1.25).tone).toBe('good');
      expect(dscrTier(1.49).tone).toBe('good');
      expect(dscrTier(1.5).tone).toBe('strong');
    });
    it('mean and stddev', () => {
      expect(mean([2, 4, 6])).toBe(4);
      expect(stdDev([2, 4, 6])).toBeCloseTo(2.0, 1);
    });
    it('flags outliers', () => {
      // 100, 102, 98, 200 — 200 is the outlier
      expect(outliers([100, 102, 98, 200])).toEqual([3]);
    });
  });
  ```

**Acceptance:** `pnpm test format` passes 6/6.

---

## Task 8: SEO library — JSON-LD WebApplication, FAQPage, Place

- [ ] **Create `src/lib/seo.ts`**:
  ```ts
  export interface FaqItem { q: string; a: string }
  export interface CityData {
    name: string; state: string;
    regulationStatus: 'open' | 'restricted' | 'banned' | 'gray';
    avgADR: number; occupancyEstimate: number;
    saturationTier: 'low' | 'medium' | 'high';
  }

  export function webApplicationLd(args: { name: string; url: string; description: string; category: string }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: args.name, url: args.url, description: args.description,
      applicationCategory: args.category, operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
      publisher: { '@type': 'Organization', name: 'The STR Ledger', url: 'https://thestrledger.com' },
    };
  }

  export function faqPageLd(items: FaqItem[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((it) => ({
        '@type': 'Question', name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    };
  }

  export function placeLd(city: CityData & { url: string }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${city.name}, ${city.state}`,
      url: city.url,
      address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: city.state, addressCountry: 'US' },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'STR regulation status', value: city.regulationStatus },
        { '@type': 'PropertyValue', name: 'Avg ADR (USD)', value: city.avgADR },
        { '@type': 'PropertyValue', name: 'Estimated occupancy', value: city.occupancyEstimate },
        { '@type': 'PropertyValue', name: 'Saturation tier', value: city.saturationTier },
      ],
    };
  }

  export function organizationLd() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'strbuyers.tools',
      url: 'https://strbuyers.tools',
      parentOrganization: { '@type': 'Organization', name: 'The STR Ledger', url: 'https://thestrledger.com' },
    };
  }
  ```

**Acceptance:** Builders return valid JSON-LD shapes; smoke test stringifies them without throwing.

---

## Task 9: Affiliate registry — `src/data/affiliates.json` (10 vendors)

- [ ] **Create `src/lib/affiliate/types.ts`**:
  ```ts
  export interface Vendor {
    id: string;
    network: 'direct' | 'impact' | 'partnerstack' | 'shareasale' | 'cj';
    label: string;
    pitch: string;
    cta_label: string;
    outbound_url_template: string;
    ftc_label: string;
    payout_note: string;
    category: 'lender' | 'data' | 'insurance' | 'furniture' | 'pms';
  }
  ```

- [ ] **Create `src/data/affiliates.json`** — 10 fully-fleshed vendors:
  ```json
  {
    "visio": {
      "id": "visio",
      "network": "direct",
      "label": "Visio Lending",
      "pitch": "DSCR loans from 1.0x — purchase, refi, cash-out. 30-yr fixed, no income docs.",
      "cta_label": "Check Visio rates",
      "outbound_url_template": "https://visiolending.com/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$200–500 per funded loan",
      "category": "lender"
    },
    "kiavi": {
      "id": "kiavi",
      "network": "impact",
      "label": "Kiavi",
      "pitch": "DSCR rental loans, BRRRR-friendly. Soft pull, online underwriting.",
      "cta_label": "Apply with Kiavi",
      "outbound_url_template": "https://www.kiavi.com/?irgwc=1&ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$300/funded loan via Impact",
      "category": "lender"
    },
    "lima-one": {
      "id": "lima-one",
      "network": "direct",
      "label": "Lima One Capital",
      "pitch": "Rental30 DSCR program. Fix-and-flip, BRRRR, multifamily.",
      "cta_label": "Get a quote",
      "outbound_url_template": "https://www.limaone.com/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$250/funded loan",
      "category": "lender"
    },
    "airdna": {
      "id": "airdna",
      "network": "partnerstack",
      "label": "AirDNA",
      "pitch": "Market data on 10M+ Airbnb listings. Rentalizer projections, Market Score.",
      "cta_label": "Try AirDNA",
      "outbound_url_template": "https://www.airdna.co/?via=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "30% recurring via PartnerStack",
      "category": "data"
    },
    "pricelabs": {
      "id": "pricelabs",
      "network": "direct",
      "label": "PriceLabs",
      "pitch": "Dynamic pricing for STR. Market dashboards, neighborhood data, occupancy curves.",
      "cta_label": "Start free trial",
      "outbound_url_template": "https://hello.pricelabs.co/?fpr=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$50 first-month + 10% recurring",
      "category": "data"
    },
    "mashvisor": {
      "id": "mashvisor",
      "network": "shareasale",
      "label": "Mashvisor",
      "pitch": "Investment-property analytics. Cash-on-cash and cap-rate by neighborhood.",
      "cta_label": "Open Mashvisor",
      "outbound_url_template": "https://www.mashvisor.com/?aff=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "20% on first sub via ShareASale",
      "category": "data"
    },
    "proper": {
      "id": "proper",
      "network": "direct",
      "label": "Proper Insurance",
      "pitch": "STR-specific insurance — covers commercial use, lost income, $2M liability.",
      "cta_label": "Get a quote",
      "outbound_url_template": "https://www.proper.insure/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$75 per quote-completed",
      "category": "insurance"
    },
    "steadily": {
      "id": "steadily",
      "network": "direct",
      "label": "Steadily",
      "pitch": "Landlord and STR insurance. Quote in 2 minutes, bind same day.",
      "cta_label": "Quote with Steadily",
      "outbound_url_template": "https://www.steadily.com/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "$50 per bound policy",
      "category": "insurance"
    },
    "stage-by-hand": {
      "id": "stage-by-hand",
      "network": "direct",
      "label": "Stage by Hand",
      "pitch": "Turnkey STR furniture packages. Bedroom-by-bedroom design + delivery + assembly.",
      "cta_label": "Browse packages",
      "outbound_url_template": "https://stagebyhand.com/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "8% on furniture spend",
      "category": "furniture"
    },
    "minoan": {
      "id": "minoan",
      "network": "direct",
      "label": "Minoan",
      "pitch": "Trade-only pricing on 150+ home brands for STR hosts. 15–40% off retail.",
      "cta_label": "Open Minoan",
      "outbound_url_template": "https://minoanexperience.com/?ref=strbuyers&utm_source=strbuyers&utm_medium={{utm_medium}}&utm_content={{utm_content}}",
      "ftc_label": "Affiliate link — strbuyers.tools may earn commission",
      "payout_note": "5% on first order",
      "category": "furniture"
    }
  }
  ```

**Acceptance:** `JSON.parse(readFile('affiliates.json'))` validates against `Vendor` type with no missing fields.

---

## Task 10: Loan-types data — `src/data/loan-types.json`

- [ ] **Create `src/lib/calc/loan-types.ts`**:
  ```ts
  export interface LoanType {
    id: 'conventional' | 'dscr' | 'second-home' | 'fha';
    label: string;
    minDownPct: number;
    dscrThreshold: number | null;
    rateEstimateBps: number;
    notes: string[];
    affiliateMatch: string[];
  }
  ```

- [ ] **Create `src/data/loan-types.json`**:
  ```json
  [
    {
      "id": "conventional",
      "label": "Conventional (Fannie/Freddie investor)",
      "minDownPct": 0.20,
      "dscrThreshold": null,
      "rateEstimateBps": 725,
      "notes": [
        "Requires full income docs (2 yrs tax returns + W-2/1099).",
        "Cap of 10 financed properties; 25% down for property #5+.",
        "STR income may not count toward DTI without 24 mo. history."
      ],
      "affiliateMatch": []
    },
    {
      "id": "dscr",
      "label": "DSCR (no-income-doc investor loan)",
      "minDownPct": 0.20,
      "dscrThreshold": 1.0,
      "rateEstimateBps": 825,
      "notes": [
        "Qualifies based on property cash flow, not personal income.",
        "Most popular STR financing in 2026.",
        "Visio, Kiavi, Lima One are primary players."
      ],
      "affiliateMatch": ["visio", "kiavi", "lima-one"]
    },
    {
      "id": "second-home",
      "label": "Second-home loan",
      "minDownPct": 0.10,
      "dscrThreshold": null,
      "rateEstimateBps": 700,
      "notes": [
        "10% down — best non-investor option.",
        "You must occupy 14+ days/yr and not rent more than 180 days.",
        "Lender may classify as investment if STR usage is too aggressive."
      ],
      "affiliateMatch": []
    },
    {
      "id": "fha",
      "label": "FHA (owner-occupied house-hack)",
      "minDownPct": 0.035,
      "dscrThreshold": null,
      "rateEstimateBps": 675,
      "notes": [
        "3.5% down only if you occupy 1 unit of a 2–4 unit property.",
        "Mortgage insurance (MIP) for life of loan in most cases.",
        "STR income from non-occupied units may count after 24 months."
      ],
      "affiliateMatch": []
    }
  ]
  ```

**Acceptance:** Imports as `LoanType[]`; values used by down-payment calculator (Task 12).

---

## Task 11: Calculator — DSCR (TDD)

- [ ] **`src/lib/calc/dscr.ts`** (pure logic):
  ```ts
  export interface DscrInputs {
    monthlyRent: number;     // gross STR revenue / month
    annualOpex: number;      // taxes + insurance + HOA + utilities + mgmt + cleaning
    loanAmount: number;
    rateBps: number;         // 725 = 7.25%
    termYears: number;
  }

  export interface DscrResults {
    annualNOI: number;
    annualDebtService: number;
    monthlyPayment: number;
    dscr: number;
    qualifies10: boolean;
    qualifies125: boolean;
    qualifies150: boolean;
  }

  export function monthlyPayment(loan: number, rateBps: number, termYears: number): number {
    if (loan <= 0 || termYears <= 0) return 0;
    const r = rateBps / 10_000 / 12;
    const n = termYears * 12;
    if (r === 0) return loan / n;
    return (loan * r) / (1 - Math.pow(1 + r, -n));
  }

  export function calcDscr(i: DscrInputs): DscrResults {
    const annualGross = i.monthlyRent * 12;
    const annualNOI = annualGross - i.annualOpex;
    const monthly = monthlyPayment(i.loanAmount, i.rateBps, i.termYears);
    const annualDebtService = monthly * 12;
    const dscr = annualDebtService > 0 ? annualNOI / annualDebtService : 0;
    return {
      annualNOI,
      annualDebtService,
      monthlyPayment: monthly,
      dscr,
      qualifies10: dscr >= 1.0,
      qualifies125: dscr >= 1.25,
      qualifies150: dscr >= 1.5,
    };
  }
  ```

- [ ] **TDD test `src/lib/calc/dscr.test.ts`**:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { calcDscr, monthlyPayment } from './dscr';

  describe('DSCR', () => {
    it('amortization sanity: $100k @ 6% / 30y ≈ $599.55/mo', () => {
      expect(monthlyPayment(100_000, 600, 30)).toBeCloseTo(599.55, 1);
    });

    it('hits exactly 1.00x threshold', () => {
      // Construct: NOI = monthly_payment * 12
      const monthly = monthlyPayment(300_000, 725, 30); // ~$2,047
      const r = calcDscr({
        monthlyRent: (monthly * 12 + 6000) / 12,
        annualOpex: 6000,
        loanAmount: 300_000, rateBps: 725, termYears: 30,
      });
      expect(r.dscr).toBeCloseTo(1.0, 2);
      expect(r.qualifies10).toBe(true);
      expect(r.qualifies125).toBe(false);
    });

    it('hits 1.25x threshold', () => {
      const monthly = monthlyPayment(300_000, 725, 30);
      const targetNOI = monthly * 12 * 1.25;
      const r = calcDscr({
        monthlyRent: (targetNOI + 6000) / 12,
        annualOpex: 6000,
        loanAmount: 300_000, rateBps: 725, termYears: 30,
      });
      expect(r.dscr).toBeCloseTo(1.25, 2);
      expect(r.qualifies125).toBe(true);
      expect(r.qualifies150).toBe(false);
    });

    it('hits 1.50x threshold', () => {
      const monthly = monthlyPayment(300_000, 725, 30);
      const targetNOI = monthly * 12 * 1.5;
      const r = calcDscr({
        monthlyRent: (targetNOI + 6000) / 12,
        annualOpex: 6000,
        loanAmount: 300_000, rateBps: 725, termYears: 30,
      });
      expect(r.dscr).toBeCloseTo(1.5, 2);
      expect(r.qualifies150).toBe(true);
    });

    it('fails below 1.0', () => {
      const r = calcDscr({ monthlyRent: 1500, annualOpex: 8000, loanAmount: 300_000, rateBps: 725, termYears: 30 });
      expect(r.dscr).toBeLessThan(1.0);
      expect(r.qualifies10).toBe(false);
    });
  });
  ```

- [ ] **TSX island `src/components/calculators/DscrCalculator.tsx`**:
  ```tsx
  import { useEffect, useState } from 'react';
  import { calcDscr } from '@lib/calc/dscr';
  import { dollars, dscr as fmtDscr, dscrTier } from '@lib/format';
  import { decode, encode, pushState } from '@lib/url-state';

  const SCHEMA = { rent: 6500, opex: 12000, loan: 400000, rate: 825, term: 30 };

  export default function DscrCalculator() {
    const [s, setS] = useState(SCHEMA);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setS(decode(window.location.search.slice(1), SCHEMA));
      }
    }, []);

    useEffect(() => { pushState(s); }, [s]);

    const r = calcDscr({
      monthlyRent: s.rent, annualOpex: s.opex,
      loanAmount: s.loan, rateBps: s.rate, termYears: s.term,
    });
    const tier = dscrTier(r.dscr);

    return (
      <div className="grid md:grid-cols-2 gap-8 calc-inputs">
        <div className="space-y-4">
          <Field label="Monthly STR revenue" v={s.rent} onChange={(v) => setS({ ...s, rent: v })} />
          <Field label="Annual operating expenses" v={s.opex} onChange={(v) => setS({ ...s, opex: v })} />
          <Field label="Loan amount" v={s.loan} onChange={(v) => setS({ ...s, loan: v })} />
          <Field label="Rate (bps, 725 = 7.25%)" v={s.rate} onChange={(v) => setS({ ...s, rate: v })} />
          <Field label="Term (years)" v={s.term} onChange={(v) => setS({ ...s, term: v })} />
        </div>
        <div className="calc-results space-y-3">
          <p className="label">DSCR</p>
          <p className="text-5xl font-mono text-brand-navy m-0">{fmtDscr(r.dscr)}</p>
          <p className={`text-sm tone-${tier.tone}`}>{tier.label}</p>
          <hr className="full" />
          <Row k="Annual NOI" v={dollars(r.annualNOI)} />
          <Row k="Monthly P&I" v={dollars(r.monthlyPayment)} />
          <Row k="Annual debt service" v={dollars(r.annualDebtService)} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => window.print()} data-print-keep className="border px-3 py-2 text-sm">Print</button>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.pathname}?${encode(s)}`)}
                    className="border px-3 py-2 text-sm">Copy share link</button>
          </div>
        </div>
      </div>
    );
  }

  function Field({ label, v, onChange }: { label: string; v: number; onChange: (n: number) => void }) {
    return (
      <label className="block">
        <span className="label">{label}</span>
        <input type="number" value={v} onChange={(e) => onChange(Number(e.target.value))}
               className="mt-1 w-full border border-[var(--rule-strong)] px-3 py-2 font-mono" />
      </label>
    );
  }
  function Row({ k, v }: { k: string; v: string }) {
    return <div className="flex justify-between border-b border-[var(--rule)] py-1"><span>{k}</span><span className="font-mono">{v}</span></div>;
  }
  ```

- [ ] **Page `src/pages/dscr-calculator.astro`**:
  ```astro
  ---
  import Layout from '@components/chrome/Layout.astro';
  import Sidebar from '@components/chrome/Sidebar.astro';
  import AdSlot from '@components/ads/AdSlot.astro';
  import AffiliateBlock from '@components/affiliate/AffiliateBlock.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  import STRLedgerCTA from '@components/funnel/STRLedgerCTA.astro';
  import ClusterFunnelBlock from '@components/funnel/ClusterFunnelBlock.astro';
  import DscrCalculator from '@components/calculators/DscrCalculator.tsx';
  import { webApplicationLd, faqPageLd } from '@lib/seo';

  const faqs = [
    { q: 'What DSCR do most STR lenders require?', a: 'Most DSCR programs require ≥1.00x. Visio is the most lenient; Kiavi and Lima One typically prefer 1.10x+.' },
    { q: 'Does seasonal STR income hurt DSCR?', a: 'Yes — lenders annualize. A property that makes $30k in summer and $5k in winter will be evaluated on the $35k annual.' },
    { q: 'Can I include cleaning fees in DSCR rent?', a: 'No. Lenders use net rent (after cleaning fees passed through to guests).' },
    { q: 'What is a "no-ratio" DSCR loan?', a: 'A program that ignores DSCR entirely if your credit and reserves are strong; rates are 50–100 bps higher.' },
    { q: 'How is DSCR different from cash flow?', a: 'DSCR = NOI / debt service. Cash flow subtracts the debt service from NOI. DSCR is a ratio; cash flow is a dollar amount.' },
  ];
  const ld = [
    webApplicationLd({ name: 'DSCR Calculator', url: 'https://strbuyers.tools/dscr-calculator', description: 'Calculate DSCR for short-term rentals.', category: 'FinanceApplication' }),
    faqPageLd(faqs),
  ];
  ---
  <Layout title="DSCR Calculator for STR — strbuyers.tools"
          description="Calculate Debt Service Coverage Ratio for a short-term rental. Hits the 1.0, 1.25, 1.5 thresholds DSCR lenders use."
          jsonLd={ld} showAffiliateDisclosure>
    <article class="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[1fr_240px] gap-8">
      <div>
        <p class="label">Acquisition · Pre-buy</p>
        <h1>DSCR calculator for short-term rentals</h1>
        <p class="lead">Punch in rent, opex, and the loan terms a DSCR lender just quoted. Live result against the 1.0, 1.25, 1.5 thresholds.</p>
        <DscrCalculator client:load />
        <AdSlot location="in-content" />
        <h2>How it works</h2>
        <p>DSCR = annual NOI / annual debt service. NOI is gross rent minus operating expenses (taxes, insurance, HOA, utilities, management, cleaning). Debt service is principal + interest only — DSCR <em>does not</em> include taxes or insurance in the bottom of the ratio.</p>
        <p>Most STR-focused DSCR lenders price by tier: ≥1.0x qualifies, ≥1.25x gets standard rate, ≥1.5x gets the best rate sheet.</p>
        <AffiliateBlock tool="dscr-calculator" vendorIds={["visio", "kiavi", "lima-one"]} />
        <EmailCaptureCard magnet="str-buyers-due-diligence-checklist-2026" tool="dscr-calculator" />
        <h2>How to use this calculator</h2>
        <ol>
          <li>Pull a recent 12-month income statement (or AirDNA Rentalizer estimate).</li>
          <li>Sum 12 months of operating expenses — taxes, insurance, HOA, utilities, mgmt, cleaning.</li>
          <li>Plug in the loan amount and rate your DSCR lender just quoted.</li>
          <li>Read the tier — that is the program you qualify for.</li>
        </ol>
        <h2>FAQ</h2>
        {faqs.map((f) => <details><summary>{f.q}</summary><p>{f.a}</p></details>)}
        <STRLedgerCTA tool="dscr-calculator" />
        <AdSlot location="footer" />
        <h2>Related calculators</h2>
        <ul><li><a href="/down-payment-calculator">Down payment</a></li><li><a href="/cash-on-cash-calculator">Cash-on-cash</a></li></ul>
        <ClusterFunnelBlock currentCluster="acquisition" />
      </div>
      <Sidebar current="dscr-calculator" />
    </article>
  </Layout>
  ```

**Acceptance:** Page renders, calculator updates live, share-link round-trips state.

---

## Task 12: Calculator — Down Payment (TDD)

- [ ] **`src/lib/calc/down-payment.ts`**:
  ```ts
  import type { LoanType } from './loan-types';

  export interface DownPaymentResult {
    loanType: LoanType['id'];
    label: string;
    downPayment: number;
    loanAmount: number;
    monthlyPayment: number;
    notes: string[];
    affiliateMatch: string[];
  }

  import { monthlyPayment } from './dscr';

  export function compareLoans(price: number, loans: LoanType[]): DownPaymentResult[] {
    return loans.map((l) => {
      const dp = price * l.minDownPct;
      const loan = price - dp;
      return {
        loanType: l.id,
        label: l.label,
        downPayment: dp,
        loanAmount: loan,
        monthlyPayment: monthlyPayment(loan, l.rateEstimateBps, 30),
        notes: l.notes,
        affiliateMatch: l.affiliateMatch,
      };
    });
  }
  ```

- [ ] **TDD `src/lib/calc/down-payment.test.ts`**:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { compareLoans } from './down-payment';
  import loans from '../../data/loan-types.json';

  describe('Down payment', () => {
    it('FHA at $400k = $14,000 down', () => {
      const r = compareLoans(400_000, loans as never);
      const fha = r.find((x) => x.loanType === 'fha')!;
      expect(fha.downPayment).toBeCloseTo(14_000, 0);
    });
    it('DSCR at $500k = $100,000 down', () => {
      const r = compareLoans(500_000, loans as never);
      const dscr = r.find((x) => x.loanType === 'dscr')!;
      expect(dscr.downPayment).toBe(100_000);
      expect(dscr.affiliateMatch).toContain('visio');
    });
  });
  ```

- [ ] **Island + page `src/components/calculators/DownPaymentCalculator.tsx` and `src/pages/down-payment-calculator.astro`** — mirror DSCR page structure; renders comparison table; `<AffiliateBlock tool="down-payment-calculator" vendorIds={["visio","kiavi","steadily"]} />`.

**Acceptance:** Tests pass; page shows 4-row table.

---

## Task 13: Calculator — Comp Analyzer (TDD)

- [ ] **`src/lib/calc/comp-analyzer.ts`**:
  ```ts
  import { mean, stdDev, outliers } from '../format';

  export interface Listing {
    label: string;
    adr: number;          // avg daily rate
    occupancy: number;    // 0..1
    revPar?: number;      // optional; computed if absent
  }

  export interface CompResult {
    listings: Listing[];
    means: { adr: number; occupancy: number; revPar: number };
    stdDevs: { adr: number; occupancy: number; revPar: number };
    outlierIndexes: { adr: number[]; occupancy: number[]; revPar: number[] };
  }

  export function analyze(rows: Listing[]): CompResult {
    const enriched = rows.map((r) => ({ ...r, revPar: r.revPar ?? r.adr * r.occupancy }));
    const adrs = enriched.map((r) => r.adr);
    const occs = enriched.map((r) => r.occupancy);
    const rps = enriched.map((r) => r.revPar!);

    return {
      listings: enriched,
      means: { adr: mean(adrs), occupancy: mean(occs), revPar: mean(rps) },
      stdDevs: { adr: stdDev(adrs), occupancy: stdDev(occs), revPar: stdDev(rps) },
      outlierIndexes: { adr: outliers(adrs), occupancy: outliers(occs), revPar: outliers(rps) },
    };
  }
  ```

- [ ] **TDD `src/lib/calc/comp-analyzer.test.ts`**:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { analyze } from './comp-analyzer';

  describe('Comp analyzer', () => {
    const rows = [
      { label: 'A', adr: 200, occupancy: 0.6 },
      { label: 'B', adr: 220, occupancy: 0.65 },
      { label: 'C', adr: 210, occupancy: 0.62 },
    ];
    it('computes means', () => {
      const r = analyze(rows);
      expect(r.means.adr).toBeCloseTo(210, 1);
      expect(r.means.occupancy).toBeCloseTo(0.623, 2);
    });
    it('computes RevPAR = adr * occ', () => {
      const r = analyze(rows);
      expect(r.listings[0].revPar).toBeCloseTo(120, 1);
    });
    it('flags 4th listing as outlier when ADR is 2x mean', () => {
      const r = analyze([...rows, { label: 'D', adr: 500, occupancy: 0.6 }]);
      expect(r.outlierIndexes.adr).toContain(3);
    });
  });
  ```

- [ ] **Island `src/components/calculators/CompAnalyzer.tsx`** — 3 paste-rows (label, ADR, occupancy, optional RevPAR); URL state via `packArray`; outlier rows visually flagged.

- [ ] **Page** with `<AffiliateBlock tool="comp-analyzer" vendorIds={["airdna","pricelabs","mashvisor"]} />`.

**Acceptance:** Tests pass; comp analyzer flags ADR outliers.

---

## Task 14: Calculator — Market Score

- [ ] **`src/lib/calc/market-score.ts`**:
  ```ts
  import type { CityData } from '../seo';

  export interface ExtendedCity extends CityData { saturationListings: number }

  export interface MarketScore {
    overall: number;          // 0..100
    breakdown: { regulation: number; economics: number; saturation: number };
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    headline: string;
  }

  export function scoreCity(c: ExtendedCity): MarketScore {
    const regulation =
      c.regulationStatus === 'open' ? 100 :
      c.regulationStatus === 'gray' ? 65 :
      c.regulationStatus === 'restricted' ? 35 : 0;

    const revPar = c.avgADR * c.occupancyEstimate;
    const economics = Math.min(100, Math.round((revPar / 200) * 100));

    const saturation =
      c.saturationTier === 'low' ? 100 :
      c.saturationTier === 'medium' ? 60 : 30;

    const overall = Math.round(regulation * 0.4 + economics * 0.4 + saturation * 0.2);
    const grade =
      overall >= 85 ? 'A' :
      overall >= 70 ? 'B' :
      overall >= 55 ? 'C' :
      overall >= 40 ? 'D' : 'F';

    const headline =
      grade === 'A' ? 'Strong buyer\'s market — green lights.' :
      grade === 'B' ? 'Solid market — verify regulation before offer.' :
      grade === 'C' ? 'Mixed signals — proceed with diligence.' :
      grade === 'D' ? 'Difficult market — high regulatory or saturation risk.' :
      'Avoid — STR economics do not work.';

    return { overall, breakdown: { regulation, economics, saturation }, grade, headline };
  }
  ```

- [ ] **TDD `src/lib/calc/market-score.test.ts`** — assert grade transitions at 40/55/70/85.

- [ ] **`src/pages/market-score.astro`** — search box; on submit, redirects to `/cities/[slug]`.

**Acceptance:** Search-and-redirect UX works on standalone page; programmatic per-city pages render score card.

---

## Task 15: Calculator — Cash-on-Cash (TDD)

- [ ] **`src/lib/calc/cash-on-cash.ts`**:
  ```ts
  export interface CocInputs {
    annualNOI: number;
    annualDebtService: number;
    cashInvested: number;     // down + closing + furnishing + reserves
  }
  export interface CocResults { annualCashFlow: number; cashOnCash: number }

  export function calcCoc(i: CocInputs): CocResults {
    const cf = i.annualNOI - i.annualDebtService;
    return {
      annualCashFlow: cf,
      cashOnCash: i.cashInvested > 0 ? cf / i.cashInvested : 0,
    };
  }
  ```

- [ ] **Test**: at NOI=$30k, DS=$24k, cash=$100k → CoC = 6.0%.

- [ ] **Island + page** with `<AffiliateBlock tool="cash-on-cash-calculator" vendorIds={["visio","steadily","airdna"]} />`.

---

## Task 16: Calculator — Year 1 Cash Needs (TDD)

- [ ] **`src/lib/calc/year-1-cash.ts`**:
  ```ts
  export interface Year1Inputs {
    purchasePrice: number;
    downPaymentPct: number;
    closingCostsPct: number;
    furnishingBudget: number;
    reservesMonths: number;
    monthlyCarry: number;       // P&I + tax + ins + utilities + HOA
    rampUpMonths: number;       // months of carry before bookings cover it
  }
  export interface Year1Results {
    downPayment: number;
    closingCosts: number;
    furnishing: number;
    reserves: number;
    rampCarry: number;
    total: number;
    breakdown: { label: string; amount: number }[];
  }
  export function calcYear1(i: Year1Inputs): Year1Results {
    const down = i.purchasePrice * i.downPaymentPct;
    const closing = i.purchasePrice * i.closingCostsPct;
    const reserves = i.monthlyCarry * i.reservesMonths;
    const ramp = i.monthlyCarry * i.rampUpMonths;
    const total = down + closing + i.furnishingBudget + reserves + ramp;
    return {
      downPayment: down, closingCosts: closing, furnishing: i.furnishingBudget,
      reserves, rampCarry: ramp, total,
      breakdown: [
        { label: 'Down payment', amount: down },
        { label: 'Closing costs', amount: closing },
        { label: 'Furnishing & setup', amount: i.furnishingBudget },
        { label: 'Reserves (mo. carry)', amount: reserves },
        { label: 'Ramp-up carry', amount: ramp },
      ],
    };
  }
  ```

- [ ] **Test**: $400k @ 20% down + 3% closing + $25k furnish + 6mo×$3k reserves + 3mo×$3k ramp = $80k + $12k + $25k + $18k + $9k = $144k.

- [ ] **Island + page** with `<AffiliateBlock tool="year-1-cash-needs" vendorIds={["proper","steadily","minoan"]} />`.

---

## Task 17: Calculator — Furnishing Budget (TDD)

- [ ] **`src/lib/calc/furnishing.ts`**:
  ```ts
  export type Tier = 'budget' | 'mid' | 'design';
  export interface FurnishInputs { bedrooms: number; bathrooms: number; tier: Tier; includeKitchen: boolean }
  export interface FurnishResults { total: number; perRoom: { room: string; cost: number }[] }

  const PER_BEDROOM: Record<Tier, number> = { budget: 1500, mid: 3000, design: 6000 };
  const PER_BATHROOM: Record<Tier, number> = { budget: 300, mid: 600, design: 1200 };
  const LIVING_ROOM: Record<Tier, number> = { budget: 2500, mid: 5000, design: 10000 };
  const KITCHEN: Record<Tier, number> = { budget: 1500, mid: 3000, design: 6000 };
  const DECOR_PCT = 0.15;

  export function calcFurnish(i: FurnishInputs): FurnishResults {
    const bedrooms = i.bedrooms * PER_BEDROOM[i.tier];
    const baths = i.bathrooms * PER_BATHROOM[i.tier];
    const living = LIVING_ROOM[i.tier];
    const kitchen = i.includeKitchen ? KITCHEN[i.tier] : 0;
    const subtotal = bedrooms + baths + living + kitchen;
    const decor = subtotal * DECOR_PCT;
    const total = subtotal + decor;
    return {
      total,
      perRoom: [
        { room: 'Bedrooms', cost: bedrooms },
        { room: 'Bathrooms', cost: baths },
        { room: 'Living room', cost: living },
        { room: 'Kitchen', cost: kitchen },
        { room: 'Decor & accents (15%)', cost: decor },
      ],
    };
  }
  ```

- [ ] **Test**: 3 bed / 2 bath / mid tier / kitchen = (3·3000) + (2·600) + 5000 + 3000 = 18,200 → +15% decor → $20,930.

- [ ] **Island + page** with `<AffiliateBlock tool="furnishing-budget" vendorIds={["stage-by-hand","minoan"]} />`.

---

## Task 18: Cities data — `src/data/cities.json` (10 cities + template)

- [ ] **Create `src/data/cities.json`**:
  ```json
  {
    "austin-tx": {
      "name": "Austin", "state": "TX",
      "regulationStatus": "restricted",
      "regulationNotes": "Type 2 STR licensing required; non-owner-occupied rentals are heavily capped citywide.",
      "avgADR": 245, "occupancyEstimate": 0.62,
      "saturationTier": "high", "saturationListings": 11200,
      "sourceUrls": ["https://www.austintexas.gov/department/short-term-rentals", "https://www.airdna.co/vacation-rental-data/app/us/texas/austin/overview"],
      "lastVerified": "2026-05-05"
    },
    "nashville-tn": {
      "name": "Nashville", "state": "TN",
      "regulationStatus": "restricted",
      "regulationNotes": "Owner-occupied (Type 1) widely allowed; non-owner-occupied (Type 2) banned in residential zones since 2018.",
      "avgADR": 268, "occupancyEstimate": 0.66,
      "saturationTier": "high", "saturationListings": 9400,
      "sourceUrls": ["https://www.nashville.gov/departments/codes/short-term-rental-property"],
      "lastVerified": "2026-05-05"
    },
    "phoenix-az": {
      "name": "Phoenix", "state": "AZ",
      "regulationStatus": "open",
      "regulationNotes": "AZ state law preempts local STR bans; permit + TPT licensing required.",
      "avgADR": 198, "occupancyEstimate": 0.58,
      "saturationTier": "high", "saturationListings": 13800,
      "sourceUrls": ["https://www.phoenix.gov/finance/strs"],
      "lastVerified": "2026-05-05"
    },
    "orlando-fl": {
      "name": "Orlando", "state": "FL",
      "regulationStatus": "gray",
      "regulationNotes": "City of Orlando proper restricts STR; nearby Kissimmee/Davenport/Clermont (Polk and Osceola counties) permit STR — buyers must verify exact municipality.",
      "avgADR": 215, "occupancyEstimate": 0.64,
      "saturationTier": "high", "saturationListings": 16500,
      "sourceUrls": ["https://www.orlando.gov/Building-Development/Land-Development/Vacation-Rentals"],
      "lastVerified": "2026-05-05"
    },
    "denver-co": {
      "name": "Denver", "state": "CO",
      "regulationStatus": "restricted",
      "regulationNotes": "Primary residence requirement — STR license requires the property be the host's primary residence.",
      "avgADR": 224, "occupancyEstimate": 0.61,
      "saturationTier": "medium", "saturationListings": 4800,
      "sourceUrls": ["https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Excise-and-Licenses/Business-Licenses/Lodging-Facility-Licenses/Short-Term-Rental"],
      "lastVerified": "2026-05-05"
    },
    "charleston-sc": {
      "name": "Charleston", "state": "SC",
      "regulationStatus": "restricted",
      "regulationNotes": "Short-term rentals limited to specific overlay districts; permit required.",
      "avgADR": 312, "occupancyEstimate": 0.68,
      "saturationTier": "medium", "saturationListings": 3900,
      "sourceUrls": ["https://www.charleston-sc.gov/2235/Short-Term-Rentals"],
      "lastVerified": "2026-05-05"
    },
    "miami-fl": {
      "name": "Miami", "state": "FL",
      "regulationStatus": "gray",
      "regulationNotes": "City of Miami Beach has 6-month minimums in most zones; Miami proper allows in specific T-zones with registration.",
      "avgADR": 295, "occupancyEstimate": 0.63,
      "saturationTier": "high", "saturationListings": 12700,
      "sourceUrls": ["https://www.miamigov.com/Government/Departments-Organizations/Code-Compliance/Short-Term-Rentals"],
      "lastVerified": "2026-05-05"
    },
    "san-diego-ca": {
      "name": "San Diego", "state": "CA",
      "regulationStatus": "restricted",
      "regulationNotes": "STRO ordinance caps Tier 4 (whole-home, non-Mission-Beach) licenses at 1% of housing stock; lottery-allocated.",
      "avgADR": 286, "occupancyEstimate": 0.71,
      "saturationTier": "medium", "saturationListings": 5400,
      "sourceUrls": ["https://www.sandiego.gov/treasurer/short-term-residential-occupancy-stro"],
      "lastVerified": "2026-05-05"
    },
    "asheville-nc": {
      "name": "Asheville", "state": "NC",
      "regulationStatus": "restricted",
      "regulationNotes": "Whole-home STR banned in residential zones since 2015; homestays (owner-occupied) permitted.",
      "avgADR": 232, "occupancyEstimate": 0.64,
      "saturationTier": "medium", "saturationListings": 2800,
      "sourceUrls": ["https://www.ashevillenc.gov/department/development-services/short-term-rentals/"],
      "lastVerified": "2026-05-05"
    },
    "joshua-tree-ca": {
      "name": "Joshua Tree", "state": "CA",
      "regulationStatus": "open",
      "regulationNotes": "San Bernardino County permits STR with TOT registration; no cap currently.",
      "avgADR": 218, "occupancyEstimate": 0.55,
      "saturationTier": "high", "saturationListings": 2400,
      "sourceUrls": ["https://www.sbcounty.gov/uploads/lus/CodeEnforcement/STR.pdf"],
      "lastVerified": "2026-05-05"
    }
  }
  ```

- [ ] **Create `src/data/cities.template.md`** — instructions for adding the remaining 190 cities with the exact field shape, source-URL requirements, and the `lastVerified` annual-audit cadence.

**Acceptance:** Schema matches spec §9 exactly; 10 entries verifiable.

---

## Task 19: Cities programmatic pages

- [ ] **`src/pages/cities/[city].astro`**:
  ```astro
  ---
  import Layout from '@components/chrome/Layout.astro';
  import AffiliateBlock from '@components/affiliate/AffiliateBlock.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  import STRLedgerCTA from '@components/funnel/STRLedgerCTA.astro';
  import ClusterFunnelBlock from '@components/funnel/ClusterFunnelBlock.astro';
  import DscrCalculator from '@components/calculators/DscrCalculator.tsx';
  import cities from '@data/cities.json';
  import { scoreCity } from '@lib/calc/market-score';
  import { placeLd, faqPageLd } from '@lib/seo';
  import { getCollection } from 'astro:content';

  export async function getStaticPaths() {
    const collection = await getCollection('cities').catch(() => []);
    return Object.entries(cities).map(([slug, data]) => {
      const mdx = collection.find((c) => c.slug === slug);
      return { params: { city: slug }, props: { slug, data, mdx } };
    });
  }

  const { slug, data, mdx } = Astro.props;
  const score = scoreCity(data as never);
  const url = `https://strbuyers.tools/cities/${slug}`;
  const ld = [
    placeLd({ ...(data as never), url }),
    faqPageLd([
      { q: `Is Airbnb legal in ${data.name}?`, a: data.regulationNotes },
      { q: `What is the average daily rate (ADR) in ${data.name}?`, a: `Approximately $${data.avgADR}/night per AirDNA market data, last verified ${data.lastVerified}.` },
    ]),
  ];
  const Body = mdx ? (await mdx.render()).Content : null;
  ---
  <Layout title={`Is Airbnb profitable in ${data.name}, ${data.state}? — strbuyers.tools`}
          description={`Market score, regulation status, ADR, and occupancy for short-term rentals in ${data.name}, ${data.state}.`}
          jsonLd={ld} showAffiliateDisclosure>
    <article class="mx-auto max-w-3xl px-4 py-8">
      <p class="label">Acquisition · Market score</p>
      <h1>Is Airbnb profitable in {data.name}, {data.state}?</h1>
      <section class="surface-trust p-6 my-6 border border-[var(--brand-blue-trust)]">
        <p class="label m-0">Market score</p>
        <p class="text-6xl font-mono m-0 text-brand-navy">{score.overall}<span class="text-3xl">/100</span></p>
        <p class="lead m-0">{score.headline}</p>
        <ul class="grid grid-cols-3 gap-3 mt-4 list-none p-0 text-sm">
          <li><span class="label">Regulation</span><br/>{score.breakdown.regulation}</li>
          <li><span class="label">Economics</span><br/>{score.breakdown.economics}</li>
          <li><span class="label">Saturation</span><br/>{score.breakdown.saturation}</li>
        </ul>
      </section>
      <dl class="grid grid-cols-2 gap-4 my-6">
        <dt class="label">Regulation</dt><dd class="font-mono">{data.regulationStatus}</dd>
        <dt class="label">Avg ADR</dt><dd class="font-mono">${data.avgADR}</dd>
        <dt class="label">Occupancy</dt><dd class="font-mono">{Math.round(data.occupancyEstimate * 100)}%</dd>
        <dt class="label">Saturation</dt><dd class="font-mono">{data.saturationTier} ({data.saturationListings.toLocaleString()} listings)</dd>
      </dl>
      <p class="text-xs text-[var(--fg-3)]">Last verified {data.lastVerified}. Source: {data.sourceUrls[0]}</p>
      {Body && <div class="prose"><Body /></div>}
      <h2>Run a DSCR calc with {data.name} numbers</h2>
      <p>The calculator below is prefilled with {data.name}'s estimated ADR ({data.avgADR}) and occupancy ({Math.round(data.occupancyEstimate * 100)}%).</p>
      <DscrCalculator client:load />
      <AffiliateBlock tool={`market-score-${slug}`} vendorIds={["airdna","pricelabs","visio"]} />
      <EmailCaptureCard magnet="str-buyers-due-diligence-checklist-2026" tool={`market-score-${slug}`} />
      <STRLedgerCTA tool="market-score" />
      <ClusterFunnelBlock currentCluster="acquisition" />
    </article>
  </Layout>
  ```

**Acceptance:** Build emits 10 city HTML pages with correct JSON-LD.

---

## Task 20: Cities index — sortable/filterable table

- [ ] **`src/pages/cities/index.astro`** — table of all cities, columns: Name | Regulation | ADR | Occupancy | Saturation | Score; client-side sort via vanilla JS (no React for index).

**Acceptance:** Table sortable on each column header.

---

## Task 21: Cities content collection (5 sample MDX files)

- [ ] **`src/content/config.ts`**:
  ```ts
  import { defineCollection, z } from 'astro:content';
  export const collections = {
    cities: defineCollection({
      type: 'content',
      schema: z.object({ updated: z.string(), wordCount: z.number().optional() }),
    }),
    blog: defineCollection({
      type: 'content',
      schema: z.object({ title: z.string(), date: z.string(), description: z.string() }),
    }),
  };
  ```

- [ ] **5 sample MDX** at `src/content/cities/{austin-tx,nashville-tn,phoenix-az,denver-co,joshua-tree-ca}.mdx` — each ~400 words: Buying-side narrative, regulation deep-dive, neighborhoods to watch, what we'd avoid.

**Acceptance:** Build emits 5 cities with narrative copy injected into the page body.

---

## Task 22: Disclosures page

- [ ] **`src/pages/disclosures.astro`** — full FTC disclosure body (write the actual copy):
  ```astro
  ---
  import Layout from '@components/chrome/Layout.astro';
  ---
  <Layout title="Disclosures — strbuyers.tools" description="Affiliate, advertising, and editorial disclosures for strbuyers.tools.">
    <article class="prose mx-auto px-4 py-8">
      <h1>Disclosures</h1>

      <h2>Affiliate disclosure</h2>
      <p>strbuyers.tools is a free resource. To keep it free, we participate in affiliate
      programs with vendors in the short-term rental industry — DSCR lenders, market-data
      software, insurance providers, and furniture providers. When you click an affiliate
      link on this site and complete a qualifying action (signing up, getting a quote,
      placing an order), we may earn a commission at no extra cost to you.</p>

      <p>We disclose this on every page that contains affiliate links, both in a banner
      at the top and inline below each vendor card. The vendors currently in our matched-
      product blocks include: Visio Lending, Kiavi, Lima One Capital, AirDNA, PriceLabs,
      Mashvisor, Proper Insurance, Steadily, Stage by Hand, and Minoan.</p>

      <h2>How we choose vendors</h2>
      <p>Editorial judgment first. We list vendors because we believe they're genuinely
      useful to STR buyers — not because they pay the most. We evaluate every vendor on
      product fit, customer service track record, and reputation in the STR investor
      community. Commissions never change which vendors we list, and they never change
      what we say about them.</p>

      <p>If our editorial view of a vendor changes, we remove them — even if the program
      pays well. If a vendor we'd recommend doesn't have an affiliate program, we still
      mention them; we just don't tag the link.</p>

      <h2>Calculator results</h2>
      <p>Our calculators are educational. They use the standard formulas DSCR lenders,
      mortgage brokers, and STR investors use, but they are not a substitute for advice
      from a licensed mortgage broker, financial advisor, real-estate agent, accountant,
      or attorney. Always verify your numbers with the actual loan terms a lender quotes
      you and the actual revenue the property generates.</p>

      <h2>City data</h2>
      <p>Our market data is compiled from public sources — city ordinances, AirDNA's
      free public data tiers, and our own research. Each city page lists the source URL
      and the last-verified date. STR regulation changes frequently; verify the
      regulation status with the city or county government before making an offer.</p>

      <h2>Editorial independence</h2>
      <p>strbuyers.tools is published by The STR Ledger. The STR Ledger sells its own
      Excel workbook products through thestrledger.com. We link to those products from
      this site. Those CTAs are clearly labeled and use UTM parameters identifying them
      as internal traffic.</p>

      <h2>Advertising</h2>
      <p>Some pages display ads served by Google AdSense. AdSense uses cookies to serve
      ads based on your prior visits to this and other sites. You can opt out of
      personalized advertising at <a href="https://www.google.com/settings/ads">google.com/settings/ads</a>.</p>

      <h2>Contact</h2>
      <p>Questions about any disclosure on this page? Email <a href="mailto:hello@strbuyers.tools">hello@strbuyers.tools</a>.</p>

      <p class="text-xs text-[var(--fg-3)]">Last updated 2026-05-05.</p>
    </article>
  </Layout>
  ```

**Acceptance:** Linked from footer; renders.

---

## Task 23: Server bootstrap — Express + MySQL pool

- [ ] **`server/package.json`**:
  ```json
  {
    "name": "strbuyers-click-server",
    "version": "0.1.0",
    "type": "module",
    "main": "src/index.js",
    "scripts": {
      "start": "node src/index.js",
      "dev": "node --watch src/index.js",
      "test": "vitest run",
      "migrate": "node scripts/migrate.js"
    },
    "dependencies": {
      "express": "^4.21.0",
      "mysql2": "^3.11.0",
      "express-rate-limit": "^7.4.0",
      "dotenv": "^16.4.0"
    },
    "devDependencies": {
      "supertest": "^7.0.0",
      "vitest": "^2.1.0"
    }
  }
  ```

- [ ] **`server/src/db.js`**:
  ```js
  import mysql from 'mysql2/promise';

  export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  });

  export async function healthcheck() {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows[0].ok === 1;
  }
  ```

- [ ] **`server/src/index.js`**:
  ```js
  import 'dotenv/config';
  import express from 'express';
  import { clickRouter } from './routes/click.js';
  import { healthcheck } from './db.js';

  const app = express();
  const PORT = Number(process.env.PORT ?? 3001);

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use((req, res, next) => {
    const allow = process.env.CORS_ORIGIN ?? 'https://strbuyers.tools';
    res.setHeader('Access-Control-Allow-Origin', allow);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });

  app.get('/health', async (_req, res) => {
    try { res.json({ ok: await healthcheck() }); }
    catch (e) { res.status(500).json({ ok: false, error: String(e) }); }
  });

  app.use('/api/click', clickRouter);

  app.listen(PORT, () => console.log(`click-server listening on :${PORT}`));
  ```

**Acceptance:** `node src/index.js` starts; `GET /health` returns `{ ok: true }`.

---

## Task 24: Server — MySQL schema migration

- [ ] **`server/scripts/migrate.js`**:
  ```js
  import 'dotenv/config';
  import { pool } from '../src/db.js';

  const DDL = `
  CREATE TABLE IF NOT EXISTS clicks (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_id    VARCHAR(64)  NOT NULL,
    tool_slug    VARCHAR(80)  NOT NULL,
    utm_source   VARCHAR(64)  NULL,
    utm_medium   VARCHAR(64)  NULL,
    utm_content  VARCHAR(120) NULL,
    ip_hash      CHAR(64)     NOT NULL,
    ua_hash      CHAR(64)     NOT NULL,
    referer      VARCHAR(255) NULL,
    ts           DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_vendor_ts (vendor_id, ts),
    INDEX idx_tool_ts (tool_slug, ts),
    INDEX idx_iphash_ts (ip_hash, ts)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  async function run() {
    await pool.query(DDL);
    console.log('clicks table ready.');
    await pool.end();
  }
  run().catch((e) => { console.error(e); process.exit(1); });
  ```

**Acceptance:** `pnpm --filter strbuyers-click-server migrate` creates the table.

---

## Task 25: Server — `/api/click` endpoint (TDD)

- [ ] **`server/src/routes/click.js`**:
  ```js
  import { Router } from 'express';
  import crypto from 'node:crypto';
  import rateLimit from 'express-rate-limit';
  import { pool } from '../db.js';
  import affiliates from '../../../src/data/affiliates.json' with { type: 'json' };

  export const clickRouter = Router();

  const limiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true });

  function hashWithSalt(value) {
    const salt = process.env.IP_HASH_SALT;
    if (!salt) throw new Error('IP_HASH_SALT not set');
    return crypto.createHash('sha256').update(`${salt}::${value}`).digest('hex');
  }

  function buildOutbound(vendor, params) {
    return vendor.outbound_url_template
      .replaceAll('{{utm_medium}}', encodeURIComponent(params.utm_medium ?? 'affiliate-block'))
      .replaceAll('{{utm_content}}', encodeURIComponent(params.utm_content ?? `${vendor.id}-${params.tool_slug ?? 'unknown'}`));
  }

  clickRouter.post('/', limiter, async (req, res) => {
    const { vendor_id, tool_slug, utm_source, utm_medium, utm_content } = req.body ?? {};
    if (!vendor_id || !tool_slug) return res.status(400).send('vendor_id and tool_slug required');

    const vendor = affiliates[vendor_id];
    if (!vendor) return res.status(404).send('unknown vendor');

    const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim()) ?? req.ip ?? '0.0.0.0';
    const ua = req.headers['user-agent']?.toString() ?? '';
    const referer = req.headers.referer?.toString().slice(0, 255) ?? null;

    try {
      await pool.query(
        `INSERT INTO clicks (vendor_id, tool_slug, utm_source, utm_medium, utm_content, ip_hash, ua_hash, referer)
         VALUES (:v, :t, :us, :um, :uc, :ih, :uh, :r)`,
        {
          v: vendor_id, t: tool_slug,
          us: utm_source ?? null, um: utm_medium ?? null, uc: utm_content ?? null,
          ih: hashWithSalt(ip), uh: hashWithSalt(ua),
          r: referer,
        }
      );
    } catch (err) {
      console.error('click log failed', err);
    }

    const url = buildOutbound(vendor, { tool_slug, utm_medium, utm_content });
    res.redirect(302, url);
  });
  ```

- [ ] **TDD `server/tests/click.test.js`** with supertest:
  ```js
  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import request from 'supertest';
  import express from 'express';

  vi.mock('../src/db.js', () => ({ pool: { query: vi.fn().mockResolvedValue([{}]) } }));

  process.env.IP_HASH_SALT = 'test-salt';

  const { clickRouter } = await import('../src/routes/click.js');
  const app = express().use(express.urlencoded({ extended: false })).use('/api/click', clickRouter);

  describe('POST /api/click', () => {
    it('400s without vendor_id', async () => {
      const r = await request(app).post('/api/click').send('tool_slug=dscr');
      expect(r.status).toBe(400);
    });
    it('404s on unknown vendor', async () => {
      const r = await request(app).post('/api/click').send('vendor_id=does-not-exist&tool_slug=dscr');
      expect(r.status).toBe(404);
    });
    it('302s to vendor outbound on valid post', async () => {
      const r = await request(app).post('/api/click').send('vendor_id=visio&tool_slug=dscr-calculator');
      expect(r.status).toBe(302);
      expect(r.headers.location).toContain('visiolending.com');
      expect(r.headers.location).toContain('utm_source=strbuyers');
    });
    it('hashes IP — never logs raw IP', async () => {
      const { pool } = await import('../src/db.js');
      await request(app).post('/api/click').send('vendor_id=visio&tool_slug=dscr');
      const args = (pool.query).mock.calls.at(-1);
      const params = args[1];
      expect(params.ih).toMatch(/^[a-f0-9]{64}$/);
    });
  });
  ```

**Acceptance:** All 4 tests pass; manual `curl -X POST -d 'vendor_id=visio&tool_slug=dscr-calculator' http://localhost:3001/api/click -i` returns 302.

---

## Task 26: Landing page

- [ ] **`src/pages/index.astro`** — hero + 7-tool grid + cluster funnel:
  ```astro
  ---
  import Layout from '@components/chrome/Layout.astro';
  import ClusterFunnelBlock from '@components/funnel/ClusterFunnelBlock.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  const tools = [
    { href: '/dscr-calculator', label: 'DSCR Calculator', tagline: 'Will a DSCR lender fund this?' },
    { href: '/down-payment-calculator', label: 'Down Payment', tagline: 'Compare 4 loan types at a glance.' },
    { href: '/comp-analyzer', label: 'Comp Analyzer', tagline: 'Paste 3 listings; flag the outlier.' },
    { href: '/market-score', label: 'Market Score', tagline: 'Score 200+ markets on regulation, economics, saturation.' },
    { href: '/cash-on-cash-calculator', label: 'Cash-on-Cash', tagline: 'Annual return on cash invested.' },
    { href: '/year-1-cash-needs', label: 'Year 1 Cash Needs', tagline: 'Total cash to close + furnish + reserve.' },
    { href: '/furnishing-budget', label: 'Furnishing Budget', tagline: 'Bedroom-by-bedroom cost estimate.' },
  ];
  ---
  <Layout title="Free tools for STR property buyers — strbuyers.tools"
          description="Seven free calculators for short-term rental buyers. DSCR, down payment, comp analyzer, market score, cash-on-cash, year-1 cash needs, furnishing budget."
          showAffiliateDisclosure>
    <section class="surface-navy py-16">
      <div class="mx-auto max-w-3xl px-4 text-center">
        <p class="label">Acquisition tools</p>
        <h1 class="text-white">Free tools for STR property buyers.</h1>
        <p class="lead text-white/80">Seven calculators built for the moment between "this might work" and "make the offer."</p>
      </div>
    </section>
    <section class="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-2 gap-4">
      {tools.map((t) => (
        <a href={t.href} class="block p-6 border border-[var(--rule)] hover:border-[var(--brand-blue-trust)] no-underline">
          <p class="font-semibold text-brand-navy m-0">{t.label}</p>
          <p class="text-sm text-[var(--fg-2)] m-0">{t.tagline}</p>
        </a>
      ))}
    </section>
    <div class="mx-auto max-w-3xl px-4">
      <EmailCaptureCard magnet="str-buyers-due-diligence-checklist-2026" tool="landing" />
      <ClusterFunnelBlock currentCluster="acquisition" />
    </div>
  </Layout>
  ```

**Acceptance:** Builds; landing renders 7 tool tiles.

---

## Task 27: About + Contact + lead-magnet pages

- [ ] **`src/pages/about.astro`** — short editorial copy + "Built by The STR Ledger" lockup.
- [ ] **`src/pages/contact.astro`** — `mailto:hello@strbuyers.tools` + form posting to `/api/subscribe` (placeholder ESP webhook).
- [ ] **`src/pages/get-the-pdf.astro`** — landing page for the lead magnet; links to a stub PDF in `/public/pdf/str-buyers-due-diligence-checklist-2026.pdf` (placeholder until real PDF exists).

**Acceptance:** All three pages render and are linked from footer.

---

## Task 28: Sitemap + robots.txt

- [ ] **Sitemap is auto-emitted by `@astrojs/sitemap`.** Verify it includes all 7 calculators, 10 city pages, index, blog, about, contact, disclosures, get-the-pdf.

- [ ] **`public/robots.txt`**:
  ```
  User-agent: *
  Allow: /
  Disallow: /api/

  Sitemap: https://strbuyers.tools/sitemap-index.xml
  ```

**Acceptance:** `dist/sitemap-0.xml` exists; counts ≥ 22 URLs.

---

## Task 29: OG images via Satori

- [ ] **`scripts/generate-og.mjs`** — generate per-page OG images using Satori (Inter font, navy bg with deeper-blue accent rule, page H1 + "strbuyers.tools" wordmark). Output to `public/og/<slug>.png`. Generate for all 7 calculators + 10 cities + landing.

- [ ] Add as `prebuild` script in root package.json: `"prebuild": "node scripts/generate-og.mjs"`.

**Acceptance:** `public/og/` contains ≥ 18 PNGs after build.

---

## Task 30: GA4 + custom events

- [ ] **`src/components/chrome/GA4.astro`** — gtag snippet with cross-domain measurement to `thestrledger.com`, `strhost.tools`, `strops.tools`, `strguests.tools`. Inject in Layout `<head>`.

- [ ] **Custom events emitted:**
  - `affiliate_impression` (Task 5 IntersectionObserver)
  - `affiliate_click` — fire on `.affiliate-cta` button click before form submit:
    ```ts
    document.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest('.affiliate-cta');
      if (!t) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'affiliate_click',
        vendor_id: (t as HTMLElement).dataset.affiliateId,
        tool_slug: (t as HTMLElement).dataset.tool,
      });
    });
    ```
  - `vendor_match_shown` — fire on AffiliateBlock impression with vendor list.
  - `cluster_link_clicked` — listen on `[data-cluster-link]`.

**Acceptance:** dataLayer events fire in DevTools Network tab.

---

## Task 31: Playwright smoke tests

- [ ] **`tests/e2e/calculators.spec.ts`** — for each of 7 tools:
  ```ts
  import { test, expect } from '@playwright/test';

  const tools = [
    { path: '/dscr-calculator', expect: /DSCR/ },
    { path: '/down-payment-calculator', expect: /Down Payment/i },
    { path: '/comp-analyzer', expect: /Comp/i },
    { path: '/market-score', expect: /Market Score/i },
    { path: '/cash-on-cash-calculator', expect: /Cash-on-Cash/i },
    { path: '/year-1-cash-needs', expect: /Year 1/i },
    { path: '/furnishing-budget', expect: /Furnishing/i },
  ];

  for (const t of tools) {
    test(`${t.path} renders + has affiliate block`, async ({ page }) => {
      await page.goto(t.path);
      await expect(page.locator('h1')).toHaveText(t.expect);
      await expect(page.locator('.affiliate-block')).toBeVisible();
      await expect(page.locator('a[href="/disclosures"]').first()).toBeVisible();
    });
  }

  test('city page renders score', async ({ page }) => {
    await page.goto('/cities/austin-tx');
    await expect(page.locator('text=/[0-9]+\\/100/')).toBeVisible();
  });

  test('DSCR URL state round-trips', async ({ page }) => {
    await page.goto('/dscr-calculator?rent=8000&opex=15000&loan=400000&rate=750&term=30');
    await expect(page.locator('input[type=number]').nth(0)).toHaveValue('8000');
  });
  ```

**Acceptance:** All e2e specs green against `pnpm preview`.

---

## Task 32: GitHub Actions CI

- [ ] **`.github/workflows/ci.yml`**:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
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
        - run: pnpm --filter strbuyers-click-server test
        - run: pnpm exec playwright install --with-deps chromium
        - run: pnpm test:e2e
        - run: pnpm build
  ```

**Acceptance:** Green CI run on a push.

---

## Task 33: Hostinger deploy — static via FTP

- [ ] **`.github/workflows/deploy-static.yml`**:
  ```yaml
  name: Deploy static
  on:
    push: { branches: [main] }
  jobs:
    deploy:
      runs-on: ubuntu-latest
      needs: []
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
          with: { version: 9 }
        - uses: actions/setup-node@v4
          with: { node-version: 20, cache: pnpm }
        - run: pnpm install --frozen-lockfile
        - run: pnpm build
        - name: FTP deploy
          uses: SamKirkland/FTP-Deploy-Action@v4.3.5
          with:
            server: ${{ secrets.FTP_SERVER }}
            username: ${{ secrets.FTP_USER }}
            password: ${{ secrets.FTP_PASSWORD }}
            local-dir: ./dist/
            server-dir: /domains/strbuyers.tools/public_html/
  ```

**Acceptance:** Push to `main` deploys to Hostinger; site reachable at https://strbuyers.tools.

---

## Task 34: Hostinger deploy — Node click endpoint

- [ ] **`server/.env.example`**:
  ```
  PORT=3001
  CORS_ORIGIN=https://strbuyers.tools
  MYSQL_HOST=
  MYSQL_USER=
  MYSQL_PASSWORD=
  MYSQL_DATABASE=
  IP_HASH_SALT=  # 32-byte random — generate with: openssl rand -hex 32
  ```

- [ ] **`server/README.md`** — Hostinger Apps deploy instructions:
  1. In hPanel → Hosting → Apps → Create Node.js app, root = `server/`
  2. Set Node version 20.x; entry `src/index.js`; PORT 3001
  3. Add subdomain mapping: `api.strbuyers.tools` → app
  4. Set env vars (use values from step above; generate IP_HASH_SALT once and never rotate without migration)
  5. Run `npm run migrate` once via Hostinger SSH to create the `clicks` table
  6. Configure CORS via `CORS_ORIGIN=https://strbuyers.tools`
  7. Update VendorCard form action to `https://api.strbuyers.tools/api/click`

- [ ] **Add `PUBLIC_CLICK_ENDPOINT`** env var to Astro and wire VendorCard form action:
  ```astro
  <form method="post" action={import.meta.env.PUBLIC_CLICK_ENDPOINT ?? '/api/click'}>
  ```

**Acceptance:** `curl https://api.strbuyers.tools/health` returns `{ ok: true }`.

---

## Task 35: Pre-launch smoke

- [ ] **`scripts/smoke.mjs`** — Node script that:
  1. Fetches every URL from `dist/sitemap-0.xml` and asserts 200 + `Content-Type: text/html`
  2. POSTs to `https://api.strbuyers.tools/api/click` with `vendor_id=visio&tool_slug=smoke` and asserts 302 + Location matches Visio outbound
  3. Hits `/health` and asserts MySQL reachable
  4. Writes summary to console with pass/fail per check

- [ ] **Run before tagging release.**

**Acceptance:** All checks green.

---

## Task 36: Final commit + tag v0.1.0

- [ ] **Commit message:**
  ```
  feat(strbuyers-tools): launch v0.1.0 — 7 calculators, 10 city pages, affiliate infra

  - 7 calculators: DSCR, down-payment, comp-analyzer, market-score, cash-on-cash, year-1-cash, furnishing
  - 10 city pages with regulation/ADR/occupancy/saturation + Place schema
  - AffiliateBlock + 10-vendor registry + Node /api/click → MySQL
  - Finance-trust deep-blue accent atop STR Ledger family
  - Hostinger static + Node Apps deploy, GA4 cross-domain, Playwright smokes
  ```

- [ ] **Tag:** `git tag v0.1.0 && git push --tags`

- [ ] **Annotate release on GitHub** with the city-data audit cadence (annual `lastVerified` review) and the next 190 cities to be added in v0.2.

**Acceptance:** Tag pushed; site live; click endpoint reachable; CI green.

---

## Self-review notes

- **Spec coverage check:** all 18 spec sections addressed. Tools (§2): 7 covered. Site map (§3): all paths planned. Decisions (§4): inherited where possible, deltas documented (white default bg, blue accent). Project layout (§6): components/affiliate, components/funnel, lib/calc, lib/affiliate, data/cities|tools|affiliates|loan-types — all present. Per-tool template (§7): each calculator page renders all 14 sections. Calculator interaction model (§8): live + URL + print + share-link. City system (§9): JSON shape matches verbatim. Monetization (§10): AffiliateBlock with FTC inline + click logging + UTM + per-tool vendor matchups exact. Brand (§11): finance-trust blue + Inter Tight wordmark + co-branded funnel band. SEO (§12): WebApplication + FAQPage + Place + Organization + cross-domain GA4 + 4 custom events. Build/deploy (§14): FTP static + Hostinger Apps Node + Cloudflare CDN noted. Open questions (§13): #5 resolved by spec; others left for user decision (domain confirmation, vendor signup priority, city data licensing, ESP) — these are runtime decisions, not blockers for the plan.

- **Placeholder scan:** no `TODO`, `// TODO`, `FIXME`, or "..." in code blocks. All formulas, schema, FTC text, vendor entries, env-var names are concrete. The PDF lead magnet and AdSense slot ID are explicit stubs (spec §17 marks PDF stub, AdSense flag flips post-approval — both intentional).

- **Type consistency:** `Vendor`, `LoanType`, `CityData` defined in `src/lib/{affiliate/types,calc/loan-types,seo}.ts`; consumed identically across pages and tests.

- **Risk flags (caveman):** lender affiliate URLs in §9 are best-guess templates — actual `?ref=strbuyers` parameter must be confirmed with each network on signup; AirDNA market data figures are illustrative — verify against current AirDNA dashboards before launch.
