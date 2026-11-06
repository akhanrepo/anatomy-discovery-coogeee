# Plan: F14 web edition

Brief: [F14](../features/F14-sponsorship-and-premium-edition.md), "Web edition" and F14-AC6 to AC8.

## Approach
1. **One source.** The web edition renders `buildEdition()` chapters, the same ones `editionMarkdown()` turns into the EPUB and PDF. Nothing is re-assembled by hand, so the formats can't drift.
2. **Pure renderer** `src/lib/edition-web.ts` (no DOM, unit-tested):
   - `webChapter(c, threadId)` returns the chapter number, title, summary, intro HTML, sections (`essay | plate | belief`, an anchor, title, date and HTML; plates also carry the discovery, method and overturned text), numbered notes, word count, reading minutes, and previous/next.
   - Footnotes `[^subject-key]` are numbered in order of first appearance across the chapter, and each note resolves to the subject's `Claim` (thread, essay, discovery or misbelief).
   - Anchors: a plate section uses the discovery ID, so `/edition/<thread>/#<discovery-id>` lands on it. The essay uses `essay` and a belief uses its misbelief ID.
3. **Pages**
   - `src/pages/edition/[chapter].astro`: the chapter page.
   - `src/pages/edition/index.astro`: becomes the contents page (the sample is no longer needed).
   - `StoryPanel` and the thread page link to the chapter and section.
4. **Styles** in `src/styles/global.css` (`.edition-*`), tokens only, plus print styles.

## Criteria → tests
| AC | Test |
|---|---|
| F14-AC6 | unit `tests/unit/edition-web.test.ts` › `F14-AC6 every chapter renders the same sections in the same order as the EPUB/PDF edition` |
| F14-AC7 | unit `F14-AC7 every footnote becomes a numbered, back-linked note that traces to a verified claim` |
| F14-AC8 | e2e `tests/e2e/functional/edition.spec.ts` › `F14-AC8 [browser] contents, chapter navigation, plate links and "Read the long version" all land in the right place` |

Plus an e2e happy path: a chapter renders its notes and a footnote link scrolls to its note. The smoke suite picks up the six new routes automatically.

## Risks
- **Footnote keys collide across subjects in a chapter.** `buildEdition()` already namespaces them (`[^<subject>-<key>]`), and the renderer resolves the subject by the last hyphen, the same way `editionMarkdown()` does. A unit test covers every chapter.
- **Page weight.** Chapters are long but static text. The perf budget only covers `/`, and the chapter pages ship no JavaScript.
