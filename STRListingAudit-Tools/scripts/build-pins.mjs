#!/usr/bin/env node
/**
 * Pinterest pin generator — 1000×1500 portrait PNGs.
 *
 * Renders pins for the landing page + each blog post. Pins are written to:
 *   - dist/pins/<slug>.png
 *   - public/pins/<slug>.png
 *
 * Consumed by PinterestPinButton-style affordances (post-launch) and by manual
 * Pinterest scheduling. Pinterest's `media=` intent parameter prefers tall
 * 2:3 aspect; that's why this script is separate from build-og.mjs.
 *
 * Skips silently on font-CDN failure — non-blocking.
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

const BRAND = {
  parchment: '#F6EFE2',
  navy: '#12304E',
  ink2: '#555049',
  accent: '#0E7C8C',
  accent700: '#075B68',
};

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts() {
  const [interSemiBold, cormorantMedium] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff'),
    fetchFont(
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5/files/cormorant-garamond-latin-500-normal.woff',
    ),
  ]);
  return [
    { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
    { name: 'Cormorant', data: cormorantMedium, weight: 500, style: 'normal' },
  ];
}

function pinTree({ kicker, title, footer }) {
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
        {
          type: 'div',
          props: {
            style: {
              fontSize: 24,
              letterSpacing: 7,
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
              fontSize: 100,
              fontWeight: 500,
              lineHeight: 1.05,
              color: BRAND.navy,
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: BRAND.accent700,
            },
            children: footer ?? 'listingaudit.tools',
          },
        },
      ],
    },
  };
}

async function render(slug, opts, fonts) {
  const svg = await satori(pinTree(opts), { width: 1000, height: 1500, fonts });
  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  for (const dir of [distDir, publicDir]) {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${slug}.png`), png);
  }
  return slug;
}

async function main() {
  const fonts = await loadFonts();
  const renders = [];

  renders.push(
    render(
      'index',
      {
        kicker: 'Free listing audit',
        title: 'Score your Airbnb in 30 seconds — see what is costing you bookings.',
        footer: 'listingaudit.tools',
      },
      fonts,
    ),
  );

  // Per-blog-post pin
  const blogDir = path.join(root, 'src', 'content', 'blog');
  let blogFiles = [];
  try {
    blogFiles = (await fs.readdir(blogDir)).filter((f) => f.endsWith('.md'));
  } catch {}
  for (const file of blogFiles) {
    const slug = file.replace(/\.md$/, '');
    const src = await fs.readFile(path.join(blogDir, file), 'utf8');
    const titleMatch = src.match(/^title:\s*"([^"]+)"/m);
    if (!titleMatch) continue;
    renders.push(
      render(
        `blog-${slug}`,
        {
          kicker: 'STR listing playbook',
          title: titleMatch[1],
          footer: 'listingaudit.tools/blog',
        },
        fonts,
      ),
    );
  }

  const slugs = await Promise.all(renders);
  console.log(`Pins built: ${slugs.length} files in dist/pins/ and public/pins/`);
}

main().catch((err) => {
  console.warn('Pin build skipped:', err.message ?? err);
  process.exit(0);
});
