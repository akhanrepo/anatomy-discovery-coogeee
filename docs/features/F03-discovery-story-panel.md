# F03 — Discovery story panel

**Release:** v1 · **Depends on:** F04, F05, F06, F16 · **Used by:** F07, F08, F11

## Summary
Selecting a structure opens its story, styled as a **plate with commentary**. It covers who, when, how (method), what they overturned, a primary-source image and checkable citations. It reads in about 60 seconds and links onward through a thread.

## User stories
- As a reader, I see the person (name in the original script + transliteration), date, place and tradition at a glance.
- As a reader, I learn the **method**: dissection, vivisection, textual critique, microscopy, staining, quantitative argument.
- As a reader, I learn **what it overturned**, and the misbelief is highlighted in red on the body (F09).
- As a reader, I see a primary-source image with a credit and an authenticity label.
- As a reader, I can open footnotes and see a status badge (Established / Contested / Revised) and the verification date.
- As a reader, I can step through a structure's discoveries in order and follow "next in this thread".
- As a reader, I can share the story (F07).

## Scope
**In**
- Bottom sheet on mobile; right-hand "facing page" on desktop.
- Sections:
  1. **Header**: plate number (Tab. XII) · title · display date · person (original script) · place · tradition
  2. **Image**: primary-source plate/page + credit + "Later depiction" label where relevant
  3. **The story**: 150–300 words
  4. **How they knew**: method
  5. **What it overturned**: the misbelief + who held it (links to F09)
  6. **Status badge** + contest note
  7. **Sources**: footnotes with locators · "Verified by Claude on {date}" · "Suggest a correction"
  8. **Navigation**: earlier/later on this structure; next in thread; "Read the long version" (premium chapter, F14)
- Opening a story moves the slider to its year (with an option to stay).
- If the current year is before the discovery: "Not yet discovered in {year}: jump to {displayDate}?"

**Out**
- Comments, audio narration.

## Acceptance criteria
- [ ] **F03-AC1** Every discovery renders all 8 sections. A missing image fails CI (no placeholders at launch).
- [ ] **F03-AC2** Every footnote resolves. A dangling reference fails the build.
- [ ] **F03-AC3** The Contested/Revised badge is above the fold on mobile.
- [ ] **F03-AC4** The panel is focus-trapped on mobile, closes with Esc or the back gesture, and focus returns to the structure.
- [ ] **F03-AC5** URL `?y=&d=` is deep-linkable. `story_open` fires once per open.

## Copy rules
Concrete, no "genius" clichés, active voice about methods, and credit shared where credit was shared (e.g. Johan Ham, Valverde). Each story names at least one thing the protagonist got *wrong* where the record supports it.

## Risks
- Portrait authenticity: portraits of Galen, Ibn Sina, Ibn al-Nafis and others are later imaginings. Prefer manuscript pages, and label portraits honestly.
