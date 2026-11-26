# gwrk-plugins

The companion plugin registry extends gwrk with external agent adapters, polyglot framework enforcement packs and review strategies. It aligns with core candidate 1.6.0-beta.2. Blocked: none.

## Prominent Links

| Resource | Location | Purpose |
|---|---|---|
| Hosted Portal | https://gwrk.gforge.ai | Account access and project overview |
| Core Repository | https://github.com/gforge-esc/gwrk | Core gwrk engine and issue tracking |
| Core Releases | https://github.com/gforge-esc/gwrk/releases | Packaged tarballs and install receipts |
| Core Consumer Guide | https://github.com/gforge-esc/gwrk/blob/main/docs/site/getting-started.md | Target project runtime guidance |
| Core Agent Guide | https://github.com/gforge-esc/gwrk/blob/main/docs/site/agent-guide.md | Agent startup in a target project |

## Guides

- [Consumer Guide](docs/consumer-guide.md)
- [Plugin Author Guide](docs/author-guide.md)

## Core Builtins and External Plugins

| Layer | Core Builtins | External Registry |
|---|---|---|
| Agent Backends | agy, claude, codex | aider, cursor-agent, opencode, goose |
| Language Skills | 5 core standards | Extended language standards |
| Framework Skills | None | 10 framework enforcement packs |
| Review Strategies | review-cli, review-webapp | review-api, review-library |

Core ships bundled agent backends and baseline language skills. This companion repository maintains external adapters and framework enforcement packs.

## Plugin Management

Install plugins using the gwrk CLI.

```bash
gwrk plugin search <query>
gwrk plugin install <name>
gwrk plugin list
gwrk plugin doctor
gwrk plugin update [name]
gwrk plugin remove <name>
gwrk plugin disable <name>
gwrk plugin enable <name>
```

Command `gwrk plugin install` validates the manifest and verifies the SHA-256 digest against `registry.json`. It records metadata in `~/.gwrk/plugins-lock.json`.

Command `gwrk plugin doctor` verifies all installed manifests and confirms on-disk file digests against the lockfile.

Command `gwrk plugin disable` disables a plugin for the current project in `.gwrk/plugins.yaml`. Pass `-g` to disable globally.

## Policy Composition

The profile detector scans project files to identify languages and frameworks.

Core enforcement runtime filters skills using declared language and framework values. Project decision records in `docs/decisions/` compose alongside framework rules.

Framework packs supply guidance for the selected architecture. For hexagonal projects, domain logic stays isolated from external adapters. Installing a pack does not certify code conformance.

Project configuration in `.gwrk/plugins.yaml` supports disable lists and override mappings.

```yaml
disable:
  - skills/nextjs-standards
override:
  skills/react-standards: skills/custom-react-standards
```

## Registry Versions and Overrides

File `registry.json` tracks versions and paths. It records SHA-256 digests.

Core computes directory digests deterministically across plugin files. Excluded entries include `.git` and `node_modules`. They also exclude `.gwrk-source.json` and `.DS_Store`.

Generate the catalog with `gwrk plugin index [dir]`.

Set `GWRK_REGISTRY_PATH` to point to a local working tree. This bypasses git synchronization during local development.

```bash
export GWRK_REGISTRY_PATH="/path/to/gwrk-plugins"
```

## Model Discovery and Promotion

External adapters discover runner availability without making inference calls.

| Backend | Catalog Discovery | Missing Catalog Action |
|---|---|---|
| aider | Provider-prefixed queries | Supply concrete provider-qualified candidates |
| opencode | opencode models command | Supply concrete provider-qualified candidates |
| cursor-agent | list-models flag | Supply concrete candidates without starting agent |
| goose | Runner provider configuration | Confirm selected provider configuration |

Discovery describes local runner capability. It does not establish prompt compatibility or authorize model promotion.

Promoting a model requires core qualification. The qualification process demands deterministic gates and repeated evidence runs. Two independent frontier judges must approve the candidate before route lock promotion.

## Retired Gemini Migration

Core retired the Gemini CLI backend. Antigravity CLI (`agy`) ships bundled with gwrk core.

1. Remove the legacy plugin: `gwrk plugin remove gemini`.
2. Re-run initialization: `gwrk init` and select `agy`.
3. Verify available models: `agy models`.

## Core Compatibility

This repository requires gwrk core `1.6.0-beta.2` or candidate commit `bb15497bfeff881e4597972438e586ca98100b56`.

Published release `1.6.0-beta.1` from November 6 does not include new core contracts. It lacks policy selection and agent registry contracts. It also lacks model discovery.

Do not invent a minimum-version manifest field or verified release status.

## Registry Catalog

| Plugin | Type | Version | SHA-256 |
|---|---|---|---|
| aider | agent | 1.1.0 | e39a37ff39ef |
| cursor-agent | agent | 1.1.0 | 81c0e889d318 |
| goose | agent | 1.0.2 | f30f8df03f76 |
| opencode | agent | 1.1.0 | 53300b48da45 |
| axum-standards | skill | 1.1.0 | 8e6430980f4d |
| chi-standards | skill | 1.1.0 | b655af2811c4 |
| clap-standards | skill | 1.1.0 | 7e3805d4c5e4 |
| django-standards | skill | 1.1.0 | c7ec2f0ee25d |
| express-standards | skill | 1.1.0 | 4b5928b9c823 |
| fastapi-standards | skill | 1.1.0 | b3b4226bd282 |
| fastify-standards | skill | 1.1.0 | 77875a8fe9d4 |
| gin-standards | skill | 1.1.0 | 8b21a5c0555b |
| nextjs-standards | skill | 1.1.0 | 874b176c4e70 |
| react-standards | skill | 1.1.0 | fc5ae4e4504d |
| review-api | review | 1.0.0 | 8c0eadd7c0fa |
| review-library | review | 1.0.0 | 429355993d88 |
