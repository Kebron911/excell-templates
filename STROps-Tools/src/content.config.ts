import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Existing STROps collections — migrated from legacy src/content/config.ts
// to the new content layer (loader: glob) so a 'posts' collection can be
// added alongside per the cluster blog standard.
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

// Cluster blog standard — see docs/CLUSTER-BLOG-STANDARD.md.
// Schema is identical across cluster sites; voice and tools differ.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    author: z.string().default('The STR Ledger'),
    category: z.enum(['math', 'operations', 'tax', 'guest-xp', 'acquisition']),
    keyword: z.string(),
    relatedTools: z.array(z.string()).default([]),
    readMinutes: z.number().int().positive(),
  }),
});

export const collections = { maintenance, replacement, tools, posts };
