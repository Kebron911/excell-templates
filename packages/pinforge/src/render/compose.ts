import sharp from "sharp";
import { RenderError } from "../errors.js";

export interface ComposeOptions {
  width: number;
  height: number;
}

export async function composePng(svg: string, opts: ComposeOptions): Promise<Buffer> {
  try {
    return await sharp(Buffer.from(svg))
      .resize(opts.width, opts.height, { fit: "fill" })
      .png({ compressionLevel: 9, quality: 90 })
      .toBuffer();
  } catch (e) {
    throw new RenderError(`PNG composition failed: ${e instanceof Error ? e.message : String(e)}`, { cause: String(e) });
  }
}
