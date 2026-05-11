import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const DomainSchema = z.object({
  domain: z.string(),
  role: z.enum(['hub', 'site', 'tool', 'infra', 'mail']).optional(),
  registrar: z.string().optional(),
  expires: z.string().optional(),     // YYYY-MM-DD
  ssl_provider: z.string().optional(),
  ssl_check_url: z.string().optional(),
  notes: z.string().optional(),
});
export type Domain = z.infer<typeof DomainSchema>;

const FileSchema = z.object({ domains: z.array(DomainSchema).default([]) });

export interface InfraReport {
  domains: (Domain & { daysToExpiry: number | null; isExpiringSoon: boolean; isExpiringP0: boolean })[];
  expiringSoon: number;     // ≤60d
  expiringP0: number;       // ≤7d
}

export async function readInfrastructure(): Promise<InfraReport> {
  let raw: string;
  try { raw = await readFile(paths.infrastructure, 'utf8'); }
  catch { return { domains: [], expiringSoon: 0, expiringP0: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { domains: [] });
  const now = Date.now();
  const enriched = parsed.domains.map((d) => {
    const expMs = d.expires ? new Date(d.expires).getTime() : null;
    const daysToExpiry = expMs ? Math.floor((expMs - now) / 86_400_000) : null;
    return {
      ...d,
      daysToExpiry,
      isExpiringSoon: daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 60,
      isExpiringP0:   daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 7,
    };
  }).sort((a, b) => (a.daysToExpiry ?? 9999) - (b.daysToExpiry ?? 9999));
  return {
    domains: enriched,
    expiringSoon: enriched.filter((d) => d.isExpiringSoon).length,
    expiringP0:   enriched.filter((d) => d.isExpiringP0).length,
  };
}
