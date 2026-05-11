#!/usr/bin/env node
/**
 * strledger-sync-stripe-products.mjs
 *
 * Synchronizes thestrledger.com product pages with the Stripe live-import results
 * and the Etsy listing copy. Idempotent — safe to re-run.
 *
 * For each row in `ops/stripe-import-live-results.csv`:
 *   - Locate the matching `copy/etsy-listings/<SKU>-<slug>.md` (or bundles/) file.
 *   - If a product MDX already exists at `STRLedger/src/content/products/<slug>.mdx`,
 *     patch its frontmatter to add/update the Stripe fields (paymentUrl, stripeProductId,
 *     stripePriceId, kind) without touching the rest of the file. Hand-curated copy is preserved.
 *   - Otherwise, generate a new MDX from the Etsy listing's Title + Description sections
 *     plus the Stripe metadata. Generated files use a "Generated 2026-XX-XX from Etsy listing
 *     copy" provenance line so future humans can spot them.
 *
 * Usage:
 *   node scripts/strledger-sync-stripe-products.mjs           # patch existing, create missing
 *   node scripts/strledger-sync-stripe-products.mjs --force   # also rewrite generated files
 *   node scripts/strledger-sync-stripe-products.mjs --dry     # report intent only
 *
 * Slug strategy: lowercase SKU (e.g. "TAX-001" → slug "tax-001"). Matches the existing
 * acq-001-str-deal-analyzer.mdx pattern but uses the shorter SKU form because the Stripe
 * payment-link layer keys on SKU, not the long-form slug — keeps the two systems aligned.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STRLEDGER_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(STRLEDGER_ROOT, '..');
const CSV_PATH = path.join(REPO_ROOT, 'ops', 'stripe-import-live-results.csv');
const ETSY_DIR = path.join(REPO_ROOT, 'copy', 'etsy-listings');
const BUNDLE_DIR = path.join(ETSY_DIR, 'bundles');
const PRODUCTS_DIR = path.join(STRLEDGER_ROOT, 'src', 'content', 'products');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FORCE = args.includes('--force');
const GENERATED_MARKER = '{/* generated:strledger-sync-stripe-products */}';

function log(...a) { console.log(...a); }
function err(...a) { console.error(...a); }

// ---------- CSV parse ----------

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',');
  return lines.map((line) => {
    // Naive comma split — our CSV doesn't quote strings; names that contain commas
    // (e.g. "STR Deal Analyzer, Lite") aren't present in this dataset (verified at import time).
    const cells = line.split(',');
    const row = {};
    for (let i = 0; i < header.length; i++) row[header[i]] = cells[i];
    return row;
  });
}

// ---------- Etsy listing parser ----------

/**
 * Locates the Etsy listing markdown file for a given SKU. Filenames are SKU-<slug>.md so
 * a prefix match is sufficient. Bundles live in bundles/ subdirectory.
 */
function findEtsyListing(sku, kind) {
  const dir = kind === 'bundle' ? BUNDLE_DIR : ETSY_DIR;
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir);
  const match = entries.find((f) => f.startsWith(sku + '-') && f.endsWith('.md'));
  return match ? path.join(dir, match) : null;
}

/**
 * Pulls the ## Description section content out of an Etsy listing markdown file.
 * Etsy listings are formatted as:
 *
 *     ## Description
 *     ```
 *     <body copy with separators like ═══>
 *     ```
 *
 * We strip the code fence and the decorative separator lines, leaving readable prose.
 */
function extractDescriptionBody(mdText) {
  const i = mdText.indexOf('## Description');
  if (i < 0) return null;
  const after = mdText.slice(i + '## Description'.length);
  const nextH = after.search(/\n## /);
  const section = nextH > 0 ? after.slice(0, nextH) : after;
  const fenceMatch = section.match(/```([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1] : section;
  // Drop decorative separators and trailing trim.
  return raw
    .split('\n')
    .filter((l) => !/^[═━─\-]{4,}$/.test(l.trim()))
    .join('\n')
    .trim();
}

/**
 * Splits the Etsy description body into a 1–2 sentence lead and a "what's included" bullet list.
 * The Etsy format follows a predictable pattern: lead paragraphs → "WHAT'S INCLUDED" header →
 * bullet list → optional FAQ-ish trailing prose. We grab the lead as the meta-description and
 * the bullet block as `inside[]`.
 */
function parseEtsyBody(body) {
  if (!body) return { lead: '', inside: [] };

  const upperBreak = body.search(/\n[A-Z][A-Z\s]{3,}\n/);
  const lead = (upperBreak > 0 ? body.slice(0, upperBreak) : body).trim();

  // Pull bullet-style lines from the rest. Etsy markdown uses '- ' or '• ' bullets.
  const tail = upperBreak > 0 ? body.slice(upperBreak) : '';
  const inside = tail
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[\-•]\s+\S/.test(l))
    .map((l) => l.replace(/^[\-•]\s+/, '').trim())
    .filter((l) => l.length > 0 && l.length < 220);

  return { lead: lead.replace(/\s+/g, ' ').trim(), inside };
}

/**
 * SEO meta-description must be a single line, ≤ 200 chars, no trailing decoration.
 */
function buildShortDescription(lead, fallback) {
  const text = (lead || fallback || '').replace(/\s+/g, ' ').trim();
  if (!text) return fallback;
  if (text.length <= 195) return text;
  // Cut at last sentence end before 195.
  const cut = text.slice(0, 195);
  const lastDot = cut.lastIndexOf('.');
  return (lastDot > 80 ? cut.slice(0, lastDot + 1) : cut).trim();
}

// ---------- MDX frontmatter ops ----------

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, text) {
  if (DRY) return;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text, 'utf8');
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { keys: {}, body: text };
  const keys = {};
  for (const line of m[1].split('\n')) {
    const km = line.match(/^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (!km) continue;
    keys[km[1]] = km[2];
  }
  return { keys, body: m[2], raw: m[1] };
}

/**
 * Patches an existing MDX file's frontmatter — only adds/updates the keys provided in `updates`,
 * leaves everything else (including hand-authored copy, FAQs, etc.) untouched.
 */
function patchMdxFrontmatter(filePath, updates) {
  const original = readFile(filePath);
  const m = original.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    err(`  SKIP (no frontmatter): ${filePath}`);
    return { changed: false };
  }
  let fm = m[1];
  const body = m[2];
  let changed = false;

  for (const [key, value] of Object.entries(updates)) {
    const formatted = formatFrontmatterValue(value);
    const re = new RegExp(`^(${key}):\\s*.*$`, 'm');
    if (re.test(fm)) {
      const current = fm.match(re)[0];
      const next = `${key}: ${formatted}`;
      if (current !== next) {
        fm = fm.replace(re, next);
        changed = true;
      }
    } else {
      fm = fm.trimEnd() + `\n${key}: ${formatted}`;
      changed = true;
    }
  }

  if (changed) writeFile(filePath, `---\n${fm.trimEnd()}\n---\n${body}`);
  return { changed };
}

function formatFrontmatterValue(v) {
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'string') {
    if (/^[A-Za-z0-9._\-:/?&=%+]+$/.test(v) && !v.includes(' ')) return v;
    return `"${v.replace(/"/g, '\\"')}"`;
  }
  return JSON.stringify(v);
}

/**
 * Builds a fresh MDX file for a SKU that doesn't have one yet. Uses parsed Etsy copy when
 * available, falls back to neutral defaults otherwise.
 */
function buildNewMdx({ row, etsyText }) {
  const sku = row.sku;
  const slug = sku.toLowerCase();
  const name = row.name;
  const price = Number(row.price_usd);
  const kind = row.kind;
  const paymentUrl = row.payment_url;

  let lead = '';
  let inside = [];
  if (etsyText) {
    const desc = extractDescriptionBody(etsyText);
    if (desc) {
      const parsed = parseEtsyBody(desc);
      lead = parsed.lead;
      inside = parsed.inside.slice(0, 12);
    }
  }
  const description = buildShortDescription(
    lead,
    `${name} — for short-term rental operators. Editable Excel template with an Audit-Defense how-to PDF. Instant download.`,
  );

  const category = kind === 'bundle'
    ? 'Bundle'
    : (sku.startsWith('TAX') ? 'Tax & Accounting'
      : sku.startsWith('FIN') ? 'Finance'
      : sku.startsWith('OPS') ? 'Operations'
      : sku.startsWith('ACQ') ? 'Acquisition'
      : sku.startsWith('GST') ? 'Guest Experience'
      : sku.startsWith('REV') ? 'Revenue'
      : sku.startsWith('MKT') ? 'Marketing'
      : sku.startsWith('LGL') ? 'Legal & Compliance'
      : sku.startsWith('PAM') ? 'Property Management'
      : sku.startsWith('STR') ? 'Strategy'
      : sku.startsWith('SPC') ? 'Specialty'
      : 'Workbook');

  const pitchLine = (lead.split('. ')[0] || description).replace(/\s+/g, ' ').trim();

  // Wrap each item in double quotes so YAML never interprets internal colons as a mapping.
  const insideBlock = inside.length
    ? inside.map((it) => `  - "${jsonStringSafe(it)}"`).join('\n')
    : '';

  const generated = new Date().toISOString().slice(0, 10);

  const lines = [
    '---',
    `title: ${formatFrontmatterValue(name)}`,
    `slug: ${formatFrontmatterValue(sku)}`,
    `sku: ${formatFrontmatterValue(sku)}`,
    `description: ${formatFrontmatterValue(description)}`,
    `price: ${price}`,
    `paymentUrl: ${formatFrontmatterValue(paymentUrl)}`,
    `stripeProductId: ${formatFrontmatterValue(row.product_id)}`,
    `stripePriceId: ${formatFrontmatterValue(row.price_id)}`,
    `kind: ${kind}`,
    `category: ${formatFrontmatterValue(category)}`,
    pitchLine ? `pitch: ${formatFrontmatterValue(pitchLine)}` : null,
    inside.length ? 'inside:' : null,
    inside.length ? insideBlock : null,
    '---',
    '',
    GENERATED_MARKER,
    '',
    `_Generated ${generated} from \`copy/etsy-listings/${sku}-*.md\`. Edit freely — re-running the sync only patches the Stripe fields (\`paymentUrl\`, \`stripeProductId\`, \`stripePriceId\`), not your hand-edits below this marker._`,
    '',
    // Escape `<` so MDX doesn't try to parse "<7 nights" or "<5%" as JSX/HTML tags.
    (lead || description).replace(/</g, '&lt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;'),
    '',
  ].filter((l) => l !== null);

  return lines.join('\n');
}

function jsonStringSafe(s) {
  return s.replace(/"/g, '\\"');
}

/**
 * Builds a SKU → file-path map from existing product MDX files. We match existing files by
 * the `sku:` frontmatter field, NOT by filename. This lets hand-curated files use long-form
 * filenames (e.g. `tax-001-mileage-log.mdx`) while generated files use short SKU filenames
 * (e.g. `bundle-04.mdx`) — both coexist without duplicates.
 */
function buildSkuIndex() {
  if (!fs.existsSync(PRODUCTS_DIR)) return {};
  const out = {};
  for (const name of fs.readdirSync(PRODUCTS_DIR)) {
    if (!name.endsWith('.mdx')) continue;
    const p = path.join(PRODUCTS_DIR, name);
    const txt = readFile(p);
    const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    const skuMatch = m[1].match(/^sku:\s*"?([^"\r\n]+?)"?\s*$/m);
    if (skuMatch) out[skuMatch[1].trim()] = p;
  }
  return out;
}

// ---------- Main ----------

(function main() {
  if (!fs.existsSync(CSV_PATH)) {
    err(`ERROR: ${CSV_PATH} not found. Run the Stripe bulk-import first.`);
    process.exit(1);
  }

  const rows = parseCsv(readFile(CSV_PATH));
  log(`Loaded ${rows.length} rows from ${path.relative(REPO_ROOT, CSV_PATH)}.\n`);

  if (DRY) log('(dry run — no files will be written)\n');

  const existingBySku = buildSkuIndex();
  log(`Found ${Object.keys(existingBySku).length} existing MDX files matched by frontmatter sku field.\n`);

  let patched = 0, created = 0, regenerated = 0, missingEtsy = 0;

  for (const row of rows) {
    const sku = row.sku;
    if (!sku) continue;

    const existingPath = existingBySku[sku];
    const slug = sku.toLowerCase();
    const filePath = existingPath ?? path.join(PRODUCTS_DIR, `${slug}.mdx`);
    const fileName = path.basename(filePath);

    const updates = {
      paymentUrl: row.payment_url,
      stripeProductId: row.product_id,
      stripePriceId: row.price_id,
      kind: row.kind,
    };

    if (existingPath) {
      const current = readFile(filePath);
      const isGenerated = current.includes(GENERATED_MARKER);

      if (isGenerated && FORCE) {
        // Regenerate from scratch — only safe for files we created.
        const etsyPath = findEtsyListing(sku, row.kind);
        const etsyText = etsyPath ? readFile(etsyPath) : null;
        if (!etsyText) missingEtsy++;
        writeFile(filePath, buildNewMdx({ row, etsyText }));
        regenerated++;
        log(`  regen   ${fileName}`);
      } else {
        // Patch frontmatter only — preserve hand-edits.
        const { changed } = patchMdxFrontmatter(filePath, updates);
        if (changed) {
          patched++;
          log(`  patched ${fileName}`);
        } else {
          log(`  skip    ${fileName} (already in sync)`);
        }
      }
    } else {
      const etsyPath = findEtsyListing(sku, row.kind);
      const etsyText = etsyPath ? readFile(etsyPath) : null;
      if (!etsyText) {
        missingEtsy++;
        err(`  WARN    ${sku}: no etsy-listings/<SKU>-*.md found — generating from Stripe metadata only`);
      }
      writeFile(filePath, buildNewMdx({ row, etsyText }));
      created++;
      log(`  created ${fileName}`);
    }
  }

  log('');
  log(`Done. patched=${patched} created=${created} regenerated=${regenerated} missing-etsy-source=${missingEtsy}`);
})();
