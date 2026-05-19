// React 19 ships its own types but the IDE can't resolve them in this
// pnpm workspace setup. Minimal shim to silence the false-positive error.
declare module 'react-dom/client' {
  import type { ReactNode } from 'react';
  interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }
  export function createRoot(
    container: Element | DocumentFragment,
    options?: { onRecoverableError?: (error: unknown) => void },
  ): Root;
  export function hydrateRoot(
    container: Element | Document,
    children: ReactNode,
    options?: { onRecoverableError?: (error: unknown) => void },
  ): Root;
}