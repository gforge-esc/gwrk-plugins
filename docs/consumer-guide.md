# Consumer Guide

This guide explains how users and agents discover and install plugins. It covers configuration and health verification. It also covers policy overrides. Blocked: none.

## Links

| Resource | Location | Purpose |
|---|---|---|
| Hosted Portal | https://gwrk.gforge.ai | Project onboarding and dashboard |
| Core Repository | https://github.com/gforge-esc/gwrk | Core toolchain and issues |
| Releases | https://github.com/gforge-esc/gwrk/releases | Published release assets |
| Plugin Registry | https://github.com/gforge-esc/gwrk-plugins | Catalog repository |

## Navigation

- [Overview Readme](../README.md)
- [Plugin Author Guide](author-guide.md)

## Installing Plugins

Install plugins from the official registry using the plugin name.

```bash
gwrk plugin install aider
gwrk plugin install nextjs-standards
gwrk plugin install review-api
```

The CLI supports SemVer range constraints.

```bash
gwrk plugin install fastapi-standards@^1.0.0
```

You can install directly from a local path or a git repository.

```bash
gwrk plugin install ./local-pack
gwrk plugin install https://github.com/example/custom-plugin.git
```

Every installation records provenance metadata in `.gwrk-source.json`. It registers the version and SHA-256 digest in `~/.gwrk/plugins-lock.json`.

## Project Configuration

View active plugins for the current project using the project flag.

```bash
gwrk plugin list --project
```

Disable specific enforcement skills for a project using the disable command.

```bash
gwrk plugin disable nextjs-standards
```

The command writes the disabled plugin to `.gwrk/plugins.yaml`.

```yaml
disable:
  - skills/nextjs-standards
```

Re-enable the skill at any time.

```bash
gwrk plugin enable nextjs-standards
```

Enforcement skills support per-project disabling. Agent backends and atomic skills remain global.

## Integrity and Health Checks

Verify installed plugin integrity using the doctor command.

```bash
gwrk plugin doctor
```

The doctor command recomputes SHA-256 digests for all files. It compares the result with `~/.gwrk/plugins-lock.json`.

If files are modified or corrupted, the command reports an integrity mismatch.

```bash
gwrk plugin install aider --force
```

Use the force flag to reinstall and restore pristine files.

## Policy Selection and Architecture Rules

Core detects project languages and frameworks during initialization.

The runtime matches installed skills against project metadata. It activates matching framework packs automatically.

Framework skills compose with the selected project architecture. For hexagonal projects with a functional core, domain logic stays isolated from HTTP frameworks and database drivers. This guidance does not certify existing code conformance.

Project decision records in `docs/decisions/` compose directly with framework standards.

## Model Discovery

Discover candidate models across active agent backends using the models command.

```bash
gwrk models discover
```

The command inspects local runner configurations and CLI binaries. It makes no external inference calls.

Discovery lists available models on the current machine. It does not prove prompt compatibility or authorize route promotion.

Model promotion requires core qualification. Candidates must pass deterministic gates and repeated benchmark runs. Two independent frontier judges must approve the candidate before promotion.

## Retired Gemini Migration

The legacy Gemini CLI backend was retired. Projects must migrate to the Antigravity CLI backend (`agy`).

1. Remove the retired plugin: `gwrk plugin remove gemini`.
2. Run full project initialization: `gwrk init`.
3. Select `agy` as the active backend. Context-only initialization preserves agent settings and cannot perform this migration.
4. Review available models: `agy models`.

## Offline and Local Testing

You can direct gwrk to use a local plugin checkout.

```bash
export GWRK_REGISTRY_PATH="/path/to/gwrk-plugins"
```

The CLI reads `registry.json` from this path. It skips remote git operations and allows offline testing.
