#!/usr/bin/env node
/**
 * etsy-bulk-publish-listings.mjs — Build Etsy listing payloads from copy/etsy-listings/*.md.
 *
 * DRY-RUN BY DEFAULT. Live publishing requires Etsy app to be out of "Pending Personal Approval"
 * and ETSY_ACCESS_TOKEN to be present and unexpired. The --live flag is currently STUBBED —
 * it prints a NotImplemented warning. Live mode lands once we've manually verified one listing
 * end-to-end (image upload + digital file attach are multi-step and Etsy API rejects oddly
 * when fields are missing).
 *
 * Outputs:
 *   ops/etsy-publish-preview.csv    — one row per SKU with field lengths + parse warnings
 *   ops/etsy-publish-payloads.json  — full Etsy API payloads keyed by SKU
 *
 * Usage:
 *   node --env-file=".env" scripts/etsy-bulk-publish-listings.mjs                  # dry-run all
 *   node --env-file=".env" scripts/etsy-bulk-publish-listings.mjs --filter GST     # only GST SKUs
 *   node --env-file=".env" scripts/etsy-bulk-publish-listings.mjs --wave 1         # Wave-1 only
 *
 * Env required:
 *   ETSY_SHOP_ID  (8-digit shop id — currently 65957104)
 *
 * Env optional (for future --live):
 *   ETSY_API_KEY
 *   ETSY_ACCESS_TOKEN
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// ---------- CLI ----------

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const filterIdx = args.indexOf('--filter');
const FILTER = filterIdx >= 0 ? args[filterIdx + 1] : null;
const waveIdx = args.indexOf('--wave');
const WAVE = waveIdx >= 0 ? args[waveIdx + 1] : null;

// Wave-1 SKUs per docs/superpowers/plans/2026-04-22-first-5-etsy-products-plan.md
const WAVE_1 = new Set(['GST-001', 'OPS-001', 'TAX-001', 'TAX-002', 'TAX-003']);

// ---------- Paths ----------

const LISTINGS_DIR = path.join(REPO_ROOT, 'copy', 'etsy-listings');
const PREVIEW_CSV = path.join(REPO_ROOT, 'ops', 'etsy-publish-preview.csv');
const PAYLOADS_JSON = path.join(REPO_ROOT, 'ops', 'etsy-publish-payloads.json');

// Non-product files in copy/etsy-listings/
const SKIP_BASENAMES = new Set([
  'seo-research.md',
  'shop-about.md',
  'shop-policies.md',
  'hero-magnet.md',
]);

// Etsy v3 taxonomy IDs — "Other Digital Downloads → Business & Office Supplies"
// (single value used for all listings until we differentiate categories later)
const DEFAULT_TAXONOMY_ID = 6800; // Digital Prints — confirmed-stable placeholder; update post-approval

// ---------- Helpers ----------

const log = (...m) => console.log(...m);
const warn = (...m) => console.warn(...m);
const err = (...m) => console.error(...m);

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

/**
 * Pricing line forms (see stripe-bulk-import.mjs for the full catalog of variants).
 * For Etsy we want the Etsy price specifically — not own-site.
 */
function parseEtsyPrice(pricingLine) {
  const body = pricingLine.replace(/^\*\*Pricing:\*\*\s*/, '');
  const re = /\$(\d+)\s+([^·;()]*)/g;
  const tokens = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    tokens.push({ price: parseInt(m[1], 10), label: m[2].trim().toLowerCase() });
  }
  // Prefer explicit Etsy token
  const etsy = tokens.find((t) => /^etsy/.test(t.label) && !/lite/.test(t.label));
  if (etsy) return etsy.price;
  // Etsy Lite variant (TAX-002 has "$27 Etsy Lite · $47 own-site Full")
  const etsyLite = tokens.find((t) => /etsy/.test(t.label));
  if (etsyLite) return etsyLite.price;
  return null;
}

function extractCodeBlockAfterHeading(lines, headingRegex) {
  const headingIdx = lines.findIndex((l) => headingRegex.test(l));
  if (headingIdx < 0) return null;
  let fenceStart = -1;
  for (let i = headingIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith('```')) { fenceStart = i; break; }
    if (lines[i].startsWith('## ')) break;
  }
  if (fenceStart < 0) return null;
  const body = [];
  for (let i = fenceStart + 1; i < lines.length; i++) {
    if (lines[i].startsWith('```')) break;
    body.push(lines[i]);
  }
  return body.join('\n').trim();
}

function extractTags(lines) {
  const headingIdx = lines.findIndex((l) => /^##\s+Tags\b/i.test(l));
  if (headingIdx < 0) return [];
  const tags = [];
  for (let i = headingIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break;
    const m = lines[i].match(/^\d+\.\s+`([^`]+)`/);
    if (m) tags.push(m[1].trim());
    if (tags.length === 13) break;
  }
  return tags;
}

function parseListingFile(filePath) {
  const text = readText(filePath);
  const lines = text.split(/\r?\n/);
  const base = path.basename(filePath, '.md');
  const warnings = [];

  // H1 → product name
  const h1 = lines.find((l) => l.startsWith('# '));
  let name = h1 ? h1.replace(/^#\s+/, '').replace(/^Etsy Listing:\s*/i, '').trim() : base;

  // Pricing
  const pricingLine = lines.find((l) => l.startsWith('**Pricing:**'));
  if (!pricingLine) {
    return { skip: true, reason: 'no **Pricing:** line', sku: base };
  }
  const price = parseEtsyPrice(pricingLine);
  if (price == null) {
    return { skip: true, reason: `cannot parse Etsy price from "${pricingLine}"`, sku: base };
  }

  // Title (from "## Title" section's code block)
  const title = extractCodeBlockAfterHeading(lines, /^##\s+Title\b/i);
  if (!title) warnings.push('no title code block found');
  if (title && title.length > 140) warnings.push(`title ${title.length} chars > Etsy 140 max`);

  // Description
  const description = extractCodeBlockAfterHeading(lines, /^##\s+Description\b/i);
  if (!description) warnings.push('no description code block found');
  if (description && description.length > 5000) warnings.push(`description ${description.length} > 5000 max`);

  // Tags
  const tags = extractTags(lines);
  if (tags.length === 0) warnings.push('no tags found');
  if (tags.length > 13) warnings.push(`${tags.length} tags > 13 max`);
  const tooLong = tags.filter((t) => t.length > 20);
  if (tooLong.length) warnings.push(`tags > 20 chars: ${tooLong.join(', ')}`);

  // SKU code
  const m = base.match(/^([A-Z]+-\d+)/);
  const sku = m ? m[1] : base;

  // Etsy v3 listing payload
  const payload = {
    quantity: 999,
    title: title || name,
    description: description || name,
    price,
    who_made: 'i_did',
    when_made: 'made_to_order',
    taxonomy_id: DEFAULT_TAXONOMY_ID,
    type: 'download', // digital
    is_supply: false,
    state: 'draft', // start as draft — flip to active manually after thumbnail + file upload
    tags,
    is_customizable: false,
    is_personalizable: false,
    should_auto_renew: false,
  };

  return {
    sku,
    sourceFile: path.relative(REPO_ROOT, filePath).replace(/\\/g, '/'),
    name,
    title,
    description_chars: description?.length || 0,
    tag_count: tags.length,
    price,
    warnings,
    payload,
  };
}

// ---------- catalog build ----------

function buildCatalog() {
  const files = fs
    .readdirSync(LISTINGS_DIR)
    .filter((f) => f.endsWith('.md') && !SKIP_BASENAMES.has(f))
    .map((f) => path.join(LISTINGS_DIR, f));

  const parsed = [];
  const skipped = [];
  const seenSkus = new Set();
  // Sort so non-"-lite" wins on SKU collision (mirrors stripe-bulk-import.mjs convention).
  files.sort((a, b) => {
    const aLite = /-lite\.md$/.test(a);
    const bLite = /-lite\.md$/.test(b);
    if (aLite !== bLite) return aLite ? 1 : -1;
    return a.localeCompare(b);
  });
  for (const fp of files) {
    const r = parseListingFile(fp);
    if (r.skip) {
      skipped.push(r);
      continue;
    }
    if (seenSkus.has(r.sku)) {
      skipped.push({ skip: true, reason: `duplicate SKU (preferred file already used)`, sku: r.sku, sourceFile: path.relative(REPO_ROOT, fp).replace(/\\/g, '/') });
      continue;
    }
    if (FILTER && !r.sku.startsWith(FILTER)) continue;
    if (WAVE === '1' && !WAVE_1.has(r.sku)) continue;
    seenSkus.add(r.sku);
    parsed.push(r);
  }
  return { parsed, skipped };
}

function escapeCsv(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writePreviewCsv(rows) {
  const header = ['sku', 'name', 'price_usd', 'title_chars', 'desc_chars', 'tag_count', 'warnings', 'source'];
  const out = [header.join(',')];
  for (const r of rows) {
    out.push([
      r.sku,
      escapeCsv(r.name),
      r.price,
      r.title?.length || 0,
      r.description_chars,
      r.tag_count,
      escapeCsv(r.warnings.join('; ')),
      r.sourceFile,
    ].join(','));
  }
  fs.mkdirSync(path.dirname(PREVIEW_CSV), { recursive: true });
  fs.writeFileSync(PREVIEW_CSV, out.join('\n') + '\n', 'utf8');
}

function writePayloadsJson(rows) {
  const obj = {};
  for (const r of rows) obj[r.sku] = r.payload;
  fs.mkdirSync(path.dirname(PAYLOADS_JSON), { recursive: true });
  fs.writeFileSync(PAYLOADS_JSON, JSON.stringify(obj, null, 2), 'utf8');
}

// ---------- main ----------

(async () => {
  log('--- Etsy bulk-publish listings ---');
  log(`Mode:    ${LIVE ? 'LIVE (NOT IMPLEMENTED)' : 'DRY-RUN'}`);
  log(`Filter:  ${FILTER || '(none)'}`);
  log(`Wave:    ${WAVE || '(all)'}`);
  log('');

  const { parsed, skipped } = buildCatalog();

  log(`Parsed ${parsed.length} listings, skipped ${skipped.length}.`);
  for (const s of skipped) warn(`  [skip] ${s.sku}: ${s.reason}`);
  log('');

  const withWarnings = parsed.filter((r) => r.warnings.length);
  if (withWarnings.length) {
    log(`${withWarnings.length} listings have warnings:`);
    for (const r of withWarnings) {
      warn(`  [${r.sku}] ${r.warnings.join('; ')}`);
    }
    log('');
  }

  writePreviewCsv(parsed);
  writePayloadsJson(parsed);

  log(`Preview CSV:  ${path.relative(REPO_ROOT, PREVIEW_CSV)}`);
  log(`Payloads:     ${path.relative(REPO_ROOT, PAYLOADS_JSON)}`);

  if (LIVE) {
    log('');
    err('--live is NOT IMPLEMENTED yet. Live publishing requires:');
    err('  1. Etsy app approved (out of Pending Personal Approval)');
    err('  2. OAuth bootstrap run → ETSY_ACCESS_TOKEN in env');
    err('  3. Manual verification of one end-to-end listing creation');
    err('     (POST listing draft → POST image → POST digital file → PUT activate)');
    err('  4. Add the multi-step orchestration here.');
    process.exit(2);
  }

  log('');
  log('--- DRY-RUN COMPLETE ---');
  log(`Total catalog value (Etsy prices): $${parsed.reduce((a, b) => a + b.price, 0)}`);
})().catch((e) => {
  err('FAILED:', e.message);
  process.exit(1);
});
