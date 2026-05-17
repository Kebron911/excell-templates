import type { FastifyInstance } from "fastify";
import type { JobResultEntry, JobState } from "../jobs.js";
import { getJob } from "../jobs.js";

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function jobToCsv(job: JobState): string {
  const header = "status,brandId,templateId,title,pngPath,error";
  if (!job.results || job.results.length === 0) return header + "\n";

  const rows = job.results.map((entry: JobResultEntry) => {
    if (entry.ok) {
      const pin = entry.pin as Record<string, unknown> | undefined;
      const paths = entry.paths as Record<string, unknown> | undefined;
      const brandId = csvEscape(String(pin?.brandId ?? ""));
      const templateId = csvEscape(String(pin?.templateId ?? ""));
      const title = csvEscape(String(pin?.title ?? ""));
      const pngPath = csvEscape(String(paths?.png ?? ""));
      return `ok,${brandId},${templateId},${title},${pngPath},`;
    } else {
      const errMsg = csvEscape(String(entry.error?.message ?? ""));
      return `failed,,,,, ${errMsg}`;
    }
  });

  return [header, ...rows].join("\n") + "\n";
}

const jobIdParams = {
  type: "object" as const,
  required: ["jobId"],
  properties: { jobId: { type: "string" } }
};

const errorSchema = {
  type: "object" as const,
  properties: {
    error: {
      type: "object",
      properties: { code: { type: "string" }, message: { type: "string" } }
    }
  }
};

export function registerJobsRoutes(app: FastifyInstance): void {
  app.get(
    "/v1/jobs/:jobId",
    {
      schema: {
        tags: ["jobs"],
        summary: "Poll job status",
        params: jobIdParams,
        response: {
          200: {
            type: "object",
            additionalProperties: true
          },
          404: errorSchema
        }
      }
    },
    async (req, reply) => {
      const jobId = (req.params as { jobId: string }).jobId;
      const job = getJob(jobId);
      if (!job) {
        reply.code(404).send({
          error: {
            code: "JOB_NOT_FOUND",
            message: `No job with id '${jobId}'`,
            context: { jobId }
          }
        });
        return;
      }
      reply.code(200).send(job);
    }
  );

  app.get(
    "/v1/jobs/:jobId/results.csv",
    {
      schema: {
        tags: ["jobs"],
        summary: "Download job results as CSV",
        params: jobIdParams,
        response: {
          200: { description: "CSV attachment", type: "string" },
          404: errorSchema
        }
      }
    },
    async (req, reply) => {
      const jobId = (req.params as { jobId: string }).jobId;
      const job = getJob(jobId);
      if (!job) {
        reply.code(404).send({
          error: {
            code: "JOB_NOT_FOUND",
            message: `No job with id '${jobId}'`,
            context: { jobId }
          }
        });
        return;
      }
      const csv = jobToCsv(job);
      reply
        .code(200)
        .header("content-type", "text/csv; charset=utf-8")
        .header("content-disposition", `attachment; filename="job-${jobId}-results.csv"`)
        .send(csv);
    }
  );
}
