import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    resolve: {
      alias: {
        '@components': path.resolve(root, 'src/components'),
        '@layouts': path.resolve(root, 'src/layouts'),
        '@styles': path.resolve(root, 'src/styles'),
        '@data': path.resolve(root, 'src/data'),
      },
    },
  },
});
