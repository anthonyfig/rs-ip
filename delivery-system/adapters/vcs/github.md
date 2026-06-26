# Adapter: GitHub → vcs

- `branch`/`commit` via `git`; `commit` adds the trailer `Agent: <name>@<version>`.
- `openPR`/`mergePR`/`comment` via the GitHub MCP, the `gh` CLI, or REST (token from env).
- PRs are labelled `agent:<name>`; merging respects branch protection + the repo `CLAUDE.md` PR workflow.

**Binding** (`delivery.yml`): `{ adapter: github, repo: owner/name, default_branch?: main }`
