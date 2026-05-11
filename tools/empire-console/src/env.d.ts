/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_N8N_WEBHOOK_BASE?: string;
  readonly PUBLIC_CONSOLE_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __EMPIRE_WEBHOOK_BASE__?: string;
    empireCmdK?: { open: () => void; close: () => void };
    empireCapture?: { open: () => void; close: () => void; count: () => number };
    empireConfirm?: (opts: {
      title: string;
      body?: string;
      danger?: boolean;
      typedConfirm?: string;
      confirmLabel?: string;
      onConfirm?: () => void;
    }) => void;
  }
}

export {};
