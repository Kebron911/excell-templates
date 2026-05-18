import { timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';

export interface AuthOptions {
  apiKey: string;
  skipPaths?: string[];
  skipPrefixes?: string[];
}

export function registerAuth(app: FastifyInstance, options: AuthOptions): void {
  const { apiKey, skipPaths = [], skipPrefixes = [] } = options;
  const keyBuf = Buffer.from(apiKey, 'utf8');

  app.addHook('onRequest', async (req, reply) => {
    const rawPath = req.url ?? '';
    const path = rawPath.split('?')[0] ?? rawPath;

    if (skipPaths.includes(rawPath) || skipPaths.includes(path)) return;
    if (skipPrefixes.some((prefix) => path.startsWith(prefix))) return;

    const provided = req.headers['x-api-key'];
    if (typeof provided !== 'string') {
      return reply
        .code(401)
        .send({ error: { code: 'UNAUTHORIZED', message: 'Missing X-API-Key header' } });
    }

    const providedBuf = Buffer.from(provided, 'utf8');
    if (providedBuf.length !== keyBuf.length || !timingSafeEqual(providedBuf, keyBuf)) {
      return reply
        .code(401)
        .send({ error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } });
    }
  });
}
