# qa-playwright — spec-driven exploratory QA (rs-ip)

Reusable QA capability: drive a running web app with Playwright, test it against acceptance criteria,
and report the gap as a structured report + GitHub issues. Project-agnostic (generalized from a prior
project).

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
- `BASE_URL`     running app (default http://localhost:4321)
- `GH_REPO`      owner/repo for issues (e.g. anthonyfig/rs-site)
- `EXPLORER_FILE` path to a built ground-truth-explorer.html (for the first-use test)

## Run
    BASE_URL=http://localhost:4321 npx playwright test
    node scripts/report-issue.mjs --title "Bug…" --body-file gap.md            # dry-run
    node scripts/report-issue.mjs --title "Bug…" --body-file gap.md --file     # file it (after you confirm)

## First use — the Ground Truth Explorer
`tests/explorer.spec.mjs` checks the Explorer against expectations that would have caught our real UI
bug: (a) no escaped text in the nav (`\"…\"`), (b) user stories nested under their capability,
(c) internal links resolve, (d) search filters.
    EXPLORER_FILE=../../rs-site-gt/ground-truth-explorer.html npx playwright test tests/explorer.spec.mjs

## Deriving tests from specs
`tests/from-spec.spec.mjs` reads `specs/*.specs.json` (scenarios with steps + assertions) and runs
each. Generate that file from a capability's user stories (their Given/When/Then), or hand-write it.

## Independence
This skill only **reports**. Fixes go to a separate agent/PR; then QA re-runs. The fixer never
verifies its own work.
