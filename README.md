# gwrk-plugins

Official plugin registry for `gwrk`. All plugins validate against `AnyManifestSchema` and install via `gwrk plugin install <name>`.

## Agent CLI Backends

| Plugin | CLI Binary | Context File | Capabilities |
|---|---|---|---|
| `aider` | `aider` | `CONVENTIONS.md` | `code-editing`, `file-write`, `git-ops` |
| `cursor-agent` | `cursor-agent` | `.cursorrules` | `code-editing`, `shell-exec`, `file-write`, `test-runner`, `git-ops` |
| `opencode` | `opencode` | `AGENTS.md` | `code-editing`, `shell-exec`, `file-write`, `test-runner`, `git-ops` |
| `goose` | `goose` | `.goosehints` | `code-editing`, `shell-exec`, `file-write`, `test-runner`, `git-ops` |

Antigravity CLI (`agy`) ships with gwrk. If you installed the retired `gemini` backend, run `gwrk plugin remove gemini`. Run `gwrk init` in each affected project and select `agy`. Review old model pins against `agy models`.

## Model Discovery

Model catalogs describe availability on the current runner. They do not establish prompt compatibility or authorize promotion.

| Backend | Catalog refresh | Missing catalog |
|---|---|---|
| `aider` | Provider-prefixed `--list-models` queries | Supply concrete provider-qualified candidates |
| `opencode` | Project-local `opencode models` | Supply concrete provider-qualified candidates |
| `cursor-agent` | `--list-models` when advertised by `--help` | Supply concrete candidates without starting an agent |
| `goose` | Explicit runner candidates | Confirm the selected provider configuration |

Built-in Antigravity, Claude and Codex discovery belongs to gwrk core. External adapters forward an explicitly selected model ID. Manifest defaults remain compatibility aliases. They are not qualified model pins.

Use core qualification to test concrete candidates against versioned prompts and synthetic fixtures. Promotion requires deterministic gates and repeated runs. It also requires two independent frontier judges. Keep runner scope and observed identity with the evidence. Requalify after prompt or fixture changes. Tool and availability changes also require requalification.

Discovery and synthetic adapter tests here make no inference calls. They neither promote a model nor establish a live account allocation.

## Framework Enforcement Skills

| Plugin | Language | Framework | Scope |
|---|---|---|---|
| `nextjs-standards` | `TypeScript` | `Next.js` | `all` |
| `react-standards` | `TypeScript` | `React` | `all` |
| `fastify-standards` | `TypeScript` | `Fastify` | `all` |
| `express-standards` | `TypeScript` | `Express` | `all` |
| `fastapi-standards` | `Python` | `FastAPI` | `all` |
| `django-standards` | `Python` | `Django` | `all` |
| `gin-standards` | `Go` | `Gin` | `all` |
| `chi-standards` | `Go` | `Chi` | `all` |
| `axum-standards` | `Rust` | `Axum` | `all` |
| `clap-standards` | `Rust` | `Clap` | `all` |

## Review Strategy Plugins

| Plugin | Project Type | Focus |
|---|---|---|
| `review-api` | `api` | Route schemas, status codes, error envelopes, and auth boundaries |
| `review-library` | `library` | Public type exports, module entrypoints, and SemVer compatibility |
