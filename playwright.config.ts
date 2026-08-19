import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  reporter: [['list']],
  outputDir: 'output/playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
  },
  projects: [
    {
      name: 'msedge-mobile',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: 'node scripts/serve-static.mjs dist 4321 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
