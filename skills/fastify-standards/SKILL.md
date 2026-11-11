# Fastify Standards

Fastify services must validate every request and response schema at the route boundary. Route handlers call application use cases.

## Plugins and Encapsulation

- Register routes and decorators inside encapsulated Fastify plugins.
- Use `fastify-plugin` only when decorators must cross plugin boundaries.
- Configure structured Pino logging on the root Fastify instance.

## Validation and Error Handling

- Attach JSON Schema or TypeBox definitions for request inputs and `response` payloads.
- Return consistent HTTP problem responses through a central `setErrorHandler` hook.
- Support graceful shutdown by closing the Fastify server on `SIGINT` and `SIGTERM`.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Convert validated request data to use case inputs in handlers. Map application outcomes to the response schema at the route boundary.
- Assemble persistence and service adapters during server registration. Give use cases their dependencies through ports.
- Test domain rules with plain values. Use request injection tests for schema validation and response mapping.
