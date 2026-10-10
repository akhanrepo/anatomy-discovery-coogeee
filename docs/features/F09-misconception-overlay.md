# F09 — "What they got wrong" misconception overlay

**Priority:** Later (v1.1 candidate) · **Depends on:** F01, F02, F04

## Summary
A visual layer that draws the *believed* anatomy of an era on the body, ghosted over the modern schematic. Examples: Galen's invisible pores in the interventricular septum, the *rete mirabile* at the base of the human brain, veins originating in the liver, the three-ventricle "cell doctrine" of the brain. As the slider passes the correcting discovery, the false structure dissolves.

## Why it matters
"What they got wrong first" is the most distinctive part of the pitch, and showing it beats telling it. It also answers the Whig-history critique (F02): past models appear as coherent systems, not blanks.

## Why not MVP
It needs its own illustrations per misbelief and careful sourcing of what was actually believed (and by whom). The MVP covers misbeliefs in text (F03 "What it overturned") and with a marker (F02).

## Scope (when built)
- `Misbelief { id, title, heldBy[], yearStart, correctedBy (discoveryId), svgOverlayId, claims[] }`.
- Overlay toggle: "Show beliefs of the time".
- 5–8 misbeliefs, drawn in a distinct style (e.g. red-brown ink, dashed).

## Acceptance criteria (draft)
- [ ] Every misbelief is cited to a primary source of the belief *and* a secondary source on its correction.
- [ ] Misbeliefs dissolve exactly at the `correctedBy` discovery's `yearStart`, with a link to that story.

## Open questions
- Should beliefs that were "corrected" in one tradition but persisted in another (e.g. Galenism in European teaching after Ibn al-Nafis) be shown per tradition? This links to F10.
