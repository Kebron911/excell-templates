/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ADSENSE_ENABLED?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
