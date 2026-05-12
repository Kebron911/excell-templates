import { z } from 'zod';
import type { SiteId } from '@str/seo';

const SITE_IDS = ['guests', 'buyers', 'host', 'ops'] as const satisfies readonly SiteId[];

export const SubmitInputSchema = z.object({
  siteId: z.enum(SITE_IDS),
  listSegment: z.string().min(1).max(64),
  email: z.string().email().max(254),
  source: z.string().max(128).optional(),
});

export type SubmitInput = z.infer<typeof SubmitInputSchema>;

export const SubmitResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), id: z.number().int() }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

export type SubmitResult = z.infer<typeof SubmitResultSchema>;
