import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { paths } from '../paths.js';
import { readAssets } from './assets.js';
import { readInfrastructure } from './infrastructure.js';
import type { AtlasSection } from './atlas.js';

export interface SiteMetadata {
  id: string;
  name: string;
  role?: string;
  description?: string;
  live_url?: string;
  blog_url?: string;
  domain?: string;
  repo_path?: string;
}

export interface SiteAtlas {
  meta: SiteMetadata;
  local_dev: Record<string, unknown>;
  hosting: Record<string, unknown>;
  ci: Record<string, unknown>;
  sections: AtlasSection[];
  /** Auto-derived sections from cross-referenced YAMLs. */
  derived: AtlasSection[];
  domainStatus: {
    expires?: string | null;
    daysToExpiry?: number | null;
    sslProvider?: string | null;
  };
}

export async function listSites(): Promise<SiteMetadata[]> {
  let entries;
  try { entries = await readdir(paths.atlasSites); }
  catch { return []; }
  const out: SiteMetadata[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.yaml')) continue;
    const meta = await readSiteMeta(entry.replace(/\.yaml$/, ''));
    if (meta) out.push(meta);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function readSiteMeta(siteId: string): Promise<SiteMetadata | null> {
  try {
    const raw = await readFile(join(paths.atlasSites, `${siteId}.yaml`), 'utf8');
    const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
    const site = data.site as SiteMetadata | undefined;
    if (!site || !site.id) return null;
    return site;
  } catch { return null; }
}

export async function readSiteAtlas(siteId: string): Promise<SiteAtlas | null> {
  let raw: string;
  try { raw = await readFile(join(paths.atlasSites, `${siteId}.yaml`), 'utf8'); }
  catch { return null; }
  const data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
  const meta = data.site as SiteMetadata | undefined;
  if (!meta || !meta.id) return null;

  const sections = (data.sections ?? []) as AtlasSection[];
  const local_dev = (data.local_dev ?? {}) as Record<string, unknown>;
  const hosting   = (data.hosting   ?? {}) as Record<string, unknown>;
  const ci        = (data.ci        ?? {}) as Record<string, unknown>;

  // Auto-derive: lead magnets, tools, pages tagged with this site id.
  const assetsReport = await readAssets();
  const leadMagnets = assetsReport.byType['lead-magnet']
    .filter((a) => String(a.raw.site ?? '') === siteId)
    .map((a) => ({
      name: a.name,
      url: typeof a.raw.landing_url === 'string' ? a.raw.landing_url : '',
      kind: 'external' as const,
      note: typeof a.raw.is_tag === 'string' ? `IS tag: ${a.raw.is_tag}` : undefined,
      status: a.status,
    }));
  const tools = assetsReport.byType['tool']
    .filter((a) => String(a.raw.site ?? '') === siteId)
    .map((a) => ({
      name: a.name,
      url: typeof a.raw.url === 'string' ? a.raw.url : '',
      kind: 'external' as const,
      note: [a.raw.tool_type, a.raw.tech].filter(Boolean).join(' · ') || undefined,
      status: a.status,
    }));
  const pages = assetsReport.byType['page']
    .filter((a) => String(a.raw.site ?? '') === siteId)
    .map((a) => ({
      name: a.name,
      url: typeof a.raw.url === 'string' ? a.raw.url : '',
      kind: 'external' as const,
      note: typeof a.raw.conversion_goal === 'string' ? `goal: ${a.raw.conversion_goal}` : undefined,
      status: a.status,
    }));

  const derived: AtlasSection[] = [];
  if (leadMagnets.length) {
    derived.push({ id: 'auto-lead-magnets', label: `Lead magnets on ${meta.name}`, expanded: true,
      groups: [{ label: '', items: leadMagnets }] });
  }
  if (tools.length) {
    derived.push({ id: 'auto-tools', label: `Tools on ${meta.name}`, expanded: true,
      groups: [{ label: '', items: tools }] });
  }
  if (pages.length) {
    derived.push({ id: 'auto-pages', label: `Tracked pages on ${meta.name}`, expanded: true,
      groups: [{ label: '', items: pages }] });
  }

  // Domain status from infrastructure.yaml.
  const infra = await readInfrastructure();
  let domainStatus: SiteAtlas['domainStatus'] = {};
  if (meta.domain) {
    const match = infra.domains.find((d) => d.domain === meta.domain);
    if (match) {
      domainStatus = {
        expires: match.expires ?? null,
        daysToExpiry: match.daysToExpiry,
        sslProvider: match.ssl_provider ?? null,
      };
    }
  }

  return { meta, local_dev, hosting, ci, sections, derived, domainStatus };
}
