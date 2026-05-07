import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildHouseRulesPdf } from '@/lib/pdf/house-rules';

describe('buildHouseRulesPdf', () => {
  const baseInput = {
    propertyName: 'Cedar Cottage',
    address: '123 Pine Lane, Asheville NC',
    rules: [
      'Quiet hours from 10pm to 8am.',
      'No smoking anywhere on the property, including the porch.',
      'Maximum 4 guests; no unregistered visitors overnight.',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    hostName: 'Daniel Harrison',
    contactPhone: '+1 (555) 555-0101',
    signatureLine: true,
  };

  it('returns a Uint8Array starting with %PDF magic bytes', async () => {
    const bytes = await buildHouseRulesPdf(baseInput);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(1000);
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x44);
    expect(bytes[3]).toBe(0x46);
  });

  it('sets PDF metadata with property name in title', async () => {
    const bytes = await buildHouseRulesPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(reread.getTitle()).toContain('Cedar Cottage');
    expect(reread.getCreator()).toBe('strguests.tools');
  });

  it('renders a single page when rule count is small', async () => {
    const bytes = await buildHouseRulesPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(reread.getPageCount()).toBe(1);
  });

  it('paginates when rule count exceeds single-page capacity', async () => {
    const manyRules = Array.from({ length: 30 }, (_, i) => `Rule number ${i + 1} is important.`);
    const bytes = await buildHouseRulesPdf({ ...baseInput, rules: manyRules });
    const reread = await PDFDocument.load(bytes);
    expect(reread.getPageCount()).toBeGreaterThan(1);
  });

  it('handles minimal input without optional fields', async () => {
    const bytes = await buildHouseRulesPdf({
      propertyName: 'Tiny Cabin',
      rules: ['Be kind.', 'Lock the door when you leave.'],
    });
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
