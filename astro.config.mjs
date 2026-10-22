// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://reyabolofia.com',
  trailingSlash: 'never',
  // Emit about.html (not about/index.html) so old links like /about.html keep working.
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  image: {
    responsiveStyles: true,
    breakpoints: [480, 720, 960, 1280, 1600, 1920, 2560],
  },
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
