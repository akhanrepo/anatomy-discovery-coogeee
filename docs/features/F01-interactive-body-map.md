# F01 — Interactive 2D body map

**Priority:** MVP · **Depends on:** F04 (structure list), F06 (art) · **Used by:** F02, F03, F07

## Summary
A single illustrated human body, drawn in 2D, where each of ~25 structures is a selectable region. It's the spatial canvas for everything else: the fog (F02) paints onto it, and a tap opens a story (F03).

## User problem / job
"I want to *see* where in the body a discovery happened, not just read about it." Every competitor is linear text or a plain atlas, so the spatial view is the wedge.

## User stories
- As a reader, I can tap or click a structure to open its discovery story.
- As a reader, I can tell at a glance which structures are interactive.
- As a reader on a phone, I can pan and zoom enough to hit small structures (e.g. the venous valves or the recurrent laryngeal nerve).
- As a screen-reader user, I can reach every structure from a list and open the same story.

## Scope
**In**
- One composite body view: anterior, with a "cutaway" treatment of the thorax, abdomen and head so internal organs are visible. No layer peeling.
- ~25 hit regions keyed by stable `structureId` (matching F04).
- Hover/focus highlight, label tooltip and selected state.
- Pinch-zoom/pan on mobile. Zoom buttons on desktop.
- Accessible list ("All structures") as an alternative to the visual map.

**Out**
- Multiple views (posterior, lateral), sex-specific bodies, layers toggle (later).
- 3D (F13).
- Anatomical completeness. Unlinked structures are drawn but not interactive.

## Behaviour & UX notes
- Visual style is the main open decision (PRD OQ5). Options:
  - **A. New neutral line illustration** in an engraving style. Clean regions, easy fog rendering, consistent look. Costs illustration time or a commission.
  - **B. Composite of public-domain plates** (Vesalius *Fabrica*, Gray's 1918). Very distinctive, but the plates don't share a pose or scale, and hit regions get messy.
  - **Recommendation:** A for the body itself, with B's plates used inside the stories (F03/F06). This gives a distinctive identity without fighting the art.
- Small structures need hit targets of at least 44×44px. Use invisible enlarged hit areas.
- Overlapping structures (e.g. heart vs pulmonary circulation): if a tap hits several regions, show a small chooser.

## Acceptance criteria
- [ ] Every `structureId` in the content set exists as exactly one SVG region (CI check, shared with F05).
- [ ] Tapping/clicking any interactive region opens the corresponding story within 100ms (no network fetch on the critical path).
- [ ] All regions are reachable and operable by keyboard (Tab/Enter) with a visible focus ring.
- [ ] Works at 375px width without horizontal scroll. Pinch-zoom doesn't break the page layout.
- [ ] The "All structures" list exposes the same set and the same actions.
- [ ] The SVG body is under 300KB gzipped.

## Data & dependencies
- `Structure { id, name, system, svgRegionId, parentId? }`
- Art from F06 or a commission.

## Risks & accuracy notes
- The modern body is a *schematic backdrop*, not a reference atlas. Say so in the footer.
- The cutaway style can confuse ("why can I see the heart and the skin?"), so keep it obviously diagrammatic.

## Open questions
- Should the body be male, female or deliberately androgynous? Historical plates are overwhelmingly male. The structure set includes reproductive anatomy (Fallopio), which forces the question.
- Does the map need a "systems" filter (circulatory, nervous...) in the MVP, or is the fog enough?
