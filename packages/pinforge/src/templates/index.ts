// Importing this module registers all built-in templates as a side effect.
import { registerTemplate } from "./registry.js";
import { bigHookTemplate } from "./big-hook.js";
import { listicleTemplate } from "./listicle.js";
import { beforeAfterTemplate } from "./before-after.js";
import { quoteTemplate } from "./quote.js";
import { howToTemplate } from "./how-to.js";
import { bigStatTemplate } from "./big-stat.js";

registerTemplate(bigHookTemplate);
registerTemplate(listicleTemplate);
registerTemplate(beforeAfterTemplate);
registerTemplate(quoteTemplate);
registerTemplate(howToTemplate);
registerTemplate(bigStatTemplate);

export { getTemplate, listTemplateIds, listTemplates, registerTemplate } from "./registry.js";
export type { PinTemplate, TemplateInput, RenderedCopy, RenderedBackground } from "./types.js";
