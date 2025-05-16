
/// <reference types="vite/client" />

// Custom declaration for Vite configuration
declare module 'vite' {
  export function defineConfig(config: any): any;
}

// Declaration for the component tagger plugin
declare module 'lovable-tagger' {
  export function componentTagger(): any;
}

// Explicitly exclude vite.config.ts from TypeScript's type checking
declare module '*/vite.config.ts' {
  import { UserConfig } from 'vite';
  const config: UserConfig;
  export default config;
}
