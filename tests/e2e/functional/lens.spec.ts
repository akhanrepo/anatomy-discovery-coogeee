import { test, expect } from '@playwright/test';
import { loadCorpus } from '../../../src/lib/content/load';
const c = loadCorpus();

test('F10-AC4 the disclaimer appears on every non-modern lens and concept', async ({ page }) => {
  await page.goto('/');
  for (const t of c.traditions) {
    await page.locator('[data-lens-select]').selectOption(t.id);
    const view = page.locator(`[data-lens-view="${t.id}"]`);
    await expect(view).toBeVisible();
    await expect(view.getByTestId('lens-disclaimer')).toHaveText('Historical description, not medical advice.');
    await view.locator('.hotspot').first().click();
    const k = t.concepts[0];
    await expect(page.locator(`[data-concept="${k.id}"] .lens-disclaimer`)).toBeVisible();
  }
  await page.locator('[data-lens-select]').selectOption('modern');
  await expect(page.locator('[data-lens-layer]')).toBeHidden();
});

test('F10-AC3 [browser] while licences are unverified, the schematic, not the original plate, is shown', async ({ page }) => {
  await page.goto('/?lens=ayurveda');
  const view = page.locator('[data-lens-view="ayurveda"]');
  await expect(view.getByTestId('lens-schematic')).toBeVisible();
  await expect(view.getByTestId('lens-original')).toHaveCount(0);
  await expect(view.locator('.lens-credit a')).toHaveAttribute('href', /wellcomecollection\.org/);
});
