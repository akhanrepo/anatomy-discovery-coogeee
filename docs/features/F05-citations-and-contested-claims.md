# F05 — Citations, contested claims, verification & corrections

**Release:** v1 · **Type:** Content system / trust · **Used by:** F03, F04, F07, F09, F10, F12, F14

## Summary
Historical accuracy is the main risk. Accuracy is made **structural**:
- every claim is cited;
- every discovery carries a **verification log produced by Claude** against a documented method;
- contested claims are labelled and explained;
- the build refuses to ship anything that fails;
- readers can suggest corrections, which go into a public log.

## Verification method (Claude)
Every discovery, misbelief, tradition concept and share date goes through these steps before merge:

1. **Claim extraction.** Split the draft into atomic claims (who, what, when, where, method, prior belief, "first").
2. **Two-source rule.** Each claim needs ≥ 2 independent sources, at least one scholarly (peer-reviewed history of medicine, university press, or a major institution: NLM, Wellcome, Royal Collection, a national library). A primary source is cited where one exists. Encyclopaedias and popular books only *lead to* sources, never count as one.
3. **Adversarial myth check.** For every "first", every date and every attribution, search specifically for debunkings, priority disputes and alternative dates ("X myth", "X priority dispute", "earlier description of X"). Record what was searched and found.
4. **Date discipline.** Record precision (exact / circa / range / century) and the basis of the date (written, published, observed). Day-month dates need a calendar (Julian/Gregorian) and a citation.
5. **Status assignment.** `established` / `contested` (with a contest note naming the positions) / `revised` (a popular claim that's wrong).
6. **Verification log** (`content/logs/{id}.md`): sources consulted, quotes and locators, myth searches run, verdict per claim, confidence, and what couldn't be accessed (e.g. a paywalled monograph read only via summaries). Claims supported only via summaries are flagged `secondary-summary`, and the copy is softened to match.
7. **Re-verification** on any content edit to that discovery (CI requires a fresh log date if claims changed).

The first pass is already done for the candidate list: [accuracy-review-2026-10.md](../research/accuracy-review-2026-10.md).

**Honest limit, stated publicly:** verification by an AI model reduces errors but doesn't guarantee there are none, and some key scholarship is print-only. The "How we source" page explains the method. The schema also has a `reviewedBy` field so a human specialist's review can be recorded alongside Claude's if one is added later.

## User stories
- As a reader, I tap any footnote and see the source, locator, link and "Verified {date}".
- As a reader, I see **Contested** or **Revised** badges that say *what* is disputed and *by whom*.
- As a reader, I can suggest a correction with my own source, without needing an account.
- As a reader, I can browse a public **corrections log**: on-brand for a product about people correcting errors.
- As the editor, I can't publish an unverified or uncited claim.

## Scope
- Entities: `Claim`, `Citation`, `Source`, `VerificationLog` (see PRD).
- Status vocabulary with public definitions.
- CI gates: an uncited claim; a contested claim without a note; a dangling citation; no scholarly source; a **missing or stale verification log**; a ShareDate without calendar and citation; a tradition concept without a specialist source.
- "Suggest a correction" form (Tally or Formspree) → webhook → GitHub issue labelled `correction`, with story and claim IDs prefilled.
- `/sources` (full bibliography), `/how-we-source`, `/corrections` pages.
- Archive.org snapshot URL stored for every web source.

## Acceptance criteria
- [ ] 100% of v1 content passes the CI gates with no waivers.
- [ ] Every story shows its verification date.
- [ ] A correction submitted from a story arrives as an issue with IDs prefilled.
- [ ] The corrections log is public and linked from the footer.

## Preferred secondary sources (starting list, extend as authoring proceeds)
Nutton, *Ancient Medicine*; Siraisi, *Medieval and Early Renaissance Medicine*; Savage-Smith (Islamic anatomy); Unschuld, *Huang Di Nei Jing Su Wen*; Meulenbeld, *History of Indian Medical Literature*; Wujastyk (Ayurveda); O'Malley, *Andreas Vesalius of Brussels*; French, *William Harvey's Natural Philosophy*; journals: *Medical History*, *J. Hist. Med. Allied Sci.*, *Bull. Hist. Med.*; NLM and Wellcome exhibition essays.
