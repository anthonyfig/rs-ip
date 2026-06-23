# Spec & PR conventions (rs-ip)

How to document specs and ship changes on a Ground-Truth project. **Project-agnostic** — no project
names, ids, or business rules here; each project supplies its own.

## Specs are the oracle
- A **capability** (human-facing) holds the *why/what*; its **user stories** (agent-facing) hold the
  executable detail as **Given/When/Then** scenarios with **stable AC ids**.
- **AC id format:** `<user-story-id>-AC<n>` (e.g. `us-checkout-submit-AC1`). Every change, test, and
  PR traces to an AC.
- **Status dashboard:** each Part's `_index` lists artifacts + status; the Explorer Overview shows
  the live health check.

## The workflow loop (every task)
1. **Trace it to an AC** in the project's Ground Truth. If unspecced, add/extend the spec first.
2. **Branch** off the integration branch: `feature/*`, `fix/*`, `chore/*`. Never commit to `main`.
3. **Build small; encode the AC in evals** (qa-playwright scenarios / the project's eval suite).
4. **Run the gates:** `lint · format · typecheck · test · build`.
5. **Open a PR** using the template; fill the **Spec trace**.
6. **Keep sources of truth in sync in the SAME PR:** the Ground Truth artifacts + their status (and
   any decision). Don't batch into a catch-up PR.
7. **Verify independently:** run QA. The fixer never verifies its own work.

## Ground Truth ↔ Git
Git is the system of record for the Ground Truth; an Explorer commits validated changes on the
user's behalf; **PRs are the review / human gate**. A PR that changes behaviour updates the matching
Ground Truth artifact in the same PR.

## "Done" means
Every targeted AC has a passing eval; lint 0; format clean; typecheck strict; build green; UI meets
the design system; the project's content/claim rules are satisfied; no placeholder; independent QA passed.

## Promoting to rs-ip
Anything moved into rs-ip (templates, tooling, agents, the Explorer app) must be **generalized
first** — no project names, `gt-`/`BR-`/`OQ-` ids, decision numbers, or client/product terms. The
`check:agnostic` gate in rs-ip enforces this.

## Define a correctness law (per project)
Each project names the **one thing that must be right** — e.g. "the numbers must be right," or "the
claims must be true" — and treats it as a first-class, test-covered requirement. Never publish
unverified or unauthorized content; route uncertainty to a **human gate**.
