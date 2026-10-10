# F06 — Historical image library & rights provenance

**Priority:** MVP · **Type:** Content system · **Depends on:** — · **Used by:** F01, F03, F07

## Summary
A curated library of public-domain anatomical plates, manuscript pages and portraits, each with recorded source, licence, credit and authenticity notes. This is the visual identity and a cheap moat: freely available art is plentiful, but choosing and contextualising it well is the hard part.

## User problem / job
"Show me what they actually saw and drew." Readers love primary sources. Teachers later need images they're allowed to reuse.

## User stories
- As a reader, every story has a striking historical image with a clear credit line.
- As a reader, I can tap the image to view it full screen and zoom in.
- As a reader, I'm told when a portrait is a later imagined likeness.
- As the editor, I can't ship an image without a licence and source.

## Scope
**In**
- `Asset` records: `{ id, title, creator, date, sourceInstitution, sourceUrl, licence, credit, kind: plate|manuscript|portrait|photo, authenticity: contemporary|later-depiction|unknown, altText, focalPoint }`.
- Allowed licences: Public Domain, CC0, CC BY (with attribution). **No** CC BY-NC (blocks paid classroom packs, F12) and **no** CC BY-SA (share-alike complicates the premium edition, F14) unless a decision says otherwise.
- Preferred sources: Wellcome Collection, US National Library of Medicine Digital Collections, Wikimedia Commons (verify the underlying rights, don't trust the tag blindly), Biodiversity Heritage Library, Internet Archive, Europeana, and national libraries.
- Image pipeline: originals stored outside the repo (or Git LFS), responsive derivatives (AVIF/WebP) generated at build time.
- Lightbox with zoom.

**Out**
- Commissioned new art (except the base body, F01 option A).
- IIIF deep-zoom viewer (later, nice for manuscripts).

## Acceptance criteria
- [ ] Build fails if an Asset is missing `licence`, `sourceUrl`, `credit` or `altText`.
- [ ] Build fails on a disallowed licence.
- [ ] Portraits with `authenticity: later-depiction` render a visible "Later depiction, {date}" label.
- [ ] A credits page lists every asset used.
- [ ] Each story image is ≤ 200KB at mobile size.

## Risks & accuracy notes
- "Public domain" scans sometimes carry institutional terms. Check each institution's reuse policy, especially for commercial use (F12/F14).
- Portraits of medieval Islamic and ancient figures are almost always imaginative. Prefer manuscript pages for those stories.
- Some historical plates are graphic or include racist/colonial framing (e.g. 19th-century comparative anatomy). Exclude these or contextualise them, and never use them decoratively.

## Open questions
- Should originals live in Git LFS or a bucket (Cloudflare R2)? R2 is cheaper at scale, while LFS is simpler.
- Should we pin a single "house" palette/treatment (e.g. duotone sepia) for consistency, or show plates as-is?
