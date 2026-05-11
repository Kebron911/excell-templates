/**
 * POST /api/generate-review
 * Mirrors generate-listing — same compose, different prompt module.
 */

import type { Request, Response } from 'express';
import { rateLimitMiddleware } from '../lib/rate-limit';
import { generateAndLog } from '../lib/openai-log';
import { REVIEW_SYSTEM, buildReviewPrompt, validateReviewInput } from '../lib/prompts/review';

export const generateReviewMiddleware = rateLimitMiddleware('review-response');

export async function generateReviewHandler(req: Request, res: Response): Promise<void> {
  const parsed = validateReviewInput(req.body);
  if ('error' in parsed) {
    res.status(400).json({ error: 'invalid_input', detail: parsed.error });
    return;
  }
  try {
    const out = await generateAndLog({
      toolSlug: 'review-response',
      system: REVIEW_SYSTEM,
      user: buildReviewPrompt(parsed),
      maxTokens: 400,
      rateState: res.locals.rateState,
    });
    res.json({
      result: out.text,
      remaining: out.remaining,
      resetAt: out.resetAt,
      model: out.model,
      promptTokens: out.promptTokens,
      completionTokens: out.completionTokens,
    });
  } catch (err) {
    res.status(502).json({ error: 'upstream_error' });
  }
}
