import { defineCollection, z } from 'astro:content';

const states = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const tools = defineCollection({
  type: 'content',
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { states, tools, blog };
