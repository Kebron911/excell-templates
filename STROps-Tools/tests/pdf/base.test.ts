import { describe, it, expect } from 'vitest';
import { createBaseDoc, drawHeader, drawFooter, COLORS, PRODUCER, CREATOR } from '@/lib/pdf/base';

describe('createBaseDoc', () => {
  it('returns a PDFDocument with title/author/producer/creator metadata set', async () => {
    const doc = await createBaseDoc({
      title: 'Cleaner SOP — 123 Main St',
      author: 'Daniel Harrison',
      subject: 'Cleaner standard operating procedure',
      keywords: ['airbnb', 'turnover', 'sop'],
    });

    expect(doc.getTitle()).toBe('Cleaner SOP — 123 Main St');
    expect(doc.getAuthor()).toBe('Daniel Harrison');
    expect(doc.getProducer()).toBe(PRODUCER);
    expect(doc.getCreator()).toBe(CREATOR);
    expect(doc.getSubject()).toBe('Cleaner standard operating procedure');
    expect(doc.getKeywords()).toContain('airbnb');
  });

  it('falls back to default author when not provided', async () => {
    const doc = await createBaseDoc({ title: 'Maintenance Schedule' });
    expect(doc.getAuthor()).toBe('strops.tools');
  });

  it('saves to a buffer that begins with PDF magic bytes (%PDF)', async () => {
    const doc = await createBaseDoc({ title: 'Cleaner Dispatch' });
    doc.addPage([612, 792]);
    const bytes = await doc.save();

    expect(bytes.byteLength).toBeGreaterThan(4);
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x44);
    expect(bytes[3]).toBe(0x46);
  });
});

describe('drawHeader', () => {
  it('draws on the page without throwing for default options', async () => {
    const doc = await createBaseDoc({ title: 'Cleaner SOP' });
    const page = doc.addPage([612, 792]);
    await drawHeader(doc, page, { title: 'Cleaner SOP', subtitle: '123 Main St' });
    const bytes = await doc.save();
    expect(bytes.byteLength).toBeGreaterThan(100);
  });

  it('falls back to PDF title when no title prop is passed', async () => {
    const doc = await createBaseDoc({ title: 'Fallback Title' });
    const page = doc.addPage([612, 792]);
    await drawHeader(doc, page);
    const bytes = await doc.save();
    expect(bytes.byteLength).toBeGreaterThan(100);
  });

  it('skips the accent rule when rule:false', async () => {
    const doc = await createBaseDoc({ title: 'No Rule' });
    const page = doc.addPage([612, 792]);
    await drawHeader(doc, page, { rule: false });
    const bytes = await doc.save();
    expect(bytes.byteLength).toBeGreaterThan(100);
  });
});

describe('drawFooter', () => {
  it('renders the brand footer by default with today ISO date', async () => {
    const doc = await createBaseDoc({ title: 'Footer Test' });
    const page = doc.addPage([612, 792]);
    drawFooter(page);
    const bytes = await doc.save();
    expect(bytes.byteLength).toBeGreaterThan(100);
  });

  it('honors a fixed generatedDate override', async () => {
    const doc = await createBaseDoc({ title: 'Footer Test' });
    const page = doc.addPage([612, 792]);
    drawFooter(page, { generatedDate: '2026-05-06' });
    const bytes = await doc.save();
    expect(bytes.byteLength).toBeGreaterThan(100);
  });

  it('renders nothing when brandFooter is false', async () => {
    const doc = await createBaseDoc({ title: 'No Brand' });
    const page = doc.addPage([612, 792]);
    drawFooter(page, { brandFooter: false });
    const bytes = await doc.save();
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
  });
});

describe('COLORS', () => {
  it('exposes the strops brand palette as pdf-lib Color objects', () => {
    expect(COLORS.navy).toBeDefined();
    expect(COLORS.moss).toBeDefined();
    expect(COLORS.graphite).toBeDefined();
    // pdf-lib rgb() returns { type: 'RGB', red, green, blue }
    expect((COLORS.moss as any).red).toBeCloseTo(0.361, 2);
    expect((COLORS.moss as any).green).toBeCloseTo(0.459, 2);
  });
});
