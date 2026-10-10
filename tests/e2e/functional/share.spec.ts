import { test, expect } from '@playwright/test';
import { loadCorpus } from '../../../src/lib/content/load';
const c = loadCorpus();
const events = (page: import('@playwright/test').Page) => page.evaluate(() => (window as any).__tabulaEvents as { n: string; p: any }[]);

test('F07-AC1 a shared URL restores the full view state', async ({ page }) => {
  await page.goto('/?y=1543&d=vesalius-fabrica&fig=female&layer=skeleton&lens=chinese-classical');
  await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '1543');
  await expect(page.locator('[data-story="vesalius-fabrica"]')).toBeVisible();
  await expect(page.locator('.figure-stage')).toHaveAttribute('data-fig', 'female');
  await expect(page.locator('.figure-stage')).toHaveAttribute('data-layer', 'skeleton');
  await expect(page.locator('[data-lens-view="chinese-classical"]')).toBeVisible();
  await expect(page.locator('[data-lens-select]')).toHaveValue('chinese-classical');
  // and the URL keeps the state after interaction
  await page.waitForTimeout(400);
  expect(page.url()).toMatch(/y=1543/);
});

test('F07-AC2 [proxy] every tab page carries complete Open Graph and Twitter card tags with a 1200×630 PNG', async ({ page, request }) => {
  for (const d of c.discoveries) {
    await page.goto(`/tab/${d.id}/`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) await expect(page.locator(`meta[property="${p}"]`), `${d.id} ${p}`).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const img = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(img).toMatch(new RegExp(`/og/${d.id}\\.png$`));
    if (d === c.discoveries[0] || d === c.discoveries[25]) {
      const r = await request.get(`/og/${d.id}.png`);
      expect(r.headers()['content-type']).toBe('image/png');
      const buf = await r.body();
      expect(buf.readUInt32BE(16)).toBe(1200);
      expect(buf.readUInt32BE(20)).toBe(630);
    }
  }
});

test('F07-AC3 [browser] /today always shows a card', async ({ page }) => {
  await page.goto('/today/');
  await expect(page.locator('[data-cards] .card:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-cards] .card:not([hidden]) h2')).toHaveText(/.{5,}/);
});

test('F07-AC5 share_click fires', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tab/harvey-circulation/');
  await page.locator('[data-story="harvey-circulation"] [data-share]').click();
  expect((await events(page)).some((e) => e.n === 'share_click' && e.p.discoveryId === 'harvey-circulation')).toBe(true);
});

test('F15-AC3 the subscribe event fires', async ({ page }) => {
  await page.goto('/today/');
  await page.evaluate(() => { (window as any).__tabulaEvents = []; (window as any).tabulaTrack = (n: string, p: unknown) => (window as any).__tabulaEvents.push({ n, p }); });
  await page.locator('[data-subscribe-rss]').first().evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()));
  await page.locator('[data-subscribe-rss]').first().click();
  expect((await events(page)).some((e) => e.n === 'subscribe' && e.p.channel === 'rss')).toBe(true);
});
