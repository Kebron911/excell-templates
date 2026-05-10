import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Per-SKU version + release tracking. Each SKU's _delivery/<sku>/VERSION
 * file holds the current shipped version. PROGRESS §P8.1 specs the
 * W-update workflow that bumps version + emails prior buyers.
 */

export interface SkuVersion {
  sku: string;
  versionFile: string | null;
  version: string | null;
  releaseNotesPath: string | null;
  lastBumped: string | null;
}

export interface ReleasesReport {
  versions: SkuVersion[];
  totalWithVersion: number;
  totalMissingVersion: number;
}

const DELIVERY_DIR = join(paths.templates, '_delivery');

async function listSafe(p: string): Promise<string[]> {
  try { return await readdir(p); } catch { return []; }
}

export async function readReleases(): Promise<ReleasesReport> {
  const versions: SkuVersion[] = [];
  const folders = await listSafe(DELIVERY_DIR);

  for (const folder of folders) {
    if (folder.startsWith('_')) continue; // _bundles, _shared
    const m = folder.match(/^([A-Z]{3}-\d{3})/);
    if (!m) continue;
    const sku = m[1];
    const folderPath = join(DELIVERY_DIR, folder);
    const versionPath = join(folderPath, 'VERSION');
    const notesPath = join(folderPath, 'release-notes.md');

    let version: string | null = null;
    let lastBumped: string | null = null;
    try {
      const raw = await readFile(versionPath, 'utf8');
      version = raw.trim();
      const s = await stat(versionPath);
      lastBumped = s.mtime.toISOString();
    } catch { /* no VERSION file */ }

    let notesExists = false;
    try { await stat(notesPath); notesExists = true; } catch { /* */ }

    versions.push({
      sku,
      versionFile: version
        ? versionPath.slice(paths.root.length + 1).replace(/\\/g, '/')
        : null,
      version,
      releaseNotesPath: notesExists
        ? notesPath.slice(paths.root.length + 1).replace(/\\/g, '/')
        : null,
      lastBumped,
    });
  }

  versions.sort((a, b) => a.sku.localeCompare(b.sku));
  return {
    versions,
    totalWithVersion: versions.filter((v) => v.version).length,
    totalMissingVersion: versions.filter((v) => !v.version).length,
  };
}
