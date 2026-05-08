#!/usr/bin/env node
/**
 * Satori-based OG image generator. Produces 1200x630 PNGs for every route
 * the site cares about: landing, 7 tools, 3 lead magnets, about + contact,
 * maintenance index + per-task pages, replace index + per-item pages.
 *
 * Wired into `pnpm build` as a prebuild step so OG images regenerate on
 * every production build. Outputs to `public/og/<slug>.png`; Astro copies
 * `public/` → `dist/` during build, so the same files end up in
 * `dist/og/<slug>.png` for deploy.
 *
 * Slug convention (matches Layout.astro `ogImage` prop):
 *   '/'                       → 'index'
 *   '/turnover-scheduler/'    → 'turnover-scheduler'
 *   '/maintenance/'           → 'maintenance'
 *   '/maintenance/<task>/'    → 'maintenance-<task>'
 *   '/replace/'               → 'replace'
 *   '/replace/<item>/'        → 'replace-<item>'
 *
 * Run standalone: pnpm exec node scripts/build-og.mjs
 *
 * Soft-fail: if font CDN is unreachable (Hostinger build env may not have
 * outbound to fonts.googleapis.com), this script logs and exits 0 — does
 * not block the deploy. Default OG card (`/og/default.png`) is the only
 * fallback consumers get in that case.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const publicDir = path.join(root, 'public', 'og');

// Brand tokens — ops-utility green/gray on parchment. Distinct from
// strguests' terracotta and strhost's editorial-finance feel.
const BRAND = {
  parchment: '#F6EFE2',
  navy: '#12304E',
  ink: '#2B2B2B',
  ink2: '#555049',
  accent: '#4F6B5A',     // ops-utility green-gray
  accent700: '#3C5446',  // darker accent for the wordmark
};

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts() {
  // Fontsource on jsdelivr — stable CDN, versioned URLs. Avoids
  // fonts.googleapis.com which Hostinger build env may not allow outbound to.
  const [interBold, interSemiBold, jetbrainsMedium] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/files/jetbrains-mono-latin-500-normal.woff'),
  ]);
  return [
    { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
    { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: jetbrainsMedium, weight: 500, style: 'normal' },
  ];
}

function ogTree({ kicker, title, footer }) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: BRAND.parchment,
        fontFamily: 'Inter',
        // ops-utility: thin green accent rule on the left
        borderLeft: `12px solid ${BRAND.accent}`,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: 22,
              letterSpacing: 6,
              color: BRAND.accent,
              textTransform: 'uppercase',
              fontWeight: 600,
            },
            children: kicker,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              color: BRAND.navy,
              maxWidth: 1000,
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline', gap: 4 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontWeight: 700,
                    fontSize: 28,
                    color: BRAND.accent700,
                  },
                  children: 'strops',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontWeight: 700,
                    fontSize: 28,
                    color: BRAND.accent,
                  },
                  children: '.',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: BRAND.ink2,
                    marginLeft: 2,
                  },
                  children: 'tools',
                },
              },
              ...(footer
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginLeft: 24,
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 500,
                          fontSize: 16,
                          color: BRAND.ink2,
                        },
                        children: footer,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      ],
    },
  };
}

async function render(slug, opts, fonts) {
  const svg = await satori(ogTree(opts), { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  const pubPath = path.join(publicDir, `${slug}.png`);
  await fs.mkdir(path.dirname(pubPath), { recursive: true });
  await fs.writeFile(pubPath, png);
  return slug;
}

async function main() {
  let fonts;
  try {
    fonts = await loadFonts();
  } catch (err) {
    // Soft-fail: font CDN unreachable. Log and exit 0 — Astro build
    // already runs after this; we do not want to block the deploy.
    console.warn('OG build skipped — font fetch failed:', err.message ?? err);
    process.exit(0);
  }

  const tools = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'));
  const tasks = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'tasks.json'), 'utf8'));
  const items = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'items.json'), 'utf8'));

  const renders = [];

  // Default fallback (referenced by Layout.astro when ogImage prop unset)
  renders.push(
    render(
      'default',
      {
        kicker: 'strops.tools',
        title: 'Free tools for active STR operators.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );

  // Landing
  renders.push(
    render(
      'index',
      {
        kicker: 'strops.tools',
        title: 'Free tools for active STR operators.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );

  // 7 tools
  for (const [slug, t] of Object.entries(tools)) {
    renders.push(
      render(
        slug,
        {
          kicker: 'Free Tool',
          title: t.title + '.',
          footer: t.primary_keyword,
        },
        fonts,
      ),
    );
  }

  // Site pages
  renders.push(
    render(
      'about',
      {
        kicker: 'About',
        title: 'Free tools. No upsell.',
        footer: 'strops.tools — free tools for short-term rental ops',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'contact',
      {
        kicker: 'Contact',
        title: 'hello@strops.tools',
        footer: 'Bug reports + tool requests welcome',
      },
      fonts,
    ),
  );

  // 3 lead magnet capture pages
  renders.push(
    render(
      'get-the-cleaner-sop',
      {
        kicker: 'Free PDF',
        title: 'Cleaner SOP.',
        footer: 'Hand it to your cleaner. Sign-off included.',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'get-the-maintenance-checklist',
      {
        kicker: 'Free PDF',
        title: 'Maintenance Checklist.',
        footer: 'Per-turn, monthly, quarterly, annual.',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'get-the-supply-par',
      {
        kicker: 'Free PDF',
        title: 'Supply Par-Level Sheet.',
        footer: 'Linens, paper goods, kitchen, amenities.',
      },
      fonts,
    ),
  );

  // Maintenance index + per-task
  renders.push(
    render(
      'maintenance',
      {
        kicker: 'Maintenance Index',
        title: 'How often to do every STR task.',
        footer: `${Object.keys(tasks).length} tasks · sorted by cadence`,
      },
      fonts,
    ),
  );
  for (const [slug, t] of Object.entries(tasks)) {
    renders.push(
      render(
        `maintenance-${slug}`,
        {
          kicker: 'Maintenance',
          title: t.name + '.',
          footer: `Every ${t.cadenceDays} days · $${t.estimatedCostUsd[0]}-$${t.estimatedCostUsd[1]} · ${t.skillLevel}`,
        },
        fonts,
      ),
    );
  }

  // Replace index + per-item
  renders.push(
    render(
      'replace',
      {
        kicker: 'Replacement Cost Lookup',
        title: 'How much to replace anything in a rental.',
        footer: `${Object.keys(items).length} items · cost ranges + lifespan`,
      },
      fonts,
    ),
  );
  for (const [slug, it] of Object.entries(items)) {
    renders.push(
      render(
        `replace-${slug}`,
        {
          kicker: 'Replacement Cost',
          title: it.name + '.',
          footer: `$${it.costRange[0]}-$${it.costRange[1]} · ~${it.lifespanYears}y lifespan`,
        },
        fonts,
      ),
    );
  }

  const slugs = await Promise.all(renders);
  console.log(`OG images built: ${slugs.length} files in public/og/`);
}

main().catch((err) => {
  // Soft-fail: OG generation is build polish — don't block the deploy on
  // a transient font CDN hiccup or a stale data ref. The Astro build
  // proper runs after this.
  console.warn('OG build skipped:', err.message ?? err);
  process.exit(0);
});
