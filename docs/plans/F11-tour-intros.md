# Plan: F11 tour intros at about 150 words (open item 2)

The F11 brief says "Thread intros (≈ 150 words) are verified like everything else". The v1 intros are one-line summaries (about 25 words) with no claims. This closes that gap.

## Approach
- **Split the field.** `Thread.summary` (new, required) holds the existing one-liner. It's used wherever a short text is needed: tour lists, the edition table of contents, meta descriptions. `Thread.intro` becomes the 120–180-word Markdown intro, with `[^tN]` footnotes pointing to `Thread.claims` (the schema already has the field, and the gates already check it).
- **Gates** (same as stories and essays):
  - every intro footnote resolves to a thread claim (`dangling-footnote`);
  - the intro is 120–180 words (`intro-length`);
  - claims follow the two-source and scholarly rules;
  - a verification log exists per thread (`checkLog` already runs when claims exist).
- **Claims reuse verified wording** from the plates and essays with the same sources, so no new historical assertions enter the corpus without verification.
- **Rendering:**
  - `/threads/[id]` renders the intro with `renderStory` plus a numbered source list;
  - the edition chapter uses the intro with footnotes namespaced `[^<thread>-tN]`, and adds the thread claims to `chapter.claims` (ref `<thread>#tN`);
  - `contentVersion` includes thread claims.

## Files
- `content/threads.yaml`
- `content/logs/<thread>.md` (6 new)
- `scripts/write-logs.ts`
- `src/lib/content/{schema,gates}.ts`
- `src/lib/{edition,version}.ts`
- `src/pages/threads/{index,[id]}.astro`
- `src/pages/edition/index.astro`
- tests

## Acceptance criteria → tests
- New **F11-AC4**: every tour intro is 120–180 words, with every factual sentence footnoted to a verified thread claim.
  - `tests/unit/browse.test.ts`: "F11-AC4 every tour intro is 120–180 words with verified, resolving claims".
  - `tests/unit/gates.test.ts`: "F11-AC4 intro with a dangling footnote fails" and "F11-AC4 intro outside 120–180 words fails".
  - `tests/e2e/functional/browse.spec.ts`: "F11-AC4 the tour page shows the intro with its sources".
- F14-AC2 (edition claims trace to verified claims) is extended to thread refs. F14-AC5 (chapter length) still holds; each chapter grows by about 125 words.

## Risks
- Adding intros pushes chapters up; the maximum is 4,000 words and the current largest is 2,662, so this is safe.
- A meta description must stay plain text, so it uses `summary`, never the Markdown intro.
