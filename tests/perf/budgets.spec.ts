import { test, expect } from '@playwright/test';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadCorpus } from '../../src/lib/content/load';

const c = loadCorpus();
const DIST = 'dist';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test.describe('static budgets', () => {
  test.skip(!existsSync(DIST), 'needs a build');

  test('F06-AC3 every story image is ≤ 200KB', async ({ request }) => {
    for (const d of c.discoveries) {
      const r = await request.get(`/plates/${d.id}.svg`);
      expect(r.status(), d.id).toBe(200);
      const bytes = (await r.body()).byteLength;
      expect(bytes, `${d.id}: ${bytes} bytes`).toBeLessThanOrEqual(200 * 1024);
    }
  });

  test('JS shipped to the browser stays under 120KB gzip-equivalent (≈ 360KB raw)', () => {
    const js = walk(DIST).filter((f) => f.endsWith('.js'));
    const total = js.reduce((n, f) => n + statSync(f).size, 0);
    expect(total).toBeLessThanOrEqual(360 * 1024);
  });
});
