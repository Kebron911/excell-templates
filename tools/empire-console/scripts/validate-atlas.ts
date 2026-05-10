#!/usr/bin/env tsx
/**
 * pnpm validate:atlas
 *
 * Walks src/pages/ to enumerate available routes, then asserts every
 * `kind: internal` URL in ops/atlas.yaml resolves to a real route file.
 * Catches broken Atlas links from renamed/deleted pages.
 */

import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { readAtlas } from '../src/lib/data/atlas.js';
import { paths } from '../src/lib/paths.js';

const PAGES_DIR = join(paths.root, 'tools', 'empire-console', 'src', 'pages');

/** Walk pages dir and produce the set of valid route paths. */
async function discoverRoutes(): Promise<Set<string>> {
  const routes = new Set<string>();
  async function walk(dir: string) {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); }
    catch { return; }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.astro')) {
        const rel = relative(PAGES_DIR, full).replace(/\\/g, '/');
        // Astro: /index.astro → /, /foo.astro → /foo, /foo/index.astro → /foo, /foo/[bar].astro → dynamic
        let route = '/' + rel.replace(/\.astro$/, '');
        route = route.replace(/\/index$/, '');
        if (route === '') route = '/';
        // Dynamic [param] routes match any value at that segment; we'll handle separately
        routes.add(route);
      }
    }
  }
  await walk(PAGES_DIR);
  return routes;
}

function routeMatches(target: string, available: Set<string>): boolean {
  if (available.has(target)) return true;
  // Try dynamic match: replace each path segment with [param]
  const segments = target.split('/');
  for (const candidate of available) {
    const candSegs = candidate.split('/');
    if (candSegs.length !== segments.length) continue;
    let match = true;
    for (let i = 0; i < segments.length; i++) {
      if (candSegs[i].startsWith('[') && candSegs[i].endsWith(']')) continue;
      if (candSegs[i] !== segments[i]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

async function main() {
  console.log('validate-atlas · cross-referencing ops/atlas.yaml against src/pages/…');
  console.log('');

  const [routes, atlas] = await Promise.all([
    discoverRoutes(),
    readAtlas(),
  ]);

  const broken: { name: string; url: string; section: string }[] = [];
  let internalCount = 0;

  for (const section of atlas.sections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        if (item.kind !== 'internal') continue;
        // Strip query string + hash for route matching
        const url = item.url.split('?')[0].split('#')[0];
        // Anchors-only or empty URLs we skip
        if (!url || url.startsWith('#')) continue;
        internalCount++;
        if (!routeMatches(url, routes)) {
          broken.push({ name: item.name, url, section: section.label });
        }
      }
    }
  }

  console.log(`Routes discovered: ${routes.size}`);
  console.log(`Internal Atlas entries: ${internalCount}`);
  console.log(`Broken: ${broken.length}`);
  console.log('');

  if (broken.length > 0) {
    console.log('Broken Atlas links:');
    for (const b of broken) {
      console.log(`  ✗ "${b.name}" → ${b.url}   [section: ${b.section}]`);
    }
    process.exit(1);
  }

  console.log('All Atlas internal links resolve to real routes.');
}

main().catch((err) => {
  console.error('validate-atlas crashed:', err);
  process.exit(2);
});
