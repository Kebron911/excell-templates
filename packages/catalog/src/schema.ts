import { z } from 'zod';
import { GA4_EVENTS } from './events.js';

export const SITE_IDS = [
  'ledger',
  'guests',
  'host',
  'ops',
  'buyers',
  'laws',
  'audit',
  'manuals',
] as const;

export const SiteIdSchema = z.enum(SITE_IDS);
export type SiteId = z.infer<typeof SiteIdSchema>;

export const ToolCategorySchema = z.enum([
  'calculator',
  'pdf-generator',
  'template',
  'scheduler',
  'lookup',
  'audit',
  'generator',
  'dashboard',
  'reference',
  'guide',
]);
export type ToolCategory = z.infer<typeof ToolCategorySchema>;

export const AudienceSchema = z.enum([
  'host',
  'co-host',
  'buyer',
  'arbitrageur',
  'cleaner',
  'guest',
  'manager',
  'owner',
]);
export type Audience = z.infer<typeof AudienceSchema>;

export const PaidTierSchema = z.enum(['free', 'lead-magnet', 'paid', 'pro']);
export type PaidTier = z.infer<typeof PaidTierSchema>;

export const StatusSchema = z.enum(['shipped', 'beta', 'planned', 'deprecated']);
export type Status = z.infer<typeof StatusSchema>;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SlugSchema = z.string().regex(SLUG_RE, 'must be kebab-case');

export const SiteSchema = z.object({
  id: SiteIdSchema,
  displayName: z.string().min(1),
  domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i),
  tagline: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  audience: z.array(AudienceSchema).min(1),
  description: z.string().min(1),
});
export type Site = z.infer<typeof SiteSchema>;

export const ToolSchema = z.object({
  id: z.string().regex(/^[a-z]+\.[a-z0-9-]+$/, 'must be <site>.<slug>'),
  site: SiteIdSchema,
  slug: SlugSchema,
  title: z.string().min(1).max(80),
  shortTitle: z.string().min(1).max(40).optional(),
  description: z.string().min(20).max(280),
  category: ToolCategorySchema,
  audience: z.array(AudienceSchema).min(1),
  keywords: z.array(z.string().min(2)).min(1).max(20),
  path: z.string().regex(/^\/[a-z0-9/-]*$/, 'must start with / and be kebab-case'),
  paidTier: PaidTierSchema,
  status: StatusSchema,
  ga4Event: z.enum(GA4_EVENTS),
  leadMagnet: z
    .object({
      type: z.enum(['pdf', 'csv', 'xlsx', 'zip', 'email-sequence']),
      filename: z.string().optional(),
      title: z.string(),
    })
    .optional(),
  related: z.array(z.string()),
  upsells: z.array(z.string()),
  shippedAt: z.string().date().optional(),
  ownerNotes: z.string().optional(),
});
export type Tool = z.infer<typeof ToolSchema>;

export const CatalogSchema = z.object({
  schema: z.literal('catalog.v1'),
  generatedAt: z.string().datetime(),
  sites: z.array(SiteSchema),
  tools: z.array(ToolSchema),
});
export type Catalog = z.infer<typeof CatalogSchema>;
