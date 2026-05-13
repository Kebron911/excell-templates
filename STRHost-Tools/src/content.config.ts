import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const states = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/states' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
});

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
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
  }),
});

export const collections = { states, tools, posts };
