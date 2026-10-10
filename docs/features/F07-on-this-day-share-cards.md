# F07 — "This week / on this day in anatomy" share cards & deep links

**Release:** v1 · **Type:** Growth · **Depends on:** F02, F03, F04, F06, F16 · **Used by:** F15

## Summary
Every state of the app is a shareable URL, and every discovery has a beautiful **plate-style share card**: engraved border, plate number, historical image, a one-line hook and a mini fog render of the body at that year. A rotating **"This week in anatomy"** card (with **"On this day"** when a verified date exists) gives a steady stream of posts.

## Decision from the accuracy review
Verified day-month dates are scarce: only **22 May 1954** so far. So **"This week in anatomy" is the lead format**, and "On this day" is a bonus whenever a verified date falls in the week. Births and deaths count only if the date itself is sourced. We don't invent precision to fill the calendar. That rigour is part of what makes the product different.

## User stories
- As a reader, I can share the current view, and the link restores the year, figure, lens, flap and story.
- As a reader, shared links show a rich preview on social media and in messaging apps.
- As a visitor, `/today` always shows a card.
- As Ali, I can download any card (1200×630 and 1080×1350) with a ready-made caption.

## Scope
- URL state: `/?y=&d=&fig=&lens=&layer=` plus canonical `/tab/{plate}-{slug}` pages for SEO and previews.
- Build-time OG images (Satori → PNG) in plate style (F16), including a **mini body render** at the discovery year.
- `ShareDate { discoveryId, month, day, calendar: julian|gregorian, basis: publication|demonstration|letter|birth|death, citation }`.
- `/today`: on-this-day if available, else this week's card. Each ISO week is mapped to a curated discovery: 52 slots, 26 discoveries + misbeliefs + tradition concepts.
- Web Share API on mobile; copy link and download on desktop.
- An unlisted `/editor/cards` page lists the year's schedule with downloadable images and captions.

## Acceptance criteria
- [ ] **F07-AC1** Any shared URL restores the full view state.
- [ ] **F07-AC2** Every tab page passes the Facebook, LinkedIn and X card validators.
- [ ] **F07-AC3** `/today` never shows an empty state.
- [ ] **F07-AC4** Every ShareDate has a calendar and citation (CI).
- [ ] **F07-AC5** `share_click` fires (F08).

## Research backlog
Verify candidate dates: the *Fabrica* colophon (June 1543, month only?); the German *Epitome* (9 Aug 1543?); the Louveau *Nature* online date; Leeuwenhoek's letter (November 1677, the day?); and the birth/death dates of Vesalius, Harvey and Cajal.
