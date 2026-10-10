# F03 — Discovery story panel

**Priority:** MVP · **Depends on:** F04, F05, F06 · **Used by:** F07, F08

## Summary
When a structure is selected, a panel tells the story of how it came to be understood. It covers who, when, how (method), what they got wrong or corrected, an image and citations. It's short enough to read in about 60 seconds and linked to the next chapter of the story.

## User problem / job
"Tell me the human story behind this part, briefly, and let me trust it."

## User stories
- As a reader, I see the person, date, place and tradition at a glance.
- As a reader, I learn the **method** (dissection, vivisection, textual critique, microscopy, quantitative argument...).
- As a reader, I learn the **error corrected**: what people believed before and who believed it.
- As a reader, I see a portrait or primary-source image with a credit.
- As a reader, I can open footnotes to see sources, and I see a clear badge if a claim is contested.
- As a reader, if a structure has several discoveries, I can step through them in chronological order ("Earlier / Later").
- As a reader, I can share this story (F07).

## Scope
**In**
- Panel layout: bottom sheet on mobile, side panel on desktop.
- Sections, in order:
  1. **Header**: structure name · discovery title · display date · person(s) · tradition/region
  2. **Image**: primary-source plate or portrait + credit line (F06)
  3. **The story**: 120–250 words
  4. **How they knew**: method, 1–2 sentences
  5. **What it overturned**: the prior belief + who held it
  6. **Status badge**: Established / Contested / Revised (F05)
  7. **Sources**: numbered footnotes
  8. **Navigation**: earlier/later discoveries for this structure; "next in this thread" (e.g. pulmonary → systemic circulation)
- Selecting a story moves the slider to that discovery's year (with an option to stay put).

**Out**
- Long-form essays (premium edition, F14).
- Audio narration, video.
- Comments.

## Behaviour & UX notes
- If the slider year is before the discovery's year, the panel still opens but shows "Not yet discovered in {year}, jump to {displayDate}?". This rewards curiosity rather than blocking it.
- Story copy style: concrete, no hagiography, no "genius" clichés, and active voice about methods.
- Story text is authored in Markdown with inline claim references (e.g. `[^c3]`) that resolve to Claims/Citations (F05).

## Acceptance criteria
- [ ] Every one of the 25 discoveries renders all 8 sections. Missing image → tasteful placeholder plus a CI warning.
- [ ] Every footnote resolves to a Citation. A dangling reference fails the build.
- [ ] The status badge is visible above the fold on mobile when the status is Contested.
- [ ] The panel is focus-trapped when modal on mobile, closes with Esc/back gesture and returns focus to the structure.
- [ ] The URL updates to `?y={year}&d={discoveryId}`, so it's deep-linkable.
- [ ] A `story_open` analytics event fires once per open (F08).

## Data & dependencies
- `Discovery`, `Person`, `Claim`, `Citation`, `Asset`.
- "Thread" links: `Discovery.next[]` (manual curation).

## Risks & accuracy notes
- The 120–250 word limit forces simplification, so contested nuance must still survive via the badge and footnotes.
- Portrait authenticity: many "portraits" (e.g. of Ibn Sina, Ibn al-Nafis, Galen) are later imaginative depictions. Label them ("Imagined portrait, 19th c.") or prefer a primary-source manuscript page instead.

## Open questions
- Should a story be anchored to one structure or to a "thread" (e.g. circulation)? The MVP proposes structure-anchored with thread links.
- Is a "Did you know this is a myth?" sub-section worth it, or does that belong in F05 badges?
