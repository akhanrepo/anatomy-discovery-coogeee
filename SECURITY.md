# Security Policy

## Supported versions

Only the live site (built from `main`) and the latest release are supported.

## Reporting a vulnerability

**Please don't open a public issue for security problems.**

Report them privately through GitHub: go to the repository's **Security** tab and choose **Report a vulnerability** ([direct link](https://github.com/akhanrepo/tabula/security/advisories/new)). Include:

- what the issue is and its impact,
- steps to reproduce, or a proof of concept,
- the page or URL involved, and your browser.

You can expect an acknowledgement within a week. Fixes are coordinated in a private advisory, and you'll be credited unless you'd rather not be.

## Scope

Tabula is a static site with no accounts, no server and no user data, so the attack surface is small. What matters most:

- **Script injection through content or URLs.** Stories and essays are Markdown rendered to HTML at build time, and the view state is read from the URL (`?y=&d=&layer=&lens=…`). Anything that lets content or a crafted link run script in a reader's browser is in scope.
- **Third-party code on the page.** Analytics (Plausible) is the only off-site integration, and it is off until configured. There is no mailing list. Anything that sends readers' data elsewhere, or sets cookies, is in scope.
- **The build and release chain.** Dependencies, GitHub Actions workflows, and the release assets (the classroom packs and the edition) that the site links to.

Out of scope: Netlify's and GitHub's own infrastructure, and reports from automated scanners without a demonstrated impact.
