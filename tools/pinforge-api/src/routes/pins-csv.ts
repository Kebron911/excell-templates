import type { FastifyInstance } from "fastify";
import { generateBatch, parsePinInputCsv } from "@str/pinforge";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import type { ApiEnv } from "../env.js";

export interface CsvRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerCsvRoute(app: FastifyInstance, deps: CsvRoutesDeps): void {
  app.post("/v1/pins/csv", async (req, reply) => {
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
      count: parsed.rows.length,
      pollUrl: `/v1/jobs/${jobId}`,
      ...(parsed.errors.length > 0 ? { parseErrors: parsed.errors } : {})
    });
  });
}
