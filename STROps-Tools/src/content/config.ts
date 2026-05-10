import { defineCollection, z } from 'astro:content';

const maintenance = defineCollection({
  type: 'content',
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const replacement = defineCollection({
  type: 'content',
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(100).max(170),
    datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    author: z.string().default('Daniel Harrison'),
    category: z.enum(['operations', 'turnover', 'cleaning', 'access', 'supply', 'maintenance', 'damage']),
    readMinutes: z.number().int().positive(),
    relatedTools: z.array(z.string()).default([]),
    magnet: z.enum(['cleaner-sop', 'maintenance-checklist', 'supply-par']).default('cleaner-sop'),
    keywords: z.array(z.string()).default([]),
    primaryKeyword: z.string().optional(),
    keyTakeaways: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    ogImage: z.string().optional(),
  }),
});

export const collections = { maintenance, replacement, tools, posts };
