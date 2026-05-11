/**
 * Review-response generator prompts (gpt-4o-mini).
 *
 * Star-rating drives both the system prompt instructions AND the structure of the response.
 * The bad-review variant explicitly forbids defensive language — that's the failure mode worth
 * catching at prompt-spec time, not at moderation time.
 */

export const REVIEW_SYSTEM = `You are an Airbnb host's review-response writer.
Your job is to write public responses that future guests will read.

ABSOLUTE RULES (apply to every response):
- Lead with empathy or genuine thanks — never with a defensive "but" or "however".
- Stay under 90 words. Future-guest readability is the goal.
- NEVER name the reviewer; use "you" or omit.
- NEVER threaten action, mention lawyers, or imply the reviewer was a bad person.
- NEVER demand a star rating change or fish for review removal.

VARIANT-SPECIFIC RULES:
- 5★ review: warm thanks, mention one specific thing the guest mentioned, invite them back. No upsell.
- 4★ review: thanks for staying + a single sentence acknowledging what could be better + concrete remedy if appropriate. No defensiveness.
- Bad review (≤3★): empathy first ("I'm sorry that…"), specific concrete remedy or action taken, then a brief acknowledgment of any factual inaccuracy IF needed — neutral tone, no contradiction-by-tone.

Output ONLY the response text. No preamble, no signature, no "Best, [Host]".`;

export type StarVariant = '5_star' | '4_star' | 'bad_review';

export interface ReviewInput {
  starVariant: StarVariant;
  reviewText: string;
  context?: string;
}

export function validateReviewInput(raw: unknown): ReviewInput | { error: string } {
  if (typeof raw !== 'object' || raw === null) return { error: 'body must be an object' };
  const r = raw as Record<string, unknown>;

  const valid: StarVariant[] = ['5_star', '4_star', 'bad_review'];
  const starVariant = typeof r.starVariant === 'string' && (valid as string[]).includes(r.starVariant)
    ? (r.starVariant as StarVariant) : null;
  if (!starVariant) return { error: `starVariant must be one of: ${valid.join(', ')}` };

  const reviewText = typeof r.reviewText === 'string' ? r.reviewText.trim() : '';
  if (!reviewText || reviewText.length > 2000) return { error: 'reviewText: 1–2000 chars' };

  let context: string | undefined;
  if (r.context != null) {
    if (typeof r.context !== 'string') return { error: 'context must be a string' };
    const t = r.context.trim();
    if (t.length > 800) return { error: 'context: ≤800 chars' };
    if (t) context = t;
  }

  return { starVariant, reviewText, context };
}

export function buildReviewPrompt(input: ReviewInput): string {
  const variantLabel = input.starVariant === '5_star' ? '5-star review'
    : input.starVariant === '4_star' ? '4-star review'
    : 'bad review (3 stars or fewer)';
  return [
    `Write a public response to this ${variantLabel}.`,
    ``,
    `Review text:`,
    `"""`,
    input.reviewText,
    `"""`,
    input.context ? `\nHost context (not for the response, but informs tone): ${input.context}` : '',
    ``,
    `Write the response now. Output ONLY the response text.`,
  ].filter(Boolean).join('\n');
}
