# Plugin Author Guide

This guide specifies how to author and package plugins for the gwrk ecosystem. It defines manifest schemas and adapter interfaces. It also defines catalog indexing. Blocked: none.

## Links

| Resource | Location | Purpose |
|---|---|---|
| Hosted Portal | https://gwrk.gforge.ai | Developer accounts and portal |
| Core Repository | https://github.com/gforge-esc/gwrk | Schema definitions and test harness |
| Releases | https://github.com/gforge-esc/gwrk/releases | Core release downloads |
| Plugin Registry | https://github.com/gforge-esc/gwrk-plugins | Catalog repository |

## Navigation

- [Overview Readme](../README.md)
- [Consumer Guide](consumer-guide.md)

## Directory Structure

Plugins reside in designated subdirectories by type.

| Type | Directory Path | Purpose |
|---|---|---|
| agent | agents/<name>/ | CLI agent execution adapter |
| skill | skills/<name>/ | Coding and architecture standards |
| review | reviews/<name>/ | Review strategies |
| workflow | workflows/<name>/ | Operational workflow prompts |

Every plugin directory must contain a valid `manifest.yaml`.

## Manifest Specification

The manifest defines identity and runtime metadata.

```yaml
name: fastapi-standards
version: 1.1.0
type: skill
tier: enforcement
description: FastAPI Pydantic v2 validation and route standards
language: Python
framework: FastAPI
scope: all
```

Agent manifests specify CLI capabilities and adapter paths.

```yaml
type: agent
name: aider
version: 1.1.0
description: Aider pair-programming CLI adapter
adapter: ./adapter.js
dispatchMode: local-cli
contextFileName: CONVENTIONS.md
invocation:
  command: aider
  args: ["--yes-always", "--no-auto-commits", "--no-pretty", "--message-file", "-"]
  headlessFlag: "--message-file"
  yoloFlag: "--yes-always"
capabilities:
  - code-generation
  - refactoring
  - git-aware-editing
models:
  default: sonnet
  fast: haiku
  pro: opus
exitCodeMap:
  "0":
    exitCode: 0
  "1":
    exitCode: 1
    errorType: gate_failure
  "2":
    exitCode: 2
    errorType: usage_error
  "127":
    exitCode: 127
    errorType: not_found
managedConfig: []
```

Do not invent a minimum-version manifest field or verified release status.

## Agent Adapter Contract

External agent plugins implement the core [AgentBackend contract](https://github.com/gforge-esc/gwrk/blob/main/src/plugins/agent-backend.ts). Use the complete [Aider adapter](../agents/aider/adapter.js) and its [manifest](../agents/aider/manifest.yaml) as a working example.

The loader accepts an exported adapter instance or a class with a zero-argument constructor. Both named and default exports are supported. Required behavior includes:

| Member | Responsibility |
|---|---|
| `name` | Stable backend identifier |
| `isAvailable()` | Probe CLI installation without inference |
| `contextFileName` | Governance context filename |
| `syncGovernance(projectRoot, governance)` | Write project governance for the backend |
| `dispatch(task)` | Return command, arguments, stdin and environment |
| `parseResult(stdout, stderr, rawExitCode, durationMs)` | Normalize the CLI result |
| `discoverModels(context)` | Optional catalog discovery without inference |

`dispatch` describes an invocation. It does not launch a process. WorkflowRuntime owns task execution. The application-facing `AgentPort` wraps routing and execution and is not the external adapter contract.

Forward an explicitly selected model through `dispatch`. Declare `supportsModelForwarding` when appropriate. Preserve runner scope and observed identity in discovery and qualification evidence. Manifest aliases do not establish qualified model pins.

The adapter normalizes raw exits using its manifest. In the Aider example, 0 means success, 1 maps to gate failure, 2 maps to usage error and 127 maps to a missing binary. Other backends must map their actual CLI semantics. Use synthetic tests rather than live inference to verify the mapping.

## Framework Enforcement Skills

Framework skills must declare both `language` and `framework` properties.

The skill directory must contain `SKILL.md`. Guidance must compose with the project architecture. Include hexagonal and functional-core rules for projects that select that target.

Rules must forbid mixing transport logic with business domain entities. Database models must not leak into HTTP route handlers.

## Testing and Verification

Verify adapters using Node test runner.

```bash
node --test tests/*.test.mjs
```

Use synthetic execution functions to assert arguments and environment variables. Do not execute live models or billable API calls during verification.

## Indexing the Registry

Generate or update the catalog file using the index command.

```bash
gwrk plugin index .
```

The command scans plugin directories and validates each manifest. It computes deterministic SHA-256 digests across all files.

The resulting `registry.json` publishes version records for consumers.
