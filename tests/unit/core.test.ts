import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { loadCorpus } from '../../src/lib/content/load';
import { runGates, sourceIdOf } from '../../src/lib/content/gates';
import { structures as art, misbeliefArt } from '../../src/art/figure';
import { renderStory } from '../../src/lib/format';
import { lintTokens } from '../../scripts/lint-tokens';
import { makeScale } from '../../src/lib/scale';
import { parseView, serializeView } from '../../src/lib/url-state';
import { tinyIcon } from '../../scripts/gen-icons';
import { LIGHT } from '../../src/styles/tokens';

const c = loadCorpus();
const src = new Map(c.sources.map((s) => [s.id, s]));

describe('F01 body art ↔ content', () => {
  it('F01-AC1 every structure ID exists exactly once in the art, with matching layer and sex', () => {
    for (const s of c.structures) {
      const matches = art.filter((a) => a.id === s.id);
      expect(matches, s.id).toHaveLength(1);
      expect(matches[0].layer, s.id).toBe(s.layer);
      expect(matches[0].sex ?? 'both', s.id).toBe(s.sex);
    }
    expect(art.filter((a) => !c.structures.some((s) => s.id === a.id)).map((a) => a.id)).toEqual([]);
  });
  it('every misbelief has red-ink art', () => {
    expect(c.misbeliefs.map((m) => m.id).sort()).toEqual(misbeliefArt.map((m) => m.id).sort());
  });
});

describe('F03 story panel content', () => {
  it('F03-AC2 every footnote marker in every story resolves to a claim note', () => {
    for (const d of c.discoveries) {
      const { html, order } = renderStory(d.body, d.id);
      for (const k of order) expect(d.claims[k], `${d.id} [^${k}]`).toBeDefined();
      expect(html).not.toMatch(/\[\^/);
    }
    expect(runGates(c).filter((e) => e.gate === 'dangling-footnote')).toEqual([]);
  });
  it('F03-AC1 [CI] every discovery has an image asset, so no placeholders ship', () => {
    for (const d of c.discoveries) expect(c.assets.some((a) => a.id === d.assets[0]), d.id).toBe(true);
  });
});

describe('F09 misbeliefs', () => {
  it('F09-AC1 each misbelief cites a primary source for the belief and a scholarly source for its correction', () => {
    for (const m of c.misbeliefs) {
      expect(m.claims[m.beliefClaim].citations.some((r) => src.get(sourceIdOf(r))?.type === 'primary'), m.id).toBe(true);
      expect(m.claims[m.correctionClaim].citations.some((r) => src.get(sourceIdOf(r))?.scholarly), m.id).toBe(true);
    }
  });
  it('F09-AC3 red (vermilion) is used only for misbeliefs, and no raw colours leak past the tokens', () => {
    expect(lintTokens('src')).toEqual([]);
  });
});

describe('F02 scale and URL state', () => {
  const s = makeScale([-1600, 200, 1242, 1543, 1628, 1800, 1950, 2026]);
  it('anchors are evenly spaced along the track and the scale round-trips', () => {
    expect(s.toPos(200)).toBeCloseTo(1 / 7);
    expect(s.toPos(1628)).toBeCloseTo(4 / 7);
    for (const y of [-1600, -500, 200, 1242, 1500, 1628, 1700, 1954, 2026]) expect(Math.abs(s.toYear(s.toPos(y)) - y)).toBeLessThanOrEqual(1);
    expect(s.nextAnchor(1300)).toBe(1543);
    expect(s.prevAnchor(1300)).toBe(1242);
  });
  it('F02-AC5 [unit] ?y= parses and serialises losslessly', () => {
    expect(parseView('?y=-300')).toEqual({ y: -300 });
    expect(parseView(serializeView({ y: 1628, d: 'harvey-circulation', fig: 'female', layer: 'viscera', lens: 'ayurveda' }))).toEqual({ y: 1628, d: 'harvey-circulation', fig: 'female', layer: 'viscera', lens: 'ayurveda' });
    expect(parseView('?y=abc&layer=nope&fig=x')).toEqual({});
  });
});

describe('F17 brand', () => {
  it('F17-AC1 [single source] the product name is defined only in src/config/site.ts', () => {
    const files: string[] = [];
    const walk = (d: string) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
    walk('src');
    const offenders = files.filter((f) => f !== 'src/config/site.ts' && /\.(astro|ts)$/.test(f) && /['"`>]Tabula['"`<]/.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
  it('F17-AC3 the 16px icon is legible: two-tone ink and madder survive rasterisation', () => {
    const png = new Resvg(tinyIcon(LIGHT), { fitTo: { mode: 'width', value: 16 } }).render();
    const px = png.pixels;
    const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const near = (rgb: number[], i: number) => Math.abs(px[i] - rgb[0]) + Math.abs(px[i + 1] - rgb[1]) + Math.abs(px[i + 2] - rgb[2]) < 90;
    let ink = 0, madder = 0;
    for (let i = 0; i < px.length; i += 4) { if (near(hex(LIGHT.ink), i)) ink++; if (near(hex(LIGHT.madder), i)) madder++; }
    expect(ink).toBeGreaterThan(8);
    expect(madder).toBeGreaterThan(8);
    expect(readFileSync('public/favicon.svg', 'utf8')).toMatch(/prefers-color-scheme: dark/);
  });
});
