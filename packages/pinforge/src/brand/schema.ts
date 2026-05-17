import { z } from "zod";

const HexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be #RGB, #RRGGBB, or #RRGGBBAA");

const FontSpec = z.object({
  family: z.string().min(1),
  weight: z.number().int().min(100).max(900),
  file: z.string().min(1)
});

export const BackgroundTypeSchema = z.enum(["solid", "gradient", "image"]);
export const ImageTreatmentSchema = z.enum(["bottom-gradient", "white-banner", "duotone"]);

export const BrandKitSchema = z.object({
  brandId: z.string().regex(/^[a-z0-9-]+$/, "brandId must be lowercase kebab-case"),
  displayName: z.string().min(1),
  domain: z.string().min(1),
  voice: z.string().min(1),
  colors: z.object({
    primary: HexColor,
    primaryDark: HexColor,
    accent: HexColor,
    text: HexColor,
    textOnLight: HexColor
  }),
  fonts: z.object({
    headline: FontSpec,
    body: FontSpec,
    accent: FontSpec
  }),
  logo: z.object({
    wordmark: z.string().optional(),
    footerText: z.string().min(1)
  }),
  defaults: z.object({
    templateId: z.string().regex(/^[a-z0-9-]+$/),
    backgroundType: BackgroundTypeSchema,
    imageTreatment: ImageTreatmentSchema.optional(),
    boardHint: z.string().min(1)
  }),
  seo: z.object({
    keywords: z.array(z.string()),
    disallowedTerms: z.array(z.string()),
    ctaSuffix: z.string()
  }),
  allowedDomains: z.array(z.string()).min(1, "at least one allowed domain required"),
  imageStyle: z.string().optional(),
  imageKeywords: z.array(z.string()).optional()
});

export type BrandKit = z.infer<typeof BrandKitSchema>;
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;
export type ImageTreatment = z.infer<typeof ImageTreatmentSchema>;
