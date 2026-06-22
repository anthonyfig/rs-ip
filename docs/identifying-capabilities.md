# Identifying capabilities (rs-ip)

The single most common modeling mistake is calling a **page** (or a screen, an asset, a content
item) a **capability**. This is how we tell them apart — reusable across every project.

## The four levels
```
Platform                      the whole product
  └─ Capability               a business FUNCTION; a unit of value (a verb)
       └─ User Story           a behaviour/flow within it (Given/When/Then)
            operates on ↓
  Content (Domain Model)       the NOUNS: Page, Collection, Case Study, Post, Industry, Media…
```
Capabilities and user stories live in **Part 03**. Content (pages, collections, posts, assets) are
**entities in Part 02 (Domain Model)** — they are *operated on by* capabilities, they are not
capabilities.

## Litmus test — is it a capability?
A thing is a capability only if **all** of these hold:
1. **It's a function the system performs** — a verb (capture, publish, search, schedule, recommend,
   validate, measure), not a page/section (a noun).
2. **It's a unit of value** — you could scope, price, and deliver it on its own.
3. **It's made of multiple user stories** with acceptance criteria and evals.
4. **It's reusable across content** — the same function serves many pages/items.

> **Fast check:** *"Could two different pages share this?"* If **yes**, the page is **content** and
> the shared thing is the **capability**. *"Is it 'a page that shows X'?"* → that's **content**; its
> specifics are **user stories** under a content capability.

## Examples
| Looks like… | Actually is… | Why |
|---|---|---|
| "About page", "Careers page", "Home" | **Content** (a Page) presented by *Content Management & Publishing* | A page is a noun; many pages share the same rendering function |
| "Industries", "Case studies", "Insights" | **Content collections** presented by a content/portfolio/blog capability | A list of items; browse/filter/detail is the reusable function |
| Lead capture & qualification | **Capability** | A function (capture→qualify→route→schedule→notify); a unit of value; many stories |
| Search / navigation | **Capability** | A function reused across all content |
| SEO & LLM discoverability | **Capability** | A function the system performs over all pages |
| Ground Truth Explorer | **Capability** | Ask/Browse/Trace/Validate/Generate — a function |
| The brand logo, a color token | **Content / asset** (Design System) | An asset, not a function |

## Where things go
- **A new page?** It's **content** → a Page/Collection entity (Part 02), presented by an existing
  content capability; its page-specific behaviour (if any) is a **user story** under that capability.
- **A new function?** (e.g., "let users compare plans") → a **capability** (or a user story under
  one), with acceptance criteria + evals.

Sizing still applies (C1–C5). When in doubt, default to "this is content + a user story," not a new capability.
