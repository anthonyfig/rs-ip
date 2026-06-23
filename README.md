# rs-ip — AI-delivery method (reusable IP)

The compounding, **project-agnostic** method that travels across engagements. A client's Ground
Truth *content* does not travel; the method does. **Nothing here references a specific project,
repo, or client** — that's the rule for this repo.

## Contents
- `.claude/agents/` — reusable delivery agents: `ground-truth-guardian`, `capability-spec-writer`, `eval-runner`, `qa`
- `.claude/skills/` — reusable skills (e.g. `qa-playwright`)
- `pr/PULL_REQUEST_TEMPLATE.md` — canonical PR template (copied into each repo's `.github/`)
- `docs/` — `identifying-capabilities.md`, `spec-and-pr-conventions.md`

## Promotion model
Templates, tooling, and the Explorer app start life inside a project and **graduate to rs-ip** once
proven reusable — **generalized (project specifics removed) on the way in.** "Each new build starts
ahead, not from zero."

## Stay agnostic (enforced)
`npm run check:agnostic` (CI gate for this repo) fails if a project repo name, a `gt-NN-…` / `BR-N`
/ `OQ-N` id, a decision number, or a denylisted client/product term leaks in. Run it before
promoting anything here, and extend `scripts/agnostic-denylist.txt` with new client/product names.

Remote: `git@github.com:anthonyfig/rs-ip.git`
