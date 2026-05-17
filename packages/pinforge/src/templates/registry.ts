import { TemplateNotFoundError } from "../errors.js";
import type { PinTemplate } from "./types.js";

const REGISTRY = new Map<string, PinTemplate>();

export function registerTemplate(template: PinTemplate): void {
  REGISTRY.set(template.id, template);
}

export function getTemplate(id: string): PinTemplate {
  const t = REGISTRY.get(id);
  if (!t) throw new TemplateNotFoundError(`Template '${id}' not registered`, { id, available: listTemplateIds() });
  return t;
}

export function listTemplateIds(): string[] {
  return [...REGISTRY.keys()].sort();
}

export function listTemplates(): PinTemplate[] {
  return listTemplateIds().map(id => REGISTRY.get(id)!);
}

/** Test helper — clears registry between tests. NOT exported from index.ts. */
export function _resetRegistry(): void {
  REGISTRY.clear();
}
