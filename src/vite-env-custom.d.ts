
/// <reference types="vite/client" />

// Custom declaration for Vite configuration
declare module 'vite' {
  export function defineConfig(config: any): any;
}

// Add declaration for the component tagger plugin
declare module 'lovable-tagger' {
  export function componentTagger(): any;
}
