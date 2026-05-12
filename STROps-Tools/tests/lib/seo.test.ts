import { describe, it, expect } from 'vitest';
import { faqJsonLd, howToJsonLd } from '@lib/seo';

describe('seo', () => {
  it('faqJsonLd shapes correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j = faqJsonLd([{ q: 'Q', a: 'A' }]) as any;
    expect(j['@type']).toBe('FAQPage');
    expect(j.mainEntity[0].name).toBe('Q');
  });
  it('howToJsonLd numbers steps', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j = howToJsonLd({ name: 'X', description: 'd', steps: [{ name: 's1', text: 't1' }, { name: 's2', text: 't2' }] }) as any;
    expect(j.step[0].position).toBe(1);
    expect(j.step[1].position).toBe(2);
  });
});
