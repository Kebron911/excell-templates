import { z } from 'zod';

const EnvSchema = z.object({
  EMPIRE_HEALTH_PORT: z.coerce.number().int().positive().default(8789),
  EMPIRE_HEALTH_HOST: z.string().default('127.0.0.1'),
  EMPIRE_HEALTH_INTERVAL_MS: z.coerce.number().int().positive().default(5 * 60 * 1000),
  EMPIRE_HEALTH_SSL_INTERVAL_MS: z.coerce.number().int().positive().default(6 * 60 * 60 * 1000),
  EMPIRE_HEALTH_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  EMPIRE_HEALTH_SSL_WARN_DAYS: z.coerce.number().int().positive().default(14),
});

export interface Env {
  port: number;
  host: string;
  intervalMs: number;
  sslIntervalMs: number;
  timeoutMs: number;
  sslWarnDays: number;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid empire-health env: ${msg}`);
  }
  return {
    port: parsed.data.EMPIRE_HEALTH_PORT,
    host: parsed.data.EMPIRE_HEALTH_HOST,
    intervalMs: parsed.data.EMPIRE_HEALTH_INTERVAL_MS,
    sslIntervalMs: parsed.data.EMPIRE_HEALTH_SSL_INTERVAL_MS,
    timeoutMs: parsed.data.EMPIRE_HEALTH_TIMEOUT_MS,
    sslWarnDays: parsed.data.EMPIRE_HEALTH_SSL_WARN_DAYS,
  };
}
