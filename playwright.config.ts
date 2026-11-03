import { defineConfig, devices } from '@playwright/test';
import { chromiumExecutable } from './scripts/chromium.mjs';

const executablePath = chromiumExecutable();
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  timeout: 30_000,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  use: { baseURL: 'http://127.0.0.1:4321', launchOptions },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'smoke', testDir: 'tests/e2e/smoke', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'functional', testDir: 'tests/e2e/functional', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'perf', testDir: 'tests/perf', workers: 1, use: { ...devices['Pixel 7'], launchOptions } },
  ],
});
