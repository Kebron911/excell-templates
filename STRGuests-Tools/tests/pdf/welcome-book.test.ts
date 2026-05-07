import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildWelcomeBookPdf, type WelcomeBookInput } from '@/lib/pdf/welcome-book';

const FULL_INPUT: WelcomeBookInput = {
  propertyName: 'Cozy Cabin on Fox Ridge',
  hostName: 'Daniel',
  cover: { tagline: 'Welcome to your mountain retreat', heroNote: 'Built 1982. Updated 2024.' },
  wifi: { ssid: 'CabinGuest', password: 'mountain1982', notes: 'Router is in the kitchen pantry.' },
  accessCodes: { doorCode: '4815', notes: 'Lockbox on the porch column.' },
  neighborhood: {
    favorites: [
      { name: 'Fox Ridge Coffee', detail: '5 min walk; opens 7am' },
      { name: 'Trailhead — Bear Loop', detail: '0.4 mi; moderate' },
    ],
  },
  houseTips: [
    'Hot tub: 5-min flush before use; lid back on after.',
    'Trash day is Wednesday — bins on the curb by 7am.',
  ],
  emergency: {
    hostPhone: '4155550142',
    nearestHospital: 'Mountain Regional, 12 min drive — 555-0199',
    police: '911',
  },
};

describe('buildWelcomeBookPdf', () => {
  it('returns a Uint8Array starting with PDF magic bytes', async () => {
    const bytes = await buildWelcomeBookPdf(FULL_INPUT);
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x44);
    expect(bytes[3]).toBe(0x46);
  });

  it('produces multiple pages when all sections are enabled', async () => {
    const bytes = await buildWelcomeBookPdf(FULL_INPUT);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(5);
  });

  it('skips disabled sections (smaller PDF, fewer pages)', async () => {
    const minimal = await buildWelcomeBookPdf({
      propertyName: 'Cozy Cabin',
      cover: { tagline: 'Welcome' },
      wifi: { ssid: 'X', password: 'Y' },
      accessCodes: undefined,
      neighborhood: undefined,
      houseTips: undefined,
      emergency: undefined,
    });
    const minimalDoc = await PDFDocument.load(minimal);
    expect(minimalDoc.getPageCount()).toBeLessThan(5);
  });

  it('renders at least one page when all sections are undefined', async () => {
    const bytes = await buildWelcomeBookPdf({
      propertyName: 'Bare Property',
      cover: { tagline: 'Welcome' },
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
  });

  it('embeds property name in /Title metadata', async () => {
    const bytes = await buildWelcomeBookPdf(FULL_INPUT);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getTitle()).toContain('Welcome Book');
    expect(doc.getTitle()).toContain('Cozy Cabin on Fox Ridge');
  });

  it('respects the brandFooter:false override', async () => {
    const branded = await buildWelcomeBookPdf(FULL_INPUT);
    const unbranded = await buildWelcomeBookPdf({ ...FULL_INPUT, brandFooter: false });
    expect(unbranded.byteLength).toBeLessThan(branded.byteLength);
  });
});
