#!/usr/bin/env node
/**
 * stripe-bulk-import.mjs — Bulk-import The STR Ledger catalog into Stripe.
 *
 * DRY-RUN BY DEFAULT. No live API calls unless --live is passed.
 *
 * Reads:
 *   - copy/etsy-listings/*.md           (individual SKUs)
 *   - copy/etsy-listings/bundles/*.md   (bundle SKUs)
 *   - templates/_delivery/_bundles/bundles_config.py (canonical bundle list)
 *
 * Excludes:
 *   - copy/etsy-listings/_not-at-launch/*  (intentionally held back)
 *   - shop-policies / shop-about / seo-research / hero-magnet (non-product)
 *
 * Usage:
 *   node scripts/stripe-bulk-import.mjs                 # dry-run (default)
 *   node scripts/stripe-bulk-import.mjs --filter GST    # only SKUs starting with GST
 *   node scripts/stripe-bulk-import.mjs --live          # actually call Stripe API
 *
 * Env (loaded from STRManuals/site/.env via dotenv):
 *   STRIPE_SECRET — required for --live. Never echoed.
 *
 * Output:
 *   ops/stripe-import-preview.csv — preview CSV (every run, dry or live)
 *
 * Statement descriptor: "STR LEDGER"
 * Metadata on every Product: { sku, kind, source: "bulk-import-v1" }
 * Idempotency key on every API call: derived from SKU code.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ---------- CLI ----------

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const filterIdx = args.indexOf('--filter');
const FILTER = filterIdx >= 0 ? args[filterIdx + 1] : null;
const DRY_RUN = !LIVE;

// ---------- Paths ----------

const LISTINGS_DIR = path.join(REPO_ROOT, 'copy', 'etsy-listings');
const BUNDLES_DIR = path.join(LISTINGS_DIR, 'bundles');
const BUNDLES_CONFIG_PY = path.join(
  REPO_ROOT,
  'templates',
  '_delivery',
  '_bundles',
  'bundles_config.py',
);
const ENV_PATH = path.join(REPO_ROOT, 'STRManuals', 'site', '.env');
const PREVIEW_CSV = path.join(REPO_ROOT, 'ops', 'stripe-import-preview.csv');

// Non-product files in copy/etsy-listings/ (sit alongside SKU files)
const SKIP_BASENAMES = new Set([
  'seo-research.md',
  'shop-about.md',
  'shop-policies.md',
  'hero-magnet.md',
]);

// ---------- Helpers ----------

const log = (...m) => console.log(...m);
const warn = (...m) => console.warn(...m);
const err = (...m) => console.error(...m);

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

/**
 * Parse the own-site price from a `**Pricing:**` line.
 * Formats observed:
 *   $17 Etsy · $17 own-site
 *   $27 Etsy · $47 Gumroad · $97 ...        (no explicit "own-site" → use Gumroad)
 *   $47 own-site · No Etsy Lite             (own-site only)
 *   $47 own-site · (Etsy listing optional — same price)
 *   $97 Etsy · $97 own-site (à la carte ...)
 *   $27 Etsy (Lite) · $47 own-site (Full)
 *   $27 Etsy Lite · $47 own-site Full · $97 Multi-Property Master
 * Strategy:
 *   1. Find token matching `$<num> own-site` → return that.
 *   2. Else find `$<num> Gumroad` → return that (TAX-002 case).
 *   3. Else return null (caller skips).
 */
function parsePrice(pricingLine) {
  // Strip leading "**Pricing:**"
  const body = pricingLine.replace(/^\*\*Pricing:\*\*\s*/, '');
  // Match $NUM followed by some words until ·, ;, ( or end
  const re = /\$(\d+)\s+([^·;()]*)/g;
  const tokens = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    tokens.push({ price: parseInt(m[1], 10), label: m[2].trim().toLowerCase() });
  }
  // Prefer own-site token
  const ownSite = tokens.find((t) => /own-site/.test(t.label));
  if (ownSite) return ownSite.price;
  // TAX-002 special case: "$27 Etsy · $47 Gumroad · $97 ..." — Gumroad = own-site equivalent
  const gumroad = tokens.find((t) => /gumroad/.test(t.label));
  if (gumroad) return gumroad.price;
  return null;
}

function parseListingFile(filePath) {
  const text = readText(filePath);
  const lines = text.split(/\r?\n/);
  const base = path.basename(filePath, '.md');

  // H1 — first "# " line
  const h1Line = lines.find((l) => l.startsWith('# '));
  let name = h1Line ? h1Line.replace(/^#\s+/, '').trim() : base;
  // Strip "Etsy Listing: " prefix if present
  name = name.replace(/^Etsy Listing:\s*/i, '').trim();
  // Strip trailing parenthetical price like "($97)"
  name = name.replace(/\s*\(\$\d+\)\s*$/, '').trim();

  // Pricing line
  const pricingLine = lines.find((l) => l.startsWith('**Pricing:**'));
  if (!pricingLine) {
    err(`[skip] ${base}: no **Pricing:** line found`);
    return null;
  }
  const price = parsePrice(pricingLine);
  if (price == null) {
    err(`[skip] ${base}: could not parse own-site price from: ${pricingLine}`);
    return null;
  }

  // Description: prefer the first paragraph inside the ```...``` code block
  // that follows the "## Description" heading. That's the marketing copy.
  // Fallback: first non-metadata paragraph after H1.
  let description = '';
  const descHeaderIdx = lines.findIndex((l) => /^##\s+Description\b/i.test(l));
  if (descHeaderIdx >= 0) {
    // Find opening ``` after the heading
    let fenceStart = -1;
    for (let i = descHeaderIdx + 1; i < lines.length; i++) {
      if (lines[i].startsWith('```')) { fenceStart = i; break; }
      if (lines[i].startsWith('## ')) break; // hit next H2 first
    }
    if (fenceStart >= 0) {
      for (let i = fenceStart + 1; i < lines.length; i++) {
        if (lines[i].startsWith('```')) break;
        const t = lines[i].trim();
        if (!t) {
          if (description) break; // end of first paragraph
          continue;
        }
        description = description ? description + ' ' + t : t;
      }
    }
  }
  if (!description) {
    let pastH1 = false;
    for (const line of lines) {
      if (line.startsWith('# ')) { pastH1 = true; continue; }
      if (!pastH1) continue;
      const t = line.trim();
      if (!t) continue;
      if (t.startsWith('**')) continue;
      if (t.startsWith('#')) continue;
      if (t.startsWith('---')) continue;
      if (t.startsWith('```')) continue;
      if (t.startsWith('-') || t.startsWith('*')) continue;
      if (t.startsWith('>')) continue;
      if (/^\d+\.\s/.test(t)) continue; // numbered lists
      description = t;
      break;
    }
  }
  // Trim to 500 chars max for Stripe description field hygiene
  if (description.length > 500) description = description.slice(0, 497) + '...';
  if (!description) description = name;

  // SKU code: take first token before second dash for "ACQ-001-..." style
  const m = base.match(/^([A-Z]+-\d+)/);
  const sku = m ? m[1] : base;

  return {
    sku,
    sourceFile: path.relative(REPO_ROOT, filePath).replace(/\\/g, '/'),
    name,
    description,
    price_cents: price * 100,
    price_usd: price,
  };
}

/**
 * Parse BUNDLES list from bundles_config.py to backfill BUNDLE-04/05 which
 * don't have markdown copy files. Returns [{code, name, price}].
 */
function parseBundlesConfig() {
  const text = readText(BUNDLES_CONFIG_PY);
  const bundles = [];
  // Regex over the BUNDLES list — match each {} block with code/name/price/tagline
  const blockRe = /\{\s*"code":\s*"(BUNDLE-\d+)",\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"tagline":\s*"([^"]+)",\s*"price":\s*(\d+),/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    bundles.push({
      code: m[1],
      slug: m[2],
      name: m[3],
      tagline: m[4],
      price: parseInt(m[5], 10),
    });
  }
  return bundles;
}

// ---------- Catalog build ----------

function buildCatalog() {
  const catalog = [];
  const skipped = [];

  // 1. Individual SKU listings
  const listingFiles = fs
    .readdirSync(LISTINGS_DIR)
    .filter((f) => f.endsWith('.md') && !SKIP_BASENAMES.has(f))
    .map((f) => path.join(LISTINGS_DIR, f));

  // Detect TAX-002 dup: prefer the non-lite file (TAX-002-pl-single-property.md)
  // Skip TAX-002-pl-single-property-lite.md since its SKU code collides.
  const seenSkus = new Set();

  for (const fp of listingFiles) {
    const base = path.basename(fp, '.md');
    // skip explicit -lite duplicate if a non-lite file exists for same SKU
    if (base.endsWith('-lite')) {
      const nonLite = base.replace(/-lite$/, '') + '.md';
      if (fs.existsSync(path.join(LISTINGS_DIR, nonLite))) {
        skipped.push({ file: base, reason: 'duplicate of non-lite variant' });
        continue;
      }
    }
    const parsed = parseListingFile(fp);
    if (!parsed) {
      skipped.push({ file: base, reason: 'parse failure' });
      continue;
    }
    if (seenSkus.has(parsed.sku)) {
      skipped.push({ file: base, reason: `duplicate SKU ${parsed.sku}` });
      continue;
    }
    seenSkus.add(parsed.sku);
    catalog.push({ ...parsed, kind: 'sku' });
  }

  // 2. Bundle copy files (markdown — preferred source)
  const bundleCopyFiles = fs
    .readdirSync(BUNDLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(BUNDLES_DIR, f));

  for (const fp of bundleCopyFiles) {
    const parsed = parseListingFile(fp);
    if (!parsed) {
      skipped.push({ file: path.basename(fp), reason: 'bundle parse failure' });
      continue;
    }
    // SKU for bundles is "BUNDLE-NN"
    const m = path.basename(fp, '.md').match(/^(BUNDLE-\d+)/);
    parsed.sku = m ? m[1] : parsed.sku;
    if (seenSkus.has(parsed.sku)) continue;
    seenSkus.add(parsed.sku);
    catalog.push({ ...parsed, kind: 'bundle' });
  }

  // 3. Backfill bundles from bundles_config.py (BUNDLE-04, BUNDLE-05 lack copy)
  const configBundles = parseBundlesConfig();
  for (const b of configBundles) {
    if (seenSkus.has(b.code)) continue;
    seenSkus.add(b.code);
    catalog.push({
      sku: b.code,
      sourceFile: 'templates/_delivery/_bundles/bundles_config.py',
      name: b.name,
      description: b.tagline,
      price_cents: b.price * 100,
      price_usd: b.price,
      kind: 'bundle',
    });
  }

  return { catalog, skipped };
}

// ---------- CSV writer ----------

function writeCsv(rows) {
  const header = ['sku', 'kind', 'name', 'price_usd', 'price_cents', 'source_file', 'description_preview'];
  const escape = (s) => {
    const v = String(s ?? '');
    if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
    return v;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([
      r.sku,
      r.kind,
      r.name,
      r.price_usd,
      r.price_cents,
      r.sourceFile,
      r.description.slice(0, 160),
    ].map(escape).join(','));
  }
  fs.mkdirSync(path.dirname(PREVIEW_CSV), { recursive: true });
  fs.writeFileSync(PREVIEW_CSV, lines.join('\n') + '\n', 'utf8');
}

// ---------- Env loader (minimal, avoids dotenv dep in dry-run) ----------

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    return {};
  }
  const text = readText(ENV_PATH);
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

// ---------- Stripe live ops ----------

async function liveImport(catalog) {
  const env = { ...loadEnv(), ...process.env };
  const key = env.STRIPE_SECRET;
  if (!key) {
    err('ERROR: STRIPE_SECRET not found in STRManuals/site/.env or environment.');
    process.exit(1);
  }

  let Stripe;
  try {
    Stripe = (await import('stripe')).default;
  } catch (e) {
    err('ERROR: `stripe` package not installed. Run: npm i stripe (in this folder)');
    err('       Then re-run with --live.');
    process.exit(1);
  }

  const stripe = new Stripe(key, {
    apiVersion: '2024-12-18.acacia',
  });

  const results = [];
  for (const item of catalog) {
    log(`[live] ${item.sku} — creating Product...`);
    let product, price, paymentLink;
    try {
      product = await stripe.products.create(
        {
          name: item.name,
          description: item.description,
          metadata: {
            sku: item.sku,
            kind: item.kind,
            source: 'bulk-import-v1',
          },
        },
        { idempotencyKey: `bulk-import-v1:product:${item.sku}` },
      );

      price = await stripe.prices.create(
        {
          product: product.id,
          unit_amount: item.price_cents,
          currency: 'usd',
          metadata: {
            sku: item.sku,
            kind: item.kind,
            source: 'bulk-import-v1',
          },
        },
        { idempotencyKey: `bulk-import-v1:price:${item.sku}` },
      );

      paymentLink = await stripe.paymentLinks.create(
        {
          line_items: [{ price: price.id, quantity: 1 }],
          payment_method_types: ['card'],
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
          metadata: {
            sku: item.sku,
            kind: item.kind,
            source: 'bulk-import-v1',
          },
          payment_intent_data: {
            statement_descriptor: 'STR LEDGER',
            metadata: { sku: item.sku, kind: item.kind },
          },
          after_completion: {
            type: 'redirect',
            redirect: { url: `https://thestrledger.com/thank-you?sku=${encodeURIComponent(item.sku)}` },
          },
        },
        { idempotencyKey: `bulk-import-v1:link:${item.sku}` },
      );

      log(`        product=${product.id} price=${price.id} link=${paymentLink.url}`);
      results.push({ ...item, productId: product.id, priceId: price.id, paymentUrl: paymentLink.url });
    } catch (e) {
      err(`\nFAIL on SKU ${item.sku} (${item.name}): ${e.message}`);
      err('Halting per spec — no further SKUs will be processed.');
      err(`Partial success: ${results.length} of ${catalog.length} imported.`);
      process.exit(2);
    }
  }
  return results;
}

// ---------- Main ----------

async function main() {
  log(`stripe-bulk-import.mjs`);
  log(`  mode:   ${DRY_RUN ? 'DRY-RUN (no API calls)' : 'LIVE (will create Stripe Products + Prices + Payment Links)'}`);
  if (FILTER) log(`  filter: SKU prefix "${FILTER}"`);
  log('');

  const { catalog, skipped } = buildCatalog();
  const filtered = FILTER ? catalog.filter((c) => c.sku.startsWith(FILTER)) : catalog;

  const skuCount = filtered.filter((c) => c.kind === 'sku').length;
  const bundleCount = filtered.filter((c) => c.kind === 'bundle').length;
  const totalGmv = filtered.reduce((s, c) => s + c.price_usd, 0);

  log(`Parsed catalog:`);
  log(`  SKUs:    ${skuCount}`);
  log(`  Bundles: ${bundleCount}`);
  log(`  Total:   ${filtered.length} items`);
  log(`  GMV @ own-site prices (sum, not weighted): $${totalGmv}`);
  if (skipped.length) {
    log(`  Skipped: ${skipped.length}`);
    for (const s of skipped) log(`    - ${s.file}: ${s.reason}`);
  }
  log('');

  // Always write preview CSV
  writeCsv(filtered);
  log(`Wrote preview CSV: ${path.relative(REPO_ROOT, PREVIEW_CSV).replace(/\\/g, '/')}`);
  log('');

  if (DRY_RUN) {
    log(`Planned actions (first 20 shown):`);
    for (const item of filtered.slice(0, 20)) {
      log(`  Would create Product "${item.name}" [sku=${item.sku}, kind=${item.kind}] at $${item.price_usd}`);
    }
    if (filtered.length > 20) log(`  ... and ${filtered.length - 20} more`);
    log('');
    log('Dry run complete. To execute, re-run with --live.');
    return;
  }

  // LIVE
  log('--- LIVE MODE — calling Stripe API ---');
  const results = await liveImport(filtered);
  log('');
  log(`Done. Created ${results.length} products + prices + payment links.`);

  // Rewrite preview CSV with live IDs appended
  const livePath = path.join(REPO_ROOT, 'ops', 'stripe-import-live-results.csv');
  const header = ['sku', 'kind', 'name', 'price_usd', 'product_id', 'price_id', 'payment_url'];
  const escape = (s) => {
    const v = String(s ?? '');
    if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
    return v;
  };
  const lines = [header.join(',')];
  for (const r of results) {
    lines.push([r.sku, r.kind, r.name, r.price_usd, r.productId, r.priceId, r.paymentUrl].map(escape).join(','));
  }
  fs.writeFileSync(livePath, lines.join('\n') + '\n', 'utf8');
  log(`Wrote live results: ${path.relative(REPO_ROOT, livePath).replace(/\\/g, '/')}`);
}

main().catch((e) => {
  err(e.stack || String(e));
  process.exit(1);
});
