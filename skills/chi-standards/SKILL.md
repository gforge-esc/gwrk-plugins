# Chi Standards

Chi routers must use standard `http.Handler` signatures and typed context keys. Domain packages must remain independent of HTTP transport types.

## Routing and Middleware

- Compose sub-routers with `r.Route` and `r.Mount`.
- Register request ID and timeout middleware before route handlers.
- Use unexported struct types for `context.WithValue` keys to avoid collisions.

## Payloads and Errors

- Limit request body reads with `http.MaxBytesReader` before decoding JSON.
- Map domain errors to consistent HTTP status codes in a central responder helper.
- Configure `ReadHeaderTimeout` and `IdleTimeout` on the underlying `http.Server`.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Decode HTTP requests in Chi handlers and pass typed inputs to use cases. Keep request and response writers at the HTTP boundary.
- Construct persistence adapters when building the router. Pass Go interfaces to the use cases that consume them.
- Test domain transitions with table-driven tests. Use HTTP fixtures for status codes and response encoding.
