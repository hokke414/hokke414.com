import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { remarkLinkCard } from './src/plugins/remark-link-card.js';

export default defineConfig({
  site: 'https://hokke414.com',
  adapter: vercel(),
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkLinkCard],
  },
});
