import { test, expect } from '@playwright/test';

test('F12-AC3 [proxy] purchase is hosted checkout with no accounts, or clearly "coming soon"; school invoices are explained', async ({ page }) => {
  await page.goto('/teachers/');
  await expect(page.locator('input[type="password"], [href*="login"], [href*="signup"]')).toHaveCount(0);
  const buys = page.locator('.btn.buy');
  expect(await buys.count()).toBeGreaterThanOrEqual(6);
  for (const b of await buys.all()) {
    const href = await b.getAttribute('href');
    if (href) expect(href).toMatch(/^https:\/\//); else await expect(b).toContainText('coming soon');
  }
  await expect(page.locator('main')).toContainText(/merchant of record/);
  await expect(page.locator('main')).toContainText(/invoices/);
  await expect(page.locator('main')).toContainText(/No account is needed/);
  const sample = await page.request.get('/packs/sample.pdf');
  expect(sample.status()).toBe(200);
  expect((await sample.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('F14-AC4 [browser] /support publishes the editorial-independence policy', async ({ page }) => {
  await page.goto('/support/');
  await expect(page.getByTestId('sponsor-policy')).toBeVisible();
  await expect(page.locator('main')).toContainText('never review, approve or influence');
});

test('pack preview and edition pages render with a version', async ({ page }) => {
  await page.goto('/packs/circulation/print/');
  await expect(page.getByTestId('pack-version')).toContainText(/Edition [0-9a-f]{8}/);
  await page.goto('/edition/');
  await expect(page.getByTestId('edition-version')).toHaveText(/^[0-9a-f]{8}$/);
  await expect(page.getByTestId('edition-essay-preview')).toContainText('The long view');
});
