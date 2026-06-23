<!-- Canonical PR template (rs-ip). Each repo copies this to .github/PULL_REQUEST_TEMPLATE.md. Project-agnostic. -->

## Summary
<!-- One line: what changed and why. -->

## Spec trace (required)
- **Capability:** `<capability-id>`
- **User story / AC satisfied:** `<user-story-id>-AC#`
- If it isn't specced yet: add/extend the user story in the Ground Truth first, then link it here.

## Ground Truth impact
- Artifacts added/changed: <!-- ids -->
- Status moves (draft → in-review → approved): <!-- … -->
- New/updated decision: <!-- if any -->

## How verified
- **QA gap report** (qa-playwright): per-AC met / partial / not-met / blocked
- **Evals run:** <!-- ids + results -->
- Screenshots / evidence:

## Checklist
- [ ] Builds only from `approved` Ground Truth, or draft dependencies are flagged
- [ ] No placeholder content
- [ ] No confidential / internal-only data exposed
- [ ] Claims accurate per the project's content rules
- [ ] Accessibility (WCAG AA) + performance not regressed
- [ ] **Independent** verification passed (QA/eval) — not self-verified
- [ ] Sources of truth updated in **this** PR (Ground Truth + status)
- [ ] Gates pass: lint · format · typecheck · test · build
