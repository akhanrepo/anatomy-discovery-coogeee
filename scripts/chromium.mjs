// Finds a Chromium for Playwright (tests and `npm run artefacts`) without pinning a browser version.
// Order: $PLAYWRIGHT_CHROMIUM_PATH, then the sandbox's stable symlink, then Playwright's own install
// (`npx playwright install chromium`, which CI runs), signalled by returning undefined.
import { existsSync } from 'node:fs';

export const CHROMIUM_CANDIDATES = [process.env.PLAYWRIGHT_CHROMIUM_PATH, '/opt/pw-browsers/chromium'];

/** @returns {string | undefined} */
export function chromiumExecutable() {
  return CHROMIUM_CANDIDATES.find((p) => p && existsSync(p));
}
