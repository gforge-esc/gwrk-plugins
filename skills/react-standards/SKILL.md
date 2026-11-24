# React Standards

React components must derive state during render and avoid effect-driven synchronization. Every interactive element must use semantic HTML and accessible labels.

## Component Design

- Type component props with explicit TypeScript interfaces.
- Compute derived values during render instead of syncing state in `useEffect`.
- Reserve `useEffect` for synchronizing with external browser or network systems.
- Keep components single-purpose and extract custom hooks for external subscriptions.

## Accessibility and DOM

- Use native `<button>` and `<a>` elements for actions and navigation.
- Use native `<input>` and `<dialog>` elements before custom ARIA roles.
- Provide visible or accessible labels for every form control and icon button.
- Make sure every interactive control works with keyboard navigation alone.

## Hexagonal Architecture

Apply these rules when the project selects hexagonal architecture with a functional core.

- Treat components and hooks as presentation adapters. Pass typed inputs to application functions and map results to view state.
- Inject browser storage and network adapters at the application entry point. Keep domain transitions free of React state and browser APIs.
- Test domain transitions with plain values. Use component tests for interaction and accessible output.
