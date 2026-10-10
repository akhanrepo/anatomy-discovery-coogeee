# F05 — Citations, contested claims & corrections

**Priority:** MVP · **Type:** Content system / trust · **Depends on:** — · **Used by:** F03, F04, F07

## Summary
The product's main risk is historical accuracy. This feature makes accuracy structural rather than aspirational. Every claim is linked to a citation, contested claims are labelled with an explanation, the build refuses to ship uncited content and readers have a one-tap route to suggest a correction.

## User problem / job
"Popular history of medicine is full of myths. Why should I trust *this*?" For the later teacher ICP, citations are what make the product usable in class.

## User stories
- As a reader, I can tap any footnote marker and see the source, with a page/folio locator and a link where available.
- As a reader, I see a **Contested** badge with a one-line explanation of *what* is contested and *by whom*.
- As a reader, I can see when a story was last reviewed.
- As a reader, I can suggest a correction with my own source.
- As the editor, I can't accidentally publish an uncited claim.

## Scope
**In**
- `Claim`, `Citation` and `Source` entities (see PRD data model).
- Source types: `primary` (e.g. *De motu cordis*, 1628) and `secondary` (scholarly history). Tertiary (encyclopaedias, popular books) is allowed only as "further reading", never as sole support.
- Status vocabulary, shown publicly with definitions:
  - **Established**: scholarly consensus; no significant dispute.
  - **Contested**: credible scholars disagree (date, priority, attribution, interpretation).
  - **Revised**: once widely repeated, now considered wrong or a myth. Shown so the myth gets corrected, not spread.
- Build-time validation (CI):
  - every Claim has ≥ 1 Citation;
  - every Discovery has ≥ 1 secondary source, plus a primary if one exists;
  - every contested Claim has a `contestNote`;
  - every Citation resolves to a Source with a full reference.
- `lastReviewed` date per discovery.
- "Suggest a correction" → prefilled GitHub issue form *or* a simple form (Tally/Formspree) → triage label. Readers aren't required to have a GitHub account.
- Public "How we source" page: the method, status definitions and the Whig-history caveat (F02).

**Out**
- Reader-editable content, voting, comments.
- Automated fact-checking.

## Behaviour & UX notes
- Footnotes are inline numbered markers that expand in place (no page jump) on mobile.
- Citation format: Chicago author-date, short in-panel and full on the "Sources" page.
- The Contested badge expands to: "Contested: {what}. {Position A} ({who}); {Position B} ({who}). [Sources]".

## Acceptance criteria
- [ ] The build fails on: an uncited claim; a contested claim with no note; a dangling citation; a discovery with no secondary source.
- [ ] Every story shows `lastReviewed`.
- [ ] A correction submitted from a story arrives with `discoveryId` and claim ID prefilled.
- [ ] The "How we source" page is linked from every story footer.
- [ ] At launch, 100% of discoveries pass validation (no waivers).

## Data & dependencies
```
Claim     { id, discoveryId, text, status, contestNote?, citations[] }
Citation  { sourceId, locator (page/folio/figure), quote?, note? }
Source    { id, type: primary|secondary|tertiary, author, title, year, publisher/journal, url?, doi?, archiveUrl? }
```

## Risks & accuracy notes
- Citation theatre: a citation to a weak popular source looks rigorous but isn't. Mitigate with the secondary-source rule and a short reviewed list of preferred secondary sources (e.g. scholarly histories of medicine, *Medical History*, *Journal of the History of Medicine and Allied Sciences*, Wellcome/NLM essays). Pin the actual list when authoring starts.
- Link rot: store an archive.org URL alongside every web source.
- Self-review blind spots, especially for non-European traditions. See PRD OQ4.

## Open questions
- Should we use GitHub issues (transparent, free) or a form (no account needed) for corrections? Option: a form that creates an issue via a webhook.
- Should we publish a changelog of corrections ("we got this wrong")? That's on-brand: the product is about people correcting errors.
