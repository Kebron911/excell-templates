import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { generateBatch, PinInputSchema } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import type { ApiEnv } from "../env.js";

export interface BulkRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerBulkRoutes(app: FastifyInstance, deps: BulkRoutesDeps): void {
  const bulkBodySchema = (max: number) =>
    z.object({
      items: z
        .array(PinInputSchema)
        .min(1, "items must contain at least 1 row")
        .max(max, `items cannot exceed ${max}`)
    });

  app.post(
    "/v1/pins/bulk",
    {
      schema: {
        tags: ["pins"],
        summary: "Bulk-generate pins from a JSON array (async)",
        body: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["brandId"],
                properties: {
                  brandId: { type: "string" },
                  topic: { type: "string" },
                  primaryKeyword: { type: "string" },
                  destinationUrl: { type: "string", format: "uri" }
                }
              }
            }
          }
        },
        response: {
          202: {
            type: "object",
            properties: {
              jobId: { type: "string" },
              count: { type: "number" },
              pollUrl: { type: "string" }
            },
            additionalProperties: true
          },
          400: {
            type: "object",
            properties: {
              error: { type: "object", properties: { code: { type: "string" }, message: { type: "string" } } }
            }
          }
        }
      }
    },
    async (req, reply) => {
    const schema = bulkBodySchema(deps.env.bulkMax);
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      reply.code(400).send({
        error: { code: "VALIDATION", message: msg, context: { issues: parsed.error.issues } }
      });
      return;
    }

    const items = parsed.data.items;
    const jobId = createJobId();
    registerJob(jobId, { total: items.length });

    generateBatch(items, {
      env: deps.env.pinforge,
      brandsDir: deps.brandsDir,
      outputDir: deps.outputDir
    })
      .then((result) =>
        completeJob(jobId, [
          ...result.succeeded.map((s) => ({
            ok: true as const,
            pin: s.result.metadata,
            paths: s.result.paths
          })),
          ...result.failed.map((f) => ({
            ok: false as const,
            error: f.error
          }))
        ])
      )
      .catch((err) => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      count: items.length,
      pollUrl: `/v1/jobs/${jobId}`
    });
  }
  );
}
