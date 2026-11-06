/** F14 web edition: renders the same `buildEdition()` chapters that become the EPUB and PDF as web pages.
 * Pure (no DOM). Footnotes are numbered through each chapter and resolved to their verified claims. */
import { marked } from 'marked';
import type { Corpus, Claim, Discovery, Misbelief } from './content/schema';
import { buildEdition, type Chapter } from './edition';
import { wordCount } from './content/gates';

export type SectionKind = 'essay' | 'plate' | 'belief';

export interface WebSection {
  kind: SectionKind;
  /** In-page anchor: `essay`, the discovery ID, or the misbelief ID. */
  anchor: string;
  title: string;
  date: string;
  html: string;
  discovery?: Discovery;
  misbelief?: Misbelief;
}

export interface WebNote {
  n: number;
  /** `subject#key`, the claim's stable reference. */
  ref: string;
  subject: string;
  key: string;
  claim: Claim;
}

export interface WebChapter {
  id: string;
  number: number;
  numeral: string;
  title: string;
  summary: string;
  introHtml: string;
  sections: WebSection[];
  notes: WebNote[];
  words: number;
  minutes: number;
  prev?: { id: string; title: string };
  next?: { id: string; title: string };
}

export const WORDS_PER_MINUTE = 230;

export function roman(n: number): string {
  const table: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
  return out;
}

/** The claims a footnote subject owns: a thread, an essay (`essay-<thread>`), a discovery or a misbelief. */
export function claimsOf(c: Corpus, subject: string): Record<string, Claim> | undefined {
  if (subject.startsWith('essay-')) return c.essays.find((e) => `essay-${e.thread}` === subject)?.claims;
  return (c.threads.find((t) => t.id === subject) ?? c.discoveries.find((d) => d.id === subject) ?? c.misbeliefs.find((m) => m.id === subject))?.claims;
}

/** Splits a chapter footnote id (`<subject>-<key>`) at its last hyphen, as `editionMarkdown()` does. */
export function splitFootnote(id: string): { subject: string; key: string } {
  const i = id.lastIndexOf('-');
  return { subject: id.slice(0, i), key: id.slice(i + 1) };
}

export function webChapter(c: Corpus, threadId: string, edition = buildEdition(c)): WebChapter {
  const idx = edition.chapters.findIndex((ch) => ch.id === threadId);
  if (idx < 0) throw new Error(`No edition chapter for thread "${threadId}"`);
  const ch: Chapter = edition.chapters[idx];
  const thread = c.threads.find((t) => t.id === threadId)!;
  const notes: WebNote[] = [];

  // Numbered through the whole chapter in reading order; a repeated footnote reuses its number.
  const render = (md: string) => {
    const withMarkers = md.replace(/\[\^([^\]]+)\]/g, (_, id: string) => {
      const { subject, key } = splitFootnote(id);
      const ref = `${subject}#${key}`;
      let note = notes.find((x) => x.ref === ref);
      let first = false;
      if (!note) {
        const claim = claimsOf(c, subject)?.[key];
        if (!claim) throw new Error(`Edition footnote [^${id}] in "${threadId}" has no claim`);
        note = { n: notes.length + 1, ref, subject, key, claim };
        notes.push(note);
        first = true;
      }
      return `<sup class="fn"><a href="#note-${note.n}"${first ? ` id="ref-${note.n}"` : ''} aria-label="Note ${note.n}">${note.n}</a></sup>`;
    });
    return marked.parse(withMarkers, { async: false }) as string;
  };

  const introHtml = render(ch.intro);
  const sections: WebSection[] = ch.sections.map((s) => {
    const discovery = c.discoveries.find((d) => d.id === s.ref);
    const misbelief = c.misbeliefs.find((m) => m.id === s.ref);
    const kind: SectionKind = s.ref.startsWith('essay-') ? 'essay' : discovery ? 'plate' : 'belief';
    return { kind, anchor: kind === 'essay' ? 'essay' : s.ref, title: s.title, date: s.date, html: render(s.body), discovery, misbelief };
  });

  const words = wordCount(ch.intro) + ch.sections.reduce((n, s) => n + wordCount(s.body), 0);
  const link = (i: number) => (i >= 0 && i < edition.chapters.length ? { id: edition.chapters[i].id, title: edition.chapters[i].title } : undefined);
  return {
    id: ch.id,
    number: idx + 1,
    numeral: roman(idx + 1),
    title: ch.title,
    summary: thread.summary,
    introHtml,
    sections,
    notes,
    words,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    prev: link(idx - 1),
    next: link(idx + 1),
  };
}

export function webEdition(c: Corpus): WebChapter[] {
  const e = buildEdition(c);
  return e.chapters.map((ch) => webChapter(c, ch.id, e));
}
