import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const states = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', '!**/README.{md,mdx}'], base: './src/content/states' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', '!**/README.{md,mdx}'], base: './src/content/tools' }),
});

export const collections = { states, tools };
