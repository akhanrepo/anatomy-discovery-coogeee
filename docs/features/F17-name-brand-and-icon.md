# F17 — Name, brand & icon

**Release:** v1 · **Depends on:** F16 · **Used by:** every page, share cards (F07), packs (F12), edition (F14)

## Decision: **Tabula**
*Tabula: the body, as it was written.*

The name works three ways, and all three are the product:
1. **A plate.** Anatomical illustrations are *tabulae* ("Tab. I"), and every discovery here is a numbered plate.
2. **A blank slate** (*tabula rasa*). The body starts as unwritten paper and is inked in over 3,600 years (F02, F16).
3. **Vesalius's first anatomy**, the *Tabulae anatomicae sex* (1538), six broadsheets with images keyed to captions. That's what we're building, five centuries on.

It's short, pronounceable in most languages, and it isn't tied to one tradition or one hero, which matters for a product that deliberately goes beyond Europe.

**Alternatives considered:**
- *The Unwritten Body*: kept as the art concept and tagline material, but too long for a name.
- *Palimpsest*: the exact metaphor, but hard to spell and say.
- *Fabrica*: too Vesalius-centric.
- *Body of Knowledge*: lovely pun, but a generic phrase that's impossible to own.
- *Tashrīḥ*: beautiful, but opaque to the Anglophone market.

**Domain candidates (availability not yet checked):** `tabula.ink` (the ink metaphor), `readtabula.com`, `tabula.studio`, `tabulahistory.com`.

## Icon: the half-inked heart
A heart drawn as an engraving and split vertically. The **left half** is line only (*described*) and the **right half** is cross-hatched with a madder wash (*understood*). Below it sits a faint vermilion dot: a septal pore that's being erased. The whole concept fits in one glyph, and the heart anchors the best-known thread (circulation).

| Size | Rendering |
|---|---|
| 512 / 192 / 180 px (app, Apple touch) | Full engraving: hatching + wash + paper ground |
| 32 px | Simplified: outline left, solid madder right |
| 16 px / favicon | Two-tone heart silhouette (ink / madder) |
| Mono | Ink only, for print and embossing |

Dark-mode variant: gold line on umber ground.

## Brand system (summary; tokens live in F16)
- **Wordmark:** "TABULA" set in IM Fell English small caps, letter-spaced, with a manicule ☞ as the optional mark.
- **Voice:** curious, exact, unpretentious. We say "we don't know" and "historians disagree" out loud.
- **Tagline options:** "The body, as it was written." · "Who figured out the body, and what they got wrong first."

## Acceptance criteria
- [ ] **F17-AC1** The name "Tabula" and its tagline appear in the `<title>`, header wordmark, OG cards and web manifest, from a single config source.
- [ ] **F17-AC2** Favicon set (SVG + 32 + 180 + 192 + 512 PNG) and `site.webmanifest` exist and are referenced in the page head.
- [ ] **F17-AC3** The SVG icon renders legibly at 16px, using the two-tone fallback via an SVG media query or a separate file.
- [ ] **F17-AC4** An `/about` page explains the name's three meanings.

## Open questions
- Domain availability and trademark search (AU, UK, US) before public launch.
