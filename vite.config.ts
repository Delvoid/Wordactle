import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dist/',
  plugins: [react()],
  // @ts-expect-error
  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: './src/test/test-setup.ts',
  },
})
