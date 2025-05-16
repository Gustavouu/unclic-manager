
/// <reference types="vite/client" />

// Custom declaration to handle vite config typing
declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module 'lovable-tagger' {
  export function componentTagger(): any;
}
