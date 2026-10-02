// @ts-check
import { defineConfig } from 'astro/config';
import imageSize from './src/plugins/image-size.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://mt-shindan.com',
  integrations: [imageSize()],
});
