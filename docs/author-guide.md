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
entrypoint: ./SKILL.md
```

Agent manifests specify CLI capabilities and adapter paths.

```yaml
name: aider
version: 1.1.0
type: agent
description: Aider pair-programming CLI adapter
adapter: ./adapter.js
binary: aider
contextFile: CONVENTIONS.md
capabilities:
  - code-editing
  - file-write
  - git-ops
```

Do not invent a minimum-version manifest field or verified release status.

## Agent Adapter Contract

Agent backends export an adapter class implementing the agent port interface.

```javascript
export default class CustomAgentAdapter {
  constructor(executor) {
    this.executor = executor;
  }

  async execute(task, options) {
    const args = ["--non-interactive"];
    if (task.model) {
      args.push("--model", task.model);
    }
    return this.executor("custom-agent", args, options);
  }

  async discoverModels(context) {
    return [
      { modelId: "openai/gpt-6.1-sol", provider: "openai", family: "gpt" }
    ];
  }
}
```

The adapter normalizes exit codes to standard values. Supported codes include 0 and 1. They also include 2 and 127.

| Exit Code | Meaning |
|---|---|
| 0 | Successful execution |
| 1 | General execution failure |
| 2 | Test or verification failure |
| 127 | Command or binary not found |

The `discoverModels` method queries local runner catalogs. It must make zero inference calls.

## Framework Enforcement Skills

Framework skills must declare both `language` and `framework` properties.

The skill directory must contain `SKILL.md`. Guidance must enforce hexagonal architecture with a functional core.

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
