# F08 — Analytics & success measurement

**Priority:** MVP (enabling) · **Depends on:** F02, F03, F07

## Summary
Privacy-friendly, cookieless analytics with a handful of custom events. Just enough to compute the success metric (**% of sessions opening ≥ 3 stories**) and the leading diagnostic (slider use).

## User problem / job
Ali: "Did this work? I need one honest number, not a dashboard."

## Scope
**In**
- Tool: Plausible, Umami (self-host) or Cloudflare Web Analytics with custom events. It must be cookieless, so no consent banner is needed.
- Events:
  | Event | Props |
  |---|---|
  | `story_open` | `discoveryId`, `source` (map / list / nav / deeplink) |
  | `slider_change` | `toYear`, `method` (drag / anchor / autoplay), debounced |
  | `share_click` | `discoveryId`, `channel` |
  | `citation_open` | `discoveryId` |
  | `correction_start` | `discoveryId` |
- A session-level "stories opened" count. If the tool can't do per-session aggregation, emit a `stories_3plus` event client-side when a session reaches 3 distinct opens (count kept in `sessionStorage`).
- A one-page note in `docs/` explaining how to read the metric.

**Out**
- Personal data, fingerprinting, cross-site tracking, heatmaps or session replay.

## Acceptance criteria
- [ ] No cookies are set. Passes a privacy check (no consent banner required in AU/EU).
- [ ] `stories_3plus / sessions` can be read directly from the analytics dashboard.
- [ ] Events don't fire in development or deploy previews.

## Open questions
- Should we self-host Umami (free, more ops) or use Plausible (~US$9/mo, zero ops)?
