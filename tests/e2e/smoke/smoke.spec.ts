import { test, expect } from '@playwright/test';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Every built HTML page loads with 200, has an <h1> or the app, and throws no console errors. */
function routes(dir = 'dist', base = ''): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return routes(p, `${base}/${f}`);
    return f === 'index.html' ? [`${base}/`] : [];
  });
}
const all = routes();
// sample the 26 tab pages (each is checked fully in functional tests) to keep smoke fast
const pick = all.filter((r) => !r.startsWith('/tab/')).concat(all.filter((r) => r.startsWith('/tab/')).slice(0, 3));

test('smoke: there are pages to check', () => expect(all.length).toBeGreaterThan(20));
for (const r of pick) {
  test(`smoke: ${r} loads cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const res = await page.goto(r);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1, [data-app]').first()).toBeAttached();
    expect(errors).toEqual([]);
  });
}
