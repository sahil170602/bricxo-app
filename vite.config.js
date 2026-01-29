import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CHANGE THIS LINE: set base to './' so assets load correctly in the APK
  base: './', 
})