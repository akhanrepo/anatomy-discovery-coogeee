# F11 — Timeline & people browse views

**Priority:** Later (a minimal accessible list ships in F01) · **Depends on:** F04

## Summary
Non-spatial ways in: a horizontal timeline of all discoveries, a "People" index (with tradition, era and what they got right or wrong), and "threads" (e.g. *The circulation of the blood: Galen → Ibn al-Nafis → Colombo → Fabricius → Harvey → Malpighi*).

## Why it matters
- Some readers think in people and narratives, not anatomy.
- Threads are the natural unit for teachers (F12) and for long-form premium content (F14).
- They're good for SEO: people pages rank for names.

## Why not MVP
The body plus slider must prove the spatial concept first. A basic list (F01) covers accessibility.

## Scope (when built)
- `/timeline`, `/people`, `/people/{id}`, `/threads/{id}` as static pages generated from existing data. No new content is needed except thread intros.
- `Thread { id, title, intro, discoveries[] (ordered) }`.

## Open questions
- Should threads be the default *onboarding* (a guided tour) instead of free exploration? This could be tested in v1.1 against the success metric.
