import { test, expect, type Page } from '@playwright/test';

const events = (page: Page) => page.evaluate(() => (window as any).__tabulaEvents as { n: string; p: any }[]);
const stateOf = (page: Page, id: string) => page.locator(`.figure-stage .st[data-id="${id}"]`).getAttribute('data-state');

test.describe('F01 interactive body', () => {
  test('F01-AC3 regions are keyboard reachable with a visible focus ring, and the list view offers the same', async ({ page }) => {
    await page.goto('/');
    const heart = page.locator('.flap[data-flap="viscera"] .st[data-id="heart"]');
    await expect(heart).toHaveAttribute('tabindex', '0');
    await heart.focus();
    const stroke = await heart.locator('.ink').first().evaluate((e) => getComputedStyle(e).stroke);
    const gold = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--gold').trim());
    expect(stroke.replace(/\s/g, '')).toBe(hexToRgb(gold));
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-story="harvey-circulation"]')).toBeVisible();
    // list view: every structure is a button
    const listCount = await page.locator('[data-struct-list] [data-structure]').count();
    const artCount = await page.locator('.figure-stage .st').count();
    expect(listCount).toBe(artCount);
    await page.goto('/');
    await page.locator('[data-struct-list] summary').click();
    await page.locator('[data-structure="lungs"]').click();
    await expect(page.locator('.stories > article:not([hidden])')).toHaveCount(1);
  });

  test('F01-AC4 works at 375px without horizontal scroll', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    for (const u of ['/', '/tab/harvey-circulation/', '/about/']) {
      await page.goto(u);
      const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(sw, u).toBeLessThanOrEqual(cw);
    }
    const vp = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(vp).not.toMatch(/user-scalable=no|maximum-scale=1/);
    await ctx.close();
  });

  test('F01-AC5 the figure toggle keeps the year and the open story', async ({ page }) => {
    await page.goto('/tab/harvey-circulation/');
    await page.locator('[data-fig-btn="female"]').click();
    await expect(page.locator('.figure-stage')).toHaveAttribute('data-fig', 'female');
    await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '1628');
    await expect(page.locator('[data-story="harvey-circulation"]')).toBeVisible();
    await expect(page.locator('.st[data-id="uterus"]')).toBeVisible();
    await expect(page.locator('.st[data-id="testes"]')).toBeHidden();
  });
});

test.describe('F02 timeline slider', () => {
  test('F02-AC2 keyboard: arrows step years, PageUp/PageDown step anchors; aria-valuetext has year, caption and count', async ({ page }) => {
    await page.goto('/?y=1242');
    const s = page.locator('[data-slider]');
    await s.focus();
    await page.keyboard.press('ArrowRight');
    await expect(s).toHaveAttribute('aria-valuenow', '1243');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(s).toHaveAttribute('aria-valuenow', '1241');
    await page.keyboard.press('PageUp');
    await expect(s).toHaveAttribute('aria-valuenow', '1242');
    await page.keyboard.press('PageUp');
    await expect(s).toHaveAttribute('aria-valuenow', '1543');
    await page.keyboard.press('PageDown');
    await expect(s).toHaveAttribute('aria-valuenow', '1242');
    const vt = await s.getAttribute('aria-valuetext');
    expect(vt).toMatch(/^1242\. .*Ibn al-Nafis.* \d+ of \d+ structures known\.$/);
  });

  test('F02-AC3 ink-in ≤ 900ms and erasure ≤ 700ms; instant under reduced motion', async ({ page, browser }) => {
    await page.goto('/');
    const timing = await page.evaluate(() => {
      const g = document.querySelector('.st[data-id="heart"]')!;
      const t = (sel: string) => { const cs = getComputedStyle(g.querySelector(sel)!); const ms = (v: string) => Math.max(...v.split(',').map((x) => parseFloat(x) * (x.includes('ms') ? 1 : 1000))); return ms(cs.transitionDuration) + ms(cs.transitionDelay); };
      const mb = getComputedStyle(document.querySelector('.mb path')!);
      return { ink: t('.ink'), hatch: t('.hatch'), wash: t('.wash'), erase: parseFloat(mb.transitionDuration) * (mb.transitionDuration.includes('ms') ? 1 : 1000) };
    });
    expect(Math.max(timing.ink, timing.hatch, timing.wash)).toBeLessThanOrEqual(900);
    expect(timing.erase).toBeLessThanOrEqual(700);
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const p2 = await ctx.newPage();
    await p2.goto('/');
    const rm = await p2.evaluate(() => getComputedStyle(document.querySelector('.st .ink')!).transitionDuration);
    expect(parseFloat(rm)).toBe(0);
    await ctx.close();
  });

  test('F02-AC5 deep link ?y= restores the state exactly', async ({ page }) => {
    await page.goto('/?y=1242');
    await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '1242');
    expect(await stateOf(page, 'lungs')).toBe('understood');
    expect(await stateOf(page, 'heart')).toBe('unknown');
    await expect(page.locator('.mb[data-mb="septal-pores"]')).toHaveAttribute('data-phase', 'partial');
    await expect(page.locator('body')).toHaveAttribute('data-paper', 'vellum');
    await page.goto('/?y=1241');
    expect(await stateOf(page, 'lungs')).toBe('unknown');
  });

  test('dragging the slider changes the year and the ink', async ({ page }) => {
    await page.goto('/');
    const box = (await page.locator('.slider-track').boundingBox())!;
    await page.mouse.click(box.x + 2, box.y + 1);
    const y = Number(await page.locator('[data-slider]').getAttribute('aria-valuenow'));
    expect(y).toBeLessThan(0);
    expect(await stateOf(page, 'heart')).toBe('unknown');
  });
});

test.describe('F03 story panel', () => {
  test('F03-AC1 every discovery renders all 8 sections with a real image', async ({ page }) => {
    await page.goto('/');
    const report = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[data-story]')].map((a) => ({
      id: a.dataset.story,
      ok: [!!a.querySelector('.story-head h2'), !!a.querySelector('.story-plate img[src^="/plates/"]'), !!a.querySelector('.story-body p'),
        [...a.querySelectorAll('h3')].some((h) => /How they knew/i.test(h.textContent!)), [...a.querySelectorAll('h3')].some((h) => /overturned/i.test(h.textContent!)),
        !!a.querySelector('.status-row .badge'), !!a.querySelector('.footnotes li'), !!a.querySelector('.story-nav')],
    })));
    expect(report).toHaveLength(26);
    expect(report.filter((r) => r.ok.includes(false))).toEqual([]);
    const img = await page.request.get('/plates/vesalius-fabrica.svg');
    expect(img.status()).toBe(200);
  });

  test('F03-AC3 the Contested/Revised badge is above the fold on mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    for (const id of ['ibn-al-nafis-pulmonary-circulation', 'huangdi-circulation-myth']) {
      await page.goto(`/tab/${id}/`);
      const b = (await page.locator(`[data-story="${id}"] .status-row .badge`).boundingBox())!;
      expect(b.y + b.height, id).toBeLessThanOrEqual(844);
      expect(b.y, id).toBeGreaterThanOrEqual(0);
    }
    await ctx.close();
  });

  test('F03-AC4 mobile panel: focus-trapped, closes with Esc and the back gesture, focus returns to the structure', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto('/');
    const lungs = page.locator('.flap[data-flap="viscera"] .st[data-id="lungs"]');
    await lungs.focus();
    await page.keyboard.press('Enter');
    const panel = page.locator('[data-panel]');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    for (let i = 0; i < 60; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('[data-panel]')!.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).not.toHaveClass(/is-open/);
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.id)).toBe('lungs');
    // back gesture
    await lungs.focus();
    await page.keyboard.press('Enter');
    await expect(panel).toHaveClass(/is-open/);
    await page.goBack();
    await expect(panel).not.toHaveClass(/is-open/);
    await ctx.close();
  });

  test('F03-AC5 ?y=&d= is deep-linkable, and story_open fires once per open', async ({ page }) => {
    await page.goto('/?y=1700&d=fabricius-venous-valves');
    await expect(page.locator('[data-story="fabricius-venous-valves"]')).toBeVisible();
    await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '1700');
    // story_open is sent a frame after the panel paints (F01-AC2), so wait for it, then check it fired exactly once per open.
    const opens = async () => (await events(page)).filter((e) => e.n === 'story_open').length;
    const settle = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50))));
    await expect.poll(opens).toBe(1);
    await settle();
    expect(await opens()).toBe(1);
    await page.locator('[data-story="fabricius-venous-valves"] [data-open-story]').first().click();
    await expect.poll(opens).toBe(2);
    await settle();
    expect(await opens()).toBe(2);
    await expect(page).toHaveURL(/d=/);
  });

  test('opening a story before its year shows the "not yet discovered" offer', async ({ page }) => {
    await page.goto('/?y=200');
    await page.locator('[data-stay]').check();
    await page.locator('[data-struct-list] summary').click();
    await page.locator('[data-structure="pancreas"]').click();
    await expect(page.locator('[data-story="langerhans-islets"] [data-not-yet]')).toBeVisible();
    await page.locator('[data-story="langerhans-islets"] [data-jump]').click();
    await expect(page.locator('[data-slider]')).toHaveAttribute('aria-valuenow', '1869');
  });
});

test.describe('F09 misbeliefs in red ink', () => {
  test('F09-AC2 [browser] the septal pores fade at 1242 and are scraped away at 1628', async ({ page }) => {
    for (const [y, phase] of [[1000, 'red'], [1242, 'partial'], [1628, 'erased']] as const) {
      await page.goto(`/?y=${y}`);
      await expect(page.locator('.mb[data-mb="septal-pores"]')).toHaveAttribute('data-phase', phase);
    }
  });
  test('beliefs toggle hides the red ink, and a belief opens its own panel', async ({ page }) => {
    await page.goto('/tab/harvey-circulation/');
    await page.locator('[data-story="harvey-circulation"] [data-open-misbelief="liver-makes-blood"]').click();
    await expect(page.locator('[data-misbelief="liver-makes-blood"]')).toBeVisible();
    await page.locator('[data-beliefs-toggle]').uncheck();
    await expect(page.locator('.figure-stage')).toHaveAttribute('data-beliefs', 'off');
  });
});

test.describe('F13 layered dissection', () => {
  test('F13-AC2 every layer is reachable by keyboard and labelled for screen readers', async ({ page }) => {
    await page.goto('/');
    const tabs = page.locator('[role="tab"][data-layer-btn]');
    await expect(tabs).toHaveCount(4);
    await tabs.nth(2).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.figure-stage')).toHaveAttribute('data-layer', 'skeleton');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.figure-stage')).toHaveAttribute('data-layer', 'surface');
    for (const l of ['surface', 'muscles', 'viscera', 'skeleton']) await expect(page.locator(`.flap[data-flap="${l}"] svg`)).toHaveAttribute('aria-label', `${l} layer`);
  });
  test('F13-AC3 opening a story on another layer switches layers and announces it', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-struct-list] summary').click();
    await page.locator('[data-structure="mandible"]').click();
    await expect(page.locator('.figure-stage')).toHaveAttribute('data-layer', 'skeleton');
    await expect(page.locator('[data-announcer]')).toHaveText(/Bones & nerves layer/);
  });
  test('F13-AC4 [proxy] layer art is inline (no network fetch), so the first layer is interactive immediately', async ({ page }) => {
    const art: string[] = [];
    page.on('request', (r) => { if (/\.(svg|png|jpg|webp|avif)$/.test(r.url()) && !/favicon|icon-|plates\//.test(r.url())) art.push(r.url()); });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.flap[data-flap="viscera"] .st[data-id="heart"]').click();
    await expect(page.locator('[data-story="harvey-circulation"]')).toBeVisible();
    expect(art).toEqual([]);
  });
});

test.describe('F16 visual system', () => {
  test('F16-AC2 each ink state is distinguishable without colour (line vs hatch vs ghost)', async ({ page }) => {
    await page.goto('/?y=1869');
    await page.waitForTimeout(1200); // let the ink transitions settle
    const look = (id: string) => page.locator(`.st[data-id="${id}"]`).evaluate((g) => {
      const o = (s: string) => Number(getComputedStyle(g.querySelector(s)!).opacity);
      return { ghost: o('.ghost'), ink: o('.ink'), hatch: g.querySelector('.hatch') ? o('.hatch') : 0, dash: getComputedStyle(g.querySelector('.ghost')!).strokeDasharray };
    });
    const unknown = await look('heart'.replace('heart', 'meningeal-lymphatics'));
    const described = await look('pancreas');
    const understood = await look('heart');
    expect(unknown.ink).toBe(0); expect(unknown.ghost).toBeGreaterThan(0.5); expect(unknown.dash).not.toBe('none');
    expect(described.ink).toBe(1); expect(described.hatch).toBe(0);
    expect(understood.ink).toBe(1); expect(understood.hatch).toBeGreaterThan(0.5);
  });
  for (const scheme of ['light', 'dark'] as const) {
    test(`F16-AC3 text passes WCAG AA in ${scheme} mode`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/about/');
      const ratios = await page.evaluate(() => {
        const rgb = (c: string) => c.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        const lum = ([r, g, b]: number[]) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const ratio = (a: string, b: string) => { const [l1, l2] = [lum(rgb(a)), lum(rgb(b))].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
        const bg = getComputedStyle(document.body).backgroundColor;
        const cs = getComputedStyle(document.documentElement);
        const tok = (n: string) => { const d = document.createElement('i'); d.style.color = `var(${n})`; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; };
        return { body: ratio(getComputedStyle(document.body).color, bg), soft: ratio(tok('--ink-soft'), bg), gold: ratio(tok('--gold'), bg), _: cs.colorScheme };
      });
      expect(ratios.body).toBeGreaterThanOrEqual(4.5);
      expect(ratios.soft).toBeGreaterThanOrEqual(4.5);
      expect(ratios.gold).toBeGreaterThanOrEqual(3); // gold is used for large/display text and accents only
      await ctx.close();
    });
  }
  test('F16-AC5 original-script names render with a proper font (no tofu)', async ({ page }) => {
    await page.goto('/tab/ibn-al-nafis-pulmonary-circulation/');
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(async () => {
      await document.fonts.load('16px Amiri', 'ابن');
      await document.fonts.load('16px "Noto Serif SC"', '銅人');
      await document.fonts.load('16px "Noto Serif Devanagari"', 'सुश्रुत');
      return [document.fonts.check('16px Amiri', 'ابن'), document.fonts.check('16px "Noto Serif SC"', '銅人'), document.fonts.check('16px "Noto Serif Devanagari"', 'सुश्रुत')];
    });
    expect(ok).toEqual([true, true, true]);
    await expect(page.locator('[data-story="ibn-al-nafis-pulmonary-circulation"] .orig[lang="ar"]')).toHaveCSS('font-family', /Amiri/);
  });
});

test.describe('F17 brand', () => {
  test('F17-AC1 name and tagline appear in title, wordmark and manifest', async ({ page, request }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Tabula: The body, as it was written\./);
    await expect(page.locator('.wordmark')).toContainText('Tabula');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Tabula/);
    const mf = await (await request.get('/site.webmanifest')).json();
    expect(mf.name).toBe('Tabula');
  });
  test('F17-AC2 favicon set and manifest exist and are referenced in the head', async ({ page, request }) => {
    await page.goto('/');
    for (const sel of ['link[rel="icon"][href="/favicon.svg"]', 'link[rel="icon"][href="/icon-32.png"]', 'link[rel="apple-touch-icon"][href="/icon-180.png"]', 'link[rel="manifest"][href="/site.webmanifest"]']) await expect(page.locator(sel)).toBeAttached();
    for (const f of ['/favicon.svg', '/icon.svg', '/icon-32.png', '/icon-180.png', '/icon-192.png', '/icon-512.png', '/site.webmanifest']) expect((await request.get(f)).status(), f).toBe(200);
  });
  test('F17-AC4 /about explains the three meanings of the name', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('#the-name + p + ol > li')).toHaveCount(3);
    await expect(page.locator('main')).toContainText('tabula rasa');
    await expect(page.locator('main')).toContainText('Tabulae anatomicae sex');
  });
});

function hexToRgb(h: string) {
  const n = h.replace('#', '');
  return `rgb(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)})`;
}
