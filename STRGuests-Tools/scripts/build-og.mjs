#!/usr/bin/env node
/**
 * Satori-based OG image generator. Produces 1200x630 PNGs for every route
 * the site cares about: landing, 7 generators, templates index + 26
 * scenario pages, about, contact, lead-magnet.
 *
 * Wired into `pnpm build` so OG images regenerate on every production
 * build. Outputs to:
 *   - public/og/<slug>.png  (dev preview at /og/<slug>.png)
 *   - dist/og/<slug>.png    (production deploy)
 *
 * Slug rule (matches src/lib/seo.ts ogImageFor):
 *   '/'                     → 'index'
 *   '/welcome-book'         → 'welcome-book'
 *   '/templates/'           → 'templates'
 *   '/templates/<scenario>' → 'templates-<scenario>'
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
const distDir = path.join(root, 'dist', 'og');
const publicDir = path.join(root, 'public', 'og');

// Brand tokens — inlined (zero TS / Tailwind dep on the script). Mirrors
// src/styles/tokens.css (terracotta accent on parchment).
const BRAND = {
  parchment: '#F6EFE2',
  navy: '#12304E',
  ink: '#2B2B2B',
  ink2: '#555049',
  accent: '#C8684C',
  accent700: '#9C4A30',
};

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts() {
  const [interSemiBold, interMedium, cormorantMedium] = await Promise.all([
    fetchFont('https://rsms.me/inter/font-files/Inter-SemiBold.woff'),
    fetchFont('https://rsms.me/inter/font-files/Inter-Medium.woff'),
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
              fontFamily: 'Cormorant',
              fontSize: 76,
              fontWeight: 500,
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
            style: { display: 'flex', alignItems: 'baseline', gap: 6 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Cormorant',
                    fontWeight: 500,
                    fontSize: 36,
                    color: BRAND.accent700,
                  },
                  children: 'STR Guests',
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
                    { type: 'span', props: { style: { color: BRAND.accent }, children: '.' } },
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
  const distPath = path.join(distDir, `${slug}.png`);
  const pubPath = path.join(publicDir, `${slug}.png`);
  await fs.mkdir(path.dirname(distPath), { recursive: true });
  await fs.mkdir(path.dirname(pubPath), { recursive: true });
  await fs.writeFile(distPath, png);
  await fs.writeFile(pubPath, png);
  return slug;
}

async function main() {
  const fonts = await loadFonts();

  const tools = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'));
  const templatesFile = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'templates.json'), 'utf8'),
  );

  const renders = [];

  // Landing
  renders.push(
    render(
      'index',
      {
        kicker: 'STR Guests Tools',
        title: 'Free generators for hosts to delight guests.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );

  // Per-tool OG (uses tool slug from JSON keys)
  for (const [slug, tool] of Object.entries(tools)) {
    renders.push(
      render(
        slug,
        {
          kicker: tool.kind === 'pdf' ? 'Free PDF Generator' : 'Free AI Generator',
          title: tool.name + '.',
          footer: tool.tagline,
        },
        fonts,
      ),
    );
  }

  // Templates library index
  renders.push(
    render(
      'templates',
      {
        kicker: 'Free Template Library',
        title: 'Airbnb host message templates.',
        footer: '26 hand-written templates · 10 categories',
      },
      fonts,
    ),
  );

  // Per-scenario template pages — slug 'templates-<scenario>' so the URL
  // /templates/<scenario> maps to public/og/templates-<scenario>.png
  // (matches Layout.astro's ogImageFor() which converts '/' to '-')
  for (const [scenarioKey, entry] of Object.entries(templatesFile.templates)) {
    renders.push(
      render(
        `templates-${scenarioKey}`,
        {
          kicker: entry.category.replace(/-/g, ' ').toUpperCase(),
          title: entry.name + '.',
          footer: `Last verified ${entry.lastVerified}`,
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
        title: 'Free generators. No upsell.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'contact',
      {
        kicker: 'Contact',
        title: 'hello@strguests.tools',
        footer: 'Bug reports + generator requests welcome',
      },
      fonts,
    ),
  );
  renders.push(
    render(
      'get-the-templates',
      {
        kicker: 'Coming soon',
        title: 'Guest Message Template Pack.',
        footer: '26 hand-written templates · free PDF',
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
