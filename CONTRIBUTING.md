# Contributing to Tabula

Thanks for your interest! Tabula is a history of how the body came to be understood, and its whole value rests on getting that history right. Most of this guide is about how to keep it right. Read it before opening a pull request.

## Ways to help

- **Correct something.** This is the most valuable contribution. Use "Suggest a correction" on any footnote (it opens the [correction form](https://github.com/akhanrepo/tabula/issues/new?template=correction.yml) with the story and claim filled in) and name a source we can check. Accepted corrections go in the public [corrections log](https://tabula-anatomy.netlify.app/corrections/).
- **Propose a discovery.** Use the [discovery form](https://github.com/akhanrepo/tabula/issues/new?template=discovery.yml). Tabula deliberately stays small (about 40 structures), so gaps in the balance targets win: before 1500, outside Europe, after 1900, contested.
- **Report a bug.** Use the [bug form](https://github.com/akhanrepo/tabula/issues/new?template=bug_report.yml) and include the full URL, which carries the year, figure, layer and lens.
- **Use it in class.** The [classroom packs](https://tabula-anatomy.netlify.app/teachers/) are CC BY-SA. Tell us in [Discussions](https://github.com/akhanrepo/tabula/discussions) what worked and what didn't.
- **Pick up an issue.** Look for `good first issue` or `help wanted`, and comment so nobody duplicates the work.

## Development setup

You need **Node 22** (see `.nvmrc`). Pandoc is needed only for `npm run artefacts`.

```bash
git clone https://github.com/akhanrepo/tabula.git
cd tabula
npm ci
npm run dev        # http://localhost:4321
npm test           # fast: logic, content gates, traceability
```

The browser suites need a build and a Chromium:

```bash
npx playwright install chromium   # once
npm run build
npm run test:e2e
```

Tests look for Chromium at `$PLAYWRIGHT_CHROMIUM_PATH`, then `/opt/pw-browsers/chromium`, then Playwright's own install (`scripts/chromium.mjs`).

| Command | What it does |
|---|---|
| `npm run validate` | Content gates only (schema, citations, logs, licences, balance) |
| `npm run build` | Validate, then build the static site into `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run lint` | `astro check` plus the design-token lint |
| `npm run test:perf` | Performance budgets (needs a build) |
| `npm run test:all` | Everything, including perf as a hard gate |
| `npm run artefacts` | Packs (PDF) and the edition (EPUB, PDF) into `artefacts/` (needs a build and pandoc) |

## Changing content

Content is data in `content/`, loaded and validated with Zod (`src/lib/content/`). **The build fails** if a gate fails, so you'll find out locally with `npm run validate`.

### The rules (F05)

1. **Every claim is atomic and cited.** A discovery's frontmatter has `claims: { c1: { text, citations: [source-id, …] } }`, and the story body points at them with footnotes (`[^c1]`). Every footnote must resolve to a claim, and every citation to a source in `content/sources.yaml`.
2. **Two sources, one scholarly.** Each claim needs at least two primary or secondary sources, and at least one must be scholarly secondary (peer-reviewed history of medicine, a university press, or a major library or museum). Encyclopaedias and popular books help you find sources but never count as one.
3. **Check the myths.** For every "first", date and attribution, search for debunkings and priority disputes. Contested claims get `status: contested` and a note naming the positions. Popular claims that are wrong are `revised`.
4. **Never invent a page number, a date or a quote.** If you can't verify something, cut it, or mark it `contested` and say why in the note.
5. **Re-sign the verification log.** Each subject has a log in `content/logs/<id>.md` with a `claimsHash`. Editing a claim makes the log stale and fails the build. After re-checking the claim against its sources, update the log's notes and run:

   ```bash
   npx tsx scripts/write-logs.ts --sign <subject-id>
   ```

   Say in the PR what you checked. A reviewer will verify it.
6. **IDs are forever.** Content IDs are in shared URLs and tests. Don't rename or delete them; add a correction instead.
7. **Red ink (`--vermilion`) is only for misbeliefs.**

### Practical notes

- Add sources to `content/sources.yaml` first. Mark `scholarly: true` only for peer-reviewed or academic work.
- **Quote YAML strings.** An unquoted comma in a flow map silently truncates text, and the strict schema exists to catch that.
- `npx tsx scripts/write-logs.ts` creates any missing logs. Fill in what you checked before you commit.
- Tour intros live in `content/threads.yaml`: `summary` is the one-liner for lists, and `intro` is about 150 words of footnoted Markdown backed by the thread's own `claims` (120–180 words, enforced).
- Edition essays (`content/essays/<thread>.md`) can be written from a JSON spec with `python3 scripts/write-essay.py <spec.json>`, which quotes the front matter safely.
- Finish with `npm run validate && npm test`.

### Accepting a correction

Fix the claim and its sources, re-sign the log, and add an entry to `content/corrections.yaml` (`date`, `subject`, a one-line `summary`, and `reportedBy` if the reporter asked to be credited). The entry is published on `/corrections`.

### Images

Only PD, PDM, CC0 and CC BY are allowed, checked on each record, never assumed per institution. Licences in `content/assets.yaml` are maintainer-only: open an issue rather than changing one in a PR.

## Changing code

- **Logic lives in `src/lib/`** as pure TypeScript (no DOM), with unit tests. `src/components/` are server-rendered Astro components, and `src/client/` is a small vanilla-TS controller that enhances the server-rendered HTML. There's no UI framework, and none is wanted.
- **Colours, type and spacing come only from the tokens** in `src/styles/global.css` (mirrored for scripts in `src/styles/tokens.ts`). `npm run lint` rejects raw hex values elsewhere.
- **Respect `prefers-reduced-motion`** in every animation, and keep everything keyboard and screen-reader operable.
- **Third-party services stay off until configured** (`src/config/site.ts`) and never set cookies.
- Read [docs/architecture.md](docs/architecture.md) for the whole picture.

## How features are built

Each feature has a brief in [`docs/features/`](docs/features/) (F01–F18) with numbered **acceptance criteria** (`F02-AC3`). Then:

1. Agree the brief in an issue or Discussion. If scope changes, update the brief (and the PRD) first.
2. Write a plan (`docs/plans/Fxx.md`): the approach, the files, each criterion mapped to a test, and the risks.
3. **Every acceptance criterion has a test with its ID in the title**, for example `it('F02-AC3 ink-in ≤ 900ms', …)`. `tests/unit/traceability.test.ts` fails otherwise. Where a criterion can't be automated literally, test the closest proxy and say so (`[proxy]`).
4. Never skip, disable or loosen a test to get green. Fix the code or the brief.

Bug fixes and small improvements don't need a brief; a test that reproduces the bug is enough.

Please check the **non-goals** before proposing a feature: no 3D body, accounts, comments, comprehensive anatomy, clinical accuracy, CMS, native apps, AI-generated artwork, automated social posting, or anything that needs a custom server.

## Pull requests

- Keep each PR to one thing, made of small coherent commits.
- Commit messages are imperative and name the feature where there is one: `F02: add piecewise slider scale`.
- Fill in the PR template. For visual changes, attach screenshots at desktop and phone width.
- Update `CHANGELOG.md` under **Unreleased** for anything user-visible.
- CI runs lint, the unit suite, the build and the browser suites. Netlify posts a deploy preview.

## Working with AI assistants

Much of Tabula was built with Claude, and the claim verification is AI-assisted, as `/how-we-source` says publicly. [`CLAUDE.md`](CLAUDE.md) is the working guide for AI coding assistants, and `.claude/` holds a hook that runs `npm test` after every edit. If you use an assistant, the same rules apply to its output as to yours: you're responsible for every claim and every source in your PR.

## Releasing (maintainers)

Bump `version` in `package.json`, move the **Unreleased** notes in `CHANGELOG.md` under the new version, merge, then tag `vX.Y.Z` on `main` (or, on GitHub, **Releases → Draft a new release**, type the new tag `vX.Y.Z`, target `main`, and publish). The release workflow tests, builds the packs and the edition, and publishes them as a GitHub Release, which `/teachers` and `/edition` link to.

## Licence of contributions

By contributing, you agree that your code is licensed under the [MIT licence](LICENSE) and your written content under [CC BY-SA 4.0](LICENSE-CONTENT), the same terms as the rest of the project.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating you agree to uphold it.
