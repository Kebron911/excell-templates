import type { FastifyInstance } from "fastify";
import { getJob } from "../jobs.js";

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
}
