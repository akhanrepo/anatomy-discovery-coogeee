# Reading the success metric

**Metric:** the share of sessions that open 3 or more discovery stories. **Target:** ≥ 25% across the first 1,000 public sessions (PRD).

## Where to read it
Plausible (cookieless), once `PUBLIC_PLAUSIBLE_DOMAIN` and `PUBLIC_PRODUCTION_HOST` are set in the Netlify environment:
1. **Goals → add custom event goals** for `stories_3plus`, `story_open`, `slider_change`, `share_click`, `subscribe`, `checkout_start`.
2. **Success metric = unique visitors converting on `stories_3plus` ÷ unique visitors**, shown directly as the goal's *conversion rate*. (Plausible counts a session-scoped visitor without cookies. `stories_3plus` fires once per browser session, at the third *distinct* story.)
3. **Leading diagnostic:** the conversion rate of `slider_change`. If people don't touch the slider, the fog isn't landing.

## What is (and isn't) collected
- No cookies, no localStorage, and no identifiers. The only browser storage is `sessionStorage['tabula-opened']` (the IDs of stories opened this session), which is needed to count to three.
- The event properties are limited to: `discoveryId`, `source`, `toYear`, `method`, `layer`, `lens`, `misbeliefId`, `channel` and `product` (enforced by a test).
- Analytics never runs in development or on deploy previews (host guard).

## Sales
Read sales in the Lemon Squeezy dashboard. They aren't tracked client-side.
