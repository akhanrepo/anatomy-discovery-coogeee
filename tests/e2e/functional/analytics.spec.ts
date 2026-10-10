import { test, expect } from '@playwright/test';
const events = (page: import('@playwright/test').Page) => page.evaluate(() => (window as any).__tabulaEvents as { n: string; p: Record<string, unknown> }[]);

test('F08-AC1 no cookies and no personal data in events', async ({ page, context }) => {
  await page.goto('/');
  await page.locator('[data-struct-list] summary').click();
  for (const s of ['lungs', 'heart', 'brain']) await page.locator(`[data-structure="${s}"]`).click();
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  const keys = new Set((await events(page)).flatMap((e) => Object.keys(e.p ?? {})));
  for (const k of keys) expect(['discoveryId', 'source', 'toYear', 'method', 'layer', 'lens', 'misbeliefId', 'channel', 'product']).toContain(k);
});

test('F08-AC2 opening 3 distinct stories fires stories_3plus exactly once', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-struct-list] summary').click();
  for (const s of ['lungs', 'heart', 'lungs', 'brain', 'mandible']) await page.locator(`[data-structure="${s}"]`).click();
  await page.waitForTimeout(300);
  expect((await events(page)).filter((e) => e.n === 'stories_3plus')).toHaveLength(1);
});
