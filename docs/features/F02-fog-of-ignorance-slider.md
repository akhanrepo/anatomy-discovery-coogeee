# F02 — Timeline slider ("the fog")

**Release:** v1 (core mechanic) · **Depends on:** F01, F04, F16 · **Used by:** F03, F07, F09

## Summary
A slider sets the year, and every structure is drawn according to what was understood by then. Not yet known means blank paper. Seen but not understood means an engraved outline. Understood means full hatching and hand-colour. Misbeliefs current at that year are written in vermilion (F09). Dragging forward, you watch the body being **written in**. This is the signature interaction.

## Framing (decided)
The fog **measures past knowledge against modern anatomy**. We accept that and say so plainly in an "About the fog" note: *"This view asks: how much of today's anatomy was known in a given year? It's a deliberately modern question. Past physicians had complete, coherent models of their own. You can see those in red ink (beliefs) and in the Traditions lens."*

## User stories
- As a reader, I can drag from antiquity to today and watch structures ink in.
- As a reader, I can jump between anchor eras with one tap: **c. 1600 BCE · c. 200 · c. 1242 · 1543 · 1628 · 1800 · 1950 · Today**.
- As a reader, I see a margin caption for the current era, in a period-appropriate script (F16).
- As a reader, I can tell "unknown", "described" and "understood" apart without relying on colour.
- As a reader, I can press **Play history** and watch the whole sequence animate (about 60s).

## Scope
**In**
- Range c. 1600 BCE → current year. A **piecewise scale** gives each anchor era equal track width. Otherwise 1500–2000, where most of the action is, would be squeezed into a sliver.
- **Track = engraved panorama** (F16) of the places where knowledge was made. The thumb is a reading glass that shows the year.
- Pure `stateAt(structure, year)` engine + `activeMisbeliefs(year)`.
- Era treatments: paper texture, ink tone, marginal script (F16).
- Counter: "14 of 40 structures known".
- Prev/next anchor buttons, keyboard and autoplay.
- Year in the URL (`?y=1628`).

## State engine (pure, unit-tested)
```
stateAt(structure, year):
  year >= present           -> UNDERSTOOD   (Today = modern reference, fully inked)
  structure has no stories  -> DESCRIBED    (context organ, outline only; see "About the fog")
  ds = non-revised discoveries touching structure with yearStart <= year
  any kind in {function, molecular}      -> UNDERSTOOD   (line + hatch + wash)
  any kind in {morphology, microscopic}  -> DESCRIBED    (line only: seen, not yet understood)
  none                                   -> UNKNOWN      (blank paper + plate-mark contour)

activeMisbeliefs(year):
  misbeliefs with yearStart <= year, not yet corrected in the mainstream
  -> vermilion; after the "first" correction a partial ghost, after "mainstream" a full erasure
```
- `revised` stories (myths, e.g. Tab. IV) never ink anything in. They're in the panel, not the fog.
- *Microscopic* observation counts as *described*, not understood: Langerhans saw the islets in 1869, and their function waited until 1921.
- The body isn't blank at c. 200. Egyptian, Alexandrian and Galenic knowledge are already inked. The unevenness is the point.
- Contested-date discoveries reveal at `yearStart`, with a "date contested" mark in the margin.
- Default landing year is **Today** (most beautiful), with a nudge to drag back.

## Acceptance criteria
- [ ] **F02-AC1** `stateAt` and `activeMisbeliefs` are pure, with fixture tests at every anchor for every structure.
- [ ] **F02-AC2** The slider is keyboard operable (arrows = years, PageUp/PageDown = anchors). `aria-valuetext` announces the year + era caption + count.
- [ ] **F02-AC3** Ink-in ≤ 900ms; erasure ≤ 700ms; instant under reduced motion.
- [ ] **F02-AC4** 60fps while dragging on a mid-range phone with all layers visible.
- [ ] **F02-AC5** Deep link `?y=` restores the state exactly.

## Risks
- "Understood" is a simplification. The three-state rules are published on the About page so the simplification is honest, not hidden.
- Pre-1500 dates are approximate (c., fl., ranges). Never show false precision.
