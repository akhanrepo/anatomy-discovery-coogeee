import { test, expect } from '@playwright/test';

test('zoom: 1× → 2× → 4× enlarges the figure and is reversible (F01 scope)', async ({ page }) => {
  await page.goto('/');
  const h = () => page.locator('[data-stage]').evaluate((e) => e.getBoundingClientRect().height);
  const h1 = await h();
  await page.locator('[data-zoom="1"]').click();
  await expect(page.locator('[data-zoom-level]')).toHaveText('2×');
  expect(await h()).toBeGreaterThan(h1 * 1.8);
  await page.locator('[data-zoom="1"]').click();
  await page.locator('[data-zoom="1"]').click();
  await expect(page.locator('[data-zoom-level]')).toHaveText('4×');
  for (let i = 0; i < 3; i++) await page.locator('[data-zoom="-1"]').click();
  await expect(page.locator('[data-zoom-level]')).toHaveText('1×');
  expect(Math.abs((await h()) - h1)).toBeLessThan(2);
});

test('bad deep links are ignored safely; out-of-range years clamp', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?y=99999&d=not-a-story&layer=nope&fig=x&lens=zzz&m=nope&tour=nope');
  await expect(page.locator('[data-intro]')).toBeVisible();
  const now = Number(await page.locator('[data-slider]').getAttribute('aria-valuemax'));
  await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', String(now));
  await page.goto('/?y=-99999');
  await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '-1600');
  expect(errors).toEqual([]);
});

test('without JavaScript the page still shows the figure, the intro and links to every plate', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('.figure-stage .st[data-id="heart"]')).toBeAttached();
  await expect(page.locator('[data-intro] h1')).toBeVisible();
  await page.goto('/tab/harvey-circulation/');
  await expect(page.locator('[data-story="harvey-circulation"] h2')).toBeVisible();
  await ctx.close();
});

test('storage-blocked browsers still work (sessionStorage throws)', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } }); });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('[data-struct-list] summary').click();
  await page.locator('[data-structure="lungs"]').click();
  await expect(page.locator('.stories > article:not([hidden])')).toHaveCount(1);
  expect(errors).toEqual([]);
});
