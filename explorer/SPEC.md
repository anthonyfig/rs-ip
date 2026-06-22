# Ground Truth Explorer — Spec (v0.1)

> "The client should not receive 15 markdown files." The Explorer is the **navigable, searchable,
> conversational, correctable** surface over the Ground Truth — a product, not a folder. For this
> pilot it runs over **Rootstrap's own** Ground Truth, making it the dogfood reference that makes
> the client-facing product sellable. (Delivery v2, A6.)

## What it is
A web app that renders `ground-truth/` as a **Business Twin**: every artifact (parts 01–07) is a
first-class object with its metadata, sources, and relationships. It is the strongest proof on the
new website that the method is real.

## The five modes (A6)

1. **Ask** — natural-language Q&A over the Ground Truth. Canonical questions for this pilot:
   - "How does lead capture work?" → renders `03/capability-lead-capture` + its evals.
   - "Which system is the source of truth for leads?" → `05` (HubSpot).
   - "Who owns the positioning, and is it approved?" → `01/goals-and-scope` owner + status.
   - "What's still an open question?" → `01/non-goals-and-open-questions`.
   - "What changed, and what needs re-validation?" → status + `last_validated` + Decision Log.
2. **Browse** — by part, entity, capability, decision, open question; plus a **graph** view from
   `related` edges.
3. **Trace** — every claim links to its `sources` with confidence + last-validated date. No
   un-sourced assertions.
4. **Validate** — stakeholders **approve / correct / flag**; changes enter a **review queue**
   (status moves draft→in-review→approved). On approve, the Explorer authors a **clean commit to Git**
   on the user's behalf (they never see Git) — that commit *is* the validation history + human gate
   (Decisions 0009/0010). The DB index is then rebuilt from Git.
5. **Generate** — produce capability specs, acceptance criteria, evals, and agent tasks straight
   from the model (Edge Functions). Generation is **gated** by artifact status (BR-1).
6. **Ingest** — upload a **document, image, or video**; an agent reads/classifies it and **proposes
   where it belongs in the Ground Truth** (artifact/part + the change), routed to a **human gate** to
   apply. Media is stored (Storage) and attached to artifacts; a case study shows all its materials.
   Capability specs are human-facing; their **user stories** render beneath them as the agent-facing
   detail. (Decisions 0007, 0008, 0009.)

> **Format (Decisions 0009/0010):** Git is the system of record for the agent-friendly markdown;
> media lives in Storage; the database is the engine, rebuilt from Git; the Explorer is a Git-backed UI.

## Architecture (per `04/stack-and-architecture`)
```
ground-truth/*.md(frontmatter)
   └─ packages/ground-truth  → typed Business Twin graph (build-time)
         ├─ apps/marketing (Astro)   reads at build for public fact pages
         └─ apps/explorer (React 19 + Vite + shadcn)
               └─ Supabase: Postgres (artifacts mirror + validations queue)
                            pgvector (embeddings for Ask / RAG)
                            Auth (if gated — OQ-2)   RLS (enforces BR-8)
```

## Access & guardrails
- **Internal-only** (Decision 0005): authenticated Rootstrap users only — not a public surface.
  This removes most BR-8 public-exposure risk; RLS still scopes who sees what internally.
- LLM-discovery lives on the **public marketing site**; the Explorer is the internal Business Twin
  you can **chat with** (Anthropic / Claude API).

## MVP scope
- **v0 — built:** a local, zero-dependency HTML navigator generated from the files
  (`npm run gt:explorer` → `ground-truth-explorer.html`): **Browse + Trace + status**, plus the
  **EV-GT-CONSISTENCY** health check. Open it in a browser — no server, no keys. See
  [`tools/ground-truth/`](../tools/ground-truth/README.md).
- **v1 — internal app:** **Ask / chat** with the Ground Truth (Claude API), **Validate**
  (review queue + status write-back), and **Generate** — needs Supabase + an Anthropic key.
- Capability sizing: **C4 (core platform)** — see `03/_index`.

## Why it matters
If stakeholders can't interrogate the model, they can't validate it — and unvalidated Ground Truth
can't safely drive delivery. The Explorer *is* the validation interface, the proof surface, and the
template for what Rootstrap will later give clients.
