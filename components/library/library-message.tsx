import type { ReactNode } from "react";

/**
 * A single line in place of the Library, e.g. while it loads. Screen readers
 * read a "status" message when they finish what they're saying, and an
 * "alert" (for errors) straight away.
 */
export function LibraryMessage({
  role = "status",
  children,
}: {
  role?: "status" | "alert";
  children: ReactNode;
}) {
  return (
    <main className="flex grow items-center justify-center px-4 pb-14 text-sm text-ink-muted">
      <p role={role}>{children}</p>
    </main>
  );
}
