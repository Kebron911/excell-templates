import sharp from "sharp";

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = HEX_RE.exec(hex);
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  const n = parseInt(m[1]!, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

export async function generateSolidBackground(hexColor: string, width = 1000, height = 1500): Promise<Buffer> {
  const { r, g, b } = hexToRgb(hexColor);
  return await sharp({
    create: { width, height, channels: 3, background: { r, g, b } }
  }).png().toBuffer();
}
