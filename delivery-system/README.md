# The Delivery System

rs-ip is a **blueprint** for an AI delivery system: a project- and tool-agnostic set of **agents**,
**evals**, and (growing) **orchestration** that you instantiate per project. Nothing here is tied to a
specific client, stack, or tool — `npm run check:agnostic` enforces that. A project picks its tools and
environments in one config file and installs the agents it needs.

## The model: blueprint → instantiate

```
rs-ip (blueprint)                              your project (instance)
  .claude/agents/*            ── install ──▶    .claude/agents/*        (the agents you chose)
  delivery-system/
    capabilities/*   abstract roles agents depend on
    adapters/*       generic tool bindings (github / jira / …)
    delivery.schema.md          ──────────▶    delivery.yml            (which tools, repo, envs)
    templates/CLAUDE.base.md    ──────────▶    CLAUDE.md               (the project operating guide)
    provenance.md    versioning + sign-your-work standard
```

Agents are written against **abstract capabilities** — "the issue tracker", "the VCS", "the target
environment" — never against Jira / GitHub / a hard-coded URL. The project's `delivery.yml` binds those
to real tools; an **adapter** says how to perform each capability on that tool. Swapping GitHub Issues
for Jira is a one-line change in `delivery.yml`.

## What's here
- **`.claude/agents/`** — the agents (QA, fixer, spec-writer, eval-runner, guardian, agent-improver…).
- **`.claude/skills/`** — skills agents use (ground-truth, qa-playwright).
- **`delivery-system/capabilities/`** — the abstract interfaces agents depend on.
- **`delivery-system/adapters/`** — reusable, generic tool bindings.
- **`delivery-system/delivery.schema.md` + `delivery.example.yml`** — the per-project manifest.
- **`delivery-system/templates/CLAUDE.base.md`** — the base operating guide a new project starts from.
- **`delivery-system/provenance.md`** — versioning + "sign your work" standard.

## Principles
- **Project- and tool-agnostic.** Tools and locations live in the project's `delivery.yml`, never here.
- **Human-gated.** Agents propose; people approve. No auto-approve / skip-permissions by default — we
  trade a little speed for reviewability and a clean trail. (Deliberately unlike "yolo" systems.)
- **Provenance.** Every side-effecting action is stamped `agent@version` (see `provenance.md`), so work
  is attributable and the **Agent Improver** can audit and improve agents from real outcomes.
- **Ground Truth is the shared memory.** Specs, decisions, and delivery status live in the project's
  Ground Truth, so every agent and every session loads the same state (this is how long runs avoid
  context rot — the durable state is on disk, not in the window).
- **Discover before you build.** Before a task, check whether an existing agent already fits and surface
  it to the user (see `templates/CLAUDE.base.md`).

## The delivery loop (orchestration — the layer we grow into)
A project moves through **spec → plan → build → verify → ship**, with heavy work done by fresh-context
subagents and state persisted in Ground Truth. Today the agents here cover **spec**
(capability-spec-writer), **build/verify** (qa, design-qa, exploratory-qa, eval-runner), **fix**
(github-issues-fixer), and **integrity** (ground-truth-guardian), plus the meta layer
(**agent-improver**). The explicit orchestrator that drives the whole loop end-to-end is the next
addition.

## Influences
The phased loop, fresh-context subagents, session-surviving state, and the copy-in installer are
informed by spec-driven systems such as **GSD (get-shit-done)**. We keep that structure but stay
**human-gated, Ground-Truth-backed, and provenance-stamped** rather than auto-approving work.
