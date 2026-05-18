import type { Catalog, Site, SiteId, Tool } from '@str/catalog';
import type { JsonLd } from './jsonld.js';
import {
  buildWebApplication,
  buildItemList,
  buildBreadcrumb,
  buildFAQPage,
  type FaqEntry,
} from './jsonld.js';
import type { SiteConfig } from './site-config.js';

const PUBLISHER_NAME = 'The STR Ledger';
const PUBLISHER_URL = 'https://thestrledger.com';

function siteUrl(site: Site): string {
  return `https://${site.domain}`;
}

function toolAbsoluteUrl(site: Site, tool: Tool): string {
  return `${siteUrl(site)}${tool.path}`;
}

function siteConfigFromCatalog(site: Site): SiteConfig {
  const siteConfigId = mapSiteIdToConfigId(site.id);
  return {
    siteId: siteConfigId,
    brand: {
      name: site.displayName,
      wordmark: site.displayName,
      tagline: site.tagline,
      primaryColor: site.primaryColor,
      logo: '/logo.svg',
    },
    url: {
      canonical: siteUrl(site),
    },
    analytics: {},
    nav: [],
    footer: { sections: [] },
  };
}

function mapSiteIdToConfigId(id: SiteId): SiteConfig['siteId'] {
  switch (id) {
    case 'guests':
      return 'guests';
    case 'host':
      return 'host';
    case 'ops':
      return 'ops';
    case 'buyers':
      return 'buyers';
    default:
      return 'host';
  }
}

export interface CatalogContext {
  catalog: Catalog;
  siteId: SiteId;
}

function requireSite(ctx: CatalogContext): Site {
  const site = ctx.catalog.sites.find((s) => s.id === ctx.siteId);
  if (!site) throw new Error(`unknown site ${ctx.siteId}`);
  return site;
}

function requireTool(ctx: CatalogContext, toolId: string): Tool {
  const tool = ctx.catalog.tools.find((t) => t.id === toolId);
  if (!tool) throw new Error(`unknown tool ${toolId}`);
  if (tool.site !== ctx.siteId) {
    throw new Error(`tool ${toolId} belongs to site "${tool.site}", not "${ctx.siteId}"`);
  }
  return tool;
}

/**
 * Build a WebApplication JSON-LD entirely from the catalog entry —
 * no per-page hardcoded name/description/url.
 */
export function buildWebApplicationFromCatalog(ctx: CatalogContext, toolId: string): JsonLd {
  const tool = requireTool(ctx, toolId);
  const site = requireSite(ctx);
  const cfg = siteConfigFromCatalog(site);
  const applicationCategory = mapCategoryToSchemaCategory(tool.category);
  return buildWebApplication(cfg, {
    name: tool.title,
    description: tool.description,
    toolPath: tool.path,
    applicationCategory,
  });
}

function mapCategoryToSchemaCategory(cat: Tool['category']): string {
  switch (cat) {
    case 'calculator':
    case 'audit':
      return 'FinanceApplication';
    case 'pdf-generator':
    case 'generator':
      return 'BusinessApplication';
    case 'scheduler':
    case 'dashboard':
      return 'BusinessApplication';
    case 'lookup':
    case 'reference':
    case 'guide':
      return 'ReferenceApplication';
    case 'template':
      return 'BusinessApplication';
  }
}

/**
 * Build an ItemList of all shipped tools for a site, suitable for the homepage.
 */
export function buildSiteToolsItemList(ctx: CatalogContext): JsonLd {
  const site = requireSite(ctx);
  const cfg = siteConfigFromCatalog(site);
  const items = ctx.catalog.tools
    .filter((t) => t.site === ctx.siteId && t.status === 'shipped')
    .map((t) => ({ name: t.shortTitle ?? t.title, path: t.path }));
  return buildItemList(cfg, {
    name: `${site.displayName} — tools`,
    description: site.description,
    items,
  });
}

/**
 * Build a 2-step breadcrumb (home → tool) for any catalog tool.
 */
export function buildToolBreadcrumb(ctx: CatalogContext, toolId: string): JsonLd {
  const tool = requireTool(ctx, toolId);
  const site = requireSite(ctx);
  const cfg = siteConfigFromCatalog(site);
  return buildBreadcrumb(cfg, [
    { name: 'Home', url: '/' },
    { name: tool.shortTitle ?? tool.title, url: tool.path },
  ]);
}

/**
 * Convenience to attach FAQs alongside a tool — caller still authors FAQ content
 * (catalog doesn't store FAQs), but this wraps the same builder for consistency.
 */
export function buildToolFaqPage(_ctx: CatalogContext, _toolId: string, faqs: FaqEntry[]): JsonLd {
  return buildFAQPage(faqs);
}

export interface ToolListing {
  tool: Tool;
  url: string;
}

/**
 * Return shipped tools for a site, with absolute URLs ready for sitemaps,
 * cross-site nav, or OG cards.
 */
export function listSiteTools(ctx: CatalogContext): ToolListing[] {
  const site = requireSite(ctx);
  return ctx.catalog.tools
    .filter((t) => t.site === ctx.siteId && t.status === 'shipped')
    .map((t) => ({ tool: t, url: toolAbsoluteUrl(site, t) }));
}

export { PUBLISHER_NAME, PUBLISHER_URL };
