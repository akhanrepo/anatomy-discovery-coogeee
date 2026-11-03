# F06 — Historical image library & rights provenance

**Release:** v1 · **Type:** Content system · **Used by:** F01, F03, F07, F10, F12, F14, F16

## Summary
A curated library of historical plates, manuscript pages and portraits for stories, the traditions lens, share cards, packs and the edition. Every image records its source, licence, credit and authenticity. It complements the **commissioned** body art (F16): the body is our own drawing, and the stories show what *they* drew.

## Scope
- `Asset { id, title, creator, date, sourceInstitution, sourceUrl, recordUrl, licence, credit, kind: plate|manuscript|portrait|photo|commissioned, authenticity: contemporary|later-depiction|unknown, altText, focalPoint, crops[] }`.
- **Allowed licences:** Public Domain / PDM, CC0, CC BY. **Not allowed:** CC BY-NC (blocks reuse of the CC BY-SA packs and edition, which allow commercial use) and CC BY-SA (complicates the edition). **The licence is checked on each individual record**, never assumed per institution. Wellcome, for example, mixes PDM, CC BY and CC BY-NC.
- Preferred sources: Wellcome Collection, US National Library of Medicine, Royal Collection Trust (check its terms: often *not* open), Biodiversity Heritage Library, Internet Archive, Cambridge Digital Library, national libraries, Wikimedia Commons (verify the underlying record).
- **Commissioned art** (F16) uses `kind: commissioned` and a contract that assigns rights to Ali, including commercial use, print and derivatives.
- Pipeline: originals in Cloudflare R2 (or Git LFS), with responsive AVIF/WebP derivatives built at deploy. Deep-zoom (IIIF) for manuscript pages where the source offers a IIIF manifest.
- Lightbox with zoom. A credits page lists every asset.

## Known-needed assets (from the accuracy review)
| Use | Asset | Licence status |
|---|---|---|
| Body pose reference | Vesalius *Epitome* male and female nudes (1543) | PD (pre-1900); check scan terms |
| Islamic lens | *Tashrīḥ-i Manṣūrī* (NLM copy, 1488) | Check NLM record |
| Ayurveda lens | "Ayurvedic Man", Wellcome 574912i | **Check: PDM or CC BY?** |
| Chinese lens | "Bronze Man" acupuncture woodcuts, 1537 edition, Wellcome | Check per record |
| Panorama reference | *Fabrica* muscle-men landscape backgrounds | PD |

## Acceptance criteria
- [ ] **F06-AC1** Build fails on a missing `licence`, `recordUrl`, `credit` or `altText`, or on a disallowed licence.
- [ ] **F06-AC2** Later depictions show a "Later depiction, {date}" label.
- [ ] **F06-AC3** Story images are ≤ 200KB at mobile size.

## Risks
- Royal Collection (Leonardo) images are often *not* openly licensed. Use PD scans from elsewhere, or link out.
- Some historical plates contain racist or colonial framing (e.g. 19th-century comparative anatomy). Exclude them, or contextualise them explicitly. Never use them decoratively.
