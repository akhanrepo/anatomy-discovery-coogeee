# Architecture

Tabula is a static site. Everything a reader can see (every structure, story, footnote, misbelief and lens) is rendered to HTML at build time. A small vanilla-TypeScript controller then adds the slider, flaps, panel and lens behaviour. There is no server, no database, no accounts and no UI framework.

```
content/ (YAML + Markdown) ──► src/lib/content (Zod schema → loader → gates) ──► Corpus
                                                                                  │
          ┌──────────────────────────────┬──────────────────────────┬────────────┴───────────────┐
          ▼                              ▼                          ▼                            ▼
   Astro pages (src/pages)      model.ts → fog model JSON     og.ts, feed.ts, email.ts      packs.ts, edition.ts
   server-render all HTML       embedded in the page          share cards, RSS, issues      print pages → PDFs/EPUB
          │                              │                                                       │
          ▼                              ▼                                                       ▼
        dist/  ◄──── src/client/app.ts enhances the DOM                     artefacts/ → GitHub Release
```

## Content as code

- **`content/`** holds data only: `discoveries/*.md` (front matter with claims, plus the story), `essays/*.md` (the edition's long-view essays), `logs/*.md` (verification logs) and the YAML registries (structures, people, sources, misbeliefs, eras, threads, traditions, assets, share-dates, calendar, corrections).
- **`src/lib/content/schema.ts`** defines every entity with Zod. **`load.ts`** reads and validates the files into a typed `Corpus`, and computes each subject's `claimsHash`. **`gates.ts`** runs every editorial rule as a named gate: citations resolve, ≥ 2 sources with ≥ 1 scholarly, contested claims have notes, logs exist and match the current hash, licences are on the allow-list, word counts and balance targets hold. `runGates(c)` returns an empty array when the content is publishable.
- The same loader serves Astro pages, scripts and tests, so `npm test`, `npm run validate` and `npm run build` all enforce the same rules.

## The fog engine

`src/lib/state.ts` is pure functions over a compact model: `stateAt(structure, year)` returns `unknown | described | understood`, and `activeMisbeliefs(year)` returns each red-ink belief's phase (`hidden | red | partial | erased`). Fog state is **derived, never stored**. `src/lib/model.ts` builds the model from the corpus. The page embeds it as JSON, and the same functions run in the browser when the slider moves. `src/lib/scale.ts` maps the slider's position to a year on a piecewise scale anchored at the eras.

## Rendering

- **`src/art/`** holds the figure, flaps, panorama and lens geometry as TypeScript data, keyed by the structure IDs in `content/structures.yaml`. A commissioned engraving can replace it one structure at a time.
- **`src/components/`** are server-rendered Astro components (`App`, `FigureStage`, `Timeline`, `StoryPanel`, `MisbeliefPanel`, `LensView`, …). Every story panel is in the HTML, so deep links, no-JS reading and search engines all work.
- **`src/client/app.ts`** progressively enhances that DOM: slider drag and keyboard control, ink transitions, flaps, zoom, the panel, the lens switch, URL state (`src/lib/url-state.ts`) and analytics events. Transitions live in CSS, which honours `prefers-reduced-motion`.
- **Design tokens** are CSS custom properties in `src/styles/global.css`, mirrored in `src/styles/tokens.ts` for scripts that render outside the page (share cards, plates). `scripts/lint-tokens.ts` rejects raw colours elsewhere and keeps vermilion for misbeliefs.

## Generated outputs

| Output | Built by | When |
|---|---|---|
| Share cards (1200×630 PNG) | `src/lib/og.ts` (satori + resvg) via `src/pages/og/[id].png.ts` | `npm run build` |
| Plates (SVG) | `src/lib/plate.ts` via `src/pages/plates/[id].svg.ts` | `npm run build` |
| RSS | `src/lib/feed.ts` via `src/pages/feed.xml.ts` | `npm run build` |
| Classroom packs (PDF, A4 + Letter) | `src/lib/packs.ts` → `/packs/<id>/print/` → Chromium `page.pdf` | `npm run artefacts` |
| Edition (EPUB + PDF) | `src/lib/edition.ts` → Markdown → pandoc / Chromium | `npm run artefacts` |
| Weekly email issues | `src/lib/email.ts` | `npm run artefacts` |

Packs and the edition carry a **content version** (`src/lib/version.ts`), a hash of every claim, so a printed copy can be traced to the content it came from.

**Downloads** (F18): `src/lib/downloads.ts` is the single list of downloadable file names. `scripts/build-artefacts.ts` writes them, `scripts/release-files.ts` checks them, the release workflow publishes them, and `/teachers` and `/edition` link to `releases/latest/download/<file>`.

## Integrations

All are configured in `src/config/site.ts` from `PUBLIC_*` environment variables, and **all are off until configured**:

| Integration | Variable | Off means |
|---|---|---|
| Plausible analytics (cookieless) | `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_PRODUCTION_HOST` | no script loads. When set, the script runs only on the production host, never on localhost or deploy previews |
| Buttondown email | `PUBLIC_BUTTONDOWN_USER` | the signup offers RSS only |
| Contact email | `PUBLIC_CONTACT_EMAIL` | corrections and sponsorship go through GitHub only |
| Donations | `PUBLIC_DONATE_URL` | no donate button |

## Tests

| Suite | Where | Covers |
|---|---|---|
| Unit (Vitest) | `tests/unit/` | fog engine, scale, URL state, week mapping, every content gate, licences, packs/edition, repository files, and **AC traceability**: every `Fxx-ACn` in `docs/features/` must appear in a test title |
| Smoke (Playwright) | `tests/e2e/smoke/` | every built page returns 200 with no console errors |
| Functional (Playwright) | `tests/e2e/functional/` | criteria that need a browser: keyboard, deep links, focus, flaps, lens, share, downloads |
| Performance (Playwright + CDP) | `tests/perf/` | payload, LCP on throttled 4G, tap→panel < 100ms, frame time under 4× CPU throttle |

## Hosting and releases

Netlify builds `main` (`netlify.toml`: `npm run build`, publish `dist/`) and posts deploy previews for pull requests. GitHub Actions runs CI on every push and pull request. Pushing a `vX.Y.Z` tag runs `.github/workflows/release.yml`, which builds and publishes the packs and the edition.
