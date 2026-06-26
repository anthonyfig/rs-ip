# Adapter: Jira → issue-tracker

| Capability op | Jira |
|---------------|------|
| findWorkItem | by key (`PROJ-123`) or JQL; an "epic" = a Jira **Epic**; read its child stories |
| readAcceptanceCriteria | the story's Acceptance Criteria field / description |
| fileBug | create a **Bug** in the project, linked to the epic/story; footer stamp; set component/labels |
| comment | add a comment (footer stamp) |
| listByStamp | JQL `text ~ "<name>@<version>"` |
| resolutionOf | resolution `Done`/`Fixed` = fixed; `Won't Do`/`Cannot Reproduce`/`Duplicate` = false positive |

**Binding** (`delivery.yml`): `{ adapter: jira, site: your.atlassian.net, project: PROJ, epic_link_field?: ... }`
**Access:** prefer the Atlassian/Jira MCP connector; else REST with a token from env. Never hard-code a token.
