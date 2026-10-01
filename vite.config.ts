import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function canonicalUrlPlugin(): Plugin {
  return {
    name: 'canonical-url-plugin',
    transformIndexHtml(html) {
      const canonicalUrl = process.env.CANONICAL_URL || 'https://dev-portfolio-china.vercel.app';
      return html.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), canonicalUrlPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
