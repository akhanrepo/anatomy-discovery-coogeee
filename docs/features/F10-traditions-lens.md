# F10 — Traditions lens

**Release:** v1 · **Depends on:** F05 (verification), F06 (plates), F16 (frame styling)

## Summary
A lens selector swaps the modern figure for **a tradition's own historical body diagram**, with hotspots that explain its concepts *in its own terms*. Each concept is explicitly linked, or explicitly not linked, to modern structures. This complements the modern-reference fog (F02): the fog asks "how much of *today's* anatomy was known?", and the lens asks "how did *they* see the body?"

## Why its own plate (not an overlay on our body)
Drawing acupuncture channels or *marma* points on a modern anatomical figure implies an equivalence (or a clinical validation) that isn't there. Using each tradition's own historical image is more honest, more beautiful, and needs no new illustration.

## v1 lenses
| Lens | Plate (from accuracy review) | Concepts (≈ 6–10 hotspots each) |
|---|---|---|
| **Islamic world (Galenic)** | *Tashrīḥ-i Manṣūrī*, Mansur ibn Ilyas, c. 1390s; the NLM copy (1488) shows five systems: bones, nerves, muscles, veins, arteries | One page per system, with the five-system scheme itself as the lesson |
| **Classical Chinese** | "Bronze Man" acupuncture woodcuts, 1537 edition (Wellcome) | *zang-fu* organs, channels (*jingluo*), *qi*, xue; ties to Tab. IV ("The circulation that wasn't") |
| **Ayurveda** | "Ayurvedic Man", Nepal, 18th c. (Wellcome 574912i), with text from the *Bhāvaprakāśa* | *doṣa*, *dhātu*, *srotas*, *marma*; ties to Tab. V |
| **Modern** (default) | Our figure (F16) | — |

(A Greco-Roman/Galenic lens is effectively covered by the misbelief layer, F09.)

## User stories
- As a reader, I switch the lens and see a tradition's own body picture with its own vocabulary (original script + transliteration).
- As a reader, each concept says how it relates to modern anatomy: **corresponds**, **partially corresponds**, or **no modern equivalent**.
- As a reader, I'm told clearly that this is history, not health advice.

## Data
`Tradition { id, name, plateAssetId, era, intro, sources[] }` · `TraditionConcept { id, traditionId, name, nameOriginal, script, story, claims[], hotspot (polygon on plate), relatesTo[]: { structureId, relation } }`

## Acceptance criteria
- [ ] **F10-AC1** Each lens has ≥ 6 concepts, each verified (F05) with ≥ 1 **specialist** scholarly source (e.g. Unschuld, Wujastyk, Meulenbeld, Savage-Smith) and a page locator.
- [ ] **F10-AC2** Every concept has an explicit `relatesTo` (which may be empty, with "no modern equivalent").
- [ ] **F10-AC3** Plate licences are confirmed on each record (F06). If one is NC, swap in an alternative plate before launch.
- [ ] **F10-AC4** A disclaimer appears on every non-modern lens: "Historical description, not medical advice."

## Risks
- This is the highest-risk content for misrepresentation. Verification uses specialist sources only, and if a concept can't be verified to that standard it's cut, not softened.
