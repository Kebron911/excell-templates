import { describe, it, expect } from 'vitest';
import { buildFAQPage, buildHowTo } from '@str/seo';

describe('seo', () => {
  it('buildFAQPage shapes correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j = buildFAQPage([{ question: 'Q', answer: 'A' }]) as any;
    expect(j['@type']).toBe('FAQPage');
    expect(j.mainEntity[0].name).toBe('Q');
  });
  it('buildHowTo numbers steps', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j = buildHowTo({ name: 'X', description: 'd', steps: [{ name: 's1', text: 't1' }, { name: 's2', text: 't2' }] }) as any;
    expect(j.step[0].position).toBe(1);
    expect(j.step[1].position).toBe(2);
  });
});
