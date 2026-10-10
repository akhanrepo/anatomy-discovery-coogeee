import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://tabula.netlify.app',
  output: 'static',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
