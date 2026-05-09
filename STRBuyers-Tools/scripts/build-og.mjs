/**
 * build-og.mjs — Open Graph image generator (Satori → SVG → sharp → PNG).
 *
 * Generates 1200×630 PNGs for every public route on strbuyers.tools:
 *   - 7 calculators (from src/data/tools.json)
 *   - N cities (from src/data/cities-part-N.json)
 *   - home, about, contact, lead-magnet (get-the-buyer-checklist), disclosures
 *   - default fallback
 *
 * Output:
 *   public/og/{slug}.png            top-level routes
 *   public/og/cities/{slug}.png     city pages
 *   public/og/default.png           fallback
 *
 * Idempotent: skips PNGs newer than this script. Re-running is cheap.
 *
 * Determinism: no timestamps, no randomness. Same inputs → byte-identical
 * output (Satori + sharp are both deterministic when fed the same SVG).
 *
 * Run via: pnpm build:og
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const FONTS_DIR = path.join(__dirname, 'fonts');
const PUBLIC_OG = path.join(ROOT, 'public', 'og');
const PUBLIC_OG_CITIES = path.join(PUBLIC_OG, 'cities');

// ---- Brand tokens (mirrors src/styles/tokens.css) -----------------------
const BRAND = {
  parchment: '#F6EFE2',
  parchmentDeep: '#E7DCC2',
  navy: '#12304E',
  navyShade: '#0A1F35',
  accent: '#1E3A8A', // finance-trust delta
  graphite: '#2B2B2B',
  fg2: '#555049',
  gold: '#C9A24B',
};

// ---- Font loading -------------------------------------------------------
function loadFont(filename) {
  const fp = path.join(FONTS_DIR, filename);
  if (!fs.existsSync(fp)) {
    throw new Error(
      `Missing font ${fp}. Re-run scripts/fonts download (see scripts/fonts/README or build-og.mjs header).`
    );
  }
  return fs.readFileSync(fp);
}

// Static (non-variable) TTFs — Satori's opentype.js dependency does not
// support OpenType variable fonts (fvar table parser throws). Source:
// jsdelivr fontsource CDN, fetched once and committed to scripts/fonts/.
const FONT_INTER_REGULAR = loadFont('Inter-Regular.ttf');
const FONT_INTER_SEMIBOLD = loadFont('Inter-SemiBold.ttf');
const FONT_CORMORANT_MEDIUM = loadFont('CormorantGaramond-Medium.ttf');

const SATORI_FONTS = [
  { name: 'Inter', data: FONT_INTER_REGULAR, weight: 400, style: 'normal' },
  { name: 'Inter', data: FONT_INTER_SEMIBOLD, weight: 600, style: 'normal' },
  { name: 'Cormorant', data: FONT_CORMORANT_MEDIUM, weight: 500, style: 'normal' },
];

// ---- Hyperscript helper (Satori accepts react-element-shaped objects) ---
function h(type, props = {}, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().filter((c) => c !== null && c !== undefined && c !== false),
    },
  };
}

// ---- Card template ------------------------------------------------------
function card({ kicker, headline, tagline }) {
  return h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: BRAND.parchment,
        backgroundImage:
          `linear-gradient(135deg, ${BRAND.parchment} 0%, ${BRAND.parchmentDeep} 100%)`,
        fontFamily: 'Inter',
        color: BRAND.graphite,
      },
    },
    // Top row: wordmark + accent dot
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      h(
        'span',
        {
          style: {
            fontFamily: 'Cormorant',
            fontWeight: 500,
            fontSize: 40,
            color: BRAND.navy,
            letterSpacing: '-0.5px',
          },
        },
        'STR Buyers'
      ),
      h('span', {
        style: {
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: BRAND.accent,
          display: 'flex',
        },
      })
    ),
    // Middle: headline + tagline
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 24 } },
      kicker
        ? h(
            'span',
            {
              style: {
                fontFamily: 'Inter',
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: BRAND.accent,
              },
            },
            kicker
          )
        : null,
      h(
        'span',
        {
          style: {
            fontFamily: 'Cormorant',
            fontWeight: 500,
            fontSize: 76,
            lineHeight: 1.05,
            color: BRAND.navyShade,
            letterSpacing: '-1.5px',
            maxWidth: 1056,
          },
        },
        headline
      ),
      tagline
        ? h(
            'span',
            {
              style: {
                fontFamily: 'Inter',
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.4,
                color: BRAND.fg2,
                maxWidth: 1056,
              },
            },
            tagline
          )
        : null
    ),
    // Bottom: domain + cluster footer
    h(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: `1px solid ${BRAND.parchmentDeep}`,
        },
      },
      h(
        'span',
        {
          style: {
            fontFamily: 'Inter',
            fontSize: 22,
            fontWeight: 600,
            color: BRAND.navy,
          },
        },
        'strbuyers.tools'
      ),
      h(
        'span',
        {
          style: {
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: 400,
            color: BRAND.fg2,
          },
        },
        'Free tools for STR buyers'
      )
    )
  );
}

// ---- SVG → PNG ----------------------------------------------------------
async function renderToPng(tree, outPath) {
  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: SATORI_FONTS,
  });
  // sharp is deterministic for a given SVG input — no timestamps, no metadata.
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png);
  return png.length;
}

// ---- Idempotency --------------------------------------------------------
const SCRIPT_MTIME = fs.statSync(__filename).mtimeMs;

function shouldSkip(outPath) {
  if (!fs.existsSync(outPath)) return false;
  const st = fs.statSync(outPath);
  return st.mtimeMs >= SCRIPT_MTIME;
}

// ---- Route table builder ------------------------------------------------
async function loadRoutes() {
  const tools = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src', 'data', 'tools.json'), 'utf8')
  );
  const cities = {};
  for (const part of [1, 2, 3, 4]) {
    const data = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src', 'data', `cities-part-${part}.json`), 'utf8')
    );
    Object.assign(cities, data);
  }

  const routes = [];

  // Calculators (top-level)
  for (const tool of Object.values(tools)) {
    const slug = tool.path.replace(/^\//, '');
    routes.push({
      out: path.join(PUBLIC_OG, `${slug}.png`),
      kicker: 'Calculator',
      headline: tool.name,
      tagline: tool.tagline,
    });
  }

  // Chrome pages
  routes.push({
    out: path.join(PUBLIC_OG, 'index.png'),
    kicker: null,
    headline: 'Free tools for STR buyers',
    tagline: 'Calculators, comp analysis, and 200+ city profiles for pre-purchase research.',
  });
  routes.push({
    out: path.join(PUBLIC_OG, 'about.png'),
    kicker: 'About',
    headline: 'Built by hosts, for buyers.',
    tagline: 'Free tools to help you make a confident first STR purchase.',
  });
  routes.push({
    out: path.join(PUBLIC_OG, 'contact.png'),
    kicker: 'Contact',
    headline: 'Talk to us.',
    tagline: 'Questions, partnerships, data corrections — we read every email.',
  });
  routes.push({
    out: path.join(PUBLIC_OG, 'get-the-buyer-checklist.png'),
    kicker: 'Free download',
    headline: 'The 47-point STR buyer checklist',
    tagline: 'Every box to tick before you wire the down payment. Free PDF.',
  });
  routes.push({
    out: path.join(PUBLIC_OG, 'disclosures.png'),
    kicker: 'Disclosures',
    headline: 'How we make money.',
    tagline: 'FTC-compliant affiliate disclosure for every tool, every recommendation.',
  });

  // Default fallback
  routes.push({
    out: path.join(PUBLIC_OG, 'default.png'),
    kicker: null,
    headline: 'Free tools for STR buyers',
    tagline: 'Pre-purchase research for short-term rental investors.',
  });

  // Cities
  for (const city of Object.values(cities)) {
    routes.push({
      out: path.join(PUBLIC_OG_CITIES, `${city.slug}.png`),
      kicker: 'City profile',
      headline: `Is Airbnb profitable in ${city.name}, ${city.state}?`,
      tagline: `ADR, occupancy, regulation, and saturation — the four numbers that decide.`,
    });
  }

  return routes;
}

// ---- Main ---------------------------------------------------------------
async function main() {
  const start = Date.now();
  const routes = await loadRoutes();
  fs.mkdirSync(PUBLIC_OG, { recursive: true });
  fs.mkdirSync(PUBLIC_OG_CITIES, { recursive: true });

  let generated = 0;
  let skipped = 0;
  let bytes = 0;

  for (const route of routes) {
    if (shouldSkip(route.out)) {
      skipped++;
      continue;
    }
    const tree = card({
      kicker: route.kicker,
      headline: route.headline,
      tagline: route.tagline,
    });
    const size = await renderToPng(tree, route.out);
    bytes += size;
    generated++;
    if (generated % 20 === 0) {
      // Progress dot every 20 PNGs so we don't drown the build log.
      process.stdout.write('.');
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  process.stdout.write('\n');
  console.log(
    `[og] ${generated} generated, ${skipped} skipped, ${(bytes / 1024).toFixed(0)} KB total, ${elapsed}s`
  );
}

main().catch((err) => {
  console.error('[og] FAILED:', err);
  process.exit(1);
});
