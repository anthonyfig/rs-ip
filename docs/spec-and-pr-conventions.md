# Spec & PR conventions (rs-ip)

How we document specs and ship changes. Generalized from a prior Rootstrap project and adapted to the
Ground-Truth model (capabilities + user stories). Reusable across engagements.

## Specs are the oracle
- A **capability** (human-facing) holds the *why/what*; its **user stories** (agent-facing) hold the
  executable detail as **Given/When/Then** scenarios with **stable AC ids**.
- **AC id format:** `<user-story-id>-AC<n>` — e.g. `gt-03-us-lead-submit-AC1`. Every change, test, and
  PR traces to an AC. (Mirrors the `FNN-Sx-ACy` convention.)
- **Status dashboard:** each Part's `_index.md` lists its artifacts + status, and the **Explorer
  Overview** shows the live health check. Together they are the "what's done / not done" board.

## The workflow loop (every task)
1. **Trace it to an AC.** Find the user-story AC in `rs-site-gt`. If unspecced, add/extend the spec first.
2. **Branch** off the integration branch: `feature/*`, `fix/*`, `chore/*`. Never commit to `main`.
3. **Build small; encode the AC in evals** (qa-playwright scenarios / Part-06 evals).
4. **Run the gates:** `lint · format · typecheck · test · build`.
5. **Open a PR** using the template; fill the **Spec trace**.
6. **Keep sources of truth in sync in the SAME PR:** the Ground Truth artifacts + their status (and
   any Decision). Don't batch into a catch-up PR.
7. **Verify independently:** run the `qa` agent / `qa-playwright`. The fixer never verifies its own work.

## Ground Truth ↔ Git (Decision 0010)
Git is the system of record for the Ground Truth text; the Explorer commits validated changes on the
user's behalf; **PRs are the review / human gate**. A PR that changes behaviour updates the matching
Ground Truth artifact in the same PR.

## Branches
`main` = production · `develop` (or `main` for content) = integration · `feature/*` · `fix/*` · `chore/*`. Never commit directly to `main`.

## "Done" means
Every targeted AC has a passing eval; lint 0; format clean; typecheck strict; build green; UI meets
the design system; **claims are true** (BR-7/8/12); no placeholder (BR-11); independent QA passed.

## The correctness law (Rootstrap)
The site *is* the argument for the method, so **truth is the first-class requirement.** Never publish
an unverified stat, an internal figure, or a claim we haven't earned (especially "Anthropic partner").
When a claim path is uncertain, **route to a human gate — don't guess.** (Mirror of a prior project's
"the numbers must be right" law, adapted: here, *the claims must be true*.)
