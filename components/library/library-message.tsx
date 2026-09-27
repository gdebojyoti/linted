import type { ReactNode } from "react";

/** A single line in place of the Library, e.g. while it loads. */
export function LibraryMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex grow items-center justify-center px-4 pb-14 text-sm text-ink-muted">
      <p role="status">{children}</p>
    </main>
  );
}
