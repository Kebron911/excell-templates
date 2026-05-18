import { describe, expect, it } from 'vitest';
import { checkHttp } from '../src/checkers.js';

describe('checkHttp', () => {
  it('returns fail on connection error within timeout window', async () => {
    const r = await checkHttp('http://127.0.0.1:1/never-listens', { timeoutMs: 500 });
    expect(r.status).toBe('fail');
    expect(r.error).toBeDefined();
  });

  it('respects timeoutMs', async () => {
    const start = Date.now();
    await checkHttp('http://127.0.0.1:1/never-listens', { timeoutMs: 200 });
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
