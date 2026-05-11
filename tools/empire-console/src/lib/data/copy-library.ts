import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Browse the copy/ tree — Etsy listings, email sequences, blog drafts,
 * Pinterest, FB, atomization decks, product pages, lead magnets.
 */

export interface CopyAsset {
  path: string;       // relative to repo root
  category: string;   // top-level dir under copy/
  name: string;
  size: number;
  mtime: string;
  excerpt: string;    // first 150 chars
}

export interface CopyReport {
  assets: CopyAsset[];
  byCategory: Record<string, CopyAsset[]>;
  total: number;
  totalBytes: number;
  recentlyTouched: CopyAsset[]; // last 10 by mtime
}

const COPY_DIR = join(paths.root, 'copy');

async function* walk(dir: string, depth = 0): AsyncGenerator<string> {
  if (depth > 4) return;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full, depth + 1);
    else if (e.isFile() && /\.(md|txt|html)$/i.test(e.name)) yield full;
  }
}

export async function readCopyLibrary(): Promise<CopyReport> {
  const assets: CopyAsset[] = [];
  for await (const full of walk(COPY_DIR)) {
    const rel = full.slice(paths.root.length + 1).replace(/\\/g, '/');
    const segments = rel.split('/');
    const category = segments[1] ?? 'uncategorized';
    const name = segments[segments.length - 1];
    let st;
    try { st = await stat(full); } catch { continue; }
    let raw = '';
    try { raw = await readFile(full, 'utf8'); } catch { /* skip */ }
    const excerpt = raw.replace(/[#*`>\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
    assets.push({
      path: rel, category, name, size: st.size,
      mtime: st.mtime.toISOString(), excerpt,
    });
  }

  assets.sort((a, b) => a.path.localeCompare(b.path));
  const byCategory: Record<string, CopyAsset[]> = {};
  for (const a of assets) (byCategory[a.category] ??= []).push(a);
  const recentlyTouched = [...assets].sort((a, b) =>
    new Date(b.mtime).getTime() - new Date(a.mtime).getTime()
  ).slice(0, 10);

  return {
    assets, byCategory, total: assets.length,
    totalBytes: assets.reduce((s, a) => s + a.size, 0),
    recentlyTouched,
  };
}
