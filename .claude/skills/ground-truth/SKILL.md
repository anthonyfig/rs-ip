---
name: ground-truth
description: >
  How to read and write Ground Truth artifacts — the metadata contract, status lifecycle, source
  conventions, and the rule that only approved artifacts drive builds. Project-agnostic.
---

# Working with Ground Truth

Ground Truth is the source of truth; software is derived from it. Treat it as code: structured,
owned, versioned, validated.

## The kit (scaffold a new project)
This repo ships the reusable Ground Truth kit. To stand it up in a new project, copy:
- `templates/ground-truth/` → the project's `ground-truth/_schema/` — the metadata schema plus the
  `capability-spec` and `user-story` templates. Replace every `<placeholder>` with project specifics.
- `tools/ground-truth/` → the project's `tools/ground-truth/` — the zero-dependency engine
  (`lib.mjs`) and the consistency checker (`check.mjs`). Wire `check.mjs` into CI; it fails (exit 1)
  if any artifact is missing required metadata or has an invalid status.

## The metadata contract
Every artifact begins with the YAML block (`id, title, part, type, owner, status, confidence,
sources, updated, last_validated, applies_to, related`). No metadata → not Ground Truth. See
`templates/ground-truth/metadata-schema.md` for the full field set and rules.

## Reading
- Load only artifacts whose `applies_to` matches your task.
- Build production code only from `status: approved`. Using a draft for a spike requires flagging the
  dependency and routing to a human.
- Follow `sources` to verify; follow `related` for context.

## Writing / changing
1. New artifact → copy the right template from `templates/ground-truth/`; fill metadata honestly.
2. Changing a source behind an `approved` artifact → set it `needs-revalidation`.
3. Never invent facts to fill a gap — record an **open question** instead.
4. Material decision → add a numbered ADR to the decision log.

## Guardrails (always)
Follow the **project's business rules** — e.g. verify facts before publishing, never expose the
project's confidential/internal-only data, no placeholder content, and only make claims the project
has authorized. When uncertain, route to a human gate.

## Status lifecycle
draft → in-review → approved → needs-revalidation → (deprecated). Only humans set `approved`.

## Capability vs content
A **capability** is a function (unit of value); a **page/item** is content. See `docs/identifying-capabilities.md`.
