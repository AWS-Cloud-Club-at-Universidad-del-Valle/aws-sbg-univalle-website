// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sbg.univalle.edu.co',
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['avatars.githubusercontent.com', 'upload.wikimedia.org', 'www.univalle.edu.co'],
  },
});
