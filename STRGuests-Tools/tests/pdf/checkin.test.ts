import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildCheckinPdf, type CheckinInput } from '@/lib/pdf/checkin';

// Tiny 1x1 PNG (red pixel) — sufficient for embedPng round-trip without
// pulling a real image fixture into the repo.
const TINY_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
  0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x5b, 0xc7, 0xa6, 0xed, 0x00, 0x00, 0x00,
  0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

const FULL_INPUT: CheckinInput = {
  propertyName: 'Cozy Cabin on Fox Ridge',
  hostName: 'Daniel',
  arrivalWindow: 'After 4pm — before 9pm',
  address: '142 Fox Ridge Rd, Pinewood, CA 95612',
  parking: {
    notes: 'Park in the gravel lot. Two spots — first come, first served.\nDo NOT block the neighbor’s driveway.',
  },
  doorAccess: {
    code: '4815',
    notes: 'Lockbox is on the porch column to the right of the front door.',
  },
  wifi: { ssid: 'CabinGuest', password: 'mountain1982' },
  firstNight: [
    'Lights: hallway switch by entry, kitchen switch behind the fridge.',
    'Thermostat: keep between 65–78°F.',
    'Trash day is Wednesday — please bring bins to the curb.',
    'Drinking water is from the tap; pitcher in the fridge if you prefer cold.',
  ],
  emergency: {
    hostPhone: '4155550142',
    nearestHospital: 'Mountain Regional, 12 min drive — 555-0199',
    police: '911',
  },
};

describe('buildCheckinPdf', () => {
  it('returns a Uint8Array starting with PDF magic bytes', async () => {
    const bytes = await buildCheckinPdf(FULL_INPUT);
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x44);
    expect(bytes[3]).toBe(0x46);
  });

  it('produces multiple pages when all sections are present', async () => {
    const bytes = await buildCheckinPdf(FULL_INPUT);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(5);
  });

  it('cover-only when only propertyName is provided', async () => {
    const bytes = await buildCheckinPdf({ propertyName: 'Bare' });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('embeds property name in /Title metadata', async () => {
    const bytes = await buildCheckinPdf(FULL_INPUT);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getTitle()).toContain('Check-in');
    expect(doc.getTitle()).toContain('Cozy Cabin on Fox Ridge');
  });

  it('embeds an uploaded PNG image without throwing (parking photo)', async () => {
    const withImage: CheckinInput = {
      propertyName: 'With Image',
      parking: {
        notes: 'See photo',
        photo: { bytes: TINY_PNG, kind: 'png', caption: 'Park in the gravel lot' },
      },
    };
    const bytes = await buildCheckinPdf(withImage);
    const doc = await PDFDocument.load(bytes);
    // cover + parking page = 2
    expect(doc.getPageCount()).toBe(2);
  });

  it('embeds an uploaded PNG image without throwing (door photo)', async () => {
    const withImage: CheckinInput = {
      propertyName: 'With Image',
      doorAccess: {
        code: '4815',
        photo: { bytes: TINY_PNG, kind: 'png' },
      },
    };
    const bytes = await buildCheckinPdf(withImage);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(2);
  });

  it('respects brandFooter:false (smaller output)', async () => {
    const branded = await buildCheckinPdf(FULL_INPUT);
    const unbranded = await buildCheckinPdf({ ...FULL_INPUT, brandFooter: false });
    expect(unbranded.byteLength).toBeLessThan(branded.byteLength);
  });
});
