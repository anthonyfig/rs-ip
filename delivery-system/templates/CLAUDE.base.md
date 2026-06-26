# CLAUDE.md — <PROJECT> operating guide

> Base template from the Delivery System (rs-ip). Fill the `<…>` placeholders and delete this line.

This file governs how Claude (and any agent) works in this repo. It merges with the user's global
guidelines; when in doubt, those still apply.

## Source of truth
- <If this project uses Ground Truth:> the Ground Truth at `<path / repo>` is the single source of
  truth. Code is derived from it and must not contradict an `approved` artifact; fix the Ground Truth
  first, through review, then the code.
- The Delivery System is instantiated here via **`delivery.yml`** (tools, repo, environments) and the
  agents installed in `.claude/agents/`.

## Adopting an existing or struggling project
If this repo pre-existed the Delivery System, **start with the `project-assessor` agent**. It audits the
project's health against `docs/engineering-baseline.md` and emits a prioritised, human-gated plan; the
other agents then execute it (tests via `eval-runner`, bugs via `qa` / `issues-fixer`, missing specs via
`capability-spec-writer`). Greenfield projects can skip this and go straight to building the Ground Truth.

## Discover before you build (agents)
Before doing any non-trivial task, **check whether an agent already does something like it**:
1. Scan `.claude/agents/` (installed) and the Delivery System blueprint for an agent whose job matches.
2. If one fits, **surface it and ask the user** whether to use it — don't silently bypass an agent.
3. If the user explicitly asked for "an agent," still **propose the closest existing agent first**, then
   suggest installing or creating a new one only when there's a genuine gap. New agents are welcome —
   just name the gap they fill.

## Branch & PR workflow (mandatory — every change, every agent)
Never commit to `main`. The loop is: **branch → trace to the spec → open a PR → adversarial self-review →
analyze & fix → rebase → merge (squash) → sync local `main`.** Review your own PR like a skeptic trying
to reject it; resolve every point; then merge. After merge, fast-forward local `main` so it never drifts.
Tiny doc fixes may skip the branch only when explicitly agreed.

## Provenance & the dashboard
Every agent **signs its work** — stamp `agent@version` on issues, comments, commits, and PRs (see the
Delivery System `provenance.md`). And **keep the capability / delivery dashboard honest**: when work
ships or advances a capability, update its status in the source of truth in the same (or a paired) PR.

## Environments
Targets (local / staging / prod, or a URL the user pastes) come from `delivery.yml` → `environments`.
Seed test data only where the manifest allows it; **never** seed or mutate prod; use provided
credentials on shared environments; assume non-local actions can trigger real side effects.

## Engineering conventions
<Stack, repo layout, accessibility/performance bars, testing, and any project guardrails — fill in.>
