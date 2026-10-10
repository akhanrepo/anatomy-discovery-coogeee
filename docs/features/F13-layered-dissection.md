# F13 — Layered dissection (fugitive-sheet flaps)

**Release:** v1 · **Replaces:** the earlier "3D body" brief · **Depends on:** F01, F16

## Summary
Depth without 3D. The figure can be opened **flap by flap** (skin → muscles → organs → skeleton), like the **anatomical "fugitive sheets"** of the 1530s: lift-the-flap prints (Vogtherr, Strasbourg 1538; de Negker, Augsburg 1538) that let readers dissect a paper body. Each layer has its own structures and its own fog state.

## Why not true 3D (decision)
- Art is the main selling point. A 3D mesh would abandon the engraved style, or demand a far costlier stylised 3D pipeline.
- It's heavy on mobile and hard to make accessible.
- Flaps are **historically native** to the subject. Lifting a paper flap *is* the period's own interactive anatomy, and nobody else does this.

## Scope
- 4 layers per figure: **Surface** (skin, surface regions as in the *Epitome* nudes) · **Muscles** · **Viscera & vessels** · **Skeleton & nervous system**.
- Interaction: drag a flap edge, or tap a layer tab in the margin. The flap folds back with a subtle paper-curl animation (CSS 3D transform on a 2D layer) and casts a soft shadow.
- Structures live on one layer (`Structure.layer`). Stories can request a layer (opening Tab. XI moves to the skeleton).
- Fog, misbeliefs and the lens all respect the current layer.
- Deep link: `?layer=viscera`.

## Acceptance criteria
- [ ] Flap open/close is 60fps on a mid-range phone, with an instant swap under reduced motion.
- [ ] Every layer is reachable by keyboard and labelled for screen readers.
- [ ] Opening a story on a different layer switches layers automatically, with an announced change.
- [ ] Layer art lazy-loads, and the first layer is interactive before the others finish loading.
