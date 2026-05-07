import { Router } from 'express';
import { makeGenerateHandler } from './_generation-pipeline.js';

export function makeGenerateReviewRouter(): Router {
  const r = Router();
  r.post('/api/generate-review', makeGenerateHandler('review-response', 'review'));
  return r;
}
