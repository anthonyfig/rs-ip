# Adapter: GitLab → vcs

- `branch`/`commit` via `git` (trailer `Agent: <name>@<version>`); Merge Requests via the GitLab MCP,
  `glab`, or REST (token from env). MR labelled `agent:<name>`.

**Binding** (`delivery.yml`): `{ adapter: gitlab, project: group/name, default_branch?: main }`
