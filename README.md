# Tabula

**The body, as it was written.** Tabula is an engraved human body in which every part carries the story of who worked it out, how they did it, and what they got wrong first. A timeline slider "writes in" the body as knowledge arrived over 3,600 years, from the Edwin Smith papyrus to the 2018 interstitium argument.

- Live: <https://tabula-anatomy.netlify.app>
- Product: [PRD](docs/PRD.md) · [feature briefs F01–F17](docs/features/README.md) · [build plan and status](docs/PLAN.md) · [accuracy review](docs/research/accuracy-review-2026-10.md)
- Working rules for contributors (human or AI): [CLAUDE.md](CLAUDE.md)

## What's in it

| | |
|---|---|
| **Body** | Male and female figures with about 40 structures, flaps for the skin, muscle, viscera and skeleton layers, and 1×/2×/4× zoom (F01, F13) |
| **Slider and fog** | Each structure is *unknown*, *described* (an ink outline) or *understood* (full colour) at any year (F02) |
| **26 discoveries** | Plates I–XXVI, each with a 150–300-word story, footnoted claims, the method used and the belief it overturned (F03, F04) |
| **Misbeliefs** | Beliefs drawn in red ink that are erased when they were corrected (F09) |
| **Timeline, people, threads** | Six guided tours: circulation, brain and nerves, microscopy, myths and firsts, beyond Europe, hidden vessels (F11) |
| **Traditions lens** | Islamic-Galenic, Chinese classical and Ayurvedic maps of the body, on their own terms (F10) |
| **Sharing** | OG cards, `/today` (a weekly calendar), RSS, email signup (F07, F15) |
| **Classroom packs and edition** | Printable packs, plus a long-form edition: one chapter of about 2,500–4,000 words per thread, with a long-view essay, the plates and a full bibliography (F12, F14) |

## Accuracy is a build gate

Every historical claim is a structured `Claim` with citations, and the build **fails** unless:

- it has ≥ 2 primary or secondary sources, with ≥ 1 scholarly secondary source (tertiary sources never count);
- contested or revised claims carry a note explaining the disagreement;
- every footnote in a story or essay resolves to a claim, and every citation to a source;
- a verification log exists for the subject, with a `claimsHash` that matches the current claims (editing a claim makes the log stale);
- image licences are on the allow-list (PD, PDM, CC0, CC-BY), and balance targets hold (pre-1500, non-European, post-1900, contested, systems).

The full method is on [`/how-we-source`](src/pages/how-we-source.astro) and in [F05](docs/features/).

## Quick start

Requires Node 22.

```bash
npm ci
npm run dev        # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server |
| `npm run validate` | Content gates only (schema, citations, logs, licences, balance) |
| `npm run build` | Validate, then build the static site into `dist/` |
| `npm run preview` | Serve `dist/` (`scripts/serve.mjs`) |
| `npm test` | Vitest: logic, content gates, AC traceability (fast) |
| `npm run test:e2e` | Playwright smoke and functional tests against the built site |
| `npm run test:perf` | Performance budgets (payload, LCP, tap→panel, frame time, under CPU throttling) |
| `npm run test:all` | All of the above |
| `npm run lint` | `astro check` plus the design-token lint (no raw hex values) |
| `npm run artefacts` | Classroom-pack PDFs and the edition (Markdown → EPUB via pandoc, PDF) into `artefacts/` |

Playwright uses the preinstalled Chromium (`PLAYWRIGHT_CHROMIUM_PATH` or `/opt/pw-browsers/...`). Don't run `playwright install`.

## Project layout

```
content/                 data only (YAML + Markdown), validated with Zod
  discoveries/*.md       26 plates: frontmatter (claims, people, structures…) + story
  essays/*.md            edition long-view essays, one per thread, same claim system
  logs/*.md              verification logs (one per subject, hash-locked to its claims)
  *.yaml                 structures, people, sources, misbeliefs, eras, threads,
                         traditions, assets, share-dates, calendar, corrections
src/
  lib/                   pure TS (no DOM): fog engine, slider scale, URL state,
                         content schema/loader/gates, edition, packs, feed, OG…
  art/                   SVG geometry for figures, flaps, panorama and lenses, keyed by structure ID
  components/            .astro components (server-rendered)
  client/                vanilla TS enhancing the server-rendered DOM (no framework)
  pages/                 routes: /, /tab/[id], /timeline, /people, /threads,
                         /today, /teachers, /edition, /sources, /corrections…
  styles/tokens.css      the only place colours, type and spacing are defined
  config/site.ts         brand and integrations (all disabled until configured)
scripts/                 validation, logs, assets, artefacts, static server
tests/
  unit/                  Vitest (incl. traceability: every Fxx-ACn has a test)
  e2e/smoke, e2e/functional, perf/   Playwright
docs/                    PRD, feature briefs, per-feature plans, PLAN.md, research
```

## Adding or changing content

1. Add the sources to `content/sources.yaml` (mark `scholarly: true` only for peer-reviewed or academic work).
2. Write the claims in the subject's frontmatter. Quote YAML strings: an unquoted comma in a flow map silently truncates text, and the strict schema exists to catch that.
3. Footnote each factual sentence in the body with `[^key]`.
4. Verify each claim against its sources, then create or re-sign the log:
   ```bash
   npx tsx scripts/write-logs.ts                 # create missing logs
   npx tsx scripts/write-logs.ts --sign <id>     # re-sign after re-verifying an edited subject
   ```
5. Run `npm run validate && npm test`.

Content IDs are kebab-case and **permanent**, because URLs, share cards and tests depend on them. Never invent page numbers, dates or quotes. If something can't be verified, cut it or mark it `contested` or `secondary-summary`. Red ink (`--vermilion`) is reserved for misbeliefs.

Edition essays are written from a JSON spec with `python3 scripts/write-essay.py <spec.json>`, which writes `content/essays/<thread>.md` with safely quoted frontmatter.

## Configuration

Integrations are off until their environment variables are set (in Netlify → Site configuration → Environment variables):

| Variable | Enables |
|---|---|
| `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_PRODUCTION_HOST` | Plausible analytics (cookieless; production host only) |
| `PUBLIC_BUTTONDOWN_USER` | Email signup (otherwise the page offers RSS only) |
| `PUBLIC_CHECKOUT_PACK_CIRCULATION`, `PUBLIC_CHECKOUT_PACK_MYTHS`, `PUBLIC_CHECKOUT_PACK_MICROSCOPY`, `PUBLIC_CHECKOUT_EDITION` | Lemon Squeezy hosted checkout (otherwise "coming soon") |
| `SITE_URL` (optional) | Canonical URL, if not `https://tabula-anatomy.netlify.app` |

## Deploy

Netlify builds from `main` using `netlify.toml` (`npm run build`, publish `dist/`, Node 22). There is no server: everything is static.

## Known limitations

- **Art:** the figure is Tabula's own schematic engraving-style drawing, standing in for the commissioned art (keyed by structure ID so it can be replaced one-for-one).
- **Historical images:** each plate is generated from our figure and links to the primary-source record. Drop licensed scans into `public/plates/` and they are used automatically.
- Other open items are tracked in [docs/PLAN.md](docs/PLAN.md#open-items-after-the-v1-build-from-the-done-review).

## Corrections

Found an error? Every claim shows its sources. Open an issue, or use the contact on [`/corrections`](src/pages/corrections.astro). Accepted corrections are logged publicly.
