# Changelog

All notable changes to Tabula are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/). For content, a correction to a claim is a patch, a new discovery is a minor release, and a change that breaks shared URLs (which we avoid) would be a major one.

## [Unreleased]

### Added
- `CITATION.cff`, so GitHub offers "Cite this repository".
- README: a before-and-after strip of the fog over four eras, a site tour, a roadmap, and sections on citing and acknowledgements; a social preview image (`docs/images/social-preview.png`).

## [1.0.0] — 2026-11-03

The first public release. Tabula is now open source.

### Added
- **The body.** Male and female engraved figures with about 40 structures, flaps for the skin, muscle, viscera and skeleton layers, and 1×/2×/4× zoom (F01, F13).
- **The slider and fog.** Every structure is unknown, described or understood at any year from 1600 BCE to today (F02).
- **26 discoveries**, Plates I–XXVI, each with a footnoted story, the method used and the belief it overturned (F03, F04), plus beliefs drawn in red ink that are erased when corrected (F09).
- **Timeline, people and six guided tours**, each with a verified introduction (F11), and the **traditions lens**: Islamic-Galenic, Chinese classical and Ayurvedic maps of the body (F10).
- **Accuracy as a build gate.** Every claim has at least two sources, one scholarly, and a hash-locked verification log; the build fails otherwise (F05, F06).
- **Sharing:** Open Graph cards, `/today` and an RSS feed (F07, F15), plus cookieless analytics that is off until configured (F08).
- **Classroom packs and the edition**, generated from the same content: four printable packs in A4 and US Letter, and a six-chapter long read as EPUB and PDF (F12, F14).
- **Open-source project files** (F18): MIT licence for the code, CC BY-SA 4.0 for the content, README, contributing guide, code of conduct, security policy, architecture notes, issue forms (bug, correction, discovery, feature), a PR template, CI, CodeQL, Dependabot, and a release workflow that publishes the packs and the edition.

### Changed
- **The classroom packs and the edition are free** downloads from GitHub Releases, under CC BY-SA 4.0.
- "Suggest a correction" opens a GitHub issue form with the story and claim prefilled. The email fallback appears only when a contact address is configured.
- The browser tests and artefact builds find Chromium without a version-pinned path.
- Patched `undici` and `zod`.

### Fixed
- Analytics events from pages other than the body (downloads, the RSS link) were dropped because the tracking helper loaded only on the body page. It now loads on every page.
- Opening a story in a guided tour could steal keyboard focus back from the tour controls a moment later (on slower devices). The story now takes focus only if the reader hasn't moved it.

### Removed
- The Lemon Squeezy checkout (buy buttons, prices, school licences and the `checkout_start` event).
- The weekly email: the Buttondown signup, the generated email issues and `PUBLIC_BUTTONDOWN_USER`. Follow by RSS instead.

[Unreleased]: https://github.com/akhanrepo/tabula/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/akhanrepo/tabula/releases/tag/v1.0.0
