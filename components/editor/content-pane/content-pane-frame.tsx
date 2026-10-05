import type { ReactNode } from "react";

/**
 * The Content pane's box and its header line, shared by the pane and its
 * loading skeleton so the two line up. `count` (e.g. "6 sections") is left
 * out while loading.
 */
export function ContentPaneFrame({ count, children }: { count?: string; children: ReactNode }) {
  return (
    <aside
      aria-label="Content"
      className="flex min-w-100 max-w-160 w-1/3 shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-line-soft px-6">
        <span className="text-[13px] font-semibold">Content</span>
        {count && <span className="text-xs text-ink-meta">{count}</span>}
      </div>
      {children}
    </aside>
  );
}
