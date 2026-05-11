import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const manuals = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/manuals' }),
  schema: z.object({
    sku: z.string(),
    title: z.string(),
    promise: z.string(),
    price: z.number(),
    pages: z.number(),
    category: z.enum(['tax', 'revenue', 'legal', 'ops']),
    cover: z.string().optional(),
    companion: z
      .object({
        name: z.string(),
        url: z.string(),
      })
      .optional(),
    toc: z.array(z.string()),
    whoFor: z.array(z.string()),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
    stripePriceId: z.string().optional(),
    paymentLink: z.string().url().optional(),
    legalDisclaimer: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { manuals };
