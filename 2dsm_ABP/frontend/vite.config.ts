  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 5175,
      watch: {
      usePolling: true,
      interval: 100, // Verifica mudanças a cada 100 milissegundos
      },
      proxy: {
        '/api': {
          target: 'http://backend:3666',
          changeOrigin: true,
        },
      },
    },
  });