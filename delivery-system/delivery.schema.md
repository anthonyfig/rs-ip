# delivery.yml — the per-project manifest

Lives in **the project repo** (never in rs-ip). Binds the Delivery System's abstract capabilities to
this project's real tools and environments. Agents read it to know *which* tool and *where*.

```yaml
project: <name>

issue_tracker:                 # capability: issue-tracker
  adapter: github-issues       # github-issues | jira | linear
  repo: owner/name             # adapter-specific binding (see adapters/issue-tracker/<adapter>.md)

vcs:                           # capability: vcs
  adapter: github              # github | gitlab
  repo: owner/name

environments:                  # capability: environments
  local:   { url: http://localhost:5173,        data: seed }          # safe to seed test data
  staging: { url: https://staging.example.com,  data: read-mostly }   # provided creds, no bulk writes
  prod:    { url: https://www.example.com,       data: provided-creds } # NEVER seed or mutate

notify:                        # capability: notify (optional)
  adapter: slack               # slack | (none)
  channel: "#project-qa"

specs:                         # where acceptance criteria / Ground Truth live (optional)
  ground_truth: ../<project>-gt/ground-truth   # or a path/glob to spec files

agents:                        # which blueprints are installed, pinned to a version
  - qa@1.0.0
  - design-qa@1.0.0
  - issues-fixer@1.0.0
```

Rules: secrets (tokens, webhooks) come from the environment, never from this file. Adapter values are
documented in `adapters/<capability>/<adapter>.md`. `agents:` is kept in sync by the installer + the
`delivery-system.lock.json` it writes.
