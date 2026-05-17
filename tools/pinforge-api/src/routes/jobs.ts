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

export function registerJobsRoutes(app: FastifyInstance): void {
  app.get("/v1/jobs/:jobId", async (req, reply) => {
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
  });

  app.get("/v1/jobs/:jobId/results.csv", async (req, reply) => {
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
  });
}
