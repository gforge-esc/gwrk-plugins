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
