import { defineConfig } from 'vite';

// Relative base so the built assets resolve whether the site is served from the
// domain root (`username.github.io`) or a project subpath (`username.github.io/fpl-recap/`).
// If we later move to a custom domain at root, this still works.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
