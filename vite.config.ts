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
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your Axum backend address
          changeOrigin: true,
        },
      },
    },
  build: {
    target: 'esnext',
    outDir: 'dist', // pastikan ini ada saat deploy ke Vercel
  },
});