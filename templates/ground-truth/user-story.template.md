---
id: <part>-us-<slug>
title: "<CODE>-<n> · <short story title>"   # CODE = the capability's short uppercase code
part: "03-capability-specs"
type: user-story
owner: "<role — person>"
status: draft
delivery_status: backlog   # build progress: backlog | in-progress | in-review | shipped
confidence: medium
sources: []
updated: 2026-06-22
last_validated: "pending"
validated_by: "pending"
applies_to: ["<surface-a>"]
capability: <part>-capability-<slug>   # the parent capability
related: []
tags: []
---

# User story: <title>

> **Agent-facing.** This is the executable unit: an agent implements it; an *independent* eval
> verifies it. It is a communication + acceptance unit, **not** an estimate.

**As a** `<actor>` **I want** `<goal>` **so that** `<benefit>`.

## Actors & permissions
| Actor | Can | Cannot |
|-------|-----|--------|

## Preconditions
- …

## Acceptance criteria — scenarios (Given / When / Then)
**Scenario: <name>**
- **Given** …
- **When** …
- **Then** …

## Definition of done
- [ ] All scenarios pass their evals · accessible (WCAG) · no placeholder content (per a business rule)

## Evals (each scenario → at least one)
| Scenario | Eval | Pass condition |
|----------|------|----------------|

## Notes / human gates
Decisions an agent must not resolve alone — route to a human.
