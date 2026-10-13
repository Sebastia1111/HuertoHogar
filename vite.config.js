import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test:{
    gobals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTest.js'
  },
});
