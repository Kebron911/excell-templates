import { z } from 'zod';

export const ReviewVarsSchema = z.object({
  reviewText: z.string().min(1).max(4000),
  starRating: z.number().int().min(1).max(5),
  tone: z.enum(['warm', 'professional']),
  responseGoal: z.enum(['thank', 'address-issue', 'redirect-future']),
});
export type ReviewVars = z.infer<typeof ReviewVarsSchema>;

const GOAL_GUIDANCE: Record<ReviewVars['responseGoal'], string> = {
  thank: 'Thank the guest sincerely and mirror back one specific thing they enjoyed.',
  'address-issue':
    'Acknowledge what went wrong without arguing, take responsibility where appropriate, and explain (briefly) what changed.',
  'redirect-future':
    'Reframe a future-guest reading this — clarify any context that prevents the same complaint from landing on the next stay.',
};

export const REVIEW_V1 = {
  id: 'review',
  version: 1,
  schema: ReviewVarsSchema,
  system:
    'You are an experienced Airbnb host. Write public review responses that are gracious, specific, ' +
    'and read well to FUTURE guests browsing reviews. Never argue. Never blame the guest. ' +
    'Never offer refunds in writing. Cap responses at 90 words.',
  user(vars: ReviewVars): string {
    return [
      `Write a ${vars.tone} response to the ${vars.starRating}-star review below.`,
      `Goal: ${GOAL_GUIDANCE[vars.responseGoal]}`,
      '',
      'Review:',
      `"""${vars.reviewText}"""`,
      '',
      'Output the response only — no headings, no quotation marks, no commentary.',
    ].join('\n');
  },
} as const;
