import type { FastifyInstance } from 'fastify';
import { GA4_EVENTS, filterBySite, findSite, findTool, loadCatalog, type Catalog, type SiteId } from '@str/catalog';

const SITE_ID_VALUES: ReadonlyArray<SiteId> = [
  'ledger',
  'guests',
  'host',
  'ops',
  'buyers',
  'laws',
  'audit',
  'manuals',
];

function isSiteId(v: string): v is SiteId {
  return SITE_ID_VALUES.includes(v as SiteId);
}

function minify(catalog: Catalog) {
  return {
    schema: 'catalog.v1.min',
    generatedAt: catalog.generatedAt,
    sites: catalog.sites.map((s) => ({ id: s.id, displayName: s.displayName, domain: s.domain })),
    tools: catalog.tools
      .filter((t) => t.status === 'shipped')
      .map((t) => ({
        id: t.id,
        site: t.site,
        slug: t.slug,
        title: t.shortTitle ?? t.title,
        path: t.path,
        category: t.category,
        paidTier: t.paidTier,
      })),
  };
}

export interface RoutesOptions {
  catalog: Catalog;
}

export function registerHealth(app: FastifyInstance): void {
  app.get('/healthz', async () => ({ status: 'ok', version: '0.1.0' }));
}

export function registerCatalogRoutes(app: FastifyInstance, opts: RoutesOptions): void {
  const { catalog } = opts;

  app.get('/v1/catalog', async () => catalog);

  app.get('/v1/catalog/min', async () => minify(catalog));

  app.get('/v1/sites', async () => ({ sites: catalog.sites }));

  app.get<{ Params: { siteId: string } }>('/v1/sites/:siteId', async (req, reply) => {
    if (!isSiteId(req.params.siteId)) {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'unknown site' } });
    }
    const site = findSite(catalog, req.params.siteId);
    if (!site) {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'site not in catalog' } });
    }
    return { site };
  });

  app.get<{ Params: { siteId: string } }>(
    '/v1/sites/:siteId/tools',
    async (req, reply) => {
      if (!isSiteId(req.params.siteId)) {
        return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'unknown site' } });
      }
      const tools = filterBySite(catalog, req.params.siteId);
      return { tools };
    },
  );

  app.get<{
    Querystring: { site?: string; category?: string; status?: string; tier?: string };
  }>('/v1/tools', async (req) => {
    let tools = catalog.tools;
    const { site, category, status, tier } = req.query;
    if (site) tools = tools.filter((t) => t.site === site);
    if (category) tools = tools.filter((t) => t.category === category);
    if (status) tools = tools.filter((t) => t.status === status);
    if (tier) tools = tools.filter((t) => t.paidTier === tier);
    return { tools, count: tools.length };
  });

  app.get<{ Params: { id: string } }>('/v1/tools/:id', async (req, reply) => {
    const tool = findTool(catalog, req.params.id);
    if (!tool) {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'tool not found' } });
    }
    return { tool };
  });

  app.get('/v1/events', async () => ({ events: GA4_EVENTS }));
}

export function reloadCatalog(): Catalog {
  const { catalog } = loadCatalog();
  return catalog;
}
