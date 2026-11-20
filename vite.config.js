import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Microservicios HuertoHogar (backend Spring Boot):
//   usuarios (8082): /api/auth y /api/usuarios
//   tienda   (8083): /api/tienda y /api/inventario
const proxy = {
  '/api/auth': { target: 'http://localhost:8082', changeOrigin: true },
  '/api/usuarios': { target: 'http://localhost:8082', changeOrigin: true },
  '/api/tienda': { target: 'http://localhost:8083', changeOrigin: true },
  '/api/inventario': { target: 'http://localhost:8083', changeOrigin: true }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy
  },
  // npm run preview (build de producción) usa el mismo enrutamiento
  preview: {
    port: 4173,
    proxy
  },
  test:{
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTest.js'
  },
});
