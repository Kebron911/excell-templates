import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildWifiSignPdf } from '@/lib/pdf/wifi-sign';

const baseInput = {
  propertyName: 'Cedar Cottage',
  ssid: 'CedarCottage_5G',
  password: 'mountain-air-2026',
  note: 'No password? Text the host.',
};

describe('buildWifiSignPdf', () => {
  it('produces a single-page PDF starting with %PDF', async () => {
    const bytes = await buildWifiSignPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(bytes[0]).toBe(0x25);
    expect(reread.getPageCount()).toBe(1);
  });

  it('renders the minimal template by default', async () => {
    const bytes = await buildWifiSignPdf({ ...baseInput, template: undefined });
    expect(bytes.byteLength).toBeGreaterThan(800);
  });

  it.each(['minimal', 'cottage', 'modern'] as const)(
    'renders the %s template',
    async (template) => {
      const bytes = await buildWifiSignPdf({ ...baseInput, template });
      expect(bytes[0]).toBe(0x25);
      expect(bytes.byteLength).toBeGreaterThan(800);
    },
  );

  it('handles long passwords without crashing', async () => {
    const bytes = await buildWifiSignPdf({
      ...baseInput,
      password: 'this-is-a-rather-long-password-2026-spring',
    });
    expect(bytes.byteLength).toBeGreaterThan(800);
  });

  it('sets metadata title with property name', async () => {
    const bytes = await buildWifiSignPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(reread.getTitle()).toContain('Cedar Cottage');
  });
});
