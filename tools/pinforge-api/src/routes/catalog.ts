import type { FastifyInstance } from "fastify";
import { listBrandIds, loadBrandKit, listTemplates } from "@str/pinforge";

export interface CatalogRoutesDeps {
  brandsDir: string;
}

export function registerCatalogRoutes(app: FastifyInstance, deps: CatalogRoutesDeps): void {
  app.get(
    "/v1/brands",
    {
      schema: {
        tags: ["catalog"],
        summary: "List all available brand IDs with public fields",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                brandId: { type: "string" },
                displayName: { type: "string" },
                domain: { type: "string" },
                defaults: { type: "object" }
              }
            }
          }
        }
      }
    },
    async (_req, reply) => {
      const ids = await listBrandIds(deps.brandsDir);
      const brands = await Promise.all(
        ids.map(async (brandId) => {
          const kit = await loadBrandKit(brandId, deps.brandsDir);
          return {
            brandId: kit.brandId,
            displayName: kit.displayName,
            domain: kit.domain,
            defaults: kit.defaults
          };
        })
      );
      return reply.code(200).send(brands);
    }
  );

  app.get(
    "/v1/templates",
    {
      schema: {
        tags: ["catalog"],
        summary: "List all registered pin templates",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                description: { type: "string" }
              }
            }
          }
        }
      }
    },
    async (_req, reply) => {
      const templates = listTemplates().map((t) => ({
        id: t.id,
        displayName: t.displayName,
        supports: t.supports,
        dimensions: t.dimensions
      }));
      return reply.code(200).send(templates);
    }
  );
}
