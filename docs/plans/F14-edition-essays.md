# Plan F14 (follow-up) — Long-form edition chapters

**Problem:** the edition chapters run about 480–1,460 words against the brief's 2,500–4,000 (open item 1 in `docs/PLAN.md`).

**Approach.**
- A new content type, `content/essays/<thread-id>.md`, holds one long-form essay per tour. Frontmatter has `thread`, `title` and `claims` (same `Claim` schema as the stories); the body is Markdown with `[^eN]` footnotes.
- **The same accuracy rules apply:** every claim needs ≥ 2 counting sources, ≥ 1 of them scholarly; there's a verification log per essay (`claimsHash`); footnotes must resolve; contested claims need a note. The essays synthesise the verified plates and add new claims only where they're freshly researched and cited.
- `buildEdition()` puts each essay after the tour intro and before the plates (as "The long view"). `editionMarkdown()` renders its footnotes.
- The `/edition/` web preview shows the opening of the circulation essay. The full text is only in the paid EPUB/PDF.

**Files:** `src/lib/content/schema.ts` (Essay), `load.ts`, `gates.ts`, `src/lib/edition.ts`, `content/essays/*.md`, `content/sources.yaml` (new sources), `content/logs/essay-*.md`, `scripts/write-logs.ts`, tests.

**Tests (scope, not new ACs):**
- `tests/unit/artefacts.test.ts`: every edition chapter is 2,500–4,000 words; every thread has an essay; essay claims trace to verified claims (extends F14-AC2).
- `tests/unit/gates.test.ts`: an essay with an uncited claim or a dangling footnote fails the gates.

**Risks:** long-form prose invites uncited colour. Mitigation: any sentence stating a fact carries a footnote, or it's cut; interpretation is phrased as interpretation.
