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
