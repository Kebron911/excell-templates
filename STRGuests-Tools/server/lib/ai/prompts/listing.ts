import { z } from 'zod';

export const ListingVarsSchema = z.object({
  propertyType: z.string().min(1),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  sleeps: z.number().int().positive(),
  location: z.string().min(1),
  features: z.array(z.string()).default([]),
  tone: z.enum(['warm', 'professional', 'quirky']),
  length: z.enum(['short', 'medium', 'long']),
});
export type ListingVars = z.infer<typeof ListingVarsSchema>;

const LENGTH_TARGET: Record<ListingVars['length'], string> = {
  short: '120–180 words, 2 short paragraphs',
  medium: '220–320 words, 3 paragraphs with a benefits bullet list',
  long: '380–520 words, 4 paragraphs with a benefits bullet list and a closing call-to-action',
};

export const LISTING_V1 = {
  id: 'listing',
  version: 1,
  schema: ListingVarsSchema,
  system:
    'You are an expert short-term rental copywriter. Write Airbnb-style listing descriptions that ' +
    'are specific, sensory, and free of clichés ("home away from home", "your home base", "nestled"). ' +
    'Lead with what makes this property different. Never invent features that were not given. ' +
    'Never include prices, reviews, or competitor comparisons.',
  user(vars: ListingVars): string {
    const features = vars.features.length > 0 ? vars.features.join(', ') : '(none specified)';
    return [
      `Write a ${vars.tone} Airbnb listing description for the property below.`,
      `Target length: ${LENGTH_TARGET[vars.length]}.`,
      '',
      `Property type: ${vars.propertyType}`,
      `Location: ${vars.location}`,
      `Bedrooms: ${vars.bedrooms}`,
      `Bathrooms: ${vars.bathrooms}`,
      `Sleeps: ${vars.sleeps}`,
      `Features: ${features}`,
      '',
      'Output the listing copy only — no headings, no markdown, no commentary.',
    ].join('\n');
  },
} as const;
