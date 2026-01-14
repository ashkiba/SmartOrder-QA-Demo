import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* اجرای تست‌ها به صورت سریالی برای جلوگیری از تداخل در دیتابیس */
  fullyParallel: false,
  workers: 1,
  
  reporter: 'html',
  use: {
    /* پورت 8080 برای فرانت‌اندر است */
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});