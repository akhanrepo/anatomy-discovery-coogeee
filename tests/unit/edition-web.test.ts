import { describe, it, expect } from 'vitest';
import { loadCorpus } from '../../src/lib/content/load';
import { buildEdition, editionMarkdown } from '../../src/lib/edition';
import { webEdition, webChapter, roman, splitFootnote } from '../../src/lib/edition-web';

const c = loadCorpus();
const e = buildEdition(c);
const web = webEdition(c);
const verified = new Set(c.logs.map((l) => l.subject));

describe('F14 web edition', () => {
  it('F14-AC6 every chapter renders the same sections in the same order as the EPUB/PDF edition', () => {
    expect(web.map((w) => w.id)).toEqual(e.chapters.map((ch) => ch.id));
    expect(web.map((w) => w.id)).toEqual(c.threads.map((t) => t.id));
    for (const [i, w] of web.entries()) {
      const ch = e.chapters[i];
      expect(w.title).toBe(ch.title);
      expect(w.sections.map((s) => s.title), w.id).toEqual(ch.sections.map((s) => s.title));
      // essay first, then a plate per discovery in the tour's order, then the beliefs they overturned
      expect(w.sections[0].kind, w.id).toBe('essay');
      const t = c.threads.find((x) => x.id === w.id)!;
      expect(w.sections.filter((s) => s.kind === 'plate').map((s) => s.anchor), w.id).toEqual(t.discoveries);
      for (const s of w.sections.filter((x) => x.kind === 'belief')) expect(c.misbeliefs.some((m) => m.id === s.anchor), s.anchor).toBe(true);
      // anchors are unique within a chapter, so links can land on them
      expect(new Set(w.sections.map((s) => s.anchor)).size, w.id).toBe(w.sections.length);
      // the same 2,500–4,000 words as F14-AC5, and a sensible reading time
      expect(w.words, w.id).toBeGreaterThanOrEqual(2500);
      expect(w.words, w.id).toBeLessThanOrEqual(4000);
      expect(w.minutes, w.id).toBe(Math.round(w.words / 230));
      // the essay's own subheadings survive as subheadings
      expect(w.sections[0].html, w.id).toMatch(/<h3[ >]/);
    }
    // previous/next form one chain through the edition
    expect(web[0].prev).toBeUndefined();
    expect(web.at(-1)!.next).toBeUndefined();
    for (let i = 1; i < web.length; i++) {
      expect(web[i].prev?.id).toBe(web[i - 1].id);
      expect(web[i - 1].next?.id).toBe(web[i].id);
    }
    expect(web.map((w) => w.numeral)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI'].slice(0, web.length));
    expect(roman(4)).toBe('IV');
    expect(roman(9)).toBe('IX');
  });

  it('F14-AC7 every footnote becomes a numbered, back-linked note that traces to a verified claim', () => {
    for (const w of web) {
      const html = [w.introHtml, ...w.sections.map((s) => s.html)].join('\n');
      expect(html, w.id).not.toMatch(/\[\^/);
      // notes are numbered 1..n in reading order, each marker points at an existing note
      expect(w.notes.map((n) => n.n), w.id).toEqual(w.notes.map((_, i) => i + 1));
      const markers = [...html.matchAll(/href="#note-(\d+)"/g)].map((m) => Number(m[1]));
      expect(new Set(markers).size, w.id).toBe(w.notes.length);
      // first appearance of each note carries the back-link target, exactly once
      for (const n of w.notes) expect(html.match(new RegExp(`id="ref-${n.n}"`, 'g'))?.length, `${w.id} ${n.n}`).toBe(1);
      // first appearances are in ascending order (numbered as read)
      const firsts = [...html.matchAll(/id="ref-(\d+)"/g)].map((m) => Number(m[1]));
      expect(firsts, w.id).toEqual([...firsts].sort((a, b) => a - b));
      for (const n of w.notes) {
        expect(verified.has(n.subject), `${w.id} ${n.ref} has a verification log`).toBe(true);
        expect(n.claim.citations.length, n.ref).toBeGreaterThan(0);
      }
      // the web chapter cites exactly the claims the EPUB/PDF chapter footnotes
      const md = editionMarkdown({ ...e, chapters: [e.chapters.find((ch) => ch.id === w.id)!] });
      const mdRefs = new Set([...md.matchAll(/^\[\^([^\]]+)\]: /gm)].map((m) => { const { subject, key } = splitFootnote(m[1]); return `${subject}#${key}`; }));
      expect(new Set(w.notes.map((n) => n.ref)), w.id).toEqual(mdRefs);
    }
  });

  it('rejects a footnote with no claim and an unknown chapter', () => {
    const broken = structuredClone(c);
    broken.threads[0].intro += ' Unsupported.[^zz9]';
    expect(() => webChapter(broken, broken.threads[0].id)).toThrow(/has no claim/);
    expect(() => webChapter(c, 'no-such-tour')).toThrow(/No edition chapter/);
  });
});
