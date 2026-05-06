import crypto from 'node:crypto';

const SECRET = (): string => {
  const s = import.meta.env.DOWNLOAD_HMAC_SECRET || process.env.DOWNLOAD_HMAC_SECRET;
  if (!s) throw new Error('DOWNLOAD_HMAC_SECRET not set');
  return s;
};

export interface DownloadTokenPayload {
  email: string;
  orderId: string;
  sku: string;
  expiry: number;
}

export function signDownload({ email, orderId, sku, expiry }: DownloadTokenPayload): string {
  const payload = `${email}|${orderId}|${sku}|${expiry}`;
  return crypto.createHmac('sha256', SECRET()).update(payload).digest('hex');
}

export function buildDownloadUrl(base: string, p: DownloadTokenPayload): string {
  const sig = signDownload(p);
  const params = new URLSearchParams({
    email: p.email,
    order: p.orderId,
    sku: p.sku,
    exp: String(p.expiry),
    sig,
  });
  return `${base}/api/download?${params.toString()}`;
}

export function verifyDownload(p: DownloadTokenPayload, providedSig: string): boolean {
  const expected = signDownload(p);
  if (expected.length !== providedSig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(providedSig));
}

export function tokenExpired(expiry: number): boolean {
  return Math.floor(Date.now() / 1000) > expiry;
}

export function makeExpiry(hours = 24): number {
  return Math.floor(Date.now() / 1000) + hours * 3600;
}
