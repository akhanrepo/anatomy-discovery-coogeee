import { test, expect } from '@playwright/test';
import { loadCorpus } from '../../../src/lib/content/load';
const c = loadCorpus();

test('F11-AC2 tours are keyboard operable with pause and resume', async ({ page }) => {
  const t = c.threads.find((x) => x.id === 'circulation')!;
  await page.goto('/threads/circulation/');
  await page.getByRole('link', { name: /Play this tour/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/tour=circulation/);
  await expect(page.locator(`[data-story="${t.discoveries[0]}"]`)).toBeVisible();
  const bar = page.locator('[data-tour-bar]');
  await expect(bar).toBeVisible();
  await bar.getByRole('button', { name: 'Next' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(`[data-story="${t.discoveries[1]}"]`)).toBeVisible();
  await bar.getByRole('button', { name: 'Previous' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(`[data-story="${t.discoveries[0]}"]`)).toBeVisible();
  const pause = bar.locator('[data-tour-pause]');
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await pause.focus();
  await page.keyboard.press('Enter');
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  await expect(pause).toHaveText(/Resume/);
  await page.keyboard.press('Enter');
  await expect(pause).toHaveAttribute('aria-pressed', 'false');
  await bar.getByRole('button', { name: 'Exit tour' }).click();
  await expect(bar).toBeHidden();
});

test('F11-AC3 every person page links to every discovery and misbelief they are part of', async ({ page }) => {
  for (const p of c.people) {
    await page.goto(`/people/${p.id}/`);
    for (const d of c.discoveries.filter((x) => x.people.includes(p.id))) await expect(page.locator(`a[href="/tab/${d.id}/"]`), `${p.id} → ${d.id}`).toHaveCount(1);
    for (const m of c.misbeliefs.filter((x) => x.heldBy.includes(p.id))) await expect(page.locator(`a[data-misbelief-link="${m.id}"]`), `${p.id} → ${m.id}`).toHaveCount(1);
  }
});

test('timeline lists every plate and belief in date order', async ({ page }) => {
  await page.goto('/timeline/');
  await expect(page.locator('[data-timeline-item]')).toHaveCount(c.discoveries.length + c.misbeliefs.length);
});

test('F11-AC4 the tour page shows the ~150-word intro with numbered sources, and lists use the one-line summary', async ({ page }) => {
  const t = c.threads.find((x) => x.id === 'hidden-vessels')!;
  await page.goto(`/threads/${t.id}/`);
  await expect(page.getByTestId('tour-intro')).toContainText('Aselli');
  const notes = page.locator('[data-testid="tour-intro"] sup.fn');
  await expect(notes).toHaveCount([...t.intro.matchAll(/\[\^/g)].length);
  await expect(page.getByTestId('tour-sources').locator('> li')).toHaveCount(Object.keys(t.claims).length);
  await notes.first().locator('a').click();
  await expect(page).toHaveURL(/#fn-hidden-vessels-t1$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.summary);
  await page.goto('/threads/');
  await expect(page.locator('main')).toContainText(t.summary);
});
