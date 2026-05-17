import satori from "satori";
import type { ReactNode } from "react";
import { RenderError } from "../errors.js";
import type { SatoriFont } from "./fonts.js";

export interface SatoriRenderOptions {
  width: number;
  height: number;
  fonts: SatoriFont[];
}

export async function renderToSvg(node: ReactNode, opts: SatoriRenderOptions): Promise<string> {
  try {
    return await satori(node as any, {
      width: opts.width,
      height: opts.height,
      fonts: opts.fonts as any
    });
  } catch (e) {
    throw new RenderError(`Satori render failed: ${e instanceof Error ? e.message : String(e)}`, { cause: String(e) });
  }
}
