# Capability: issue-tracker

Abstract operations an agent uses to work with work items and bugs. Bound to a concrete tool by
`delivery.yml` → `issue_tracker.adapter`; see `../adapters/issue-tracker/`. Agents call these
*conceptually* — never "open a GitHub issue", always "file a bug via the issue tracker".

| Operation | Meaning |
|-----------|---------|
| `findWorkItem(ref)` | an epic / story / ticket by id or search |
| `readAcceptanceCriteria(item)` | the item's Given/When/Then (or linked spec) |
| `fileBug(title, body, labels?)` | create a bug/issue, **stamped** with the agent's provenance |
| `comment(itemId, body)` | add a comment (stamped) |
| `listByStamp(stamp)` | find everything an agent version filed — used by the Agent Improver |
| `resolutionOf(itemId)` | `fixed` \| `wontfix` \| `not-a-bug` \| `duplicate` \| `open` |
