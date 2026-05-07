import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildWifiSignPdf } from '@/lib/pdf/wifi-sign';
import { buildWifiQrPayload, buildWifiQrPng } from '@/lib/pdf/wifi-qr';

describe('buildWifiQrPayload', () => {
  it('produces the standard WIFI:T:WPA;S:...;P:...;; format', () => {
    expect(buildWifiQrPayload({ ssid: 'CabinGuest', password: 'mountain1982' }))
      .toBe('WIFI:T:WPA;S:CabinGuest;P:mountain1982;;');
  });

  it('escapes reserved characters (\\, ;, ,, :) in ssid and password', () => {
    const out = buildWifiQrPayload({ ssid: 'Cafe; Time', password: 'pa:ss,word' });
    expect(out).toContain('S:Cafe\\; Time');
    expect(out).toContain('P:pa\\:ss\\,word');
  });

  it('omits password when auth is nopass', () => {
    const out = buildWifiQrPayload({ ssid: 'Open', password: '', auth: 'nopass' });
    expect(out).toBe('WIFI:T:nopass;S:Open;;');
  });

  it('marks hidden networks with H:true', () => {
    const out = buildWifiQrPayload({ ssid: 'Stealth', password: 'pw', hidden: true });
    expect(out).toContain('H:true');
  });
});

describe('buildWifiQrPng', () => {
  it('returns a Uint8Array with a valid PNG signature', async () => {
    const bytes = await buildWifiQrPng({ ssid: 'X', password: 'Y' }, 128);
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x4e);
    expect(bytes[3]).toBe(0x47);
  });
});

describe('buildWifiSignPdf', () => {
  it('produces a valid single-page PDF for the default (hospitable) template', async () => {
    const bytes = await buildWifiSignPdf({ ssid: 'CabinGuest', password: 'mountain1982', houseName: 'Cabin' });
    expect(bytes[0]).toBe(0x25);
    expect(bytes[1]).toBe(0x50);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('renders all three templates without throwing', async () => {
    for (const template of ['minimal', 'hospitable', 'fun'] as const) {
      const bytes = await buildWifiSignPdf({
        ssid: 'X',
        password: 'Y',
        template,
        houseName: 'Test',
      });
      const doc = await PDFDocument.load(bytes);
      expect(doc.getPageCount(), `${template} page count`).toBe(1);
    }
  });

  it('embeds the SSID into PDF /Title metadata', async () => {
    const bytes = await buildWifiSignPdf({ ssid: 'NetworkA', password: 'pw' });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getTitle()).toContain('NetworkA');
  });

  it('renders without a houseName (cluster default)', async () => {
    const bytes = await buildWifiSignPdf({ ssid: 'X', password: 'Y' });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('respects brandFooter:false (smaller output)', async () => {
    const branded = await buildWifiSignPdf({ ssid: 'X', password: 'Y', houseName: 'H' });
    const unbranded = await buildWifiSignPdf({ ssid: 'X', password: 'Y', houseName: 'H', brandFooter: false });
    expect(unbranded.byteLength).toBeLessThan(branded.byteLength);
  });
});
