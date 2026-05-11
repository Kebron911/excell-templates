/**
 * POST /api/generate-message
 * Mirrors generate-listing — same compose, different prompt module.
 */

import type { Request, Response } from 'express';
import { rateLimitMiddleware } from '../lib/rate-limit';
import { generateAndLog } from '../lib/openai-log';
import { MESSAGE_SYSTEM, buildMessagePrompt, validateMessageInput } from '../lib/prompts/message';

export const generateMessageMiddleware = rateLimitMiddleware('guest-messages');

export async function generateMessageHandler(req: Request, res: Response): Promise<void> {
  const parsed = validateMessageInput(req.body);
  if ('error' in parsed) {
    res.status(400).json({ error: 'invalid_input', detail: parsed.error });
    return;
  }
  try {
    const out = await generateAndLog({
      toolSlug: 'guest-messages',
      system: MESSAGE_SYSTEM,
      user: buildMessagePrompt(parsed),
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
