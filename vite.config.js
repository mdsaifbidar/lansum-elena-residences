import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5190, strictPort: false },
  build: {
    // the walkthrough video lives in /public and is served as-is
    assetsInlineLimit: 0,
  },
});
