import "../templates/index.js"; // side-effect: register all templates
import { loadBrandKit } from "../brand/kit-loader.js";
import { ValidationError } from "../errors.js";
import { logger } from "../logger.js";
import type { PinforgeEnv } from "../env.js";
import { resolvePinBackground } from "../image/fallback.js";
import { PinInputSchema, type PinInput, type PinMetadata, type PinResult } from "../input.js";
import { writePin } from "../output/writer.js";
import { composePng } from "../render/compose.js";
import { loadBrandFonts } from "../render/fonts.js";
import { renderToSvg } from "../render/satori.js";
import { OpenAIAdapter, SeoCopyGenerator } from "../seo/openai-adapter.js";
import { buildSystemPrompt, buildUserPrompt } from "../seo/prompts.js";
import { withSeoRetry } from "../seo/retry.js";
import { makeSlug, todayIso } from "../slug.js";
import { getTemplate } from "../templates/registry.js";
import type { BackgroundType, ImageTreatment } from "../brand/schema.js";
import { mapSeoToRenderedCopy } from "./map-copy.js";
import { validateDestinationDomain } from "./validate-domain.js";

export interface OrchestratorDeps {
  env: PinforgeEnv;
  brandsDir: string;
  outputDir: string;
  seoGeneratorFactory?: (env: PinforgeEnv) => SeoCopyGenerator;
}

export async function generatePin(raw: unknown, deps: OrchestratorDeps): Promise<PinResult> {
  const parsed = PinInputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError("Invalid PinInput", { issues: parsed.error.issues });
  }
  const input: PinInput = parsed.data;
  const t0 = Date.now();

  const brand = await loadBrandKit(input.brandId, deps.brandsDir);
  validateDestinationDomain(input.destinationUrl, brand.allowedDomains);

  const templateId = input.templateId ?? brand.defaults.templateId;
  const template = getTemplate(templateId);

  const backgroundType: BackgroundType = input.backgroundType ?? brand.defaults.backgroundType;
  const treatment: ImageTreatment | undefined = input.imageTreatment ?? brand.defaults.imageTreatment;
  if (!template.supports.includes(backgroundType)) {
    throw new ValidationError(`Template '${templateId}' does not support backgroundType '${backgroundType}'`, { templateId, backgroundType, supports: template.supports });
  }

  const seoGen = deps.seoGeneratorFactory
    ? deps.seoGeneratorFactory(deps.env)
    : new SeoCopyGenerator(new OpenAIAdapter({ apiKey: deps.env.openaiApiKey, model: deps.env.openaiModel }), deps.env.openaiModel);

  const systemPrompt = buildSystemPrompt(brand);
  const userPrompt = buildUserPrompt({ brand, topic: input.topic, primaryKeyword: input.primaryKeyword, templateId });

  const [seoCopy, bgResult] = await Promise.all([
    withSeoRetry(() => seoGen.generate({ systemPrompt, userPrompt })),
    backgroundType === "image"
      ? resolvePinBackground({ brand, topic: input.topic, primaryKeyword: input.primaryKeyword }, {
          n8nBaseUrl: deps.env.n8nBaseUrl,
          n8nKey: deps.env.n8nPinKey,
          n8nTimeoutMs: deps.env.n8nTimeoutMs,
          unsplashKey: deps.env.unsplashAccessKey
        })
      : Promise.resolve({ buffer: Buffer.alloc(0), source: "solid" as const, fallbackUsed: false })
  ]);

  const renderedCopy = mapSeoToRenderedCopy(seoCopy, brand.seo.ctaSuffix);
  const node = template.render({
    brand,
    copy: renderedCopy,
    background: backgroundType === "image"
      ? { type: "image" as const, imageBuffer: bgResult.buffer, ...(treatment !== undefined ? { treatment } : {}) }
      : { type: backgroundType }
  });

  const fonts = await loadBrandFonts(brand, deps.brandsDir);
  const svg = await renderToSvg(node, { width: template.dimensions.width, height: template.dimensions.height, fonts });
  const pngBuffer = await composePng(svg, template.dimensions);

  const date = todayIso();
  const slug = makeSlug({ topic: input.topic, brandId: input.brandId, templateId, date });

  const metadata: PinMetadata = {
    schema: "pinforge.v1",
    format: "static",
    videoSourcePath: null,
    generatedAt: new Date().toISOString(),
    brandId: input.brandId,
    templateId,
    title: seoCopy.pinTitle,
    description: seoCopy.description,
    altText: seoCopy.altText,
    hashtags: seoCopy.hashtags,
    boardHint: input.boardHint ?? brand.defaults.boardHint,
    destinationUrl: input.destinationUrl,
    imagePath: "",
    fallbackUsed: bgResult.fallbackUsed,
    backgroundSource: bgResult.source,
    sourceInputs: {
      topic: input.topic,
      primaryKeyword: input.primaryKeyword,
      inputMode: input.inputMode,
      ...(input.sourceUrl ? { sourceUrl: input.sourceUrl } : {})
    }
  };

  const paths = await writePin({ outputDir: deps.outputDir, slug, date, png: pngBuffer, metadata });

  const durationMs = Date.now() - t0;
  logger.info({ slug, brandId: input.brandId, templateId, durationMs, fallbackUsed: bgResult.fallbackUsed, backgroundSource: bgResult.source }, "pin generated");

  return { pinPng: pngBuffer, metadata: { ...metadata, imagePath: paths.png }, paths };
}
