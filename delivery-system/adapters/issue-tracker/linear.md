# Adapter: Linear → issue-tracker

| Capability op | Linear |
|---------------|--------|
| findWorkItem | by identifier (`ABC-123`) or search; an "epic" = a Linear **Project**/initiative |
| fileBug | create an Issue with a `Bug` label; footer stamp |
| comment | issue comment |
| listByStamp | search for `<name>@<version>` |
| resolutionOf | state category `completed` = fixed; `canceled`/`duplicate` = false positive |

**Binding** (`delivery.yml`): `{ adapter: linear, team: TEAM, project?: ... }`
**Access:** prefer the Linear MCP; else API with a token from env. Never hard-code a token.
