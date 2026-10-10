# PRD — Anatomy Discovery (working title)

> An interactive body where every part carries the story of who figured it out, how, and what they got wrong first. A "fog of ignorance" slider dims everything that wasn't yet understood in a given year, so you watch knowledge of the body fill in over the centuries.

Status: Draft v0.1 · Owner: Ali · Last updated: 2026-10-10
Feature briefs: [`docs/features/`](features/README.md)

---

## Problem

The history of how we came to understand the body is popular (Bryson's *The Body*, history-of-medicine podcasts, Wellcome Collection), but it only exists as linear narrative in books, audio and video. Nobody lays that history onto the body itself, so readers can't see *where* knowledge arrived, *when*, or how it built on (or overturned) what came before. Anatomy atlases ignore history entirely. Museum sites and Wikipedia are accurate but scattered and non-spatial. Popular retellings are full of myths and contested "firsts" that are rarely flagged as such.

## Target user (ICP)

**Primary (MVP):** curious, literate adults (roughly 25–65) who already consume history-of-science content for pleasure. They read long-form non-fiction, listen to history podcasts on commutes and click through on interesting links shared on social media or in newsletters. They aren't medical professionals and they'll spot a lazy myth.

Recognisable examples of where they already are:
- Readers of Bill Bryson's *The Body* or Siddhartha Mukherjee's *The Gene*
- Subscribers to *The Public Domain Review* and visitors to the Wellcome Collection's online stories
- r/AskHistorians and r/HistoryofScience readers; history-podcast audiences

**Secondary (post-MVP, paying):** high-school biology and history teachers (e.g. NSW Stage 5–6 Science and Modern History, IB History of Science/TOK). After them, museums (Wellcome Collection, Powerhouse, Science Museum) and education publishers as sponsors or licensees.

The MVP is designed for the primary user only. Teacher needs are recorded so early decisions don't block them later.

## Core value proposition

See, on one body, who figured out each part, how they did it and what they got wrong first, with sources you can check.

## MVP scope: must have

1. **Interactive 2D body map** ([F01](features/F01-interactive-body-map.md)): an illustrated body with ~25 clickable structures across key systems.
2. **"Fog of ignorance" timeline slider** ([F02](features/F02-fog-of-ignorance-slider.md)): dims or reveals structures by year of understanding, snapping to anchor eras (c. 200, 1242, 1543, 1628, 1950, today).
3. **Discovery story panel** ([F03](features/F03-discovery-story-panel.md)): person, method, error corrected, a portrait or primary-source image, and citations.
4. **25 landmark discoveries, sourced and contest-aware** ([F04](features/F04-landmark-discovery-content-set.md) + [F05](features/F05-citations-and-contested-claims.md)): includes non-European contributors where the record supports it. Every claim is cited, contested claims are labelled, and there's a "suggest a correction" route.
5. **Public-domain image library with provenance** ([F06](features/F06-historical-image-library.md)): historical plates and portraits with source, licence and credit recorded.
6. **Shareable "on this day in anatomy" cards + deep links** ([F07](features/F07-on-this-day-share-cards.md)): a daily card with a social preview image that links into the body at the right year and structure.
7. **Minimal privacy-friendly analytics** ([F08](features/F08-analytics-and-success-measurement.md)): just enough to measure the success metric. It's plumbing, not a feature users see.

## Explicit non-goals

| Not building (yet) | Why |
|---|---|
| 3D body ([F13](features/F13-3d-body.md)) | Expensive and asset-led. 2D is enough to test whether the idea is compelling, and historical plates are 2D anyway. |
| User accounts, saved progress, comments | No evidence yet that people come back for state. Accounts add auth, privacy and moderation costs. |
| Classroom packs / payments ([F12](features/F12-classroom-packs.md)) | The secondary ICP. Validate the free audience first. |
| Full "what they got wrong" visual overlay ([F09](features/F09-misconception-overlay.md)) | Strongest later differentiator, but the MVP covers the error in text within the story panel. |
| Parallel "traditions" lens ([F10](features/F10-traditions-lens.md)) | Mapping TCM channels or Ayurvedic *marma* onto a modern body is historiographically fraught. Non-European contributors appear in the MVP as discoveries. A dedicated lens needs scholarly input. |
| Comprehensive anatomy (hundreds of structures) | It's content-led. 25 excellent, sourced stories beat 300 thin ones. |
| Clinical, medical or educational-accuracy claims about modern anatomy | This is a history product. Modern anatomy is shown schematically and isn't a reference atlas. |
| CMS / admin UI | Content lives in the repo as structured files. PR review is the editorial workflow. |
| Newsletter / email capture ([F15](features/F15-daily-card-subscription.md)) | Only after share cards show pull. |
| Native apps | The web covers both share-link traffic and classrooms. |

## Success metric

**Share of sessions that open 3 or more discovery stories.** Target: **≥ 25%** across the first 1,000 sessions after launch.

Why this metric: it measures the core bet, that spatial plus temporal plus story is compelling enough to make people explore beyond the first click. Shares and traffic are lagging and depend on distribution luck. Time-on-site rewards confusion. If people don't open a third story, the wedge isn't working, however many people arrive.

(Leading diagnostic, not the success metric: slider interaction rate. If people don't touch the slider, the "fog" concept isn't landing.)

## Key user flows

### 1. Curious reader explores from cold (happy path)
1. The reader lands on the home page. The body is shown at **"Today"**, fully lit.
2. A one-line prompt invites them to drag the slider back in time. They drag to **c. 200 AD**.
3. Most of the body dims into fog. A few structures stay lit (e.g. the brain's ventricles and the distinction between arteries and veins), plus Galen's beliefs, which are marked as beliefs.
4. They step forward through the anchors (1242 → 1543 → 1628). Structures light up as each era arrives, with a short caption per era.
5. They tap the newly lit **lungs/pulmonary circulation** at 1242.
6. The story panel opens: **Ibn al-Nafis**, the method (textual and reasoned critique of Galen and Ibn Sina; whether he dissected is contested), the error corrected (Galen's invisible pores in the heart's septum), a primary-source image and citations. A "Contested" badge explains the debate over transmission to Europe.
7. They follow "Next in this story" to Servetus/Colombo, then Harvey at 1628. That's 3+ stories opened.

### 2. Social visitor arrives from a share card
1. The visitor sees a card on social media: "On this day in 1628, William Harvey's *De motu cordis* ..." with a Vesalius-style plate.
2. They tap through to a deep link. The body opens with the slider at **1628** and Harvey's story already open.
3. They close the panel, see the fog state for 1628 and start exploring (flow 1, from step 4).

### 3. Sceptical reader checks a claim
1. In a story, the reader taps a footnote marker beside a claim.
2. The citation expands to show the primary/secondary source, the page or folio locator and a link where one exists.
3. They think the claim is wrong and tap **"Suggest a correction"**.
4. A prefilled form or issue captures the story ID, the claim and their source. Ali reviews it.

### 4. Editor (Ali) adds a discovery
1. Create a discovery file from the template: structures, year, people, method, error corrected, claims with citations, image refs.
2. Add or reuse a Person and an Asset (with licence and provenance).
3. Open a PR. CI validates the schema: no uncited claim, every asset licensed, every structure ID exists in the SVG.
4. Merge, and the site rebuilds.

## Data model (rough sketch)

```
Structure ──< DiscoveryStructure >── Discovery ──< DiscoveryPerson >── Person
   │                                    │  │                             │
   │ svgRegionId, system, parent         │  └──< Claim ──< Citation >── Source
   │                                    │                               (primary|secondary)
   └── (fog state is DERIVED,           ├── kind: morphology | function | microscopic | molecular
        not stored)                     ├── yearStart, yearEnd, yearPrecision, displayDate
                                         ├── tradition / region
                                         ├── status: established | contested | revised
                                         ├── priorBelief (the "error corrected", itself a Claim)
                                         ├── assets[] ── Asset (licence, source, credit, url)
                                         └── shareDates[] ── ShareDate (month, day, basis, Citation)

Era (anchor): year, label, caption        Person: name, dates, place, tradition, portraitAsset
```

Key relationships and rules:
- **Discovery ↔ Structure is many-to-many.** Harvey touches heart, arteries, veins and venous valves. The heart has many discoveries.
- **"Understood" is not one thing.** A structure can be *seen* (morphology) centuries before its *function* is understood. Fog state for a structure in year Y is **derived** from the discoveries with `yearStart ≤ Y`, which gives graded states: `unknown → described → function understood`, plus an orthogonal `misbelief` flag where a then-dominant wrong model applies (e.g. septal pores before 1242/1628).
- **Claims are first-class.** Each factual sentence that matters is a Claim with ≥ 1 Citation and its own status, so a story can be "established" overall while one sub-claim is contested.
- **Dates are fuzzy.** `yearStart/yearEnd/precision` handles "c. 1600 BCE", "fl. 3rd c. BCE" and "1242?". The slider uses `yearStart`. The UI shows `displayDate`.
- **"On this day" needs a real day-month.** Many discoveries have none, so `ShareDate` is optional and can be based on a publication date, a birth or death, or a documented demonstration, and it's cited.
- **Assets carry rights.** No asset ships without licence, source institution and credit.

## Tech constraints

- **Solo, bootstrapped, near-zero running cost.** Static site with no backend for the MVP.
- **Stack (proposed):** Astro (or Next.js static export) + TypeScript; body as a hand-authored **inline SVG** with stable structure IDs; slider and panel as small islands of interactivity.
- **Content as code:** discoveries, people, sources and assets as Markdown/MDX + YAML/JSON in the repo, validated at build time with a schema (e.g. Zod). **The build fails on an uncited claim, an unlicensed asset or an unknown structure ID.** This turns the main risk (accuracy) into a CI gate.
- **Hosting:** Netlify or Cloudflare Pages, with deploy previews per PR for editorial review.
- **Share images:** generated at build time (e.g. Satori → PNG), one per discovery and share date. No runtime image service.
- **Analytics:** cookieless and privacy-friendly (Plausible / Umami / Cloudflare Web Analytics), with custom events for story opens and slider use.
- **Mobile-first:** most share traffic lands on phones. The body plus slider must work one-handed on a 375px screen.
- **Accessibility:** the slider works by keyboard and screen reader, `prefers-reduced-motion` is respected, and every structure is reachable from a non-visual list. Teachers and schools will need this later, so it can't be retrofitted.
- **Images:** public domain or CC0/CC BY only (Wellcome Collection, NLM Digital Collections, Wikimedia Commons, BHL). Provenance is recorded per asset.
- **Future-proofing (not MVP):** keep IDs stable and content portable (plain files), so printable classroom packs, a 3D view or a licensing feed can be generated from the same data later.

## Open questions

1. **Historiography and framing.** The "fog" metaphor measures the past against modern anatomy (a Whiggish frame). Is that acceptable if we say so openly, or should the fog represent "what *this tradition* understood" instead? This affects F02 and F10.
2. **How is the fog keyed?** Is one global fog per year enough, or should users pick a lens (morphology vs function)? MVP proposal: one fog, graded states.
3. **Which non-European claims meet the bar?** The *Huangdi Neijing* "circulation" passages and Sushruta's anatomy are often overclaimed in popular sources. Do we include them as contested stories, or leave them out until a specialist reviews them?
4. **Who reviews accuracy?** Is self-review against cited sources enough for launch, or should we recruit one historian of medicine as a paid or credited reviewer before going public?
5. **Body illustration style.** Commission a new neutral 2D body, or compose from public-domain plates (Vesalius/Gray's)? Plates give identity but make clean clickable regions harder.
6. **Is 25 the right number, and which 25?** The candidate list in F04 is longer than 25 and needs cutting.
7. **"On this day" coverage.** How many of the 25 have a defensible day-month date? If it's fewer than ~12, the daily-card mechanic needs supplementing (birth/death dates, "this week" cards).
8. **Domain/brand name.**
9. **Is the success metric target right?** 25% opening 3+ stories is a guess. It needs recalibrating after the first 200 sessions.
10. **Distribution.** Which channel seeds the first 1,000 sessions: Reddit, Hacker News, history-podcast hosts or *Public Domain Review*-adjacent newsletters?
