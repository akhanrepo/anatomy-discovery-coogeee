# F12 — Classroom packs

**Release:** v1 (3 packs + 1 sample, all free since [F18](F18-open-source-release.md)) · **Depends on:** F04, F05, F06, F11, F16

## Summary
Printable PDF packs for high-school teachers, each built from a thread: plates showing the body at 4 key years, story cards, primary-source extracts, a "spot the myth" activity, discussion questions and an answer key with full sources. They're **generated from the same content**, with no hand-built PDFs.

## Launch packs
| Pack | Thread | Syllabus fit |
|---|---|---|
| Sample: "Galen vs Vesalius" | subset | short introduction |
| The circulation of the blood | circulation | GCSE History "Medicine through time"; NSW Science (nature of science) |
| Myths and "firsts" in medicine | myths | IB TOK, Modern History (source analysis) |
| Seeing the invisible | microscopy | Biology (cells, tissues), nature of science |

## Scope
- Print templates (Paged.js via headless Chromium at build): A4 *and* US Letter, black-and-white friendly, with **black-line versions of the plates** that students can hand-colour as they "write in" knowledge (the F16 metaphor works on paper too).
- Distribution: free downloads, published by the release workflow as GitHub Release assets (F18). The packs are CC BY-SA 4.0, so any teacher or school can copy and adapt them. *(Before F18: paid through Lemon Squeezy, with a school licence at 3× the price.)*
- `/teachers` landing page with sample spreads.

## Acceptance criteria
- [ ] **F12-AC1** Packs regenerate automatically when the underlying content changes, with a version number on the cover.
- [ ] **F12-AC2** Every claim in a pack is traceable to a verified Claim (same IDs).
- [ ] **F12-AC3** Every pack downloads free without an account, in A4 and US Letter, and its licence (CC BY-SA 4.0) is on the cover.

## Open questions
- First market: UK (best fit) or Australia (home)? This sets the syllabus mapping order.
