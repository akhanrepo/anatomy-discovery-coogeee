# Plan 00 — Infrastructure & test harness

**Approach:** Astro 7 static site + Preact islands. Vitest for unit/content/traceability, Playwright (preinstalled Chromium) for smoke, functional and perf projects. A PostToolUse hook runs Vitest after edits.

**Files:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `tests/unit/traceability.test.ts`, `.claude/settings.json`, `.claude/hooks/post-edit-test.sh`.

**Traceability rule:** every `Fxx-ACn` in the briefs must appear in a test title once its feature's step in `docs/PLAN.md` is 🔨 (building) or ✅ (done). At the end of the build every step is ✅, so every criterion is covered.

**Risks:** Playwright 1.64 vs the preinstalled Chromium build. Mitigation: `executablePath` pinned in config. Perf numbers on a headless CI box are a proxy for a mid-range phone (CPU throttling via CDP).
