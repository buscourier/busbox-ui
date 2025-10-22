/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_ENV?: string;
  readonly APP_API_BASE_URL?: string;
  readonly APP_API_KEY?: string;
  readonly APP_MAP_KEY?: string;
  readonly APP_IMAGE_PROVIDER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
