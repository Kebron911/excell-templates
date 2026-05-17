import { createHash } from "node:crypto";

const MAX_SLUG_LENGTH = 80;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-$/, "");
}

export interface SlugArgs {
  topic: string;
  brandId: string;
  templateId: string;
  date: string;
}

export function makeSlug(args: SlugArgs): string {
  const base = slugify(args.topic);
  const hash = createHash("sha256")
    .update(`${args.brandId}|${args.topic}|${args.templateId}|${args.date}`)
    .digest("hex")
    .slice(0, 4);
  const baseTrimmed = base.slice(0, MAX_SLUG_LENGTH - 5);
  return `${baseTrimmed}-${hash}`;
}

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
