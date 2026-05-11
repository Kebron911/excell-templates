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
    /**
     * Stripe Checkout payment-link URL. When present, the product page renders the live
     * Stripe buy button; absent values fall back to a mailto: order link so a missing
     * Stripe wire doesn't break the page. Source-of-truth: ops/stripe-import-live-results.csv
     * (synced by scripts/strledger-sync-stripe-products.mjs).
     */
    paymentUrl: z.string().url().optional(),
    stripeProductId: z.string().optional(),
    stripePriceId: z.string().optional(),
    /** 'sku' for individual templates, 'bundle' for multi-SKU packs. */
    kind: z.enum(['sku', 'bundle']).default('sku'),
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
    /**
     * Etsy shop URL for this SKU. Live thestrledger.com surfaces a
     * "Buy on Etsy" button on every product card + detail page. Defaults
     * to the shop root if not overridden per-SKU.
     */
    etsyUrl: z.string().url().default('https://www.etsy.com/shop/TheSTRLedger'),
    /**
     * Optional flag for the "Wave 1" homepage feature on live. Used by
     * the homepage to surface the launch cluster.
     */
    wave: z.enum(['1', '2', '3']).optional(),
    /**
     * Optional flag to feature this SKU in the homepage hero block.
     * Live thestrledger.com features TAX-004 in the hero today.
     */
    featured: z.boolean().default(false),
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
