# F14 — Edition & sponsorship

**Release:** v1 · **Depends on:** F04, F05, F06, F11, F16; commerce from F12

## Summary
1. **Edition**: a free, book-style long read with one illustrated essay chapter per thread (6 chapters, about 2,500–4,000 words each), high-resolution plates and a full bibliography. Published as **EPUB + PDF**, free, under CC BY-SA 4.0 ([F18](F18-open-source-release.md)). *(Before F18 it was a paid product.)*
2. **Sponsorship**: a tasteful sponsor slot for museums, libraries, learned societies or education publishers, at site level or per thread, under a published editorial-independence policy.

## Edition scope
- Chapters are generated from threads + long-form essays (Markdown with claim frontmatter, in `content/essays/`), and use the same Claim/Citation system. Essays are verified under F05 like everything else.
- Formats: EPUB (pandoc) and print-quality PDF (headless Chromium), published as GitHub Release assets. The `/edition` page has the contents, a sample opening and the downloads. A full web edition is a candidate follow-up.
- "Read the long version" links from each story (F03).
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

## Open questions
- Print-on-demand in v1, or digital only?
