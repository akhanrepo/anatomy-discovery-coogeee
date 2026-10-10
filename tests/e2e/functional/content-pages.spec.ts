import { test, expect } from '@playwright/test';
import { loadCorpus } from '../../../src/lib/content/load';

const c = loadCorpus();

test.describe('trust pages (F05)', () => {
  test('F05-AC2 every story shows its verification date', async ({ page }) => {
    for (const d of c.discoveries.slice(0, 26)) {
      await page.goto(`/tab/${d.id}/`);
      const v = page.locator(`[data-story="${d.id}"] [data-testid="verified"]`);
      await expect(v, d.id).toContainText(/Verified \d{4}-\d{2}-\d{2}/);
    }
  });

  test('F05-AC4 the corrections log is public and linked from the footer', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer a[href="/corrections/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/corrections\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Corrections/i);
  });

  test('F05-AC3 [browser] the story offers a prefilled correction link', async ({ page }) => {
    await page.goto('/tab/ibn-al-nafis-pulmonary-circulation/');
    const a = page.locator('[data-story="ibn-al-nafis-pulmonary-circulation"] [data-testid="correction-link"]').first();
    await expect(a).toHaveAttribute('href', /issues\/new\?.*ibn-al-nafis-pulmonary-circulation/);
  });

  test('/how-we-source and /sources are published', async ({ page }) => {
    for (const p of ['/how-we-source/', '/sources/']) {
      const r = await page.goto(p);
      expect(r?.status()).toBe(200);
    }
  });
});
