import type { ReactNode } from "react";
import type { BackgroundType, BrandKit, ImageTreatment } from "../brand/schema.js";

export interface RenderedCopy {
  headline: string;
  description?: string;
  items?: string[];
  stat?: string;
  cta?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeText?: string;
  afterText?: string;
}

export interface RenderedBackground {
  type: BackgroundType;
  imageBuffer?: Buffer;
  treatment?: ImageTreatment;
}

export interface TemplateInput {
  brand: BrandKit;
  copy: RenderedCopy;
  background: RenderedBackground;
}

export interface PinTemplate {
  readonly id: string;
  readonly displayName: string;
  readonly supports: readonly BackgroundType[];
  readonly dimensions: { width: 1000; height: 1500 };
  render(input: TemplateInput): ReactNode;
}
