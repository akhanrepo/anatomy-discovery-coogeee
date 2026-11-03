## What and why

<!-- What does this change, and why? Link the issue or brief (docs/features/Fxx-…). -->

Closes #

## Type

- [ ] Content (a story, essay, belief, source or correction)
- [ ] Code
- [ ] Docs

## How it was tested

<!-- Tests added or changed. For visual changes, attach before/after screenshots (desktop and phone width). -->

## Checklist

- [ ] `npm test` passes, and `npm run build` passes (it runs the content gates)
- [ ] Every acceptance criterion touched has a test with its ID in the title (`F02-AC3 …`)
- [ ] **Content:** every new or changed claim has at least two sources, one scholarly, and its verification log is re-signed (`npx tsx scripts/write-logs.ts --sign <id>`)
- [ ] **Content:** no content ID was renamed or deleted (they're in shared URLs)
- [ ] Colours, type and spacing come from the tokens in `src/styles/global.css` (`npm run lint`); animations respect `prefers-reduced-motion`
- [ ] `CHANGELOG.md` updated under **Unreleased** (if user-visible)
