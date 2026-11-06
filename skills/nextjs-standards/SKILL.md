# Next.js Standards

Every Next.js route and component must default to React Server Components in the App Router. Client boundaries require an explicit `"use client"` directive at the leaf component.

## Routing and Rendering

- Place routes under `app/` using App Router conventions.
- Keep layouts and page roots as async Server Components.
- Push `"use client"` down to interactive leaf components.
- Validate route params and search params with Zod before use.

## Data Access and Mutations

- Fetch server data directly in Server Components or Server Actions.
- Do not call internal Next.js API routes from Server Components.
- Validate every Server Action payload with a strict schema before mutation.
- Revalidate affected paths or tags after mutations.
