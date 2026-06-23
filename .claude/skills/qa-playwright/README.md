# qa-playwright — spec-driven exploratory QA (rs-ip)

Reusable, **project-agnostic** QA capability: drive a running web app with Playwright, test it
against acceptance criteria, and report the gap as a structured report + GitHub issues.

## What it does
- Reads acceptance criteria (user-story Given/When/Then) as the oracle.
- Drives the real browser (Playwright) like a user; screenshots as evidence.
- Produces a gap report (per-AC met / partial / not met / blocked + bugs).
- Files bugs as **GitHub issues by default** (dry-run unless `--file`).
- Read-only on code; never fixes (independence).

## Setup
    npm i -D @playwright/test && npx playwright install chromium
    gh auth status        # GitHub CLI, authenticated, for issue reporting

## Configure (env)
- `BASE_URL`  running app (default http://localhost:4321)
- `GH_REPO`   owner/repo for issues
- spec source: the project's user-story Given/When/Then, or a `specs/*.specs.json` file

## Run
    BASE_URL=http://localhost:4321 npx playwright test
    node scripts/report-issue.mjs --title "Bug…" --body-file gap.md            # dry-run
    node scripts/report-issue.mjs --title "Bug…" --body-file gap.md --file     # file it (after you confirm)

## Tests
- `tests/from-spec.spec.mjs` — generic, data-driven runner over `specs/*.specs.json`.
- **Project-specific tests live in the project**, not here (rs-ip stays agnostic). Generate them from
  the project's user-story scenarios, or hand-write `specs/*.specs.json`.

## Independence
This skill only **reports**. Fixes go to a separate agent/PR; then QA re-runs. The fixer never
verifies its own work.
