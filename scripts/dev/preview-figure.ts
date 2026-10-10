// Dev-only: render the figure at several years and screenshot it, to judge the art.
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { loadCorpus } from '../../src/lib/content/load';
import { buildFogModel } from '../../src/lib/model';
import { stateAt, activeMisbeliefs, indexByStructure } from '../../src/lib/state';
import { renderStandalone } from '../../src/art/render';
import { LIGHT, DARK, tokenString } from '../../src/styles/tokens';

const c = loadCorpus(); const m = buildFogModel(c); const idx = indexByStructure(m);
const out = process.argv[2] ?? '/tmp/fig'; mkdirSync(out, { recursive: true });
const years = [200, 1242, 1628, 1950, m.present];
const cells = years.map((y) => {
  const states = Object.fromEntries(c.structures.map((s) => [s.id, stateAt(s.id, y, m, idx)]));
  return ['viscera', 'skeleton'].map((l) => renderStandalone({ fig: 'male', states, phases: activeMisbeliefs(y, m), layers: [l as any, 'skeleton'].filter((v, i, a) => a.indexOf(v) === i) as any, tokens: tokenString(LIGHT), width: 240, height: 600 })).join('');
});
const html = `<html><body style="margin:0;background:#ddd;display:flex;flex-wrap:wrap;gap:4px">${cells.join('')}${renderStandalone({ fig: 'female', states: Object.fromEntries(c.structures.map((s) => [s.id, 'understood'])), phases: {}, tokens: tokenString(DARK), width: 240, height: 600 })}</body></html>`;
writeFileSync(`${out}/fig.html`, html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1500, height: 1250 } });
await p.goto(`file://${out}/fig.html`); await p.screenshot({ path: `${out}/fig.png`, fullPage: true }); await b.close();
console.log(`${out}/fig.png`);
