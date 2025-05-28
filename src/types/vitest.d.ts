/// <reference types="vitest" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ENV: 'development' | 'production' | 'test';
  readonly VITE_ENABLE_DEMO_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 