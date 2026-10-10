import { chromium } from '@playwright/test';
const out = process.argv[2]; const shots = process.argv.slice(3);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors: string[] = [];
for (const s of shots) {
  const [name, url, w, h, scheme] = s.split('|');
  const p = await b.newPage({ viewport: { width: +w, height: +h }, colorScheme: (scheme as any) || 'light' });
  p.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await p.goto(`http://127.0.0.1:4321${url}`); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${name}.png` }); await p.close();
}
await b.close(); console.log(errors.join('\n') || 'no console errors');
