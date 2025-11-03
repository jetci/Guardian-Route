import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '5173-i13bdkfrat7shlhjmjlxg-74f83b17.manus-asia.computer',
      '.manus-asia.computer',
      'localhost',
    ],
  },
})
