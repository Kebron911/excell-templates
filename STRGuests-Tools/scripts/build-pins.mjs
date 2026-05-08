#!/usr/bin/env node
/**
 * Satori-based Pinterest pin generator. Produces 1000x1500 vertical PNGs
 * for every generator the site cares about. Wired into `pnpm build`.
 *
 * Outputs to:
 *   - public/pins/<slug>.png  (dev preview at /pins/<slug>.png)
 *   - dist/pins/<slug>.png    (production deploy)
 *
 * Format reasoning: 1000x1500 is the Pinterest-recommended 2:3 aspect for
 * standard pins. Hospitality-warm palette (parchment + terracotta) matches
 * the live brand tokens.
 *
 * Run standalone: pnpm exec node scripts/build-pins.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const distDir = path.join(root, 'dist', 'pins');
const publicDir = path.join(root, 'public', 'pins');

// Brand tokens — kept inline so this script has zero TS / Tailwind dependency.
// Mirrors src/styles/tokens.css (terracotta accent on parchment).
const BRAND = {
  parchment: '#F6EFE2',
  parchmentAlt: '#EFE5D0',
  navy: '#12304E',
  ink: '#2B2B2B',
  ink2: '#555049',
  ink3: '#8A8176',
  accent: '#C8684C',     // terracotta 500
  accent700: '#9C4A30',
};

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts() {
  // Fontsource on jsdelivr — stable CDN, versioned URLs, doesn't drift
  // like rsms.me / fonts.gstatic.com hashes do.
  const [interSemiBold, interMedium, cormorantMedium, cormorantItalic] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-500-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5/files/cormorant-garamond-latin-500-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5/files/cormorant-garamond-latin-500-italic.woff'),
  ]);

  return [
    { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
    { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
    { name: 'Cormorant', data: cormorantMedium, weight: 500, style: 'normal' },
    { name: 'Cormorant', data: cormorantItalic, weight: 500, style: 'italic' },
  ];
}

/**
 * 1000x1500 Pinterest pin layout:
 *   - Top: tool kicker (uppercase, terracotta letterspaced)
 *   - Middle: oversized Cormorant headline
 *   - Below headline: italic tagline (Cormorant italic)
 *   - Footer: STR Guests · tools wordmark + accent rule
 */
function pinTree({ kicker, title, tagline }) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1000,
        height: 1500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '90px 80px',
        background: BRAND.parchment,
        fontFamily: 'Inter',
      },
      children: [
        // Top: kicker
        {
          type: 'div',
          props: {
            style: {
              fontSize: 28,
              letterSpacing: 8,
              color: BRAND.accent,
              textTransform: 'uppercase',
              fontWeight: 600,
            },
            children: kicker,
          },
        },
        // Middle: title + tagline + accent rule
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Cormorant',
                    fontSize: 124,
                    fontWeight: 500,
                    lineHeight: 1.02,
                    color: BRAND.navy,
                    maxWidth: 840,
                  },
                  children: title,
                },
              },
              ...(tagline
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 80,
                          height: 3,
                          background: BRAND.accent,
                          marginTop: 36,
                          marginBottom: 28,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Cormorant',
                          fontStyle: 'italic',
                          fontSize: 36,
                          color: BRAND.ink2,
                          maxWidth: 760,
                          lineHeight: 1.3,
                        },
                        children: tagline,
                      },
                    },
                  ]
                : []),
            ],
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
                    fontSize: 44,
                    color: BRAND.accent700,
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
                    fontSize: 18,
                    letterSpacing: 5,
                    textTransform: 'uppercase',
                    color: BRAND.ink2,
                  },
                  children: [
                    { type: 'span', props: { style: { color: BRAND.accent }, children: '.' } },
                    { type: 'span', props: { children: 'tools' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function render(slug, opts, fonts) {
  const svg = await satori(pinTree(opts), { width: 1000, height: 1500, fonts });
  const png = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
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

  const tools = JSON.parse(
    await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'),
  );

  const renders = [];

  // Per-generator pin (one per tool).
  for (const [slug, tool] of Object.entries(tools)) {
    renders.push(
      render(
        slug,
        {
          kicker: tool.kind === 'pdf' ? 'Free PDF Generator' : 'Free AI Generator',
          title: tool.name,
          tagline: tool.tagline,
        },
        fonts,
      ),
    );
  }

  // Landing pin
  renders.push(
    render(
      'index',
      {
        kicker: 'STR Guests Tools',
        title: 'Free generators for hosts to delight guests.',
        tagline: 'House rules, welcome books, wifi signs, AI replies — all in your browser.',
      },
      fonts,
    ),
  );

  // Templates library pin
  renders.push(
    render(
      'templates',
      {
        kicker: 'Free Template Library',
        title: 'Airbnb host message templates.',
        tagline: '26 hand-written templates for arrival, problems, cancellations, anniversaries.',
      },
      fonts,
    ),
  );

  const slugs = await Promise.all(renders);
  console.log(`Pinterest pins built: ${slugs.length} files in dist/pins/ and public/pins/`);
}

main().catch((err) => {
  // Pin generation is post-build polish — don't block the deploy on a
  // transient font CDN hiccup or an upstream pin template change.
  console.warn('Pin build skipped:', err.message ?? err);
  process.exit(0);
});
