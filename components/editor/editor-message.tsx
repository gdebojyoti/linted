import type { ReactNode } from "react";

/**
 * Plain text in place of the editor, e.g. while the Resume loads. A stand-in
 * until these screens are designed. Screen readers read a "status" message
 * when they finish what they're saying, and an "alert" straight away.
 */
export function EditorMessage({
  role = "status",
  children,
}: {
  role?: "status" | "alert";
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-sm">
      <p role={role}>{children}</p>
    </main>
  );
}
