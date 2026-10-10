# F15 — Daily card subscription (email / RSS)

**Priority:** Later · **Depends on:** F07

## Summary
Let readers receive "On this day in anatomy" (or a weekly digest) by email or RSS. It's the retention loop that a free, account-less product otherwise lacks.

## Why not MVP
It only makes sense once share cards show pull (shares per card, `/today` visits). Email adds a list provider, privacy obligations (AU Spam Act, GDPR) and a calendar coverage problem: daily cadence needs ~365 defensible dates, and the MVP will have far fewer. A weekly digest is more realistic.

## Scope (when built)
- RSS feed for `/today` (near-free, ship first).
- Weekly email via Buttondown / Beehiiv, generated from ShareDates + featured story.

## Trigger to build
≥ 15% of `/today` visitors come back within 7 days, *or* unprompted requests for a newsletter.
