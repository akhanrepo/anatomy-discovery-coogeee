# F01 — Interactive body

**Release:** v1 · **Depends on:** F16 (art), F04 (structure list) · **Used by:** F02, F03, F07, F09, F13

## Summary
The central canvas: a commissioned engraving-style human figure, in **male and female versions after the nudes in Vesalius's *Epitome* (1543)**, where ~40 structures are selectable. The fog (F02) inks it in, flaps (F13) open it up, and a tap opens a story (F03).

## User problem / job
"I want to *see* where in the body a discovery happened, not just read about it." The spatial view is the wedge.

## User stories
- As a reader, I can tap a structure to open its discovery story.
- As a reader, I can see which structures are interactive: a manicule (☞) and gold outline on hover or focus.
- As a reader, I can switch between the male and female figure. Structures specific to one sex (e.g. the uterine tubes, F04 #15) appear only on that figure, and the other figure shows a pointer to it.
- As a reader on a phone, I can pinch-zoom and pan to reach small structures (venous valves, recurrent laryngeal nerve).
- As a screen-reader user, I can reach every structure from a list and open the same story.

## Scope
**In**
- Two figures (male and female), anterior view, sharing one structure ID space (`Structure.sex: both|male|female`).
- ~40 interactive structures across the 4 flap layers (F13). ~25 carry discoveries, and the rest are context (for misbeliefs and traditions links).
- Hit regions as simplified SVG polygons with a minimum 44×44px effective target. If a tap overlaps several structures, a small chooser appears.
- Zoom: pinch and pan on mobile; scroll or buttons on desktop; zoom levels at 1×, 2× and 4× with art resolution to match.
- "All structures" accessible list, grouped by system and layer.
- Desktop ≥ 1200px: both figures can be shown side by side as a facing-page spread (like the *Epitome*), as an optional view.

**Out**
- Posterior and lateral views.
- 3D (replaced by F13).

## Behaviour & UX notes
- The modern body is an artful schematic, not a reference atlas. The footer says so.
- Selected structure: shell-gold outline + its name in the margin in small caps.

## Acceptance criteria
- [ ] Every `structureId` in content exists as exactly one hit region per applicable figure (CI).
- [ ] A tap opens the story in < 100ms (no network on the critical path).
- [ ] Every region is reachable by keyboard with a visible focus ring. The list view offers the same actions.
- [ ] Works at 375px without horizontal scroll, and pinch-zoom doesn't break the layout.
- [ ] The figure toggle keeps the slider year and the open story where applicable.

## Data & dependencies
`Structure { id, name, system, layer, sex, svgRegionId, parentId? }` · art layers from F16.

## Risks
- Two figures double the illustration cost. Mitigation: shared structures are drawn once and composited where the anatomy allows. The illustrator advises.
