import { z } from "zod";
import { BackgroundTypeSchema, ImageTreatmentSchema } from "./brand/schema.js";

export const PinInputSchema = z.object({
  brandId: z.string().regex(/^[a-z0-9-]+$/),
  topic: z.string().min(3).max(200),
  primaryKeyword: z.string().min(2).max(60),
  destinationUrl: z.string().url(),
  templateId: z.string().regex(/^[a-z0-9-]+$/).optional(),
  backgroundType: BackgroundTypeSchema.optional(),
  imageTreatment: ImageTreatmentSchema.optional(),
  inputMode: z.enum(["topic", "url"]).default("topic"),
  sourceUrl: z.string().url().optional(),
  boardHint: z.string().optional(),
  notes: z.string().optional()
}).refine(
  (v) => v.inputMode !== "url" || !!v.sourceUrl,
  { message: "sourceUrl is required when inputMode is 'url'", path: ["sourceUrl"] }
);

export type PinInput = z.infer<typeof PinInputSchema>;

export interface PinMetadata {
  schema: "pinforge.v1";
  format: "static";
  videoSourcePath: null;
  generatedAt: string;
  brandId: string;
  templateId: string;
  title: string;
  description: string;
  altText: string;
  hashtags: string[];
  boardHint: string;
  destinationUrl: string;
  imagePath: string;
  fallbackUsed: boolean;
  backgroundSource: "n8n" | "unsplash" | "solid";
  sourceInputs: {
    topic: string;
    primaryKeyword: string;
    inputMode: "topic" | "url";
    sourceUrl?: string;
  };
}

export interface PinResult {
  pinPng: Buffer;
  metadata: PinMetadata;
  paths: { png: string; json: string };
}
