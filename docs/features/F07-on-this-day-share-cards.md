# F07 — "On this day in anatomy" share cards & deep links

**Priority:** MVP · **Type:** Growth · **Depends on:** F02, F03, F04, F06 · **Used by:** F15

## Summary
Every discovery and every app state is shareable via a URL that reopens the body at the right year with the right story. A daily "On this day in anatomy" card (an image + caption + link) gives a reason to share and a ready-made social post. This is the main acquisition loop for a free product.

## User problem / job
- Reader: "This is fascinating, I want to show someone *exactly this*."
- Ali (distribution): "I need a steady stream of good-looking, accurate posts without writing each one by hand."

## User stories
- As a reader, I can share the current view (year + story) and the link opens to the same view.
- As a reader, shared links render a rich preview (image, title, description) on social platforms and messaging apps.
- As a visitor, the home page shows today's card when one exists.
- As Ali, I can download or copy the card image and caption for any date to post manually.

## Scope
**In**
- URL state: `/?y={year}&d={discoveryId}` (also `/d/{discoveryId}` canonical pages for SEO and previews).
- Per-discovery pre-rendered page with Open Graph/Twitter meta + build-time OG image (Satori → PNG, 1200×630): historical image, title, year, "On this day" if applicable, brand.
- `ShareDate` records: `{ discoveryId, month, day, basis: publication|demonstration|birth|death|letter, citation }`.
- `/today` page: today's card, or the nearest upcoming one if none falls today ("This week in anatomy").
- Native Web Share API on mobile and copy link on desktop.
- An "Editor" view (unlisted) that lists all share dates and downloads card images, for manual posting.

**Out**
- Automated posting to social platforms (later, maybe).
- Email/RSS subscription (F15).
- User-generated cards.

## Behaviour & UX notes
- **Coverage problem:** many discoveries have no defensible day-month. Rules:
  1. Use only cited dates. A publication year alone ≠ a day.
  2. Allowed bases include a person's birth or death date ("Born on this day: Ibn al-Nafis"), but only when the date itself is sourced. Many medieval dates aren't known to the day.
  3. When the calendar has gaps, fall back to "This week in anatomy".
- Julian vs Gregorian: pre-1582 (and in Britain pre-1752) dates must state which calendar. Harvey-era English dates are Julian. Store `calendar` on the ShareDate.

## Acceptance criteria
- [ ] Opening any shared URL restores the slider year and open story.
- [ ] Every discovery page has a valid OG image and passes the Facebook, LinkedIn and X card validators.
- [ ] `/today` never 404s or shows an empty state. It falls back to the week or the nearest card.
- [ ] Every ShareDate has a citation and a `calendar` field. CI fails if not.
- [ ] A `share_click` analytics event fires (F08).

## Risks & accuracy notes
- "On this day" content online is notoriously sloppy. The cited-date rule *is* the differentiator, so don't relax it to fill the calendar.

## Open questions
- Is the MVP distribution manual posting by Ali, or a scheduled post (Buffer etc.)?
- Should the card show the fog state at that year as a mini visual? It's very on-brand, but adds build complexity.
