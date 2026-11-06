# F14 — Edition & sponsorship

**Release:** v1 · **Depends on:** F04, F05, F06, F11, F16; commerce from F12

## Summary
1. **Edition**: a free, book-style long read with one illustrated essay chapter per thread (6 chapters, about 2,500–4,000 words each), high-resolution plates and a full bibliography. Published **on the web** and as **EPUB + PDF**, free, under CC BY-SA 4.0 ([F18](F18-open-source-release.md)). *(Before F18 it was a paid product.)*
2. **Sponsorship**: a tasteful sponsor slot for museums, libraries, learned societies or education publishers, at site level or per thread, under a published editorial-independence policy.

## Edition scope
- Chapters are generated from threads + long-form essays (Markdown with claim frontmatter, in `content/essays/`), and use the same Claim/Citation system. Essays are verified under F05 like everything else.
- Formats: the **web edition** (`/edition/<thread>/`, one page per chapter), EPUB (pandoc) and print-quality PDF (headless Chromium). EPUB and PDF are published as GitHub Release assets. All three come from the same `buildEdition()` chapters, so they never drift apart.
- "Read the long version" links from each story (F03) go to that story's section in its chapter; tour pages link to their chapter.

## Web edition (added 2026-11-03)
- `/edition` is the contents page: every chapter with its summary, word count and reading time, a "Start reading" link, the downloads, the version and the licence.
- `/edition/<thread>/` is one chapter: the chapter number and title, the tour intro, an in-page list of sections, then the long-view essay, every plate (its plate image, date, "how they knew" and "what it overturned", and a link to it on the body), and the beliefs it overturned (in red ink, which stays reserved for misbeliefs).
- Footnotes are numbered through the chapter. Each opens a note at the end with the claim, its status (contested, revised, read via summaries) and its full citations, a link back to the text, and "Suggest a correction".
- Previous/next chapter links, and the downloads and licence at the foot of every chapter.
- Reading-first typography: a measure of about 65 characters, no app chrome, and print styles that hide navigation. Works without JavaScript.
- Print-on-demand: **open question** (cost and fulfilment).

## Sponsorship scope
- `/support` page: what sponsorship funds and the editorial-independence policy.
- Sponsor credit line on the home page footer and on sponsored thread pages: "This thread is supported by ...". No logos inside stories.
- Policy (public): sponsors never review, approve or influence content. Excluded: pharma and medical-device companies (recommended, pending decision).

## Acceptance criteria
- [ ] **F14-AC1** The edition regenerates from content. Its version number matches the site's content version.
- [ ] **F14-AC2** Every edition claim traces to a verified Claim.
- [ ] **F14-AC3** Edition and pack images are all licensed for commercial reuse (no NC or SA), so the CC BY-SA artefacts can be redistributed freely (CI, F06).
- [ ] **F14-AC4** The sponsor policy is published before any sponsor appears.
- [ ] **F14-AC5** Every thread has a long-view essay (`content/essays/<thread>.md`), and each chapter (thread intro + essay + stories + beliefs) is 2,500–4,000 words. Essays pass the same F05 gates as stories.

- [ ] **F14-AC6** Every chapter is readable on the site at `/edition/<thread>/`, with the same sections in the same order as the EPUB and PDF (all built from `buildEdition()`).
- [ ] **F14-AC7** Every footnote in a web chapter becomes a numbered marker that links to a note showing the claim, its status and its sources, and the note links back. No raw `[^…]` markers remain, and every note traces to a verified claim.
- [ ] **F14-AC8** The edition is navigable: `/edition` links every chapter; each chapter has previous/next links and an in-page section list; each plate section links to the story on the body; "Read the long version" on a story goes to its section in the chapter, and tour pages go to their chapter.

## Open questions
- Print-on-demand in v1, or digital only?
