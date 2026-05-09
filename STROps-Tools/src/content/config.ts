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

export const collections = { maintenance, replacement, tools };
