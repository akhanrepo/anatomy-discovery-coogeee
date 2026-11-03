# CLAUDE.md

## What this is
**Tabula**: an interactive, engraved human body where every part carries the story of who figured it out, how, and what they got wrong first. A timeline slider "writes in" the body as knowledge arrived over 3,600 years.
It is **open source**: code MIT, written content CC BY-SA 4.0, plates CC BY 4.0 (F18). Contributors are strangers, so keep `README.md`, `CONTRIBUTING.md` and `docs/architecture.md` accurate when you change how things work.
See `docs/PRD.md` for full context. Feature specs live in `docs/features/` (F01–F18). The build plan and status are in `docs/PLAN.md`. Per-feature plans are in `docs/plans/`.

## Stack
- **Astro 7 + TypeScript (strict)**, static output (`dist/`). Everything is server-rendered: every structure, story panel and misbelief is in the HTML. A small **vanilla TypeScript** controller (`src/client/`) adds the slider, flaps, panel and lens behaviour. No UI framework and no custom backend.
- **Content as code:** YAML + Markdown in `content/`, loaded and validated with **Zod** (`src/lib/content/`). The same loader serves Astro pages, scripts and tests.
- **Art:** inline SVG (line art, hit regions, hatching patterns) + CSS paper textures. Design tokens are CSS custom properties in `src/styles/global.css`, mirrored in `src/styles/tokens.ts`.
- **Build-time generation:** OG/share images (satori + resvg), RSS, classroom-pack PDFs (Playwright `page.pdf`), edition EPUB (pandoc). Packs and the edition are free downloads, published as GitHub Release assets by `.github/workflows/release.yml` on a `vX.Y.Z` tag. `src/lib/downloads.ts` is the one list of their file names.
- **Hosting:** Netlify (static). CI: GitHub Actions (`ci.yml`, `codeql.yml`, `release.yml`). Email: Buttondown. Analytics: Plausible (cookieless). Contact email and donate link are optional too. All are **config-driven and disabled until configured** in `src/config/site.ts`. There is no commerce (removed in F18).

## Commands
- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build` (runs content validation first and fails on any content gate)
- Unit + content + traceability tests: `npm test` (Vitest, fast; this is what the hook runs)
- Smoke + functional (browser): `npm run test:e2e` (Playwright against `npm run preview`; needs a build)
- Performance budgets: `npm run test:perf`
- Everything: `npm run test:all`
- Lint/typecheck: `npm run lint` (`astro check` + design-token lint)
- Validate content only: `npm run validate`
- Generate packs/edition artefacts: `npm run artefacts`

Playwright finds Chromium via `scripts/chromium.mjs`: `PLAYWRIGHT_CHROMIUM_PATH`, then `/opt/pw-browsers/chromium`, then Playwright's own install. In this sandbox, never run `playwright install` (CI does).

## Scope (v1, everything ships together)
F16 visual system · F17 name/icon · F04 26 discoveries · F05 citations/verification · F06 image provenance · F01 body (male/female) · F13 flaps · F02 slider/fog · F03 story panel · F09 misbeliefs · F11 timeline/people/threads · F10 traditions lens · F07 share cards · F15 RSS/email · F08 analytics · F12 classroom packs · F14 edition + sponsorship · F18 open-source release.

## Explicit non-goals (say no, even if it's tempting)
True 3D body · user accounts/comments/UGC · comprehensive anatomy (stay at ~40 structures) · clinical or reference-atlas accuracy · a CMS/admin UI · native apps · AI-generated artwork · automated social posting · anything that needs a custom server.

## How we work (rules)
1. **One feature at a time, from its brief.** Build only what the brief in `docs/features/` says. If the brief is wrong or unclear, update the brief (and the PRD if scope changes) first, then build.
2. **Plan before implementing.** In interactive sessions, enter **Plan Mode** before implementing each feature. In autonomous build runs (agreed with Ali), write the plan to `docs/plans/Fxx.md` and commit it before the code. A plan lists: approach, files, each acceptance criterion → test name, and risks.
3. **Every acceptance criterion maps to a test.** Criteria have IDs (`F02-AC3`). The test that covers a criterion has the ID in its title, e.g. `it('F02-AC3 ink-in ≤ 900ms', ...)`. `tests/unit/traceability.test.ts` fails if any criterion ID in the briefs has no test. Where a criterion can't be automated literally (e.g. "passes the X card validator"), test the closest automatable proxy and say so in the test name (`[proxy]`).
4. **Keep `docs/PLAN.md` current.** Update the status table when a feature starts or finishes.
5. **Run `/done` before calling a feature finished.**
6. **Accuracy is a gate, not a nicety.** Never add a historical claim without a citation and a verification-log entry (F05 method). Never invent page numbers, dates or quotes. If you can't verify something, cut it or mark it `contested`/`secondary-summary`. Red ink (`--vermilion`) is only for misbeliefs.
7. **Ship through a pull request** to `main` once tests are green. CI must pass.

## Conventions
- `content/` holds data only: `discoveries/*.md` (frontmatter + story body), `*.yaml` registries (structures, people, sources, misbeliefs, eras, threads, traditions, assets, share-dates), `logs/*.md` (verification logs). IDs are kebab-case and stable forever (URLs and tests depend on them).
- `src/lib/` holds pure TypeScript logic (no DOM): `state.ts` (fog engine), `scale.ts` (slider scale), `url-state.ts`, `week.ts`, `content/` (schema + loader + gates). Everything in `src/lib/` gets unit tests.
- `src/components/` holds `.astro` components, one per file, in PascalCase. `src/client/` holds browser-only TypeScript modules that progressively enhance the server-rendered DOM, with no framework.
- `src/art/` holds SVG geometry for figures, flaps, misbeliefs and the panorama, as TypeScript data. Structure IDs here must match `content/structures.yaml`.
- `src/pages/` uses file-based routes; kebab-case.
- Tests: `tests/unit/*.test.ts` (Vitest), `tests/e2e/{smoke,functional}/*.spec.ts` and `tests/perf/*.spec.ts` (Playwright).
- Colours, type and spacing only come from tokens in `src/styles/global.css` (mirrored in `src/styles/tokens.ts`). No raw hex values in components (the lint enforces this).
- Respect `prefers-reduced-motion` in every animation.
- Commit messages are imperative and reference the feature ID (`F02: add piecewise slider scale`).
- User-visible changes get a line in `CHANGELOG.md` under **Unreleased**.

## Don't touch without asking
- The licences: `LICENSE`, `LICENSE-CONTENT`, `site.licences`, and the licence map in the README (relicensing has legal consequences)
- Reintroducing commerce or any paywall (F18 decided against it)
- Analytics/email provider configuration and anything that sends data off-site
- Licences and credits in `content/assets.yaml` (changing a licence has legal consequences)
- Deleting or renaming content IDs (it breaks shared URLs)
- Netlify site settings

## Testing philosophy
- Every feature ships with tests for **each** acceptance criterion in its brief (enforced by the traceability test), plus its main happy path.
- Test pyramid: logic and content gates in **unit** tests (fast; run on every edit by the hook); user-visible behaviour in **functional** e2e; "does the site come up at all" in **smoke**; budgets (payload, LCP, frame time, tap-to-panel latency) in **perf**.
- Content is tested like code: schema, citation, licence, balance and verification gates run in `npm test` *and* block `npm run build`.
- Never skip, disable or loosen a test to get green. Fix the code or the brief.
- **A PostToolUse hook** (`.claude/hooks/post-edit-test.sh`) runs `npm test` after every Edit/Write to source, content or tests, and puts any failures straight back into context. Fix failures before moving on.

## Known constraints
- The build sandbox can't reach Wikimedia or Wellcome image hosts. Historical images are referenced by record URL, and each story's plate is generated from our own figure until the original scans are dropped into `public/plates/` (the asset loader picks them up automatically).
- The commissioned engraving (F16) doesn't exist yet. `src/art/` is our own schematic engraving-style drawing, keyed by structure ID so the commissioned art can replace it one-for-one.
