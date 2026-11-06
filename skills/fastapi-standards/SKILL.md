# FastAPI Standards

FastAPI endpoints must declare explicit Pydantic v2 request and `response_model` schemas. Blocking network or disk calls must never run inside `async def` handlers.

## Schemas and Dependencies

- Define separate Pydantic v2 models for request input and HTTP output.
- Keep domain state models separate from transport schemas.
- Inject external resources and auth context through `Depends()`.
- Group routes by domain using `APIRouter` with explicit tags and status codes.

## Concurrency and Lifecycle

- Use `async def` only with non-blocking async libraries.
- Use plain `def` for synchronous database or filesystem calls so FastAPI runs them in a threadpool.
- Manage startup and shutdown resources with an `asynccontextmanager` lifespan function.
