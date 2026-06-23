---
name: ground-truth
description: >
  How to read and write Ground Truth artifacts — the metadata contract, status lifecycle, source
  conventions, and the rule that only approved artifacts drive builds. Project-agnostic.
---

# Working with Ground Truth

Ground Truth is the source of truth; software is derived from it. Treat it as code: structured,
owned, versioned, validated.

## The metadata contract
Every artifact begins with the YAML block (`id, title, part, type, owner, status, confidence,
sources, updated, last_validated, applies_to, related`). No metadata → not Ground Truth.

## Reading
- Load only artifacts whose `applies_to` matches your task.
- Build production code only from `status: approved`. Using a draft for a spike requires flagging the
  dependency and routing to a human.
- Follow `sources` to verify; follow `related` for context.

## Writing / changing
1. New artifact → copy the right template; fill metadata honestly.
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
