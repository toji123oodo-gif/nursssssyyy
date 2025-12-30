import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Serve files from the project root
  base: '/', // Changed from './' to '/' for Cloudflare Pages / SPA routing
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // Alias @ to the root directory
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  }
});