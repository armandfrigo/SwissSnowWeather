/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_METEO_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
