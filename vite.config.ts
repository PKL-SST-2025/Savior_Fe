import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  base: '/', // PENTING untuk routing
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // pastikan ini ada saat deploy ke Vercel
  },
});