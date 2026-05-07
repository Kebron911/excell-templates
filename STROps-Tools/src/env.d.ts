/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_ADSENSE_ENABLED?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ESP_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
