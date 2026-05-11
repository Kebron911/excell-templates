import { readFile, readdir, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { paths } from '../paths.js';

/**
 * SKU registry — walks templates/_briefs/ for canonical IDs, then
 * cross-references templates/_delivery/<sku>/ + copy/etsy-listings/ +
 * copy/product-pages/ to build a per-SKU view.
 *
 * The 65 SKUs are the actual product. Atlas + manifest_check.py are
 * presence-checks; this gives Daniel an actual browser.
 */

export interface Sku {
  sku: string;                     // e.g. "ACQ-001"
  category: string;                // e.g. "ACQ"
  categoryName: string;            // e.g. "Acquisition"
  slug: string;                    // e.g. "str-deal-analyzer"
  name: string;                    // pulled from brief H1
  briefPath: string | null;        // relative path to brief
  briefDescription: string | null; // first paragraph after H1
  etsyPrice: string | null;        // parsed "$27 (Lite — ...)"
  ownsitePrice: string | null;     // parsed "$47 (Full — ...)"
  wave: string | null;             // "Wave: 3"
  tier: string | null;             // T1/T2/T3
  campaign: string | null;         // tagline
  deliveryPath: string | null;
  deliveryFiles: string[];
  hasDemo: boolean;
  hasBlank: boolean;
  hasHowtoPdf: boolean;
  hasLicensePdf: boolean;
  thumbCount: number;
  hasEtsyCopy: boolean;
  hasProductCopy: boolean;
  etsyCopyPath: string | null;
  productCopyPath: string | null;
  status: 'live' | 'partial' | 'draft';
  lastUpdated: string | null;      // mtime ISO
}

export interface SkuReport {
  skus: Sku[];
  byCategory: Record<string, Sku[]>;
  totals: {
    total: number;
    live: number;
    partial: number;
    draft: number;
    missingEtsy: number;
    missingProduct: number;
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  ACQ: 'Acquisition / Underwriting',
  TAX: 'Tax & Financial',
  FIN: 'Financial Operations',
  OPS: 'Operations',
  PAM: 'Property Asset Management',
  GST: 'Guest Experience',
  SAL: 'Sales / Marketing',
  REV: 'Revenue Management',
  LGL: 'Legal / Compliance',
};

function categoryNameFor(code: string): string {
  return CATEGORY_NAMES[code] ?? code;
}

function parseField(raw: string, label: string): string | null {
  const m = raw.match(new RegExp(`\\*\\*${label}:\\*\\*\\s+(.+)`, 'i'));
  return m ? m[1].trim() : null;
}

async function listSafe(dir: string): Promise<string[]> {
  try { return await readdir(dir); } catch { return []; }
}

async function fileExists(path: string): Promise<boolean> {
  try { await stat(path); return true; } catch { return false; }
}

async function mtimeOf(path: string): Promise<string | null> {
  try { return (await stat(path)).mtime.toISOString(); } catch { return null; }
}

export async function readSkus(): Promise<SkuReport> {
  const briefsDir = join(paths.templates, '_briefs');
  const deliveryDir = join(paths.templates, '_delivery');
  const etsyDir = join(paths.root, 'copy', 'etsy-listings');
  const productDir = join(paths.root, 'copy', 'product-pages');

  const briefFiles = (await listSafe(briefsDir)).filter((f) => f.endsWith('.md'));
  const skus: Sku[] = [];

  for (const briefFile of briefFiles) {
    // ACQ-001-str-deal-analyzer.md → sku=ACQ-001, slug=str-deal-analyzer
    const base = briefFile.replace(/\.md$/, '');
    const m = base.match(/^([A-Z]{3})-(\d{3})(?:-(.*))?$/);
    if (!m) continue;
    const sku = `${m[1]}-${m[2]}`;
    const category = m[1];
    const slug = m[3] ?? '';

    const briefPath = join(briefsDir, briefFile);
    let briefRaw = '';
    try { briefRaw = await readFile(briefPath, 'utf8'); } catch { /* skip */ }
    const titleMatch = briefRaw.match(/^#\s+Brief\s+—\s+\S+\s+(.+)$/m) ||
                       briefRaw.match(/^#\s+(.+)$/m);
    const name = titleMatch ? titleMatch[1].trim() : sku;
    const descMatch = briefRaw.match(/## What this template does\s+\n+([\s\S]+?)\n##/);
    const briefDescription = descMatch
      ? descMatch[1].trim().split('\n').slice(0, 4).join('\n')
      : null;

    const deliveryFolder = `${sku}-${slug}`.replace(/-$/, '');
    const deliveryPath = join(deliveryDir, deliveryFolder);
    const deliveryFiles = await listSafe(deliveryPath);

    const hasDemo = deliveryFiles.some((f) => /demo.*\.xlsx$/i.test(f) || /\bdemo\b/i.test(f));
    const hasBlank = deliveryFiles.some((f) => /blank.*\.xlsx$/i.test(f) || /\bblank\b/i.test(f));
    const hasHowtoPdf = deliveryFiles.some((f) => /howto\.pdf$/i.test(f));
    const hasLicensePdf = deliveryFiles.some((f) => /license\.pdf$/i.test(f));
    const thumbCount = deliveryFiles.filter((f) => /thumb-\d+\.png$/i.test(f)).length;

    const etsyCopyPath = join(etsyDir, briefFile);
    const productCopyPath = join(productDir, briefFile);
    const hasEtsyCopy = await fileExists(etsyCopyPath);
    const hasProductCopy = await fileExists(productCopyPath);

    let status: Sku['status'] = 'live';
    if (!hasHowtoPdf || !hasLicensePdf || thumbCount < 1) status = 'draft';
    else if (!hasEtsyCopy || !hasProductCopy) status = 'partial';

    const lastUpdated = await mtimeOf(briefPath);

    skus.push({
      sku, category, categoryName: categoryNameFor(category), slug, name,
      briefPath: relativeFromRoot(briefPath),
      briefDescription,
      etsyPrice: parseField(briefRaw, 'Etsy price'),
      ownsitePrice: parseField(briefRaw, 'Own-site price'),
      wave: parseField(briefRaw, 'Wave'),
      tier: parseField(briefRaw, 'Tier'),
      campaign: parseField(briefRaw, 'Campaign tagline'),
      deliveryPath: deliveryFiles.length ? relativeFromRoot(deliveryPath) : null,
      deliveryFiles,
      hasDemo, hasBlank, hasHowtoPdf, hasLicensePdf, thumbCount,
      hasEtsyCopy, hasProductCopy,
      etsyCopyPath: hasEtsyCopy ? relativeFromRoot(etsyCopyPath) : null,
      productCopyPath: hasProductCopy ? relativeFromRoot(productCopyPath) : null,
      status, lastUpdated,
    });
  }

  skus.sort((a, b) => a.sku.localeCompare(b.sku));

  const byCategory: Record<string, Sku[]> = {};
  for (const s of skus) {
    (byCategory[s.category] ??= []).push(s);
  }

  return {
    skus,
    byCategory,
    totals: {
      total: skus.length,
      live: skus.filter((s) => s.status === 'live').length,
      partial: skus.filter((s) => s.status === 'partial').length,
      draft: skus.filter((s) => s.status === 'draft').length,
      missingEtsy: skus.filter((s) => !s.hasEtsyCopy).length,
      missingProduct: skus.filter((s) => !s.hasProductCopy).length,
    },
  };
}

export async function readSku(skuId: string): Promise<Sku | null> {
  const report = await readSkus();
  return report.skus.find((s) => s.sku === skuId.toUpperCase()) ?? null;
}

function relativeFromRoot(absPath: string): string {
  return absPath.slice(paths.root.length + 1).replace(/\\/g, '/');
}
