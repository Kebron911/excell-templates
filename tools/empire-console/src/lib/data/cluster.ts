import { stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

export interface SiteStatus {
  id: string;
  name: string;
  hasDist: boolean;
  lastBuiltAt: string | null;     // ISO
  ageHours: number | null;
  fileCount: number | null;
  status: 'ok' | 'stale' | 'unbuilt';
}

const STALE_HOURS = 72;

export async function readClusterStatus(): Promise<SiteStatus[]> {
  return Promise.all(paths.sites.map(readSite));
}

async function readSite(site: { id: string; name: string; dir: string }): Promise<SiteStatus> {
  const distDir = join(site.dir, 'dist');
  let st;
  try {
    st = await stat(distDir);
  } catch {
    return {
      id: site.id, name: site.name, hasDist: false,
      lastBuiltAt: null, ageHours: null, fileCount: null, status: 'unbuilt',
    };
  }
  if (!st.isDirectory()) {
    return {
      id: site.id, name: site.name, hasDist: false,
      lastBuiltAt: null, ageHours: null, fileCount: null, status: 'unbuilt',
    };
  }
  const ageHours = (Date.now() - st.mtimeMs) / 3_600_000;
  let fileCount: number | null = null;
  try {
    fileCount = (await readdir(distDir)).length;
  } catch { /* ignore */ }
  return {
    id: site.id,
    name: site.name,
    hasDist: true,
    lastBuiltAt: st.mtime.toISOString(),
    ageHours,
    fileCount,
    status: ageHours > STALE_HOURS ? 'stale' : 'ok',
  };
}
