import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages (https://yuu-eguci.github.io/vue-fullcalendar-study/) で配信するためのパスです。
  base: '/vue-fullcalendar-study/',
  test: {
    // e2e/ は Playwright で実行します。
    include: ['src/**/*.test.js'],
    // UTC と日付がずれる時間帯の挙動を確認できるよう、日本時間で実行します。
    env: { TZ: 'Asia/Tokyo' }
  }
})
