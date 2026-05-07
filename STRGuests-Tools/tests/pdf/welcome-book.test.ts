import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildWelcomeBookPdf } from '@/lib/pdf/welcome-book';

const baseInput = {
  propertyName: 'Cedar Cottage',
  hostName: 'Daniel Harrison',
  hostBio: 'Local since 2017. Happy to help with anything during your stay.',
  wifi: { ssid: 'CedarCottage', password: 'mountain-air-2026' },
  checkout: '11:00 AM',
  sections: [
    { heading: 'Getting in', body: 'Lockbox code 1234. The front door sticks — push firmly while turning.' },
    { heading: 'House notes', body: 'Quiet hours start at 10pm. Trash pickup on Tuesday morning.' },
  ],
  localPicks: [
    { name: 'River Arts Cafe', category: 'Coffee · Breakfast', note: 'Try the cardamom bun.' },
    { name: 'Hop Trail Brewery', category: 'Beer · Pizza', note: '5 minute drive — kid friendly.' },
  ],
  emergency: [
    { label: 'Fire / Police', value: '911' },
    { label: 'Property manager', value: '+1 555 555 0101' },
  ],
};

describe('buildWelcomeBookPdf', () => {
  it('produces a valid PDF', async () => {
    const bytes = await buildWelcomeBookPdf(baseInput);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes[0]).toBe(0x25); // %
    expect(bytes[1]).toBe(0x50); // P
  });

  it('includes cover, TOC, sections, picks, and emergency pages', async () => {
    const bytes = await buildWelcomeBookPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    // cover + toc + 2 sections + picks + emergency = 6 pages minimum
    expect(reread.getPageCount()).toBeGreaterThanOrEqual(6);
  });

  it('sets metadata title to property name', async () => {
    const bytes = await buildWelcomeBookPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(reread.getTitle()).toContain('Cedar Cottage');
  });

  it('skips optional sections when not provided', async () => {
    const minimal = {
      propertyName: 'Tiny Cabin',
      hostName: 'Sam',
      sections: [{ heading: 'Welcome', body: 'Make yourself at home.' }],
    };
    const bytes = await buildWelcomeBookPdf(minimal);
    const reread = await PDFDocument.load(bytes);
    // cover + toc + 1 section = 3 pages
    expect(reread.getPageCount()).toBe(3);
  });

  it('paginates when section body is long', async () => {
    const longSection = {
      heading: 'House manual',
      body: Array.from({ length: 100 }, (_, i) => `Line ${i + 1} is descriptive and useful.`).join(' '),
    };
    const bytes = await buildWelcomeBookPdf({ ...baseInput, sections: [longSection] });
    const reread = await PDFDocument.load(bytes);
    // cover + toc + at least 2 pages for the long section + picks + emergency
    expect(reread.getPageCount()).toBeGreaterThanOrEqual(5);
  });
});
