#!/usr/bin/env node
/**
 * Satori-based OG image generator for listingaudit.tools.
 *
 * Outputs 1200x630 PNGs to:
 *   - public/og/<slug>.png  (dev preview at /og/<slug>.png)
 *   - dist/og/<slug>.png    (production deploy)
 *
 * Slug convention (matches @str/ui-chrome Layout.astro ogImageFor):
 *   '/'                       → 'index'
 *   '/about'                  → 'about'
 *   '/blog/<post-slug>'       → 'blog-<post-slug>'
 *   '/audit/cities/<slug>'    → 'audit-cities-<slug>'
 *
 * Wired into `pnpm build` so OG images regenerate on every production build.
 * Skips silently on font-CDN failure — Astro build already succeeded by this point.
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

// Inlined brand tokens — mirrors src/styles/tokens.css (diagnostic teal accent on parchment).
const BRAND = {
  parchment: '#F6EFE2',
  navy: '#12304E',
  ink: '#2B2B2B',
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
  const [interSemiBold, interMedium, cormorantMedium] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff'),
    fetchFont('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-500-normal.woff'),
    fetchFont(
      'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5/files/cormorant-garamond-latin-500-normal.woff',
    ),
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
                  style: { fontFamily: 'Cormorant', fontWeight: 500, fontSize: 36, color: BRAND.accent700 },
                  children: 'Listing Audit',
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
                        style: { marginLeft: 24, fontWeight: 500, fontSize: 16, color: BRAND.ink2 },
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

async function loadCityList() {
  // Read cities.ts via simple regex — same approach strguests uses for blog post metadata.
  // Avoids importing the TS module (would need a TS loader in the script).
  const file = await fs.readFile(path.join(root, 'src', 'data', 'cities.ts'), 'utf8');
  const slugs = [];
  const slugRe = /slug:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?region:\s*'([^']+)'[\s\S]*?hook:\s*'([^']+)'/g;
  let m;
  while ((m = slugRe.exec(file))) {
    slugs.push({ slug: m[1], name: m[2], region: m[3], hook: m[4] });
  }
  return slugs;
}

async function main() {
  const fonts = await loadFonts();
  const renders = [];

  renders.push(
    render(
      'index',
      {
        kicker: 'Free listing audit',
        title: 'Score your Airbnb in 30 seconds.',
        footer: 'Diagnostic tools for STR hosts',
      },
      fonts,
    ),
  );

  renders.push(
    render(
      'about',
      {
        kicker: 'How scoring works',
        title: 'Five dimensions. One rubric. No fluff.',
        footer: 'listingaudit.tools/about',
      },
      fonts,
    ),
  );

  renders.push(
    render(
      'audit-cities',
      {
        kicker: 'Audit by market',
        title: 'Ten cities. One audit pipeline.',
        footer: 'Austin · Nashville · Denver · Asheville · …',
      },
      fonts,
    ),
  );

  const cities = await loadCityList();
  for (const c of cities) {
    renders.push(
      render(
        `audit-cities-${c.slug}`,
        {
          kicker: `${c.name}, ${c.region}`,
          title: `Audit your ${c.name} listing.`,
          footer: c.hook.slice(0, 80),
        },
        fonts,
      ),
    );
  }

  // Blog posts — read frontmatter via regex (cheap, stable schema).
  const blogDir = path.join(root, 'src', 'content', 'blog');
  let blogFiles = [];
  try {
    blogFiles = (await fs.readdir(blogDir)).filter((f) => f.endsWith('.md'));
  } catch {}
  if (blogFiles.length) {
    renders.push(
      render(
        'blog',
        { kicker: 'Playbooks', title: 'Short reads, no fluff.', footer: 'listingaudit.tools/blog' },
        fonts,
      ),
    );
    for (const file of blogFiles) {
      const slug = file.replace(/\.md$/, '');
      const src = await fs.readFile(path.join(blogDir, file), 'utf8');
      const titleMatch = src.match(/^title:\s*"([^"]+)"/m);
      const categoryMatch = src.match(/^category:\s*(\w+)/m);
      const readMatch = src.match(/^readMinutes:\s*(\d+)/m);
      if (!titleMatch) continue;
      const categoryLabel =
        {
          title: 'Title dimension',
          description: 'Description dimension',
          photos: 'Photos dimension',
          amenities: 'Amenities dimension',
          reviews: 'Reviews dimension',
          launch: 'Pre-launch checklist',
        }[categoryMatch?.[1]] ?? 'Playbook';
      renders.push(
        render(
          `blog-${slug}`,
          {
            kicker: categoryLabel,
            title: titleMatch[1],
            footer: readMatch ? `${readMatch[1]} min read · listingaudit.tools/blog` : 'listingaudit.tools/blog',
          },
          fonts,
        ),
      );
    }
  }

  const slugs = await Promise.all(renders);
  console.log(`OG images built: ${slugs.length} files in dist/og/ and public/og/`);
}

main().catch((err) => {
  console.warn('OG build skipped:', err.message ?? err);
  process.exit(0);
});
