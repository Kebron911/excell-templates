import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    sku: z.string(),
    description: z.string(),
    price: z.number().positive(),
    image: z.string().optional(),
    gtin: z.string().optional(),
    category: z.string().optional(),
    availability: z.enum(['InStock', 'OutOfStock', 'PreOrder']).default('InStock'),
    aggregateRating: z
      .object({
        ratingValue: z.number().min(0).max(5),
        reviewCount: z.number().int().nonnegative(),
      })
      .optional(),
    faqs: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .default([]),
    pitch: z.string().optional(),
    inside: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    author: z.string().default('The STR Ledger'),
    readMinutes: z.number().int().positive(),
  }),
});

export const collections = { products, blog };
