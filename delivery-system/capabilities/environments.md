# Capability: environments

Resolve a target to a URL and a data rule. Defined per project in `delivery.yml` → `environments`.

- `resolve(target) → { url, data }` — `target` is an env name (`local`/`staging`/`prod`) **or** a raw
  URL the user pastes.
- `data` ∈ `{ seed, read-mostly, provided-creds }`:
  - `seed` — safe to create throwaway test data (typically `local`).
  - `read-mostly` — sign in with provided creds; no bulk create/delete (shared/staging).
  - `provided-creds` — read-only with provided creds; **never seed or mutate** (prod).
- Assume any non-`local` target can trigger real side effects (emails, billable calls).
