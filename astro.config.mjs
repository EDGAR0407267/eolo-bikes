import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://eolobikes.com',
  build: {
    assets: 'assets',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
