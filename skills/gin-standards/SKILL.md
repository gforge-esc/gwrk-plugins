# Gin Standards

Gin handlers must bind and validate payloads with `ShouldBind` methods and propagate `c.Request.Context()` into downstream calls. Handlers must never call `MustBind`.

## Handlers and Routing

- Group routes with `router.Group()` and attach auth middleware per route group.
- Use `c.ShouldBindJSON` or `c.ShouldBindQuery` and return structured `400` errors on failure.
- Pass `c.Request.Context()` to all database and RPC calls.

## Lifecycle and Concurrency

- Never pass `*gin.Context` into background goroutines without calling `c.Copy()`.
- Run the Gin engine inside an `http.Server` with explicit read and write timeouts.
- Shut down the server gracefully with `server.Shutdown(ctx)`.
