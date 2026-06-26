# Adapter: GitHub Issues → issue-tracker

| Capability op | GitHub Issues |
|---------------|---------------|
| findWorkItem | issue by number, or search; an "epic" = a tracking issue / milestone / label |
| readAcceptanceCriteria | the issue body or its linked spec |
| fileBug | create an issue in `issue_tracker.repo` (+ labels), with the provenance footer |
| comment | issue comment (footer stamp) |
| listByStamp | search issues whose body/footer contains `<name>@<version>` |
| resolutionOf | closed-as-`not planned` / label `duplicate`/`invalid`/`wontfix` = false positive; closed by a merged fix = `fixed` |

**Binding** (`delivery.yml`): `{ adapter: github-issues, repo: owner/name, labels?: [...] }`
**Access:** prefer the GitHub MCP; else the `gh` CLI; else REST with a token from env. Never hard-code a token.
