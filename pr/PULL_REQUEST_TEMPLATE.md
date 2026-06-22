<!-- Canonical PR template (rs-ip). Each repo copies this to .github/PULL_REQUEST_TEMPLATE.md. -->

## Summary
<!-- One line: what changed and why. -->

## Spec trace (required)
- **Capability:** `gt-03-capability-…`
- **User story / AC satisfied:** `gt-03-us-…-AC#`  <!-- every change traces to an acceptance criterion -->
- If it isn't specced yet: add/extend the user story in **rs-site-gt** first, then link it here.

## Ground Truth impact (Decision 0010 — Git is the system of record)
- Artifacts added/changed in `rs-site-gt`: <!-- ids -->
- Status moves (draft → in-review → approved): <!-- … -->
- New/updated decision (`gt-07-…`): <!-- if any -->

## How verified
- **QA gap report** (`qa-playwright`): per-AC met / partial / not-met / blocked
- **Evals run:** `EV-…` (results)
- Screenshots / evidence:

## Checklist
- [ ] Builds only from `approved` Ground Truth, or draft dependencies are flagged (BR-1)
- [ ] No placeholder / Lorem content (BR-11)
- [ ] No internal-only data exposed — revenue, deal sizes, anti-ICP (BR-8)
- [ ] Claims accurate: verified stats (BR-7); SOC 2 ✅ / Anthropic-certified ✅ / **not** "Anthropic partner" (BR-12)
- [ ] Accessibility (WCAG AA) + Core Web Vitals not regressed
- [ ] **Independent** verification passed (QA/eval) — not self-verified
- [ ] Sources of truth updated in **this** PR (Ground Truth + status), not a follow-up
- [ ] Gates pass: lint · format · typecheck · test · build
