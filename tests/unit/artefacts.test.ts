import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { loadCorpus } from '../../src/lib/content/load';
import { PACKS, buildPack } from '../../src/lib/packs';
import { buildEdition, editionMarkdown } from '../../src/lib/edition';
import { contentVersion } from '../../src/lib/version';
import { runGates, wordCount } from '../../src/lib/content/gates';
import { sponsorsVisible } from '../../src/lib/sponsors';
import { LICENCES } from '../../src/lib/content/schema';

const c = loadCorpus();
const verified = new Set(c.logs.map((l) => l.subject));
const resolves = (ref: string) => {
  const [subj, key] = ref.split('#');
  const owner = c.discoveries.find((d) => d.id === subj) ?? c.misbeliefs.find((m) => m.id === subj) ?? c.essays.find((e) => `essay-${e.thread}` === subj) ?? c.threads.find((t) => t.id === subj);
  return !!owner && !!owner.claims[key] && verified.has(subj);
};

describe('F12 classroom packs', () => {
  it('F12-AC1 packs regenerate from content and carry a version that changes when a claim changes', () => {
    const v1 = buildPack(c, 'circulation').version;
    expect(v1).toBe(contentVersion(c));
    const edited = structuredClone(c);
    edited.discoveries[0].claims[Object.keys(edited.discoveries[0].claims)[0]].text += ' (edited)';
    expect(contentVersion(edited)).not.toBe(v1);
    expect(readFileSync('src/pages/packs/[id]/print.astro', 'utf8')).toMatch(/data-testid="pack-version">Edition \{p\.version\}/);
    for (const def of PACKS) expect(buildPack(c, def.id).discoveries.length, def.id).toBeGreaterThanOrEqual(3);
  });
  it('F12-AC2 every claim in every pack traces to a verified claim by ID', () => {
    expect(runGates(c)).toEqual([]);
    for (const def of PACKS) {
      const p = buildPack(c, def.id);
      for (const k of p.claims) expect(resolves(k.ref), `${def.id} ${k.ref}`).toBe(true);
      for (const m of p.myths) expect(resolves(m.ref), `${def.id} ${m.ref}`).toBe(true);
    }
  });
});

describe('F14 edition and sponsorship', () => {
  const e = buildEdition(c);
  it('F14-AC1 the edition is generated from content and its version matches the site content version', () => {
    expect(e.version).toBe(contentVersion(c));
    expect(e.chapters.map((ch) => ch.id)).toEqual(c.threads.map((t) => t.id));
  });
  it('F14-AC2 every edition claim traces to a verified claim', () => {
    for (const ch of e.chapters) for (const k of ch.claims) expect(resolves(k.ref), k.ref).toBe(true);
  });
  it('F14-AC3 every image in packs and the edition is commercially licensed', () => {
    const used = new Set([...e.images, ...PACKS.flatMap((d) => buildPack(c, d.id).discoveries.map((x) => x.assets[0]))]);
    for (const id of used) {
      const a = c.assets.find((x) => x.id === id)!;
      expect((LICENCES as readonly string[]).includes(a.licence), id).toBe(true);
      expect(a.licence).not.toMatch(/NC|SA/);
    }
  });
  it('F14-AC5 every thread has a long-view essay and every chapter is 2,500–4,000 words', () => {
    expect(c.essays.map((x) => x.thread).sort()).toEqual(c.threads.map((t) => t.id).sort());
    for (const ch of e.chapters) {
      expect(ch.sections[0].ref, ch.id).toBe(`essay-${ch.id}`);
      const words = wordCount(ch.intro) + ch.sections.reduce((n, s) => n + wordCount(s.body), 0);
      expect(words, ch.id).toBeGreaterThanOrEqual(2500);
      expect(words, ch.id).toBeLessThanOrEqual(4000);
    }
  });
  it('F14-AC5 essay footnotes become chapter footnotes with their sources in the edition markdown', () => {
    const md = editionMarkdown(e);
    for (const x of c.essays) for (const k of Object.keys(x.claims)) expect(md, `${x.thread} ${k}`).toContain(`[^essay-${x.thread}-${k}]: `);
    expect(md).not.toMatch(/\[\^e\d+\]/);
  });
  it('F14-AC4 sponsors render only once the editorial-independence policy page exists', () => {
    expect(existsSync('src/pages/support.astro')).toBe(true);
    expect(sponsorsVisible('src/pages/does-not-exist.astro')).toEqual([]);
    expect(readFileSync('src/layouts/Layout.astro', 'utf8')).toMatch(/sponsorsVisible\(\)/);
    expect(readFileSync('src/layouts/Layout.astro', 'utf8')).not.toMatch(/site\.sponsors/);
  });
});
