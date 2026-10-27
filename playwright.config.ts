import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/scenarios',
  outputDir: 'artifacts/media',
  timeout: 30000,
  globalTimeout: 5 * 60 * 1000,
  fullyParallel: true,
  failOnFlakyTests: !!process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    locale: 'en-US',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'off'
  },
  expect: {
    timeout: 10000
  },
  reporter: [
    ['list'],
    ['junit', { outputFile: 'artifacts/results.xml' }],
    [
      'html',
      {
        outputFolder: 'artifacts/report',
        open: 'never'
      }
    ]
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
