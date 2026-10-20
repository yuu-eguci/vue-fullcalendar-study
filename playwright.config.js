import { defineConfig, devices } from '@playwright/test'

// BASE_URL を指定した場合は、そのサーバ (たとえば docker compose up で起動したもの) に対してテストします。
// 指定しない場合は build したものを vite preview で起動してテストします。
const baseURL = process.env.BASE_URL ?? 'http://localhost:4173/vue-fullcalendar-study/'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    timezoneId: 'Asia/Tokyo'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
      command: 'npm run build && npm run preview -- --port 4173 --strictPort',
      url: baseURL
    }
})
