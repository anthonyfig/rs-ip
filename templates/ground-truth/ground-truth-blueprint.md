# Ground Truth — the blueprint

The **Ground Truth** is a project's single source of truth: agent-native markdown that the software is
*derived* from. It's organized in numbered parts, and every artifact carries the metadata defined in
`_schema/metadata-schema.md`. Build production work only from `approved` artifacts.

## The parts
| Part | Holds |
|------|-------|
| `01-project-context` | goals, audience / ICP, stakeholders, constraints + success metrics, non-goals, open questions |
| `02-domain-model` | vocabulary, entities, business rules, content types |
| `03-capability-specs` | capabilities (what the product *does*) + their user stories (Given/When/Then) |
| `04-engineering-context` | stack, architecture, conventions, security, deployment |
| `05-integration-contracts` | external systems (CRM, payments, chat, …) and their contracts |
| `06-eval-suite` | how each acceptance criterion is verified |
| `07-decision-log` | numbered ADRs — material decisions, never rewritten, only superseded |
| `_schema` | the metadata contract + artifact templates |

## How to create one
1. Start with **`01`** (why, and for whom) and **`07`** (capture decisions as you make them).
2. A **capability is a function, not a page** (see `docs/identifying-capabilities.md`). Each gets a spec
   (human-facing) plus user stories (agent-facing, with acceptance criteria) — use the templates in
   `_schema/templates/`.
3. Every artifact gets the full **metadata block** (id, title, part, type, owner, status, confidence,
   sources, `delivery_status`, `last_validated`). See `_schema/metadata-schema.md`.
4. **Validate** before building: `node tools/ground-truth/check.mjs`.
5. Track delivery honestly: `delivery_status` (`backlog → in-progress → shipped`) on each user story —
   the coverage view and the dashboard read it. Bump `last_validated` only when an eval or a human verifies.

## Lifecycle
`draft → in-review → approved` (build from `approved`); a source change flips an artifact to
`needs-revalidation`. The `ground-truth-guardian` agent checks integrity; `capability-spec-writer`
drafts specs from approved context; `qa` / `eval-runner` verify against the acceptance criteria.
