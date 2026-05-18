#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../loader.js';
import { SITE_IDS, type Catalog, type Tool } from '../schema.js';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = resolve(__filename, '../../..');
const DEFAULT_OUT = join(PKG_ROOT, 'dist', 'emitted');

interface MinTool {
  id: string;
  site: string;
  slug: string;
  title: string;
  path: string;
  category: string;
  paidTier: string;
  status: string;
}

function toMin(t: Tool): MinTool {
  return {
    id: t.id,
    site: t.site,
    slug: t.slug,
    title: t.shortTitle ?? t.title,
    path: t.path,
    category: t.category,
    paidTier: t.paidTier,
    status: t.status,
  };
}

function emit(catalog: Catalog, outDir: string): void {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(outDir, 'tools-by-site'), { recursive: true });

  writeFileSync(join(outDir, 'catalog.json'), JSON.stringify(catalog, null, 2));

  const min = {
    schema: 'catalog.v1.min',
    generatedAt: catalog.generatedAt,
    sites: catalog.sites.map((s) => ({ id: s.id, displayName: s.displayName, domain: s.domain })),
    tools: catalog.tools.filter((t) => t.status === 'shipped').map(toMin),
  };
  writeFileSync(join(outDir, 'catalog.min.json'), JSON.stringify(min));

  for (const site of SITE_IDS) {
    const slice = catalog.tools.filter((t) => t.site === site);
    writeFileSync(
      join(outDir, 'tools-by-site', `${site}.json`),
      JSON.stringify(slice, null, 2),
    );
  }
}

function main(): void {
  try {
    const { catalog, warnings } = loadCatalog();
    const outDir = process.env.CATALOG_OUT_DIR ?? DEFAULT_OUT;
    emit(catalog, outDir);
    console.log(`emitted ${catalog.tools.length} tools across ${catalog.sites.length} sites → ${outDir}`);
    if (warnings.length > 0) {
      console.log(`warnings: ${warnings.length}`);
      for (const w of warnings) console.log(`  · ${w}`);
    }
  } catch (err) {
    console.error(`emit failed: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
