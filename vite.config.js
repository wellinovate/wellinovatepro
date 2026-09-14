import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        team: resolve(__dirname, 'team.html'),
        process: resolve(__dirname, 'process.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
