# F08 — Analytics & success measurement

**Release:** v1 (enabling) · **Depends on:** F02, F03, F07, F12, F14

## Summary
Cookieless analytics with a few custom events. They compute the success metric (**% of sessions opening ≥ 3 stories**) and the leading diagnostic (slider use), and they track downloads without personal data.

## Scope
- Tool: Plausible (zero ops) or self-hosted Umami. Cookieless, so no consent banner.
- Events:
  | Event | Props |
  |---|---|
  | `story_open` | `discoveryId`, `source` (map / list / thread / deeplink / lens) |
  | `stories_3plus` | fired once per session at the 3rd distinct story (`sessionStorage` counter) |
  | `slider_change` | `toYear`, `method` (drag / anchor / autoplay), debounced |
  | `flap_open` | `layer` |
  | `lens_change` | `lens` |
  | `misbelief_view` | `misbeliefId` |
  | `share_click` | `discoveryId`, `channel` |
  | `citation_open`, `correction_start` | `discoveryId` |
  | `subscribe` | `channel` (rss) |
  | `download` | `file` (pack or edition file name) |
- Download totals can also be read from the GitHub Release asset counts.
- `docs/metrics.md`: how to read the success metric.

## Acceptance criteria
- [ ] **F08-AC1** No cookies; no personal data.
- [ ] **F08-AC2** `stories_3plus / sessions` is readable directly in the dashboard.
- [ ] **F08-AC3** Events are disabled in development and deploy previews.
