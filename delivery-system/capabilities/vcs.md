# Capability: vcs

Source-control operations. Bound by `delivery.yml` → `vcs.adapter`; see `../adapters/vcs/`.

| Operation | Meaning |
|-----------|---------|
| `branch(name)` / `commit(msg, {trailers})` | work on a feature branch; commit with an `Agent:` trailer |
| `openPR(title, body, {labels})` | open a change request, labelled `agent:<name>` |
| `mergePR(id, method)` | merge once the PR workflow in `CLAUDE.md` is satisfied |
| `comment(prId, body)` | review/notes on the PR |
| `findChangesByStamp(stamp)` | commits/PRs by an agent version — for the Agent Improver |
