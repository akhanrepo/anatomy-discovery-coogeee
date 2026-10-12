import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { loadCorpus } from '../../src/lib/content/load';
import { wordCount, INTRO_WORDS } from '../../src/lib/content/gates';

const c = loadCorpus();

describe('F11 browse pages', () => {
  it('F11-AC4 every tour intro is 120–180 words with verified, resolving claims', () => {
    const logged = new Map(c.logs.map((l) => [l.subject, l]));
    for (const t of c.threads) {
      const n = wordCount(t.intro);
      expect(n, t.id).toBeGreaterThanOrEqual(INTRO_WORDS.min);
      expect(n, t.id).toBeLessThanOrEqual(INTRO_WORDS.max);
      const used = [...t.intro.matchAll(/\[\^([^\]]+)\]/g)].map((m) => m[1]);
      expect(used.length, t.id).toBeGreaterThanOrEqual(4);
      for (const k of used) expect(t.claims[k], `${t.id} ${k}`).toBeDefined();
      expect(['pass', 'pass-with-caveats'], t.id).toContain(logged.get(t.id)?.verdict);
      expect(t.summary.length, t.id).toBeLessThan(t.intro.length);
    }
  });

  it('F11-AC1 routes come only from content: no extra data files, and every person and thread has a static page', () => {
    // the content directory holds exactly the registries the PRD defines, with nothing browse-specific
    const files = readdirSync('content').filter((f) => f.endsWith('.yaml')).sort();
    expect(files).toEqual(['assets.yaml', 'calendar.yaml', 'corrections.yaml', 'eras.yaml', 'misbeliefs.yaml', 'people.yaml', 'share-dates.yaml', 'sources.yaml', 'structures.yaml', 'threads.yaml', 'traditions.yaml']);
    const src = readFileSync('src/pages/people/[id].astro', 'utf8') + readFileSync('src/pages/threads/[id].astro', 'utf8');
    expect(src).toMatch(/getStaticPaths/);
    if (existsSync('dist')) {
      for (const p of c.people) expect(existsSync(`dist/people/${p.id}/index.html`), p.id).toBe(true);
      for (const t of c.threads) expect(existsSync(`dist/threads/${t.id}/index.html`), t.id).toBe(true);
      expect(existsSync('dist/timeline/index.html')).toBe(true);
    }
  });
});
