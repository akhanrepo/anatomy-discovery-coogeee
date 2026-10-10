import { test, expect, type Page } from '@playwright/test';

/** Mid-range phone proxy: Pixel 7 viewport + 4× CPU throttling via CDP. Headless numbers are a proxy, not a device lab. */
async function throttle(page: Page, rate = 4) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  return cdp;
}
async function recordFrames(page: Page, action: () => Promise<void>) {
  await page.evaluate(() => {
    const w = window as any; w.__frames = []; let last = performance.now();
    const loop = (t: number) => { w.__frames.push(t - last); last = t; if (w.__rec) requestAnimationFrame(loop); };
    w.__rec = true; requestAnimationFrame(loop);
  });
  await action();
  return page.evaluate(() => { const w = window as any; w.__rec = false; return (w.__frames as number[]).slice(2); });
}
const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(xs.length * p))];

test('F01-AC2 a tap opens the story in < 100ms with no network on the critical path', async ({ page }) => {
  await page.goto('/');
  await throttle(page);
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  const ms = await page.evaluate(() => new Promise<number>((resolve) => {
    const g = document.querySelector('.flap[data-flap="viscera"] .st[data-id="lungs"] .hit') as SVGElement;
    const t0 = performance.now();
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    requestAnimationFrame(() => {
      const a = document.querySelector('[data-story="ibn-al-nafis-pulmonary-circulation"], [data-story="pulmonary-circulation-europe"], [data-story="malpighi-capillaries"]:not([hidden])');
      resolve(a ? performance.now() - t0 : 9999);
    });
  }));
  expect(ms).toBeLessThan(100);
  expect(requests.filter((u) => !/plates\/|fonts?|woff|favicon|icon-/.test(u)), requests.join(' ')).toEqual([]);
});

for (const id of ['F02-AC4', 'F16-AC1']) {
  test(`${id} dragging the slider holds ~60fps on a throttled phone (p90 frame ≤ 34ms, median ≤ 20ms)`, async ({ page }) => {
    await page.goto('/');
    await throttle(page);
    const box = (await page.locator('.slider-track').boundingBox())!;
    const frames = await recordFrames(page, async () => {
      await page.mouse.move(box.x + box.width - 2, box.y + 1);
      await page.mouse.down();
      for (let i = 0; i <= 60; i++) await page.mouse.move(box.x + box.width * (1 - i / 60), box.y + 1);
      await page.mouse.up();
    });
    expect(frames.length).toBeGreaterThan(20);
    expect(pct(frames, 0.5)).toBeLessThanOrEqual(20);
    expect(pct(frames, 0.9)).toBeLessThanOrEqual(34);
  });
}

test('F13-AC1 flap open/close stays smooth (p90 frame ≤ 34ms) and is instant under reduced motion', async ({ page, browser }) => {
  await page.goto('/');
  await throttle(page);
  const frames = await recordFrames(page, async () => {
    for (const l of ['surface', 'skeleton', 'muscles', 'viscera']) { await page.locator(`[data-layer-btn="${l}"]`).click(); await page.waitForTimeout(750); }
  });
  expect(pct(frames, 0.9)).toBeLessThanOrEqual(34);
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p2 = await ctx.newPage();
  await p2.goto('/');
  expect(parseFloat(await p2.locator('.flap').first().evaluate((e) => getComputedStyle(e).transitionDuration))).toBe(0);
  await ctx.close();
});

test('F16-AC4 first-load payload at mobile size is ≤ 1.5MB', async ({ page }) => {
  let bytes = 0;
  page.on('response', async (r) => { try { bytes += (await r.body()).byteLength; } catch { /* redirects */ } });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(bytes).toBeLessThanOrEqual(1.5 * 1024 * 1024);
});

test('LCP < 2.5s on a throttled 4G connection (PRD performance constraint)', async ({ page }) => {
  const cdp = await throttle(page, 4);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (1 * 1024 * 1024) / 8 });
  await page.goto('/', { waitUntil: 'load' });
  const lcp = await page.evaluate(() => new Promise<number>((res) => {
    new PerformanceObserver((l) => { const e = l.getEntries(); res(e[e.length - 1].startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res(99999), 5000);
  }));
  expect(lcp).toBeLessThan(2500);
});
