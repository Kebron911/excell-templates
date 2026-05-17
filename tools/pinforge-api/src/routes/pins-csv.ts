import type { FastifyInstance } from "fastify";
import { generateBatch, parsePinInputCsv } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob, getJob } from "../jobs.js";
import { dispatchWebhook } from "../webhook-dispatcher.js";
import type { ApiEnv } from "../env.js";

export interface CsvRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerCsvRoute(app: FastifyInstance, deps: CsvRoutesDeps): void {
  app.post(
    "/v1/pins/csv",
    {
      schema: {
        tags: ["pins"],
        summary: "Bulk-generate pins from a multipart CSV file upload (async)",
        consumes: ["multipart/form-data"],
        description: "Multipart form upload with a 'file' field containing CSV: columns brandId, topic, primaryKeyword, destinationUrl. Pass ?callback_url=... for webhook notification.",
        querystring: {
          type: "object",
          properties: {
            callback_url: { type: "string", format: "uri", description: "Optional URL to POST job-done payload when the job completes" }
          }
        },
        response: {
          202: {
            type: "object",
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
    const cb = (req.query as { callback_url?: string }).callback_url;
    const callbackUrl = cb && /^https?:\/\//.test(cb) ? cb : undefined;

    const file = await req.file();
    if (!file) {
      reply.code(400).send({
        error: { code: "VALIDATION", message: "missing file part", context: {} }
      });
      return;
    }

    const text = (await file.toBuffer()).toString("utf8");
    const parsed = parsePinInputCsv(text);

    if (parsed.rows.length === 0) {
      reply.code(400).send({
        error: {
          code: "VALIDATION",
          message: "no valid rows in CSV",
          context: { parseErrors: parsed.errors }
        }
      });
      return;
    }

    if (parsed.rows.length > deps.env.bulkMax) {
      reply.code(400).send({
        error: {
          code: "VALIDATION",
          message: `CSV row count ${parsed.rows.length} exceeds maximum ${deps.env.bulkMax}`,
          context: { count: parsed.rows.length, max: deps.env.bulkMax }
        }
      });
      return;
    }

    const jobId = createJobId();
    registerJob(jobId, { total: parsed.rows.length });

    generateBatch(parsed.rows, {
      env: deps.env.pinforge,
      brandsDir: deps.brandsDir,
      outputDir: deps.outputDir
    })
      .then((result) => {
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
        ]);
        if (callbackUrl) {
          const job = getJob(jobId)!;
          dispatchWebhook(callbackUrl, job, "").catch(() => {});
        }
      })
      .catch((err) => {
        failJob(jobId, err);
        if (callbackUrl) {
          const job = getJob(jobId)!;
          dispatchWebhook(callbackUrl, job, "").catch(() => {});
        }
      });

    reply.code(202).send({
      jobId,
      count: parsed.rows.length,
      pollUrl: `/v1/jobs/${jobId}`,
      ...(parsed.errors.length > 0 ? { parseErrors: parsed.errors } : {})
    });
  }
  );
}
