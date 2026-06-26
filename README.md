# rs-ip — the Delivery System (reusable AI-delivery method)

**rs-ip is a blueprint, not a project.** It is a reusable, **project- and tool-agnostic** AI delivery
system — a curated set of **agents**, **skills**, **capabilities + adapters**, a **manifest schema**, and
method docs — that you *instantiate* per project. Nothing here is tied to a client, stack, repo, or tool;
`npm run check:agnostic` enforces that. A client's Ground Truth *content* never travels here; the
*method* does. "Each new build starts ahead, not from zero."

> **If you're an AI analyzing this repo:** this README is the index. There are three layers — the
> **agents** (`.claude/agents/`), the **binding layer + method** (`delivery-system/`), and the
> **Ground-Truth tooling/templates** (`templates/`, `tools/`, `docs/`). A project consumes this by running
> `delivery-system/install.mjs`, which copies the chosen agents and writes a `delivery.yml`. Agents are
> written against **abstract capabilities** (an "issue tracker", a "VCS", a "target environment"), never
> against a concrete tool — the project's `delivery.yml` binds those to GitHub / Jira / etc.

## The model: blueprint → instantiate

```
rs-ip (blueprint)                              a project (instance)
  .claude/agents/*            ── install ──▶    .claude/agents/*        (only the agents it chose)
  delivery-system/
    capabilities/*   abstract roles agents depend on
    adapters/*       generic tool bindings (github / jira / gitlab / slack / …)
    delivery.schema.md          ──────────▶    delivery.yml            (which tools, repo, envs)
    templates/CLAUDE.base.md    ──────────▶    CLAUDE.md               (the project operating guide)
    install.mjs                 ──────────▶    delivery-system.lock.json  (installed agent versions)
    provenance.md    versioning + sign-your-work standard
```

Swapping GitHub Issues for Jira is a one-line change in the project's `delivery.yml` — no agent edits.

## Repository map
| Path | What it is |
|------|-----------|
| `.claude/agents/` | the agents (see table below) |
| `.claude/skills/` | skills agents use — `ground-truth`, `qa-playwright` |
| `delivery-system/README.md` | the Delivery System overview (start here for the architecture) |
| `delivery-system/capabilities/` | abstract interfaces agents depend on: `issue-tracker`, `vcs`, `environments`, `notify` |
| `delivery-system/adapters/` | generic tool bindings: issue-tracker → github-issues / jira / linear; vcs → github / gitlab; notify → slack |
| `delivery-system/delivery.schema.md` + `delivery.example.yml` | the per-project manifest (lives in the *project*) |
| `delivery-system/install.mjs` | instantiate the blueprint into a target repo |
| `delivery-system/provenance.md` | versioning + "sign your work" standard |
| `delivery-system/templates/CLAUDE.base.md` | base operating guide a new project starts from |
| `templates/ground-truth/` | Ground Truth artifact templates + metadata schema |
| `tools/ground-truth/` | Ground Truth validator (`check.mjs`, `lib.mjs`) |
| `docs/` | method docs — `identifying-capabilities`, `spec-and-pr-conventions` |
| `pr/PULL_REQUEST_TEMPLATE.md` | canonical PR template (copied into each repo's `.github/`) |
| `explorer/SPEC.md` | the Ground Truth Explorer app spec |
| `scripts/` | `check-agnostic.mjs` (the agnosticism gate) + `agnostic-denylist.txt` |

## The agents
Every agent is **versioned** and **signs its work** (provenance). Each is read-only on the domain it
audits unless its job is to change code, and all of them follow the host repo's `CLAUDE.md` + PR workflow.

| Agent | Does |
|-------|------|
| `qa` | acceptance-driven exploratory QA — drives the running app, reports the gap vs the acceptance criteria |
| `design-qa` | design-fidelity QA — screenshots routes and diffs them against the design frames |
| `exploratory-qa` | functional QA — crawls the site and hunts broken / confusing things (no design oracle) |
| `issues-fixer` | resolves issues end-to-end (triage → fix → review → PR → merge → close) on the project's tracker + VCS |
| `capability-spec-writer` | generates/updates capability specs from approved Ground Truth |
| `eval-runner` | runs + extends the eval suite; the independent verifier (never fixes what it checks) |
| `ground-truth-guardian` | validates Ground Truth integrity (metadata, status, links, contradictions) |
| `agent-improver` | audits another agent's stamped outcomes, root-causes its misses, and PRs an improvement |

## How agents stay tool-agnostic
Agents reference **capabilities** (`delivery-system/capabilities/`), not tools. An **adapter**
(`delivery-system/adapters/`) maps each capability operation to a concrete tool; the project's
`delivery.yml` picks which adapter + the binding (repo, project key, channel, environments). To support a
new tool, add an adapter — the agents don't change.

## Provenance, versioning & the improvement loop
Every side-effecting action an agent takes is stamped `agent@version` (issue footers, commit trailers, PR
labels — see `delivery-system/provenance.md`). That makes the issue tracker and VCS a durable record of
*which agent (which version) did what*. The **`agent-improver`** reads those stamps, scores outcomes per
version (true vs false positive), clusters the misses by root cause, and opens a human-gated PR that
sharpens the agent — closing the loop.

## Principles
- **Project- and tool-agnostic.** Tools + locations live in the project's `delivery.yml`, never here.
- **Human-gated.** Agents propose; people approve. No auto-approve / skip-permissions by default.
- **Provenance.** Everything is stamped `agent@version` and attributable.
- **Ground Truth is the shared memory.** Specs, decisions, and delivery status persist on disk, so long
  runs and fresh subagents share one state (this is how the loop avoids context rot).
- **Discover before you build.** Before a task, check for an existing agent and surface it
  (see `delivery-system/templates/CLAUDE.base.md`).

## Instantiate in a new project
```bash
node delivery-system/install.mjs <target-repo> --agents=qa,design-qa,issues-fixer
```
It copies the chosen agents + the delivery-system reference docs into the target, writes a `delivery.yml`
(from the example — fill it in) and a `delivery-system.lock.json` recording installed agent versions.
Then start the project's `CLAUDE.md` from `delivery-system/templates/CLAUDE.base.md`.

## The delivery loop (orchestration — the layer we grow into)
A project moves through **spec → plan → build → verify → ship**, heavy work done by fresh-context
subagents, state persisted in Ground Truth. Today's agents cover spec (`capability-spec-writer`),
build/verify (`qa`, `design-qa`, `exploratory-qa`, `eval-runner`), fix (`issues-fixer`), integrity
(`ground-truth-guardian`), and the meta loop (`agent-improver`). An explicit end-to-end orchestrator is
the next addition. The phased loop, fresh-context subagents, and copy-in installer are informed by
spec-driven systems such as GSD — kept **human-gated + Ground-Truth-backed + provenance-stamped**.

## Promotion model
Templates, tooling, and the Explorer app start life inside a project and **graduate to rs-ip once proven
reusable — generalized (project specifics removed) on the way in.**

## Keeping the brain private (noted; not yet designed)
rs-ip can live in a **private** repo. Because projects **install by copy**, a project only ever receives
the specific agents it installs plus minimal reference docs — not rs-ip's full institutional knowledge.
A deeper "least-knowledge install / private brain" design is intentionally **deferred**; this note just
records that the current model already leans that way.

## Stay agnostic (enforced)
`npm run check:agnostic` fails if a project repo name, a `gt-NN…` / `BR-N` / `OQ-N` id, a decision number,
or a denylisted client/product term leaks in. Run it before promoting anything here, and extend
`scripts/agnostic-denylist.txt` with new client/product names.
