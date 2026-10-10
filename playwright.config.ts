import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
].filter(Boolean) as string[];
const executablePath = candidates.find((p) => existsSync(p));
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  timeout: 30_000,
  retries: 0,
  reporter: [['list']],
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
