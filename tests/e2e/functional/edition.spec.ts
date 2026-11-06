import { test, expect } from '@playwright/test';
import { loadCorpus } from '../../../src/lib/content/load';

const c = loadCorpus();
const tours = c.threads.map((t) => t.id);

test('F14-AC8 [browser] contents, chapter navigation, plate links and "Read the long version" all land in the right place', async ({ page }) => {
  // the contents page links every chapter, in order
  await page.goto('/edition/');
  const contents = page.getByTestId('edition-contents').locator('h3 a');
  await expect(contents).toHaveCount(tours.length);
  for (const [i, id] of tours.entries()) await expect(contents.nth(i)).toHaveAttribute('href', `/edition/${id}/`);
  await page.getByTestId('start-reading').click();
  await expect(page).toHaveURL(new RegExp(`/edition/${tours[0]}/$`));

  // previous/next walk the whole edition and back
  for (let i = 1; i < tours.length; i++) {
    await page.getByRole('link', { name: /Next chapter/ }).click();
    await expect(page).toHaveURL(new RegExp(`/edition/${tours[i]}/$`));
  }
  await expect(page.getByRole('link', { name: /Next chapter/ })).toHaveCount(0);
  await page.getByRole('link', { name: /Previous chapter/ }).click();
  await expect(page).toHaveURL(new RegExp(`/edition/${tours.at(-2)}/$`));

  // the in-page list jumps to a section, and a plate links to the story on the body
  const t = c.threads[0];
  await page.goto(`/edition/${t.id}/`);
  const plate = c.discoveries.find((d) => d.id === t.discoveries[1])!;
  await page.getByTestId('edition-toc').getByRole('link', { name: new RegExp(`Tab\\. ${plate.plate}:`) }).click();
  await expect(page).toHaveURL(new RegExp(`#${plate.id}$`));
  await expect(page.locator(`#${plate.id}`)).toBeInViewport();
  await page.locator(`#${plate.id}`).getByTestId('on-the-body').click();
  await expect(page).toHaveURL(new RegExp(`/tab/${plate.id}/$`));

  // "Read the long version" on a story goes to its section in its chapter
  await expect(page.locator(`[data-story="${plate.id}"] [data-long-version]`)).toHaveAttribute('href', `/edition/${t.id}/#${plate.id}`);
  await page.locator(`[data-story="${plate.id}"] [data-long-version]`).click();
  await expect(page).toHaveURL(new RegExp(`/edition/${t.id}/#${plate.id}$`));
  await expect(page.locator(`#${plate.id}`)).toBeInViewport();

  // tour pages go to their chapter
  await page.goto(`/threads/${t.id}/`);
  await expect(page.locator('[data-long-version]')).toHaveAttribute('href', `/edition/${t.id}/`);
});

test('a chapter reads end to end: essay, plates, beliefs, and footnotes that go to their notes and back', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`/edition/${tours[0]}/`);
  await expect(page.locator('h1')).toHaveText(c.threads[0].title);
  await expect(page.getByTestId('edition-essay').locator('h2')).toContainText('The long view');
  await expect(page.locator('section[data-kind="plate"]')).toHaveCount(c.threads[0].discoveries.length);
  await expect(page.locator('section[data-kind="belief"]').first()).toBeVisible();
  await expect(page.getByTestId('edition-meta')).toContainText(/words · about \d+ minutes · \d+ notes · edition [0-9a-f]{8}/);
  // no raw footnote syntax leaks into the page
  await expect(page.locator('main')).not.toContainText('[^');
  // footnote 1 → note 1 → back to the text
  await page.locator('sup.fn a[href="#note-1"]').first().click();
  await expect(page).toHaveURL(/#note-1$/);
  await expect(page.locator('#note-1')).toBeInViewport();
  await expect(page.locator('#note-1 .cites li').first()).toBeVisible();
  await page.locator('#note-1').getByRole('link', { name: /Back to the text/ }).click();
  await expect(page.locator('#ref-1')).toBeInViewport();
  // the notes offer a correction with the claim prefilled
  await expect(page.locator('#note-1').getByRole('link', { name: 'Suggest a correction' })).toHaveAttribute('href', /template=correction\.yml.*claim=/);
  expect(errors).toEqual([]);
});

test('the contents page gives each chapter its summary, word count and reading time; chapters read without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/edition/');
  const stats = page.getByTestId('chapter-stats');
  await expect(stats).toHaveCount(tours.length);
  for (const s of await stats.all()) await expect(s).toHaveText(/^\d+ plates · [\d,]+ words · about \d+ minutes$/);
  await expect(page.getByTestId('edition-contents')).toContainText(c.threads[0].summary);
  await page.goto(`/edition/${tours.at(-1)}/`);
  await expect(page.locator('h1')).toHaveText(c.threads.at(-1)!.title);
  await expect(page.getByTestId('edition-notes').locator('li').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to the contents/ })).toHaveAttribute('href', '/edition/');
  await ctx.close();
});
