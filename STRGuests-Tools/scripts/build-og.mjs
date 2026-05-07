#!/usr/bin/env node
/**
 * Satori-based OG image generator for strguests.tools.
 *
 * Produces 1200x630 PNGs for every route the site needs OG images for:
 *   - landing
 *   - 4 PDF generators (+ 3 AI placeholder slugs for Phase 3)
 *   - templates index + 109 scenario pages (templates-<slug>.png)
 *   - about, contact, get-the-templates
 *
 * Wired into `pnpm build` via package.json. Outputs to:
 *   - public/og/<slug>.png  (dev preview)
 *   - dist/og/<slug>.png    (production deploy)
 *
 * Run standalone: node scripts/build-og.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const distOgDir = path.join(root, 'dist', 'og');
const publicOgDir = path.join(root, 'public', 'og');

// strguests.tools brand tokens — terracotta accent on parchment + navy.
const BRAND = {
  parchment: '#F6EFE2',
  parchmentAlt: '#EFE5D0',
  navy: '#12304E',
  navyTint: '#2A4867',
  terracotta: '#C8684C',
  terracottaDeep: '#9C4A30',
  gold: '#C9A24B',
  goldDeep: '#A9863A',
  ink: '#2B2B2B',
  ink2: '#555049',
};

async function loadFonts() {
  async function fetchFont(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
    return res.arrayBuffer();
  }
  // Resolved via the Google Fonts CSS2 API on 2026-05-06. Pinned to a
  // specific font-file revision so builds stay reproducible. If Google
  // changes the hashed path, refresh by querying:
  //   curl "https://fonts.googleapis.com/css2?family=Inter:wght@500;600"
  //   curl "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500"
  const [interSemiBold, interMedium, cormorantMedium] = await Promise.all([
    fetchFont('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf'),
    fetchFont('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf'),
    fetchFont('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_s06GnM.ttf'),
  ]);
  return [
    { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
    { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
    { name: 'Cormorant', data: cormorantMedium, weight: 500, style: 'normal' },
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
        padding: '60px 70px',
        background: BRAND.parchment,
        fontFamily: 'Inter',
      },
      children: [
        // Top: kicker label (terracotta uppercase)
        {
          type: 'div',
          props: {
            style: {
              fontSize: 22,
              letterSpacing: 6,
              color: BRAND.terracottaDeep,
              textTransform: 'uppercase',
              fontWeight: 600,
            },
            children: kicker,
          },
        },
        // Middle: title (Cormorant serif, large)
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Cormorant',
              fontSize: 80,
              fontWeight: 500,
              lineHeight: 1.05,
              color: BRAND.navy,
              maxWidth: 1000,
            },
            children: title,
          },
        },
        // Bottom: wordmark
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline', gap: 6 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Cormorant',
                    fontWeight: 500,
                    fontSize: 36,
                    color: BRAND.terracotta,
                  },
                  children: 'STR Guests',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: BRAND.ink2,
                  },
                  children: [
                    { type: 'span', props: { style: { color: BRAND.terracotta }, children: '.' } },
                    { type: 'span', props: { children: 'tools' } },
                  ],
                },
              },
              ...(footer
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginLeft: 24,
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
  const distPath = path.join(distOgDir, `${slug}.png`);
  const pubPath = path.join(publicOgDir, `${slug}.png`);
  await fs.mkdir(path.dirname(distPath), { recursive: true });
  await fs.mkdir(path.dirname(pubPath), { recursive: true });
  await fs.writeFile(distPath, png);
  await fs.writeFile(pubPath, png);
  return slug;
}

function truncate(s, n) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

async function main() {
  const fonts = await loadFonts();

  const tools = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'),
  );
  const templates = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'templates.json'), 'utf8'),
  );

  const renders = [];

  // Landing
  renders.push(
    render(
      'index',
      {
        kicker: 'STR Guests Tools',
        title: 'Free tools to delight your guests.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );

  // Per-tool OG (PDF generators + AI placeholders)
  for (const [slug, tool] of Object.entries(tools)) {
    renders.push(
      render(
        slug,
        {
          kicker: tool.kind === 'ai' ? 'AI Generator · Coming soon' : 'PDF Generator',
          title: `${tool.name}.`,
          footer: tool.tagline,
        },
        fonts,
      ),
    );
  }

  // Templates index
  renders.push(
    render(
      'templates',
      {
        kicker: `${templates.length}+ Airbnb Templates`,
        title: 'Free message templates for hosts and guests.',
        footer: 'Booking · Pre-arrival · Mid-stay · Post-checkout · Issues',
      },
      fonts,
    ),
  );

  // Per-scenario template OG — slug `templates-<scenario>` so file path is
  // public/og/templates-<scenario>.png (matches ogImageFor logic).
  for (const t of templates) {
    renders.push(
      render(
        `templates-${t.slug}`,
        {
          kicker: `Airbnb Template · ${t.category.replace('-', ' ')}`,
          title: `${truncate(t.scenario, 80)}.`,
          footer: t.shortDescription,
        },
        fonts,
      ),
    );
  }

  // Site pages
  renders.push(
    render(
      'about',
      { kicker: 'About', title: 'Free tools. No upsell.', footer: 'Built by The STR Ledger' },
      fonts,
    ),
  );
  renders.push(
    render(
      'contact',
      {
        kicker: 'Contact',
        title: 'hello@strguests.tools',
        footer: 'Bug reports + tool requests welcome',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'get-the-templates',
      {
        kicker: 'Free Lead Magnet',
        title: 'The Welcome Book master template.',
        footer: 'Editable · Branded · Yours forever',
      },
      fonts,
    ),
  );

  const slugs = await Promise.all(renders);
  console.log(`OG images built: ${slugs.length} files in dist/og/ and public/og/`);
}

main().catch((err) => {
  console.error('OG build failed:', err);
  process.exit(1);
});
