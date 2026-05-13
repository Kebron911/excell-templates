#!/usr/bin/env node
/**
 * page-hero.mjs — Generate hero images for landing pages (homepage + tool pages).
 *
 * Reads metadata from `src/data/tools.json` (one entry per tool slug). Generates
 * a 16:9 lifestyle/product hero via Gemini, resizes to 3 WebP variants, writes
 * to `public/images/pages/<slug>/`, and prints a <picture> snippet to paste
 * into the Astro page (placement is bespoke; not auto-patched).
 *
 * Usage:
 *   pnpm page-hero                        # all tools missing a hero
 *   pnpm page-hero -- house-rules-pdf     # one tool slug
 *   pnpm page-hero -- homepage            # the site index hero
 *   pnpm page-hero -- <slug> --force      # overwrite existing
 *   pnpm page-hero -- <slug> --dry-run    # print prompt, skip API call
 *
 * Custom (no entry in tools.json):
 *   pnpm page-hero -- about --title "About" --description "Who built this"
 *
 * Env: GEMINI_API_KEY (looked up in env then in <repo-root>/.env)
 * Env override: GEMINI_IMAGE_MODEL (default: gemini-2.5-flash-image)
 */

import { promises as fs } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY = args.includes('--dry-run');
const slugArg = args.find(a => !a.startsWith('--'));
const titleArg = args[args.indexOf('--title') + 1] !== undefined && args.indexOf('--title') >= 0 ? args[args.indexOf('--title') + 1] : undefined;
const descArg = args[args.indexOf('--description') + 1] !== undefined && args.indexOf('--description') >= 0 ? args[args.indexOf('--description') + 1] : undefined;

const siteRoot = await findUp(process.cwd(), ['astro.config.mjs', 'astro.config.ts']);
if (!siteRoot) { console.error('run from within an Astro site (no astro.config found)'); process.exit(2); }
const repoRoot = await findUp(siteRoot, ['pnpm-workspace.yaml', '.git']);

async function findUp(start, markers) {
  let dir = (await fs.stat(start)).isDirectory() ? start : dirname(start);
  while (true) {
    for (const m of markers) {
      if (await fs.stat(join(dir, m)).then(() => true).catch(() => false)) return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// ─── load API key ──────────────────────────────────────────────────────────
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey && repoRoot) {
  const env = await fs.readFile(join(repoRoot, '.env'), 'utf8').catch(() => '');
  const m = env.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
  if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
}
if (!apiKey && !DRY) {
  console.error(`GEMINI_API_KEY not found. Add to ${repoRoot}/.env`);
  process.exit(2);
}

// ─── load tools.json + site.config ─────────────────────────────────────────
const tools = await fs.readFile(join(siteRoot, 'src/data/tools.json'), 'utf8')
  .then(JSON.parse).catch(() => ({}));

// ─── determine which slugs to process ──────────────────────────────────────
const HOMEPAGE_SLUG = 'homepage';
let targets = [];

if (slugArg === HOMEPAGE_SLUG) {
  targets.push({
    slug: HOMEPAGE_SLUG,
    title: await readSiteTitle(siteRoot),
    description: await readSiteDescription(siteRoot),
    keyword: 'short-term rental tools',
  });
} else if (slugArg && tools[slugArg]) {
  const t = tools[slugArg];
  targets.push(toolToTarget(slugArg, t));
} else if (slugArg && titleArg && descArg) {
  targets.push({ slug: slugArg, title: titleArg, description: descArg, keyword: titleArg });
} else if (slugArg) {
  console.error(`unknown slug "${slugArg}" — not in tools.json, and no --title/--description given.`);
  process.exit(2);
} else {
  // no slug: do all tools (plus homepage if missing)
  for (const [slug, t] of Object.entries(tools)) targets.push(toolToTarget(slug, t));
  targets.unshift({
    slug: HOMEPAGE_SLUG,
    title: await readSiteTitle(siteRoot),
    description: await readSiteDescription(siteRoot),
    keyword: 'short-term rental tools',
  });
}

function toolToTarget(slug, t) {
  const title = t.name || t.title || slug;
  const description = t.tagline || t.blurb || t.description || '';
  return {
    slug,
    title,
    description,
    keyword: (t.primary_keyword || t.primaryKeyword || title).toLowerCase(),
    kind: t.kind,
  };
}

async function readSiteTitle(root) {
  const f = await fs.readFile(join(root, 'src/data/site.config.ts'), 'utf8').catch(() => '');
  const m = f.match(/name\s*:\s*['"`]([^'"`]+)/);
  return m ? m[1] : basename(root);
}
async function readSiteDescription(root) {
  const f = await fs.readFile(join(root, 'src/data/site.config.ts'), 'utf8').catch(() => '');
  const m = f.match(/description\s*:\s*['"`]([^'"`]+)/);
  return m ? m[1] : '';
}

// ─── process each target ───────────────────────────────────────────────────
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

for (const t of targets) {
  const outDir = join(siteRoot, 'public', 'images', 'pages', t.slug);
  const heroFile = join(outDir, 'hero.webp');
  const heroExists = await fs.stat(heroFile).then(() => true).catch(() => false);

  if (heroExists && !FORCE) {
    console.log(`SKIP ${t.slug} (hero exists; pass --force to regenerate)`);
    continue;
  }

  const prompt = buildPrompt(t);
  console.log(`\n--- ${t.slug} ---`);
  console.log(`Title: ${t.title}`);
  console.log(`Out:   ${outDir}`);

  if (DRY) {
    console.log('Prompt:\n' + prompt);
    continue;
  }

  const t0 = Date.now();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'], temperature: 0.85 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  HTTP ${res.status}: ${err.slice(0, 500)}`);
    continue;
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find(p => p.inlineData || p.inline_data);
  if (!imgPart) {
    console.error('  no image in response');
    continue;
  }
  const srcBuf = Buffer.from((imgPart.inlineData || imgPart.inline_data).data, 'base64');
  console.log(`  Gemini ${(Date.now() - t0) / 1000}s, ${srcBuf.length} bytes`);

  await fs.mkdir(outDir, { recursive: true });
  await Promise.all([
    sharp(srcBuf).resize(1200, 630,  { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(join(outDir, 'hero.webp')),
    sharp(srcBuf).resize(600,  315,  { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toFile(join(outDir, 'thumb.webp')),
    sharp(srcBuf).resize(1080, 1080, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(join(outDir, 'social.webp')),
  ]);

  const alt = `${t.title} — ${t.description}`.slice(0, 125);
  console.log(`  ✓ 3 variants written`);
  console.log(`\n  Paste this into the page's hero section:\n`);
  console.log([
    `  <figure class="mx-auto max-w-6xl px-5">`,
    `    <picture>`,
    `      <source media="(min-width: 768px)" srcset="/images/pages/${t.slug}/hero.webp" type="image/webp" />`,
    `      <img`,
    `        src="/images/pages/${t.slug}/thumb.webp"`,
    `        alt="${alt}"`,
    `        width="1200" height="630"`,
    `        loading="eager" decoding="async"`,
    `        class="w-full h-auto rounded-md border border-rule"`,
    `      />`,
    `    </picture>`,
    `  </figure>`,
  ].join('\n'));
}

function buildPrompt(t) {
  const isHomepage = t.slug === 'homepage';
  const isPdf = t.kind === 'pdf';
  const isAi = t.kind === 'ai';

  const sceneByKind = isPdf
    ? `An overhead lifestyle shot of a host preparing a short-term rental: open laptop showing a clean PDF preview, well-lit countertop or desk, hospitality props (welcome book, mug, keys, neutral linens) in tasteful arrangement. Subject context: ${t.description}.`
    : isAi
    ? `A modern editorial scene of a short-term rental host at a laptop or tablet, working calmly in a beautifully staged interior, soft daylight, sense of professional craft. Subject context: ${t.description}.`
    : isHomepage
    ? `A wide editorial shot of a thoughtfully staged short-term rental interior — natural light through large windows, hospitality details (fresh linens, neutral palette, a welcome touch on a table), inviting and aspirational. The brand serves: ${t.description}.`
    : `A modern editorial scene contextually relevant to: ${t.description}.`;

  return [
    `Create a wide horizontal hero image (16:9, 1792x1008) for the landing page of "${t.title}".`,
    '',
    `Scene: ${sceneByKind}`,
    `Style: editorial photography, soft natural window light, shallow depth of field, slight film grain, warm neutrals with one accent color, professional brand-marketing aesthetic. NOT a stock photo.`,
    '',
    'Strict requirements:',
    '- No text, no letters, no numbers, no logos, no watermarks.',
    '- Composition leaves negative space on the left third for headline overlay.',
    '- One clear focal subject. No collages or split panels.',
    '- Photorealistic. Crisp focus, balanced exposure, color-graded for web (sRGB).',
    '- Avoid generic stock-photo cliches (no obvious "businessperson smiling at camera", no stacks of coins).',
  ].join('\n');
}
