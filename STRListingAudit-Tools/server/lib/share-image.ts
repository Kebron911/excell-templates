/**
 * Share-image generator. Renders a 1200×630 PNG via Satori → sharp, written
 * to `public/share/[id].png`. Triggered once at audit completion.
 *
 * The image is the viral hook: it shows the score, the location, and the
 * domain watermark. Tweets / DMs / Reddit comments use this as the og:image.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
// Astro public dir lives two levels up from server/lib/.
const PUBLIC_SHARE_DIR = resolve(here, '../../public/share');

// Reading from CDN at render time is too slow; in production we ship the font
// in the repo. For v0.1 we use a system fallback — Satori accepts whatever's
// passed in `fonts`. Empty array forces Satori's built-in fallback.
async function loadFonts(): Promise<Awaited<ReturnType<typeof satori>> extends string ? any[] : never[]> {
  // TODO Phase 5: ship Inter Tight TTF in repo and load here for crisp rendering.
  return [] as any[];
}

export interface ShareImagePayload {
  id: string;
  score: number;
  title: string;
  location?: string;
}

function scoreBand(score: number): { hex: string; label: string } {
  if (score >= 80) return { hex: '#2F7A55', label: 'Strong' };
  if (score >= 50) return { hex: '#C9A24B', label: 'Mixed' };
  return { hex: '#B0432E', label: 'Needs work' };
}

function buildSvgTree(payload: ShareImagePayload) {
  const band = scoreBand(payload.score);
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: '#F6EFE2',
        padding: '64px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#12304E',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              fontSize: '14px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#0E7C8C',
              fontWeight: 600,
              marginBottom: '24px',
            },
            children: 'Listing Audit · listingaudit.tools',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '220px',
                    fontWeight: 700,
                    color: band.hex,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  },
                  children: String(payload.score),
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingBottom: '32px',
                  },
                  children: [
                    { type: 'div', props: { style: { fontSize: '34px', color: '#555049' }, children: '/ 100' } },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '22px',
                          fontWeight: 600,
                          color: band.hex,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                        },
                        children: band.label,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '40px',
              fontWeight: 500,
              lineHeight: 1.2,
              maxWidth: '1000px',
              marginBottom: '12px',
            },
            children: payload.title.slice(0, 90),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '22px',
              color: '#555049',
              marginBottom: 'auto',
            },
            children: payload.location ?? '',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E7DCC2',
              paddingTop: '24px',
              fontSize: '18px',
              color: '#555049',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontWeight: 600, color: '#12304E' },
                  children: 'Run yours → listingaudit.tools',
                },
              },
              { type: 'div', props: { children: `#${payload.id}` } },
            ],
          },
        },
      ],
    },
  };
}

export async function generateShareImage(payload: ShareImagePayload): Promise<string> {
  const tree = buildSvgTree(payload);
  const fonts = await loadFonts();
  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts: fonts as any,
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await mkdir(PUBLIC_SHARE_DIR, { recursive: true });
  const filename = `${payload.id}.png`;
  const fullPath = resolve(PUBLIC_SHARE_DIR, filename);
  await writeFile(fullPath, png);
  return `/share/${filename}`;
}
