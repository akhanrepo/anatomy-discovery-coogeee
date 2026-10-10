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
| 10 | Share cards, /today, OG images, RSS, email signup | F07, F15 | ✅ done | [F07-F15](plans/F07-F15.md) |
| 11 | Analytics | F08 | ✅ done | [F08](plans/F08.md) |
| 12 | Classroom packs, edition, sponsorship, commerce links | F12, F14 | ✅ done | [F12-F14](plans/F12-F14.md) |
| 13 | Full regression (all suites), `/done` review, Netlify project | — | ✅ done | — |

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

## Open items after the v1 build (from the `/done` review)
Not met, and recorded rather than papered over:
1. **Edition chapter length (F14 scope):** about 1,200–1,500 words per chapter against 2,500–4,000. More verified long-form writing is needed.
2. **Tour intros (F11 scope):** about 25 words against about 150. They need expanding with cited claims and logs.
3. **Commissioned art (F16):** the figure is Tabula's schematic stand-in, in anatomical position, not the *Epitome* pose.
4. **Primary-source images (F03/F06):** story images are generated plates. Scans can't be fetched from this sandbox; drop them into `public/plates/` with `licenceVerified`.
5. **Lens plate licences (F10-AC3):** not yet confirmed on the Wellcome/NLM records, so the originals are deliberately not displayed.
6. **Proxy-tested criteria:** F07-AC2 (social validators → tag/size checks), F15-AC1 (W3C validator → structural checks), F15-AC2 (email clients → markup rules), F12-AC3 (purchase → delivery needs the Lemon Squeezy store), F13-AC4 (inline art, so no lazy load is needed).
7. **Not built from scope notes:** dragging a flap edge (the tabs work); the overlapping-structure chooser; a 44px minimum hit target for tiny structures (mitigated by 1×/2×/4× zoom and the list view); a facing-page two-figure desktop view (optional); sound (optional, "cut first").
8. **Config needed from Ali:** the Plausible domain, the Buttondown user, the Lemon Squeezy checkout URLs, and the site URL/domain.

## Changelog
- 2026-10-10: all features built. 63 unit + 119 e2e + 8 perf passing. `/done` review added zoom and edge-case tests and listed the open items above.
- 2026-10-10: core experience done (F16, F17, F01, F13, F02, F03, F09). Unit 45 ✓, e2e + perf 45 ✓. Bugs caught by tests and fixed: heart unclickable under the aorta's hit stroke; back gesture leaving the page after Esc; tap→story 121ms → < 100ms (panel first, ink after paint; content-visibility on footnotes).
- 2026-10-10: plan created; F17 brief added; AC IDs added to all briefs.
