import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  root: ".",  // ✅ Asegura que la raíz es el directorio actual
  build: {
    outDir: "dist",
  },
})
