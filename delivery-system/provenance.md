# Provenance & versioning

Every agent is **versioned**, and every action it takes in the outside world is **stamped** with its
name and version. That turns the issue tracker, the VCS history, and the chat log into a durable record
of *which agent (which version) did what* — the raw material the **Agent Improver** uses to audit and
improve agents from real outcomes.

## Versioning
Each agent's frontmatter carries `version:` (semver). Bump it when behaviour changes:
- **patch** — wording / clarity, no behavioural change.
- **minor** — a new capability or materially better behaviour.
- **major** — a breaking change to what it does or its output contract.

Keep a short changelog at the bottom of the agent file when the history matters.

## Sign your work (every agent, every side-effecting action)
Stamp `agent-name@version` on anything you create or change in an external system:

| Action | How to stamp |
|--------|--------------|
| File / update an issue or bug | footer line: `— filed by <name>@<version> · <date>` |
| Comment on an issue / PR | the same footer on the comment |
| Commit | a trailer line: `Agent: <name>@<version>` |
| Open a PR | a label `agent:<name>` plus the footer in the body |
| Write a Ground Truth artifact | note the agent in the commit; set the right owner / `validated_by` context |

Reads never need a stamp. When in doubt, stamp it.

## Why this matters
- **Attribution** — know which agent and version produced a given result.
- **Improvement loop** — the Agent Improver queries by stamp (e.g. all bugs filed by `qa@1.2.0`), checks
  how they resolved (fixed = true positive; "won't fix" / "not a bug" / duplicate = likely false
  positive), finds the root cause of the misses, and opens a PR that fixes the agent and bumps its
  version.
- **Trust** — a human reviewing a change can see it came from an agent, and which one, at a glance.
