import { describe, it, expect } from 'vitest';
import { newBrandedDoc, newPage, drawHeader, finalize } from '@lib/pdf/base';

describe('pdf base', () => {
  it('produces a valid PDF', async () => {
    const d = await newBrandedDoc();
    const p = newPage(d);
    drawHeader(p, d, 'Test', 'Sub');
    const bytes = await finalize(d);
    // PDF magic header
    const head = String.fromCharCode(...bytes.slice(0, 4));
    expect(head).toBe('%PDF');
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
