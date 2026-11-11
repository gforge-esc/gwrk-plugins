# Axum Standards

Axum handlers must return typed `Result<T, AppError>` responses where `AppError` implements `IntoResponse`. Body-consuming extractors must appear last in handler signatures.

## Extractors and State

- Place `State` and `Path` extractors before `Json` or `Bytes`.
- Share application state via `State<AppState>` backed by `Arc` or cheap clones.
- Never call `.unwrap()` or `.expect()` inside request handlers.

## Concurrency and Observability

- Offload CPU-heavy or blocking work with `tokio::task::spawn_blocking`.
- Attach `tower_http::trace::TraceLayer` for structured request spans.
- Bind `axum::serve` with `with_graceful_shutdown` for clean termination.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Map Axum extractors to use case input types in handlers. Convert use case errors to HTTP responses in the handler layer.
- Build concrete store and clock adapters at startup. Put the application entry points in `AppState`.
- Test domain transitions without Tokio or Axum. Exercise request decoding and error mapping through the router.
