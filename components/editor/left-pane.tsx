import type { ReactNode } from "react";

/**
 * The box on the left of the editor, beside the preview. It holds the active
 * tab's panel, or the Content skeleton while loading, so the two line up.
 * There's no heading strip: the selected tab is the heading.
 */
export function LeftPane({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-100 max-w-160 w-1/3 shrink-0 flex-col border-r border-line bg-surface">{children}</div>
  );
}
