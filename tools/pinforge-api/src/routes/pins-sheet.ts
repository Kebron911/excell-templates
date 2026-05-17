import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { generateBatch, parsePinInputCsv } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob, getJob } from "../jobs.js";
import { dispatchWebhook, isPublicHttpUrl } from "../webhook-dispatcher.js";
import { fetchPublishedSheetCsv } from "../sheet-fetcher.js";
import type { ApiEnv } from "../env.js";

export interface SheetRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

const SheetBodySchema = z.object({
  sheetUrl: z.string().url("sheetUrl must be a valid URL"),
  callbackUrl: z.string().url().optional()
});

export function registerSheetRoute(app: FastifyInstance, deps: SheetRoutesDeps): void {
  app.post(
    "/v1/pins/sheet",
    {
      schema: {
        tags: ["pins"],
        summary: "Ingest published Google Sheet CSV and generate pins",
        body: {
          type: "object",
          required: ["sheetUrl"],
          properties: {
            sheetUrl: {
              type: "string",
              format: "uri",
              description: "Public publish-to-web CSV URL from Google Sheets (must be https://docs.google.com/...)"
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
            }
          },
          400: {
            type: "object",
            properties: {
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    async (req, reply) => {
      const parsed = SheetBodySchema.safeParse(req.body);
      if (!parsed.success) {
        const msg = parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ");
        return reply.code(400).send({
          error: { code: "VALIDATION", message: msg, context: { issues: parsed.error.issues } }
        });
      }

      const { sheetUrl, callbackUrl } = parsed.data;

      if (callbackUrl && !isPublicHttpUrl(callbackUrl)) {
        return reply.code(400).send({ error: { code: "VALIDATION", message: "callbackUrl must be a public http(s) URL — private/loopback/link-local addresses are rejected", context: { callbackUrl } } });
      }

      let csvText: string;
      try {
        csvText = await fetchPublishedSheetCsv(sheetUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return reply.code(400).send({
          error: { code: "SHEET_FETCH_ERROR", message: msg, context: {} }
        });
      }

      const csvParsed = parsePinInputCsv(csvText);

      if (csvParsed.rows.length === 0) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION",
            message: "no valid rows in sheet CSV",
            context: { parseErrors: csvParsed.errors }
          }
        });
      }

      if (csvParsed.rows.length > deps.env.bulkMax) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION",
            message: `Sheet row count ${csvParsed.rows.length} exceeds maximum ${deps.env.bulkMax}`,
            context: { count: csvParsed.rows.length, max: deps.env.bulkMax }
          }
        });
      }

      const jobId = createJobId();
      registerJob(jobId, { total: csvParsed.rows.length });

      generateBatch(csvParsed.rows, {
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

      return reply.code(202).send({
        jobId,
        count: csvParsed.rows.length,
        pollUrl: `/v1/jobs/${jobId}`,
        ...(csvParsed.errors.length > 0 ? { parseErrors: csvParsed.errors } : {})
      });
    }
  );
}
