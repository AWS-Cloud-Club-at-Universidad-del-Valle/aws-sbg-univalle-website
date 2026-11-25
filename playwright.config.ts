import { defineConfig, devices } from '@playwright/test';

const PORT = 4377;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'es-CO',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: `npm run build && npx astro preview --ignore-lock --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    env: {
      // Keep Astro 7 attached to Playwright when Astro detects an agent environment.
      ASTRO_PREVIEW_BACKGROUND: '0',
      PUBLIC_KIROTHON_FORM_URL: 'https://kirothon-form.example.test/exec',
    },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
