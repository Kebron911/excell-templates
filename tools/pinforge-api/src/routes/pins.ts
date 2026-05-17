import type { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { generatePin } from "@str/pinforge";
import { mapErrorToHttp } from "../errors.js";
import { PostPinBodySchema, PostPinSyncQuerySchema } from "../schemas.js";
import { createJobId, registerJob, completeJob, failJob } from "../jobs.js";
import { fetchPinBySlug } from "../slug.js";
import type { ApiEnv } from "../env.js";

export interface PinsRoutesDeps {
  env: ApiEnv;
  brandsDir: string;
  outputDir: string;
}

export function registerPinsRoutes(app: FastifyInstance, deps: PinsRoutesDeps): void {
  app.post("/v1/pins", async (req, reply) => {
    const parsedBody = PostPinBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      const msg = parsedBody.error.issues
        .map(i => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      reply.code(400).send({
        error: { code: "VALIDATION", message: msg, context: { issues: parsedBody.error.issues } }
      });
      return;
    }
    const input = parsedBody.data;

    const query = PostPinSyncQuerySchema.parse(req.query ?? {});
    const sync = query.sync === "1" || query.sync === "true";

    if (sync) {
      try {
        const result = await Promise.race([
          generatePin(input, {
            env: deps.env.pinforge,
            brandsDir: deps.brandsDir,
            outputDir: deps.outputDir
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("sync timeout")), deps.env.syncTimeoutMs)
          )
        ]);
        reply.code(200).send({ pin: result.metadata, paths: result.paths });
        return;
      } catch (err) {
        const httpErr = mapErrorToHttp(err);
        reply.code(httpErr.status).send(httpErr.body);
        return;
      }
    }

    // Async path: register job, fire-and-forget, return 202
    const jobId = createJobId();
    registerJob(jobId, { total: 1 });
    generatePin(input, {
      env: deps.env.pinforge,
      brandsDir: deps.brandsDir,
      outputDir: deps.outputDir
    })
      .then(result =>
        completeJob(jobId, [{ ok: true, pin: result.metadata, paths: result.paths }])
      )
      .catch(err => failJob(jobId, err));

    reply.code(202).send({
      jobId,
      pollUrl: `/v1/jobs/${jobId}`,
      estimatedSeconds: 8
    });
  });

  app.get("/v1/pins/:slug/image", async (req, reply) => {
    const slug = (req.params as { slug: string }).slug;
    const fetched = await fetchPinBySlug({ outputDir: deps.outputDir, slug });
    if (!fetched) {
      reply.code(404).send({
        error: { code: "PIN_NOT_FOUND", message: `No pin with slug '${slug}'`, context: { slug } }
      });
      return;
    }
    reply.header("content-type", "image/png");
    reply.header("cache-control", "public, max-age=31536000, immutable");
    return reply.send(createReadStream(fetched.pngPath));
  });

  app.get("/v1/pins/:slug", async (req, reply) => {
    const slug = (req.params as { slug: string }).slug;
    const fetched = await fetchPinBySlug({ outputDir: deps.outputDir, slug });
    if (!fetched) {
      reply.code(404).send({
        error: { code: "PIN_NOT_FOUND", message: `No pin with slug '${slug}'`, context: { slug } }
      });
      return;
    }
    reply.code(200).send({
      pin: fetched.metadata,
      paths: { png: fetched.pngPath, json: fetched.jsonPath }
    });
  });
}
