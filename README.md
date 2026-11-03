<p align="center">
  <a href="https://tabula-anatomy.netlify.app"><img src="docs/images/social-preview.png" width="760" alt="Tabula: the body, as it was written"></a>
</p>

<p align="center">
  <b>An engraved human body in which every part carries the story of who worked it out,<br>how they did it, and what they got wrong first.</b>
</p>

<p align="center">
  <a href="https://github.com/akhanrepo/tabula/actions/workflows/ci.yml"><img src="https://github.com/akhanrepo/tabula/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/akhanrepo/tabula/actions/workflows/codeql.yml"><img src="https://github.com/akhanrepo/tabula/actions/workflows/codeql.yml/badge.svg" alt="CodeQL"></a>
  <a href="https://github.com/akhanrepo/tabula/releases/latest"><img src="https://img.shields.io/github/v/release/akhanrepo/tabula?sort=semver&label=release" alt="Latest release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/code-MIT-blue.svg" alt="Code: MIT"></a>
  <a href="LICENSE-CONTENT"><img src="https://img.shields.io/badge/content-CC%20BY--SA%204.0-lightgrey.svg" alt="Content: CC BY-SA 4.0"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
</p>

<p align="center">
  <a href="https://tabula-anatomy.netlify.app"><b>Open Tabula →</b></a>
  &nbsp;·&nbsp; <a href="https://tabula-anatomy.netlify.app/teachers/">Classroom packs</a>
  &nbsp;·&nbsp; <a href="https://tabula-anatomy.netlify.app/edition/">The edition</a>
  &nbsp;·&nbsp; <a href="https://tabula-anatomy.netlify.app/how-we-source/">How we source</a>
  &nbsp;·&nbsp; <a href="CONTRIBUTING.md">Contribute</a>
</p>

<p align="center">
  <img src="docs/images/tabula.png" width="860" alt="Tabula at 1628: the engraved figure with the heart and vessels inked in, the timeline slider below, and Harvey's story open beside it">
</p>

---

<details>
<summary><b>Contents</b></summary>

- [Why Tabula](#why-tabula)
- [Features](#features)
- [Accuracy is a build gate](#accuracy-is-a-build-gate)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Configuration](#configuration)
- [Deploy and release](#deploy-and-release)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support the project](#support-the-project)
- [Citing Tabula](#citing-tabula)
- [Acknowledgements](#acknowledgements)
- [Licence](#licence)

</details>

## Why Tabula

The history of how we came to understand the body is a great story, but it is told as linear narrative: in books, podcasts and documentaries. Nobody lays it onto the body itself, so you can't see *where* knowledge arrived, *when*, or what it overturned. Anatomy atlases ignore the history; museum sites and Wikipedia are accurate but scattered; and popular retellings repeat myths and contested "firsts" without flagging them.

**Tabula puts the history on the body.** Drag a slider from 1600 BCE to today and watch the figure being *written in*, from the Edwin Smith papyrus's first word for "brain" to the 2018 argument over the interstitium. Beliefs of their time appear in red ink and are scraped away when they are overturned. Every sentence is footnoted, and the build refuses to ship a claim that isn't sourced and verified.

<p align="center">
  <img src="docs/images/fog-over-time.png" width="860" alt="The same figure at four moments: in 1600 BCE almost blank; around 200 with Galen's vessels and red-ink beliefs; in 1543 with the lungs and heart drawn in and some red beliefs remaining; and today fully inked and coloured">
  <br><sub>The same body at four moments. Outline means <i>described</i>, colour means <i>understood</i>, and red ink is a belief of its time.</sub>
</p>

## Features

| | |
|---|---|
| 🫀 **The body** | Male and female engraved figures with about 40 structures, flaps for the skin, muscle, viscera and skeleton layers, and 1×/2×/4× zoom |
| 🕰️ **The slider and fog** | At any year, each structure is *unknown* (blank paper), *described* (an ink outline) or *understood* (hatched and coloured) |
| 📜 **26 discoveries** | Plates I–XXVI, each with a 150–300-word story, footnoted claims, the method used and the belief it overturned |
| 🖍️ **Misbeliefs** | Beliefs drawn in red ink that fade when challenged and are erased when corrected |
| 🧭 **Timeline, people and tours** | Six guided tours: circulation, brain and nerves, microscopy, myths and firsts, beyond Europe, hidden vessels |
| 🌏 **Traditions lens** | Islamic-Galenic, Chinese classical and Ayurvedic maps of the body, on their own terms |
| 🔗 **Sharing** | Every view is a link, with Open Graph cards, a weekly `/today` and an RSS feed |
| 🍎 **Classroom packs** | Four free printable packs (A4 and US Letter): black-line plates to colour, story cards, "spot the myth", discussion questions and a sourced answer key |
| 📖 **The edition** | A free long read: one chapter of about 2,500–4,000 words per tour, with a long-view essay, the plates and a full bibliography (EPUB and PDF) |

**Private and light by design.** No accounts, no cookies, no mailing list, and no tracking unless the maintainer turns on cookieless analytics. Every story is in the HTML, so reading works without JavaScript, and the slider, flaps and panel are keyboard and screen-reader operable. Performance budgets (payload, LCP on throttled 4G, tap-to-story under 100ms, frame time) are part of the test suite.

### A tour of the site

| Page | What's there |
|---|---|
| [`/`](https://tabula-anatomy.netlify.app) | The body, the slider and the story panel |
| [`/timeline`](https://tabula-anatomy.netlify.app/timeline/) | Every plate and belief in date order |
| [`/threads`](https://tabula-anatomy.netlify.app/threads/) | The six guided tours |
| [`/people`](https://tabula-anatomy.netlify.app/people/) | The anatomists, physicians and scholars, with their discoveries |
| [`/today`](https://tabula-anatomy.netlify.app/today/) | This week in anatomy |
| [`/teachers`](https://tabula-anatomy.netlify.app/teachers/) · [`/edition`](https://tabula-anatomy.netlify.app/edition/) | Free classroom packs and the long read |
| [`/sources`](https://tabula-anatomy.netlify.app/sources/) · [`/how-we-source`](https://tabula-anatomy.netlify.app/how-we-source/) · [`/corrections`](https://tabula-anatomy.netlify.app/corrections/) | The bibliography, the method, and the public corrections log |

## Accuracy is a build gate

Every historical claim is a structured `Claim` with citations, and the build **fails** unless:

- it has ≥ 2 primary or secondary sources, with ≥ 1 scholarly secondary source (tertiary sources never count);
- contested or revised claims carry a note explaining the disagreement;
- every footnote in a story or essay resolves to a claim, and every citation to a source;
- a verification log exists for the subject, with a `claimsHash` that matches the current claims (editing a claim makes the log stale);
- image licences are on the allow-list (PD, PDM, CC0, CC BY), and balance targets hold (pre-1500, non-European, post-1900, contested, systems).

Verification is **AI-assisted**: Claude checks each claim against the [F05 method](docs/features/F05-citations-and-contested-claims.md) and writes the log, and the site says so on every story. That reduces errors but doesn't eliminate them, and some key scholarship is print-only. That is why corrections are built in: every footnote has a **Suggest a correction** link, and accepted corrections are published on [`/corrections`](https://tabula-anatomy.netlify.app/corrections/).

## Quick start

Requires **Node 22** (see [`.nvmrc`](.nvmrc)).

```bash
git clone https://github.com/akhanrepo/tabula.git
cd tabula
npm ci
npm run dev        # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server |
| `npm run validate` | Content gates only (schema, citations, logs, licences, balance) |
| `npm run build` | Validate, then build the static site into `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm test` | Vitest: logic, content gates, AC traceability (fast) |
| `npm run test:e2e` | Playwright smoke and functional tests against the built site |
| `npm run test:perf` | Performance budgets (payload, LCP, tap→panel, frame time, under CPU throttling) |
| `npm run test:all` | All of the above |
| `npm run lint` | `astro check` plus the design-token lint (no raw hex values) |
| `npm run artefacts` | Classroom-pack PDFs and the edition (EPUB via pandoc, PDF) into `artefacts/` |

The browser tests need Chromium: run `npx playwright install chromium` once, or point `PLAYWRIGHT_CHROMIUM_PATH` at an existing one.

## How it works

**Stack:** [Astro](https://astro.build) · strict TypeScript · [Zod](https://zod.dev) · inline SVG · [Vitest](https://vitest.dev) · [Playwright](https://playwright.dev) · Netlify. No UI framework, no backend, no database.

Tabula is a static site. Everything is server-rendered: every structure, story panel and misbelief is in the HTML, and a small vanilla-TypeScript controller adds the slider, flaps, panel and lens. Content is YAML and Markdown in `content/`, validated with Zod by the same loader that the pages, scripts and tests use. The fog is derived, never stored: `stateAt(structure, year)` is a pure function that runs at build time and in the browser.

```
content/                 data only (YAML + Markdown), validated with Zod
  discoveries/*.md       26 plates: front matter (claims, people, structures…) + story
  essays/*.md            edition long-view essays, one per tour, same claim system
  logs/*.md              verification logs (one per subject, hash-locked to its claims)
  *.yaml                 structures, people, sources, misbeliefs, eras, threads,
                         traditions, assets, share-dates, calendar, corrections
src/
  lib/                   pure TS (no DOM): fog engine, slider scale, URL state,
                         content schema/loader/gates, packs, edition, downloads, OG…
  art/                   SVG geometry for figures, flaps, panorama and lenses, keyed by structure ID
  components/            .astro components (server-rendered)
  client/                vanilla TS enhancing the server-rendered DOM (no framework)
  pages/                 routes: /, /tab/[id], /timeline, /people, /threads,
                         /today, /teachers, /edition, /sources, /corrections…
  styles/global.css      design tokens (mirrored in tokens.ts); the only place colours are defined
  config/site.ts         brand, licences and integrations (all off until configured)
scripts/                 validation, logs, artefacts, release, static server
tests/
  unit/                  Vitest (incl. traceability: every Fxx-ACn has a test)
  e2e/smoke, e2e/functional, perf/   Playwright
docs/                    PRD, feature briefs F01–F18, plans, architecture, research
```

Every feature starts as a written brief with numbered acceptance criteria, and a test fails the suite if any criterion lacks a test. More in [docs/architecture.md](docs/architecture.md). The product thinking is in the [PRD](docs/PRD.md), the [feature briefs](docs/features/README.md), the [build plan](docs/PLAN.md) and the [accuracy review](docs/research/accuracy-review-2026-10.md).

## Configuration

Integrations are off until their environment variables are set (on Netlify: Site configuration → Environment variables):

| Variable | Enables |
|---|---|
| `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_PRODUCTION_HOST` | Plausible analytics (cookieless; production host only) |
| `PUBLIC_CONTACT_EMAIL` | An email option for corrections and sponsorship (otherwise GitHub only) |
| `PUBLIC_DONATE_URL` | A donate button on `/support` |
| `SITE_URL` (optional) | Canonical URL, if not `https://tabula-anatomy.netlify.app` |

## Deploy and release

Netlify builds `main` (`netlify.toml`: `npm run build`, publish `dist/`) and posts a deploy preview for every pull request. There's no server. Pushing a `vX.Y.Z` tag runs the release workflow, which builds the classroom packs and the edition and publishes them to [GitHub Releases](https://github.com/akhanrepo/tabula/releases); the site's download links always point at the latest release.

## Roadmap

Tabula v1 is complete. These are the known gaps and the most wanted next steps:

- [ ] **Commissioned art.** The figure is Tabula's own schematic engraving, standing in for a commissioned engraving after Vesalius's *Epitome*. It's keyed by structure ID, so the art can be replaced one structure at a time.
- [ ] **Primary-source scans.** Each story's plate is generated from our figure and links to the primary-source record. Licensed scans dropped into `public/plates/` are used automatically.
- [ ] **Traditions lens plates.** The historical plates appear once each record's licence is confirmed; a labelled schematic stands in until then.
- [ ] **A full web edition**, with every chapter readable on the site as well as in the EPUB and PDF.
- [ ] **More discoveries** that fill the balance targets: before 1500, outside Europe, after 1900, and contested. [Propose one.](https://github.com/akhanrepo/tabula/issues/new?template=discovery.yml)

Smaller open items are tracked in [docs/PLAN.md](docs/PLAN.md#open-items-after-the-v1-build-from-the-done-review), and the deliberate non-goals (no 3D body, accounts, comprehensive anatomy, CMS or AI-generated art) are in [CLAUDE.md](CLAUDE.md#explicit-non-goals-say-no-even-if-its-tempting).

## Contributing

Contributions are welcome, and **corrections are the most valuable of all.** Use **Suggest a correction** on any footnote and name a source we can check.

| I want to… | Start here |
|---|---|
| Fix a historical error | [Suggest a correction](https://github.com/akhanrepo/tabula/issues/new?template=correction.yml) |
| Propose a discovery or belief | [Propose a discovery](https://github.com/akhanrepo/tabula/issues/new?template=discovery.yml) |
| Report a bug | [Bug report](https://github.com/akhanrepo/tabula/issues/new?template=bug_report.yml) |
| Write code or content | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Ask a question or share how you used it | [Discussions](https://github.com/akhanrepo/tabula/discussions) |
| Report a security issue | [Private reporting](SECURITY.md) |

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md). [`CLAUDE.md`](CLAUDE.md) is the working guide for AI coding assistants. Much of Tabula was built with Claude, and the same rules bind human and AI contributions.

## Support the project

Tabula is free. It's funded by sponsorship from museums, libraries, learned societies and education publishers, under a public [editorial-independence policy](https://tabula-anatomy.netlify.app/support/): sponsors never review or influence content. You can also help by starring the repository, sharing a plate, using the packs in class, or sending a correction.

## Citing Tabula

If you use Tabula in teaching, research or writing, please cite it. GitHub's **Cite this repository** button (from [`CITATION.cff`](CITATION.cff)) gives APA and BibTeX. In short:

> Khan, A. (2026). *Tabula: The Body, as It Was Written* (Version 1.0.0) [Computer software]. https://github.com/akhanrepo/tabula

## Acknowledgements

Tabula stands on the work of the historians of medicine whose scholarship every story cites. The full bibliography is on [`/sources`](https://tabula-anatomy.netlify.app/sources/): 125 sources, 59 of them scholarly. It also depends on the libraries and archives that put primary sources online, among them the U.S. National Library of Medicine, Wellcome Collection, the Internet Archive and PubMed Central. The type is EB Garamond, IM Fell English, Amiri, Noto Serif Devanagari and Noto Serif SC, all under the SIL Open Font License. The name and the idea of keyed plates come from Vesalius's *Tabulae anatomicae sex* of 1538. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for every dependency and its licence.

## Licence

| What | Licence |
|---|---|
| **Code** (everything not listed below) | [MIT](LICENSE) |
| **Written content**: stories, essays, tour intros, misbeliefs, verification logs and the data in `content/`, plus the classroom packs and the edition generated from them | [CC BY-SA 4.0](LICENSE-CONTENT) |
| **Plates** drawn for Tabula (`kind: generated` in `content/assets.yaml`) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Fonts, dependencies and cited historical material | Their own licences: see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) |

To reuse the content, credit **"Tabula (https://github.com/akhanrepo/tabula)"**, link the licence, say if you changed anything, and share adaptations under CC BY-SA 4.0. If you deploy a fork publicly, please give it a different name so readers don't confuse it with this project and its corrections log.

<p align="center"><sub>Tabula is a history of how the body came to be understood. It is not medical advice, and its modern body is an artful schematic, not a reference atlas.</sub></p>
