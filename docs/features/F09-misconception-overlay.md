# F09 — Misbeliefs in red ink

**Release:** v1 · **Depends on:** F01, F02, F04, F05, F16

## Summary
Past anatomical *beliefs* are drawn on the body in **vermilion**, in the form people believed: pores through the heart's septum, veins growing from the liver, a *rete mirabile* net under the human brain. When the slider passes the correction, the red is **scraped away**, leaving a faint ghost (a palimpsest). This makes "what they got wrong first" visible, and shows past models as coherent ideas rather than blanks.

## User stories
- As a reader, at any year I see the misbeliefs current then, in red.
- As a reader, I can tap a red structure and read the belief: who held it, why it was reasonable at the time, and who corrected it.
- As a reader, I can toggle "Show beliefs of the time" off for a clean view.
- As a reader, corrected beliefs leave a ghost, and tapping it shows the history.

## v1 misbelief set (all to pass F05 verification)
| Misbelief | Held by (examples) | Corrected by | Tab. |
|---|---|---|---|
| Arteries carry *pneuma*, not blood | Erasistratus | Galen | VI |
| Pores in the interventricular septum | Galen; Ibn Sina | Ibn al-Nafis (c. 1242); in Europe Colombo (1559), Harvey (1628) | IX, XII |
| *Rete mirabile* at the base of the human brain | Galen (from animal dissection) | Vesalius (1543) | XI |
| Lower jaw is two bones | Galen (dog anatomy) | Vesalius (1543) | XI |
| Venous valves slow blood flowing outward | Fabricius | Harvey (1628) | XIV, XVI |
| Veins arise from the liver; blood is made and consumed | Galenic physiology | Harvey (1628) | XVI |
| Lacteals carry chyle to the liver | Aselli | Pecquet (1650/51), an inline correction | XV |
| Nervous system is one continuous network (reticular theory) | Golgi | Cajal (1888–89; settled by electron microscopy in the 1950s) | XXII |
| The brain has no lymphatic vessels | Textbook view after Retzius & Key | 2015 papers (and Mascagni 1787) | XXV |

**Tradition nuance:** a misbelief can be corrected in one tradition and persist in another. Septal pores were refuted by Ibn al-Nafis but taught in Europe until the 16th century. The red ink fades to a *partial* ghost at the first correction and erases fully at the correction that became mainstream. The tooltip explains both dates.

## Data
`Misbelief { id, title, heldBy[], yearStart, corrections[] ({ year, by: discoveryId | {who, citation}, scope: "first"|"mainstream" }), structures[], svgOverlayId, claims[] }`

## Acceptance criteria
- [ ] Each misbelief cites a primary source *for the belief* and a scholarly source for its correction.
- [ ] Erasure triggers exactly at each correction year (partial / full).
- [ ] Red is never used for anything except misbeliefs (design-token lint).
