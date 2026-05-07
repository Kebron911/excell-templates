import { Router } from 'express';
import { makeGenerateHandler } from './_generation-pipeline.js';

export function makeGenerateMessageRouter(): Router {
  const r = Router();
  r.post('/api/generate-message', makeGenerateHandler('guest-messages', 'message'));
  return r;
}
