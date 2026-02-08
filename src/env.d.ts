/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASTER_API_BASE_URL?: string;
  readonly VITE_MASTER_API_BEARER_TOKEN?: string;
  readonly VITE_MASTER_API_KEY?: string;
  readonly VITE_MASTER_API_KEY_HEADER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
