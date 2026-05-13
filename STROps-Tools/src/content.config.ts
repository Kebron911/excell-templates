import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const maintenance = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/maintenance' }),
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const replacement = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/replacement' }),
  schema: z.object({
    narrativeOverride: z.boolean().default(true),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
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
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
  }),
});

export const collections = { maintenance, replacement, tools, posts };
