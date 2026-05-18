#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, SITE_IDS } from '@str/catalog';
import { renderEmpireSitemapIndexXml, renderSiteSitemapXml } from '../sitemap-xml.js';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = resolve(__filename, '../../..');
const DEFAULT_OUT = join(PKG_ROOT, 'dist', 'sitemaps');

function main(): void {
  const { catalog } = loadCatalog();
  const outDir = process.env.SEO_SITEMAP_OUT_DIR ?? DEFAULT_OUT;
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'sitemap-index.xml'), renderEmpireSitemapIndexXml(catalog));

  for (const siteId of SITE_IDS) {
    const xml = renderSiteSitemapXml(catalog, siteId);
    writeFileSync(join(outDir, `sitemap-${siteId}.xml`), xml);
  }

  console.log(
    `emitted sitemap-index.xml + ${SITE_IDS.length} per-site sitemaps → ${outDir}`,
  );
  console.log('next: copy sitemap-index.xml to dashboard.thestrledger.com/sitemap.xml');
  console.log('next: submit https://dashboard.thestrledger.com/sitemap.xml to Search Console');
}

main();
