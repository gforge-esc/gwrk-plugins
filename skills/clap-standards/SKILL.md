# Clap Standards

Clap CLIs must define argument structures with the `#[derive(Parser)]` macro and keep command execution separate from argument parsing. Standard output is reserved for primary command output.

## Argument Design

- Model subcommands with `#[derive(Subcommand)]` and shared flags with `#[command(flatten)]`.
- Use `PathBuf` for filesystem arguments and `ValueEnum` for constrained choices.
- Provide doc comments on every struct and field to generate `--help` text.

## Streams and Exit Codes

- Write primary data and `--json` payloads to `stdout` and diagnostics to `stderr`.
- Return `std::process::ExitCode` from `main` with distinct codes for usage and runtime errors.
- Test CLI parsing with `CommandFactory::debug_assert()` in unit tests.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Map parsed command variants to application inputs before invoking a use case. Format output and exit codes in the CLI.
- Construct filesystem and process adapters in the CLI entry point. Supply their traits to the use cases that perform those effects.
- Test domain decisions with plain Rust values. Test argument validation and exit codes at the CLI boundary.
