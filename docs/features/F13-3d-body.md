# F13 — 3D body

**Priority:** Later / optional · **Depends on:** F01 (structure IDs), F02 (state function)

## Summary
A rotatable 3D body (three.js / react-three-fiber) with the same structures, fog states and stories as the 2D map.

## Why not MVP
The brief says it explicitly: 3D isn't needed to test the idea. It's asset-led (the opposite of the wedge), heavy on mobile and harder to make accessible. The historical art is 2D, so 3D also dilutes the visual identity.

## Keep the door open by
- Using stable `structureId`s that a 3D model's mesh names can map to.
- Keeping `stateAt(structure, year)` renderer-agnostic (F02).
- Source candidates: BodyParts3D (CC BY-SA, check licence implications against F06), Z-Anatomy.

## Trigger to build
The success metric is hit, and qualitative feedback asks for depth or rotation. Or a museum/sponsor funds it.
