import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export async function registerRateLimit(
  app: FastifyInstance,
  options: RateLimitOptions
): Promise<void> {
  await app.register(rateLimit, {
    max: options.max,
    timeWindow: options.windowMs,
    keyGenerator: (req) => {
      const key = req.headers["x-api-key"];
      if (typeof key === "string" && key.length > 0) return key;
      return req.ip ?? "unknown";
    }
  });
}
