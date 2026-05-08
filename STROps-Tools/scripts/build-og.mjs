#!/usr/bin/env node
/**
 * Satori-based OG image generator for strops.tools.
 *
 * Produces 1200x630 PNGs covering every key route. Run via `pnpm build:og`
 * standalone, or wired into `pnpm build` via the `prebuild` hook so OG
 * images regenerate on every production build.
 *
 * Slug rule (matches src/lib/seo.ts ogImageFor):
 *   '/'                          -> 'index'
 *   '/turnover-scheduler'        -> 'turnover-scheduler'
 *   '/maintenance/'              -> 'maintenance'
 *   '/maintenance/hvac-filter'   -> 'maintenance-hvac-filter'
 *   '/replace/queen-mattress'    -> 'replace-queen-mattress'
 *
 * Outputs:
 *   - public/og/<slug>.png  (Astro picks up at build, copied into dist)
 *
 * Brand: ops-utility green-gray accent on parchment, "STR Ops.tools" wordmark.
 *
 * Pattern adapted from STRGuests-Tools/scripts/build-og.mjs.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const publicDir = path.join(root, 'public', 'og');

// strops.tools brand tokens — inlined (zero TS / Tailwind dep).
// Mirrors src/styles/tokens.css (ops-utility green-gray on parchment).
const BRAND = {
  parchment: '#F6EFE2',
  navy: '#12304E',
  ink: '#2B2B2B',
  ink2: '#555049',
  accent: '#5A7359',     // ops-utility green-gray
  accent700: '#3F5740',
};

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

/**
 * Resolve a font binary URL by querying the Google Fonts CSS API. Hardcoding
 * gstatic /v18/ paths is brittle — Google rotates them. Querying the CSS
 * endpoint (with a Chrome UA so we get woff2 narrow-range, or a default UA
 * for woff) returns the live URL.
 */
async function fontFromGoogleCss(family, weight) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const res = await fetch(cssUrl, {
    headers: {
      // Plain UA -> Google serves woff (Satori-friendly).
      'User-Agent': 'Mozilla/5.0',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch CSS for ${family}@${weight}: ${res.status}`);
  const css = await res.text();
  const match = css.match(/url\((https:\/\/[^)]+\.(?:woff2?|ttf))\)/);
  if (!match) throw new Error(`No font URL found in CSS for ${family}@${weight}`);
  return fetchFont(match[1]);
}

async function loadFonts() {
  const [interSemiBold, interMedium, cormorantMedium] = await Promise.all([
    fontFromGoogleCss('Inter', 600),
    fontFromGoogleCss('Inter', 500),
    fontFromGoogleCss('Cormorant Garamond', 500),
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
                  children: 'STR Ops',
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
  const pubPath = path.join(publicDir, `${slug}.png`);
  await fs.mkdir(path.dirname(pubPath), { recursive: true });
  await fs.writeFile(pubPath, png);
  return slug;
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + '…';
}

async function main() {
  const fonts = await loadFonts();

  const tools = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'tools.json'), 'utf8'));
  const tasks = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'tasks.json'), 'utf8'));
  const items = JSON.parse(await fs.readFile(path.join(root, 'src', 'data', 'items.json'), 'utf8'));

  const renders = [];

  // Default fallback (used by seo.ts ogImageFor when a route doesn't have a per-route png)
  renders.push(
    render(
      'default',
      {
        kicker: 'STR Ops Tools',
        title: 'Free tools for active short-term rental operators.',
        footer: 'Built by The STR Ledger',
      },
      fonts,
    ),
  );

  // Landing (path '/' -> slug 'index')
  renders.push(
    render(
      'index',
      {
        kicker: 'STR Ops Tools',
        title: 'Free tools for active short-term rental operators.',
        footer: '7 tools · 3 free PDFs · no signup',
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
          kicker: t.category === 'supplies' ? 'Free Supply Tool' : 'Free Ops Tool',
          title: truncate(t.name + '.', 60),
          footer: truncate(t.blurb, 80),
        },
        fonts,
      ),
    );
  }

  // 3 lead magnets
  const magnets = [
    { slug: 'cleaner-sop', kicker: 'Free PDF', title: 'STR Cleaner SOP.', footer: 'Printable turnover SOP for cleaning teams' },
    { slug: 'supply-par', kicker: 'Free PDF', title: 'Supply Par-Level Sheet.', footer: 'Linen + consumable par levels per property' },
    { slug: 'maintenance-checklist', kicker: 'Free PDF', title: 'STR Maintenance Checklist.', footer: 'Annual + seasonal recurring tasks' },
  ];
  for (const m of magnets) {
    renders.push(render(m.slug, { kicker: m.kicker, title: m.title, footer: m.footer }, fonts));
  }

  // Site pages
  renders.push(
    render('about', { kicker: 'About', title: 'Free tools, no upsell.', footer: 'Built by The STR Ledger' }, fonts),
  );
  renders.push(
    render('contact', { kicker: 'Contact', title: 'hello@strops.tools', footer: 'Bug reports + tool requests welcome' }, fonts),
  );

  // Programmatic indexes
  renders.push(
    render('maintenance', { kicker: 'Programmatic', title: 'STR maintenance tasks.', footer: '30 recurring tasks · cadence + cost' }, fonts),
  );
  renders.push(
    render('replace', { kicker: 'Programmatic', title: 'STR replacement costs.', footer: '56 items · cost ranges + brand recs' }, fonts),
  );

  // Per-maintenance task (slug 'maintenance-<task>')
  for (const [taskSlug, task] of Object.entries(tasks)) {
    renders.push(
      render(
        `maintenance-${taskSlug}`,
        {
          kicker: 'Maintenance',
          title: truncate(task.name + '.', 60),
          footer: `Cadence: every ${task.cadenceDays} days`,
        },
        fonts,
      ),
    );
  }

  // Per-replacement item (slug 'replace-<item>')
  for (const [itemSlug, item] of Object.entries(items)) {
    const [low, high] = item.costRange;
    renders.push(
      render(
        `replace-${itemSlug}`,
        {
          kicker: 'Replacement Cost',
          title: truncate(item.name + '.', 60),
          footer: `$${low}–$${high} · ${item.lifespanYears}y typical lifespan`,
        },
        fonts,
      ),
    );
  }

  const slugs = await Promise.all(renders);
  console.log(`OG images built: ${slugs.length} files in public/og/`);
}

main().catch((err) => {
  console.error('OG build failed:', err);
  process.exit(1);
});
