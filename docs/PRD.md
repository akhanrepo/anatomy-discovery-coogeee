# PRD — Anatomy Discovery (working title)

> An interactive body where every part carries the story of who figured it out, how, and what they got wrong first. A slider sets the year, and the body is drawn only as far as knowledge had reached. You watch it being *written in* over the centuries.

Status: **v0.2: single-release scope** · Owner: Ali · Last updated: 2026-11-03

> **Status note (2026-11-03): open source.** Tabula is now an open-source project ([F18](features/F18-open-source-release.md)). Code is MIT and written content is CC BY-SA 4.0. The classroom packs and the edition are **free downloads**, and the Lemon Squeezy commerce described in earlier versions of this PRD was removed (it remains in git history). Funding comes from sponsorship (F14) and donations. Where this document still mentions prices or purchases, F18 supersedes it.
Feature briefs: [`docs/features/`](features/README.md) · Accuracy review: [`docs/research/accuracy-review-2026-10.md`](research/accuracy-review-2026-10.md)

### Decisions locked in v0.2
| Decision | Outcome |
|---|---|
| Framing | **The fog measures past knowledge against modern anatomy**, and we say so openly ("About the fog"). Past models appear as red-ink beliefs in their own right, not as blanks (F09, F16). |
| Accuracy | **Claude verifies every claim** using the documented method in F05: two-source rule, adversarial myth check, verification log. A first-pass review of the candidate list is done ([review](research/accuracy-review-2026-10.md)). |
| Art | **"The Unwritten Body"** (F16): one commissioned engraving-style master figure (male and female, after Vesalius's *Epitome*). Knowledge is shown as ink states (outline → hatching → hand-colour), and misbeliefs are written in vermilion and scraped away. Beauty is the main selling point, so art is the critical path. |
| Release | **Everything ships in v1.** There's no MVP/later split. The order of work is set by dependencies, not by staged releases. |

---

## Problem

The history of how we came to understand the body is popular (Bryson's *The Body*, history-of-medicine podcasts, Wellcome Collection), but it only exists as linear narrative in books, audio and video. Nobody lays that history onto the body itself, so readers can't see *where* knowledge arrived, *when*, or what it overturned. Anatomy atlases ignore history entirely. Museum sites and Wikipedia are accurate but scattered and non-spatial. Popular retellings repeat myths and contested "firsts" without flagging them.

## Target user (ICP)

**Primary: curious, literate adults** (roughly 25–65) who consume history-of-science content for pleasure. They read long-form non-fiction, listen to history podcasts and click well-made links in newsletters and social feeds. They aren't medical professionals, and they *will* notice a lazy myth. You find them among readers of Bryson's *The Body* and Mukherjee, subscribers to *The Public Domain Review*, Wellcome Collection's online audience, and r/AskHistorians.

**Secondary:**
- **High-school teachers.** UK GCSE History "Medicine in Britain / through time" (the closest syllabus fit), NSW Stage 5–6 Science and Modern History, IB TOK/History. They download the free classroom packs (F12).
- **Readers wanting more depth.** They download the free edition (F14).
- **Museums, libraries and education publishers** as sponsors (F14).

## Core value proposition

See, on one beautiful body, who figured out each part, how they did it and what they got wrong first, with sources you can check.

## v1 scope

Ordered by dependency (see **Build sequence** below). All ship together.

| # | Feature | Brief |
|---|---|---|
| 1 | **Art direction & visual system**: "The Unwritten Body" | [F16](features/F16-art-direction-and-visual-system.md) |
| 2 | **Interactive body**: male and female figures, ~40 structures | [F01](features/F01-interactive-body-map.md) |
| 3 | **Layered dissection**: fugitive-sheet flaps (skin → muscle → organs → skeleton) | [F13](features/F13-layered-dissection.md) |
| 4 | **Timeline slider** (the "fog"): ink states by year, engraved-panorama track | [F02](features/F02-fog-of-ignorance-slider.md) |
| 5 | **Discovery story panel** | [F03](features/F03-discovery-story-panel.md) |
| 6 | **Content: ~25 landmark discoveries**, balanced across eras and traditions | [F04](features/F04-landmark-discovery-content-set.md) |
| 7 | **Citations, contested claims, Claude verification & corrections** | [F05](features/F05-citations-and-contested-claims.md) |
| 8 | **Historical image library & rights provenance** | [F06](features/F06-historical-image-library.md) |
| 9 | **Misbelief overlay**: "what they got wrong", in red ink | [F09](features/F09-misconception-overlay.md) |
| 10 | **Traditions lens**: Islamic-world, Chinese and Ayurvedic bodies, each on its own historical plate | [F10](features/F10-traditions-lens.md) |
| 11 | **Browse**: timeline, people, threads (guided tours) | [F11](features/F11-timeline-and-people-browse.md) |
| 12 | **"On this day / this week in anatomy" share cards & deep links** | [F07](features/F07-on-this-day-share-cards.md) |
| 13 | **Subscription**: RSS (weekly email removed 2026-11-03) | [F15](features/F15-daily-card-subscription.md) |
| 14 | **Classroom packs** (free), 3 at launch plus a sample | [F12](features/F12-classroom-packs.md) |
| 15 | **Edition (free) + sponsorship** | [F14](features/F14-sponsorship-and-premium-edition.md) |
| 16 | **Analytics** | [F08](features/F08-analytics-and-success-measurement.md) |
| 17 | **Open-source release**: licences, free downloads, contributor docs, CI | [F18](features/F18-open-source-release.md) |

**One honest warning about shipping everything at once:** it delays the first real signal until everything's done. Mitigation: a **closed preview** to about 50 readers once F16 art + F01–F05 are complete (content can still be landing). This isn't a staged release, just a feedback checkpoint before the public launch.

## Explicit non-goals

| Not building | Why |
|---|---|
| **True 3D body** | Replaced by layered dissection (F13). A 3D mesh would abandon the engraved art, which is the main selling point, and it's heavy on mobile and hard to make accessible. Fugitive sheets give depth *in period style*. |
| User accounts, saved progress, comments, UGC | No evidence they're needed. They bring auth, privacy and moderation cost. Downloads need no account. |
| Comprehensive anatomy (hundreds of structures) | It's content-led: 25 excellent stories beat 300 thin ones. |
| Clinical or reference-atlas accuracy for modern anatomy | This is a history product. The modern body is a schematic, artful backdrop. |
| CMS / admin UI | Content is files in the repo, and PR review is the editorial workflow. |
| Native apps | The web covers share traffic and classrooms. |
| AI-generated artwork | Licensing uncertainty blocks open licensing and reuse, it's hard to keep consistent across layers, and it undercuts an authenticity-led brand (F16). |
| Automated social posting | Manual or scheduled via a third-party tool is enough. |

## Success metric

**Share of sessions that open 3 or more discovery stories.** Target: **≥ 25%** across the first 1,000 public sessions.

This measures the core bet: that the spatial, temporal and story combination makes people explore. Revenue (packs, edition) and shares are tracked but are downstream. If people don't open a third story, nothing else will work.
*Leading diagnostic:* slider interaction rate.

## Key user flows

### 1. Curious reader explores from cold
1. The reader lands on the home page. The body is shown at **Today**: fully inked and hand-coloured, on ivory paper.
2. A manicule (☞) beside the slider says *"Drag back in time."* They drag to **c. 200**.
3. The colour drains and the hatching lifts. Most structures fade back to blank paper. Galen's knowledge stays inked (arteries carry blood, the recurrent laryngeal nerve), and **vermilion** lines appear: veins rising from the liver, pores in the heart's septum. The paper becomes papyrus-toned and a Greek-styled caption appears in the margin.
4. They step forward: **c. 1242**. The paper turns to vellum, the lungs ink in as an outline and the red septal pores are **scraped away** with an erasure, leaving a ghost.
5. They tap the lungs. The story panel opens: **Ibn al-Nafis** (ابن النفيس), the method, the belief he overturned, a manuscript page, citations, and a *Contested* badge on transmission to Europe.
6. They follow the thread to Colombo, then Harvey (1628). That's 3+ stories.

### 2. Social visitor arrives from a share card
1. They see a card styled as an engraved plate: *"Tab. XXI · 22 May 1954: two unrelated Huxleys explain how muscle contracts"*.
2. Tapping it opens the body at **1954** with the story open.
3. They close the panel and explore (flow 1, step 4).

### 3. Reader explores another tradition
1. They switch the **lens** to *Ayurveda*. The figure is replaced by the 18th-century Nepalese "Ayurvedic Man" painting, with hotspots.
2. They tap a vessel. The panel explains the concept *in its own terms* and how it relates (or doesn't) to modern structures.
3. They switch back to the modern body.

### 4. Sceptical reader checks a claim
1. They tap a footnote, which shows the source with a page or folio locator, a link and the verification date.
2. They tap **Suggest a correction**. The form is prefilled with the story and claim IDs.
3. The correction is triaged. If it's accepted, it's published in the public corrections log.

### 5. Teacher downloads a pack
1. A teacher arrives via the "For teachers" page.
2. They pick *"The circulation of the blood: Galen to Malpighi"* and download it free, in A4 or US Letter, with no account.
3. They get a PDF (CC BY-SA, so they can copy and adapt it): printable plates (fog at 4 years), story cards, primary-source extracts, a "spot the myth" activity and an answer key with sources.

### 6. Editor (Ali + Claude) adds a discovery
1. Claude drafts the discovery file from the template and runs the F05 verification workflow, attaching a verification log.
2. Claude adds or reuses Person and Asset records (licence checked per record).
3. A PR is opened. CI validates the schema, citations, licences, structure IDs and balance targets. A deploy preview is generated.
4. Ali reviews the preview and merges.

## Data model (rough sketch)

```
Structure ──< DiscoveryStructure >── Discovery ──< DiscoveryPerson >── Person
  id, name, system, layer(F13),        │                                 name, nameOriginal, script,
  sex: both|male|female, svgRegionId   │                                 dates, place, tradition,
                                        │                                 portraitAssetId?
                                        ├── kind: morphology|function|microscopic|molecular
                                        ├── yearStart, yearEnd, yearPrecision, displayDate
                                        ├── tradition, status: established|contested|revised
                                        ├── claims[] ── Claim ──< Citation >── Source
                                        ├── corrects[] ── Misbelief
                                        ├── assets[] ── Asset (licence, source, credit, authenticity)
                                        ├── shareDates[] ── ShareDate (month, day, calendar, basis, citation)
                                        └── verification ── VerificationLog

Misbelief   { id, title, heldBy[] (Person), yearStart, correctedBy (Discovery), structures[], svgOverlayId, claims[] }
Era         { id, yearStart, label, caption, paperTexture, inkTone, marginScript }
Tradition   { id, name, plateAssetId, hotspots[] ── TraditionConcept { id, name, nameOriginal, story, claims[], relatesTo[] (Structure, typed: "corresponds"|"partially"|"no modern equivalent") } }
Thread      { id, title, intro, discoveries[] (ordered) }      // tours, packs, edition chapters
Pack        { id, threadId, generatedPdf }
Edition     { chapters[] ── Thread + essay }
VerificationLog { discoveryId, date, reviewer: "claude"|human, sourcesConsulted[], mythChecks[], verdict, notes }
```

Key rules:
- **Discovery ↔ Structure is many-to-many.** Fog state is **derived**, never stored: `stateAt(structure, year)` → `UNKNOWN | DESCRIBED | UNDERSTOOD`, plus active `Misbelief`s.
- **Claims are first-class.** Each has ≥ 1 citation and its own status.
- **Dates are fuzzy** (`yearPrecision`: exact | circa | range | century) and **calendar-aware** for day-month dates (Julian/Gregorian).
- **Traditions don't map 1:1.** A `TraditionConcept` links to modern structures only with a typed relation, including "no modern equivalent".
- **Assets carry rights.** PD / CC0 / CC BY only, checked per record.

## Tech constraints

- **Solo, bootstrapped, near-zero running cost.** Static site, no custom backend, no mailing list. Downloads are GitHub Release assets.
- **Stack:** Astro + TypeScript, with small interactive islands (Preact or Solid) for the body, slider and panel. SVG for line art and hit regions, aligned AVIF/WebP rasters for hatching and washes (F16).
- **Content as code:** Markdown/MDX + YAML in the repo, with Zod schemas. **CI fails** on an uncited claim, a missing verification log, an unlicensed asset, an unknown structure ID, a ShareDate without calendar and citation, or missed balance targets.
- **Hosting:** Netlify or Cloudflare Pages, with deploy previews per PR.
- **Build-time generation:** OG/share images (Satori), RSS, classroom-pack PDFs and edition EPUB/PDF (Paged.js via headless Chromium; pandoc for EPUB).
- **Downloads:** packs and the edition are built by the release workflow and published as GitHub Release assets (F18). No accounts, no commerce.
- **Licences:** code MIT; written content CC BY-SA 4.0; plates CC BY 4.0 (F18).
- **Analytics:** cookieless (Plausible / Umami).
- **Performance:** first meaningful paint < 2.5s on 4G mid-range phone; initial art payload ≤ 1.5MB; flap layers lazy-load.
- **Accessibility:** WCAG 2.2 AA. The slider and flaps are keyboard and screen-reader operable, with a full non-visual structure list and `prefers-reduced-motion` support. Schools require this.
- **i18n-ready:** English only at launch, but strings are externalised and original-script names are supported (Arabic RTL, CJK, Devanagari).

## Build sequence (one release, ordered by dependency)

| Step | Work | Notes |
|---|---|---|
| 0 | **Art spec → illustrator commission** (F16) | Longest lead time, so it starts on day 1 |
| 0 | **Content verification and writing** (F04/F05), in parallel | Second-longest. Claude drafts and verifies, Ali reviews |
| 1 | Data schemas + CI validation (F05, F06) | Everything else builds on these |
| 2 | Body + flaps + slider + state engine on **placeholder art** (F01, F13, F02) | The art drops in by structure ID later |
| 3 | Story panel, misbeliefs, browse (F03, F09, F11) | |
| 4 | Traditions lens (F10) | Needs its own plates and verification |
| 5 | Share cards, RSS, analytics (F07, F15, F08) | |
| 6 | Packs, edition, sponsor page (F12, F14) | Generated from the same content |
| 7 | Final art integration → **closed preview (~50 readers)** → fixes → public launch | |

## Open questions

1. **Illustrator budget ceiling.** It sets the structure count drawn in full and the number of misbelief drawings (F16).
2. **Domain and brand name.** The "Unwritten Body" concept suggests names like *The Unwritten Body*, *Palimpsest*, *Fabrica Nova*. Check domains.
3. **"On this day" coverage.** Only 22 May 1954 is verified so far. If fewer than about 15 defensible dates exist, lead with **"This week in anatomy"** and use dates as a bonus (F07).
4. **Traditions lens licensing.** The licence for the Ayurvedic Man and Bronze Man plates must be confirmed on each Wellcome record (PD or CC BY is OK; NC is not).
5. **First teacher market.** UK GCSE (best syllabus fit) or Australia (home)? This affects pack themes and currency.
6. **Premium edition format:** web-only (cheapest), EPUB/PDF, or print-on-demand too?
7. **Sponsor policy.** Are pharma or medical-device sponsors excluded? (Recommendation: yes.)
8. **Is the success-metric target right?** 25% is a guess, so recalibrate after the closed preview.
9. **Distribution** for the first 1,000 sessions: Reddit, Hacker News, *Public Domain Review*-adjacent newsletters, history podcasters.
