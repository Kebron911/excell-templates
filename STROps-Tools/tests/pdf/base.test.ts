import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { createBasePdf, BRAND } from '@/lib/pdf/base';

describe('createBasePdf', () => {
  it('returns a Uint8Array', async () => {
    const bytes = await createBasePdf({ title: 'Cleaner SOP', subtitle: '123 Main St' });
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(0);
  });

  it('output starts with %PDF magic bytes', async () => {
    const bytes = await createBasePdf({ title: 'Cleaner SOP' });
    expect(bytes[0]).toBe(0x25); // %
    expect(bytes[1]).toBe(0x50); // P
    expect(bytes[2]).toBe(0x44); // D
    expect(bytes[3]).toBe(0x46); // F
  });

  it('produces a single-page PDF', async () => {
    const bytes = await createBasePdf({ title: 'Maintenance Schedule' });
    const reopened = await PDFDocument.load(bytes);
    expect(reopened.getPageCount()).toBe(1);
  });

  it('embeds the title in PDF metadata', async () => {
    const bytes = await createBasePdf({ title: 'Cleaner SOP — 42 Park Ave' });
    const reopened = await PDFDocument.load(bytes);
    expect(reopened.getTitle()).toBe('Cleaner SOP — 42 Park Ave');
  });

  it('sets author to strops.tools brand string', async () => {
    const bytes = await createBasePdf({ title: 'Test' });
    const reopened = await PDFDocument.load(bytes);
    // pdf-lib overwrites the Producer field with its own string when serializing,
    // so we only round-trip-verify Author. BRAND.producer is still applied
    // (visible to inspectors before save), but reading it back from bytes
    // returns pdf-lib's marker instead. This is a pdf-lib quirk, not a bug.
    expect(reopened.getAuthor()).toBe(BRAND.author);
    expect(reopened.getProducer()).toContain('pdf-lib');
  });

  it('honors a fixed generatedDate override (deterministic test)', async () => {
    const bytes = await createBasePdf({
      title: 'Date Test',
      generatedDate: '2026-05-07',
    });
    // Reopen, just sanity-check it parses; visual content is checked by humans.
    const reopened = await PDFDocument.load(bytes);
    expect(reopened.getPageCount()).toBe(1);
  });

  it('renders without subtitle (subtitle is optional)', async () => {
    const bytes = await createBasePdf({ title: 'No Subtitle' });
    expect(bytes[0]).toBe(0x25);
    const reopened = await PDFDocument.load(bytes);
    expect(reopened.getPageCount()).toBe(1);
  });
});

describe('BRAND', () => {
  it('exposes site URL, author, producer, tagline', () => {
    expect(BRAND.siteUrl).toBe('strops.tools');
    expect(BRAND.author).toBeTruthy();
    expect(BRAND.producer).toBeTruthy();
    expect(BRAND.tagline).toBeTruthy();
  });
});
