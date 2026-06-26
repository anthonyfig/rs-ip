# Engineering baseline (the quality bar the Delivery System brings)

The standard a project is held to once the Delivery System is installed. The `project-assessor` audits
against this, `CLAUDE.md` makes it the ongoing bar, and the agents bring a project up to it. This is what
"good practices" means here — concrete, checkable, enforced.

## Tests & verification
- Every capability's acceptance criteria map to at least one automated eval (`06-eval-suite`).
- A fast unit/integration layer plus a thin end-to-end layer on critical flows. Tests run in CI on every PR.
- Coverage is measured and trends up; the riskiest modules are covered first. `eval-runner` owns this.

## Quality gates (enforced in CI, not merely available)
- Lint, type-check (where the language has types), formatter, and build all pass on every PR.
- No new `TODO`/`FIXME` without a tracked issue. Dead code is removed, not commented out.

## Review discipline
- No commits to `main`. Every change is a branch -> PR -> adversarial self-review -> squash-merge.
- A PR template (`.github/PULL_REQUEST_TEMPLATE.md`) ties each PR to a spec/issue and lists what was verified.

## Source of truth
- Requirements live in the Ground Truth, not in people's heads. Code is derived from `approved` artifacts.
- Material decisions are recorded as numbered decisions and never silently rewritten.

## Provenance & delivery tracking
- Every agent action is stamped `agent@version`. `delivery_status` is kept honest as work ships.

## How a struggling project reaches the bar
Run `project-assessor` first -> it scores these areas and emits a prioritised plan -> the agents execute it:
stop the bleeding (CI + a smoke test green, direct-to-`main` halted), then raise the floor (coverage +
reconstructed specs on the core capabilities), then run the steady-state delivery loop.
