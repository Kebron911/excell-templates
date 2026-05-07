import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildCheckInPdf } from '@/lib/pdf/check-in';

const baseInput = {
  propertyName: 'Cedar Cottage',
  address: '123 Pine Lane',
  doorCode: '4815',
  parkingInstructions: 'Driveway on the left. Don\'t block the neighbor\'s mailbox.',
  hostPhone: '+1 555 555 0101',
  wifi: { ssid: 'CedarCottage', password: 'mountain-air-2026' },
  steps: [
    { step: 'Find the lockbox', description: 'It is mounted on the right wall by the front door, painted to match the trim.' },
    { step: 'Enter the code', description: 'Press buttons firmly. The box is mechanical so each press needs to click.' },
    { step: 'Disarm the alarm', description: 'Panel inside the entry, code 0000.' },
  ],
};

describe('buildCheckInPdf', () => {
  it('produces a valid multi-page PDF', async () => {
    const bytes = await buildCheckInPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(bytes[0]).toBe(0x25);
    // summary + steps page + wifi tail = 3 pages minimum
    expect(reread.getPageCount()).toBeGreaterThanOrEqual(3);
  });

  it('includes property name in metadata', async () => {
    const bytes = await buildCheckInPdf(baseInput);
    const reread = await PDFDocument.load(bytes);
    expect(reread.getTitle()).toContain('Cedar Cottage');
  });

  it('renders even with no optional fields', async () => {
    const bytes = await buildCheckInPdf({
      propertyName: 'Tiny Cabin',
      steps: [{ step: 'Walk in', description: 'Door is unlocked.' }],
    });
    const reread = await PDFDocument.load(bytes);
    // summary + 1 step page = 2 pages, no wifi
    expect(reread.getPageCount()).toBe(2);
  });

  it('skips invalid photo data URLs gracefully', async () => {
    const bytes = await buildCheckInPdf({
      ...baseInput,
      steps: [
        { step: 'Test', description: 'with bad photo', photoDataUrl: 'not-a-data-url' },
      ],
    });
    expect(bytes.byteLength).toBeGreaterThan(800);
  });

  it('paginates when many steps overflow a page', async () => {
    const manySteps = Array.from({ length: 20 }, (_, i) => ({
      step: `Step ${i + 1}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec lacinia ipsum.',
    }));
    const bytes = await buildCheckInPdf({ ...baseInput, steps: manySteps });
    const reread = await PDFDocument.load(bytes);
    expect(reread.getPageCount()).toBeGreaterThan(3);
  });
});
