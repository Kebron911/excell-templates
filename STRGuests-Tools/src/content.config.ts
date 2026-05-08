import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
});

const templates = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/templates' }),
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

export const collections = { tools, templates, posts };
