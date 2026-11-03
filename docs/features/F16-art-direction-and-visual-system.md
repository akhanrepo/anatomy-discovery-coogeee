# F16 — Art direction & visual system: "The Unwritten Body"

**Priority:** v1, **critical path** (the longest lead time in the project) · **Used by:** every visual feature

## The idea in one line
**The body is a book still being written.** Knowledge isn't light pushing back fog. It's *ink* laid down on a page over centuries: first an outline, then hatching, then hand-colour. Wrong ideas are written in red, then scraped away, and they leave a faint trace, like a palimpsest.

## Why this direction (and not the alternatives)

| Option | Verdict |
|---|---|
| **A. Grey fog over a modern medical illustration** | Generic. It looks like every anatomy app, and the "fog" reads as a loading state. Rejected. |
| **B. Collage of historical plates** (Vesalius, Gray's...) | Beautiful individually, but they don't share pose, scale or style, so hit areas get messy and the result looks like a scrapbook. Rejected as the *body*. Kept as the *story imagery* (F03/F06). |
| **C. Body changes art style per era** (manuscript → woodcut → engraving → photo) | Stunning in theory, but it needs about 7 complete bodies, the body loses continuity, and the cost is prohibitive. Rejected in full. Kept as a **subtle per-era treatment of paper, ink and marginalia** (below). |
| **D. "The Unwritten Body"**: one master engraving, revealed in ink states | One body to commission. The fog states map *semantically* onto how engravings are made, it's historically rooted, it works in light and dark, and it's distinctive and hard to copy well. **Chosen.** |

This also answers the "Whig history" concern visually: past models aren't drawn as darkness but as **red-ink writing in their own right** (F09).

## The visual grammar

### 1. Knowledge = ink states (the fog, made beautiful)
| State (F02) | How it's drawn | Historical analogue |
|---|---|---|
| `UNKNOWN` | Blank paper with only a faint blind-embossed contour (the plate mark), so the figure always reads as a body | An uninked plate impression |
| `DESCRIBED` (seen, not understood) | **Line only**: confident engraved contour in iron-gall brown-black | The engraver's first state proof |
| `UNDERSTOOD` | **Full cross-hatching + hand-coloured wash** | Hand-coloured presentation copies of the *Epitome* |
| `MISBELIEF` | Drawn in **vermilion** in the *believed* form (veins radiating from the liver, pores in the septum, the *rete mirabile* net) | Rubrication in manuscripts |
| `CORRECTED` | Red ink **scraped away** with an erasure animation, leaving a ghost trace you can still see | Palimpsest |

**Reveal animation:** when the slider passes a discovery, the structure *inks in*. Line strokes draw on, then the hatching bleeds through a noise mask, then the colour wash floods (about 900ms total). Under `prefers-reduced-motion` it's an instant crossfade.

### 2. The figure(s)
- **Pose and proportion are based on the two nudes in Vesalius's *Epitome* (1543)**: a male and a female figure on facing pages. They give us a historically grounded **male/female toggle** that resolves the old F01 question.
- **Redrawn, not traced:** a commissioned illustrator draws a new master in **copperplate-engraving style** (line + cross-hatch + stipple), at about 4000px height. Each structure is drawn as separate, aligned layers.
- Internal structures are seen through **fugitive-sheet flaps** (F13): skin → muscle → organs → skeleton, as in 1530s lift-the-flap prints.

### 3. Per-era "paper" (the subtle version of option C)
The figure stays constant while the **substrate, ink tone and marginalia** shift with the slider:

| Era | Paper | Ink | Marginal script (era caption) |
|---|---|---|---|
| Antiquity (to c. 500) | Papyrus fibre texture | Carbon black | Greek uncials / hieratic motif |
| Medieval & Islamic world (500–1450) | Vellum, warm | Iron-gall brown | Arabic *naskh* (Amiri); Latin gothic |
| Renaissance (1450–1650) | Laid rag paper with chain lines | Woodcut black | Roman capitals (EB Garamond) |
| Early modern (1650–1800) | Laid paper, finer | Engraver's black | IM Fell (17th-century Oxford types) |
| 19th century | Smooth wove, slight foxing | Lithographic grey-black | Didone-style caption |
| 20th century (1900–1990) | Coated paper | Halftone dots in the shading | Grotesque sans |
| Today | Clean ivory; in dark mode, a backlit "light-table" glow | Ink + luminous colour | Modern serif |

The transitions are slow crossfades of textures only, with no re-render of the figure.

### 4. Colour = historical pigments (systems colour-coded)
Each wash uses a pigment colourists actually had:

| Token | Pigment | Used for |
|---|---|---|
| `--ink` | Iron-gall | Line work, text |
| `--paper` | Rag paper | Background |
| `--madder` | Madder lake (crimson) | Arteries, heart |
| `--indigo` | Indigo | Veins |
| `--orpiment` | Orpiment (yellow) | Nerves, brain |
| `--verdigris` | Verdigris (green) | Lymphatics, glands |
| `--ochre` | Yellow ochre | Viscera, digestion |
| `--bone` | Lead white / bone | Skeleton |
| `--vermilion` | Vermilion | **Reserved for misbeliefs only** |
| `--gold` | Shell gold | Selection, focus, "today" |

All tokens are tuned for contrast (text ≥ 4.5:1). The system colours are distinguishable for the common colour-vision deficiencies when paired with hatching patterns, so colour is never the only signal.

**Dark mode: "Candlelit theatre".** The paper is deep umber-black, the lines become **shell-gold**, washes glow softly, and vermilion stays vermilion. It's evocative of a candlelit anatomy theatre and of gold-ground manuscripts.

### 5. Interface furniture from the book trade
- **Manicules (☞)**, the pointing hands of medieval marginalia, mark tappable story hotspots.
- **Plate numbers**: each discovery is a "Tabula" (Tab. I–XXV). Share cards and print packs use them.
- **The timeline slider is an engraved panorama.** In homage to the *Fabrica* muscle-men, whose backgrounds join into one continuous landscape, the slider track is a continuous engraved landscape of the places where the body was understood: Thebes → Croton → Alexandria → Han China → Kashi (Varanasi, by tradition Sushruta's city) → Rome → Cairo/Damascus → Shiraz → Padua → London/Oxford → Leiden/Delft → Paris → Madrid → today. The thumb is a **reading glass**.
- **Typography:** EB Garamond (text; Garamond's type is contemporary with Vesalius), IM Fell English (display), Amiri (Arabic), Noto Serif SC/TC (Chinese), Noto Serif Devanagari (Sanskrit), Inter (small UI only). Names are shown in their original script beside the transliteration (e.g. ابن النفيس), as respect and as ornament.

### 6. Sound (optional, off by default)
Quill scratch on ink-in and a page-turn on era change. Muted by default, with one toggle. *Cut it first if time is short.*

## Production plan
1. **Art spec** (this doc + reference board) → **commission an engraving-style scientific illustrator.** Get 3 quotes. Deliverables: male and female master figures; 4 flap layers each; ~40 structures as separate aligned layers in 3 states (line / hatch / wash); 6–8 misbelief drawings in red line; the panorama strip; 7 paper textures.
2. **Format:** line art as **SVG paths** (for stroke-draw animation and crisp zoom). Hatching and washes as **aligned raster layers** (AVIF/WebP, 2×) revealed through SVG masks. Hit regions as simplified SVG polygons.
3. **Placeholder track:** development uses a schematic placeholder body with the same structure IDs, so code and content proceed in parallel with the commission. The art drops in by ID.
4. **Why not AI-generated art:** the licensing is uncertain (it blocks open licensing of the packs and the edition), it's hard to keep consistent across ~120 aligned layers, and it undercuts a brand built on authenticity and sourcing.

## Acceptance criteria
- [ ] **F16-AC1** Reveal, misbelief and erasure animations run at 60fps on a mid-range phone.
- [ ] **F16-AC2** Every state is distinguishable in greyscale, through line vs hatch vs wash.
- [ ] **F16-AC3** Light and dark themes both pass WCAG AA for text.
- [ ] **F16-AC4** The total first-load art payload at mobile size is ≤ 1.5MB. Layers lazy-load per flap.
- [ ] **F16-AC5** Every original-script name renders with a proper font (no tofu).

## Open questions
- What's the illustrator budget ceiling? It sets the number of structures drawn in full and the misbelief count.
- Should both figures be visible side by side on desktop (as in the *Epitome*), or toggled?
