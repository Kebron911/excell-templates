import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildHouseRulesPdf, type HouseRulesInput } from '@/lib/pdf/house-rules';

const MIN_INPUT: HouseRulesInput = {
  propertyName: 'Test Property',
  rules: ['No smoking'],
};

describe('buildHouseRulesPdf', () => {
  it('returns a Uint8Array beginning with PDF magic bytes', async () => {
    const bytes = await buildHouseRulesPdf(MIN_INPUT);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(200);
    expect(bytes[0]).toBe(0x25); // %
    expect(bytes[1]).toBe(0x50); // P
    expect(bytes[2]).toBe(0x44); // D
    expect(bytes[3]).toBe(0x46); // F
  });

  it('produces a single-page PDF for a small rules list', async () => {
    const bytes = await buildHouseRulesPdf({
      propertyName: 'Test Property',
      rules: ['No smoking', 'No parties', 'Quiet hours 10pm — 8am'],
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('paginates when the rules list is long enough to overflow one page', async () => {
    // ~22pt per line + 130pt top margin + 80pt bottom margin on a Letter page (792pt tall)
    // = ~26 rules per page. 60 rules guarantees overflow.
    const rules = Array.from({ length: 60 }, (_, i) => `Rule number ${i + 1}: be a respectful guest`);
    const bytes = await buildHouseRulesPdf({ propertyName: 'Big List', rules });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(2);
  });

  it('embeds the property name in PDF /Title metadata', async () => {
    const bytes = await buildHouseRulesPdf({
      propertyName: 'Cozy Cabin on Fox Ridge',
      rules: ['No smoking'],
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getTitle()).toContain('House Rules');
    expect(doc.getTitle()).toContain('Cozy Cabin on Fox Ridge');
  });

  it('renders gracefully with an empty rules array (no crash)', async () => {
    const bytes = await buildHouseRulesPdf({ propertyName: 'Empty', rules: [] });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('appends host signature line when hostName is provided', async () => {
    // Smoke test: the byte length should grow when an additional draw call runs.
    const without = await buildHouseRulesPdf({ propertyName: 'P', rules: ['R'] });
    const withHost = await buildHouseRulesPdf({ propertyName: 'P', rules: ['R'], hostName: 'Daniel' });
    expect(withHost.byteLength).toBeGreaterThan(without.byteLength);
  });
});
