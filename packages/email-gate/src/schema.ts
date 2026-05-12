import { z } from 'zod';
import type { SiteId } from '@str/seo';

const SITE_IDS = ['guests', 'buyers', 'host', 'ops'] as const satisfies readonly SiteId[];

export const EmailCapturePayloadSchema = z.object({
  siteId: z.enum(SITE_IDS),
  email: z.string().email().max(254),
  magnet: z.string().min(1).max(64).optional(),
  toolSlug: z.string().min(1).max(128).optional(),
  utmMedium: z.string().min(1).max(64).optional(),
});

export type EmailCapturePayload = z.infer<typeof EmailCapturePayloadSchema>;
