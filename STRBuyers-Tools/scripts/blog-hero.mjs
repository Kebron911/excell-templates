#!/usr/bin/env node
/**
 * blog-hero.mjs — Generate a hero image for an Astro/MDX blog post via Gemini 2.5 Flash Image.
 *
 * What it does:
 *   1. Reads frontmatter from the .mdx (title, description, keyword, category).
 *   2. Calls Gemini directly to generate a 16:9 editorial image.
 *   3. Resizes to 3 WebP variants (hero 1200x630, thumb 600x315, social 1080x1080).
 *   4. Writes them to <site>/public/images/blog/<slug>/{hero,thumb,social}.webp
 *   5. Patches the .mdx frontmatter to add `heroImage` and `heroAlt`.
 *
 * Usage:
 *   node blog-hero.mjs <path-to-mdx> [--force] [--dry-run]
 *   pnpm hero -- src/content/posts/my-post.mdx
 *
 * Env (looked up in order):
 *   1. process.env.GEMINI_API_KEY
 *   2. <repo-root>/.env  (key=GEMINI_API_KEY)
 *
 * Repo root = first ancestor containing `pnpm-workspace.yaml` or `.git`.
 *
 * Requires Node 18+ (uses global fetch) and `sharp` (already a STR site dep).
 */

import { promises as fs } from 'node:fs';
import { join, resolve, dirname, basename, isAbsolute } from 'node:path';
import sharp from 'sharp';

// ─── arg parse ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY = args.includes('--dry-run');
const mdxArg = args.find(a => !a.startsWith('--'));
if (!mdxArg) {
  console.error('usage: blog-hero <path-to-mdx> [--force] [--dry-run]');
  process.exit(2);
}

const mdxPath = isAbsolute(mdxArg) ? mdxArg : resolve(process.cwd(), mdxArg);
const exists = await fs.stat(mdxPath).then(s => s.isFile()).catch(() => false);
if (!exists) { console.error(`not a file: ${mdxPath}`); process.exit(2); }

// ─── locate site root + repo root ──────────────────────────────────────────
const siteRoot = await findUp(mdxPath, ['astro.config.mjs', 'astro.config.ts']);
if (!siteRoot) { console.error('no astro.config found above mdx — is this an Astro site?'); process.exit(2); }
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
  const envPath = join(repoRoot, '.env');
  const env = await fs.readFile(envPath, 'utf8').catch(() => '');
  const m = env.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
  if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
}
if (!apiKey && !DRY) {
  console.error(`GEMINI_API_KEY not found. Add it to ${repoRoot}/.env (no quotes) or export it.`);
  console.error(`Get a key: https://aistudio.google.com/apikey`);
  process.exit(2);
}

// ─── parse + validate frontmatter ──────────────────────────────────────────
const raw = await fs.readFile(mdxPath, 'utf8');
const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!fmMatch) { console.error('no frontmatter block found'); process.exit(2); }
const fmText = fmMatch[1];

const getField = (key) => {
  const re = new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, 'm');
  const m = fmText.match(re);
  return m ? m[1] : '';
};

const fm = {
  title:       getField('title'),
  description: getField('description'),
  keyword:     getField('keyword') || getField('primaryKeyword'),
  category:    getField('category'),
  heroImage:   getField('heroImage'),
};

if (!fm.title) { console.error('frontmatter missing `title`'); process.exit(2); }
if (fm.heroImage && !FORCE) {
  console.log(`heroImage already set: ${fm.heroImage}`);
  console.log(`pass --force to regenerate.`);
  process.exit(0);
}

// ─── build prompt + alt ────────────────────────────────────────────────────
const slug = basename(mdxPath).replace(/\.(mdx|md)$/i, '');
const prompt = [
  `Create a wide horizontal blog header image (16:9, 1792x1008) for an article titled "${fm.title}".`,
  '',
  `Subject / scene: ${fm.description || fm.title}.`,
  `Keyword context: ${fm.keyword || fm.title}.`,
  `Style: modern, editorial photography, soft natural window light, shallow depth of field, slight film grain, warm neutrals with one accent color, professional blog header aesthetic.`,
  '',
  'Strict requirements:',
  '- No text, no letters, no numbers, no logos, no watermarks.',
  '- Composition leaves negative space on the left third for a headline overlay.',
  '- One clear focal subject. No collages or split panels.',
  '- Photorealistic unless the topic is inherently abstract.',
  '- Crisp focus, balanced exposure, color-graded for web (sRGB).',
].join('\n');

const altText = `${fm.title}${fm.keyword ? ` — illustration about ${fm.keyword}` : ''}`.slice(0, 125);

const outDir = join(siteRoot, 'public', 'images', 'blog', slug);
const heroPath = `/images/blog/${slug}/hero.webp`;

console.log(`Site:  ${siteRoot}`);
console.log(`Post:  ${slug}`);
console.log(`Out:   ${outDir}`);
console.log(`Alt:   ${altText}`);

if (DRY) {
  console.log('\n--- prompt ---\n' + prompt + '\n--- end ---\n');
  console.log('(--dry-run set; not calling Gemini)');
  process.exit(0);
}

// ─── call Gemini ───────────────────────────────────────────────────────────
// Stable image-gen model. Override with GEMINI_IMAGE_MODEL to try gemini-3.1-flash-image-preview etc.
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const body = {
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  generationConfig: { responseModalities: ['IMAGE'], temperature: 0.85 },
};

const t0 = Date.now();
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
  body: JSON.stringify(body),
});
if (!res.ok) {
  const errText = await res.text();
  console.error(`Gemini HTTP ${res.status}:`);
  console.error(errText.slice(0, 1500));
  process.exit(1);
}
const data = await res.json();
const parts = data?.candidates?.[0]?.content?.parts || [];
const imgPart = parts.find(p => p.inlineData || p.inline_data);
if (!imgPart) {
  console.error('Gemini returned no image. Response:');
  console.error(JSON.stringify(data).slice(0, 1500));
  process.exit(1);
}
const inline = imgPart.inlineData || imgPart.inline_data;
const srcBuf = Buffer.from(inline.data, 'base64');
console.log(`✓ Gemini ${(Date.now() - t0) / 1000}s, ${srcBuf.length} bytes`);

// ─── resize → 3 variants ───────────────────────────────────────────────────
await fs.mkdir(outDir, { recursive: true });
await Promise.all([
  sharp(srcBuf).resize(1200, 630,  { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(join(outDir, 'hero.webp')),
  sharp(srcBuf).resize(600,  315,  { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toFile(join(outDir, 'thumb.webp')),
  sharp(srcBuf).resize(1080, 1080, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(join(outDir, 'social.webp')),
]);
console.log(`✓ wrote 3 variants to ${outDir}`);

// ─── patch frontmatter ─────────────────────────────────────────────────────
function patchFrontmatter(content, updates) {
  return content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (full, inner) => {
    let next = inner;
    for (const [k, v] of Object.entries(updates)) {
      const line = `${k}: "${v}"`;
      const re = new RegExp(`^${k}:\\s*.*$`, 'm');
      if (re.test(next)) {
        next = next.replace(re, line);
      } else {
        // insert before relatedTools (if present) else at end
        if (/^relatedTools:/m.test(next)) {
          next = next.replace(/^relatedTools:/m, `${line}\nrelatedTools:`);
        } else {
          next = next.replace(/\s*$/, '') + `\n${line}`;
        }
      }
    }
    return `---\n${next}\n---`;
  });
}

const patched = patchFrontmatter(raw, { heroImage: heroPath, heroAlt: altText });
await fs.writeFile(mdxPath, patched, 'utf8');
console.log(`✓ patched frontmatter (heroImage, heroAlt)`);
console.log(`\nDone. Run \`pnpm dev\` and visit /blog/${slug} to verify.`);
