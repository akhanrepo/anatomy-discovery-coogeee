import { test, expect } from '@playwright/test';
import { PACKS } from '../../../src/lib/packs';
import { packFile, downloadUrl, EDITION_FILES } from '../../../src/lib/downloads';

const NO_ACCOUNTS = 'input[type="password"], [href*="login"], [href*="signup"], [href*="checkout"]';

test('F12-AC3 F18-AC2 [browser] every pack downloads free, without an account, in A4 and US Letter, under CC BY-SA', async ({ page }) => {
  await page.goto('/teachers/');
  await expect(page.locator(NO_ACCOUNTS)).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/A\$|buy|purchase|coming soon/i);
  await expect(page.getByTestId('pack-terms')).toContainText('Free, with no account needed');
  await expect(page.getByTestId('pack-terms')).toContainText('CC BY-SA 4.0');
  for (const p of PACKS) {
    const item = page.locator(`[data-pack="${p.id}"]`);
    for (const f of ['A4', 'Letter'] as const) await expect(item.locator(`a[href="${downloadUrl(packFile(p.id, f))}"]`)).toHaveCount(1);
  }
  // the pack itself states its licence on the cover
  await page.goto('/packs/circulation/print/');
  await expect(page.getByTestId('pack-licence')).toContainText('CC BY-SA 4.0');
  // the long-standing sample URL keeps working
  const sample = await page.request.get('/packs/sample.pdf');
  expect(sample.status()).toBe(200);
  expect((await sample.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('F18-AC2 [browser] the edition downloads free as EPUB and PDF, and a click fires the download event', async ({ page }) => {
  await page.goto('/edition/');
  await expect(page.locator(NO_ACCOUNTS)).toHaveCount(0);
  await expect(page.getByTestId('edition-version')).toHaveText(/^[0-9a-f]{8}$/);
  await expect(page.getByTestId('edition-licence')).toContainText('CC BY-SA 4.0');
  for (const file of [EDITION_FILES.epub, EDITION_FILES.pdf]) await expect(page.locator(`a[href="${downloadUrl(file)}"]`)).toHaveCount(1);
  // don't follow the link off-site; just check the analytics event
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
  await page.locator(`a[data-download="${EDITION_FILES.pdf}"]`).click({ noWaitAfter: true });
  const events = await page.evaluate(() => (window as unknown as { __tabulaEvents?: { n: string; p: Record<string, unknown> }[] }).__tabulaEvents ?? []);
  expect(events).toContainEqual({ n: 'download', p: { file: EDITION_FILES.pdf } });
});

test('F18-AC3 [browser] the footer states the licences and links the source code', async ({ page }) => {
  await page.goto('/');
  const licence = page.getByTestId('licence');
  await expect(licence).toContainText('CC BY-SA 4.0');
  await expect(licence).toContainText('MIT');
  await expect(page.locator('footer a[href="https://github.com/akhanrepo/tabula"]')).toHaveCount(1);
  await page.goto('/about/#open-source');
  await expect(page.getByTestId('licence-map')).toContainText('CC BY 4.0');
});

test('F14-AC4 [browser] /support publishes the editorial-independence policy', async ({ page }) => {
  await page.goto('/support/');
  await expect(page.getByTestId('sponsor-policy')).toBeVisible();
  await expect(page.locator('main')).toContainText('never review, approve or influence');
  await expect(page.locator('main')).not.toContainText(/classroom packs, the edition and sponsorship/);
});

test('pack preview pages render with a version', async ({ page }) => {
  await page.goto('/packs/circulation/print/');
  await expect(page.getByTestId('pack-version')).toContainText(/Edition [0-9a-f]{8}/);
});
