import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:27061',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: process.env.CI
      ? 'bun run preview -- --host 127.0.0.1 --port 27061 --strictPort'
      : 'bun run dev --port 27061 --strictPort',
    url: 'http://127.0.0.1:27061',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
