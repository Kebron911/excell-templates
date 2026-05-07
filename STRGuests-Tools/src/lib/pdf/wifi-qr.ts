/**
 * Wi-Fi QR helpers — wraps the `qrcode` package to produce a PNG buffer for
 * pdf-lib's embedPng() and a data URL for the browser preview.
 *
 * The QR encodes the standard Wi-Fi join string format:
 *   WIFI:T:<auth>;S:<ssid>;P:<password>;H:<hidden>;;
 *
 * Auth values: WPA (default) | WEP | nopass.
 */

import QRCode from 'qrcode';

export type WifiAuth = 'WPA' | 'WEP' | 'nopass';

export interface WifiQrInput {
  ssid: string;
  password: string;
  auth?: WifiAuth;
  hidden?: boolean;
}

/**
 * Build the standard Wi-Fi QR payload string.
 * Escapes the four reserved characters: `\`, `;`, `,`, `:`.
 */
export function buildWifiQrPayload(input: WifiQrInput): string {
  const escape = (raw: string) =>
    raw.replace(/([\\;,:])/g, '\\$1');
  const auth = input.auth ?? (input.password ? 'WPA' : 'nopass');
  const parts: string[] = [`T:${auth}`];
  parts.push(`S:${escape(input.ssid)}`);
  if (auth !== 'nopass') {
    parts.push(`P:${escape(input.password)}`);
  }
  if (input.hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

/**
 * Returns a PNG byte array suitable for pdf-lib's `embedPng()`.
 * `size` is the rendered pixel width; pdf-lib will scale on draw.
 */
export async function buildWifiQrPng(input: WifiQrInput, size = 480): Promise<Uint8Array> {
  const payload = buildWifiQrPayload(input);
  const buffer = await QRCode.toBuffer(payload, {
    type: 'png',
    errorCorrectionLevel: 'M',
    width: size,
    margin: 1,
    color: { dark: '#12304E', light: '#FFFFFF' }, // navy on white reads cleanly on parchment + frame
  });
  return new Uint8Array(buffer);
}

/**
 * Returns a data URL for the browser preview pane.
 */
export async function buildWifiQrDataUrl(input: WifiQrInput, size = 256): Promise<string> {
  const payload = buildWifiQrPayload(input);
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    width: size,
    margin: 1,
    color: { dark: '#12304E', light: '#FFFFFF' },
  });
}
