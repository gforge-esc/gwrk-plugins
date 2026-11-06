# Fastify Standards

Fastify services must validate every request and response schema at the route boundary. Route handlers delegate domain logic to pure application services.

## Plugins and Encapsulation

- Register routes and decorators inside encapsulated Fastify plugins.
- Use `fastify-plugin` only when decorators must cross plugin boundaries.
- Configure structured Pino logging on the root Fastify instance.

## Validation and Error Handling

- Attach JSON Schema or TypeBox definitions for request inputs and `response` payloads.
- Return consistent HTTP problem responses through a central `setErrorHandler` hook.
- Support graceful shutdown by closing the Fastify server on `SIGINT` and `SIGTERM`.
