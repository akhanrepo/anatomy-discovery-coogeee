# Build plan: Tabula v1

Living document. Update the status table when a feature starts or finishes. Per-feature plans are in [`docs/plans/`](plans/).

## Order of work
Dependencies decide the order. Each step ends with green `npm test` + `npm run test:e2e` and a push to `main`.

| # | Step | Features | Status | Plan |
|---|---|---|---|---|
| 0 | Repo rules, plan, name/icon brief, AC IDs | CLAUDE.md, name/icon brief | ✅ done | — |
| 1 | Scaffold Astro + test harness (unit / smoke / functional / perf) + traceability test + PostToolUse hook | infra | ✅ done | [00-infra](plans/00-infra.md) |
| 2 | Content system: schemas, loader, gates, verification logs | F05, F06 | ✅ done | [F05-F06](plans/F05-F06.md) |
| 3 | Content: 26 discoveries, people, sources, misbeliefs, eras, threads | F04 | ✅ done | [F04](plans/F04.md) |
| 4 | Visual system + brand: tokens, paper/era textures, type, icon, wordmark | F16, F17 | ✅ done | [F16-F17](plans/F16-F17.md) |
| 5 | Body (male/female, ~40 structures) + flaps | F01, F13 | ✅ done | [F01-F13](plans/F01-F13.md) |
| 6 | Fog engine + slider + panorama | F02 | ✅ done | [F02](plans/F02.md) |
| 7 | Story panel + misbeliefs | F03, F09 | ✅ done | [F03-F09](plans/F03-F09.md) |
| 8 | Timeline / people / threads + tours | F11 | ✅ done | [F11](plans/F11.md) |
| 9 | Traditions lens | F10 | ✅ done | [F10](plans/F10.md) |
| 10 | Share cards, /today, OG images, RSS (email signup removed 2026-11-03) | F07, F15 | ✅ done | [F07-F15](plans/F07-F15.md) |
| 11 | Analytics | F08 | ✅ done | [F08](plans/F08.md) |
| 12 | Classroom packs, edition, sponsorship, commerce links | F12, F14 | ✅ done | [F12-F14](plans/F12-F14.md) |
| 13 | Full regression (all suites), `/done` review, Netlify project | — | ✅ done | — |
| 14 | Open-source release: licences, free packs and edition, repo files, CI and releases | F18 | ✅ done | [F18](plans/F18.md) |
| 15 | Web edition: every chapter readable on the site | F14 | 🔨 in progress | [F14-web-edition](plans/F14-web-edition.md) |

## Test strategy
| Suite | Tool | Runs | What it covers |
|---|---|---|---|
| Unit | Vitest | every edit (hook), `npm test`, CI | fog engine, scale, URL state, week mapping, schema + content gates, licence gates, balance targets, token lint, **AC traceability** |
| Smoke | Playwright | `npm run test:e2e` | every route returns 200, no console errors, key landmarks render |
| Functional | Playwright | `npm run test:e2e` | acceptance criteria that need a browser (keyboard, deep links, focus trap, flaps, lens, share) |
| Performance | Playwright + CDP | `npm run test:perf` | initial payload ≤ 1.5MB, JS budget, LCP < 2.5s on throttled 4G, tap→panel < 100ms, frame time while dragging (4× CPU throttle) |

## Known constraints and deviations (kept honest)
- **Historical images:** this sandbox can't reach image hosts. Each story gets a **generated plate**: our figure, with that discovery's structures inked, plus the primary-source record link. Dropping scans into `public/plates/{assetId}.jpg` swaps them in.
- **Traditions plates:** the same constraint. Each lens shows a labelled schematic *after* the source plate, until the scans are added and their licences confirmed (F10-AC3 test enforces "no unconfirmed plate displayed as the original").
- **Commissioned art:** our own schematic engraving stands in, keyed by structure ID.
- **Analytics:** built and wired, but disabled until an account ID is set in `src/config/site.ts`.

## Open items after the v1 build (from the `/done` review)
Not met, and recorded rather than papered over:
1. ~~**Edition chapter length (F14 scope)**~~ **Resolved 2026-10-12:** each thread now has a verified long-view essay (`content/essays/`). Chapters are 2,560–2,660 words, enforced by F14-AC5.
2. ~~**Tour intros (F11 scope)**~~ **Resolved 2026-10-12:** each tour has a verified intro of about 150 words (145–165), footnoted to 5–6 thread claims and logged. A separate one-line `summary` is used for lists and meta descriptions. Enforced by F11-AC4 ([plan](plans/F11-tour-intros.md)).
3. **Commissioned art (F16):** the figure is Tabula's schematic stand-in, in anatomical position, not the *Epitome* pose.
4. **Primary-source images (F03/F06):** story images are generated plates. Scans can't be fetched from this sandbox; drop them into `public/plates/` with `licenceVerified`.
5. **Lens plate licences (F10-AC3):** not yet confirmed on the Wellcome/NLM records, so the originals are deliberately not displayed.
6. **Proxy-tested criteria:** F07-AC2 (social validators → tag/size checks), F15-AC1 (W3C validator → structural checks), F13-AC4 (inline art, so no lazy load is needed).
7. **Not built from scope notes:** dragging a flap edge (the tabs work); the overlapping-structure chooser; a 44px minimum hit target for tiny structures (mitigated by 1×/2×/4× zoom and the list view); a facing-page two-figure desktop view (optional); sound (optional, "cut first").
8. **Config needed from Ali:** the Plausible domain, the site URL/domain, and optionally a contact email and donate link. (The Lemon Squeezy checkout was removed in F18.)
9. **After the F18 merge (Ali):** rename the repo to `tabula`, make it public, push `v1.0.0` so the download links resolve, create the `correction` and `discovery` labels, enable Discussions and private vulnerability reporting, protect `main`, and re-link Netlify. See the [F18 brief](features/F18-open-source-release.md#manual-steps-for-the-maintainer).

## Changelog
- 2026-11-03: F15 weekly email removed at Ali's request (Buttondown signup, email issues, config). RSS stays. F15-AC2 retired.
- 2026-11-03: F18 open-source release. Code MIT, content CC BY-SA 4.0. Commerce removed: packs and the edition are free downloads published by a release workflow. Added README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, THIRD_PARTY_NOTICES, architecture doc, issue forms, PR template, CI, CodeQL and Dependabot. Fixed analytics events being dropped outside the body page, and version-pinned Chromium paths. 83 unit + 122 e2e + 8 perf passing.
- 2026-10-12: F11 tour intros expanded to about 150 words with 32 verified claims, 6 logs and a sources list on each tour page (new F11-AC4). Also corrected the microscopy essay, which had placed the 1954 muscle plate on that tour.
- 2026-10-12: F14 edition essays. Six long-view essays (about 1,200–2,100 words each, 61 cited claims, 16 new sources, 6 verification logs), now part of the edition and the content version. New F14-AC5 enforces 2,500–4,000 words per chapter and the same gates as stories. README written.
- 2026-10-10: all features built. 63 unit + 119 e2e + 8 perf passing. `/done` review added zoom and edge-case tests and listed the open items above.
- 2026-10-10: core experience done (F16, F17, F01, F13, F02, F03, F09). Unit 45 ✓, e2e + perf 45 ✓. Bugs caught by tests and fixed: heart unclickable under the aorta's hit stroke; back gesture leaving the page after Esc; tap→story 121ms → < 100ms (panel first, ink after paint; content-visibility on footnotes).
- 2026-10-10: plan created; F17 brief added; AC IDs added to all briefs.
