---
name: ground-truth
description: >
  How to read and write Ground Truth artifacts in this repo — the metadata contract, status
  lifecycle, source conventions, and the rule that only approved artifacts drive builds. Use
  whenever creating, editing, or building from ground-truth/.
---

# Working with Ground Truth

Ground Truth (`ground-truth/`) is the source of truth; software is derived from it. Treat it as
code: structured, owned, versioned, validated.

## The metadata contract
Every artifact begins with the YAML block defined in `ground-truth/_schema/metadata-schema.md`
(`id, title, part, type, owner, status, confidence, sources, updated, last_validated, applies_to,
related`). No metadata → not Ground Truth.

## Reading
- Load only artifacts whose `applies_to` matches your task.
- Build production code only from `status: approved`. If you must use draft/in-review, **flag it**
  and route to a human (BR-1, BR-5).
- Follow `sources` to verify; follow `related` for context.

## Writing / changing
1. New artifact → copy the right template from `_schema/templates/`; fill metadata honestly.
2. Changing a source behind an `approved` artifact → set it `needs-revalidation`.
3. Never invent facts to fill a gap — record an **open question** instead.
4. Material decision → add a numbered ADR in `07-decision-log/`.

## Guardrails (always)
- **BR-7** verify stats against the authoritative source before publishing.
- **BR-8** never expose internal data (revenue, deal sizes, anti-ICP) on public surfaces.
- **BR-11** no placeholder content — unknowns become open questions.
- **BR-12** "Anthropic-certified teams" ✅; "Anthropic partner" ❌ (in progress).

## Status lifecycle
draft → in-review → approved → needs-revalidation → (deprecated). Only humans set `approved`.
