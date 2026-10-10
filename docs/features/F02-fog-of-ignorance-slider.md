# F02 — "Fog of ignorance" timeline slider

**Priority:** MVP (core mechanic) · **Depends on:** F01, F04 · **Used by:** F03, F07

## Summary
A timeline slider that sets the "current year". Every structure is rendered according to what was understood about it by that year: fogged, partly revealed or fully lit. Dragging forward shows knowledge filling in over centuries. This is the product's signature interaction and the leading diagnostic for whether the concept works.

## User problem / job
"I want to *feel* how little was known, and when it changed." No book or video can show the accumulation spatially.

## User stories
- As a reader, I can drag a slider from antiquity to today and watch structures reveal.
- As a reader, I can jump between anchor eras with one tap: **c. 200 (Galen) · 1242 (Ibn al-Nafis) · 1543 (Vesalius) · 1628 (Harvey) · 1950 · Today**.
- As a reader, I see a short caption for the current era ("1543: Vesalius publishes the *Fabrica* ...").
- As a reader, I can tell the difference between "not known", "seen but not understood" and "believed wrongly".

## Scope
**In**
- Continuous slider (range c. 1600 BCE to the current year) with snap points at the anchors.
- Non-linear scale. Most action is 1500–1900, so a linear scale would waste most of the track on antiquity. Use a piecewise scale with anchors evenly spaced.
- Derived per-structure state (see below), rendered as opacity, desaturation and a texture/hatch.
- Era caption + "N structures revealed" counter.
- Prev/next anchor buttons and keyboard arrows.
- Optional autoplay ("Play history") that steps through the anchors (respects reduced motion).

**Out**
- Multiple lenses (morphology-only vs function-only) — later, see open questions.
- Per-tradition fog (F10).

## Behaviour & UX notes
**State derivation** (pure function, unit-tested):

```
stateAt(structure, year):
  ds = discoveries touching structure with yearStart <= year
  if none                     -> UNKNOWN          (full fog)
  if any kind=function         -> UNDERSTOOD       (fully lit)
  else                         -> DESCRIBED        (half-lit: seen, purpose unclear)
  misbelief = an active priorBelief applies at year and isn't yet corrected
                               -> overlay marker (e.g. dashed outline + "belief" tag)
```

- **Fog ≠ darkness everywhere at 200 AD.** Egyptian, Alexandrian and Galenic knowledge mean several structures are already DESCRIBED or UNDERSTOOD. That's the point: the fog is uneven.
- Contested-date discoveries (F05) reveal at `yearStart` but show a "date contested" marker.
- Default landing year is **Today** (fully lit, pretty). The onboarding nudge asks people to drag back. Alternative: land at 200 AD and push forward. A/B later.

## Acceptance criteria
- [ ] `stateAt` is a pure function with unit tests covering the anchor years for every structure in the content set.
- [ ] Snapping to each anchor shows the expected state for a hand-checked fixture of ≥ 10 structures.
- [ ] The slider is operable by keyboard (arrows step years, PageUp/PageDown step anchors) and announces the year and era caption to screen readers (`aria-valuetext`).
- [ ] Fog transitions animate in ≤ 300ms, and changes are instant under `prefers-reduced-motion`.
- [ ] The current year is reflected in the URL (`?y=1628`) for deep links (F07).
- [ ] 60fps on a mid-range phone while dragging, with ~25 regions.

## Data & dependencies
- `Discovery.yearStart`, `kind`, `priorBelief`, `status`.
- `Era { year, label, caption }`, about 6 records.

## Risks & accuracy notes
- **Whig-history critique (PRD OQ1).** The fog measures the past against modern anatomy. Mitigation: an "About the fog" note says this plainly, and misbelief markers make clear that past models were coherent systems, not just blanks.
- "Understood" is fuzzy. The three-state model is a deliberate simplification. Document the rules publicly so it's honest, not hidden.
- Dates before ~1500 are often approximate (c., fl.). Never show false precision.

## Open questions
- Is the slider range anchored at c. 1600 BCE (Edwin Smith Papyrus) or does it start at 500 BCE to keep the track readable?
- Should the anchors be fixed or content-driven (e.g. auto-add 1661 Malpighi)?
- Should there be a "lens" toggle (structure vs function) in v1.1?
