import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://odnokreslo.ru',
  integrations: [sitemap()],
  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '.trycloudflare.com',
      ],
    },
    build: {
      target: 'es2022',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022',
      },
    },
  },
});
