import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔴 THIS IS CRITICAL FOR CSS TO LOAD IN APK & NETLIFY
  base: './', 
})