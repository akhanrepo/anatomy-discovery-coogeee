# F18 — Open-source release

**Release:** v1.0.0 (first public release) · **Depends on:** all of F01–F17

## What it does
Turns Tabula from a private repository into a public, openly licensed project that a stranger can understand, build, run, correct and contribute to. Packs and the edition become free.

## Decisions (agreed with Ali, 2026-11-03)
- **Code is MIT.** Everything in the repository that isn't covered below.
- **Written content is CC BY-SA 4.0.** That covers stories, essays, tour intros, misbeliefs, verification logs and the YAML registries in `content/`, and the classroom packs and the edition generated from them. Teachers, Wikipedia and other projects can reuse and adapt it with attribution; derivatives stay open.
- **Plates stay CC BY 4.0**, as each asset already declares in `content/assets.yaml` (unchanged). Fonts keep the SIL OFL 1.1 and third-party records keep their own licences.
- **No paywall.** A paid artefact that anyone can rebuild with `npm run artefacts` is a fiction. The Lemon Squeezy buy flow (`BuyButton`, `site.commerce`) is removed. The code stays in git history. All packs and the edition are free downloads.
- **Funding** comes from sponsorship (the F14 policy is unchanged) plus an optional donate link, which is config-driven and hidden until set.
- **Downloads come from GitHub Releases.** A `vX.Y.Z` tag builds the site and the artefacts and publishes them to a release with stable file names. The site links to `releases/latest/download/<file>`. The free sample pack stays on the site as well.
- **Repository name:** `tabula`. Links point to `https://github.com/akhanrepo/tabula`, and GitHub redirects the old name after the rename.
- **Corrections** go through a GitHub issue form (`correction.yml`) with the story and claim prefilled. Email is an optional fallback, shown only when a real address is configured (no placeholder addresses ship).

## Acceptance criteria
- [ ] **F18-AC1** No commerce remains: no buy buttons, prices, checkout URLs, merchant-of-record copy or `checkout_start` event in `src/`, and no `commerce` block in the site config.
- [ ] **F18-AC2** Every classroom pack (A4 and US Letter) and the edition (EPUB and PDF) is offered as a free download without an account. The site's download links, the files `npm run artefacts` writes, and the files the release workflow publishes all come from one list.
- [ ] **F18-AC3** The licences are explicit and consistent: `LICENSE` (MIT), `LICENSE-CONTENT` (the CC BY-SA 4.0 legal code), the `license` field in `package.json`, a licence section in the README, a licence line in the site footer, and CC BY-SA on the pack cover and the edition.
- [ ] **F18-AC4** The repository has a README (what it is, why, features, accuracy gate, quick start, layout, contributing, licence), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, THIRD_PARTY_NOTICES, an architecture document, issue forms (bug, correction, discovery, feature) with a config, a pull request template, CODEOWNERS, Dependabot and CodeQL.
- [ ] **F18-AC5** No placeholder or stale identity ships: no `.example` email addresses, and every repository link points at `akhanrepo/tabula`.
- [ ] **F18-AC6** "Suggest a correction" opens the correction issue form with the story and claim prefilled, and the form applies the `correction` label.
- [ ] **F18-AC7** CI runs lint, unit tests, the build and the e2e suites on every push to `main` and every pull request. A `vX.Y.Z` tag whose version matches `package.json` publishes a GitHub Release with the packs and the edition.
- [ ] **F18-AC8** THIRD_PARTY_NOTICES names every production dependency with its licence.
- [ ] **F18-AC9** The browser tests and `npm run artefacts` find Chromium portably (`PLAYWRIGHT_CHROMIUM_PATH`, then `/opt/pw-browsers/chromium`, then Playwright's own install), with no version-pinned browser paths.

## Out of scope
- A full web edition (every chapter readable on the site). It is a natural follow-up now that the edition is free.
- Rewriting git history. It is clean: no secrets were found in a full-history scan.
- Print-on-demand.

## Manual steps for the maintainer
1. Merge, then rename the repository to `tabula` (Settings → General). Make it public.
2. Push the tag `v1.0.0` so the first release publishes the downloads that `/teachers` and `/edition` link to.
3. Create the `correction` and `discovery` labels (the issue forms apply them). Set the description, topics (`history-of-medicine`, `anatomy`, `astro`, `education`, `open-content`) and social preview. Enable Discussions and private vulnerability reporting, and protect `main` (require CI).
4. In Netlify: update the linked repository after the rename, and decide whether deploy previews build for fork pull requests.
5. Optional: set `PUBLIC_CONTACT_EMAIL` and `PUBLIC_DONATE_URL` in Netlify, and add `.github/FUNDING.yml` if you set up GitHub Sponsors.
6. Delete the unused Lemon Squeezy products and any `PUBLIC_CHECKOUT_*` variables.
