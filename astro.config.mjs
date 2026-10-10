import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://tabula-anatomy.netlify.app',
  output: 'static',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
