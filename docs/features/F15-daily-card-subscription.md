# F15 — Subscription: RSS

**Release:** v1 · **Depends on:** F07

## Summary
Readers can follow **"This week in anatomy"** by RSS. This is the retention loop that an account-less product otherwise lacks. It's weekly (not daily) because verified dates are scarce (F07), and because a weekly digest is something people actually read.

*Changed 2026-11-03:* the weekly email (Buttondown signup and generated issues) was removed at Ali's request. It needed a third-party service, personal data and a weekly send, which sit badly with an open-source, no-accounts project. RSS and `/today` cover the same loop. The code remains in git history.

## Scope
- `/feed.xml`: one item per week + on-this-day items when verified.
- "Follow by RSS" in the footer, after the 3rd story ("Want one of these every week?") and on `/today`.

## Acceptance criteria
- [ ] **F15-AC1** The feed validates (W3C).
- F15-AC2 *(retired 2026-11-03 with the weekly email.)*
- [ ] **F15-AC3** The `subscribe` event fires (F08) when a reader follows the feed.
