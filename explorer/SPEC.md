# Ground Truth Explorer — app spec (reusable)

> Project-agnostic. The navigable, conversational surface over a project's Ground Truth — a product,
> not a folder. Instantiated per project.

## The modes
1. **Ask** — natural-language Q&A over the Ground Truth (an LLM API, e.g. Claude, with retrieval).
2. **Browse** — by part, entity, capability, decision, open question; plus a relationship graph.
3. **Trace** — every claim links to its sources with confidence + last-validated date.
4. **Validate** — stakeholders approve / correct / flag; the change is committed to Git on their
   behalf (a Git-backed UI) — that commit is the validation history + human gate.
5. **Generate** — capability specs, acceptance criteria, evals, agent tasks from the model; gated by artifact status.
6. **Ingest** — upload a document / image / video; an agent proposes where it belongs; a human approves.

## Architecture (pattern)
- **Git** is the system of record for the Ground Truth text; **media** in object storage.
- A **database/index** (e.g. Postgres + vectors) is **rebuilt from Git** and powers search, the graph,
  and chat; the Explorer **reads** the index and **writes** to Git.
- **Access control per project:** internal vs public enforced at the data layer; never expose the
  project's confidential data.

## Build it with the method
In a consuming project the Explorer is specced as a capability with user stories + evals, and QA'd
with `qa-playwright`.
