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
| 8 | Timeline / people / threads + tours | F11 | ⏳ | [F11](plans/F11.md) |
| 9 | Traditions lens | F10 | ⏳ | [F10](plans/F10.md) |
| 10 | Share cards, /today, OG images, RSS, email signup | F07, F15 | ⏳ | [F07-F15](plans/F07-F15.md) |
| 11 | Analytics | F08 | ⏳ | [F08](plans/F08.md) |
| 12 | Classroom packs, edition, sponsorship, commerce links | F12, F14 | ⏳ | [F12-F14](plans/F12-F14.md) |
| 13 | Full regression (all suites), `/done` review, Netlify project | — | ⏳ | — |

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
- **Commerce, email, analytics:** built and wired, but disabled until account IDs are set in `src/config/site.ts`.

## Changelog
- 2026-10-10: core experience done (F16, F17, F01, F13, F02, F03, F09). Unit 45 ✓, e2e + perf 45 ✓. Bugs caught by tests and fixed: heart unclickable under the aorta's hit stroke; back gesture leaving the page after Esc; tap→story 121ms → < 100ms (panel first, ink after paint; content-visibility on footnotes).
- 2026-10-10: plan created; F17 brief added; AC IDs added to all briefs.
