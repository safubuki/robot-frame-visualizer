import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // この base プロパティを追加します
  base: "/robot-frame-visualizer/",
  plugins: [react()],
})
