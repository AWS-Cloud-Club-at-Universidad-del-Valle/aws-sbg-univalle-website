// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://awsunivalle.dev',
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['marked'],
    },
  },
  image: {
    domains: ['avatars.githubusercontent.com', 'upload.wikimedia.org', 'www.univalle.edu.co'],
  },
});
