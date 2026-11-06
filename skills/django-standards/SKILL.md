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
