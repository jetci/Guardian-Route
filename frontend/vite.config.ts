import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173, // Fixed port
    strictPort: true, // Fail if port is already in use
    host: true,
    allowedHosts: ['5173-i13bdkfrat7shlhjmjlxg-74f83b17.manus-asia.computer'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
