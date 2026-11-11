# Express Standards

Express routes must validate incoming payloads via middleware before invoking business logic. Central error middleware handles all uncaught route failures.

## Routing and Middleware

- Mount domain routers in dedicated modules with `express.Router()`.
- Validate `req.body` and `req.params` with Zod before handler execution.
- Validate `req.query` schemas on every filtered route.
- Keep Express `Request` and `Response` types out of domain modules.

## Error Handling and Security

- Forward async errors to the central four-argument error middleware.
- Never leak stack traces or internal error messages in production responses.
- Set explicit body size limits on `express.json()` and `express.urlencoded()`.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Convert validated request data to use case inputs in route handlers. Map application outcomes to HTTP in the handler or error middleware.
- Pass persistence and service ports into use cases from the server entry point.
- Test domain rules with plain values and fake ports. Use HTTP tests for middleware order and response mapping.
