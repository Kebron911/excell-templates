import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const Buyer = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  sku: z.string().optional(),
  purchased: z.string(),
  channel: z.enum(['etsy', 'gumroad', 'own-site']).optional(),
  state: z.enum(['received', 'first-contact', 'second-contact', 'reviewed', 'case-study', 'done']),
  notes: z.string().optional(),
  case_study_candidate: z.boolean().default(false),
});
export type OnboardingBuyer = z.infer<typeof Buyer>;
// Tolerate `buyers:` with no items (YAML parses that to null) — treat as empty.
const FileSchema = z.object({
  buyers: z.array(Buyer).nullable().default([]).transform((v) => v ?? []),
});

export interface OnboardingReport {
  buyers: OnboardingBuyer[];
  total: number;
  needsContact: number;            // state = received
  awaitingReview: number;          // state = second-contact
  caseStudyCandidates: number;
  doneCount: number;
}

export async function readOnboarding(): Promise<OnboardingReport> {
  let raw: string;
  try { raw = await readFile(paths.onboarding, 'utf8'); }
  catch { return { buyers: [], total: 0, needsContact: 0, awaitingReview: 0, caseStudyCandidates: 0, doneCount: 0 }; }
  const parsed = FileSchema.parse(parseYaml(raw) ?? { buyers: [] });
  return {
    buyers: parsed.buyers.sort((a, b) => new Date(b.purchased).getTime() - new Date(a.purchased).getTime()),
    total: parsed.buyers.length,
    needsContact: parsed.buyers.filter((b) => b.state === 'received').length,
    awaitingReview: parsed.buyers.filter((b) => b.state === 'second-contact').length,
    caseStudyCandidates: parsed.buyers.filter((b) => b.case_study_candidate && b.state !== 'done').length,
    doneCount: parsed.buyers.filter((b) => b.state === 'done').length,
  };
}
