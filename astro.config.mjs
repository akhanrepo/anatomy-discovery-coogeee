import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: process.env.SITE_URL || 'https://tabula.netlify.app',
  output: 'static',
  integrations: [preact()],
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
