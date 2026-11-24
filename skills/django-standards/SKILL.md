# Django Standards

Django views must remain thin and delegate domain mutations to explicit service functions. ORM queries must prevent N+1 lookups at the queryset boundary.

## Models and Queries

- Use `select_related` and `prefetch_related` whenever traversing foreign keys.
- Wrap multi-step database writes inside `transaction.atomic()`.
- Commit generated schema migrations alongside every model change.

## Views and Settings

- Keep business rules in service or selector modules outside views and serializers.
- Read secrets and host settings from environment variables.
- Enforce permission checks on every view and API endpoint.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Map validated request values and authentication context to application inputs. Map use case results back to HTTP in the view.
- Put Django ORM queries and transaction boundaries in persistence adapters. Convert model instances to plain domain values before returning them.
- Test domain rules without Django settings or a database. Use Django tests for views and transaction behavior.
