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
