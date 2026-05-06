#!/usr/bin/env node
/**
 * Satori-based OG image generator. Produces 1200x630 PNGs for every route
 * the site cares about: landing, 7 calculators, 51 lodging-tax state pages,
 * about, contact, lead magnet.
 *
 * Wired into `pnpm build` via package.json so OG images regenerate on every
 * production build. Outputs to both:
 *   - public/og/<slug>.png  (so dev preview works at /og/<slug>.png)
 *   - dist/og/<slug>.png    (so production deploy serves them)
 *
 * Run standalone: pnpm exec node scripts/build-og.mjs
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

// Brand tokens — kept inline so this script has zero TS / Tailwind dependency.
const BRAND = {
  parchment: '#F6EFE2',
  parchmentAlt: '#EFE5D0',
  navy: '#12304E',
  navyTint: '#2A4867',
  gold: '#C9A24B',
  goldDeep: '#A9863A',
  ink: '#2B2B2B',
  ink2: '#555049',
};

async function loadFonts() {
  // Inter for nav/wordmark fallback. We use Inter at three weights so the
  // wordmark + body + label hierarchy matches the live brand.
  async function fetchFont(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
    return res.arrayBuffer();
  }

  const [interSemiBold, interMedium, cormorantMedium] = await Promise.all([
    fetchFont('https://rsms.me/inter/font-files/Inter-SemiBold.woff'),
    fetchFont('https://rsms.me/inter/font-files/Inter-Medium.woff'),
    // Cormorant Garamond Medium 500 — Google Fonts mirror
    fetchFont('https://fonts.gstatic.com/s/cormorantgaramond/v18/U1roKkeZh-iyDFr_QPKkruE_Op0vJzlQDtEd8mRwroLg.woff'),
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
        // Top: kicker (uppercase letterspaced gold label)
        {
          type: 'div',
          props: {
            style: {
              fontSize: 22,
              letterSpacing: 6,
              color: BRAND.goldDeep,
              textTransform: 'uppercase',
              fontWeight: 600,
            },
            children: kicker,
          },
        },
        // Middle: title (Cormorant serif)
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
        // Bottom: wordmark with gold period
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Cormorant',
                    fontWeight: 500,
                    fontSize: 36,
                    color: BRAND.gold,
                  },
                  children: 'STR Host',
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
                  },
                  children: [
                    { type: 'span', props: { style: { color: BRAND.gold }, children: '.' } },
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

async function main() {
  const fonts = await loadFonts();

  const tools = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'),
  );
  const states = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'lodging-tax-by-state.json'), 'utf8'),
  );

  const renders = [];

  // Landing
  renders.push(
    render('index', {
      kicker: 'STR Host Tools',
      title: 'Free calculators for short-term rental hosts.',
      footer: 'Built by The STR Ledger',
    }, fonts),
  );

  // Per-tool OG (uses tool slug from JSON keys)
  for (const [slug, tool] of Object.entries(tools)) {
    if (slug === 'lodging-tax') continue; // index handled below
    renders.push(
      render(slug, {
        kicker: 'STR Calculator',
        title: tool.name + '.',
        footer: tool.tagline,
      }, fonts),
    );
  }

  // Lodging-tax index
  renders.push(
    render('lodging-tax', {
      kicker: 'Lodging Tax — 50 states + DC',
      title: 'Every state’s STR lodging tax rate.',
      footer: 'Sourced annually from each state DOR',
    }, fonts),
  );

  // Per-state lodging-tax pages — slug `lodging-tax-<code>` so file path is
  // public/og/lodging-tax-<code>.png; matches Layout.astro's ogImageFor()
  // which converts '/' to '-'.
  for (const [code, entry] of Object.entries(states)) {
    renders.push(
      render(`lodging-tax-${code}`, {
        kicker: `${entry.name} — Lodging Tax`,
        title: `${entry.name} STR lodging tax rate.`,
        footer: `Verified ${entry.lastVerified}`,
      }, fonts),
    );
  }

  // Site pages
  renders.push(
    render('about', {
      kicker: 'About',
      title: 'Free calculators. No upsell.',
      footer: 'Built by The STR Ledger',
    }, fonts),
  );
  renders.push(
    render('contact', {
      kicker: 'Contact',
      title: 'hello@strhost.tools',
      footer: 'Bug reports + calculator requests welcome',
    }, fonts),
  );
  renders.push(
    render('get-the-pdf', {
      kicker: 'Coming Q4 2026',
      title: 'STR Host Income Report 2026.',
      footer: 'Free PDF · 50-state ADR + RevPAR data',
    }, fonts),
  );

  const slugs = await Promise.all(renders);
  console.log(`OG images built: ${slugs.length} files in dist/og/ and public/og/`);
}

main().catch((err) => {
  console.error('OG build failed:', err);
  process.exit(1);
});
