import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z.string(),
    readMinutes: z.number(),
    category: z.enum(['title', 'description', 'photos', 'amenities', 'reviews', 'launch']),
  }),
});

export const collections = { blog };
