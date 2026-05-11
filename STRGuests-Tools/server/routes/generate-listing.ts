/**
 * POST /api/generate-listing
 *
 * Composes: rateLimitMiddleware('listing-description') → validate input → generateAndLog
 * → respond with { result, remaining, resetAt, model, tokens }.
 */

import type { Request, Response } from 'express';
import { rateLimitMiddleware } from '../lib/rate-limit';
import { generateAndLog } from '../lib/openai-log';
import { LISTING_SYSTEM, buildListingPrompt, validateListingInput } from '../lib/prompts/listing';

export const generateListingMiddleware = rateLimitMiddleware('listing-description');

export async function generateListingHandler(req: Request, res: Response): Promise<void> {
  const parsed = validateListingInput(req.body);
  if ('error' in parsed) {
    res.status(400).json({ error: 'invalid_input', detail: parsed.error });
    return;
  }
  try {
    const out = await generateAndLog({
      toolSlug: 'listing-description',
      system: LISTING_SYSTEM,
      user: buildListingPrompt(parsed),
      maxTokens: 800,
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
