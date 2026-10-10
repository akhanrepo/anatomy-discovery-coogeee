# F10 — Traditions lens

**Priority:** Later · **Depends on:** F02, F04, F05; needs specialist review

## Summary
A lens selector that shows how a *specific tradition* understood the body in its own terms. Lenses could include Hippocratic/Galenic humoral anatomy, medieval Islamic medicine, classical Chinese medicine (*zang-fu* organs, channels) and Ayurveda (*doshas*, *marma*, *srotas*), alongside the modern-reference fog.

## Why it matters
- It answers the strongest scholarly critique of the core mechanic: that measuring every culture against modern anatomy makes non-European traditions look like "fog with a few lights". Their models had different aims and categories.
- It supports the brief's commitment to non-European contributors with substance, not tokens.
- It would be a strong draw for teachers (Modern History, TOK) and museums.

## Why not MVP
- Mapping is hard and easy to get wrong. A TCM channel or a *marma* point isn't a modern anatomical structure, so drawing one on the modern body risks implying an equivalence (or a validation) that isn't there.
- It needs a historian of Chinese and of Indian medicine to review it. The MVP includes those traditions only where a specific, sourceable *anatomical* claim exists (F04 #4, #5), and labels them as contested where appropriate.

## Scope (when built)
- `Tradition { id, name, era, description, sources[] }`, with a `TraditionModel` per tradition that holds its own body diagram (ideally a historical one, e.g. a Chinese acupuncture chart or an Islamic anatomical manuscript like the *Tashrīḥ-i Manṣūrī*) instead of forcing the modern body.
- Side-by-side or toggle view: "their body" vs the modern schematic.
- Clear framing copy: description, not endorsement of clinical efficacy.

## Open questions
- Should each lens use its own historical diagram (more honest, more work) or overlay the shared body (cheaper, more distortion)? The recommendation is its own diagram.
- Which tradition goes first? Islamic-world medicine is closest to the Galenic thread already in the MVP, so it's lowest risk.
