import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import type { FastifyInstance } from "fastify";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../../package.json"), "utf8")
) as { version: string };
const VERSION = pkg.version;

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get(
    "/healthz",
    {
      schema: {
        tags: ["system"],
        summary: "Health check — no auth required",
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              version: { type: "string" }
            }
          }
        }
      }
    },
    async (_req, reply) => {
      return reply.code(200).send({ ok: true, version: VERSION });
    }
  );
}
