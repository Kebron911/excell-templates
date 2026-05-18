import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import {
  CatalogSchema,
  SiteSchema,
  ToolSchema,
  type Catalog,
  type Site,
  type SiteId,
  type Tool,
} from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = resolve(__filename, '../..');
export const DEFAULT_DATA_DIR = join(PKG_ROOT, 'data');

export interface LoadOptions {
  dataDir?: string;
}

export interface LoadResult {
  catalog: Catalog;
  warnings: string[];
}

function readJson<T>(path: string, schema: z.ZodType<T>, label: string): T {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf-8');
  } catch (err) {
    throw new Error(`${label}: failed to read ${path}: ${(err as Error).message}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`${label}: invalid JSON in ${path}: ${(err as Error).message}`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `${label}: schema validation failed for ${path}\n${result.error.issues
        .map((i) => `  · ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }
  return result.data;
}

function listJsonFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...listJsonFiles(full));
    } else if (name.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

export function loadCatalog(opts: LoadOptions = {}): LoadResult {
  const dataDir = opts.dataDir ?? DEFAULT_DATA_DIR;
  const sitesPath = join(dataDir, 'sites.json');
  const toolsDir = join(dataDir, 'tools');

  const sites = readJson(sitesPath, z.array(SiteSchema), 'sites.json');
  const siteIds = new Set<SiteId>(sites.map((s) => s.id));

  const toolFiles = listJsonFiles(toolsDir);
  const tools: Tool[] = toolFiles.map((f) => readJson(f, ToolSchema, `tool ${f}`));

  const warnings: string[] = [];

  const ids = new Set<string>();
  for (const t of tools) {
    if (ids.has(t.id)) {
      throw new Error(`duplicate tool id: ${t.id}`);
    }
    ids.add(t.id);
    if (!siteIds.has(t.site)) {
      throw new Error(`tool ${t.id} references unknown site "${t.site}"`);
    }
    const expectedId = `${t.site}.${t.slug}`;
    if (t.id !== expectedId) {
      throw new Error(`tool ${t.id} expected id "${expectedId}" (site + slug)`);
    }
  }

  const slugBySite = new Map<string, Set<string>>();
  for (const t of tools) {
    const set = slugBySite.get(t.site) ?? new Set();
    if (set.has(t.slug)) {
      throw new Error(`duplicate slug "${t.slug}" within site "${t.site}"`);
    }
    set.add(t.slug);
    slugBySite.set(t.site, set);
  }

  for (const t of tools) {
    for (const ref of [...t.related, ...t.upsells]) {
      if (!ids.has(ref)) {
        warnings.push(`tool ${t.id} references unknown tool "${ref}"`);
      }
    }
  }

  const catalog: Catalog = {
    schema: 'catalog.v1',
    generatedAt: new Date().toISOString(),
    sites,
    tools,
  };

  const validated = CatalogSchema.parse(catalog);
  return { catalog: validated, warnings };
}

export function filterBySite(catalog: Catalog, site: SiteId): Tool[] {
  return catalog.tools.filter((t) => t.site === site);
}

export function findTool(catalog: Catalog, id: string): Tool | undefined {
  return catalog.tools.find((t) => t.id === id);
}

export function findSite(catalog: Catalog, id: SiteId): Site | undefined {
  return catalog.sites.find((s) => s.id === id);
}
