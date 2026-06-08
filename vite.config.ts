import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@' вказує на папку src — зручний імпорт без довгих відносних шляхів
      '@': path.resolve(__dirname, './src'),
    },
  },
})
