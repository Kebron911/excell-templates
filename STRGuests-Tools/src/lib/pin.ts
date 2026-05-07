/**
 * Pinterest pin generator.
 *
 * Produces a 1000x1500 (2:3) PNG via the Canvas2D API — runs entirely in
 * the browser, no Satori, no extra fonts loaded. Each generator wires this
 * to its current input state so a "Save to Pinterest" click gets a custom
 * pin reflecting the user's property name and tool.
 *
 * Output: a `Blob` of MIME type "image/png", suitable for upload or for
 * passing to `URL.createObjectURL` for preview.
 */

export interface PinInput {
  toolSlug: string;
  toolName: string;        // e.g. "Welcome Book Builder"
  propertyName?: string;   // user-entered property name, optional
  tagline?: string;        // optional override; defaults per slug
}

export interface PinBuildOptions {
  width?: number;   // default 1000
  height?: number;  // default 1500
}

const BRAND = {
  parchment: '#F6EFE2',
  parchmentAlt: '#EFE5D0',
  parchmentDeep: '#E7DCC2',
  navy: '#12304E',
  navyTint: '#2A4867',
  terracotta: '#C8684C',
  terracottaDeep: '#9C4A30',
  ink: '#2B2B2B',
  ink2: '#555049',
  goldDeep: '#A9863A',
};

const FONT_DISPLAY = '"Cormorant Garamond", "Georgia", serif';
const FONT_BODY = '"Inter", "Helvetica Neue", Arial, sans-serif';

/**
 * Wraps `text` to lines that fit within `maxWidth`, given the current
 * canvas font setting. Returns the array of lines.
 */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const tentative = line ? `${line} ${word}` : word;
    if (ctx.measureText(tentative).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tentative;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildPinPng(input: PinInput, opts: PinBuildOptions = {}): Promise<Blob> {
  const W = opts.width ?? 1000;
  const H = opts.height ?? 1500;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // === Background — parchment with terracotta band at top ===
  ctx.fillStyle = BRAND.parchment;
  ctx.fillRect(0, 0, W, H);

  // Terracotta header band
  ctx.fillStyle = BRAND.terracotta;
  ctx.fillRect(0, 0, W, 280);

  // Parchment-deep stripe across band base
  ctx.fillStyle = BRAND.parchmentAlt;
  ctx.fillRect(0, 270, W, 8);

  // Bottom navy footer band
  ctx.fillStyle = BRAND.navy;
  ctx.fillRect(0, H - 180, W, 180);

  // === Top: kicker label "FREE GENERATOR" ===
  ctx.fillStyle = BRAND.parchment;
  ctx.font = `600 32px ${FONT_BODY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Letter-spacing not in canvas2D directly; emulate via spaced text.
  const kicker = input.toolSlug.startsWith('listing') || input.toolSlug.startsWith('review') || input.toolSlug.startsWith('guest-')
    ? 'F R E E   A I   G E N E R A T O R'
    : 'F R E E   P D F   G E N E R A T O R';
  ctx.fillText(kicker, W / 2, 145);

  // Wordmark on terracotta band
  ctx.font = `500 60px ${FONT_DISPLAY}`;
  ctx.fillStyle = BRAND.parchment;
  ctx.fillText('STR Guests', W / 2, 220);

  // === Middle: tool name (Cormorant, large) ===
  ctx.fillStyle = BRAND.navy;
  ctx.font = `500 92px ${FONT_DISPLAY}`;
  const toolLines = wrap(ctx, input.toolName, W - 160);
  let toolY = 480;
  for (const line of toolLines) {
    ctx.fillText(line, W / 2, toolY);
    toolY += 100;
  }

  // Terracotta accent rule below tool name
  const ruleY = toolY + 12;
  ctx.fillStyle = BRAND.terracotta;
  ctx.fillRect(W / 2 - 60, ruleY, 120, 4);

  // === Property name (if provided) — italic Cormorant
  if (input.propertyName) {
    ctx.fillStyle = BRAND.ink2;
    ctx.font = `400 italic 44px ${FONT_DISPLAY}`;
    const propLines = wrap(ctx, `for ${input.propertyName}`, W - 200);
    let propY = ruleY + 80;
    for (const line of propLines) {
      ctx.fillText(line, W / 2, propY);
      propY += 56;
    }
  }

  // === Tagline (Inter, mid)
  if (input.tagline) {
    ctx.fillStyle = BRAND.ink2;
    ctx.font = `500 28px ${FONT_BODY}`;
    const tagLines = wrap(ctx, input.tagline, W - 220);
    let tagY = H - 320;
    for (const line of tagLines) {
      ctx.fillText(line, W / 2, tagY);
      tagY += 38;
    }
  }

  // === Footer band — domain
  ctx.fillStyle = BRAND.parchment;
  ctx.font = `500 36px ${FONT_DISPLAY}`;
  ctx.fillText('strguests.tools', W / 2, H - 110);

  ctx.fillStyle = BRAND.parchmentDeep;
  ctx.font = `500 22px ${FONT_BODY}`;
  ctx.fillText('NO SIGNUP · BUILT IN YOUR BROWSER', W / 2, H - 60);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob returned null'));
    }, 'image/png');
  });
}

/**
 * Construct a Pinterest "share intent" URL with description + media.
 * Note: Pinterest only honors `media` URLs that are publicly reachable —
 * a `blob:` URL won't work in production. For Phase 5 the click also
 * dispatches a CustomEvent so pages/clients can intercept and upload
 * the pin to a hosting endpoint (Phase 6 wiring). Until that's wired,
 * the share intent without media still opens with description + URL.
 */
export function pinterestShareUrl({
  pageUrl,
  description,
  mediaUrl,
}: {
  pageUrl: string;
  description: string;
  mediaUrl?: string;
}): string {
  const params = new URLSearchParams({
    url: pageUrl,
    description,
  });
  if (mediaUrl) params.set('media', mediaUrl);
  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}
