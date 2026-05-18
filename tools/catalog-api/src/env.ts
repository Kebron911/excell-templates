import { z } from 'zod';

const ApiEnvSchema = z.object({
  CATALOG_API_KEY: z
    .string({ required_error: 'CATALOG_API_KEY is required' })
    .min(32, 'CATALOG_API_KEY must be at least 32 characters'),
  CATALOG_API_PORT: z.coerce.number().int().positive().default(8788),
  CATALOG_API_HOST: z.string().default('127.0.0.1'),
  CATALOG_API_CORS_ORIGINS: z.string().default(''),
  CATALOG_API_PUBLIC_MIN: z.coerce.boolean().default(true),
});

export interface ApiEnv {
  apiKey: string;
  port: number;
  host: string;
  corsOrigins: string[];
  publicMin: boolean;
}

export function loadApiEnv(source: NodeJS.ProcessEnv = process.env): ApiEnv {
  const parsed = ApiEnvSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid catalog-api env: ${msg}`);
  }
  const e = parsed.data;
  return {
    apiKey: e.CATALOG_API_KEY,
    port: e.CATALOG_API_PORT,
    host: e.CATALOG_API_HOST,
    corsOrigins: e.CATALOG_API_CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
    publicMin: e.CATALOG_API_PUBLIC_MIN,
  };
}
