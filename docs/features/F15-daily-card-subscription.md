# F15 — Subscription: RSS + weekly email

**Release:** v1 · **Depends on:** F07

## Summary
Readers can get **"This week in anatomy"** by RSS or weekly email. This is the retention loop that an account-less product otherwise lacks. It's weekly (not daily) because verified dates are scarce (F07), and because a weekly digest is something people actually read.

## Scope
- `/feed.xml`: one item per week + on-this-day items when verified.
- A weekly email via Buttondown (or similar), auto-drafted from the week's card + a featured thread + one corrections-log entry. Ali approves each issue (a one-click send).
- Signup in the footer, after the 3rd story ("Want one of these every week?") and on `/today`.
- Double opt-in. Compliant with the AU Spam Act and GDPR. One-click unsubscribe.

## Acceptance criteria
- [ ] **F15-AC1** The feed validates (W3C).
- [ ] **F15-AC2** Email issues render well in Gmail, Apple Mail and Outlook (plate-style header image, live text).
- [ ] **F15-AC3** The `subscribe` event fires (F08).
