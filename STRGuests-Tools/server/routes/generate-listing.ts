import { Router } from 'express';
import { makeGenerateHandler } from './_generation-pipeline.js';

export function makeGenerateListingRouter(): Router {
  const r = Router();
  r.post('/api/generate-listing', makeGenerateHandler('listing-description', 'listing'));
  return r;
}
