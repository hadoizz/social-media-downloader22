import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': {
        target: 'https://media.storyclone.com', // Your target domain
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''), // Rewrite URL if needed
      },
    },
  },
});
