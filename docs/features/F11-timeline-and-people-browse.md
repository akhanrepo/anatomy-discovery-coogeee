# F11 — Timeline, people & threads

**Release:** v1 · **Depends on:** F04 · **Used by:** F12 (packs), F14 (edition)

## Summary
Non-spatial ways in, generated from existing content: a **timeline** of all discoveries and misbeliefs, a **people** index, and **threads**, which are curated guided tours that play as a sequence on the body.

## v1 threads
| Thread | Tabs |
|---|---|
| The circulation of the blood | VI → IX → XII → XIV → XVI → XVII |
| The brain and nerves | I → II → III → VII → XVIII → XXII |
| Seeing the invisible (microscopy) | XVII → XIX → XX → XXI → XXII |
| Myths and "firsts" | IV → X → XII → XIX → XXV → XXVI |
| Beyond Europe | I → IV → V → VIII → IX (+ lenses) |
| The hidden vessels (lymph) | XV → XXV |

## Scope
- `/timeline`: an engraved horizontal timeline (shares the panorama art).
- `/people`, `/people/{id}`: name in original script, dates, tradition, what they got right and wrong.
- `/threads/{id}`: intro + **"Play this tour"**, which drives the body: the slider moves and stories open in sequence, with next/prev controls.
- Thread intros (≈ 150 words) are verified like everything else.

## Acceptance criteria
- [ ] All pages are statically generated with no new data beyond `Thread` records.
- [ ] Tours are keyboard operable, with pause/resume.
- [ ] Every person page links to every discovery and misbelief they're part of.
