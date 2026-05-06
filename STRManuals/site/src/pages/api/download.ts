export const prerender = false;

import type { APIRoute } from 'astro';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { verifyDownload, tokenExpired } from '../../lib/hmac';
import { getManual, type ManualMeta } from '../../lib/manuals';

const FREE_PDFS: Record<string, string> = {
  'tax-loophole-explainer': 'private/free/tax-loophole-explainer.pdf',
};

async function watermarkPdf(buf: Buffer, email: string, orderId: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buf);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const stamp = `Licensed to ${email} · Order ${orderId} · ${new Date().toISOString().slice(0, 10)}`;

  for (const page of doc.getPages()) {
    const { width } = page.getSize();
    page.drawText(stamp, {
      x: 24,
      y: 16,
      size: 7,
      font,
      color: rgb(0.42, 0.39, 0.35),
      maxWidth: width - 48,
    });
  }
  return doc.save();
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export const GET: APIRoute = async ({ url }) => {
  // Free-PDF mode
  const freeId = url.searchParams.get('free');
  if (freeId) {
    const path = FREE_PDFS[freeId];
    if (!path) return new Response('Unknown free PDF', { status: 404 });
    const fullPath = resolve(process.cwd(), path);
    if (!(await fileExists(fullPath))) {
      return new Response(
        'PDF not yet uploaded. Place file at ' + path,
        { status: 503, headers: { 'Content-Type': 'text/plain' } },
      );
    }
    const buf = await readFile(fullPath);
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${freeId}.pdf"`,
        'Cache-Control': 'private, max-age=0, no-store',
      },
    });
  }

  // Paid-PDF mode
  const email = url.searchParams.get('email');
  const orderId = url.searchParams.get('order');
  const sku = url.searchParams.get('sku');
  const expRaw = url.searchParams.get('exp');
  const sig = url.searchParams.get('sig');

  if (!email || !orderId || !sku || !expRaw || !sig) {
    return new Response('Missing parameters', { status: 400 });
  }
  const expiry = parseInt(expRaw, 10);
  if (!Number.isFinite(expiry)) return new Response('Bad expiry', { status: 400 });

  if (!verifyDownload({ email, orderId, sku, expiry }, sig)) {
    return new Response('Invalid signature', { status: 403 });
  }
  if (tokenExpired(expiry)) {
    return new Response(
      'Link expired. Get a fresh one at /downloads.',
      { status: 410, headers: { 'Content-Type': 'text/plain' } },
    );
  }

  const manual = getManual(sku);
  if (!manual) return new Response('Unknown SKU', { status: 404 });

  // Bundle: assemble per-buyer zip of watermarked constituent PDFs on the fly.
  if (manual.bundleOf && manual.bundleOf.length > 0) {
    const zip = new JSZip();
    const missing: string[] = [];

    for (const childSku of manual.bundleOf) {
      const child = getManual(childSku);
      if (!child?.pdfPath) {
        missing.push(childSku);
        continue;
      }
      const childPath = resolve(process.cwd(), child.pdfPath);
      if (!(await fileExists(childPath))) {
        missing.push(child.pdfPath);
        continue;
      }
      const childBuf = await readFile(childPath);
      const stamped = await watermarkPdf(childBuf, email, orderId);
      zip.file(`${child.shortSku} ${child.title}.pdf`, stamped);
    }

    if (missing.length > 0) {
      return new Response(
        'Bundle missing constituent PDFs: ' + missing.join(', '),
        { status: 503, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    const zipBytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
    return new Response(zipBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${manual.shortSku}.zip"`,
        'Cache-Control': 'private, max-age=0, no-store',
      },
    });
  }

  if (!manual.pdfPath) return new Response('SKU has no file', { status: 500 });

  const fullPath = resolve(process.cwd(), manual.pdfPath);
  if (!(await fileExists(fullPath))) {
    return new Response(
      'PDF not yet uploaded. Place file at ' + manual.pdfPath,
      { status: 503, headers: { 'Content-Type': 'text/plain' } },
    );
  }

  const buf = await readFile(fullPath);
  const watermarked = await watermarkPdf(buf, email, orderId);
  return new Response(watermarked, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${manual.shortSku}.pdf"`,
      'Cache-Control': 'private, max-age=0, no-store',
    },
  });
};
