/**
 * Browser-side download helper for PDF Uint8Arrays.
 *
 * Static-site safe — no-op in SSR. Used by Phase 2 cleaner-dispatch and
 * maintenance-schedule tools (and reusable by future PDF tools).
 *
 * Emits a GA4 `pdf_downloaded` event when `window.gtag` is present.
 */

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  // GA4 event — strops uses GA4-only event logging (no /api/click server).
  (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'pdf_downloaded', {
    filename,
  });
}
