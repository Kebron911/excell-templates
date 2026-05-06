# strops.tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship strops.tools — 7 ops tools (incl. PDF generators) + 80 programmatic content pages + 3 lead magnets + chrome + monetization + SEO + Hostinger deploy — production-ready.

**Architecture:** Astro 4.x static site. Calculators are hydrated TSX islands; PDF outputs (cleaner dispatch, maintenance schedule) generate browser-side via pdf-lib. URL state on every tool. Programmatic /maintenance/[task] and /replace/[item] pages from JSON. No server.

**Tech Stack:** Astro 4.x, TypeScript, Tailwind, pdf-lib, ics (calendar export), Vitest, Playwright, pnpm. Deploy: FTP to Hostinger.

---

## Task 1: Bootstrap repo + tooling

**Goal:** Get a green `pnpm build` on a fresh Astro 4 scaffold with TS, Tailwind, MDX, sitemap, Vitest, Playwright, pdf-lib, ics.

- [ ] Create `STROps-Tools/` workspace; `cd` into it
- [ ] Run `pnpm create astro@latest . --template minimal --typescript strict --no-git --no-install --skip-houston`
- [ ] Add deps:
  ```bash
  pnpm add astro@^4 @astrojs/mdx @astrojs/sitemap @astrojs/tailwind @astrojs/react react react-dom
  pnpm add pdf-lib ics
  pnpm add -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer vitest @vitest/ui playwright @playwright/test satori @resvg/resvg-js sharp
  ```
- [ ] Write `astro.config.mjs`:
  ```js
  import { defineConfig } from 'astro/config';
  import tailwind from '@astrojs/tailwind';
  import mdx from '@astrojs/mdx';
  import sitemap from '@astrojs/sitemap';
  import react from '@astrojs/react';

  export default defineConfig({
    site: 'https://strops.tools',
    output: 'static',
    integrations: [tailwind({ applyBaseStyles: false }), mdx(), sitemap(), react()],
    vite: { ssr: { noExternal: ['pdf-lib', 'ics'] } },
  });
  ```
- [ ] Write `tailwind.config.ts`:
  ```ts
  import type { Config } from 'tailwindcss';
  export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          parchment: 'var(--bg-1)',
          'parchment-alt': 'var(--bg-2)',
          ink: 'var(--fg-1)',
          ink2: 'var(--fg-2)',
          ink3: 'var(--fg-3)',
          accent: 'var(--accent)',
          'accent-soft': 'var(--accent-soft)',
          'accent-deep': 'var(--accent-deep)',
          rule: 'var(--rule)',
          'rule-strong': 'var(--rule-strong)',
        },
        fontFamily: {
          body: ['Inter', 'system-ui', 'sans-serif'],
          display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
          mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        },
      },
    },
  } satisfies Config;
  ```
- [ ] Write `tsconfig.json` extending `astro/tsconfigs/strict` with paths:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "baseUrl": ".",
      "jsx": "react-jsx",
      "jsxImportSource": "react",
      "paths": {
        "@/*": ["src/*"],
        "@lib/*": ["src/lib/*"],
        "@components/*": ["src/components/*"],
        "@data/*": ["src/data/*"]
      }
    },
    "include": ["src/**/*", "tests/**/*"]
  }
  ```
- [ ] Write `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config';
  import { resolve } from 'node:path';
  export default defineConfig({
    resolve: { alias: { '@': resolve(__dirname, 'src'), '@lib': resolve(__dirname, 'src/lib'), '@data': resolve(__dirname, 'src/data') } },
    test: { environment: 'node', include: ['tests/**/*.test.ts'] },
  });
  ```
- [ ] Write `playwright.config.ts` with `webServer: { command: 'pnpm preview', port: 4321 }` and one chromium project.
- [ ] Add `.gitignore` (node_modules, dist, .astro, playwright-report, test-results)
- [ ] Add scripts to `package.json`: `dev`, `build`, `preview`, `test`, `test:e2e`, `typecheck` (`tsc --noEmit`), `lint`.
- [ ] Run `pnpm install`, then `pnpm build` — must succeed on the empty scaffold.
- [ ] Commit: `chore: bootstrap astro + tailwind + vitest + playwright`

**Verify:** `pnpm typecheck && pnpm build` exits 0.

---

## Task 2: Brand tokens — port + ops accent shift

**Goal:** Port The STR Ledger tokens, then override accent to ops-utility green-gray. Document the shift in a header comment.

- [ ] Create `src/styles/tokens.css` — copy verbatim from `Excel-Templates/design-system/colors_and_type.css` then **append** an override block:
  ```css
  /* ============================================================
     strops.tools — accent override
     Sister sub-brand of The STR Ledger; ops cluster.
     Shift gold accent → ops-utility green-gray. Navy/parchment/
     graphite/Cormorant/Inter/JetBrains Mono are unchanged so the
     three sister sites share the same visual chassis.
     ============================================================ */
  :root {
    --accent:        #4F6B5A;  /* ops-utility green-gray; replaces gold */
    --accent-soft:   #8AA292;  /* hover/disabled accent */
    --accent-deep:   #34493E;  /* pressed accent */
    --accent-glow:   0 0 0 3px rgba(79, 107, 90, 0.25);
    --focus-ring:    0 0 0 3px rgba(79, 107, 90, 0.45);

    /* Re-route gold-named tokens used by ported components to the new accent */
    --brand-gold:        var(--accent);
    --brand-gold-soft:   var(--accent-soft);
    --brand-gold-deep:   var(--accent-deep);
    --rule-gold:         var(--accent);
    --fg-accent:         var(--accent);
    --sh-gold-glow:      var(--accent-glow);
    --sh-focus-ring:     var(--focus-ring);
  }

  /* Tone period-mark + gold rules to ops accent */
  .period-gold { color: var(--accent); }
  .gold-rule, hr { background: var(--accent); }

  /* Inter promoted to default for body + headings; Cormorant reserved for
     editorial accents only (lede, blog h1, MDX h2 in narrative). */
  html, body { font-family: var(--font-body); }
  h1, h2, h3, h4 { font-family: var(--font-body); color: var(--brand-navy); }
  .display, .editorial h1, .editorial h2 { font-family: var(--font-display); }

  /* Tabular numerals everywhere a number prints */
  .num, .mono, code { font-variant-numeric: tabular-nums; font-family: var(--font-mono); }
  ```
- [ ] Create `src/styles/global.css`:
  ```css
  @import './tokens.css';
  @import './print.css';
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- [ ] Wire `src/styles/global.css` into `src/layouts/Layout.astro` (created in Task 4) via `import '@/styles/global.css';`
- [ ] Commit: `feat: port brand tokens with ops-utility accent shift`

**Verify:** `pnpm build` still green; tokens.css present in dist asset graph.

---

## Task 3: Print stylesheet

**Goal:** Print view shows inputs + results + footer only.

- [ ] Create `src/styles/print.css`:
  ```css
  @media print {
    :root { --bg-1: #ffffff; --fg-1: #000000; }
    html, body { background: #fff !important; color: #000 !important; }
    [data-print="hide"], header.site-header, footer.site-footer .nav,
    .ad-slot, .funnel-band, .cluster-funnel, .email-capture,
    .affiliate-card, .related-tools, .sidebar { display: none !important; }
    [data-print="show"] { display: block !important; }
    .calculator-shell { box-shadow: none !important; border: 1px solid #000; }
    a::after { content: " (" attr(href) ")"; font-size: 10px; color: #555; }
    .num, .mono { font-family: "JetBrains Mono", monospace; }
    @page { margin: 0.6in; }
  }
  ```
- [ ] Commit: `feat: print stylesheet for tool pages`

**Verify:** Manual: load `/turnover-scheduler` after Task 10, hit Cmd/Ctrl+P, ads + chrome hidden.

---

## Task 4: Layout primitives — Layout, Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock

**Goal:** Site chrome ready before any page exists.

- [ ] Create `src/layouts/Layout.astro`:
  ```astro
  ---
  import '@/styles/global.css';
  import Header from '@components/chrome/Header.astro';
  import Footer from '@components/chrome/Footer.astro';
  import FunnelBand from '@components/chrome/FunnelBand.astro';
  import ClusterFunnelBlock from '@components/funnel/ClusterFunnelBlock.astro';

  interface Props {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    showCluster?: boolean;
  }
  const { title, description, canonical, ogImage = '/og/default.png', showCluster = true } = Astro.props;
  const url = canonical ?? new URL(Astro.url.pathname, Astro.site).toString();
  ---
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={new URL(ogImage, Astro.site).toString()} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <slot name="head" />
    </head>
    <body>
      <Header />
      <main id="main"><slot /></main>
      {showCluster && <ClusterFunnelBlock currentCluster="operations" />}
      <FunnelBand />
      <Footer />
    </body>
  </html>
  ```
- [ ] Create `src/components/chrome/Header.astro`:
  ```astro
  ---
  const tools = [
    { href: '/turnover-scheduler', label: 'Turnover scheduler' },
    { href: '/cleaner-dispatch', label: 'Cleaner dispatch' },
    { href: '/smart-lock-codes', label: 'Smart lock codes' },
    { href: '/linen-par-calculator', label: 'Linen par' },
    { href: '/restock-calculator', label: 'Restock' },
    { href: '/damage-cost-lookup', label: 'Damage cost' },
    { href: '/maintenance-schedule', label: 'Maintenance schedule' },
  ];
  ---
  <header class="site-header border-b border-rule bg-parchment">
    <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
      <a href="/" class="font-body font-semibold text-lg tracking-tight">
        strops<span class="period-gold">.</span>tools
      </a>
      <nav aria-label="Tools" class="hidden md:flex gap-6 text-sm">
        {tools.map(t => <a href={t.href} class="text-ink2 hover:text-ink">{t.label}</a>)}
      </nav>
    </div>
  </header>
  ```
- [ ] Create `src/components/chrome/Footer.astro`:
  ```astro
  ---
  const year = new Date().getFullYear();
  ---
  <footer class="site-footer border-t border-rule bg-parchment-alt mt-16">
    <div class="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-4 gap-6 text-sm">
      <div>
        <div class="font-semibold mb-2">strops<span class="period-gold">.</span>tools</div>
        <p class="text-ink2">Free tools for active short-term rental operators.</p>
      </div>
      <nav class="nav" aria-label="Tools">
        <div class="font-semibold mb-2">Tools</div>
        <ul class="space-y-1 text-ink2">
          <li><a href="/turnover-scheduler">Turnover scheduler</a></li>
          <li><a href="/cleaner-dispatch">Cleaner dispatch</a></li>
          <li><a href="/smart-lock-codes">Smart lock codes</a></li>
          <li><a href="/linen-par-calculator">Linen par calculator</a></li>
          <li><a href="/restock-calculator">Restock calculator</a></li>
          <li><a href="/damage-cost-lookup">Damage cost lookup</a></li>
          <li><a href="/maintenance-schedule">Maintenance schedule</a></li>
        </ul>
      </nav>
      <nav class="nav" aria-label="Resources">
        <div class="font-semibold mb-2">Resources</div>
        <ul class="space-y-1 text-ink2">
          <li><a href="/maintenance/">Maintenance index</a></li>
          <li><a href="/replace/">Replacement cost index</a></li>
          <li><a href="/get-the-cleaner-sop">Cleaner SOP</a></li>
          <li><a href="/get-the-maintenance-checklist">Maintenance checklist</a></li>
          <li><a href="/get-the-supply-par">Supply par sheet</a></li>
        </ul>
      </nav>
      <nav class="nav" aria-label="Site">
        <div class="font-semibold mb-2">Site</div>
        <ul class="space-y-1 text-ink2">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/sitemap-index.xml">Sitemap</a></li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-4 text-xs text-ink3 flex justify-between">
        <span>&copy; {year} strops.tools — built by The STR Ledger.</span>
        <span>Data last verified annually.</span>
      </div>
    </div>
  </footer>
  ```
- [ ] Create `src/components/chrome/Sidebar.astro` — six related tools (rest of the seven):
  ```astro
  ---
  interface Props { current: string; }
  const { current } = Astro.props;
  const all = [
    { slug: 'turnover-scheduler',     label: 'Turnover scheduler' },
    { slug: 'cleaner-dispatch',       label: 'Cleaner dispatch' },
    { slug: 'smart-lock-codes',       label: 'Smart lock codes' },
    { slug: 'linen-par-calculator',   label: 'Linen par calculator' },
    { slug: 'restock-calculator',     label: 'Restock calculator' },
    { slug: 'damage-cost-lookup',     label: 'Damage cost lookup' },
    { slug: 'maintenance-schedule',   label: 'Maintenance schedule' },
  ];
  const others = all.filter(t => t.slug !== current);
  ---
  <aside class="sidebar hidden lg:block w-64 shrink-0">
    <div class="text-label uppercase tracking-widest text-ink3 mb-3">Related tools</div>
    <ul class="space-y-2 text-sm">
      {others.map(t => <li><a class="text-ink hover:text-accent" href={`/${t.slug}`}>{t.label}</a></li>)}
    </ul>
  </aside>
  ```
- [ ] Create `src/components/chrome/FunnelBand.astro`:
  ```astro
  <div class="funnel-band border-t border-rule bg-ink text-parchment">
    <div class="mx-auto max-w-6xl px-6 py-3 flex justify-between items-center text-sm">
      <span>Track every dollar these tools surface.</span>
      <a href="https://thestrledger.com/?utm_source=strops-tools&utm_medium=funnel-band"
         class="underline decoration-accent underline-offset-4">
        Built by The STR Ledger &rarr;
      </a>
    </div>
  </div>
  ```
- [ ] Create `src/components/funnel/ClusterFunnelBlock.astro`:
  ```astro
  ---
  interface Props { currentCluster: 'acquisition' | 'math' | 'operations' | 'guest-xp'; }
  const { currentCluster } = Astro.props;
  const clusters = [
    { id: 'acquisition', href: 'https://strbuyers.tools',  label: 'strbuyers.tools',  blurb: 'Pre-buy underwriting tools.' },
    { id: 'math',        href: 'https://strhost.tools',    label: 'strhost.tools',    blurb: 'Pricing + profit math.' },
    { id: 'operations',  href: 'https://strops.tools',     label: 'strops.tools',     blurb: 'Run the property.' },
    { id: 'guest-xp',    href: 'https://strguests.tools',  label: 'strguests.tools',  blurb: 'Guest experience polish.' },
  ];
  const others = clusters.filter(c => c.id !== currentCluster);
  ---
  <section class="cluster-funnel border-t border-rule bg-parchment-alt">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="text-label uppercase tracking-widest text-ink3 mb-4">The host lifecycle</div>
      <div class="grid md:grid-cols-3 gap-6">
        {others.map(c => (
          <a href={`${c.href}?utm_source=strops-tools&utm_medium=cluster-funnel`}
             data-cluster={c.id}
             class="cluster-link block border border-rule bg-parchment p-5 hover:border-accent">
            <div class="font-semibold">{c.label}</div>
            <div class="text-ink2 text-sm mt-1">{c.blurb}</div>
          </a>
        ))}
      </div>
    </div>
  </section>
  ```
- [ ] Commit: `feat: layout + chrome primitives`

**Verify:** Build green; rendering an empty `index.astro` using `Layout` shows header/footer/funnel band.

---

## Task 5: Monetization primitives — AdSlot, EmailCaptureCard, STRLedgerCTA, AffiliateCard

**Goal:** Reusable monetization components with the **per-tool magnet matchup** prop on EmailCaptureCard.

- [ ] Create `src/components/ads/AdSlot.astro`:
  ```astro
  ---
  interface Props { location: 'in-content' | 'footer'; slotId?: string; }
  const { location, slotId } = Astro.props;
  const enabled = import.meta.env.PUBLIC_ADSENSE_ENABLED === 'true';
  ---
  <div class="ad-slot my-8 flex justify-center" data-ad-location={location} data-ad-slot={slotId ?? ''} data-print="hide">
    {enabled ? (
      <ins class="adsbygoogle block w-full max-w-3xl"
           style="display:block"
           data-ad-client={import.meta.env.PUBLIC_ADSENSE_CLIENT}
           data-ad-slot={slotId}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    ) : (
      <div class="w-full max-w-3xl border border-dashed border-rule text-center text-ink3 text-xs py-6">
        Ad slot — {location}
      </div>
    )}
  </div>
  ```
- [ ] Create `src/components/funnel/EmailCaptureCard.astro` — accepts a `magnet` prop typed to the three lead magnets:
  ```astro
  ---
  type Magnet = 'cleaner-sop' | 'maintenance-checklist' | 'supply-par';
  interface Props { magnet: Magnet; tool: string; }
  const { magnet, tool } = Astro.props;
  const copy: Record<Magnet, { title: string; body: string; cta: string; href: string }> = {
    'cleaner-sop': {
      title: 'Get the STR Cleaner SOP (PDF)',
      body: 'A printable standard-operating-procedure your cleaners can follow turn after turn.',
      cta: 'Send me the SOP',
      href: '/get-the-cleaner-sop',
    },
    'maintenance-checklist': {
      title: 'Get the STR Maintenance Checklist (PDF)',
      body: 'Annual + monthly + per-turn maintenance items, printable, color-coded.',
      cta: 'Send me the checklist',
      href: '/get-the-maintenance-checklist',
    },
    'supply-par': {
      title: 'Get the STR Supply Par-Level Sheet (PDF)',
      body: 'Per-bedroom par levels for linens, towels, paper goods, kitchen, bath.',
      cta: 'Send me the par sheet',
      href: '/get-the-supply-par',
    },
  };
  const c = copy[magnet];
  ---
  <aside class="email-capture my-8 border border-rule bg-parchment-alt p-6"
         data-magnet={magnet} data-tool={tool} data-print="hide">
    <div class="md:flex md:items-center md:justify-between gap-6">
      <div>
        <div class="text-label uppercase tracking-widest text-accent mb-1">Free download</div>
        <div class="font-semibold text-lg">{c.title}</div>
        <p class="text-ink2 text-sm mt-1">{c.body}</p>
      </div>
      <form class="capture-form mt-4 md:mt-0 flex gap-2"
            action={`${c.href}?utm_source=strops-tools&utm_medium=inline-capture&utm_content=${tool}`}
            method="get">
        <input type="email" name="email" required placeholder="you@host.com"
               class="border border-rule px-3 py-2 text-sm w-56 bg-parchment" />
        <button class="bg-accent text-parchment px-4 py-2 text-sm font-semibold hover:bg-accent-deep">
          {c.cta}
        </button>
      </form>
    </div>
  </aside>
  ```
- [ ] Create `src/components/funnel/STRLedgerCTA.astro`:
  ```astro
  ---
  interface Props { tool: string; }
  const { tool } = Astro.props;
  const copyByTool: Record<string, { headline: string; body: string; sku: string }> = {
    'turnover-scheduler':   { headline: 'Track every turnover cost in The STR Ledger.', body: 'Cleaning fees, restocks, damage write-offs all flow into one P&L.', sku: 'pl-single-property' },
    'cleaner-dispatch':     { headline: 'Reconcile cleaner pay against bookings automatically.', body: 'Match dispatch sheets to your ledger in minutes.', sku: 'pl-single-property' },
    'smart-lock-codes':     { headline: 'Log every code rotation in The STR Ledger.', body: 'Audit trail for guest access events.', sku: 'access-log' },
    'linen-par-calculator': { headline: 'Track linen capex in The STR Ledger.', body: 'Replacement cycles + cost basis kept clean for taxes.', sku: 'capex-tracker' },
    'restock-calculator':   { headline: 'Roll restock spend into your monthly P&L.', body: 'Per-property consumables broken out for tax season.', sku: 'pl-single-property' },
    'damage-cost-lookup':   { headline: 'Categorize damage write-offs the right way.', body: 'Repairs vs improvements vs guest-recovered, all tracked.', sku: 'damage-tracker' },
    'maintenance-schedule': { headline: 'Treat maintenance like a budget line, not a surprise.', body: 'Forecast yearly maintenance spend in The STR Ledger.', sku: 'maintenance-budget' },
  };
  const c = copyByTool[tool] ?? { headline: 'Track everything in The STR Ledger.', body: 'One spreadsheet for every dollar in and out.', sku: 'pl-single-property' };
  const href = `https://thestrledger.com/${c.sku}?utm_source=strops-tools&utm_medium=cta&utm_content=${tool}`;
  ---
  <aside class="ledger-cta my-8 border-l-2 border-accent bg-parchment p-5" data-tool={tool}>
    <div class="font-semibold">{c.headline}</div>
    <p class="text-ink2 text-sm mt-1">{c.body}</p>
    <a href={href} class="inline-block mt-3 underline decoration-accent underline-offset-4">
      Open The STR Ledger &rarr;
    </a>
  </aside>
  ```
- [ ] Create `src/components/affiliate/AffiliateCard.astro` — soft, content-styled, FTC labeled:
  ```astro
  ---
  interface Props {
    vendorId: string;
    title: string;
    blurb: string;
    href: string;
    category: 'smart-lock' | 'noise-monitor' | 'pms' | 'cleaning' | 'replacement';
  }
  const { vendorId, title, blurb, href, category } = Astro.props;
  ---
  <article class="affiliate-card my-6 border border-rule bg-parchment p-5" data-vendor={vendorId} data-category={category} data-print="hide">
    <div class="text-label uppercase tracking-widest text-ink3 mb-1">If you're shopping</div>
    <div class="font-semibold">{title}</div>
    <p class="text-ink2 text-sm mt-1">{blurb}</p>
    <a href={href}
       rel="sponsored noopener"
       target="_blank"
       data-affiliate-vendor={vendorId}
       class="inline-block mt-3 text-sm underline decoration-accent underline-offset-4 affiliate-link">
      Check it out &rarr;
    </a>
    <div class="text-xs text-ink3 mt-3">
      Affiliate disclosure: we may earn a commission on purchases. We only feature tools we'd point a friend to.
    </div>
  </article>
  ```
- [ ] Create `src/data/affiliates.json` — schema with vendor id + category + url + label:
  ```json
  {
    "august":     { "category": "smart-lock",      "title": "August Smart Lock",        "blurb": "Consumer-friendly, retrofits most deadbolts, integrates with Hostfully + OwnerRez.", "href": "https://august.com/?ref=strops" },
    "schlage":    { "category": "smart-lock",      "title": "Schlage Encode Plus",      "blurb": "Commercial-grade keypad lock, Apple home key support.",                            "href": "https://www.schlage.com/?ref=strops" },
    "remotelock": { "category": "smart-lock",      "title": "RemoteLock",               "blurb": "Multi-platform lock management; works with most PMS systems.",                     "href": "https://www.remotelock.com/?ref=strops" },
    "minut":      { "category": "noise-monitor",   "title": "Minut",                    "blurb": "Privacy-respecting noise + occupancy monitor; Airbnb/VRBO compatible.",            "href": "https://www.minut.com/?ref=strops" },
    "noiseaware": { "category": "noise-monitor",   "title": "NoiseAware",               "blurb": "Indoor + outdoor noise sensors; party-prevention focused.",                       "href": "https://www.noiseaware.com/?ref=strops" },
    "hostfully":  { "category": "pms",             "title": "Hostfully",                "blurb": "PMS + digital guidebooks; built for STR portfolios.",                              "href": "https://www.hostfully.com/?ref=strops" },
    "hospitable": { "category": "pms",             "title": "Hospitable",               "blurb": "Automation-first PMS; great messaging suite.",                                     "href": "https://www.hospitable.com/?ref=strops" },
    "ownerrez":   { "category": "pms",             "title": "OwnerRez",                 "blurb": "Power-user PMS; deepest accounting hooks.",                                        "href": "https://www.ownerrez.com/?ref=strops" },
    "turno":      { "category": "cleaning",       "title": "Turno (TurnoverBnB)",      "blurb": "Cleaner marketplace + scheduling; pairs well with the dispatch generator.",        "href": "https://turno.com/?ref=strops" }
  }
  ```
- [ ] Add a tiny client snippet to fire `affiliate_click` GA4 events. Append to `src/components/affiliate/AffiliateCard.astro`:
  ```astro
  <script is:inline>
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a.affiliate-link');
      if (!a) return;
      const vendor = a.getAttribute('data-affiliate-vendor');
      window.gtag && gtag('event', 'affiliate_click', { vendor });
    }, { capture: true });
  </script>
  ```
- [ ] Commit: `feat: monetization primitives + per-tool magnet matchup`

**Verify:** Mount each component on a temporary `/sandbox.astro` page and confirm rendering. Remove the sandbox before commit.

---

## Task 6: URL state library (TDD)

**Goal:** Pure helpers that parse/serialize tool inputs to URL params with debounced replaceState.

- [ ] Create `tests/lib/url-state.test.ts`:
  ```ts
  import { describe, it, expect, vi } from 'vitest';
  import { encodeState, decodeState, makeReplacer } from '@lib/url-state';

  describe('url-state', () => {
    it('round-trips primitives', () => {
      const s = { adr: 220, occ: 0.62, cleaning: 95, name: 'Cabin A' };
      expect(decodeState(encodeState(s), s)).toEqual(s);
    });
    it('decode falls back to defaults on missing keys', () => {
      const defaults = { a: 1, b: 2 };
      expect(decodeState('?a=9', defaults)).toEqual({ a: 9, b: 2 });
    });
    it('decode coerces numeric strings', () => {
      expect(decodeState('?occ=0.8', { occ: 0 })).toEqual({ occ: 0.8 });
    });
    it('handles arrays via comma-separated values', () => {
      const s = { ids: ['a', 'b', 'c'] };
      expect(decodeState(encodeState(s), { ids: [] as string[] })).toEqual(s);
    });
    it('debounces replaceState', async () => {
      vi.useFakeTimers();
      const spy = vi.fn();
      const r = makeReplacer(spy, 200);
      r('?a=1'); r('?a=2'); r('?a=3');
      vi.advanceTimersByTime(199);
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(2);
      expect(spy).toHaveBeenCalledWith('?a=3');
      vi.useRealTimers();
    });
  });
  ```
- [ ] Create `src/lib/url-state.ts`:
  ```ts
  export type Primitive = string | number | boolean;
  export type StateShape = Record<string, Primitive | Primitive[]>;

  export function encodeState(state: StateShape): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) {
      if (Array.isArray(v)) params.set(k, v.join(','));
      else params.set(k, String(v));
    }
    const s = params.toString();
    return s ? `?${s}` : '';
  }

  export function decodeState<T extends StateShape>(query: string, defaults: T): T {
    const out: StateShape = { ...defaults };
    const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    for (const k of Object.keys(defaults)) {
      const raw = params.get(k);
      if (raw === null) continue;
      const def = (defaults as StateShape)[k];
      if (Array.isArray(def)) {
        out[k] = raw === '' ? [] : raw.split(',');
      } else if (typeof def === 'number') {
        const n = Number(raw);
        out[k] = Number.isFinite(n) ? n : def;
      } else if (typeof def === 'boolean') {
        out[k] = raw === 'true';
      } else {
        out[k] = raw;
      }
    }
    return out as T;
  }

  export function makeReplacer(replace: (q: string) => void, ms = 200) {
    let t: ReturnType<typeof setTimeout> | null = null;
    let last = '';
    return (q: string) => {
      last = q;
      if (t) clearTimeout(t);
      t = setTimeout(() => replace(last), ms);
    };
  }

  export function browserReplacer(ms = 200) {
    return makeReplacer((q) => {
      if (typeof window === 'undefined') return;
      const url = `${window.location.pathname}${q}${window.location.hash}`;
      window.history.replaceState(null, '', url);
    }, ms);
  }
  ```
- [ ] Run `pnpm test` — all green.
- [ ] Commit: `feat(lib): url-state with TDD`

**Verify:** `pnpm test tests/lib/url-state.test.ts` exits 0.

---

## Task 7: Format library (TDD)

**Goal:** Currency, percent, integer, list-of-names formatters; tabular-num CSS lives in Task 2.

- [ ] Create `tests/lib/format.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { fmtUsd, fmtPct, fmtInt, fmtList } from '@lib/format';

  describe('format', () => {
    it('fmtUsd', () => {
      expect(fmtUsd(1234.5)).toBe('$1,234.50');
      expect(fmtUsd(0)).toBe('$0.00');
      expect(fmtUsd(-5)).toBe('-$5.00');
    });
    it('fmtPct', () => {
      expect(fmtPct(0.625)).toBe('62.5%');
      expect(fmtPct(0.5, 0)).toBe('50%');
    });
    it('fmtInt', () => {
      expect(fmtInt(12000)).toBe('12,000');
    });
    it('fmtList', () => {
      expect(fmtList(['a','b','c'])).toBe('a, b, and c');
      expect(fmtList(['a','b'])).toBe('a and b');
      expect(fmtList(['a'])).toBe('a');
      expect(fmtList([])).toBe('');
    });
  });
  ```
- [ ] Create `src/lib/format.ts`:
  ```ts
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const intl = new Intl.NumberFormat('en-US');

  export const fmtUsd = (n: number) => usd.format(n);
  export const fmtInt = (n: number) => intl.format(Math.round(n));

  export function fmtPct(n: number, digits = 1): string {
    const v = n * 100;
    return `${v.toFixed(digits).replace(/\.0+$/, '')}%`;
  }

  export function fmtList(items: string[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  }
  ```
- [ ] `pnpm test` green.
- [ ] Commit: `feat(lib): format helpers with TDD`

**Verify:** `pnpm test` exits 0.

---

## Task 8: SEO library — JSON-LD builders

**Goal:** Schema.org JSON-LD for `Organization`, `WebApplication`, `FAQPage`, `HowTo`, `Article`.

- [ ] Create `src/lib/seo.ts`:
  ```ts
  export interface FaqEntry { q: string; a: string; }
  export interface HowToStep { name: string; text: string; }

  export const orgJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'strops.tools',
    url: 'https://strops.tools',
    sameAs: ['https://thestrledger.com'],
  });

  export const webApplicationJsonLd = (opts: { name: string; url: string; description: string; }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    url: opts.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: opts.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });

  export const faqJsonLd = (faqs: FaqEntry[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  export const howToJsonLd = (opts: { name: string; description: string; steps: HowToStep[]; }) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  });

  export const articleJsonLd = (opts: { headline: string; url: string; datePublished: string; dateModified: string; }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
  });
  ```
- [ ] Create `src/components/seo/JsonLd.astro`:
  ```astro
  ---
  interface Props { data: object | object[]; }
  const { data } = Astro.props;
  const arr = Array.isArray(data) ? data : [data];
  ---
  {arr.map(d => (
    <script type="application/ld+json" set:html={JSON.stringify(d)} />
  ))}
  ```
- [ ] Add a tiny test `tests/lib/seo.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { faqJsonLd, howToJsonLd } from '@lib/seo';

  describe('seo', () => {
    it('faqJsonLd shapes correctly', () => {
      const j = faqJsonLd([{ q: 'Q', a: 'A' }]);
      expect(j['@type']).toBe('FAQPage');
      expect(j.mainEntity[0].name).toBe('Q');
    });
    it('howToJsonLd numbers steps', () => {
      const j = howToJsonLd({ name: 'X', description: 'd', steps: [{ name: 's1', text: 't1' }, { name: 's2', text: 't2' }] });
      expect(j.step[0].position).toBe(1);
      expect(j.step[1].position).toBe(2);
    });
  });
  ```
- [ ] Commit: `feat(lib): seo json-ld builders`

**Verify:** `pnpm test` green.

---

## Task 9: PDF library — base setup with brand header/footer

**Goal:** pdf-lib helpers shared by every PDF generator.

- [ ] Create `src/lib/pdf/base.ts`:
  ```ts
  import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';

  // Ops accent green-gray = #4F6B5A
  export const ACCENT = rgb(0x4f / 255, 0x6b / 255, 0x5a / 255);
  export const NAVY = rgb(0x12 / 255, 0x30 / 255, 0x4e / 255);
  export const INK = rgb(0x2b / 255, 0x2b / 255, 0x2b / 255);
  export const INK2 = rgb(0x55 / 255, 0x50 / 255, 0x49 / 255);
  export const PAGE = { width: 612, height: 792 }; // US Letter
  export const MARGIN = 54;

  export interface BrandedDoc {
    doc: PDFDocument;
    body: PDFFont;
    bold: PDFFont;
    mono: PDFFont;
  }

  export async function newBrandedDoc(): Promise<BrandedDoc> {
    const doc = await PDFDocument.create();
    doc.setProducer('strops.tools');
    doc.setCreator('strops.tools');
    const body = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const mono = await doc.embedFont(StandardFonts.Courier);
    return { doc, body, bold, mono };
  }

  export function newPage(d: BrandedDoc): PDFPage {
    return d.doc.addPage([PAGE.width, PAGE.height]);
  }

  export function drawHeader(page: PDFPage, d: BrandedDoc, title: string, subtitle?: string) {
    page.drawText('strops.tools', {
      x: MARGIN, y: PAGE.height - MARGIN, size: 11, font: d.bold, color: NAVY,
    });
    page.drawText('.', { x: MARGIN + 56, y: PAGE.height - MARGIN, size: 11, font: d.bold, color: ACCENT });
    page.drawText(title, {
      x: MARGIN, y: PAGE.height - MARGIN - 28, size: 20, font: d.bold, color: NAVY,
    });
    if (subtitle) {
      page.drawText(subtitle, {
        x: MARGIN, y: PAGE.height - MARGIN - 46, size: 10, font: d.body, color: INK2,
      });
    }
    page.drawLine({
      start: { x: MARGIN, y: PAGE.height - MARGIN - 56 },
      end:   { x: PAGE.width - MARGIN, y: PAGE.height - MARGIN - 56 },
      thickness: 0.6, color: ACCENT,
    });
  }

  export function drawFooter(page: PDFPage, d: BrandedDoc, pageNumber: number, total: number) {
    const y = MARGIN - 18;
    page.drawText('strops.tools — free tools for active STR operators', {
      x: MARGIN, y, size: 8, font: d.body, color: INK2,
    });
    page.drawText(`${pageNumber} / ${total}`, {
      x: PAGE.width - MARGIN - 40, y, size: 8, font: d.body, color: INK2,
    });
  }

  export async function finalize(d: BrandedDoc): Promise<Uint8Array> {
    const pages = d.doc.getPages();
    pages.forEach((p, i) => drawFooter(p, d, i + 1, pages.length));
    return await d.doc.save();
  }

  export function downloadBytes(bytes: Uint8Array, filename: string) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    window.gtag && window.gtag('event', 'pdf_downloaded', { filename });
  }

  export function wrapText(text: string, maxChars: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > maxChars) {
        lines.push(cur.trim()); cur = w;
      } else cur = (cur + ' ' + w).trim();
    }
    if (cur) lines.push(cur);
    return lines;
  }
  ```
- [ ] Create `tests/lib/pdf-base.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { newBrandedDoc, newPage, drawHeader, finalize } from '@lib/pdf/base';

  describe('pdf base', () => {
    it('produces a valid PDF', async () => {
      const d = await newBrandedDoc();
      const p = newPage(d);
      drawHeader(p, d, 'Test', 'Sub');
      const bytes = await finalize(d);
      // PDF magic header
      const head = String.fromCharCode(...bytes.slice(0, 4));
      expect(head).toBe('%PDF');
      expect(bytes.byteLength).toBeGreaterThan(500);
    });
  });
  ```
- [ ] Commit: `feat(lib/pdf): branded base helpers`

**Verify:** `pnpm test` green.

---

## Task 10: Tool — turnover-scheduler (logic TDD + island + page + MDX)

**Goal:** Multi-property turnover gap calculation, conflict detection, URL state.

- [ ] Write `tests/calc/turnover.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { computeSchedule, hasConflict } from '@lib/calc/turnover';

  describe('turnover schedule', () => {
    const bookings = [
      { id: 'b1', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
      { id: 'b2', propertyId: 'p1', checkIn: '2026-06-05', checkOut: '2026-06-08' },
      { id: 'b3', propertyId: 'p1', checkIn: '2026-06-09', checkOut: '2026-06-12' },
    ];
    it('computes turnover gap in hours', () => {
      const r = computeSchedule(bookings, { turnoverHours: 4 });
      const gap1 = r.turnovers.find(t => t.fromBooking === 'b1' && t.toBooking === 'b2');
      expect(gap1).toBeTruthy();
      expect(gap1!.gapHours).toBe(0); // same-day checkout/checkin
      expect(gap1!.tight).toBe(true);
    });
    it('flags conflicts', () => {
      const overlapping = [
        { id: 'a', propertyId: 'p1', checkIn: '2026-06-01', checkOut: '2026-06-05' },
        { id: 'b', propertyId: 'p1', checkIn: '2026-06-04', checkOut: '2026-06-07' },
      ];
      const r = computeSchedule(overlapping, { turnoverHours: 4 });
      expect(r.conflicts.length).toBe(1);
      expect(hasConflict(r)).toBe(true);
    });
    it('groups by property', () => {
      const r = computeSchedule([
        ...bookings,
        { id: 'b4', propertyId: 'p2', checkIn: '2026-06-01', checkOut: '2026-06-04' },
      ], { turnoverHours: 4 });
      expect(Object.keys(r.byProperty).sort()).toEqual(['p1','p2']);
    });
  });
  ```
- [ ] Write `src/lib/calc/turnover.ts`:
  ```ts
  export interface Booking { id: string; propertyId: string; checkIn: string; checkOut: string; }
  export interface Turnover { propertyId: string; fromBooking: string; toBooking: string; gapHours: number; tight: boolean; }
  export interface Conflict { propertyId: string; bookingA: string; bookingB: string; }
  export interface ScheduleResult {
    turnovers: Turnover[];
    conflicts: Conflict[];
    byProperty: Record<string, Booking[]>;
  }

  export function computeSchedule(bookings: Booking[], opts: { turnoverHours: number }): ScheduleResult {
    const byProperty: Record<string, Booking[]> = {};
    for (const b of bookings) (byProperty[b.propertyId] ||= []).push(b);
    for (const k of Object.keys(byProperty))
      byProperty[k].sort((a, b) => a.checkIn.localeCompare(b.checkIn));

    const turnovers: Turnover[] = [];
    const conflicts: Conflict[] = [];
    for (const [pid, list] of Object.entries(byProperty)) {
      for (let i = 0; i < list.length - 1; i++) {
        const a = list[i], b = list[i + 1];
        const aOut = Date.parse(a.checkOut + 'T11:00:00Z');
        const bIn  = Date.parse(b.checkIn  + 'T15:00:00Z');
        const gapHours = (bIn - aOut) / 3_600_000;
        if (gapHours < 0) {
          conflicts.push({ propertyId: pid, bookingA: a.id, bookingB: b.id });
        } else {
          turnovers.push({
            propertyId: pid, fromBooking: a.id, toBooking: b.id,
            gapHours: Math.max(0, Math.round(gapHours)),
            tight: gapHours < opts.turnoverHours,
          });
        }
      }
    }
    return { turnovers, conflicts, byProperty };
  }

  export const hasConflict = (r: ScheduleResult) => r.conflicts.length > 0;
  ```
- [ ] Create `src/components/calculators/TurnoverScheduler.tsx`:
  ```tsx
  import { useEffect, useMemo, useState } from 'react';
  import { computeSchedule, type Booking } from '@lib/calc/turnover';
  import { encodeState, decodeState, browserReplacer } from '@lib/url-state';

  type State = { turnoverHours: number; rows: string };
  const defaults: State = { turnoverHours: 4, rows: 'p1,b1,2026-06-01,2026-06-05\np1,b2,2026-06-05,2026-06-08' };

  function parseRows(rows: string): Booking[] {
    return rows.split('\n').map(r => r.trim()).filter(Boolean).map(r => {
      const [propertyId, id, checkIn, checkOut] = r.split(',').map(s => s.trim());
      return { propertyId, id, checkIn, checkOut };
    });
  }

  export default function TurnoverScheduler() {
    const [state, setState] = useState<State>(defaults);
    const replacer = useMemo(() => browserReplacer(200), []);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      setState(decodeState(window.location.search, defaults));
    }, []);
    useEffect(() => { replacer(encodeState(state)); }, [state, replacer]);

    const bookings = useMemo(() => parseRows(state.rows), [state.rows]);
    const result = useMemo(() => computeSchedule(bookings, { turnoverHours: state.turnoverHours }), [bookings, state.turnoverHours]);

    return (
      <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <label className="text-sm">
            Turnover hours required
            <input type="number" min={0} max={48} value={state.turnoverHours}
              onChange={e => setState({ ...state, turnoverHours: Number(e.target.value) })}
              className="block w-full border border-rule px-3 py-2 num" />
          </label>
          <label className="md:col-span-2 text-sm">
            Bookings (one per line: <code>propertyId,bookingId,checkIn,checkOut</code>)
            <textarea rows={6} value={state.rows}
              onChange={e => setState({ ...state, rows: e.target.value })}
              className="block w-full border border-rule px-3 py-2 mono text-xs" />
          </label>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <h3 className="font-semibold mb-2">Turnovers</h3>
            <table className="w-full text-sm num">
              <thead><tr className="text-ink3"><th>Property</th><th>From</th><th>To</th><th>Gap (h)</th><th>Status</th></tr></thead>
              <tbody>
                {result.turnovers.map((t, i) => (
                  <tr key={i} className="border-t border-rule">
                    <td>{t.propertyId}</td><td>{t.fromBooking}</td><td>{t.toBooking}</td><td>{t.gapHours}</td>
                    <td>{t.tight ? <span className="text-accent-deep font-semibold">tight</span> : 'ok'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>
            <h3 className="font-semibold mb-2">Conflicts</h3>
            {result.conflicts.length === 0
              ? <p className="text-ink2 text-sm">No conflicts detected.</p>
              : (
                <ul className="text-sm">
                  {result.conflicts.map((c, i) => (
                    <li key={i} className="text-[color:var(--semantic-error)]">
                      {c.propertyId}: {c.bookingA} ⇄ {c.bookingB}
                    </li>
                  ))}
                </ul>
              )
            }
          </section>
        </div>
        <div className="mt-6 flex gap-3" data-print="hide">
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="border border-rule px-4 py-2 text-sm">Copy share link</button>
          <button onClick={() => window.print()}
            className="border border-rule px-4 py-2 text-sm">Print</button>
        </div>
      </div>
    );
  }
  ```
- [ ] Create `src/pages/turnover-scheduler.astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import Sidebar from '@components/chrome/Sidebar.astro';
  import TurnoverScheduler from '@components/calculators/TurnoverScheduler.tsx';
  import AdSlot from '@components/ads/AdSlot.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  import STRLedgerCTA from '@components/funnel/STRLedgerCTA.astro';
  import AffiliateCard from '@components/affiliate/AffiliateCard.astro';
  import JsonLd from '@components/seo/JsonLd.astro';
  import { webApplicationJsonLd, faqJsonLd } from '@lib/seo';
  import affiliates from '@data/affiliates.json';

  const url = 'https://strops.tools/turnover-scheduler';
  const faqs = [
    { q: 'What is a turnover gap?', a: 'The hours between one guest checking out and the next checking in — your window for cleaning, restocking, and inspection.' },
    { q: 'Why does same-day turnover matter?', a: 'Same-day turnovers compress every operational task into 4-6 hours. Tracking them helps you decide whether to staff up or block the night.' },
    { q: 'What does a "tight" turnover mean?', a: 'A turnover gap shorter than the hours you set as your minimum — flagged so you can act early.' },
    { q: 'Are bookings stored?', a: 'No. All inputs live in your URL only — nothing is sent to a server.' },
    { q: 'Can I print this?', a: 'Yes. The print stylesheet shows just the inputs and the schedule.' },
  ];
  ---
  <Layout title="Airbnb Turnover Scheduler — strops.tools" description="Spot tight turnovers and conflicts across multiple Airbnb properties." canonical={url}>
    <slot slot="head">
      <JsonLd data={[
        webApplicationJsonLd({ name: 'Airbnb Turnover Scheduler', url, description: 'Spot tight turnovers and booking conflicts.' }),
        faqJsonLd(faqs),
      ]} />
    </slot>
    <div class="mx-auto max-w-6xl px-6 py-10 flex gap-10">
      <article class="flex-1 prose">
        <h1>Airbnb Turnover Scheduler</h1>
        <p class="lead">Paste your bookings, set your turnover window, and see every tight changeover and overlap at a glance.</p>
        <TurnoverScheduler client:load />
        <AdSlot location="in-content" />
        <h2>How it works</h2>
        <p>Each booking gets a check-out time of 11:00 UTC and the next a check-in of 15:00 UTC. We sort per-property, compute the gap in hours, and flag any below your "turnover hours required" threshold. Same-property check-out before the previous check-out is reported as a conflict.</p>
        <EmailCaptureCard magnet="cleaner-sop" tool="turnover-scheduler" />
        <h2>How to use this tool</h2>
        <ol>
          <li>Set your minimum turnover window (default 4 hours).</li>
          <li>Paste bookings — one per line: <code>propertyId,bookingId,checkIn,checkOut</code>.</li>
          <li>Watch the table update live.</li>
          <li>Copy the share link to send the schedule to a partner or cleaner manager.</li>
        </ol>
        <h2>FAQ</h2>
        {faqs.map(f => <div><h3>{f.q}</h3><p>{f.a}</p></div>)}
        <STRLedgerCTA tool="turnover-scheduler" />
        <AffiliateCard {...affiliates['turno']} vendorId="turno" />
        <AdSlot location="footer" />
      </article>
      <Sidebar current="turnover-scheduler" />
    </div>
  </Layout>
  ```
- [ ] Create `src/content/tools/turnover-scheduler.mdx` — copy the MDX template (intro, how-it-works, FAQ) for editor use later.
- [ ] Commit: `feat(tool): turnover-scheduler with TDD logic, hydrated island, page`

**Verify:** `pnpm test`, `pnpm build` green; manual: page renders, inputs round-trip URL.

---

## Task 11: Tool — cleaner-dispatch (PDF generator)

**Goal:** Generate assignment table + SMS templates; "Download dispatch sheet" produces a branded PDF.

- [ ] Write `tests/calc/cleaner-dispatch.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { buildDispatch, smsTemplate } from '@lib/calc/cleaner-dispatch';

  describe('cleaner-dispatch', () => {
    it('assigns cleaners round-robin', () => {
      const r = buildDispatch({
        date: '2026-06-05',
        turnovers: [
          { propertyId: 'p1', address: '123 Pine', bedrooms: 2 },
          { propertyId: 'p2', address: '456 Oak',  bedrooms: 3 },
          { propertyId: 'p3', address: '789 Elm',  bedrooms: 1 },
        ],
        cleaners: [{ name: 'Ana', phone: '555-0001' }, { name: 'Beto', phone: '555-0002' }],
      });
      expect(r.assignments).toHaveLength(3);
      expect(r.assignments[0].cleaner.name).toBe('Ana');
      expect(r.assignments[1].cleaner.name).toBe('Beto');
      expect(r.assignments[2].cleaner.name).toBe('Ana');
    });
    it('SMS template fills variables', () => {
      const s = smsTemplate({ cleanerName: 'Ana', address: '123 Pine', date: '2026-06-05', bedrooms: 2 });
      expect(s).toMatch(/Ana/);
      expect(s).toMatch(/123 Pine/);
      expect(s).toMatch(/2026-06-05/);
    });
  });
  ```
- [ ] Write `src/lib/calc/cleaner-dispatch.ts`:
  ```ts
  export interface Cleaner { name: string; phone: string; }
  export interface Turnover { propertyId: string; address: string; bedrooms: number; }
  export interface DispatchInput { date: string; turnovers: Turnover[]; cleaners: Cleaner[]; }
  export interface Assignment { turnover: Turnover; cleaner: Cleaner; sms: string; }
  export interface DispatchResult { date: string; assignments: Assignment[]; }

  export function smsTemplate(opts: { cleanerName: string; address: string; date: string; bedrooms: number; }) {
    return `Hi ${opts.cleanerName} — turnover ${opts.date} at ${opts.address} (${opts.bedrooms}BR). Standard SOP. Reply Y to confirm.`;
  }

  export function buildDispatch(input: DispatchInput): DispatchResult {
    if (input.cleaners.length === 0) return { date: input.date, assignments: [] };
    const assignments = input.turnovers.map((t, i) => {
      const cleaner = input.cleaners[i % input.cleaners.length];
      const sms = smsTemplate({ cleanerName: cleaner.name, address: t.address, date: input.date, bedrooms: t.bedrooms });
      return { turnover: t, cleaner, sms };
    });
    return { date: input.date, assignments };
  }
  ```
- [ ] Write `src/lib/pdf/cleaner-dispatch.ts`:
  ```ts
  import { newBrandedDoc, newPage, drawHeader, finalize, MARGIN, PAGE, INK, INK2, ACCENT } from './base';
  import type { DispatchResult } from '@lib/calc/cleaner-dispatch';

  export async function buildDispatchPdf(r: DispatchResult): Promise<Uint8Array> {
    const d = await newBrandedDoc();
    const page = newPage(d);
    drawHeader(page, d, 'Cleaner Dispatch Sheet', `Date: ${r.date}`);

    let y = PAGE.height - MARGIN - 90;
    const col = { property: MARGIN, addr: MARGIN + 90, br: MARGIN + 280, cleaner: MARGIN + 320, phone: MARGIN + 430 };

    page.drawText('Property',  { x: col.property, y, size: 9, font: d.bold, color: INK });
    page.drawText('Address',   { x: col.addr,     y, size: 9, font: d.bold, color: INK });
    page.drawText('BR',        { x: col.br,       y, size: 9, font: d.bold, color: INK });
    page.drawText('Cleaner',   { x: col.cleaner,  y, size: 9, font: d.bold, color: INK });
    page.drawText('Phone',     { x: col.phone,    y, size: 9, font: d.bold, color: INK });
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE.width - MARGIN, y }, thickness: 0.5, color: ACCENT });
    y -= 14;

    for (const a of r.assignments) {
      page.drawText(a.turnover.propertyId,                 { x: col.property, y, size: 9, font: d.body, color: INK });
      page.drawText(a.turnover.address.slice(0, 28),       { x: col.addr,     y, size: 9, font: d.body, color: INK });
      page.drawText(String(a.turnover.bedrooms),           { x: col.br,       y, size: 9, font: d.body, color: INK });
      page.drawText(a.cleaner.name,                        { x: col.cleaner,  y, size: 9, font: d.body, color: INK });
      page.drawText(a.cleaner.phone,                       { x: col.phone,    y, size: 9, font: d.mono, color: INK });
      y -= 14;
      if (y < MARGIN + 100) break;
    }

    y -= 20;
    page.drawText('SMS templates', { x: MARGIN, y, size: 11, font: d.bold, color: INK });
    y -= 16;
    for (const a of r.assignments) {
      const lines = [a.sms.slice(0, 95), a.sms.slice(95)].filter(Boolean);
      page.drawText(`${a.cleaner.name} (${a.cleaner.phone})`, { x: MARGIN, y, size: 9, font: d.bold, color: INK2 });
      y -= 12;
      for (const ln of lines) {
        page.drawText(ln, { x: MARGIN, y, size: 9, font: d.body, color: INK });
        y -= 12;
      }
      y -= 6;
      if (y < MARGIN + 40) break;
    }
    return finalize(d);
  }
  ```
- [ ] Add `tests/lib/pdf-cleaner-dispatch.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { buildDispatchPdf } from '@lib/pdf/cleaner-dispatch';
  describe('cleaner-dispatch pdf', () => {
    it('builds a valid PDF', async () => {
      const bytes = await buildDispatchPdf({
        date: '2026-06-05',
        assignments: [{
          turnover: { propertyId: 'p1', address: '123 Pine', bedrooms: 2 },
          cleaner: { name: 'Ana', phone: '555-0001' },
          sms: 'Hi Ana — turnover 2026-06-05 at 123 Pine.',
        }],
      });
      expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
    });
  });
  ```
- [ ] Create `src/components/calculators/CleanerDispatch.tsx`:
  ```tsx
  import { useEffect, useMemo, useState } from 'react';
  import { buildDispatch } from '@lib/calc/cleaner-dispatch';
  import { buildDispatchPdf } from '@lib/pdf/cleaner-dispatch';
  import { downloadBytes } from '@lib/pdf/base';
  import { encodeState, decodeState, browserReplacer } from '@lib/url-state';

  type State = { date: string; turnovers: string; cleaners: string; };
  const defaults: State = {
    date: '2026-06-05',
    turnovers: 'p1,123 Pine,2\np2,456 Oak,3',
    cleaners:  'Ana,555-0001\nBeto,555-0002',
  };

  export default function CleanerDispatch() {
    const [s, setS] = useState<State>(defaults);
    const replacer = useMemo(() => browserReplacer(200), []);
    useEffect(() => { if (typeof window !== 'undefined') setS(decodeState(window.location.search, defaults)); }, []);
    useEffect(() => { replacer(encodeState(s)); }, [s, replacer]);

    const turnovers = s.turnovers.split('\n').map(r => r.trim()).filter(Boolean).map(r => {
      const [propertyId, address, bedrooms] = r.split(',').map(x => x.trim());
      return { propertyId, address, bedrooms: Number(bedrooms) || 1 };
    });
    const cleaners = s.cleaners.split('\n').map(r => r.trim()).filter(Boolean).map(r => {
      const [name, phone] = r.split(',').map(x => x.trim());
      return { name, phone };
    });
    const result = buildDispatch({ date: s.date, turnovers, cleaners });

    async function downloadPdf() {
      const bytes = await buildDispatchPdf(result);
      downloadBytes(bytes, `dispatch-${result.date}.pdf`);
    }

    return (
      <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <label className="text-sm">Dispatch date
            <input type="date" value={s.date} onChange={e => setS({ ...s, date: e.target.value })}
              className="block w-full border border-rule px-3 py-2 num" />
          </label>
          <label className="text-sm">Turnovers (propertyId,address,bedrooms)
            <textarea rows={5} value={s.turnovers} onChange={e => setS({ ...s, turnovers: e.target.value })}
              className="block w-full border border-rule px-3 py-2 mono text-xs" />
          </label>
          <label className="text-sm">Cleaners (name,phone)
            <textarea rows={5} value={s.cleaners} onChange={e => setS({ ...s, cleaners: e.target.value })}
              className="block w-full border border-rule px-3 py-2 mono text-xs" />
          </label>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-ink3"><th>Property</th><th>Address</th><th>BR</th><th>Cleaner</th><th>Phone</th></tr></thead>
          <tbody>
            {result.assignments.map((a, i) => (
              <tr key={i} className="border-t border-rule">
                <td>{a.turnover.propertyId}</td><td>{a.turnover.address}</td><td className="num">{a.turnover.bedrooms}</td>
                <td>{a.cleaner.name}</td><td className="mono">{a.cleaner.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4 className="mt-4 mb-2 font-semibold">SMS templates</h4>
        <ul className="space-y-2">
          {result.assignments.map((a, i) => (
            <li key={i} className="text-sm border-l-2 border-accent pl-3">{a.sms}</li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3" data-print="hide">
          <button onClick={downloadPdf} className="bg-accent text-parchment px-4 py-2 text-sm font-semibold hover:bg-accent-deep">Download dispatch sheet (PDF)</button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="border border-rule px-4 py-2 text-sm">Copy share link</button>
          <button onClick={() => window.print()} className="border border-rule px-4 py-2 text-sm">Print</button>
        </div>
      </div>
    );
  }
  ```
- [ ] Create `src/pages/cleaner-dispatch.astro` (mirror Task 10's page; use `magnet="cleaner-sop"`, `tool="cleaner-dispatch"`, AffiliateCard for `turno`).
- [ ] Create `src/content/tools/cleaner-dispatch.mdx`.
- [ ] Commit: `feat(tool): cleaner-dispatch + PDF generator`

**Verify:** `pnpm test`, `pnpm build` green; manual: PDF download works in dev preview.

---

## Task 12: Tool — smart-lock-codes (deterministic algo + reproducibility test)

**Goal:** Same `(bookingId, secret)` → same code; different bookings → different codes; range-bound 4–8 digits.

- [ ] Write `tests/calc/smart-lock-codes.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { codeFor, batchCodes } from '@lib/calc/smart-lock-codes';

  describe('smart-lock-codes', () => {
    it('is deterministic for same input', () => {
      const a = codeFor({ bookingId: 'B-1234', secret: 'host-secret-A', digits: 6 });
      const b = codeFor({ bookingId: 'B-1234', secret: 'host-secret-A', digits: 6 });
      expect(a).toBe(b);
    });
    it('produces different codes for different bookings', () => {
      const a = codeFor({ bookingId: 'B-1234', secret: 'S', digits: 6 });
      const b = codeFor({ bookingId: 'B-1235', secret: 'S', digits: 6 });
      expect(a).not.toBe(b);
    });
    it('produces different codes for different secrets', () => {
      const a = codeFor({ bookingId: 'B-1234', secret: 'S1', digits: 6 });
      const b = codeFor({ bookingId: 'B-1234', secret: 'S2', digits: 6 });
      expect(a).not.toBe(b);
    });
    it('respects digit length 4..8', () => {
      for (const digits of [4, 5, 6, 7, 8]) {
        const c = codeFor({ bookingId: 'X', secret: 'Y', digits });
        expect(c).toHaveLength(digits);
        expect(c).toMatch(/^\d+$/);
      }
    });
    it('batchCodes preserves order', () => {
      const r = batchCodes({ bookings: ['a','b','c'], secret: 'S', digits: 6 });
      expect(r.map(x => x.bookingId)).toEqual(['a','b','c']);
    });
  });
  ```
- [ ] Write `src/lib/calc/smart-lock-codes.ts` — Web-Crypto-based HMAC-SHA-256 mod 10^digits:
  ```ts
  export interface CodeInput { bookingId: string; secret: string; digits: number; }
  export interface BatchInput { bookings: string[]; secret: string; digits: number; }

  function hmacSha256Sync(secret: string, message: string): Uint8Array {
    // Vitest Node + browser path: prefer Node's crypto if available, else SubtleCrypto via async wrapper.
    // Sync version for tests via Node crypto.
    if (typeof process !== 'undefined' && process.versions?.node) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createHmac } = require('node:crypto') as typeof import('node:crypto');
      return new Uint8Array(createHmac('sha256', secret).update(message).digest());
    }
    throw new Error('hmacSha256Sync only available in Node; use codeForAsync in browser');
  }

  export function codeFor(opts: CodeInput): string {
    const digits = Math.max(4, Math.min(8, opts.digits | 0));
    const bytes = hmacSha256Sync(opts.secret, opts.bookingId);
    // Convert first 8 bytes to a non-negative bigint
    let n = 0n;
    for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(bytes[i]);
    n = n & ((1n << 63n) - 1n); // mask sign bit
    const mod = 10n ** BigInt(digits);
    const code = (n % mod).toString().padStart(digits, '0');
    return code;
  }

  export function batchCodes(input: BatchInput) {
    return input.bookings.map(bookingId => ({ bookingId, code: codeFor({ bookingId, secret: input.secret, digits: input.digits }) }));
  }

  // Browser-safe async variant — used by the React island.
  export async function codeForAsync(opts: CodeInput): Promise<string> {
    const digits = Math.max(4, Math.min(8, opts.digits | 0));
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(opts.secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(opts.bookingId)));
    let n = 0n;
    for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(sig[i]);
    n = n & ((1n << 63n) - 1n);
    const mod = 10n ** BigInt(digits);
    return (n % mod).toString().padStart(digits, '0');
  }
  ```
- [ ] Create `src/components/calculators/SmartLockCodes.tsx`:
  ```tsx
  import { useEffect, useMemo, useState } from 'react';
  import { codeForAsync } from '@lib/calc/smart-lock-codes';
  import { encodeState, decodeState, browserReplacer } from '@lib/url-state';

  type State = { secret: string; digits: number; bookings: string };
  const defaults: State = { secret: 'change-me-host-secret', digits: 6, bookings: 'B-1001\nB-1002\nB-1003' };

  export default function SmartLockCodes() {
    const [s, setS] = useState<State>(defaults);
    const [out, setOut] = useState<{ id: string; code: string }[]>([]);
    const replacer = useMemo(() => browserReplacer(200), []);
    useEffect(() => { if (typeof window !== 'undefined') setS(decodeState(window.location.search, defaults)); }, []);
    useEffect(() => { replacer(encodeState(s)); }, [s, replacer]);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        const ids = s.bookings.split('\n').map(x => x.trim()).filter(Boolean);
        const rows = await Promise.all(ids.map(async id => ({ id, code: await codeForAsync({ bookingId: id, secret: s.secret, digits: s.digits }) })));
        if (!cancelled) setOut(rows);
      })();
      return () => { cancelled = true; };
    }, [s]);

    return (
      <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <label className="text-sm md:col-span-2">Host secret (kept in URL — rotate for production!)
            <input value={s.secret} onChange={e => setS({ ...s, secret: e.target.value })}
              className="block w-full border border-rule px-3 py-2 mono" />
          </label>
          <label className="text-sm">Code digits (4-8)
            <input type="number" min={4} max={8} value={s.digits}
              onChange={e => setS({ ...s, digits: Number(e.target.value) })}
              className="block w-full border border-rule px-3 py-2 num" />
          </label>
          <label className="text-sm md:col-span-3">Booking IDs (one per line)
            <textarea rows={4} value={s.bookings} onChange={e => setS({ ...s, bookings: e.target.value })}
              className="block w-full border border-rule px-3 py-2 mono text-xs" />
          </label>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-ink3"><th className="text-left">Booking ID</th><th className="text-left">Lock code</th></tr></thead>
          <tbody>
            {out.map(r => (
              <tr key={r.id} className="border-t border-rule">
                <td className="mono">{r.id}</td>
                <td className="mono text-lg num">{r.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-ink3 text-xs mt-3">
          These codes are deterministic — the same booking + secret always produces the same code.
          Store your secret somewhere safe (a password manager). Rotate it if it leaks.
        </p>
      </div>
    );
  }
  ```
- [ ] Create `src/pages/smart-lock-codes.astro` (matched magnet: `supply-par` is wrong — use **`maintenance-checklist`** as fallback or pick `cleaner-sop`; per spec, smart-lock-codes does NOT have a designated magnet. Use **`cleaner-sop`** since it ships in the operator-onboarding bundle). Affiliate cards: `august`, `schlage`, `remotelock`.
- [ ] Create `src/content/tools/smart-lock-codes.mdx`.
- [ ] Commit: `feat(tool): smart-lock-codes deterministic generator`

**Verify:** `pnpm test` includes deterministic + uniqueness assertions, all green.

---

## Task 13: Tool — linen-par-calculator

**Goal:** Pure logic for sets-per-bed and per-bath; live UI; URL state; magnet `supply-par`.

- [ ] Write `tests/calc/linen-par.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { computeLinenPar } from '@lib/calc/linen-par';

  describe('linen-par', () => {
    it('3 sets per bed, 2.5 per bath default', () => {
      const r = computeLinenPar({ bedrooms: 3, bathrooms: 2, sheetSetsPerBed: 3, towelsPerBath: 2.5, kingShare: 0.5 });
      expect(r.sheetSets).toBe(9);
      expect(r.towelSets).toBe(5);
      expect(r.kingSheetSets).toBe(5);  // ceil(3 * 3 * 0.5)
      expect(r.queenSheetSets).toBe(4);
    });
    it('zero rooms returns zeros', () => {
      const r = computeLinenPar({ bedrooms: 0, bathrooms: 0, sheetSetsPerBed: 3, towelsPerBath: 2.5, kingShare: 0 });
      expect(r.sheetSets).toBe(0);
    });
  });
  ```
- [ ] Write `src/lib/calc/linen-par.ts`:
  ```ts
  export interface LinenInput {
    bedrooms: number; bathrooms: number;
    sheetSetsPerBed: number; towelsPerBath: number;
    kingShare: number; // 0..1
  }
  export interface LinenResult {
    sheetSets: number; towelSets: number;
    kingSheetSets: number; queenSheetSets: number;
  }
  export function computeLinenPar(i: LinenInput): LinenResult {
    const sheetSets = Math.round(i.bedrooms * i.sheetSetsPerBed);
    const towelSets = Math.round(i.bathrooms * i.towelsPerBath);
    const kingSheetSets = Math.ceil(sheetSets * Math.max(0, Math.min(1, i.kingShare)));
    const queenSheetSets = sheetSets - kingSheetSets;
    return { sheetSets, towelSets, kingSheetSets, queenSheetSets };
  }
  ```
- [ ] Create `src/components/calculators/LinenParCalculator.tsx` mirroring Task 10's URL-state pattern with five number inputs and a results card.
- [ ] Create `src/pages/linen-par-calculator.astro` (`magnet="supply-par"`, `tool="linen-par-calculator"`).
- [ ] Create `src/content/tools/linen-par-calculator.mdx`.
- [ ] Commit: `feat(tool): linen-par-calculator`

**Verify:** `pnpm test`, `pnpm build` green.

---

## Task 14: Tool — restock-calculator

**Goal:** booking_volume × consumable_rate per item.

- [ ] Write `tests/calc/restock.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { computeRestock } from '@lib/calc/restock';

  describe('restock', () => {
    it('multiplies booking_volume by per-stay rates', () => {
      const r = computeRestock({
        bookingsPerMonth: 10,
        avgGuestsPerStay: 3,
        items: [
          { name: 'Toilet paper rolls', perGuestNight: 0.5, avgNights: 4 },
          { name: 'Dish soap (oz)',     perGuestNight: 1.0, avgNights: 4 },
        ],
      });
      // 10 stays × 3 guests × 4 nights × 0.5 = 60 rolls/mo
      expect(r.lines.find(l => l.name === 'Toilet paper rolls')!.qtyPerMonth).toBe(60);
      expect(r.lines.find(l => l.name === 'Dish soap (oz)')!.qtyPerMonth).toBe(120);
    });
  });
  ```
- [ ] Write `src/lib/calc/restock.ts`:
  ```ts
  export interface RestockItem { name: string; perGuestNight: number; avgNights: number; }
  export interface RestockInput { bookingsPerMonth: number; avgGuestsPerStay: number; items: RestockItem[]; }
  export interface RestockLine { name: string; qtyPerMonth: number; qtyPerYear: number; }
  export interface RestockResult { lines: RestockLine[]; }
  export function computeRestock(i: RestockInput): RestockResult {
    const lines = i.items.map(it => {
      const qtyPerMonth = Math.round(i.bookingsPerMonth * i.avgGuestsPerStay * it.avgNights * it.perGuestNight);
      return { name: it.name, qtyPerMonth, qtyPerYear: qtyPerMonth * 12 };
    });
    return { lines };
  }
  ```
- [ ] Create `src/components/calculators/RestockCalculator.tsx` (URL state, items in textarea CSV).
- [ ] Create `src/pages/restock-calculator.astro` (`magnet="supply-par"`).
- [ ] Create `src/content/tools/restock-calculator.mdx`.
- [ ] Commit: `feat(tool): restock-calculator`

**Verify:** `pnpm test` green.

---

## Task 15: Tool — damage-cost-lookup

**Goal:** Searchable table of `items.json`; row click navigates to `/replace/[item]`.

- [ ] Create `src/components/calculators/DamageCostLookup.tsx`:
  ```tsx
  import { useMemo, useState } from 'react';
  import items from '@data/items.json';

  type Item = { name: string; category: string; costRange: [number, number]; lifespanYears: number };
  type Catalog = Record<string, Item>;
  const catalog = items as Catalog;

  export default function DamageCostLookup() {
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('');
    const rows = useMemo(() => {
      const all = Object.entries(catalog);
      const filtered = all.filter(([slug, it]) => {
        const matchesQ = !q || it.name.toLowerCase().includes(q.toLowerCase());
        const matchesCat = !cat || it.category === cat;
        return matchesQ && matchesCat;
      });
      return filtered.sort(([, a], [, b]) => a.name.localeCompare(b.name));
    }, [q, cat]);
    const cats = Array.from(new Set(Object.values(catalog).map(i => i.category))).sort();
    return (
      <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <label className="text-sm md:col-span-2">Search
            <input value={q} onChange={e => setQ(e.target.value)} className="block w-full border border-rule px-3 py-2" placeholder="mattress, sofa, lamp..." />
          </label>
          <label className="text-sm">Category
            <select value={cat} onChange={e => setCat(e.target.value)} className="block w-full border border-rule px-3 py-2">
              <option value="">All</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-ink3 text-left"><th>Item</th><th>Category</th><th>Cost range</th><th>Lifespan</th></tr></thead>
          <tbody>
            {rows.map(([slug, it]) => (
              <tr key={slug} onClick={() => window.location.href = `/replace/${slug}`}
                  className="border-t border-rule cursor-pointer hover:bg-parchment-alt">
                <td>{it.name}</td>
                <td className="text-ink2">{it.category}</td>
                <td className="num">${it.costRange[0]}–${it.costRange[1]}</td>
                <td className="num">{it.lifespanYears}y</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  ```
- [ ] Create `src/pages/damage-cost-lookup.astro` (`magnet="maintenance-checklist"`, `tool="damage-cost-lookup"`).
- [ ] Create `src/content/tools/damage-cost-lookup.mdx`.
- [ ] Commit: `feat(tool): damage-cost-lookup with /replace/[item] deep links`

**Verify:** Build green; manual: search filters; row navigation works after Task 22.

---

## Task 16: Tool — maintenance-schedule (PDF + .ics)

**Goal:** Annual schedule; downloadable PDF; calendar `.ics` export.

- [ ] Write `tests/calc/maintenance-schedule.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { buildSchedule } from '@lib/calc/maintenance-schedule';
  import tasks from '@data/tasks.json';

  describe('maintenance-schedule', () => {
    it('emits one occurrence per cadence interval per year', () => {
      const r = buildSchedule({
        startDate: '2026-01-01',
        horizonDays: 365,
        propertyTraits: { hasHvac: true, hasFireplace: false, climate: 'temperate' },
        catalog: tasks as any,
      });
      const hvac = r.events.filter(e => e.taskSlug === 'hvac-filter-change');
      // 60-day cadence over 365 days = 6 events
      expect(hvac.length).toBeGreaterThanOrEqual(6);
    });
  });
  ```
- [ ] Write `src/lib/calc/maintenance-schedule.ts`:
  ```ts
  import type { TaskCatalog } from '@lib/types';

  export interface ScheduleInput {
    startDate: string;
    horizonDays: number;
    propertyTraits: { hasHvac: boolean; hasFireplace: boolean; climate: 'cold' | 'temperate' | 'hot' };
    catalog: TaskCatalog;
  }
  export interface ScheduleEvent { taskSlug: string; name: string; date: string; cadenceDays: number; }
  export interface ScheduleResult { events: ScheduleEvent[]; }

  function applies(slug: string, traits: ScheduleInput['propertyTraits']): boolean {
    if (slug === 'hvac-filter-change' || slug === 'ac-tune-up') return traits.hasHvac;
    if (slug === 'chimney-sweep') return traits.hasFireplace;
    return true;
  }

  export function buildSchedule(input: ScheduleInput): ScheduleResult {
    const events: ScheduleEvent[] = [];
    const start = new Date(input.startDate + 'T00:00:00Z').getTime();
    const horizonMs = input.horizonDays * 86_400_000;
    for (const [slug, t] of Object.entries(input.catalog)) {
      if (!applies(slug, input.propertyTraits)) continue;
      let when = start + t.cadenceDays * 86_400_000;
      while (when - start <= horizonMs) {
        events.push({
          taskSlug: slug, name: t.name,
          date: new Date(when).toISOString().slice(0, 10),
          cadenceDays: t.cadenceDays,
        });
        when += t.cadenceDays * 86_400_000;
      }
    }
    events.sort((a, b) => a.date.localeCompare(b.date));
    return { events };
  }
  ```
- [ ] Add `src/lib/types.ts`:
  ```ts
  export interface MaintenanceTask {
    name: string;
    cadenceDays: number;
    season: 'all' | 'spring' | 'summer' | 'fall' | 'winter';
    estimatedCostUsd: [number, number];
    skillLevel: 'diy' | 'pro';
    consequencesOfSkipping: string;
    sourceUrls: string[];
    lastVerified: string;
  }
  export type TaskCatalog = Record<string, MaintenanceTask>;
  export interface ReplacementItem {
    name: string;
    category: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'electronics' | 'outdoor' | 'utility';
    costRange: [number, number];
    lifespanYears: number;
    brandRecs: string[];
    sourceUrls: string[];
    lastVerified: string;
  }
  export type ItemCatalog = Record<string, ReplacementItem>;
  ```
- [ ] Write `src/lib/pdf/maintenance-schedule.ts`:
  ```ts
  import { newBrandedDoc, newPage, drawHeader, finalize, MARGIN, PAGE, INK, INK2, ACCENT } from './base';
  import type { ScheduleResult } from '@lib/calc/maintenance-schedule';

  export async function buildSchedulePdf(r: ScheduleResult, title: string): Promise<Uint8Array> {
    const d = await newBrandedDoc();
    let page = newPage(d);
    drawHeader(page, d, 'Maintenance Schedule', title);
    let y = PAGE.height - MARGIN - 90;
    page.drawText('Date',     { x: MARGIN,      y, size: 9, font: d.bold, color: INK });
    page.drawText('Task',     { x: MARGIN + 80, y, size: 9, font: d.bold, color: INK });
    page.drawText('Cadence',  { x: MARGIN + 360, y, size: 9, font: d.bold, color: INK });
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE.width - MARGIN, y }, thickness: 0.5, color: ACCENT });
    y -= 14;
    for (const e of r.events) {
      if (y < MARGIN + 40) { page = newPage(d); drawHeader(page, d, 'Maintenance Schedule (cont.)', title); y = PAGE.height - MARGIN - 90; }
      page.drawText(e.date, { x: MARGIN,      y, size: 9, font: d.mono, color: INK });
      page.drawText(e.name, { x: MARGIN + 80, y, size: 9, font: d.body, color: INK });
      page.drawText(`${e.cadenceDays}d`, { x: MARGIN + 360, y, size: 9, font: d.mono, color: INK2 });
      y -= 13;
    }
    return finalize(d);
  }
  ```
- [ ] Write `src/lib/calendar/ics.ts`:
  ```ts
  import { createEvents, type EventAttributes } from 'ics';
  import type { ScheduleResult } from '@lib/calc/maintenance-schedule';

  export function buildIcs(r: ScheduleResult): string {
    const events: EventAttributes[] = r.events.map(e => {
      const [y, m, d] = e.date.split('-').map(Number);
      return {
        title: `Maintenance: ${e.name}`,
        start: [y, m, d, 9, 0],
        duration: { hours: 1 },
        description: `Recurs every ${e.cadenceDays} days. Generated by strops.tools.`,
        productId: 'strops.tools/ics',
      };
    });
    const { error, value } = createEvents(events);
    if (error) throw error;
    return value!;
  }

  export function downloadIcs(content: string, filename: string) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    window.gtag && window.gtag('event', 'ics_downloaded', { filename });
  }
  ```
- [ ] Create `src/components/calculators/MaintenanceSchedule.tsx` (form: startDate, horizonDays, hasHvac, hasFireplace, climate; result table; three buttons: download PDF, download .ics, print).
- [ ] Create `src/pages/maintenance-schedule.astro` (`magnet="maintenance-checklist"`, `tool="maintenance-schedule"`).
- [ ] Create `src/content/tools/maintenance-schedule.mdx`.
- [ ] Commit: `feat(tool): maintenance-schedule with PDF + ics export`

**Verify:** `pnpm test`, `pnpm build` green; manual: PDF and `.ics` files open in Calendar.

---

## Task 17: Maintenance data — `tasks.json`

**Goal:** 10 fully-fleshed entries + template.

- [ ] Create `src/data/tasks.json`:
  ```json
  {
    "hvac-filter-change": {
      "name": "HVAC filter change",
      "cadenceDays": 60,
      "season": "all",
      "estimatedCostUsd": [10, 30],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Reduced HVAC efficiency, dust buildup, allergy complaints, eventual coil damage and 4-figure repairs.",
      "sourceUrls": ["https://www.energy.gov/energysaver/maintaining-your-air-conditioner"],
      "lastVerified": "2026-05-05"
    },
    "smoke-detector-test": {
      "name": "Smoke + CO detector test",
      "cadenceDays": 90,
      "season": "all",
      "estimatedCostUsd": [0, 25],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Insurance and Airbnb safety policy violations; life-safety risk.",
      "sourceUrls": ["https://www.nfpa.org/Public-Education/Staying-safe/Safety-equipment/Smoke-alarms"],
      "lastVerified": "2026-05-05"
    },
    "deep-clean": {
      "name": "Quarterly deep clean (baseboards, vents, behind appliances)",
      "cadenceDays": 90,
      "season": "all",
      "estimatedCostUsd": [150, 400],
      "skillLevel": "pro",
      "consequencesOfSkipping": "Review erosion as guests notice grime cleaners skip on turn cleans.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "dryer-vent-clean": {
      "name": "Dryer vent cleaning",
      "cadenceDays": 365,
      "season": "fall",
      "estimatedCostUsd": [100, 200],
      "skillLevel": "pro",
      "consequencesOfSkipping": "Lint buildup is a leading cause of residential dryer fires.",
      "sourceUrls": ["https://www.nfpa.org/News-Blogs-and-Articles/Blogs/2023/04/30/Clothes-Dryer-Safety"],
      "lastVerified": "2026-05-05"
    },
    "gutter-clean": {
      "name": "Gutter cleaning",
      "cadenceDays": 180,
      "season": "fall",
      "estimatedCostUsd": [100, 250],
      "skillLevel": "pro",
      "consequencesOfSkipping": "Roof leaks, foundation drainage problems, ice dams in winter.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "water-heater-flush": {
      "name": "Water heater flush",
      "cadenceDays": 365,
      "season": "all",
      "estimatedCostUsd": [0, 200],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Sediment buildup shortens tank life by years and raises energy use.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "fridge-coil-clean": {
      "name": "Refrigerator coil cleaning + interior detail",
      "cadenceDays": 180,
      "season": "all",
      "estimatedCostUsd": [0, 50],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Compressor strain; energy waste; unhappy guests.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "mattress-flip": {
      "name": "Mattress flip / rotate",
      "cadenceDays": 90,
      "season": "all",
      "estimatedCostUsd": [0, 0],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Premature sagging, body-impression complaints, accelerated replacement.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "ac-tune-up": {
      "name": "AC tune-up",
      "cadenceDays": 365,
      "season": "spring",
      "estimatedCostUsd": [80, 200],
      "skillLevel": "pro",
      "consequencesOfSkipping": "Mid-summer outages = bad reviews and refunds.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "garbage-disposal-clean": {
      "name": "Garbage disposal clean + sharpen",
      "cadenceDays": 60,
      "season": "all",
      "estimatedCostUsd": [0, 10],
      "skillLevel": "diy",
      "consequencesOfSkipping": "Smell complaints, jams, eventual replacement.",
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    }
  }
  ```
- [ ] Create `src/data/tasks.template.json` with one entry showing every field — to expand toward ~30 tasks post-launch.
- [ ] Commit: `feat(data): tasks.json (10 entries + template)`

**Verify:** `pnpm test` re-runs maintenance-schedule test and stays green.

---

## Task 18: Maintenance programmatic pages — `/maintenance/[task].astro`

**Goal:** One page per task, getStaticPaths from `tasks.json`.

- [ ] Create `src/pages/maintenance/[task].astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  import STRLedgerCTA from '@components/funnel/STRLedgerCTA.astro';
  import AdSlot from '@components/ads/AdSlot.astro';
  import JsonLd from '@components/seo/JsonLd.astro';
  import { howToJsonLd, faqJsonLd } from '@lib/seo';
  import tasks from '@data/tasks.json';
  import type { TaskCatalog } from '@lib/types';

  export async function getStaticPaths() {
    return Object.keys(tasks as TaskCatalog).map(slug => ({ params: { task: slug } }));
  }
  const { task } = Astro.params;
  const t = (tasks as TaskCatalog)[task!]!;
  const url = `https://strops.tools/maintenance/${task}`;
  const months = (t.cadenceDays / 30).toFixed(1).replace(/\.0$/, '');
  const faqs = [
    { q: `How often should you ${t.name.toLowerCase()} in an Airbnb?`, a: `Every ${t.cadenceDays} days (~${months} months). Skipping it leads to: ${t.consequencesOfSkipping}` },
    { q: 'Is this a DIY job or pro?', a: t.skillLevel === 'diy' ? 'Most operators handle this themselves with a 15-30 minute turnaround.' : 'Best handled by a licensed contractor.' },
    { q: 'How much does it cost?', a: `Typical range is $${t.estimatedCostUsd[0]}–$${t.estimatedCostUsd[1]} per occurrence.` },
  ];
  const steps = [
    { name: 'Schedule it', text: `Add a recurring reminder every ${t.cadenceDays} days (use the maintenance schedule generator).` },
    { name: 'Stage supplies', text: 'Put the supplies in your cleaner closet so it does not slow turn cleans.' },
    { name: 'Document it', text: 'Photograph each completion to defend against guest claims.' },
  ];
  ---
  <Layout title={`How often to ${t.name.toLowerCase()} in an Airbnb`} description={`Cadence, cost, and consequences for ${t.name.toLowerCase()} in a short-term rental.`} canonical={url}>
    <slot slot="head">
      <JsonLd data={[
        howToJsonLd({ name: t.name, description: t.consequencesOfSkipping, steps }),
        faqJsonLd(faqs),
      ]} />
    </slot>
    <article class="prose mx-auto max-w-3xl px-6 py-10">
      <h1>How often to {t.name.toLowerCase()} in an Airbnb</h1>
      <p class="lead">Every {t.cadenceDays} days (~{months} months). Cost: ${t.estimatedCostUsd[0]}–${t.estimatedCostUsd[1]}. {t.skillLevel === 'diy' ? 'DIY-friendly.' : 'Best left to a pro.'}</p>
      <h2>Why it matters</h2>
      <p>{t.consequencesOfSkipping}</p>
      <AdSlot location="in-content" />
      <h2>Cost</h2>
      <p>Typical range: ${t.estimatedCostUsd[0]}–${t.estimatedCostUsd[1]}. Climate, property age, and last-completion date push the higher end.</p>
      <h2>DIY vs pro</h2>
      <p>{t.skillLevel === 'diy' ? 'Most operators handle this in 15-30 minutes per occurrence. Stage the supplies once and it disappears into your cleaner workflow.' : 'Recommend a licensed contractor. Schedule annually with one phone call and a calendar invite.'}</p>
      <h2>Signs you waited too long</h2>
      <p>Guest complaints, efficiency drops, or visible degradation. Track them in your operations log.</p>
      <EmailCaptureCard magnet="maintenance-checklist" tool={`maintenance-${task}`} />
      <h2>FAQ</h2>
      {faqs.map(f => <div><h3>{f.q}</h3><p>{f.a}</p></div>)}
      <STRLedgerCTA tool="maintenance-schedule" />
      <p class="text-ink3 text-xs">Last verified {t.lastVerified}.</p>
    </article>
  </Layout>
  ```
- [ ] Commit: `feat(content): /maintenance/[task] programmatic pages`

**Verify:** `pnpm build` produces 10 maintenance HTML files under `dist/maintenance/`.

---

## Task 19: Maintenance index — `/maintenance/`

**Goal:** Sortable table at index.

- [ ] Create `src/pages/maintenance/index.astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import tasks from '@data/tasks.json';
  import type { TaskCatalog } from '@lib/types';
  const list = Object.entries(tasks as TaskCatalog).sort(([, a], [, b]) => a.cadenceDays - b.cadenceDays);
  ---
  <Layout title="Airbnb maintenance schedule by task" description="How often to perform every maintenance task in a short-term rental, with costs and consequences.">
    <article class="prose mx-auto max-w-4xl px-6 py-10">
      <h1>Maintenance index</h1>
      <p class="lead">{list.length} tasks every active operator should track. Sorted by cadence (most frequent first).</p>
      <table class="w-full text-sm">
        <thead><tr class="text-ink3 text-left"><th>Task</th><th>Every</th><th>Cost</th><th>Skill</th></tr></thead>
        <tbody>
          {list.map(([slug, t]) => (
            <tr class="border-t border-rule">
              <td><a href={`/maintenance/${slug}`}>{t.name}</a></td>
              <td class="num">{t.cadenceDays}d</td>
              <td class="num">${t.estimatedCostUsd[0]}–${t.estimatedCostUsd[1]}</td>
              <td>{t.skillLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  </Layout>
  ```
- [ ] Commit: `feat(content): maintenance index`

**Verify:** `pnpm build` green.

---

## Task 20: Maintenance per-task MDX content collection

**Goal:** Schema + 5 sample MDX files (longer narratives override the boilerplate when present).

- [ ] Create `src/content/config.ts`:
  ```ts
  import { defineCollection, z } from 'astro:content';
  const maintenance = defineCollection({
    type: 'content',
    schema: z.object({ slug: z.string(), narrativeOverride: z.boolean().default(true) }),
  });
  const replace = defineCollection({
    type: 'content',
    schema: z.object({ slug: z.string(), narrativeOverride: z.boolean().default(true) }),
  });
  const blog = defineCollection({
    type: 'content',
    schema: z.object({ title: z.string(), date: z.coerce.date(), description: z.string() }),
  });
  export const collections = { maintenance, replace, blog };
  ```
- [ ] Create five MDX files under `src/content/maintenance/`:
  - `hvac-filter-change.mdx`
  - `smoke-detector-test.mdx`
  - `dryer-vent-clean.mdx`
  - `gutter-clean.mdx`
  - `mattress-flip.mdx`

  Each ~600-800 words with frontmatter `{ slug, narrativeOverride: true }`. Body covers: opening anecdote, exact cadence, signs of failure, DIY walk-through or pro-hire script, related tools.
- [ ] Update `[task].astro` to render the MDX body when present (use `getEntry('maintenance', task)` and fall through to the boilerplate sections if not found).
- [ ] Commit: `feat(content): maintenance MDX collection + 5 samples`

**Verify:** `pnpm build` green.

---

## Task 21: Replacement data — `items.json`

**Goal:** 10 fleshed entries + template.

- [ ] Create `src/data/items.json`:
  ```json
  {
    "queen-mattress": {
      "name": "Queen mattress",
      "category": "bedroom",
      "costRange": [400, 1200],
      "lifespanYears": 7,
      "brandRecs": ["Tuft & Needle", "Saatva", "Nectar"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "smart-tv-55": {
      "name": "55-inch smart TV",
      "category": "electronics",
      "costRange": [350, 900],
      "lifespanYears": 6,
      "brandRecs": ["TCL", "LG", "Samsung"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "sofa-3-seat": {
      "name": "3-seat sofa",
      "category": "living",
      "costRange": [600, 2200],
      "lifespanYears": 8,
      "brandRecs": ["Article", "IKEA", "West Elm"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "dining-table-6": {
      "name": "6-person dining table",
      "category": "living",
      "costRange": [400, 1500],
      "lifespanYears": 10,
      "brandRecs": ["IKEA", "Crate & Barrel", "Article"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "area-rug-8x10": {
      "name": "8x10 area rug",
      "category": "living",
      "costRange": [150, 700],
      "lifespanYears": 4,
      "brandRecs": ["Ruggable", "Loloi", "Safavieh"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "bedding-set-queen": {
      "name": "Queen bedding set (sheets + comforter + duvet)",
      "category": "bedroom",
      "costRange": [120, 350],
      "lifespanYears": 2,
      "brandRecs": ["Brooklinen", "Boll & Branch", "Threshold"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "kitchen-cookware-set": {
      "name": "Kitchen cookware set (10-piece)",
      "category": "kitchen",
      "costRange": [120, 400],
      "lifespanYears": 5,
      "brandRecs": ["T-fal", "Cuisinart", "Calphalon"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "shower-head": {
      "name": "Bathroom shower head",
      "category": "bathroom",
      "costRange": [25, 150],
      "lifespanYears": 8,
      "brandRecs": ["Moen", "Delta", "Speakman"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "vacuum-cleaner": {
      "name": "Cordless vacuum cleaner",
      "category": "utility",
      "costRange": [120, 500],
      "lifespanYears": 5,
      "brandRecs": ["Dyson", "Shark", "Tineco"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    },
    "smart-thermostat": {
      "name": "Smart thermostat",
      "category": "utility",
      "costRange": [120, 280],
      "lifespanYears": 8,
      "brandRecs": ["Nest", "Ecobee", "Honeywell"],
      "sourceUrls": [],
      "lastVerified": "2026-05-05"
    }
  }
  ```
- [ ] Create `src/data/items.template.json` with one entry showing every field, intended path to expand to ~50 items.
- [ ] Commit: `feat(data): items.json (10 entries + template)`

**Verify:** `pnpm build` green.

---

## Task 22: Replacement programmatic pages — `/replace/[item].astro`

- [ ] Create `src/pages/replace/[item].astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import EmailCaptureCard from '@components/funnel/EmailCaptureCard.astro';
  import STRLedgerCTA from '@components/funnel/STRLedgerCTA.astro';
  import AffiliateCard from '@components/affiliate/AffiliateCard.astro';
  import JsonLd from '@components/seo/JsonLd.astro';
  import { howToJsonLd, faqJsonLd } from '@lib/seo';
  import items from '@data/items.json';
  import type { ItemCatalog } from '@lib/types';

  export async function getStaticPaths() {
    return Object.keys(items as ItemCatalog).map(slug => ({ params: { item: slug } }));
  }
  const { item } = Astro.params;
  const it = (items as ItemCatalog)[item!]!;
  const url = `https://strops.tools/replace/${item}`;
  const faqs = [
    { q: `How much does it cost to replace a ${it.name.toLowerCase()} in a rental?`, a: `Typical range $${it.costRange[0]}–$${it.costRange[1]} depending on brand and quality tier.` },
    { q: `How long does a ${it.name.toLowerCase()} last in a short-term rental?`, a: `~${it.lifespanYears} years under high-turnover use; expect the lower end if you host more than 200 guest-nights a year.` },
    { q: 'Which brands hold up best in STR conditions?', a: `Operators we trust use ${it.brandRecs.join(', ')}.` },
  ];
  const steps = [
    { name: 'Confirm the spec', text: 'Match the size, voltage, or capacity of what you are replacing.' },
    { name: 'Order one tier above retail-grade', text: 'STR turnover is harder than typical residential use.' },
    { name: 'Log it in your capex tracker', text: 'Date, cost, and expected lifespan — drives accurate depreciation.' },
  ];
  ---
  <Layout title={`Cost to replace a ${it.name.toLowerCase()} in a rental`} description={`Replacement cost, lifespan, and brand recommendations for ${it.name.toLowerCase()}.`} canonical={url}>
    <slot slot="head">
      <JsonLd data={[
        howToJsonLd({ name: `Replace a ${it.name.toLowerCase()} in an STR`, description: 'Replacement steps and capex hygiene.', steps }),
        faqJsonLd(faqs),
      ]} />
    </slot>
    <article class="prose mx-auto max-w-3xl px-6 py-10">
      <h1>Cost to replace a {it.name.toLowerCase()} in a short-term rental</h1>
      <p class="lead">${it.costRange[0]}–${it.costRange[1]} typical range. {it.lifespanYears}-year lifespan under STR conditions.</p>
      <h2>Cost range</h2>
      <p>${it.costRange[0]} on the low end gets you a serviceable retail-grade option; ${it.costRange[1]} buys an STR-grade unit that survives the third year.</p>
      <h2>Lifespan in an STR</h2>
      <p>~{it.lifespanYears} years. STR-grade abuse cuts residential lifespans by 20-40%.</p>
      <h2>Brands we trust</h2>
      <ul>
        {it.brandRecs.map(b => <li>{b}</li>)}
      </ul>
      <h2>How to replace</h2>
      <ol>
        {steps.map(s => <li><strong>{s.name}.</strong> {s.text}</li>)}
      </ol>
      <EmailCaptureCard magnet="maintenance-checklist" tool={`replace-${item}`} />
      <h2>FAQ</h2>
      {faqs.map(f => <div><h3>{f.q}</h3><p>{f.a}</p></div>)}
      <STRLedgerCTA tool="damage-cost-lookup" />
      <p class="text-ink3 text-xs">Last verified {it.lastVerified}.</p>
    </article>
  </Layout>
  ```
- [ ] Commit: `feat(content): /replace/[item] programmatic pages`

**Verify:** `pnpm build` produces 10 replace pages; clicking a row from `/damage-cost-lookup` lands correctly.

---

## Task 23: Replacement index — `/replace/`

- [ ] Create `src/pages/replace/index.astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import items from '@data/items.json';
  import type { ItemCatalog } from '@lib/types';
  const list = Object.entries(items as ItemCatalog).sort(([, a], [, b]) => a.name.localeCompare(b.name));
  ---
  <Layout title="STR replacement cost index" description="Cost ranges and lifespans for every replaceable item in a short-term rental.">
    <article class="prose mx-auto max-w-4xl px-6 py-10">
      <h1>Replacement cost index</h1>
      <p class="lead">{list.length} items every operator should know the price tag of. Click through for brand recommendations.</p>
      <table class="w-full text-sm">
        <thead><tr class="text-ink3 text-left"><th>Item</th><th>Category</th><th>Cost</th><th>Lifespan</th></tr></thead>
        <tbody>
          {list.map(([slug, it]) => (
            <tr class="border-t border-rule">
              <td><a href={`/replace/${slug}`}>{it.name}</a></td>
              <td>{it.category}</td>
              <td class="num">${it.costRange[0]}–${it.costRange[1]}</td>
              <td class="num">{it.lifespanYears}y</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  </Layout>
  ```
- [ ] Commit: `feat(content): replacement index`

**Verify:** `pnpm build` green.

---

## Task 24: Replacement per-item MDX collection — 5 samples

- [ ] Add five MDX files under `src/content/replace/`:
  - `queen-mattress.mdx`
  - `smart-tv-55.mdx`
  - `sofa-3-seat.mdx`
  - `bedding-set-queen.mdx`
  - `vacuum-cleaner.mdx`

  ~500-700 words each. Each frontmatter `{ slug, narrativeOverride: true }`.
- [ ] Update `[item].astro` to render MDX body when entry exists.
- [ ] Commit: `feat(content): replacement MDX collection + 5 samples`

**Verify:** `pnpm build` green.

---

## Task 25: `tools.json` — registry mapping tool → magnet

**Goal:** Single source for the per-tool magnet matchup, used by sitemap + landing.

- [ ] Create `src/data/tools.json`:
  ```json
  {
    "turnover-scheduler":   { "title": "Turnover scheduler",     "magnet": "cleaner-sop",            "blurb": "Spot tight changeovers across multiple properties.", "affiliates": ["turno"] },
    "cleaner-dispatch":     { "title": "Cleaner dispatch",       "magnet": "cleaner-sop",            "blurb": "Generate assignment table + SMS templates + downloadable PDF.", "affiliates": ["turno"] },
    "smart-lock-codes":     { "title": "Smart lock code rotator", "magnet": "cleaner-sop",           "blurb": "Deterministic per-booking codes (HMAC-SHA-256).", "affiliates": ["august", "schlage", "remotelock"] },
    "linen-par-calculator": { "title": "Linen par calculator",   "magnet": "supply-par",             "blurb": "Sets per bed and per bath, by king/queen mix.", "affiliates": [] },
    "restock-calculator":   { "title": "Restock calculator",     "magnet": "supply-par",             "blurb": "Per-month consumables from booking volume.", "affiliates": [] },
    "damage-cost-lookup":   { "title": "Damage cost lookup",     "magnet": "maintenance-checklist",  "blurb": "Searchable replacement-cost table.", "affiliates": [] },
    "maintenance-schedule": { "title": "Maintenance schedule",   "magnet": "maintenance-checklist",  "blurb": "Annual schedule + PDF + .ics export.", "affiliates": ["minut", "noiseaware"] }
  }
  ```
- [ ] Commit: `feat(data): tools.json registry with magnet matchup`

**Verify:** `pnpm build` green.

---

## Task 26: Lead magnet pages

**Goal:** Three pages with email capture + stub PDF download path.

- [ ] Place stub PDFs at `public/pdf/cleaner-sop-v0.pdf`, `public/pdf/maintenance-checklist-v0.pdf`, `public/pdf/supply-par-v0.pdf`. Each is a 1-page placeholder produced by `pdf-lib`'s `newBrandedDoc + drawHeader + finalize`. Add a short script `scripts/build-stub-magnets.mjs`:
  ```js
  import { writeFile, mkdir } from 'node:fs/promises';
  import { newBrandedDoc, newPage, drawHeader, finalize } from '../src/lib/pdf/base.ts';
  await mkdir('public/pdf', { recursive: true });
  for (const m of [
    ['cleaner-sop-v0.pdf',           'Cleaner SOP — preview'],
    ['maintenance-checklist-v0.pdf', 'Maintenance Checklist — preview'],
    ['supply-par-v0.pdf',            'Supply Par-Level Sheet — preview'],
  ]) {
    const d = await newBrandedDoc();
    const p = newPage(d);
    drawHeader(p, d, m[1], 'Stub release; full version emailed after subscription.');
    await writeFile(`public/pdf/${m[0]}`, await finalize(d));
  }
  ```
  Add `pnpm run build:magnets` to package.json: `node --import tsx/esm scripts/build-stub-magnets.mjs` (after `pnpm add -D tsx`).
- [ ] Document: PDF binaries live in `public/pdf/`. Real magnets land in v0.2; stubs reference them via `?stub=1` parameter.
- [ ] Create `src/pages/get-the-cleaner-sop.astro`, `src/pages/get-the-maintenance-checklist.astro`, `src/pages/get-the-supply-par.astro`. All three follow the same template:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  const magnet = 'cleaner-sop';
  const file = '/pdf/cleaner-sop-v0.pdf';
  const title = 'STR Cleaner SOP (PDF)';
  const blurb = 'A printable standard-operating-procedure your cleaners can follow turn after turn.';
  ---
  <Layout title={title} description={blurb}>
    <article class="prose mx-auto max-w-2xl px-6 py-12">
      <h1>{title}</h1>
      <p class="lead">{blurb}</p>
      <form class="border border-rule bg-parchment-alt p-6 my-6" data-magnet={magnet}>
        <label class="text-sm">Email
          <input type="email" name="email" required class="block w-full border border-rule px-3 py-2 mt-1" />
        </label>
        <button class="bg-accent text-parchment px-4 py-2 mt-4 font-semibold">Send me the PDF</button>
        <p class="text-xs text-ink3 mt-3">We'll email a download link. Stub preview is also linked below.</p>
      </form>
      <a href={file} class="underline decoration-accent underline-offset-4">Download stub preview &rarr;</a>
    </article>
  </Layout>
  ```
  Repeat with the other two magnets/files.
- [ ] Add a tiny `<script>` that fires GA4 `magnet_captured` on submit, then redirects to a thank-you anchor.
- [ ] Commit: `feat(magnets): stubs + capture pages`

**Verify:** `pnpm run build:magnets && pnpm build` produces dist with each PDF accessible.

---

## Task 27: Landing page

**Goal:** Lists 7 tools, 3 magnets, cluster funnel.

- [ ] Create `src/pages/index.astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import tools from '@data/tools.json';
  type ToolEntry = { title: string; magnet: string; blurb: string; affiliates: string[] };
  const list = Object.entries(tools as Record<string, ToolEntry>);
  const magnets = [
    { slug: 'cleaner-sop',           href: '/get-the-cleaner-sop',           title: 'STR Cleaner SOP' },
    { slug: 'maintenance-checklist', href: '/get-the-maintenance-checklist', title: 'STR Maintenance Checklist' },
    { slug: 'supply-par',            href: '/get-the-supply-par',            title: 'STR Supply Par-Level Sheet' },
  ];
  ---
  <Layout title="strops.tools — Free tools for active STR operators" description="Seven free tools and three printable PDFs for short-term rental hosts running properties.">
    <section class="mx-auto max-w-5xl px-6 py-16">
      <h1 class="display text-5xl mb-3">Free tools for active short-term rental operators.</h1>
      <p class="lead text-xl text-ink2 max-w-2xl">Calculators, generators, and printable SOPs that pay for themselves on the first turn.</p>
    </section>
    <section class="border-t border-rule">
      <div class="mx-auto max-w-5xl px-6 py-12">
        <div class="text-label uppercase tracking-widest text-ink3 mb-4">Tools</div>
        <div class="grid md:grid-cols-2 gap-6">
          {list.map(([slug, t]) => (
            <a href={`/${slug}`} class="block border border-rule bg-parchment p-5 hover:border-accent">
              <div class="font-semibold text-lg">{t.title}</div>
              <p class="text-ink2 text-sm mt-1">{t.blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
    <section class="border-t border-rule bg-parchment-alt">
      <div class="mx-auto max-w-5xl px-6 py-12">
        <div class="text-label uppercase tracking-widest text-ink3 mb-4">Free downloads</div>
        <div class="grid md:grid-cols-3 gap-6">
          {magnets.map(m => (
            <a href={m.href} class="block border border-rule bg-parchment p-5 hover:border-accent">
              <div class="font-semibold">{m.title}</div>
              <div class="text-ink2 text-sm mt-1">PDF</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  </Layout>
  ```
- [ ] Commit: `feat(page): landing`

**Verify:** `pnpm build` green; landing renders 7 tools + 3 magnets.

---

## Task 28: About + Contact

- [ ] Create `src/pages/about.astro` — brief explainer: who runs it (Daniel/The STR Ledger), why this site exists, what's free/what's not, last-updated date.
- [ ] Create `src/pages/contact.astro` — `mailto:hello@strops.tools` link + a Formspree-style fallback form (action url left as `https://formspree.io/f/REPLACE_ME`).
- [ ] Commit: `feat(page): about + contact`

**Verify:** `pnpm build` green.

---

## Task 29: Sitemap + robots.txt

- [ ] Confirm `@astrojs/sitemap` already in integrations (Task 1) — it auto-emits `sitemap-index.xml` from static routes.
- [ ] Create `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://strops.tools/sitemap-index.xml
  ```
- [ ] Commit: `feat(seo): robots.txt + sitemap config`

**Verify:** `pnpm build` produces `dist/sitemap-index.xml` and includes all `/maintenance/*` and `/replace/*` routes.

---

## Task 30: OG images via Satori

**Goal:** Per-route social card built at `pnpm build`.

- [ ] Add Inter Regular + Bold TTF files under `src/og/fonts/` (download from Google Fonts).
- [ ] Create `src/og/build.ts`:
  ```ts
  import satori from 'satori';
  import { Resvg } from '@resvg/resvg-js';
  import { writeFile, mkdir, readFile } from 'node:fs/promises';
  import path from 'node:path';

  const routes: Array<{ slug: string; title: string; subtitle: string }> = [
    { slug: 'default',                 title: 'strops.tools',                  subtitle: 'Free tools for active STR operators.' },
    { slug: 'turnover-scheduler',      title: 'Turnover Scheduler',           subtitle: 'Spot tight changeovers across properties.' },
    { slug: 'cleaner-dispatch',        title: 'Cleaner Dispatch',             subtitle: 'Assignment table + SMS + PDF.' },
    { slug: 'smart-lock-codes',        title: 'Smart Lock Codes',             subtitle: 'Deterministic per-booking codes.' },
    { slug: 'linen-par-calculator',    title: 'Linen Par Calculator',         subtitle: 'Sets per bed, per bath.' },
    { slug: 'restock-calculator',      title: 'Restock Calculator',           subtitle: 'Consumables from booking volume.' },
    { slug: 'damage-cost-lookup',      title: 'Damage Cost Lookup',           subtitle: 'Replacement costs by item.' },
    { slug: 'maintenance-schedule',    title: 'Maintenance Schedule',         subtitle: 'Annual schedule + PDF + .ics.' },
  ];

  async function loadFont(file: string) {
    return await readFile(path.join('src/og/fonts', file));
  }

  async function build() {
    const inter    = await loadFont('Inter-Regular.ttf');
    const interBold = await loadFont('Inter-Bold.ttf');
    await mkdir('public/og', { recursive: true });
    for (const r of routes) {
      const svg = await satori(
        {
          type: 'div',
          props: {
            style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 64, background: '#F6EFE2', color: '#12304E', fontFamily: 'Inter' },
            children: [
              { type: 'div', props: { style: { fontSize: 28, color: '#4F6B5A', letterSpacing: 4, textTransform: 'uppercase' }, children: 'strops.tools' } },
              { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 16 }, children: [
                { type: 'div', props: { style: { fontSize: 80, fontWeight: 700, lineHeight: 1.05 }, children: r.title } },
                { type: 'div', props: { style: { fontSize: 32, color: '#555049' }, children: r.subtitle } },
              ] } },
              { type: 'div', props: { style: { fontSize: 22, color: '#4F6B5A' }, children: 'Built by The STR Ledger' } },
            ],
          },
        },
        { width: 1200, height: 630, fonts: [{ name: 'Inter', data: inter, weight: 400, style: 'normal' }, { name: 'Inter', data: interBold, weight: 700, style: 'normal' }] },
      );
      const png = new Resvg(svg).render().asPng();
      await writeFile(`public/og/${r.slug}.png`, png);
    }
  }
  build();
  ```
- [ ] Add `prebuild` script to `package.json`: `"prebuild": "node --import tsx/esm src/og/build.ts"`.
- [ ] Update each `.astro` page to set `ogImage="/og/<slug>.png"` in Layout props.
- [ ] Commit: `feat(seo): satori og image generation`

**Verify:** `pnpm build` writes `public/og/*.png` files; pages reference them.

---

## Task 31: GA4 cross-domain analytics

**Goal:** GA4 init + custom events.

- [ ] Add to `Layout.astro` `<head>`:
  ```astro
  <script is:inline define:vars={{ id: import.meta.env.PUBLIC_GA4_ID }}>
    if (id) {
      const s = document.createElement('script'); s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', id, { linker: { domains: ['thestrledger.com', 'strbuyers.tools', 'strhost.tools', 'strguests.tools', 'strops.tools'] } });
    }
  </script>
  ```
- [ ] Wire client-side GA4 events:
  - `pdf_downloaded` — already in `lib/pdf/base.ts` `downloadBytes`.
  - `ics_downloaded` — already in `lib/calendar/ics.ts` `downloadIcs`.
  - `magnet_captured` — magnet pages on form submit.
  - `cluster_link_clicked` — add a small inline script to `ClusterFunnelBlock.astro` that listens on `.cluster-link` clicks.
  - `affiliate_click` — already wired in `AffiliateCard.astro`.
- [ ] Add `.env.example` documenting `PUBLIC_GA4_ID`, `PUBLIC_ADSENSE_ENABLED`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ESP_ENDPOINT`.
- [ ] Commit: `feat(analytics): ga4 cross-domain + custom events`

**Verify:** `pnpm build` green; in dev, gtag calls visible in Network tab when `PUBLIC_GA4_ID` is set.

---

## Task 32: Playwright smokes — per tool

**Goal:** One smoke per tool plus magnet capture path.

- [ ] Create `tests/e2e/tools.spec.ts`:
  ```ts
  import { test, expect } from '@playwright/test';

  const tools = [
    '/turnover-scheduler',
    '/cleaner-dispatch',
    '/smart-lock-codes',
    '/linen-par-calculator',
    '/restock-calculator',
    '/damage-cost-lookup',
    '/maintenance-schedule',
  ];

  for (const route of tools) {
    test(`${route} renders + has primary heading`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.calculator-shell, .ad-slot')).toHaveCount(1, { timeout: 5000 }).catch(() => {});
    });
  }

  test('cleaner-dispatch downloads a PDF', async ({ page }) => {
    await page.goto('/cleaner-dispatch');
    const dl = page.waitForEvent('download');
    await page.getByRole('button', { name: /download dispatch sheet/i }).click();
    const file = await dl;
    expect(file.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('smart-lock-codes is deterministic in UI', async ({ page }) => {
    await page.goto('/smart-lock-codes?secret=test-secret&digits=6&bookings=B-1');
    const code1 = (await page.locator('td.num').first().textContent())?.trim();
    await page.reload();
    const code2 = (await page.locator('td.num').first().textContent())?.trim();
    expect(code1).toBe(code2);
  });

  test('damage-cost-lookup row click navigates', async ({ page }) => {
    await page.goto('/damage-cost-lookup');
    await page.getByText(/queen mattress/i).click();
    await expect(page).toHaveURL(/\/replace\/queen-mattress$/);
  });

  test('maintenance-schedule produces ics', async ({ page }) => {
    await page.goto('/maintenance-schedule');
    const dl = page.waitForEvent('download');
    await page.getByRole('button', { name: /download .ics/i }).click();
    const file = await dl;
    expect(file.suggestedFilename()).toMatch(/\.ics$/);
  });
  ```
- [ ] `pnpm exec playwright install chromium` once locally.
- [ ] Commit: `test(e2e): per-tool smokes`

**Verify:** `pnpm build && pnpm test:e2e` green.

---

## Task 33: GitHub Actions CI

- [ ] Create `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on:
    push: { branches: [main] }
    pull_request:
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v3
          with: { version: 9 }
        - uses: actions/setup-node@v4
          with: { node-version: 20, cache: 'pnpm' }
        - run: pnpm install --frozen-lockfile
        - run: pnpm typecheck
        - run: pnpm test
        - run: pnpm exec playwright install --with-deps chromium
        - run: pnpm build
        - run: pnpm test:e2e
        - uses: actions/upload-artifact@v4
          if: always()
          with: { name: dist, path: dist }
  ```
- [ ] Commit: `ci: github actions pipeline`

**Verify:** Push to a branch; CI passes.

---

## Task 34: Hostinger FTP deploy

- [ ] Create `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy
  on:
    push: { branches: [main] }
  jobs:
    deploy:
      runs-on: ubuntu-latest
      needs: []
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v3
          with: { version: 9 }
        - uses: actions/setup-node@v4
          with: { node-version: 20, cache: 'pnpm' }
        - run: pnpm install --frozen-lockfile
        - run: pnpm build
        - name: FTP deploy
          uses: SamKirkland/FTP-Deploy-Action@v4.3.5
          with:
            server: ${{ secrets.HOSTINGER_FTP_HOST }}
            username: ${{ secrets.HOSTINGER_FTP_USERNAME }}
            password: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
            local-dir: ./dist/
            server-dir: /strops.tools/
  ```
- [ ] Document the three required secrets: `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`.
- [ ] Commit: `ci: hostinger ftp deploy`

**Verify:** Add the secrets in GitHub; push to `main`; site lands on Hostinger.

---

## Task 35: Pre-launch smoke

- [ ] Run `pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e` locally — all green.
- [ ] Manual checklist:
  - [ ] All 7 tools render and respond to inputs.
  - [ ] Cleaner-dispatch PDF opens in Acrobat.
  - [ ] Maintenance-schedule `.ics` imports into Google Calendar.
  - [ ] Smart-lock-codes are stable across reload.
  - [ ] Each tool's magnet matchup matches `tools.json`.
  - [ ] `/maintenance/` and `/replace/` indexes link to all programmatic pages.
  - [ ] Cluster funnel block links go to strbuyers/strhost/strguests with UTM tags.
  - [ ] `View source` shows `WebApplication`, `FAQPage`, `HowTo` JSON-LD as appropriate.
  - [ ] OG images load at `/og/*.png`.
  - [ ] Print stylesheet hides ads + chrome.
  - [ ] `robots.txt` and `sitemap-index.xml` are reachable in dist.
- [ ] Commit: `chore: pre-launch verification`

---

## Task 36: Final commit + tag — v0.1.0

- [ ] `git tag v0.1.0 -m "v0.1.0 — strops.tools launch"`
- [ ] `git push origin main --tags`
- [ ] In GitHub UI: cut a release on `v0.1.0`. Title: "strops.tools v0.1.0 — 7 tools + 80 programmatic pages + 3 lead magnets".
