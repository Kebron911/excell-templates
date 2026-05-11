import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { paths } from '../paths.js';

export type AssetType =
  | 'lead-magnet' | 'tool' | 'document'
  | 'brand-asset' | 'email-template' | 'page';

export interface AssetCommon {
  id: string;
  name: string;
  type: AssetType;
  status?: string;
  owner?: string;
  last_updated?: string | null;
  /** Free-form additional fields kept verbatim for type-specific rendering. */
  raw: Record<string, unknown>;
}

export interface AssetReport {
  byType: Record<AssetType, AssetCommon[]>;
  totals: Record<AssetType, number>;
  grandTotal: number;
  staleCount: number;
}

import { STALE_DAYS } from './staleness.js';

async function loadList(path: string, listKey: string): Promise<Array<Record<string, unknown>>> {
  try {
    const raw = await readFile(path, 'utf8');
    const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
    const list = data[listKey];
    return Array.isArray(list) ? (list as Array<Record<string, unknown>>) : [];
  } catch { return []; }
}

function adapt(type: AssetType, raw: Record<string, unknown>): AssetCommon {
  return {
    id:           String(raw.id ?? raw.name ?? 'unknown'),
    name:         String(raw.name ?? raw.id ?? 'unknown'),
    type,
    status:       typeof raw.status === 'string' ? raw.status : undefined,
    owner:        typeof raw.owner === 'string' ? raw.owner : undefined,
    last_updated: typeof raw.last_updated === 'string' ? raw.last_updated : null,
    raw,
  };
}

function isStale(lastUpdated: string | null | undefined): boolean {
  if (!lastUpdated) return true;
  const d = new Date(lastUpdated).getTime();
  if (Number.isNaN(d)) return true;
  return (Date.now() - d) / 86_400_000 > STALE_DAYS.asset;
}

export async function readAssets(): Promise<AssetReport> {
  const [magnets, tools, docs, brand, email, pages] = await Promise.all([
    loadList(paths.assets.leadMagnets,    'magnets'),
    loadList(paths.assets.tools,          'tools'),
    loadList(paths.assets.documents,      'documents'),
    loadList(paths.assets.brandAssets,    'assets'),
    loadList(paths.assets.emailTemplates, 'templates'),
    loadList(paths.assets.pages,          'pages'),
  ]);

  const byType: Record<AssetType, AssetCommon[]> = {
    'lead-magnet':    magnets.map((m) => adapt('lead-magnet',    m)),
    'tool':           tools.map((t)   => adapt('tool',            t)),
    'document':       docs.map((d)    => adapt('document',        d)),
    'brand-asset':    brand.map((a)   => adapt('brand-asset',     a)),
    'email-template': email.map((e)   => adapt('email-template',  e)),
    'page':           pages.map((p)   => adapt('page',            p)),
  };

  const totals = Object.fromEntries(
    Object.entries(byType).map(([k, v]) => [k, v.length])
  ) as Record<AssetType, number>;
  const grandTotal = Object.values(totals).reduce((s, n) => s + n, 0);
  const staleCount = Object.values(byType)
    .flat()
    .filter((a) => isStale(a.last_updated))
    .length;

  return { byType, totals, grandTotal, staleCount };
}

export async function readAssetsByType(type: AssetType): Promise<AssetCommon[]> {
  const report = await readAssets();
  return report.byType[type] ?? [];
}

export { isStale };
